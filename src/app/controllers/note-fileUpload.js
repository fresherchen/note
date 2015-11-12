'use strict';

var fs= require('fs'),
	authUrl = 'http://192.168.1.198:8080/v1/AUTH_41c81798e8b242ce857b99f26a042d5e',
	openstackOpts = {
		provider: 'openstack',
	    username: 'lfzhao',
	    password: 'store-lisys',
	    tenantName: 'lisystec',
		authUrl: 'http://192.168.1.198:5000',
		internalURL: authUrl,
		region: 'regionOne'
	},
	openstackPKGClient = require('pkgcloud').storage.createClient(openstackOpts);

function generateGuid(guidNum) {
	var guid = '';
	for (var i = 0; i < guidNum; i++) {
		var n = Math.floor(Math.random() * 16.0).toString(16);
		guid += n;
	}
	return guid;
}

exports.fileUpload = function(req, res) {
	var paths = req.files.file.path.split('/');
	var filename = paths[paths.length - 1];
	var filenameArray = filename.split('\\');
	var pure_filename = filenameArray[filenameArray.length - 1];
	pure_filename = generateGuid(32)+'_' + pure_filename;
	
	res.header('Access-Control-Allow-Origin', '*');
	var tmp_path = req.files.file.path;
	console.dir(pure_filename);
	openstackPKGClient._serviceUrl = authUrl;
	var myFile = fs.createReadStream( tmp_path );
	
	var writeStream = openstackPKGClient.upload({
		container : 'SmartNotesStore',
		remote : pure_filename
	});
	writeStream.on('error', function(err) {
		res.send('null');
		return;
	});
	writeStream.on('success', function(file) {
		res.send(authUrl + '/SmartNotesStore/' + pure_filename);
		return;
	});
	myFile.pipe(writeStream); 
};
