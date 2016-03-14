# socket-io-server.
Provides a simple abstraction for initializing- and connecting to a socket.io server.

This module creates a singleton Object that exposes methods for listening to
and emitting socket events using an existing http Server Object.

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Code Status][coverage-image]][coverage-url]

[npm-image]: https://img.shields.io/badge/npm-v1.0.5-blue.svg
[npm-url]: https://www.npmjs.com/package/socket-io-server
[travis-image]: https://travis-ci.org/danillouz/socket-io-server.svg?branch=master
[travis-url]: https://travis-ci.org/danillouz/socket-io-server
[coverage-image]: https://coveralls.io/repos/danillouz/socket-io-server/badge.svg?branch=master&service=github
[coverage-url]: https://coveralls.io/github/danillouz/socket-io-server?branch=master


# Installing.
```bash
npm install socket-io-server
```


# Usage.
```javascript
// Dependencies.
var express = require('express');
var	http = require('http');
var	socket = require('socket-io-server');
var	app = express();
var	server = http.Server(app);

// Initialize socket server.
socket.init(server);

// Initialize http server.
server.listen(8080);

// Listen for incoming events from a client.
// Note that a web socket client id is required, this id is emitted by the
// socket server when a client connects.
socket.on('ws-client-id', 'incoming', function (data) {
	// Data! :)
});

// Emit an event with data to all connected clients except for the
// client that started the event.
// Note that a web socket client id is required, this id is emitted by the
// socket server when a client connects.
socket.broadcast('ws-client-id', 'emit-client', {
	data: []
});

// Emit an event with data to a specific client.
// Note that a web socket client id is required, this id is emitted by the
// socket server when a client connects.
socket.emit('ws-client-id', 'emit-client', {
	data: []
});

// Emit an event with data to all connected clients.
socket.emitAll('emit-clients', {
	data: []
});

// Access the socketServer object (socket.io constructor).
socket.socketServer;

// Close the socket server connection.
socket.close();

// Close the http server connection.
server.close();
```

Because the module returns a singleton, the socket server only needs to be
initialized once and can then be required from any (sub) module(s) to emit- and
listen for socket events.

```javascript
// 'lib/index.js'
var express = require('express');
var	http = require('http');
var	socket = require('socket-io-server');
var	app = express();
var	server = http.Server(app);

socket.init(server);
server.listen(8080);

// 'lib/sub-module.js'
var socket = require('socket-io-server');

socket.broadcast('ws-client-id', 'emit-client', {
	data: []
});

// 'lib/sub-module-2.js'
var socket = require('socket-io-server');

socket.on('ws-client-id', 'incoming', {
	data: []
});
```


# Interface.
The module exposes the following methods and properties:

## socket.socketServer
socket.io server instance.

## socket.init(server)
Uses an http server instance to instantiate and connect to a socket.io server.

*The `init` method calls the `connect` method internally.*

## socket.connect(socketServer)
Exposes the socket server via the `socketServer` property and listens for clients
connecting and disconnecting with the socket server.

Upon successful connection the socket server will emit the `connection` event to
the client in question sending the clients web socket id. In turn this id can
be used to listen for and emit events to the correct sockets.

*`connection` event (example) data sent by the socket server:*
```javascript
{
	wsClientId: '12jsdd32919ssj21',
	info: 'Client successfully connected.'
}
```

Whenever a client disconnects, the socket server will emit the `disconnect` event.

*`disconnect` event (example) data sent by the socket server:*
```javascript
{
	info: 'Client disconnected.'
}
```

The `connect` method creates a mapping of all socket objects using the clients web
socket id's whenever a client connects with the socket server.
This is realized by calling the `setSocket` method internally. In turn a
client web socket id is invalidated whenever a client disconnects by calling the
`removeSocket` method.

## socket.setSocket(id)
Stores a socket reference using the web socket id of a connected client.

## socket.getSocket(id)
Retrieves a socket reference using the web socket id of a connected client.

## socket.removeSocket(id)
Deletes a socket reference using the web socket id of a connected client.

## socket.on(id, event, callback)
Registers event listeners for a connected client using it's web socket id.

## socket.broadcast(id, event, data)
Emits an event with data to all connected clients except for the client that
started the event. This client is identified by using the web socket id of the
connected client in question.

## socket.emit(id, event, data)
Emits an event with data to a specific client identified by the web socket id of
the client in question.

## socket.emitAll(event, data)
Emits an event with data to all connected clients.

## socket.close()
Closes the socket server connection.


# Testing.
```bash
npm test
```


# Code coverage.
`npm run cover`

[istanbul](https://github.com/gotwarlost/istanbul) and [coveralls](https://github.com/nickmerwin/node-coveralls) are used to generate a code coverage report.


# Linting.
JSHint is used to lint all javascript code prior running tests using the npm
'pretest' hook.


# Dependencies.
* [socket.io](https://github.com/Automattic/socket.io)
