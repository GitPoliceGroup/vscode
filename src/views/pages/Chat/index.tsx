import { useContext, useEffect, useState } from "react";
import { WebviewContext } from "../../WebviewContext";
import { ChatContainer, MessagesContainer } from "./styles";
import { Message } from "../../types";
import { RotateLeftOutlined } from "@mui/icons-material";
import FabBuilder from "../../components/FabBuilder";
import ChatField from "../../components/ChatField";
import MessageBubble from "../../components/MessageBubble";

export const ChatMessagesContainer = ({
  messages,
}: {
  messages: Message[];
}) => {
  return (
    <MessagesContainer>
      {messages.map((msg, index) => (
        <MessageBubble message={msg} key={index} />
      ))}
    </MessagesContainer>
  );
};

export default function Chat() {
  const { callApi, addListener, removeListener } = useContext(WebviewContext);

  const [messages, setMessages] = useState([] as Message[]);
  const [input, setInput] = useState("");

  const addChatBubble = (
    content: string,
    role: string,
    flag: any | undefined = undefined
  ) => {
    setMessages((prevMessages) => [...prevMessages, { content, role, flag }]);
    callApi("sendMessage", { content, role });
  };

  const updateLastMessage = (content: string) => {
    setMessages((prevMessages) => {
      let lastMessage = prevMessages.pop();

      if (lastMessage) {
        return [
          ...prevMessages,
          {
            content: lastMessage.content + content,
            role: lastMessage.role,
          },
        ];
      } else {
        return [...prevMessages, { content, role: "assistant" }];
      }
    });
  };

  const handleSend = async () => {
    if (input.trim()) {
      let prompt = input.trim();
      addChatBubble(prompt, "user");
      addChatBubble("Thinking...", "assistant");
      setInput("");

      clearInterval(interval);

      addListener("sendChunk", updateLastMessage);
      let result = await callApi("askRepo", prompt);
      removeListener("sendChunk", updateLastMessage);
      addChatBubble(result, "assistant");

      interval = setInterval(() => {
        fetchMessages();
      }, 500);

      // let subtasks = (await callApi("generateSubtasks", prompt)).filter(
      //   (it) => it.task_type !== "User action"
      // );

      // // let subtasks = [
      // //   { task_body: "This is a test subtask", task_type: "User action" },
      // //   { task_body: "This is a test subtask", task_type: "User action" },
      // // ];

      // if (subtasks.length === 0) {
      //   addChatBubble(
      //     "RAiDer was unable to formulate a plan based on the provided codebase and prompt. This most likely means that the functionality is already implemented and is hence unnecessary for us to update.",
      //     "assistant"
      //   );
      //   return;
      // }

      // let subtaskGeneration = `Generated Subtasks:\n\n${subtasks
      //   .map(
      //     (value, idx) =>
      //       `${idx + 1}. ${value.task_body.replace("\n- ", "\n\t-")}`
      //   )
      //   .join("\n")}\n`;
      // addChatBubble(
      //   // subtaskBubble,
      //   subtaskGeneration,
      //   "assistant"
      // );

      // for (let i = 0; i < subtasks.length; i++) {
      //   addChatBubble(`## Running Subtask ${i + 1}`, "assistant");
      //   // addChatBubble("", "assistant");
      //   addListener("sendChunk", updateLastMessage);
      //   let result = await callApi("runSubtask", subtasks[i].task_body);
      //   removeListener("sendChunk", updateLastMessage);
      //   addChatBubble(result, "assistant");
      // }
    }
  };

  const fetchMessages = async () => {
    setMessages(await callApi("getMessages"));
  };

  const getMessagesSent = (messages: Message[]) => {
    setMessages(messages);
  };

  let interval: NodeJS.Timeout;

  const reset = () => {
    callApi("resetMessageHistory");
    fetchMessages();
  };

  useEffect(() => {
    fetchMessages();

    addListener("sendMessages", getMessagesSent);

    interval = setInterval(() => {
      fetchMessages();
    }, 500);

    return () => {
      removeListener("sendMessages", getMessagesSent);
      clearInterval(interval);
    };
  }, []);

  return (
    <ChatContainer>
      <ChatMessagesContainer messages={messages} />

      <ChatField input={input} setInput={setInput} handleSend={handleSend} />

      <FabBuilder
        onClick={reset}
        label="Reset"
        orientation="top-right"
        icon={<RotateLeftOutlined />}
      />
    </ChatContainer>
  );
}
