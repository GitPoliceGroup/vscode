import {
  AnimatedErrorOutlineIcon,
  DisconnectedContainer,
  DisconnectedText,
  ReconnectButton,
} from "./styles";

export default function DisconnectWarning({
  onReconnect,
}: {
  onReconnect: () => void;
}) {
  return (
    <DisconnectedContainer>
      <AnimatedErrorOutlineIcon />

      <DisconnectedText variant="h4">System Disconnected!</DisconnectedText>

      <ReconnectButton onClick={onReconnect} />
    </DisconnectedContainer>
  );
}
