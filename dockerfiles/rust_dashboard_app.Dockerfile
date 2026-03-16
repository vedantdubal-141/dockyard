# --- Build Stage ---
FROM rustlang/rust:nightly-bullseye-slim as builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install cargo-leptos and wasm-pack
RUN cargo install cargo-leptos --locked
RUN rustup target add wasm32-unknown-unknown

WORKDIR /app
COPY . .

# Build the application
RUN cargo leptos build --release

# --- Runtime Stage ---
FROM debian:bullseye-slim

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy build artifacts
COPY --from=builder /app/target/release/dashboard-app /app/
COPY --from=builder /app/target/site /app/site

# Environment variables
ENV LEPTOS_OUTPUT_NAME="dashboard-app"
ENV LEPTOS_SITE_ROOT="site"
ENV LEPTOS_SITE_PKG_DIR="pkg"
ENV LEPTOS_SITE_ADDR="0.0.0.0:3999"

EXPOSE 3999

CMD ["./dashboard-app"]
