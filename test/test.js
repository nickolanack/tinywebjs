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
			var filename=(__dirname).split('/').slice(0,-1).join('/')+'/html/index.html';
			require('fs').readFile(filename, function(err, content){
				if(err){
					throw err;
				}
				assert.equal(content, data.join(''));
			});
		});

	}).on('error', function(e) {
		assert.fail(e.message);
	}).end();


});

