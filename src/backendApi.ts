import WebSocket, { RawData } from "ws";
import { v4 as uuidv4 } from "uuid";
import DeferredPromise from "promise-deferred";

export type InitAgentManagerParams = {
  timeout?: number;
};

export type InitExternalRepoParams = {
  repo_dir: string;
  model_name?: string;
  timeout?: number;
};

export type GenerateSubtasksParams = {
  objective: string;
};

export type RunSubtaskParams = {
  subtask: string;
};

export type AskRepoParams = {
  query: string;
};

export type ToggleExternalRepoParams = {
  agent_id: string;
};

export type WebRaiderQueryParams = {
  user_query: string;
};

export type RequestMethod =
  | "init_agent_manager"
  | "init_external_repo_agent"
  | "get_external_repo_agents"
  | "generate_subtasks"
  | "run_subtask"
  | "ask_repo"
  | "generate_commands"
  | "disable_external_repo_agent"
  | "enable_external_repo_agent"
  | "query"
  | "undo"
  | "shutdown";

export type RequestParams =
  | InitAgentManagerParams
  | InitExternalRepoParams
  | GenerateSubtasksParams
  | RunSubtaskParams
  | AskRepoParams
  | ToggleExternalRepoParams
  | WebRaiderQueryParams;

export type Request = {
  main_repo_dir: string;
  method: RequestMethod;
  params?: RequestParams;
};

export type Subtask = {
  task_type: "User action" | "Command execution" | "Coding";
  task_body: string;
};

export type WebRaiderResult = {
  type: "github" | "gitlab" | "bitbucket" | "gitee";
  name: string;
  url: string;
};

export class Backend {
  sessionId: string;
  workspaceDir: string;

  isOpen: boolean = false;

  serverPort: number = 10000;

  expectingResponse: boolean = false;
  responding: boolean = false;

  currentGeneration: string = "";

  currentPromise: DeferredPromise.Deferred<string> | null = null;

  onCloseAction: () => void = () => {};

  onMessageAction: (self: this, message: any) => void = (_, __) => {};

  serverRoute(): string {
    return `ws://localhost:${this.serverPort}/ws/${this.sessionId}`;
  }

  ws: WebSocket | null = null;

  constructor(workspaceDir: string, onCloseAction = () => {}) {
    this.sessionId = uuidv4();
    this.workspaceDir = workspaceDir;
    this.start();
    this.onCloseAction = onCloseAction;
  }

  start() {
    this.isOpen = false;
    this.expectingResponse = false;
    this.responding = false;
    this.currentGeneration = "";
    this.currentPromise = null;

    this.ws = new WebSocket(this.serverRoute());

    let _self = this;

    this.ws.on("open", () => {
      this.onOpen(_self);
    });
    this.ws.on("close", () => {
      this.onClose(_self);
    });
    this.ws.on("message", (data: RawData) => {
      // console.log(`raider-chat 0: ${data}`);

      function processData(data: any) {
        return JSON.parse(
          Object.getOwnPropertyNames(data)
            .map((value) => {
              return String.fromCharCode(data[value]);
            })
            .join("") || "{}"
        );
      }

      this.processMessage(_self, processData(data));
    });
  }

  createPromise(): DeferredPromise.Deferred<string> {
    return new DeferredPromise<string>();

    // return new Promise<string>((resolve, reject) => {
    //   let interval = setInterval(() => {
    //     if (!this.expectingResponse && !this.responding) {
    //       let generation = this.currentGeneration;
    //       this.currentGeneration = "";
    //       console.log(`raider-chat stopping, generated ${generation}`);
    //       resolve(generation);
    //       clearInterval(interval);
    //     }
    //   }, 500);
    // });
  }

  processMessage(self: this, message: any) {
    if ("<PING>" in message) {
      // console.log("raider-chat pinged");
      return;
    }

    // if (isEquivalent(message, keepAlivePing)) return;
    if ("<END_OF_MESSAGE>" in message) {
      //|| isEquivalent(message, endOfMessageResponse)) {
      // console.log("raider-chat end of message hit woohoo");
      console.log(
        `raider-chat end of message generated ${self.currentGeneration}`
      );
      self.responding = false;
      self.expectingResponse = false;

      let generation = self.currentGeneration;
      self.currentGeneration = "";
      self.currentPromise?.resolve(generation);
      return;
    }

    console.log(
      `raider-chat 3: ${message} ${Object.getOwnPropertyNames(
        message
      )} ${typeof message} ${JSON.stringify(message)}`
    );

    self.responding = true;

    self.onMessageAction(self, message);
  }

  async sendMsg(
    method: RequestMethod,
    params: RequestParams | undefined = undefined,
    onMessageAction: (self: this, message: any) => void = (_, __) => {}
  ): Promise<string> {
    if (this.ws === null) throw Error("raider-chat: disconnected!");
    console.log(`raider-chat: ws is not null, running ${method}`);
    await this.currentPromise;
    console.log(`raider-chat: awaited previous promise which never closed!`);
    this.onMessageAction = onMessageAction;
    this.ws.send(
      JSON.stringify({
        main_repo_dir: this.workspaceDir,
        method,
        params,
      } as Request)
    );
    this.expectingResponse = true;
    this.currentPromise = this.createPromise();
    return await this.currentPromise.promise;
  }

  async initAgentManager(timeout: number = 60) {
    await this.sendMsg("init_agent_manager", {
      timeout,
    } as InitAgentManagerParams);
  }

  async initExternalRepo(
    repoDir: string,
    modelName: string = "azure/gpt4o",
    timeout: number = 60
  ) {
    await this.sendMsg("init_external_repo_agent", {
      repo_dir: repoDir,
      model_name: modelName,
      timeout,
    } as InitExternalRepoParams);
  }

  async getExternalRepoAgents(): Promise<string[]> {
    let response = await this.sendMsg(
      "get_external_repo_agents",
      undefined,
      (self, message) => {
        if ("error" in message) {
          self.currentGeneration = JSON.stringify(message["error"]);
        } else if ("result" in message) {
          self.currentGeneration = JSON.stringify(message["result"]);
        }
      }
    );
    return JSON.parse(response || "[]") as string[];
  }

  async disableExternalRepoAgent(agent_id: string): Promise<void> {
    await this.sendMsg("disable_external_repo_agent", {
      agent_id,
    } as ToggleExternalRepoParams);
  }

  async enableExternalRepoAgent(agent_id: string): Promise<void> {
    await this.sendMsg("enable_external_repo_agent", {
      agent_id,
    } as ToggleExternalRepoParams);
  }

  async webRaiderQuery(user_query: string): Promise<WebRaiderResult[]> {
    let response = await this.sendMsg(
      "query",
      { user_query },
      (self, message) => {
        if ("error" in message) {
          self.currentGeneration += JSON.stringify(message["error"]);
        } else if ("result" in message) {
          self.currentGeneration += JSON.stringify(message["result"]);
        }
      }
    );
    console.log(
      `raider-chat web-raider response ${response} ${typeof response} ${JSON.stringify(
        response
      )} ${JSON.parse(response || "[]")}`
    );
    return JSON.parse(response || "[]") as WebRaiderResult[];
  }

  async generateSubtasks(objective: string): Promise<Subtask[]> {
    let response = await this.sendMsg(
      "generate_subtasks",
      { objective },
      (self, message) => {
        if ("error" in message) {
          self.currentGeneration = JSON.stringify(message["error"]);
        } else if ("result" in message) {
          self.currentGeneration = JSON.stringify(message["result"]);
        }
      }
    );
    return JSON.parse(response || "[]") as Subtask[];
  }

  async runSubtask(
    subtask: string,
    onChunk: (chunk: string) => void = () => {}
  ): Promise<string> {
    return await this.sendMsg("run_subtask", { subtask }, (self, message) => {
      if ("error" in message) {
        self.currentGeneration += JSON.stringify(message["error"]);
      } else if ("result" in message) {
        self.currentGeneration += message["result"];
        onChunk(message["result"]);
      }
    });
  }

  async askRepo(
    query: string,
    onChunk: (chunk: string) => void = () => {}
  ): Promise<string> {
    return await this.sendMsg("ask_repo", { query }, (self, message) => {
      if ("error" in message) {
        self.currentGeneration += JSON.stringify(message["error"]);
      } else if ("result" in message) {
        self.currentGeneration += message["result"];
        onChunk(message["result"]);
      }
    });
  }

  onOpen(self: this) {
    self.isOpen = true;
    console.log(`Connected to server`);
    self.initAgentManager();
  }

  onClose(self: this) {
    self.isOpen = false;
    self.onCloseAction();
    console.log("Disconnected from server");
    this.ws = null;
  }

  async open() {
    await new Promise<void>((resolve, reject) => {
      setInterval(() => {
        if (this.isOpen) resolve();
      });
    });
  }

  async close() {
    await this.sendMsg("shutdown");
    await new Promise<void>((resolve, reject) => {
      setInterval(() => {
        if (!this.isOpen) resolve();
      });
    });
  }
}
