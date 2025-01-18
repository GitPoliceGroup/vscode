export type ViewApiRequest<K extends keyof ViewApi = keyof ViewApi> = {
  type: "request";
  id: string;
  key: K;
  params: Parameters<ViewApi[K]>;
};

export type ViewApiResponse = {
  type: "response";
  id: string;
  value: unknown;
  isStreaming?: boolean;
  isLast?: boolean;
};

export type ViewApiError = {
  type: "error";
  id: string;
  value: string;
};

export type ViewApiEvent<K extends keyof ViewEvents = keyof ViewEvents> = {
  type: "event";
  key: K;
  value: Parameters<ViewEvents[K]>;
};

export type Message = {
  role: string;
  content: string;
};

export type Session = {
  id: string;
  messages: Message[];
  lastUpdated: Date;
};

export type SearchResult = {
  type: "github" | "gitlab" | "bitbucket" | "gitee";
  name: string;
  url: string;
};

export type Subtask = {
  task_type: "User action" | "Command execution" | "Coding";
  task_body: string;
};

export type ViewApi = {
  restartServer: () => void;
  // getFileContents: () => Promise<string>;
  // showExampleViewB: () => void;
  // sendMessageToExampleB: (msg: string) => void;
  sendMessage: (msg: Message) => Promise<void>;

  updateLastMessage: (content: string) => Promise<void>;

  generateSubtasks: (objective: string) => Promise<Subtask[]>;
  runSubtask: (task: string) => Promise<string>;
  askRepo: (query: string) => Promise<string>;

  getMessages: () => Message[];
  getSessions: () => Session[];
  resetMessageHistory: () => void;
  // getResetCommand: () => void;
  newSession: () => void;
  deleteSession: (sessionId: string) => void;
  openSessionChat: (sessionId: string) => void;

  getCodebases: () => Promise<string[]>;
  openAddCodebase: () => Promise<void>;
  removeCodebase: (uri: string) => Promise<void>;

  search: (query: string) => Promise<SearchResult[]>;

  navigateTo: (
    page: "chat" | "history" | "codebases" | "settings" | "search"
  ) => void;

  renderMarkdown: (text: string) => Promise<string>;

  openInNewWindow: (dir: string) => void;

  writeToClipboard: (text: string) => void;

  isConnected: () => boolean;

  reconnect: () => void;
};

export type ViewEvents = {
  // exampleBMessage: (a: string) => void;
  // showChatPage: () => void;
  // showHistoryPage: () => void;
  // showSettingsPage: () => void;
  sendMessages: (messages: Message[]) => void;
  sendHistory: (sessions: Session[]) => void;
  showPage: (
    page: "chat" | "history" | "codebases" | "settings" | "search"
  ) => void;
  disconnectServer: () => void;
  sendChunk: (chunk: string) => void;
};
