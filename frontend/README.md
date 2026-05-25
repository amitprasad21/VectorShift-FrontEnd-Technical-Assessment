# Flow — Premium Visual Workflow & Pipeline Builder

Welcome to **Flow**, a production-grade, highly responsive, visual workflow pipeline builder. This project has been fully refactored, optimized, and styled with an **Apple-inspired monochromatic "luxury minimal" dark mode aesthetic**. 

It is engineered with a modular directory layout, robust React component abstractions, custom Zustand state management, and real-time topological cycle validation.

---

## 🚀 Key Engineering & Architecture Highlights

### 1. Unified `<BaseNode>` Abstraction Shell
Instead of copying and pasting repeating styling, header actions, and socket markups for each new card, this app leverages a single, highly extensible **`BaseNode`** component. It coordinates:
- **Accented Theme Glows**: Dynamic color bindings (emerald for inputs, amber for outputs, amethyst for LLM logic, and royal indigo for text/prompt templates).
- **Header Delete Operations**: An overlay trash button on card hover that cleanly deletes the node and purges all of its connections from the store.
- **Symmetric Socket Layouts**: Automatically calculates side heights for any number of connection handles, ensuring perfect vertical spacing:
  $$\text{top} = (\text{index} + 1) \times \frac{100}{\text{sockets.length} + 1}\%$$
- **Socket Tooltips**: Minimal floating socket label chips that slide into view when connection handles are hovered.

### 2. Advanced `<TextNode>` Logic (Auto-Resizing & Variable Sockets)
The Text Node implements interactive real-time variable compiling:
- **Dynamic Variable Detection**: Uses a double curly braces regex pattern (`/{{\s*([a-zA-Z0-9_]+)\s*}}/g`) to parse inputs in real time. It instantly generates left-side target sockets for every unique variable detected (e.g. typing `{{user_name}}` creates a target socket labeled `user_name`).
- **Automatic Edge Sync & Purge**: If you delete a variable (e.g. erasing `{{company}}`), the store immediately detects the change, destroys that target handle, and **deletes its corresponding canvas connection wire**, preventing dangling edges or React Flow crashes.
- **Dynamic Duo-Autosizing**: Employs a custom `useAutosizeTextarea` hook to dynamically expand/shrink the card's width (260px to 480px) and height (48px to 300px) fluidly based on line lengths, hiding bulky scrollbars.
- **Zero Input Lag**: Binds typing to a responsive local state maintaining a buttery-smooth **60fps text-input speed**, while synchronizing with the global Zustand store via an optimized lifecycle effect.

### 3. Integrated Custom Nodes (9 Types Total)
To showcase the flexibility and speed of our `BaseNode` abstraction, we developed **five brand new custom nodes** in addition to the four standard inputs:
- 📥 **Input Node (Standard)**: Receives pipeline configuration inputs (Text/File formats).
- 🧠 **LLM Node (Standard)**: Generates AI-based prompts and processes instructions.
- 📤 **Output Node (Standard)**: Receives workflow outputs (Text/Image formats).
- 📝 **Text Template (Standard)**: The advanced double curly braces dynamic socket compiler.
- 📟 **Prompt Builder (Custom)**: Builds prompts using template inputs.
- 🗄️ **Database Query (Custom)**: Connects to data engines (PostgreSQL, MySQL, SQLite, MongoDB) to query tables.
- 🔀 **Conditional Filter (Custom)**: Bifurcates workspace logic paths evaluating JS expressions (e.g., `value > 100`).
- 🌐 **REST API Request (Custom)**: Dispatches external HTTP operations with custom urls, bodies, and header sockets.
- 🖥️ **Console Viewer (Custom)**: Renders live visual console printouts and logs.

### 4. Comprehensive Layout Integrity Validations
- **Real-Time Canvas Safety**: The connection listener intercepts connections, immediately blocking self-connections (nodes connecting back to themselves) and duplicate wires. It slides up a custom **red warning toast** explaining the error.
- **Topological DAG Submissions**: Submitting a workflow sends a JSON payload to the FastAPI server. The backend runs **Kahn's topological sort cycle-detection** to verify if the graph forms a valid Directed Acyclic Graph (DAG) and displays structured statistics inside a centered glassmorphic popup modal.
- **Offline Local Fallback**: If the FastAPI server is offline, the frontend gracefully fails over to an identical client-side cycle sorting calculation, ensuring validation never crashes.

---

## 📂 Project Directory Structure

Our refactored modular layout splits files by responsibilities:

```bash
frontend/
├── build/                      # Optimized production bundle
├── public/                     # App entry HTML template and assets
├── src/
│   ├── components/
│   │   ├── BaseNode/           # Extensible named socket container
│   │   │   ├── index.js
│   │   │   └── styles.css
│   │   ├── Layout/             # Overall page viewport margins container
│   │   │   └── index.js
│   │   ├── NodeField/          # Reusable labeled form wrappers
│   │   │   └── index.js
│   │   ├── SubmitButton/       # Pipeline submit, alert triggers, and modal
│   │   │   ├── index.js
│   │   │   └── styles.css
│   │   └── Toolbar/            # Glassmorphic header toolbar panel
│   │       ├── index.js
│   │       ├── draggableNode.js
│   │       └── styles.css
│   ├── constants/              # Centralized node string typings
│   │   └── nodeTypes.js
│   ├── hooks/                  # Performance-optimized custom hooks
│   │   └── useAutosizeTextarea.js
│   ├── nodes/                  # Custom React Flow Node Components
│   │   ├── InputNode/index.js
│   │   ├── LLMNode/index.js
│   │   ├── OutputNode/index.js
│   │   ├── TextNode/index.js   
│   │   ├── PromptNode/index.js # [NEW] Prompt Builder Node
│   │   ├── DatabaseNode/index.js# [NEW] SQL Database Node
│   │   ├── FilterNode/index.js # [NEW] Logic Filter Node
│   │   ├── HTTPNode/index.js   # [NEW] REST API Node
│   │   └── DisplayNode/index.js# [NEW] Debugging Console Node
│   ├── services/               # API endpoints dispatch configurations
│   │   └── api.js
│   ├── store/                  # Custom Zustand state engine
│   │   └── index.js
│   ├── styles/                 # Luxury Apple Glassmorphism Design Tokens
│   │   └── design-system.css
│   ├── utils/                  # Regex, Edge Safety, and Kahn Sort Utilities
│   │   ├── edgeValidation.js
│   │   ├── graphValidation.js
│   │   └── variableParser.js
│   ├── App.js                  # App orchestrator
│   ├── index.js                # React index mount
│   ├── index.css               # Base reset rules
│   ├── draggableNode.js        # Backward-compatible re-export
│   ├── submit.js               # Backward-compatible re-export
│   ├── toolbar.js              # Backward-compatible re-export
│   └── ui.js                   # Visual coordinate canvas wrapper
└── package.json
```

---

## 🛠️ Instructions to Install & Run the Frontend

Follow these simple steps to run and build the Flow frontend:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (Node 16 or higher recommended).

### 1. Installation
Navigate into the `frontend` folder and install dependencies:
```bash
cd frontend
npm install
```

### 2. Launch Development Server
Start the development server:
```bash
npm start
```
* Once compiled, open **[http://localhost:3000](http://localhost:3000)** in your web browser. The app hot-reloads automatically when files are modified.

### 3. Build Production Bundle
To compile a fully optimized, minified production build:
```bash
npm run build
```
* This compiles React components down to compressed static assets inside the `build/` folder, ready for direct static hosting.
