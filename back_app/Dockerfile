FROM node:latest

RUN apt-get update -yq \
&& apt-get install curl gnupg -yq \
&& n \
&& apt-get clean -y

ADD . /app/
WORKDIR /app
RUN npm install

EXPOSE 2368
VOLUME /app/logs

CMD npm run start