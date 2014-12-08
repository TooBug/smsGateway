'use strict';

var restler = require('restler');
var Q = require('q');

var SmsGateway = function(email,password){
	this.email = email;
	this.password = password;
	this.baseUrl = 'http://smsgateway.me/api/v3';
};

SmsGateway.prototype.makeRequest = function(method, path, data){
	var dfd = Q.defer();
	if(!data){
		data = {};
	}
	data.email = this.email;
	data.password = this.password;
	var options = {};
	method = method.toLowerCase();
	if(method === 'get'){
		options.query = data;
	}else{
		options.data = data;
	}
	restler[method](this.baseUrl + path,options).on('complete',function(data,response){
		if(data instanceof Error){
			dfd.reject(data.message);
		}else if(!data.success){
			var errMsg;
			if(typeof data === 'string'){
				errMsg = data;
			}else{
				errMsg = JSON.stringify(data.errors,null,2);
			}
			dfd.reject('server returned error.\n' + errMsg);
		}else{
			dfd.resolve(data.result);
		}
	});

	return dfd.promise;
};

SmsGateway.prototype.getDevices = function(page){
	return this.makeRequest('GET', '/devices', {page:page});
};

SmsGateway.prototype.getDevice = function(id){
	return this.makeRequest('GET', '/devices/view/' + id);
};

SmsGateway.prototype.getMessages = function(page){
	return this.makeRequest('GET', '/messages', {page:page});
};

SmsGateway.prototype.getMessage = function(id){
	return this.makeRequest('GET', '/messages/view/' + id);
};

SmsGateway.prototype.send = function(number,message,deviceId,options){
	var data = {
		device:deviceId,
		number:number,
		message:message
	};
	if(options && options.send_at){
		data.send_at = options.send_at;
	}
	if(options && options.expires_at){
		data.send_at = options.expires_at;
	}

	return this.makeRequest('POST', '/messages/send', data);
};

SmsGateway.prototype.sendMessageToContact = function(contact,message,deviceId,options){
	var data = {
		device:deviceId,
		contact:contact,
		message:message
	};
	if(options && options.send_at){
		data.send_at = options.send_at;
	}
	if(options && options.expires_at){
		data.send_at = options.expires_at;
	}

	return this.makeRequest('POST', '/messages/send', data);
};

SmsGateway.prototype.sendManyMessages = function(data){
	return this.makeRequest('POST', '/contacts/send', {data:data});
};

SmsGateway.prototype.createContact = function(name,number){
	return this.makeRequest('POST', '/contacts/create', {name:name,number:number});
};

SmsGateway.prototype.getContacts = function(page){
	return this.makeRequest('GET', '/contacts', {page:page});
};

SmsGateway.prototype.getContact = function(id){
	return this.makeRequest('GET', '/contacts/view/' + id);
};



module.exports = SmsGateway;