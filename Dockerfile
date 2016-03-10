FROM node:4-onbuild
MAINTAINER benbs93@gmail.com

ADD "http://github.com/benbs/Office-Player" ~/Office-Player
RUN npm install
RUN npm build -- --release
CMD node build/server.js
EXPOSE 8999
