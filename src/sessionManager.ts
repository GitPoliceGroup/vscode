import { v4 as uuid4 } from "uuid";
import fs from "node:fs/promises";
import path from "node:path";
import { Message } from "./viewApi";
import { exists } from "./util";

export class SessionNotFoundError extends Error {
  sessionId: string;
  constructor(sessionId: string) {
    super(`${sessionId} not found.`);

    this.sessionId = sessionId;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, SessionNotFoundError.prototype);
  }
}

export type SessionData = {
  id: string;
  messages: Message[];
  lastUpdated: Date | null | string;
};

export class Session {
  static storageDir: string = "";

  readonly id: string;
  messages: Message[];

  fileExists: boolean;
  savedToFile: boolean;

  lastUpdated: Date | null = null;

  constructor(id: string) {
    this.id = id;
    this.messages = [];

    this.fileExists = false;
    this.savedToFile = false;

    this.read().then((data) => {
      if (data !== null) {
        this.messages = data.messages;
        this.savedToFile = true;
        this.lastUpdated =
          data.lastUpdated instanceof Date
            ? data.lastUpdated
            : data.lastUpdated == null
            ? null
            : new Date(data.lastUpdated as string);
      }
    });
  }

  length(): number {
    return this.messages.length;
  }

  reset(): boolean {
    this.messages.length = 0;
    return this.messages.length === 0;
  }

  message(role: string, content: string) {
    this.messages.push({ role, content });
    this.lastUpdated = new Date();
  }

  static async setStorage(dir: string): Promise<boolean> {
    // dir = path.join(dir, ".raider");
    let flag = await exists(dir);
    if (!flag) {
      await fs.mkdir(dir);
    }

    this.storageDir = dir;
    return this.storageDir == dir;
  }

  getFilePath(): string {
    return path.join(Session.storageDir, `${this.id}.json`);
  }

  async read(): Promise<SessionData | null> {
    let filePath = this.getFilePath();
    let flag = await exists(filePath);
    if (flag) {
      let sessionData = JSON.parse(
        await fs.readFile(filePath, "utf8")
      ) as SessionData;
      return sessionData;
    }
    return null;
  }

  setMessages(messages: Message[]) {
    let changed =
      messages.length === this.messages.length &&
      this.messages.every(
        (message, index) =>
          message.role === messages[index].role &&
          message.content === messages[index].content
      );
    this.savedToFile = this.savedToFile && changed;
    if (!changed) this.messages = messages;
  }

  updateLastResponse(content: string) {
    let message = this.messages.pop() || { role: "assistant", content: "" };
    message.content += content;
    this.messages.push(message);
  }

  sessionExport(): SessionData {
    return {
      id: this.id,
      messages: this.messages,
      lastUpdated: this.lastUpdated,
    };
  }

  async save(): Promise<boolean> {
    try {
      await fs.writeFile(
        this.getFilePath(),
        JSON.stringify(this.sessionExport()),
        "utf8"
      );
      this.fileExists = true;
      this.savedToFile = true;
      return true;
    } catch {
      return false;
    }
  }
}

export type SessionManagerData = {
  sessions: string[];
  currentSession: string | null;
  storagePath: string;
  jsonPath: string;
};

export class SessionManager {
  sessions = {} as { [index: string]: Session };
  currentSession: string | null = null;

  storagePath: string;
  jsonPath: string;

  constructor(storagePath: string) {
    this.storagePath = storagePath; //path.join(storagePath, ".raider");
    this.jsonPath = path.join(this.storagePath, "sessions.json");
    Session.storageDir = this.storagePath;
  }

  async saveToStorage(): Promise<boolean> {
    try {
      let savedSessions = this.getSessions().map((it) => it.id);
      await fs.writeFile(
        this.jsonPath,
        JSON.stringify({
          sessions: savedSessions,
          currentSession: this.currentSession,
          storagePath: this.storagePath,
          jsonPath: this.jsonPath,
        } as SessionManagerData),
        "utf8"
      );

      for (let key in savedSessions) {
        console.log(`raider saving session history ${savedSessions[key]} now`);
        await this.sessions[savedSessions[key]].save();
      }
      return true;
    } catch (e) {
      console.log(
        `raider saved session history, error ${
          typeof e === "string" ? e : e instanceof Error ? e.message : ""
        }`
      );
      return false;
    }
  }

  async loadFromStorage() {
    let flag = await exists(this.storagePath);

    if (!flag) {
      await fs.mkdir(this.storagePath);
    }
    let flag2 = await exists(this.jsonPath);

    if (flag2) {
      // file exists
      let data = await fs.readFile(this.jsonPath, "utf8");
      let sessions = JSON.parse(data);
      this.sessions = (sessions.sessions ?? [])
        .map((it: any) => new Session(it))
        .reduce(
          (prev: any, it: any) => ({
            ...prev,
            [it.id]: it,
          }),
          {} as { [index: string]: Session }
        );
      this.currentSession = sessions.currentSession;
      // this.sessions = sessions;
      // this.currentSession = sessions.currentSession;
      // this.storagePath = this.storagePath;
      // this.jsonPath = this.jsonPath;
    } else {
      // file does not exist
      await fs.writeFile(
        this.jsonPath,
        JSON.stringify({
          sessions: [],
          currentSession: null,
          storagePath: this.storagePath,
          jsonPath: this.jsonPath,
        } as SessionManagerData),
        "utf8"
      );
    }
  }

  getSessionIds(): string[] {
    return Object.keys(this.sessions);
  }

  numSessions(): number {
    return this.getSessionIds().length;
  }

  getSessions(): {
    id: string;
    messages: Message[];
    lastUpdated: Date;
  }[] {
    return (
      Object.values(this.sessions)
        // .map((it) => it.sessionExport())
        .filter((it) => it.messages.length > 0 && it.lastUpdated != null)
        .sort((a, b) => {
          if ((a.lastUpdated ?? new Date()) < (b.lastUpdated ?? new Date())) {
            return 1;
          } else {
            return -1;
          }
        })
        .map(({ id, messages, lastUpdated }) => ({
          id: id,
          messages: messages,
          lastUpdated: lastUpdated ?? new Date(),
        }))
    );
  }

  getCurrentSession(): Session {
    if (this.currentSession && this.isSession(this.currentSession)) {
      return this.sessions[this.currentSession];
    } else {
      let ids = this.getSessionIds();
      if (ids.length > 0) {
        this.currentSession = ids[ids.length - 1];
        return this.sessions[this.currentSession];
      } else {
        let sessionId = this.newSession();
        this.currentSession = sessionId;
        return this.sessions[sessionId];
      }
    }
  }

  openSession(sessionId: string = "") {
    if (sessionId.length == 0) {
      sessionId = this.newSession();
    } else if (!this.isSession(sessionId)) {
      this.newSession(sessionId);
    }
    this.currentSession = sessionId;
  }

  newSession(sessionId: string = ""): string {
    // let sessionId: string;
    if (sessionId.length == 0) {
      while ((sessionId = uuid4()) in this.sessions) {}
    }
    this.sessions[sessionId] = new Session(sessionId);
    return sessionId;
  }

  deleteSession(sessionId: string) {
    delete this.sessions[sessionId];
    if (this.currentSession == sessionId) {
      this.currentSession = null;
    }
    this.saveToStorage();
  }

  isSession(sessionId: string): boolean {
    return sessionId in this.sessions;
  }

  getSession(sessionId: string): Message[] {
    if (this.isSession(sessionId)) {
      return this.sessions[sessionId].messages;
    } else {
      throw new SessionNotFoundError(sessionId);
    }
  }
}
