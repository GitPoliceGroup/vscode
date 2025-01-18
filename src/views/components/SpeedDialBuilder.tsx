import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";

export class SpeedDialBuilderActionProps {
  icon!: JSX.Element;
  title?: string = "";
  onClick!: () => void;
}

export class SpeedDialBuilderProps {
  size?: "small" | "medium" | "large" = "medium";
  label?: string = "Speed Dial";
  orientation?: "top-left" | "top-right" | "bottom-left" | "bottom-right" =
    "bottom-right";
  icon?: JSX.Element = (<SpeedDialIcon />);
  actions?: SpeedDialBuilderActionProps[] = [];
}

export default function SpeedDialBuilder(props: SpeedDialBuilderProps) {
  let position = Object.fromEntries(
    (props.orientation ?? "bottom-right").split("-").map((it) => [it, "16px"])
  );

  return (
    <SpeedDial
      FabProps={{ size: props.size }}
      ariaLabel={props.label ?? ""}
      sx={{ position: "absolute", ...position }}
      icon={props.icon}
    >
      {props.actions?.map((it) => (
        <SpeedDialAction
          icon={it.icon}
          tooltipTitle={it.title}
          onClick={it.onClick}
        />
      ))}
    </SpeedDial>
  );
}
