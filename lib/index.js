'use strict';

var restler = require('restler');
var Q = require('q');

/**
 * SmsGateway Constructor
 * @constructor
 * @param {String} email    Account of smsgateway.me
 * @param {String} password Password of smsgateway.me
 */
var SmsGateway = function(email,password){
	this.email = email;
	this.password = password;
	this._baseUrl = 'http://smsgateway.me/api/v3';
};

/**
 * Private method to make the network request
 * @access private
 * @param  {String} method GET or POST
 * @param  {String} path   API path, exclude the prefix /api/v3
 * @param  {Object} data   Data object to send
 * @return {Promise}
 */
SmsGateway.prototype._makeRequest = function(method, path, data){
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
	restler[method](this._baseUrl + path,options).on('complete',function(data,response){
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

/**
 * Get all devices
 * See https://smsgateway.me/sms-api-documentation/devices/list-of-devices for detail
 * @param  {Number} page page number(500 results per page)
 * @return {Promise}
 */
SmsGateway.prototype.getDevices = function(page){
	return this._makeRequest('GET', '/devices', {page:page});
};

/**
 * Get one device
 * See https://smsgateway.me/sms-api-documentation/devices/fetch-single-device for detail
 * @param  {Number} id ID of the device
 * @return {Promise}
 */
SmsGateway.prototype.getDevice = function(id){
	return this._makeRequest('GET', '/devices/view/' + id);
};

/**
 * Get all messages
 * See https://smsgateway.me/sms-api-documentation/messages/list-of-messages for detail
 * @param  {Number} page page number(500 results per page)
 * @return {Promise}
 */
SmsGateway.prototype.getMessages = function(page){
	return this._makeRequest('GET', '/messages', {page:page});
};

/**
 * Get one message
 * See https://smsgateway.me/sms-api-documentation/messages/fetch-single-message for detail
 * @param  {Number} id ID of the message
 * @return {Promise}
 */
SmsGateway.prototype.getMessage = function(id){
	return this._makeRequest('GET', '/messages/view/' + id);
};

/**
 * Send messages
 * Base method of .sendMessageToNumber() / .sendMessageToManyNumbers()
 * @param {Number|Array} number The number(s) to send
 * @param {String} message Message content to send
 * @param {Number} deviceId ID of device which sends this message
 * @param {Object} options Other options
 * @param {Number} options.send_at Time(stamp) to send the message
 * @param {Number} options.expires_at Time(stamp) to give up trying to send the message
 * @return {Promise}
 */
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

	return this._makeRequest('POST', '/messages/send', data);
};


/**
 * Send message to number
 * See https://smsgateway.me/sms-api-documentation/messages/send-message-to-number for detail
 * Alias to .send() method
 * @method
 * @param {Number} number The number to send
 * @param {String} message Message content to send
 * @param {Number} deviceId ID of device which sends this message
 * @param {Object} options Other options
 * @param {Number} options.send_at Time(stamp) to send the message
 * @param {Number} options.expires_at Time(stamp) to give up trying to send the message
 * @return {Promise}
 */
SmsGateway.prototype.sendMessageToNumber = SmsGateway.prototype.send;

/**
 * Send message to number
 * See https://smsgateway.me/sms-api-documentation/messages/send-message-to-many-numbers for detail
 * Alias to .send() method
 * @method
 * @param {Array} number The numbers to send
 * @param {String} message Message content to send
 * @param {Number} deviceId ID of device which sends this message
 * @param {Object} options Other options
 * @param {Number} options.send_at Time(stamp) to send the message
 * @param {Number} options.expires_at Time(stamp) to give up trying to send the message
 * @return {Promise}
 */
SmsGateway.prototype.sendMessageToManyNumbers = SmsGateway.prototype.send;

/**
 * Send message to contact
 * See https://smsgateway.me/sms-api-documentation/messages/send-message-to-contact for detail
 * @method
 * @param {Number} contact ID of contact
 * @param {String} message Message content to send
 * @param {Number} deviceId ID of device which sends this message
 * @param {Object} options Other options
 * @param {Number} options.send_at Time(stamp) to send the message
 * @param {Number} options.expires_at Time(stamp) to give up trying to send the message
 * @return {Promise}
 */
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

	return this._makeRequest('POST', '/messages/send', data);
};

/**
 * Send message to contact
 * See https://smsgateway.me/sms-api-documentation/messages/send-message-to-many-contacts for detail
 * Please note: the offcial example of PHP SDK on this method is incorrect!!
 * @method
 * @param {Array} contact IDs of contact
 * @param {String} message Message content to send
 * @param {Number} deviceId ID of device which sends this message
 * @param {Object} options Other options
 * @param {Number} options.send_at Time(stamp) to send the message
 * @param {Number} options.expires_at Time(stamp) to give up trying to send the message
 * @return {Promise}
 */
SmsGateway.prototype.sendMessageToManyContacts = SmsGateway.prototype.sendMessageToContact;

/**
 * Send message to contact
 * See https://smsgateway.me/sms-api-documentation/messages/send-many-messages-to-many-recipients for detail
 * @param {Array} data All messages array
 * @return {Promise}
 */
SmsGateway.prototype.sendManyMessages = function(data){
	return this._makeRequest('POST', '/contacts/send', {data:data});
};

/**
 * Create new contact
 * See https://smsgateway.me/sms-api-documentation/contacts/create-new-contact for detail
 * @param  {String} name Name of contact
 * @param  {Number} number Number of contact
 * @return {Promise}
 */
SmsGateway.prototype.createContact = function(name,number){
	return this._makeRequest('POST', '/contacts/create', {name:name,number:number});
};

/**
 * Get all contacts
 * See https://smsgateway.me/sms-api-documentation/contacts/list-of-contacts for detail
 * @param  {Number} page page number(500 results per page)
 * @return {Promise}
 */
SmsGateway.prototype.getContacts = function(page){
	return this._makeRequest('GET', '/contacts', {page:page});
};

/**
 * Get one contact
 * See https://smsgateway.me/sms-api-documentation/contacts/fetch-single-contact for detail
 * @param  {Number} id ID of the contact
 * @return {Promise}
 */
SmsGateway.prototype.getContact = function(id){
	return this._makeRequest('GET', '/contacts/view/' + id);
};


module.exports = SmsGateway;