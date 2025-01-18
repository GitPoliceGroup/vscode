import { Fab } from "@mui/material";

export class FabBuilderProps {
  onClick!: () => void;
  icon!: JSX.Element;
  label?: string = "fab";
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning" = "primary";
  orientation?: "top-left" | "top-right" | "bottom-left" | "bottom-right" =
    "bottom-right";
  size?: "small" | "medium" | "large" = "small";
}

export default function FabBuilder(props: FabBuilderProps) {
  let position = Object.fromEntries(
    (props.orientation ?? "bottom-right").split("-").map((it) => [it, "16px"])
  );

  return (
    <Fab
      size="small"
      sx={{ position: "absolute", ...position }}
      aria-label={props.label}
      color={props.color}
      onClick={props.onClick}
    >
      {props.icon}
    </Fab>
  );
}
