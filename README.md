# SmsGateway

[![npm](http://img.shields.io/npm/v/gulp-toor.svg)](https://www.npmjs.com/package/gulp-toor)
[![npm](http://img.shields.io/npm/l/gulp-toor.svg)](https://www.npmjs.com/package/gulp-toor)

[SmsGateway.me](https://smsgateway.me) Node.js wrapper.

The service of SmsGateway.me can turn your android phone to a sms tunnel. You can programmatically send or receive messages with there RESTful API.

## Docs

<http://www.toobug.net/smsGateway/docs>

## Examples

```javascript

var SmsGateway = require('smsgateway');

var gateway = new SmsGateway('demo@toobug.net','password');

gateway.getDevices().then(function(data){
	console.log('getDevices Success');
	console.log(data);
}).fail(function(message){
	console.log('failed',message);
});

```

## Change Log

### v0.1.2(2014-12-24)

- Added `.sendMessageToNumber()` `.sendMessageToManyNumbers()` `.sendMessageToManyContacts()`.
- Added docs.

### v0.1.0 - v0.1.1 (2014-12-08)

- First release
