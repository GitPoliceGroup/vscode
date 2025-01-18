import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const ChatContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  width: calc(100vw-0px);
  height: 100vh;
  padding: 0px;
  overflow: hidden;
`;

export const MessagesContainer = styled(Box)`
  flex: 1;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-bottom: 20px;
`;
