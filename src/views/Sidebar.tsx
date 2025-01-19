import { useState, useContext } from "react";
import { TextField, Typography, Button, Container } from "@mui/material";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { WebviewContext } from "./WebviewContext";

export const Sidebar = () => {
  const { callApi } = useContext(WebviewContext);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(false);

  const [emptyHistory, setEmptyHistory] = useState(true);
  const [currentStage, setCurrentStage] = useState<"rule" | "game" | "aug">(
    "rule"
  );

  const [alerts, setAlerts] = useState<
    { severity: string; message: string; source: "rule" | "game" | "aug" }[]
  >([]);
  const [rules, setRules] = useState<string[]>([]);
  const [games, setGames] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false); // Prevent re-entry into gameloop

  const handleChange = (event: any) => {
    const value = event.target.value;
    setInputValue(value);

    setError(value.length <= 3);
  };

  const processRules = async (ruleIndex: number) => {
    if (ruleIndex >= rules.length) {
      setCurrentStage("game");
      return processGames(0);
    }

    const rule = rules[ruleIndex];
    const { success, message } = await callApi("checkRule", rule, inputValue);

    if (success) {
      setAlerts((prevAlerts) => [
        ...prevAlerts,
        { severity: "success", message: message ?? "", source: "rule" },
      ]);
      return processRules(ruleIndex + 1);
    } else {
      setAlerts((prevAlerts) => [
        ...prevAlerts,
        {
          severity: "error",
          message: `${message}\n\nPlease resubmit.`,
          source: "rule",
        },
      ]);
    }
  };

  const processGames = async (gameIndex: number) => {
    if (gameIndex === 0 && games.length === 0) {
      const fetchedGames = await callApi("getGames");
      setGames(fetchedGames);
    }

    if (gameIndex >= games.length) {
      setCurrentStage("aug");
      return processAugs();
    }

    const game = games[gameIndex];
    const { success, message } = await callApi("playGame", game);

    if (success) {
      setAlerts((prevAlerts) => [
        ...prevAlerts,
        { severity: "success", message: message ?? "", source: "game" },
      ]);
      return processGames(gameIndex + 1);
    } else {
      setAlerts((prevAlerts) => [
        ...prevAlerts,
        {
          severity: "error",
          message: `${message}\n\nPlease resubmit.`,
          source: "game",
        },
      ]);
    }
  };

  const processAugs = async () => {
    const augs = await callApi("getAugs");
    for (const aug of augs) {
      const { success, message } = await callApi("augment", aug, inputValue);

      if (success) {
        setInputValue((prev) => message ?? prev);
        setAlerts((prevAlerts) => [
          ...prevAlerts,
          {
            severity: "success",
            message: "Modified Commit Message for fun",
            source: "aug",
          },
        ]);
      }
    }

    setCurrentStage("rule");
    setRules([]);
    setGames([]);
    setEmptyHistory(true);
    setAlerts((prevAlerts) => [
      ...prevAlerts,
      {
        severity: "success",
        message: `Committed ${inputValue} successfully!`,
        source: "aug",
      },
    ]);
    setIsRunning(false);
  };

  const gameloop = async () => {
    if (isRunning) return; // Prevent multiple entries
    setIsRunning(true);

    if (currentStage === "rule") {
      setRules(["starwars", "palindrome"]);
      await processRules(0);
    }
  };

  const handleSubmit = async () => {
    if (emptyHistory) {
      setEmptyHistory(false);
      await gameloop();
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 1,
        position: "fixed",
        top: 0,
        left: 0,
        textColor: "white",
      }}
    >
      <Box sx={{ width: "100%" }}>
        <TextField
          label="Commit Message"
          variant="outlined"
          fullWidth
          value={inputValue}
          onChange={handleChange}
          error={error}
          helperText={
            error ? "Commit Message must be more than 3 characters" : " "
          }
          multiline
          maxRows={6}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={error || inputValue.length === 0}
        >
          Commit
        </Button>
      </Box>
      <Box sx={{ width: "100%" }}>
        {alerts.map((alert, index) => (
          <Alert key={index} severity={alert.severity}>
            {alert.message}
          </Alert>
        ))}
      </Box>
    </Box>
  );
};
