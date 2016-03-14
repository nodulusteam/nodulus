var http = require('http');
var Client = require('socket.io-client');
var socket = require('../lib/index');
var expect = require('chai').expect;

var CONFIG = require('../lib/config/tests-config');
var TEST_SOCKET_ID = '8882BqIoTSYqmf8bAAAA';
var CLIENT = null;
var WS_CLIENT_ID = null;

// Shut up JSHint.
/* global describe */
/* global context */
/* global before */
/* global it */
/* global after */

describe('socket-io-server', function () {
	before(function () {
		this.server = http.createServer();
	});

	context('socket.init()', function () {
		before(function () {
			socket.init(this.server);
			this.server.listen(CONFIG.port);
		});

		it('initialized socket.io server', function () {
			expect(socket.socketServer).to.exist;
		});
	});

	context('socket.connect()', function () {
		before(function (done) {
			CLIENT = new Client(CONFIG.socketServerURL);

			CLIENT.on('connection', function (data) {
				this.data = data;

				WS_CLIENT_ID = data.wsClientId;

				done();
			}.bind(this));
		});

		it('connected to client', function () {
			expect(this.data).to.exist;
		});

		it('socket.io server emits data Object', function () {
			expect(this.data).to.be.an('Object');
			expect(this.data.wsClientId).to.exist;
			expect(this.data.info).to.exist;
		});
	});

	context('socket.setSocket()', function () {
		it('maps an object to an id', function () {
			socket.setSocket(TEST_SOCKET_ID, {});
		});
	});

	context('socket.getSocket()', function () {
		it('retrieves a mapped Object', function () {
			var obj = socket.getSocket(TEST_SOCKET_ID);

			expect(obj).to.exist;
		});
	});

	context('socket.removeSocket()', function () {
		before(function () {
			socket.removeSocket(TEST_SOCKET_ID);
		});

		it('removes a mapped Object', function () {
			var obj = socket.getSocket(TEST_SOCKET_ID);

			expect(obj).to.not.exist;
		});
	});

	context('socket.on()', function () {
		before(function (done) {
			socket.on(WS_CLIENT_ID, 'test', function (data) {
				this.data = data;

				done();
			}.bind(this));

			CLIENT.emit('test', {});
		});

		it('socket receives data from client', function () {
			expect(this.data).to.exist;
		});
	});

	context('socket.broadcast()', function () {
		before(function (done) {
			var CLIENT2 = new Client(CONFIG.socketServerURL, { forceNew: true });

			CLIENT2.on('test-broadcast', function (data) {
				this.data = data;

				done();
			}.bind(this));

			CLIENT2.on('connection', function (data) {
				socket.broadcast(WS_CLIENT_ID, 'test-broadcast', {});
			});
		});

		it('socket broadcasts data to other clients', function () {
			expect(this.data).to.exist;
		});
	});

	context('socket.emit()', function () {
		before(function (done) {
			CLIENT.on('test-emit', function (data) {
				this.data = data;

				done();
			}.bind(this));

			socket.emit(WS_CLIENT_ID, 'test-emit', {});
		});

		it('socket emits data to a specific client', function () {
			expect(this.data).to.exist;
		});
	});

	context('socket.emitAll()', function () {
		before(function (done) {
			CLIENT.on('test-emit-all', function (data) {
				this.data = data;

				done();
			}.bind(this));

			socket.emitAll('test-emit-all', {});
		});

		it('socket emits data to all connected clients', function () {
			expect(this.data).to.exist;
		});
	});

	context('socket.close()', function () {
		before(function () {
			socket.close();
		});

		it('closes the socket connection', function () {
			expect(socket.socketServer).to.be.null;
		});
	});

	after(function (done) {
		this.server.close(function () {
			done();
		});
	});
});
