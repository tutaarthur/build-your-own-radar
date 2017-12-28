FROM node:7.3.0
EXPOSE 8080:8080
COPY $PWD /app
RUN cd /app
RUN npm install
RUN npm run dev



