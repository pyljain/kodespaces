FROM golang:1.14.4-alpine3.12 as builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o main .

FROM alpine:3.12

ENV GOTRACEBACK=single
RUN apk update && apk add ca-certificates && rm -rf /var/cache/apk/*

CMD ["./main"]
COPY --from=builder /app/main .