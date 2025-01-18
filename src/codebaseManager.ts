import fs from "node:fs/promises";
import path from "node:path";
import { exists } from "./util";
import { Backend } from "./backendApi";
// import cp from "child_process";

export class Codebase {
  uri: string;
  type: "local" | "github" | "gitlab" | "bitbucket" | "gitee";

  constructor(
    uri: string,
    type: "local" | "github" | "gitlab" | "bitbucket" | "gitee" | null = null
  ) {
    if (type === null) {
      if (uri.includes("github.com")) {
        type = "github";
      } else if (uri.includes("gitlab.com")) {
        type = "gitlab";
      } else if (uri.includes("bitbucket.io")) {
        type = "bitbucket";
      } else if (uri.includes("gitee.com")) {
        type = "gitee";
      } else type = "local";
    }
    this.uri = uri;
    this.type = type;
  }
}

export class LocalCodebase extends Codebase {
  type = "local" as "local";

  constructor(uri: string | LocalCodebase) {
    super(typeof uri === "string" ? uri : uri.uri, "local");
  }
}

export type CodebaseManagerData = {
  codebases: string[];
  storagePath: string;
  jsonPath: string;
};

export class CodebaseManager {
  codebases: LocalCodebase[] = [];
  storagePath: string;
  jsonPath: string;

  backendInstance: Backend;

  constructor(storagePath: string, backendInstance: Backend) {
    this.codebases = [];

    this.storagePath = storagePath; // path.join(storagePath, ".raider");
    this.jsonPath = path.join(this.storagePath, "codebases.json");

    this.backendInstance = backendInstance;

    // this.loadFromStorage();
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
      let codebases = JSON.parse(data) as CodebaseManagerData;
      this.codebases = codebases.codebases.map(
        (uri: string) => new LocalCodebase(uri)
      );
      this.storagePath = codebases.storagePath;
      this.jsonPath = codebases.jsonPath;
    } else {
      await fs.writeFile(
        this.jsonPath,
        JSON.stringify({
          codebases: [] as string[],
          storagePath: this.storagePath,
          jsonPath: this.jsonPath,
        } as CodebaseManagerData),
        "utf8"
      );
    }
  }

  async add(uri: string) {
    let codebase = new LocalCodebase(uri);
    await this.backendInstance.initExternalRepo(codebase.uri);
    this.codebases.push(codebase);
    // codebase.initGit();
  }

  remove(uri: string) {
    this.codebases = this.codebases.filter((it) => it.uri !== uri);
  }

  export(): CodebaseManagerData {
    return {
      codebases: this.codebases.map((it) => it.uri),
      storagePath: this.storagePath,
      jsonPath: this.jsonPath,
    };
  }

  async getAllCodebases(): Promise<string[]> {
    // let codebases = await this.backendInstance.getExternalRepoAgents();
    return this.codebases.map((it) => it.uri);
    // return codebases;
  }

  async save(): Promise<boolean> {
    try {
      await fs.writeFile(this.jsonPath, JSON.stringify(this.export()), "utf8");
      return true;
    } catch {
      return false;
    }
  }
}
