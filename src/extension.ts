import * as vscode from "vscode";
import { ViewKey } from "./views";
import { registerView } from "./registerView";
import {
  Message,
  SearchResult,
  ViewApi,
  ViewApiError,
  ViewApiEvent,
  ViewApiRequest,
  ViewApiResponse,
  ViewEvents,
} from "./viewApi";
// import fs from "node:fs/promises";
import { SessionManager } from "./sessionManager";
import { CodebaseManager } from "./codebaseManager";
import { Backend } from "./backendApi";
import DeferredPromise from "promise-deferred";
// import { shuffle } from "./util";

let sessionManager: SessionManager | null = null;
let codebaseManager: CodebaseManager | null = null;

export const activate = async (ctx: vscode.ExtensionContext) => {
  const connectedViews: Partial<Record<ViewKey, vscode.WebviewView>> = {};

  let currentPage = "chat";

  // const messages = [] as Message[];

  // const currentSessionId = uuid

  const triggerEvent = <E extends keyof ViewEvents>(
    key: E,
    ...params: Parameters<ViewEvents[E]>
  ) => {
    Object.values(connectedViews).forEach((view) => {
      view.webview.postMessage({
        type: "event",
        key,
        value: params,
      } as ViewApiEvent<E>);
    });
  };

  const backend = new Backend(
    vscode.workspace.workspaceFolders
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : "",
    () => {
      triggerEvent("disconnectServer");
    }
  );
  sessionManager = new SessionManager(ctx.storageUri?.fsPath || "");
  await sessionManager.loadFromStorage();
  codebaseManager = new CodebaseManager(ctx.storageUri?.fsPath || "", backend);
  await codebaseManager.loadFromStorage();

  const api: ViewApi = {
    restartServer: () => {
      if (!backend.isOpen) backend.start();
    },

    generateSubtasks: async (objective) => {
      let subtasks = await backend.generateSubtasks(objective);

      return subtasks;
    },

    runSubtask: async (subtask) => {
      return await backend.runSubtask(subtask, (chunk) => {
        triggerEvent("sendChunk", chunk);
      });
    },

    askRepo: async (query) => {
      let resp = await backend.askRepo(query, (chunk) => {
        triggerEvent("sendChunk", chunk);
      });
      console.log(`raider-chat asked repo and got ${resp}`);
      return resp;
    },

    // runSubtask: async function* (subtask) {
    //   // yield "Running Subtask...";

    //   let currentPromise: DeferredPromise.Deferred<string> | null =
    //     new DeferredPromise<string>();

    //   backend
    //     .runSubtask(subtask, (chunk) => {
    //       sessionManager.getCurrentSession().updateLastResponse(chunk);
    //       triggerEvent("sendChunk", chunk);
    //       currentPromise?.resolve(chunk);
    //       currentPromise = new DeferredPromise<string>();
    //     })
    //     .then((final) => {
    //       sessionManager.getCurrentSession().updateLastResponse(final);
    //       currentPromise = null;
    //     });

    //   while (currentPromise !== null) {
    //     yield await currentPromise.promise;
    //   }
    // },

    updateLastMessage: async function (content: string) {
      if (sessionManager != null) {
        sessionManager.getCurrentSession().updateLastResponse(content);
        triggerEvent(
          "sendMessages",
          sessionManager.getCurrentSession().messages
        );
      }
    },

    sendMessage: async function (msg: Message) {
      if (sessionManager != null) {
        sessionManager.getCurrentSession().message(msg.role, msg.content);
        triggerEvent(
          "sendMessages",
          sessionManager.getCurrentSession().messages
        );
        await sessionManager.saveToStorage();
      }
      // let output = "Thinking...\n\n";

      // // yield output;

      // sessionManager.getCurrentSession().message("assistant", output);
      // triggerEvent("sendMessages", sessionManager.getCurrentSession().messages);

      // console.log("appended messages, calling generate now");

      // let subtasks = await backend.generateSubtasks(msg.content);

      // console.log("generated subtasks successfully");

      // if (subtasks.length == 0) {
      //   let sorryOutput =
      //     "RAiDer was unable to formulate a plan based on the provided codebase and prompt. This most likely means that the functionality is already implemented and is hence unnecessary for us to update.";
      //   output += sorryOutput;
      //   sessionManager.getCurrentSession().updateLastResponse(output);
      //   triggerEvent(
      //     "sendMessages",
      //     sessionManager.getCurrentSession().messages
      //   );
      //   // yield sorryOutput;
      //   return;
      // }

      // let subtaskGeneration = `Generated Subtasks:\n\n${subtasks
      //   .map((value, idx) => `${idx + 1}. ${value}`)
      //   .join("\n")}\n`;

      // output += subtaskGeneration;
      // sessionManager.getCurrentSession().updateLastResponse(output);
      // triggerEvent("sendMessages", sessionManager.getCurrentSession().messages);

      // yield subtaskGeneration;

      // console.log("Updated chat history, running subtasks individually rn");

      //yield subtaskGeneration;

      // for (let i = 0; i < subtasks.length; i++) {
      //   console.log(`Running Subtask ${i + 1}`);
      //   output += `\nRunning Subtask ${i + 1}...\n`;
      //   sessionManager.getCurrentSession().updateLastResponse(output);
      //   triggerEvent(
      //     "sendMessages",
      //     sessionManager.getCurrentSession().messages
      //   );
      //   //yield `\nRunning Subtask ${i + 1}...\n`;
      //   yield `\nRunning Subtask ${i + 1}...\n`;

      //   let subtaskOutput = await backend.runSubtask(subtasks[i]);
      //   output += subtaskOutput;
      //   sessionManager.getCurrentSession().updateLastResponse(output);
      //   triggerEvent(
      //     "sendMessages",
      //     sessionManager.getCurrentSession().messages
      //   );
      //   //yield subtaskOutput;
      // }

      // output += `\n\nCompleted ${subtasks.length} Tasks.`;
      // sessionManager.getCurrentSession().updateLastResponse(output);
      // triggerEvent("sendMessages", sessionManager.getCurrentSession().messages);
    },
    getMessages: () => {
      // console.log(sessionManager.sessions);
      // console.log(JSON.stringify(sessionManager.sessions));
      // console.log(sessionManager.getCurrentSession());
      // console.log(sessionManager.getCurrentSession().messages);
      // console.log(JSON.stringify(sessionManager.getCurrentSession()));
      return sessionManager != null
        ? sessionManager.getCurrentSession().messages
        : [];
    },
    getSessions: () => {
      return sessionManager != null ? sessionManager.getSessions() : [];
    },
    resetMessageHistory: () => {
      if (sessionManager != null) {
        sessionManager.getCurrentSession().reset();
        triggerEvent(
          "sendMessages",
          sessionManager.getCurrentSession().messages
        );
      }
    },
    newSession: () => {
      triggerEvent("showPage", "chat");
      currentPage = "chat";
      if (sessionManager != null) {
        sessionManager.openSession();
      }
    },
    deleteSession: (sessionId: string) => {
      if (sessionManager != null) {
        sessionManager.deleteSession(sessionId);
        triggerEvent("sendHistory", sessionManager.getSessions());
      }
    },
    openSessionChat: async (sessionId: string) => {
      if (sessionManager != null) {
        sessionManager.openSession(sessionId);
        triggerEvent("showPage", "chat");
        currentPage = "chat";
        triggerEvent(
          "sendMessages",
          sessionManager.getCurrentSession().messages
        );
      }
    },

    getCodebases: async () => {
      if (codebaseManager != null) {
        return await codebaseManager.getAllCodebases();
      } else return [];
    },

    openAddCodebase: async () => {
      const uris = await vscode.window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        openLabel: "Select folder",
        title: "Select folder",
      });

      if (uris?.length && codebaseManager != null)
        codebaseManager.add(uris[0].fsPath);
    },

    async removeCodebase(uri: string) {
      await backend.disableExternalRepoAgent(uri);
      if (codebaseManager != null) {
        codebaseManager.remove(uri);
      }
    },

    async search(query: string): Promise<SearchResult[]> {
      return await backend.webRaiderQuery(query);
      // TODO: query

      // let results = [
      //   {
      //     type: "github",
      //     name: "codebase 1",
      //     url: "https://github.com/microsoft/vscode",
      //   },
      //   {
      //     type: "gitlab",
      //     name: "codebase 2",
      //     url: "https://gitlab.com/gitlab-org/gitlab",
      //   },
      //   {
      //     type: "bitbucket",
      //     name: "codebase 3",
      //     url: "https://bitbucket.io/hello/world",
      //   },
      //   {
      //     type: "gitee",
      //     name: "codebase 4",
      //     url: "https://gitee.com/woodywrx/pity",
      //   },
      // ] as SearchResult[];

      // shuffle(results);

      // return results.slice(0, Math.max(1, Math.ceil(Math.random() * 5)));
    },

    navigateTo: (
      page: "chat" | "history" | "codebases" | "settings" | "search"
    ) => {
      console.log("navigate to", page, "called");
      triggerEvent("showPage", page);
      currentPage = page;
    },
    renderMarkdown: async (text: string) => {
      return (await vscode.commands.executeCommand(
        "markdown.api.render",
        text
      )) as string;
    },

    openInNewWindow: (dir: string) => {
      vscode.commands.executeCommand(
        "vscode.openFolder",
        vscode.Uri.file(dir),
        true
      );
    },

    writeToClipboard: (text: string) => {
      vscode.env.clipboard.writeText(text);
    },

    isConnected: () => {
      return backend.isOpen;
    },

    reconnect: () => {
      if (!backend.isOpen) backend.start();
    },
  };

  const isViewApiRequest = <K extends keyof ViewApi>(
    msg: unknown
  ): msg is ViewApiRequest<K> =>
    msg != null &&
    typeof msg === "object" &&
    "type" in msg &&
    msg.type === "request";

  const registerAndConnectView = async <V extends ViewKey>(key: V) => {
    const view = await registerView(ctx, key);
    connectedViews[key] = view;
    const onMessage = async (msg: Record<string, unknown>) => {
      if (!isViewApiRequest(msg)) {
        return;
      }
      try {
        const apiFunc: Function = api[msg.key];

        const AsyncGeneratorFunction = async function* () {}.constructor;

        // console.log(`${msg.key} ${apiFunc instanceof AsyncGeneratorFunction}`);

        if (apiFunc instanceof AsyncGeneratorFunction) {
          const generator = apiFunc(...msg.params);

          for await (let val of generator) {
            const res: ViewApiResponse = {
              type: "response",
              id: msg.id,
              value: val,
              isStreaming: true,
              isLast: false,
            };

            view.webview.postMessage(res);
          }

          view.webview.postMessage({
            type: "response",
            id: msg.id,
            value: "",
            isStreaming: true,
            isLast: true,
          });
        } else {
          // @ts-expect-error
          const val = await Promise.resolve(api[msg.key](...msg.params));
          // console.log(
          //   `raider-chat sending out message for ${
          //     msg.key
          //   } with item ${JSON.stringify(val)}`
          // );
          const res: ViewApiResponse = {
            type: "response",
            id: msg.id,
            value: val,
            isStreaming: false,
          };
          view.webview.postMessage(res);
        }
      } catch (e: unknown) {
        const err: ViewApiError = {
          type: "error",
          id: msg.id,
          value:
            e instanceof Error ? e.message : "An unexpected error occurred",
        };
        view.webview.postMessage(err);
      }
    };

    view.webview.onDidReceiveMessage(onMessage);
  };

  registerAndConnectView("raiderChat");

  vscode.commands.registerCommand("raider.new", () => {
    triggerEvent("showPage", "chat");
    currentPage = "chat";
    if (sessionManager != null) sessionManager.openSession();
  });

  type Page = "chat" | "history" | "codebases" | "settings" | "search";

  let pages: Page[] = ["chat", "history", "codebases", "settings"];

  pages.forEach((page) => {
    vscode.commands.registerCommand(`raider.${page}`, () => {
      console.log(`raider.${page} called`);
      if (backend.isOpen) {
        triggerEvent("showPage", page);
        currentPage = page;
      }
    });
  });
};

export const deactivate = () => {
  sessionManager?.saveToStorage();
  // codebaseManager?.saveToStorage();

  return;
};
