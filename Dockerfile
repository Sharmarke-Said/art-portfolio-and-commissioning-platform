# Use the official Bun image
FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy package and lock files first (cache layer)
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy the rest of the app source
COPY . .

# Expose your API port
EXPOSE 3000

# Default start command (matches your package.json)
CMD ["bun", "run", "start"]

