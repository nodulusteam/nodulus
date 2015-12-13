/**
 * @module socket-io-server
 *
 * Provides a simple abstraction for initializing- and connecting to a socket.io
 * server.
 *
 * This module creates a singleton Object that exposes methods for listening to
 * and emitting socket events using an existing http Server Object.
 */

var SocketServer = require('socket.io');
var debug = require('debug')('socket-server:socket');

// Mapping of all connected sockets.
var SOCKETS = {};

/**
 * Creates a socket.io server instance.
 *
 * @constructor
 */
var Socket = new Function();

/**
 * Constructor.
 *
 * Reference to the constructor function.
 *
 * @type {Function}
 */
Socket.prototype.constructor = Socket;

/**
 * socket.io server instance.
 *
 * @type {Object}
 */
Socket.prototype.socketServer = null;

/**
 * Initializes a socket.io server instance an connects to it.
 *
 * @param  {Object} server - http server
 */
Socket.prototype.init = function (server) {
	this.connect(new SocketServer(server));
};

/**
 * Connect to a socket.io server instance.
 *
 * @param  {Object} socketServer - socket.io server instance
 */
Socket.prototype.connect = function (socketServer) {
	// Expose the socket.io server.
	this.socketServer = socketServer;

	// Listen for when a client connects with the socket.io server.
	socketServer.on('connection', function (socket) {
		var id = socket.id;

		this.setSocket(id, socket);

		debug('Client %s connected to socket server.', id);

		socket.emit('connection', {
			wsClientId: id,
			info: 'Client successfully connected.'
		});

		// Listen for when a client disconnects with the socket.io server.
		socket.on('disconnect', function () {
			this.removeSocket(id);

			socketServer.emit('disconnect', {
				info: 'Client disconnected.'
			});
		}.bind(this));
	}.bind(this));
};

/**
 * Stores a socket reference.
 *
 * @param {string} id     - client websocket id
 * @param {Object} socket - web socket
 */
Socket.prototype.setSocket = function (id, socket) {
	SOCKETS[id] = socket;
};

/**
 * Retrieves a socket reference.
 *
 * @param {string} id - client websocket id
 *
 * @return {Object} web socket
 */
Socket.prototype.getSocket = function (id) {
	return SOCKETS[id];
};

/**
 * Deletes a socket reference.
 *
 * @param {string} id - client websocket id
 */
Socket.prototype.removeSocket = function (id) {
	delete SOCKETS[id];
};

/**
 * Expose the 'on' function for easy access.
 *
 * @param  {string}   id    	- web socket client id
 * @param  {string}   event 	- event name
 * @param  {Function} callback  - callback
 */
Socket.prototype.on = function (id, event, callback) {
	var socket = this.getSocket(id);

	socket.on.call(socket, event, callback);
};

/**
 * Emit an event to all connected clients except for the client
 * that started the event.
 *
 * @param  {string} id    - web socket client id
 * @param  {string} event - event name
 * @param  {Object} data  - event data
 */
Socket.prototype.broadcast = function (id, event, data) {
	var socket = this.getSocket(id);

	socket.broadcast.emit.call(socket, event, data);
};

/**
 * Emit an event to a specific client.
 *
 * @param  {string} id    - web socket client id
 * @param  {string} event - event name
 * @param  {Object} data  - event data
 */
Socket.prototype.emit = function (id, event, data) {
	var socket = this.getSocket(id);

	socket.emit.call(socket, event, data);
};

/**
 * Emit an event to all connected clients.
 */
Socket.prototype.emitAll = function () {
	this.socketServer.emit.apply(this.socketServer, arguments);
};

/**
 * Close the socket server connection.
 *
 * @method
 */
Socket.prototype.close = function () {
	this.socketServer.close();
	this.socketServer = null;
};

/**
 * Export the Socket module instance.
 *
 * @type {Object}
 */
module.exports = new Socket();
