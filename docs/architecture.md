# 🏗️ DockForge Architecture

DockForge is a high-performance automation layer designed to bridge the gap between source code and containerized production environments. It provides a standardized way to "forge" immutable infrastructure.

## 📁 System Blueprint

| Component | Responsibility | Location |
| :--- | :--- | :--- |
| **Forge Core** | Orchestration & Lifecycle | `scripts/` |
| **Blueprints** | Reusable Docker Definitions | `dockerfiles/` |
| **Payloads** | Targeted Applications | `app/` |
| **Metadata** | Declaration of Service Intent | `config/` |
| **Intelligence** | Strategic Documentation | `docs/` |

### 🌳 Project Tree
```text
dockforge/
├── 📂 app/                              # Targeted Payloads
│   ├── ☕ atsea-sample-shop-app/        # Java Spring Boot Commerce
│   └── 🦀 rust_dashboard_app/           # Rust Leptos SSR Dashboard
├── 📂 dockerfiles/                      # Blueprint Repository
│   ├── 🛠️ atsea-shop.Dockerfile         # Specialized Java Build
│   ├── 🛠️ rust-dashboard.Dockerfile     # Optimized Rust Build
│   └── 🛠️ java.Dockerfile               # Standard Java Template
├── 📂 scripts/                          # Forge Engine
│   ├── 🚀 deploy.sh                     # Interactive Deployer
│   ├── 🧹 cleanup.sh                    # Teardown Utility
│   └── 📦 install-docker.sh             # Env Bootstrap
├── 📂 config/                           # System Metadata
│   └── ⚙️ dockforge.yml                 # Global Declaration
└── 📂 docs/                             # Knowledge Base
```

## 🏗️ Layered Logic

The architecture is built on three distinct tiers of abstraction:

| Layer | Function | Core Technologies |
| :--- | :--- | :--- |
| **Automation** | Requirements discovery, pre-flight checks, and asset generation. | Bash, OpenSSL, JSON/YAML |
| **Infrastructure** | Management of isolated networks, volumes, and service relationships. | Docker Compose, Engine |
| **Application** | Execution of business logic within secure, immutable boundaries. | Java, Rust, Go, Python |

## 🧠 Core Components

### 1. The Forge Engine (`scripts/deploy.sh`)
Acting as the orchestrator, it handles:
- **Pre-flight Validation:** Verifying host capabilities (RAM/Space/Privileges).
- **📡 Discovery Engine:** Automatically scans `app/` and `dockerfiles/` to detect new payloads without configuration updates.
- **Just-In-Time Provisioning:** Generating SSL certs and dynamic secrets *on-demand*.
- **Live Monitoring:** Continuous health checks via the validation matrix.
- **🛡️ Emergency Shutdown:** Signal trapping (Ctrl+C) to ensure clean environment teardown on exit.

### 2. The Blueprint Matrix (`dockerfiles/`)
Centralized repository for environmentally aware container definitions. Each blueprint is optimized for minimal footprint and maximum security via multi-stage builds.

### 3. Service Declaration (`config/dockforge.yml`)
A declarative schema that defines the "desired state" of each application, including health endpoints and setup requirements.

---
≽(◕ ‿ ◕)≼ *DockForge: Building the Future, One Container at a Time.*
# researched: https://github.com/WhiteSponge/rust_dashboard_app/
# researched: https://github.com/dockersamples/atsea-sample-shop-app.git
