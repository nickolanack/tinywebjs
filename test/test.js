/**
 * 
 */

var assert=require('assert');


var WebServer=require('../server.js');
var server=(new WebServer({port:8091})).on('open',function(){


	var http=require('http');
	http.request({
		hostname: 'localhost',
		port: 8091
	}, function(res) {

		server.stop();

	}).on('error', function(e) {
		assert.fail(e.message);
	}).end();


});

