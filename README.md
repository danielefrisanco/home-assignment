# home-assignment

> CODENOTARY

Please have a look at our cloud service immudb Vault and build a simple application (Frontend + Backend) around it with a use case of where data needs to be stored in immudb Vault that comes to your mind.

> Daniele Frisanco

For this assignment I have thought to build the skeleton of an application to show the readings of a water/electricity meter.
Of course I am not going to build here the code for a meter but I will simulate its existance.
The readings will be stored in the Immudb vault as a way to secure them.
The user and the "meter" in reality need to be connected somehow, here I assume they are already.
The User can request a reading or insert its own manual reading.
I will try to put all the basis for a fully functioning app.
A Vue.js front end backed by node.js
The front end is multi language and communicates via api and via websocket to the back end and requires a login.
There should also be some sort of report/graph
The back end will store some data on a traditional database and some on immudb.
Some of the tasks require time and for this there will be jobs running and the websocket will be used to communicate thery result.
Everything will be dockerized.
The functionalities are minimal but new features can be built with the same stack.
Tests are just minimal because of lack of time and the outcome of the project was not sure. Also there is no error handling.

TODO:
  - Substitute sqllite with a docker image(maybe postgres?)
  - fix authentication with proxy or find another way
  - integrate immudb vault
  - improve gui and style template bootstrap
  - add report
  - add manual reading


## Build Setup


``` bash
docker-compose --up build
```

OR

``` bash
cd client
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
cd server
# install dependencies
npm install
# in another terminal
node ./server
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
