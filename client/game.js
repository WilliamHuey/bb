
Phrases = new Meteor.Collection("phrases");
UserEntries = new Meteor.Collection("userEntries");

Meteor.subscribe('phrases', function () {
  //if (!Session.get('list_id')) {
    var phrase = Phrases.findOne({}, {sort: {name: 1}});
    //if (list)
     // Router.setList(list._id);
 // }
console.log(phrase); 
});


Meteor.subscribe('userEntries', function () {
  //if (!Session.get('list_id')) {
    var userEntry = UserEntries.find();
    //if (list)
     // Router.setList(list._id);
 // }
console.log(userEntry); 
});

