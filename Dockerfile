FROM node:24-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --chown=node:node .next/standalone/ ./

USER node

EXPOSE 3000

CMD ["node", "server.js"]
