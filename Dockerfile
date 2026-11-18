FROM node:24-slim

RUN npm install -g @angular/cli

USER node
WORKDIR /app

EXPOSE 4200
CMD ["sleep", "infinity"]
