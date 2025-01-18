import { Box, Card, CardActionArea } from "@mui/material";
import styled from "@emotion/styled";

export const SessionCardContainer = styled(Card)`
  max-width: 100%;
  color: white;
  background-color: #000053;
  margin: 10px 10px;
  border-radius: 10px;
  white-space: pre-line;
  display: flex;
  flex-direction: row;
  align-items: end;
`;

export const SessionCardMenu = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  align-items: center;
  justify-content: flex-end;
`;

export const SessionCardActionArea = styled(CardActionArea)`
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
`;
