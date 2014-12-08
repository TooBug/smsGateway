# SmsGateway

[SmsGateway.me](https://smsgateway.me) Node.js wrapper.

The service of SmsGateway.me can turn your android phone to a sms tunnel. You can programmatically send or receive messages with there RESTful API.

## Docs

Almost exactly the same as the docs in SmsGateway.me. The API is also the same as their offcial PHP library.

## Examples

See tests.

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