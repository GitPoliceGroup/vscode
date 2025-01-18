# Raider Chat

This repository contains the preliminary codebase for the [Raider Chat VS Code Extension](https://marketplace.visualstudio.com/items?itemName=thepyprogrammer.raider-chat).

This system is built on the tremendous boilerplate assembled in [`sfc-gh-tkojima/vscode-react-webviews`](https://github.com/sfc-gh-tkojima/vscode-react-webviews) to run React on VS Code Web Views.

It interfaces directly with the [`sikfeng/raider-backend`](https://github.com/sikfeng/raider-backend) backend and [`ThePyProgrammer/web-raider`](https://github.com/ThePyProgrammer/web-raider) package.

## Overview of Extension

Raider Chat currently houses a single view on the sidebar. The plane "🛦" on the sidebar represents the extension.

The extension contains the following pages:

- **Chat**: A proper chatbox to ask questions to the backend, and get outputs. Takes ~2-3 minutes for the entire output to show up (no streaming supported)
- **Codebases**: Add and delete existing local codebases for the system to refer to. The floating action button can lead you to the Search page.
  - **Search**: Search for existing codebases. Takes ~10 minutes to generate all the search outputs.
- **History**: Maintains session history (note it resets everytime you restart because File I/O).
- **Settings**: Non-functional page. Please ignore.

## Usage Instructions

### Install PyPI Backend

Our [backend](https://github.com/sikfeng/raider-backend) is standalone and maintains a websocket server locally. To access, please do the following:

```shell
$ pip install raider_backend
```

### Specify your API Keys

The extension operates on a "bring-your-own-API-key" model, and you will need to specify them as system environmental variables. Alternatively, if you are using BASH, you can add them to your `.bashrc` file. This is an example of the lines to include in the `.bashrc` file:

```shell
export AZURE_API_KEY=""
export AZURE_API_BASE=""
export AZURE_API_VERSION=""


export AWS_ACCESS_KEY_ID=""
export AWS_SECRET_ACCESS_KEY=""
export AWS_REGION_NAME=""

export GITHUB_TOKEN=""
```

Please fill in the blanks with your own API keys. In summary, these are the components that need the corresponding API Keys:

| Component       | API Keys                                                                        |
| --------------- | ------------------------------------------------------------------------------- |
| Chat            | `AZURE_API_KEY`, `AZURE_API_BASE`, `AZURE_API_VERSION`                          |
| Codebase Search | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION_NAME`, `GITHUB_TOKEN` |

### Run Backend

Once you have specified the API keys, you can run the backend server by running the following command:

```shell
$ launch_endpoint
```

We would recommend installing and running this in a separate conda environment for the sake of convenience.

You will need to run `launch_endpoint` at ALL times while using the extension. This means that you cannot close the terminal. We are currently working on figuring out a way to turn the backend into a background service.

### Install and run the VSCode Extension

Our VSCode Extension is uploaded on the VSCode Extension Marketplace here: https://marketplace.visualstudio.com/items?itemName=thepyprogrammer.raider-chat.

You can install it from the extension sidebar and use it in tandem with the background server. Please note that this is a pre-alpha version that has not yet been EXTENSIVELY tested.

## Code Structure

### Backend Interaction

The extension interacts with a backend server to perform various tasks such as generating subtasks, running subtasks, and querying repositories. This interaction is managed through WebSocket connections.

- **src/backendApi.ts**: Contains the `Backend` class which manages the WebSocket connection and handles communication with the backend server.

### Session Management

Sessions are used to maintain the state of user interactions. Each session stores messages exchanged between the user and the assistant.

- **src/sessionManager.ts**: Contains the `Session` and `SessionManager` classes which handle session creation, storage, and retrieval.

### Codebase Management

The extension allows users to add and manage local codebases. These codebases are then used by the backend to generate responses.

- **src/codebaseManager.ts**: Contains the `Codebase` and `CodebaseManager` classes which handle the addition, removal, and storage of codebases.

### Views and UI

The extension uses React for its UI components. The views are rendered in VS Code webviews.

- **src/views**: Contains the React components and styles for the various pages of the extension.
  - **src/views/pages/Chat.tsx**: The main chat interface where users can interact with the assistant.
  - **src/views/pages/History.tsx**: Displays the history of sessions.
  - **src/views/pages/Search.tsx**: Allows users to search for codebases.
  - **src/views/pages/Chat.styles.tsx**: Styles for the chat interface.
  - **src/views/pages/Search.styles.tsx**: Styles for the search interface.

### Extension Activation

The main entry point for the extension where commands and views are registered.

- **src/extension.ts**: Contains the `activate` function which sets up the extension, registers commands, and connects views.

### Utility Functions

Helper functions used throughout the codebase.

- **src/util**: Contains utility functions such as file existence checks.
