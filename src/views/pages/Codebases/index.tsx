import { useContext, useEffect, useState } from "react";
import { WebviewContext } from "../../WebviewContext";
import { CodebaseContainer } from "./styles";
import { FolderOpen, Search } from "@mui/icons-material";
import CodebaseCard from "../../components/CodebaseCard";
import SpeedDialBuilder from "../../components/SpeedDialBuilder";
import TopBar from "../../components/TopBar";

export default function Codebases() {
  let { callApi } = useContext(WebviewContext);

  const [codebases, setCodebases] = useState<string[]>([]);

  const fetchCodebases = async () => {
    setCodebases(await callApi("getCodebases"));
  };

  useEffect(() => {
    fetchCodebases();

    let interval = setInterval(() => {
      fetchCodebases();
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const speedDialActions = [
    {
      icon: <FolderOpen />,
      title: "Add Local Folder",
      onClick: () => {
        callApi("openAddCodebase");
        fetchCodebases();
      },
    },
    {
      icon: <Search />,
      title: "Search Codebases",
      onClick: () => {
        callApi("navigateTo", "search");
      },
    },
  ];

  return (
    <CodebaseContainer>
      <TopBar title="Reference Codebases" />

      <ul>
        {codebases.map((it) => (
          <CodebaseCard codebase={it} refresh={fetchCodebases} key={it} />
        ))}
      </ul>

      <SpeedDialBuilder actions={speedDialActions} />
    </CodebaseContainer>
  );
}
