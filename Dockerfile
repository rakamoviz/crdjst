FROM node:14.13.1-alpine3.10
ADD  . /opt
WORKDIR /opt
RUN npm install
CMD [ "node", "." ]