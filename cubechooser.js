Cubes = new Mongo.Collection('cubes');

if (Meteor.isClient) {
  
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
		var dir = "../../../../../public/cubes/";//process.cwd()+"/../web.browser/app/public/cubes";
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
		console.log("loading Foo end");

	});
}
