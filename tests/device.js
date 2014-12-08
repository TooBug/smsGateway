'use strict';

var SmsGateway = require('../index');

var gateway = new SmsGateway('demo@toobug.net','password');

var deviceId;

gateway.getDevices().then(function(data){
	console.log('getDevices Success');
	// console.log(data);
	return gateway.getDevice(data.data[0].id);
}).then(function(data){
	console.log('getDevice Success');
	// console.log(data);
	deviceId = data.id;
	return gateway.send(['13418614141','17097222141'],'test',data.id);
}).then(function(data){
	console.log('sendMessage Success');
	// console.log(data);
	return gateway.getMessages();
}).then(function(data){
	console.log('getMessages Success');
	// console.log(data);
	return gateway.getMessage(data[0].id);
}).then(function(data){
	console.log('getMessage Success');
	// console.log(data);
	return gateway.createContact('test','12345678901');
}).then(function(data){
	console.log('createContact Success');
	// console.log(data);
	return gateway.getContacts();
}).then(function(data){
	console.log('getContacts Success');
	// console.log(data);
	return gateway.getContact(data.data[0].id);
}).then(function(data){
	console.log('getContact Success');
	// console.log(data);
	return gateway.sendMessageToContact(data.id,'test contact',deviceId);
}).then(function(data){
	console.log('sendMessageToContact Success');
	// console.log(data);
	return gateway.sendManyMessages([{
		device:deviceId,
		number:'13418614141',
		message:'test send manyMessage'
	}]);
}).then(function(data){
	console.log('sendManyMessages Success');
}).fail(function(message){
	console.log('failed',message);
});