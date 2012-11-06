
Phrases = new Meteor.Collection("phrases");
Meteor.publish('phrases', function () {

/*
 rand = Math.random()

 result = db.docs.findOne( { key : 2, random : { $gte : rand } } )
 if ( result == null ) {
   result = db.docs.findOne( { key : 2, random : { $lte : rand } } )
}
*/


//console.log(Phrases.find());
  return Phrases.find();
});


userEntries = new Meteor.Collection("userEntries");
Meteor.publish('userEntries', function () {
  return userEntries.find();
});

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Phrases.find().count() === 0) {
      var phrases = ["Some Phrase",
                   "Another Phrase",
                   "Group of Words",
                   "Words in a Group",
                   "Some more words",
                   "Bunch of Words"];
      for (var i = 0; i < phrases.length; i++)
        Phrases.insert({phrase: phrases[i]});
    }
  });
}
