FROM denoland/deno:latest

WORKDIR /usr/src/gigabot

COPY . .

RUN deno cache ./source/server/main.ts

ENV PORT=8080

CMD ["deno", "run", "--allow-all", "--unstable", "./source/server/main.ts"]