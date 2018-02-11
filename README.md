# smart-waterway-server  
Smart waterway system backend

### Prerequisites
Setup mongoDb development server in docker
```
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

Setup redis development server in docker
```
docker run -d -p 6379:6379 --name redis redis:latest
```

*Note*: please make sure the ports for mongdb redis are 27017 and 6379 in development environment

### Development
1. Install dependency
```
yarn install
```

2. Start webpack dev server
```
yarn dev
```

### Build and Package
Run the following command, it `tar.gz` package of back-end will be created
```
yarn build
```

Start backend service
```
tar -xvf tw-site-backend-0.0.1.tar.gz -C tw-site-backend
cd tw-site-backend
yarn install
NODE_ENV=production node server.js 
or
NODE_ENV=production pm2 start server.js
```
[PM2](https://github.com/Unitech/pm2) is a production process manager for Node.js applications with a built-in load balancer. It allows you to keep applications alive forever, to reload them without downtime and to facilitate common system admin tasks.

### Simple test
run following command, check whether you could get a response successfully
```
wget http://localhost:5050/api/v1.0/greeting
curl http://localhost:5050/api/v1.0/greeting # on mac
```
Test Jenkins on new server.