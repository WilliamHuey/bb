
Phrases = new Meteor.Collection("phrases");
UserEntries = new Meteor.Collection("userEntries");

Meteor.subscribe('phrases', function () {
	//console.log(Phrases.find());
	

});


Meteor.subscribe('userEntries', function () {
    var userEntry = UserEntries.find();  
	//console.log(userEntry); 
});

Template.phrases.Phrases = function(){
		//Messages.remove({});
		return Phrases.find();	
	};
