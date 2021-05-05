FROM golang:1.16.3-alpine3.13

WORKDIR /app

COPY go.mod .

COPY go.sum .

RUN go mod download

RUN go get github.com/githubnemo/CompileDaemon

COPY . .

EXPOSE 8010

CMD [ "go", "run", "./cmd/web/*.go" ]