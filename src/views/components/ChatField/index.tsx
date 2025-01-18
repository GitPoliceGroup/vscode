import { IconButton } from "@mui/material";
import {
  ChatInput,
  ChatInputContainer,
  ChatInputIconContainer,
} from "./styles";
import { SendOutlined } from "@mui/icons-material";

export type ChatFieldProps = {
  input: string;
  setInput: (it: string) => void;
  handleSend: () => void;
};

export default function ChatField({
  input,
  setInput,
  handleSend,
}: ChatFieldProps) {
  const onEnter = (evt: React.KeyboardEvent) => {
    if (evt.key === "Enter" && !evt.shiftKey) {
      evt.preventDefault();
      handleSend();
    }
  };
  return (
    <ChatInputContainer>
      <ChatInput
        maxRows={10}
        placeholder="Type here..."
        multiline
        value={input}
        onChange={(e) => setInput((e.target as HTMLTextAreaElement).value)}
        onKeyDown={onEnter}
        endAdornment={
          <ChatInputIconContainer position="end">
            <IconButton
              aria-label="send chat"
              edge="end"
              onClick={handleSend}
              disabled={input && input.length == 0 ? true : false}
            >
              <SendOutlined />
            </IconButton>
          </ChatInputIconContainer>
        }
      />
    </ChatInputContainer>
  );
}
