/**
 * 
 */

var assert=require('assert');


var WebServer=require('../server.js');
var server=new WebServer({port:8091});

var http=require('http');
http.request({
	hostname: 'localhost',
	port: 8091
}, function(res) {



}).on('error', function(e) {
	assert.fail(e.message);
});

setTimeout(function(){
	assert.fail('fail');
},1000);