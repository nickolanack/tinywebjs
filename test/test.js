/**
 * 
 */

var assert=require('assert');


var WebServer=require('../server.js');
var server=new WebServer({port:8091});


var req = require('http').request('http://localhost:8091', function(res) {
	
	console.log(res);
	assert.fail('...');
	
}).on('error', function(e) {
  assert.fail(e.message);
});