import { useState } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import TopBar from "../components/TopBar";

export default function Settings() {
  const [selectedProvider, setSelectedProvider] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiBase, setApiBase] = useState("");
  const [apiVersion, setApiVersion] = useState("");
  const [model, setModel] = useState("");
  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretAccessKey, setSecretAccessKey] = useState("");
  const [regionName, setRegionName] = useState("");

  const handleSaveSettings = () => {
    // Handle saving the entered settings (logic specific to your application)
    console.log("Settings saved:", {
      selectedProvider,
      apiKey,
      apiBase,
      apiVersion,
      model,
      accessKeyId,
      secretAccessKey,
      regionName,
    });
    // You can clear the input fields here or perform other actions after saving
  };

  const handleCloseDialog = () => {
    // Set the selectedProvider to an empty string to effectively close the dialog
    setSelectedProvider("");
  };

  return (
    <Box sx={{ width: "100%" }}>
      <TopBar title="Settings" />
      <Select
        value={selectedProvider}
        onChange={(e) => setSelectedProvider(e.target.value)}
        sx={{
          width: "100%",
          backgroundColor: "#000053",
          color: "white",
          padding: 1,
        }}
      >
        <MenuItem value="azure">Azure</MenuItem>
        <MenuItem value="openai">OpenAI</MenuItem>
        <MenuItem value="antropic">Antropic</MenuItem>
        <MenuItem value="bedrock">Bedrock</MenuItem>
      </Select>
      {selectedProvider && (
        <Dialog open={!!selectedProvider}>
          {" "}
          {/* Use !!selectedProvider for conditional rendering */}
          <DialogTitle>{selectedProvider} Settings</DialogTitle>
          <DialogContent>
            {selectedProvider === "azure" && (
              <>
                <TextField
                  label="API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="API Base"
                  value={apiBase}
                  onChange={(e) => setApiBase(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="API Version"
                  value={apiVersion}
                  onChange={(e) => setApiVersion(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  fullWidth
                />
              </>
            )}
            {selectedProvider === "openai" && (
              <>
                <TextField
                  label="API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  fullWidth
                />
              </>
            )}
            {selectedProvider === "antropic" && (
              <>
                <TextField
                  label="API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  fullWidth
                />
              </>
            )}
            {selectedProvider === "bedrock" && (
              <>
                <TextField
                  label="Access Key ID"
                  value={accessKeyId}
                  onChange={(e) => setAccessKeyId(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Secret Access Key"
                  value={secretAccessKey}
                  onChange={(e) => setSecretAccessKey(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Region Name"
                  value={regionName}
                  onChange={(e) => setRegionName(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  fullWidth
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={handleSaveSettings}>
              Save
            </Button>
            <Button variant="outlined" onClick={handleCloseDialog}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
