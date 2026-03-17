export const readmeContent = `
# DockForge

A small DevOps experiment focused on **automating application environments using Docker**.

Clone the repository, run one command, and the application environment prepares itself.

No manual dependency hunting.
No repeated setup steps.

ᡕᠵデᡁ᠊╾━

---

## Overview

Modern applications often depend on multiple tools, services, and runtime environments.
Manually preparing these environments can be slow and inconsistent across systems.

DockForge explores a simple automation approach where a setup script prepares the runtime environment and launches the application inside a container.

Instead of repeating environment setup steps manually, the system automates them to create **reproducible development environments**.

---

## Basic Idea

\`\`\`text
clone repository
      │
      ▼
run setup command
      │
      ▼
environment prepared
      │
      ▼
container built
      │
      ▼
application running
\`\`\`

The goal is not to build a complete platform, but to demonstrate how infrastructure-style automation can simplify environment setup.

≽(•⩊ •マ≼

---

## Architecture

The system focuses on automating environment setup and container deployment.

\`\`\`text
User
 │
 │ run setup command
 ▼
Setup Script (Discovery Engine)
 │
 ├─ checks environment (Auto-installs Docker if missing! 🛠️)
 ├─ 📡 Auto-discovers apps in /app/ and /dockerfiles/
 ├─ prepares dependencies & Just-In-Time secrets
 ├─ builds Docker image
 └─ starts container (with Ctrl+C auto-disassembly 🛡️)
        │
        ▼
Docker Engine
        │
        ▼
Application Container
\`\`\`

---

## GitHub Actions Integration (Point 3)

DockForge includes a built-in Cloud Inspector (CI) to ensure your Blueprints are always valid.

### 1. Automatic Validation
Once you fork this repository, any change you \`commit\` and \`push\` to GitHub will automatically trigger the **DockForge CI** robot. It will attempt to build your Dockerfiles in a clean cloud environment to verify there are no errors.

### 2. Customizing the CI
If you add a new application, you must tell the CI robot to inspect it.
*   **File to edit:** \`.github/workflows/docker-build.yml\`
*   **What to change:** Add your new app name to the \`blueprint\` matrix:
    \`\`\`yaml
    strategy:
      matrix:
        blueprint: [atsea-shop, rust-dashboard, your-new-app]
    \`\`\`

---

## Extending DockForge (Point 4)

You can use DockForge to automate any application environment with **Zero Manual Updates**.

### Small Tutorial: Running the Forge
1.  **Clone & Enter:** \`git clone <repo-url> && cd fake-thon\`
2.  **Run:** \`sudo ./scripts/deploy.sh\`
3.  **Interact:** Select a blueprint from the **Auto-Discover Menu**.
4.  **Wait:** DockForge will check your RAM, generate SSL certs, build the app, and wait for health validation.
5.  **Shutdown:** Press **Ctrl+C** to trigger the emergency disassembly and clean up your station.

### Adding Your Own App (Zero Config)
To add a new application to the engine:
1.  **Source Code:** Move your app source code into a new folder under \`app/\` (e.g., \`app/my-web-app\`).
2.  **Blueprint:** Create a Dockerfile in \`dockerfiles/\` named \`my-web-app.Dockerfile\`.
3.  **Launch:** That's it! Run the script, and \`my-web-app\` will be automatically detected and listed.

---

### Full project tree 
\`\`\`text
dockforge/
│
├── app/
│   ├── atsea-sample-shop-app/         # Java Payload
│   └── rust_dashboard_app/            # Rust Payload
│
├── dockerfiles/                       # Centralized Blueprints
│   ├── atsea-shop.Dockerfile
│   └── rust-dashboard.Dockerfile
│
├── scripts/                           # Automation Engine
│   ├── deploy.sh                      # Main interactive script
│   ├── cleanup.sh                     # Environment cleanup
│   └── install-docker.sh              # Auto-installer for Docker
│
├── config/                            # Global configuration
│   └── dockforge.yml
│
├── .github/
│   └── workflows/
│       └── docker-build.yml           # GitHub Actions CI
│
├── docs/                              # Detailed Documentation
│   ├── architecture.md
│   └── workflow.md
│
├── .gitignore
├── README.md
└── LICENSE
\`\`\`

## Minimum System Requirements

* **RAM:** 16 GB minimum (Required for in-container compilation)
* **Storage:** 128 GB available disk space
* **Engine:** Docker with Docker Compose V2
* **Shell:** Bash or compatible POSIX shell

---

## Credits

- **Java Full Stack Example:** [atsea-sample-shop-app](https://github.com/dockersamples/atsea-sample-shop-app.git)
- **Rust Dashboard App:** [rust_dashboard_app](https://github.com/WhiteSponge/rust_dashboard_app/)
- **Emoji Art:** [EmojiCombos](https://emojicombos.com/cute)

---

## Documentation

- [Architecture Guide](./docs/architecture.md)
- [Workflow Deep-Dive](./docs/workflow.md)
`;
