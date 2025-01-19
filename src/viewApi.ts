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
  getRules(): Promise<string[]>;
  checkRule(
    rule: string,
    message: string
  ): Promise<{ success: boolean; message: string | undefined }>;
  getGames(): Promise<string[]>;
  playGame(
    game: string
  ): Promise<{ success: boolean; message: string | undefined }>;
  getAugs(): Promise<string[]>;
  augment(
    aug: string,
    message: string
  ): Promise<{ success: boolean; message: string | undefined }>;
  emotion(): Promise<void>;
};

export type ViewEvents = {};
