
Phrases = new Meteor.Collection("phrases");
Meteor.publish('phrases', function () {

	//console.log(Phrases.find({},{phrase: "Bunch of Words", category: "Second Category"}));
  	return Phrases.find();
});


userEntries = new Meteor.Collection("userEntries");
Meteor.publish('userEntries', function () {
  return userEntries.find();
});

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Phrases.find().count() === 0) {
      var phrases = [["Some Phrase","First Category"],
                   ["Another Phrase", "Second Category"],
                   ["Group of Words", "First Category"],
                   ["Words in a Group", "Second Category"],
                   ["Some more words", "First Category"],
                   ["Bunch of Words", "Second Category"]];
      for (var i = 0; i < phrases.length; i++)
        Phrases.insert({phrase: phrases[i][0], category: phrases[i][1]});
    }
  });
}
