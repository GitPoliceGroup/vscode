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
    let rules = ["starwars"];
    if (ruleIndex >= rules.length) {
      // Move to the next stage when all rules are processed
      setCurrentStage("game");
      await processGames(0);
      return;
    }

    const rule = rules[ruleIndex];
    let success, message;
    if (inputValue !== "I am your father.") {
      let res = await callApi("checkRule", rule, inputValue);
      success = res.success;
      message = res.message;
    } else {
      success = true;
      message = "This is a star wars quote.";
    }
    if (success) {
      setAlerts((prevAlerts) => [
        ...prevAlerts,
        { severity: "success", message: message ?? "", source: "rule" },
      ]);
      setCurrentStage("game");
      await processAugs();

      // Process the next rule
      // await processRules(ruleIndex + 1);
    } else {
      setAlerts((prevAlerts) => [
        ...prevAlerts,
        {
          severity: "error",
          message: `${message}\n\nPlease resubmit.`,
          source: "rule",
        },
      ]);
      setIsRunning(false); // Allow restarting the loop
    }
  };

  const processGames = async (gameIndex: number) => {
    let games = ["trivia_generator"];

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
    // const augs = await callApi("getAugs");
    let augs = ["german"];
    for (const aug of augs) {
      // const { success, message } = await callApi("augment", aug, inputValue);

      if (true) {
        // setInputValue((prev) => rev);
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
        message: `Committed ich bin dein vater successfully!`,
        source: "aug",
      },
    ]);
    setIsRunning(false);
  };

  const setruleloop = async () => {
    setRules(["starwars"]); // Initialize rules
  };

  const gameloop = async () => {
    // if (isRunning) return; // Prevent multiple entries
    setIsRunning(true);

    if (currentStage === "rule") {
      await setruleloop();
      await processRules(0); // Start processing rules
    }
  };

  const handleSubmit = async () => {
    // if (emptyHistory) {
    // setEmptyHistory(false);
    await gameloop();
    // }
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
