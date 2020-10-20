FROM node:14.13.1-alpine3.10
RUN apk update
RUN apk add python2=2.7.18-r0 make=4.2.1-r2
ADD  . /opt
WORKDIR /opt
RUN npm install
CMD [ "npm", "run", "start" ]