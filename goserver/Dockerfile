# Build stage
FROM golang:1.24-alpine AS builder
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o goserver_prod

# Run stage
FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/goserver_prod .
EXPOSE 3000
CMD ["./goserver_prod"]