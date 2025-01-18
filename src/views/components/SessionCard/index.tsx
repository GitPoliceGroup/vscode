import { Box, CardContent, Typography } from "@mui/material";
import {
  SessionCardActionArea,
  SessionCardContainer,
  SessionCardMenu,
} from "./styles";
import { useContext } from "react";
import { WebviewContext } from "../../WebviewContext";
import { Message, Session } from "../../types";
import DeleteButton from "../DeleteButton";

export class SessionCardProps {
  session!: Session;
}

function getFirstQuery(messages: Message[]): string {
  let content = messages[0].content.trim();
  return content.length > 40 ? content.slice(0, 40).trim() + "..." : content;
}

export default function SessionCard({ session }: SessionCardProps) {
  const { callApi } = useContext(WebviewContext);

  function openSessionChat() {
    callApi("openSessionChat", session.id);
  }

  function deleteSession() {
    callApi("deleteSession", session.id);
  }

  return (
    <SessionCardContainer>
      <SessionCardActionArea onClick={openSessionChat}>
        <CardContent>
          <Box>
            <Typography
              gutterBottom
              variant="h4"
              component="div"
              sx={{ fontSize: "15px" }}
            >
              {getFirstQuery(session.messages)}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "grey.500", align: "right" }}
            >
              {session.lastUpdated.toLocaleString()}
            </Typography>
          </Box>
        </CardContent>
      </SessionCardActionArea>

      <SessionCardMenu>
        <DeleteButton onClick={deleteSession} />
      </SessionCardMenu>
    </SessionCardContainer>
  );
}
