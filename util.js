
var crypto = require('crypto')
, key = 'abcdefghijklmnop'
, iv = 'fdsfds85435nfdfs';

exports.jsonWriter = function (message, statusCode, res) {
	if(!res) {
		var res = this.res;
	}
	var messageJSON = JSON.stringify(message);

	try {
		res.set("Connection", "close");
		res.contentType('json');
	} catch (e) {
		console.log(e);
	}

	if (statusCode) {
		//console.timeEnd(res.req.originalUrl);
		try {
			res.status(statusCode).end(messageJSON);
		} catch (e) {
			res.end(messageJSON);
		}
	} else {
		res.end(messageJSON);
	}

	message.data = [];
	message.error = 0;
};


exports.isEmpty =  function (obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

exports.parseJSON = function (jsonString) {
	try {
		var obj = JSON.parse(jsonString);
		if (obj && (typeof obj === 'object')) {
			return obj;
		}
	}
	catch (e) {
	}
};

exports.formatDate = function (date) {
	if (date instanceof Date) {
		return dateFormat(date, 'dd mmmm yyyy');
	} else {
		return null;
	}
};

exports.escapeSingleQuotes = function (string, escapeChar) {
	escapeChar = escapeChar || '\\';
	return string ? string.replace(/'/g, escapeChar + "'") : null;
};

exports.getServerPath = function (req) {
	try{
		var host = req.get('host');
    	var protocol = req.protocol;
    	return protocol + '://' + host;
	} catch(e) {
		return null;
	}
}

exports.jwt_secret = "1ZRiukvqIucljaEGvUDGujuVLUsNGK7v0deAlQe4lRvwsLjYnDG7WLPIw05gfxf";
exports.uuidKey = '1b671a64-40d5-491e-99b0-da01ff1f3341';

exports.encryptAES = function(text) {
 var cipher = crypto.createCipheriv('aes-128-cbc', key, iv)
 var crypted = cipher.update(text, 'utf-8', 'hex');
 crypted += cipher.final('hex');
 return crypted;
}

exports.decryptAES = function(text) {
 decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
 var decrypted = decipher.update(text, 'hex', 'utf-8');
 decrypted += decipher.final('utf-8');
 return decrypted;
}