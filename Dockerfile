FROM node:14 as server
WORKDIR /server/
COPY . /server/
RUN npm i
RUN npm install pm2 -g
ENV NODE_ENV production
EXPOSE 5000
CMD ["pm2-runtime", "./src/index.js"]
