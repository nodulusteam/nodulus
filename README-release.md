# nodulus 

[![Join the chat at https://gitter.im/roibh/nodulus](https://badges.gitter.im/roibh/nodulus.svg)](https://gitter.im/roibh/nodulus?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

a modular back-office for node.js using angular.js and mongoDB.

so you want to build your next application / website / mobile app / REST api using the almighty powers of the MEAN stack, but you don't have the management application to manage the data and operations, well,  nodulus to the rescue.

nodulus allows you to build and design your own back office modules *(nodules)* or use the predefined ones, while focusing on the exact actions you need to add to your management consoles.
it uses a manifest file to define the nodule files, scripts, dependencies, routes etc.

### dependencies

1. [node.js](https://nodejs.org/en/)
2. npm (will install with the node.js installation)
3. [mongoDB](https://www.mongodb.org/) or try  [mongolab](https://mongolab.com/) [optional]

### setup & first run
1. create a directory `mkdir nodulus`
2. cd into the directory `cd nodulus`
3. run `npm install nodulus`
4. run `node ./node_modules/nodulus/master.js`


```
mkdir nodulus
cd nodulus
npm install nodulus --save
node ./node_modules/nodulus/master.js
```

use the configuration file at /config/config.json to set the database name and the application port, default port is 4000.


## nodule development


[slack](https://nodulus.slack.com/messages/general/)


[cookbook](https://roibh.gitbooks.io/nodulus)

