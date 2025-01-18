import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { ErrorOutline } from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";

const flashAnimation = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`;

export const AnimatedErrorOutline = styled(ErrorOutline)(() => ({
  fontSize: 80,
  color: "#f44336", // Red color
  animation: `${flashAnimation} 1.5s infinite`,
}));

export const AnimatedErrorOutlineIcon = () => {
  return (
    <IconButton>
      <AnimatedErrorOutline />
    </IconButton>
  );
};

export const DisconnectedText = styled(Typography)`
  color: #f44336;
  font-weight: bold;
  margin: 2 2 0 2;
  animation: ${flashAnimation} 1.5s infinite;
  align: center;
  text-align: center;
`;

export const ReconnectButton = (props: { onClick: () => void }) => {
  return (
    <Button
      variant="contained"
      color="error"
      onClick={props.onClick}
      sx={{ mt: 4, fontSize: "16px", fontWeight: "bold" }}
    >
      Reconnect
    </Button>
  );
};

export const DisconnectedContainer = ({ children }: { children: any }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f8d7da" // Light red background
    >
      {children}
    </Box>
  );
};
