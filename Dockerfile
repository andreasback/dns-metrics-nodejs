FROM node:14.2-alpine

COPY ./src/* /app/

CMD [ "node", "/app/testdns.js"]
