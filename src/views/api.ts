import axios from "axios";

const stream = async function* (stream: ReadableStream<Uint8Array>) {
  const reader = stream.pipeThrough(new TextDecoderStream()).getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    yield value;
  }
};

export async function getSubtasks(query: string): Promise<string[]> {
  const res = await (
    await fetch(`/getSubtasks?query=${encodeURIComponent(query)}`)
  ).json();
  return res;
}

export async function streamSubtask(subtask: string): Promise<AsyncGenerator> {
  return axios
    .get(`/runSubtask?subtask=${encodeURIComponent(subtask)}`, {
      responseType: "stream",
    })
    .then((res) => stream(res.data));
}
