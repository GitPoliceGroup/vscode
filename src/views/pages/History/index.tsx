import { useContext, useEffect, useState } from "react";
import { Add } from "@mui/icons-material";
import { Session } from "../../types";
import { WebviewContext } from "../../WebviewContext";
import { SessionContainer } from "./styles";
import FabBuilder from "../../components/FabBuilder";
import SessionCard from "../../components/SessionCard";
import TopBar from "../../components/TopBar";

export default function History() {
  const { callApi } = useContext(WebviewContext);

  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const fetchSessions = async () => {
      setSessions(
        (await callApi("getSessions")).map((it) => ({
          id: it.id,
          lastUpdated: new Date(it.lastUpdated),
          messages: it.messages,
        }))
      );
    };
    fetchSessions();

    let interval = setInterval(() => {
      fetchSessions();
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  function newSession() {
    callApi("newSession");
  }

  return (
    <SessionContainer>
      <TopBar title="History" />

      <ul>
        {sessions.map((session, index) => (
          <SessionCard session={session} key={index} />
        ))}
      </ul>

      <FabBuilder
        size="medium"
        label="Add"
        onClick={newSession}
        icon={<Add />}
      />
    </SessionContainer>
  );
}
