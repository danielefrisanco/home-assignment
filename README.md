# home-assignment

> Home assignment

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test
```

``` bash
# in another terminal
node ./src/server
```


For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


## Websocket
## Vue
## I18n
## Node
## eslinter
## Okta
## SqlLite
## docker
## graph and report
## Redis
## restyle
## Immmudb


docker network create immudbnet
docker run -d --net immudbnet -it --rm --name immudb -p 3322:3322 codenotary/immudb:latest
docker run -it --rm --net immudbnet --name immuclient codenotary/immuclient:latest -a immudb