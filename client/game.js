
Phrases = new Meteor.Collection("phrases");
userInputs = new Meteor.Collection("userInput");

Meteor.autosubscribe('phrases', function () {
  //if (!Session.get('list_id')) {
    var phrase = Phrases.findOne({}, {sort: {name: 1}});
    //if (list)
     // Router.setList(list._id);
 // }
console.log(phrase); 
});


