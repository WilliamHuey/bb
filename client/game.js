
Phrases = new Meteor.Collection("phrases");
UserEntries = new Meteor.Collection("userEntries");

/*
Meteor.subscribe('phrases', function () {
console.log('Here');
	//console.log(Phrases.find());
	console.log(Phrases.find());
	
});

Meteor.subscribe('Phrases', function () {
console.log('Here2');
	//console.log(Phrases.find());
	console.log(Phrases.find());
	
});
*/

Meteor.subscribe('userEntries', function () {
    var userEntry = UserEntries.find();  
	//console.log(userEntry); 
});

Template.phrases.Phrases = function(){
		//Messages.remove({});
		//console.log(Phrases.find());
		//var phrase = Phrases.findOne();
		return Phrases.find();	
	};
