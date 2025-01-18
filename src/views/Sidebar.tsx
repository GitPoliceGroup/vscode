import { useState } from "react";
import { Box, TextField, Typography, Button, Container } from "@mui/material";

export const Sidebar = () => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(false);

  const handleChange = (event: any) => {
    const value = event.target.value;
    setInputValue(value);

    if (value.length <= 3) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const handleSubmit = () => {
    alert(`Submitted: ${inputValue}`);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Input Validation with Submit
        </Typography>
        <TextField
          label="Enter text"
          variant="outlined"
          fullWidth
          value={inputValue}
          onChange={handleChange}
          error={error}
          helperText={error ? "Input must be more than 3 characters" : " "}
        />
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSubmit}
          disabled={error || inputValue.length === 0}
        >
          Submit
        </Button>
      </Box>
    </Container>
  );
};
