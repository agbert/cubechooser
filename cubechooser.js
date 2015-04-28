Cubes = new Mongo.Collection('cubes');

if (Meteor.isClient) {
	Router.map( function () {
	  this.route('hello', {path: '/'});
	  this.route('list');
	});  
	// counter starts at 0
	Session.setDefault('counter', 0);
  
	Template.cubes.helpers({
		cubes: function() {
			icubes = [];
			for (i=0; i<9; i++) {
				icube = Cubes.findOne( { random_point : { $near : [Math.random(), 0] } } );
				if (typeof icube !== 'undefined') {
					if (typeof console !== 'undefined') {
						console.log(icube);
					}
					icubes.push(icube);
				}
			}
			if (typeof console !== 'undefined') {
				console.log('icubes:'+icubes.length);
			}
			return icubes; //Cubes.find({});
		}
	});

	Template.allCubes.helpers({
		cubes: function() {
			icubes = Cubes.find({});
			if (typeof console !== 'undefined') {
				console.log('icubes:'+icubes.length);
			}
			return icubes; //Cubes.find({});
		}
	});

	Template.hello.helpers({
		counter: function () {
			return Session.get('counter');
		}
	});

	Template.hello.events({
		'click button': function () {
			// increment the counter when button is clicked
			Session.set('counter', Session.get('counter') + 1);
		}
	});
	Meteor.autorun(function() {
		Meteor.subscribe("cubes");
	});
}

if (Meteor.isServer) {
	Meteor.publish("cubes", function () {
		return Cubes.find({});
	});

	Meteor.startup(function () {
	// code to run on server at startup
	//Inspector.runIfDebugging();
		Cubes.remove({});
		var fs = Npm.require('fs');
		var dir = process.env.PWD +"/public/cubes/";
		var files = fs.readdirSync(dir);
		console.log("loading Foo start");
		console.log("file count:"+files.length);
		for (i=0;i<files.length;i++) {
			console.log('file:'+files[i]);
			icube = Cubes.findOne({name:files[i]});
			if (typeof icube === "undefined") {
				console.log(icube);
				console.log("insert:"+files[i]);
				Cubes.insert({
					name:files[i],
					cnt:i,
					random_point: [Math.random(), 0]
				});
				console.log("inserted");
			} else {
				console.log("not inserted");
			}
		}
		var icubes = Cubes.find({});
		console.log("loading Foo end:"+icubes.count());
		console.log("Path:"+process.env.PWD);
		
		UploadServer.init({
		    tmpDir: process.env.PWD +'/public/tmp',
		    uploadDir: process.env.PWD +'/public/cubes/',
//		    getDirectory: function(file, formData) {
//				return formData.contentType;
//		    },
			imageTypes: /\.(gif\|jpe?g\|jpg\|png)$/i,
			//imageVersions: {Big: {width: 640, height: 640}},
			mimeTypes: {
			    "jpeg": "image/jpeg",
			    "jpg": "image/jpeg",
			    "png": "image/png",
			    "gif": "image/gif",
			  },
		    finished: function(file, folder, formFields) {
				console.log('Write to database: ' + folder + '/' + file);
		  		var fs = Npm.require('fs');
		  		var dir = process.env.PWD + "/public/cubes/";
		  		var files = fs.readdirSync(dir);
		  		console.log("loading Foo2 start");
		  		console.log("file count:"+files.length);
		  		for (i=0;i<files.length;i++) {
		  			console.log('file:'+files[i]);
		  			icube = Cubes.findOne({name:files[i]});
		  			if (typeof icube === "undefined") {
		  				console.log(icube);
		  				console.log("insert:"+files[i]);
		  				Cubes.insert({
		  					name:files[i],
		  					cnt:i,
		  					random_point: [Math.random(), 0]
		  				});
		  				console.log("inserted");
		  			} else {
		  				console.log("not inserted");
		  			}
		  		}
		  		console.log("loading Foo2 end");
		    }
		  });

	});
}
