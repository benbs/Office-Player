FROM node:4-onbuild
MAINTAINER benbs93@gmail.com
ADD "http://github.com/benbs/Office-Player" ~/Office-Player
RUN npm install
CMD npm start -- --release
EXPOSE 3000
