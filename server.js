/**
 * 
 */
var events = require('events');

function Server(options) {

	var me = this;
	events.EventEmitter.call(me);
	//Simple webserver


	var config = {
		port: 80,
		documentRoot: __dirname + '/html/'
	};

	Object.keys(options).forEach(function(key) {
		config[key] = options[key];
	});

	me._handlers = {};
	me._formatters={};
	if(options.formatters){
		Object.keys(config.formatters).forEach(function(key) {
			me._formatters[key] = config.formatters[key];
		});
	}

	var fs = require('fs');
	var http = require('http');
	//var async=require('async');
	var port = config.port;
	var documentRoot = config.documentRoot;

	me.server = http.createServer(function(req, res) {

		var file = req.url.split('/').pop();
		if (file === '') {
			file = 'index.html';
		}
		if (file.indexOf('.') >= 0) {

			fs.exists(documentRoot + file, function(exists) {

				if (exists) {
					var contentTypes = {
						js: 'text/javascript',
						css: 'text/css',
						html: 'text/html',
						ico:'image/x-icon'
					};

					var type = file.split('.').pop();

					if(!contentTypes[type]){
						throw 'Invalid document type: '+type;
					}

					res.writeHead(200, {
						'Content-Type': contentTypes[type]
					});

					fs.readFile(documentRoot + file, function(err, data) {

						if(me._formatters[type]){
							data=me._formatters[type](data);
						}

						res.write(data);
						res.end();
					});

				} else {

					res.writeHead(404);
					res.end('File not found: ' + file);

				}

			});
		} else {

			if ((typeof me._handlers[file]) == 'function') {

				me._handlers[file](req, res);

			} else {

				res.writeHead(500);
				res.end('request: ' + file);

			}

		}

	}).listen(port, function() {
		console.log('webserver listening on: ' + port);
		me.emit('open');
	});



};
Server.prototype.__proto__ = events.EventEmitter.prototype;
Server.prototype.stop = function() {
	var me = this;
	console.log('webserver will be stopped after connections to close/timeout');
	me.server.close(function() {
		console.log('webserver stopped');
		me.emit('close');
	});
}


Server.prototype.addHandler = function(path, callback) {
	var me = this
	me._handlers[path] = callback;
	return me;
}



Server.prototype.addFormatter = function(type, fn) {
	var me = this
	me._formatters[type] = fn;
	return me;
}

module.exports = Server;


/**
 * can be run directly from the command line. ie: sudo node server.js port username:password
 */

if (process.argv) {
	if (!process.argc) {
		process.argc = process.argv.length;
	}


	var fs = require('fs');
	fs.realpath(process.argv[1], function(err, p1) {

		fs.realpath(__filename, function(err, p2) {
			if (p1 === p2) {

				console.log(process.argv);

				if (process.argc >= 3) {
					var opt = {
						port: parseInt(process.argv[2])
					};
					if (process.argc > 3) {
						opt.root = process.argv[3];
					}
					new Server(opt);
				} else {
					new Server({});
				}

			}

		});
	});
}