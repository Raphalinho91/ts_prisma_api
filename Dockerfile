FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install -g nodemon
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 5051

CMD ["npm", "run", "start"]

