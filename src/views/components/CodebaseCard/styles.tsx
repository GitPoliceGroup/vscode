import { Box, Card, IconButton } from "@mui/material";
import styled from "@emotion/styled";

export const CodebaseCard = styled(Card)`
  max-width: 100%;
  color: white;
  background-color: #000053;
  margin: 10px 10px;
  border-radius: 10px;
  white-space: pre-line;
  display: flex;
  flex-direction: row;
  align-items: start;
`;

export const CodebaseCardMenu = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  align-items: center;
  justify-content: flex-end;
  margin-left: auto;
`;

export const DeleteButton = styled(IconButton)`
  &:hover {
    color: #ff7f7f;
  }
  padding-bottom: 10px;
`;

export const HoverIconButton = styled(IconButton)`
  &:hover {
    color: #aaa;
  }
`;
