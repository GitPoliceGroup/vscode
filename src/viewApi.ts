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

export type ViewApi = {
  navigateTo: (
    page: "chat" | "history" | "codebases" | "settings" | "search"
  ) => void;
};

export type ViewEvents = {
  showPage: (
    page: "chat" | "history" | "codebases" | "settings" | "search"
  ) => void;
};
