var request = require('request');
var url = 'http://127.0.0.1:9004/api/';
var clientKey = 'OphVHoVNozWFAIR';
var clientSecret = '2Yc97E4hiEP02Cr';


readEntity = (entity) => 
	new Promise((result, error)=>{
		var auth = 'Basic ' + new Buffer(clientKey + ':' + clientSecret).toString('base64');
		request(
			{ url : url+'getToken', headers : { "Authorization" : auth }},
			function (err, res, body) {
				if(err) throw err;
				var token = JSON.parse(body).token;
				console.log(url);
				request(url+entity+'?token='+token+'&limit=1000&offset=0',
					function (err, res, body) {
						if(err) throw err;
						var data = JSON.parse(body)[entity+'s'];
						console.log(data);
						for(var row of data){
							delete row.version;
							delete row.createdAt;
							delete row.updatedAt;
							for(var key of Object.keys(row))
								if(key.startsWith('f_')){
									row[key.substr(2)] = row[key];
									delete row[key];
							}
						}
						result(data);
					}
				);
			}
		);
});

readEntity('employees').then(console.log);
