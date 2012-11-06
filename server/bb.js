
Phrases = new Meteor.Collection("phrases");
Meteor.publish('phrases', function () {
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
