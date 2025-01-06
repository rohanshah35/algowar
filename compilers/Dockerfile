# Use minimal Ubuntu base image
FROM ubuntu:20.04

# Disable interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install only essential compilers and interpreters
RUN apt-get update && apt-get install -y --no-install-recommends \
    python2 \
    python3 \
    openjdk-11-jdk-headless \
    g++ \
    gcc \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Set up a directory for code execution
WORKDIR /workspace

# Copy entrypoint script
COPY entrypoint.sh /workspace/entrypoint.sh
RUN chmod +x /workspace/entrypoint.sh

# Set entrypoint
ENTRYPOINT ["/workspace/entrypoint.sh"]
