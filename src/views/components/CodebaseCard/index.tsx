import { useContext } from "react";
import { CodebaseCard, CodebaseCardMenu } from "./styles";
import { WebviewContext } from "../../WebviewContext";
import { Box, CardContent, Typography } from "@mui/material";
import { HoverIconButton } from "./styles";
import { OpenInNew } from "@mui/icons-material";
import DeleteButton from "../DeleteButton";

function getProjectName(codebase: string): string {
  let splits = codebase.split(/\/|\\/g);
  return splits[splits.length - 1];
}

function getProjectPath(codebase: string): string {
  let splits = codebase.split(/\/|\\/g);
  let path = splits.join("/");

  path = path
    .replace(/[a-zA-Z]+:\/[uU]sers\/[^/]+\//gi, "~/")
    .replace(/\/home\/[^/]+\//gi, "~/");

  return path;
}

export default function Codebase({
  codebase,
  refresh,
}: {
  codebase: string;
  refresh: () => void;
}) {
  let { callApi } = useContext(WebviewContext);

  function open() {
    callApi("openInNewWindow", codebase);
  }

  async function remove() {
    await callApi("removeCodebase", codebase);
    refresh();
  }

  return (
    <CodebaseCard>
      <CardContent>
        <Box>
          <Typography
            gutterBottom
            variant="h4"
            component="div"
            sx={{ fontSize: "15px" }}
          >
            {getProjectName(codebase)}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "grey.500",
              align: "right",
              fontFamily: "Consolas",
            }}
          >
            {getProjectPath(codebase)}
          </Typography>
        </Box>
      </CardContent>
      <CodebaseCardMenu>
        <HoverIconButton onClick={open}>
          <OpenInNew />
        </HoverIconButton>

        <DeleteButton onClick={remove} />
      </CodebaseCardMenu>
    </CodebaseCard>
  );
}
