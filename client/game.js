
Phrases = new Meteor.Collection("phrases");
UserEntries = new Meteor.Collection("userEntries");



Meteor.subscribe('phrases', function () {



    //var phrase = Phrases.find();
//console.log(Phrases.find().length); 
});


Meteor.subscribe('userEntries', function () {
  //if (!Session.get('list_id')) {
    var userEntry = UserEntries.find();
    //if (list)
     // Router.setList(list._id);
 // }
console.log(userEntry); 
});

