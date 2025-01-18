import styled from "@emotion/styled";
import { fontArray } from "../../theme/theme";

type ChatBubbleProps = {
  role: string;
};

const roleColors = {
  assistant: "#fff0",
  user: "#313244",
};
// #007acc

function getRoleColor(role: string) {
  return Object.entries(roleColors).find(([key]) => key === role)?.[1];
}

export const ChatBubbleContainer = styled.div<ChatBubbleProps>`
  max-width: 100%;
  padding: 10px 10px;
  color: white;
  align-self: ${(props: ChatBubbleProps) =>
    props.role === "user" ? "flex-end" : "flex-start"};
  background-color: ${(props: ChatBubbleProps) => getRoleColor(props.role)};
  margin: ${(props: ChatBubbleProps) =>
    props.role === "user" ? "8px" : "0px"};
  border-radius: ${(props: ChatBubbleProps) =>
    props.role === "user" ? "5px" : "0px"};
  white-space: pre-line;
  font-family: ${fontArray};

  & > ul,
  ol {
    margin-left: 20px;
  }
`;
