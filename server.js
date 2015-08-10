/**
 * 
 */
var events = require('events');

function Server(options, callback){

	var me=this;
	events.EventEmitter.call(me);
	//Simple webserver
	
	
	var config={
			port:80,
			documentRoot:__dirname+'/html/'
	};
	
	Object.keys(options).forEach(function (key) {
		config[key]=options[key];
	});
	

	var fs=require('fs');
	var http=require('http');
	//var async=require('async');
	var port=config.port;
	var documentRoot=config.documentRoot;

	var server=http.createServer(function(req, res) {

		var file=req.url.split('/').pop();
		if(file===''){
			file='index.html';
		}
		if(file.indexOf('.')>=0){

			fs.exists(documentRoot+file, function(exists){

				if(exists){
					var contentTypes={
							js:'text/javascript',
							css:'text/css',
							html:'text/html'
					};

					var type=file.split('.').pop();
					res.writeHead(200, {
						'Content-Type': contentTypes[type]
					});

					fs.readFile(documentRoot+file, function (err, data) {
						res.write(data);
						res.end();
					});

				}else{

					res.writeHead(404);
					res.end('File not found: '+file);

				}

			});
		}else{

			res.writeHead(500);
			res.end('resuest: '+file);

		}

	});

	server.listen(port, callback);
	console.log('webserver listening on: '+port);

};

Server.prototype.__proto__ = events.EventEmitter.prototype;
Server.prototype.stop=function(){}


module.exports=Server;


/**
 * can be run directly from the command line. ie: sudo node server.js port username:password
 */

if(process.argv){
	if(!process.argc){
		process.argc=process.argv.length;
	}


	var fs=require('fs');
	fs.realpath(process.argv[1],function(err, p1){

		fs.realpath(__filename,function(err, p2){
			if(p1===p2){

				console.log(process.argv);

				if(process.argc>=3){
					var opt={port:parseInt(process.argv[2])};
					if(process.argc>3){
						opt.root=process.argv[3];
					}
					new Server(opt);
				}else{
					new Server({});
				}


			}

		});
	});
}
