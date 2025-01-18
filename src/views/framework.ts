export default class Framework {
  // properties
  private query: string;
  private subtasks: string[];

  constructor(query: string) {
    this.query = query;
    this.subtasks = [];
  }

  public plan(): string[] {
    // call endpoint /plan with query as a parameter
    // get back output in string[]
    let subtasks = [] as string[];

    return subtasks;
  }

  public async run(subtask: string) {
    this.subtasks.push(subtask);
    // query endpoint /run with subtask as a parameter
    // get back output in string / (maybe) stream
  }

  public async rerun(subtask: string) {
    this.subtasks.pop();
    this.subtasks.push(subtask);
    // query endpoint /rerun with subtask as a parameter
    // get back output in string / (maybe) stream
  }
}
