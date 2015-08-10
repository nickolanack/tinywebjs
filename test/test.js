/**
 * 
 */

var assert=require('assert');


var WebServer=require('../server.js');
var server=(new WebServer({port:8091})).on('open',function(){

	console.log('Test Request');

	var http=require('http');
	http.request({
		hostname: 'localhost',
		port: 8091
	}, function(res) {

		var data=[];
		res.on('data', function (chunk) {
			data.push(chunk);
		}).on('end',function(){
			var filename='../html/index.html';
			require('fs').readFile(filename, function(err, content){
				assert.equals(content, data.join(''));
			});
		});

	}).on('error', function(e) {
		assert.fail(e.message);
	}).end();


});

