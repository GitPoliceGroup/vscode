import axios from "axios";

type SuccessResult = {
  success: boolean;
  message: string | undefined;
};

export class Backend {
  serverPort: number = 8000;

  serverRoute(): string {
    return `https://localhost:${this.serverPort}`;
  }

  constructor() {}

  async getRules(): Promise<string[]> {
    const response = await (
      await axios.get(`${this.serverRoute()}/rules`)
    ).data;
    console.log(response);
    return response as string[];
  }

  async checkRule(rule: string, message: string): Promise<SuccessResult> {
    let response = await axios.get(
      `${this.serverRoute()}/check_rule?rule=${rule}&message=${message}`
    );
    return await response.data;
  }

  async getGames(): Promise<String[]> {
    const response = await fetch(`${this.serverRoute()}/games`);
    return (await response.json()) as String[];
  }

  async playGame(game: string): Promise<SuccessResult> {
    let response = await fetch(`${this.serverRoute()}/play_game?game=${game}`);
    return await response.json();
  }

  async getAugs(): Promise<String[]> {
    const response = await fetch(`${this.serverRoute()}/augs`);
    return (await response.json()) as String[];
  }

  async augment(aug: string, message: string): Promise<SuccessResult> {
    let response = await fetch(
      `${this.serverRoute()}/augment?aug=${aug}&message=${message}`
    );
    return await response.json();
  }

  async emotion() {
    await axios.post(`${this.serverRoute()}/play_emotion`);
  }
}
