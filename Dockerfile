FROM node:14-alpine
# Чтобы gyp работал
RUN apk add g++ make python3
WORKDIR /app
COPY . .
RUN npm i
RUN npm run build
CMD ["npm", "run", "start"]