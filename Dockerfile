FROM denoland/deno:latest

WORKDIR /app

COPY . .

RUN deno cache ./source/service/main.ts

CMD ["deno", "run", "--allow-all", "--unstable", "./source/service/main.ts"]