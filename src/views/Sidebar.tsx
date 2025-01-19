import { useState, useContext } from "react";
import { TextField, Typography, Button, Container } from "@mui/material";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { WebviewContext } from "./WebviewContext";

export const Sidebar = () => {
  let { callApi } = useContext(WebviewContext);
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
  const [currentRuleIndex, setCurrentRuleIndex] = useState(-1);
  const [games, setGames] = useState<string[]>([]);
  const [currentGameIndex, setCurrentGameIndex] = useState(-1);

  const handleChange = (event: any) => {
    const value = event.target.value;
    setInputValue(value);

    if (value.length <= 3) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const gameloop = async () => {
    if (currentStage === "rule") {
      if (currentRuleIndex == -1) {
        setRules(["starwars", "palindrome"]);
        setCurrentRuleIndex(0);
      } else {
        while (currentRuleIndex < rules.length) {
          let { success, message } = await callApi(
            "checkRule",
            rules[Math.max(currentRuleIndex, 0)] ??
              `fuck${typeof currentRuleIndex}${rules}`,
            inputValue
          );
          if (success) {
            setAlerts([
              ...alerts,
              { severity: "success", message: message ?? "", source: "rule" },
            ]);
            setCurrentRuleIndex(currentRuleIndex + 1);
          } else {
            setAlerts([
              ...alerts,
              {
                severity: "error",
                message: `${message}\n\nPlease resubmit.`,
                source: "rule",
              },
            ]);
            return;
          }
        }
      }
      setCurrentStage("game");
      gameloop();
    } else if (currentStage === "game") {
      if (currentGameIndex === -1) {
        setGames(await callApi("getGames"));
        setCurrentGameIndex(0);
      }
      while (currentGameIndex < games.length) {
        let { success, message } = await callApi(
          "playGame",
          games[currentGameIndex]
        );
        if (success) {
          setAlerts([
            ...alerts,
            { severity: "success", message: message ?? "", source: "game" },
          ]);
          setCurrentGameIndex(currentGameIndex + 1);
        } else {
          setAlerts([
            ...alerts,
            {
              severity: "error",
              message: `${message}\n\nPlease resubmit.`,
              source: "game",
            },
          ]);
          return;
        }
      }
      setCurrentStage("aug");
      gameloop();
    } else if (currentStage === "aug") {
      let augs = await callApi("getAugs");
      for (let aug in augs) {
        let { success, message } = await callApi("augment", aug, inputValue);
        if (success) {
          setInputValue(message ?? inputValue);
          setAlerts([
            ...alerts,
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
      setCurrentRuleIndex(-1);
      setGames([]);
      setCurrentGameIndex(-1);
      setEmptyHistory(true);
      setAlerts([
        ...alerts,
        {
          severity: "success",
          message: `Committed ${inputValue} successfully!`,
          source: "aug",
        },
      ]);
    }
  };

  const handleSubmit = async () => {
    if (emptyHistory) {
      setEmptyHistory(false);
      gameloop();
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
      {/* Input and Button */}
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
