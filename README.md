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

I have prioritized the functionalities of the proof of concept

The front end is multi language and communicates via api and via websocket to the back end and requires a login.
There should also be some sort of report/graph

The functionalities are minimal but new features can be built with the same stack just expanding what is already in place.


The back end will store ~~some data on a traditional database and some~~ on immudb.

Some of the tasks require time or to be asyncronous and for this there will be jobs running and the websocket will be used to communicate thery result.

Everything will be dockerized.

Tests are just minimal because of lack of time and the outcome desired from the project was not sure. Also there is no to little error handling.


In Immudb I will have a collection called readings and have a document for each user

I wasn't too sure how to go with this, another possibility was to have a colelction for each user and a document for each reading

TODO:
  - ~~Substitute~~ remove sqllite ~~with a docker image(maybe postgres?) ~~
  - add reports
  - add pagination

## Readings Manager
In the readings manager the user can request a reading to the meter and can enter its own reading.
In the table will see all the readings

## Build Setup

You need an account on https://vault.immudb.io/
and on https://auth0.com/ (you need to define a spa application and the api)
make sure 
``` bash
server/.env
client/.env
client/config/dev.env.js
```
are populated like in the relative examples



Create collection readings
``` bash
node ./immudb-vault-setup
```

### Build and run
``` bash
docker-compose --up build
```

OR
with redis server running

``` bash
cd client
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

```

``` bash
cd server
# install dependencies
npm install
# in another terminal
node ./server
```

http://localhost:8080


## Websocket
## Vuejs
## I18n
## Nodejs
## eslinter
## ~~OKTA~~
## Auth0
## SqlLite
## docker
## graph and report
## Redis
## restyle
## Immmudb Vault

