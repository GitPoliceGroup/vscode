import styled from "@emotion/styled";
import { Box, InputAdornment, OutlinedInput } from "@mui/material";
import { fontArray } from "../../theme/theme";

export const ChatInputContainer = styled(Box)`
  position: sticky;
  bottom: 0;
  margin-left: 10px;
  margin-right: 10px;
`;

export const ChatInput = styled(OutlinedInput)`
  background-color: #313244;
  color: white;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
  font-family: ${fontArray};
  width: 100%;

  & .Mui-focused {
    outline: none;
  }
`;

export const ChatInputIconContainer = styled(InputAdornment)`
  align-items: center;
  justify-content: bottom;
  display: flex;
  flex-direction: row;
  column-gap: 0.5rem;
  margin-top: auto;
  margin-bottom: 0.75rem;
`;
