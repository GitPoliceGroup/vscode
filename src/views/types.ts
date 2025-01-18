export type Message = {
  role: string;
  content: string;
};

export type Session = {
  id: string;
  messages: Message[];
  lastUpdated: Date;
};

export type SearchCodebase = {
  type: "github" | "gitlab" | "bitbucket" | "gitee";
  name: string;
  url: string;
};
