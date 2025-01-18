import { Grid, IconButton, Typography } from "@mui/material";
import { useContext } from "react";
import { WebviewContext } from "../WebviewContext";
import { ArrowBack } from "@mui/icons-material";

export class TopBarProps {
  navigateTo?: "search" | "chat" | "history" | "codebases" | "settings" =
    "chat";
  title!: string;
}

export default function TopBar(props: TopBarProps) {
  let { callApi } = useContext(WebviewContext);
  return (
    <Grid container alignItems="center">
      <IconButton
        onClick={() => callApi("navigateTo", props.navigateTo ?? "chat")}
      >
        <ArrowBack />
      </IconButton>
      <Typography variant="h6" component="div">
        {props.title}
      </Typography>
    </Grid>
  );
}
