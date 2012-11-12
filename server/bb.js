Players = new Meteor.Collection("players");
Phrases = new Meteor.Collection("phrases");
Games   = new Meteor.Collection("games");
Guesses = new Meteor.Collection("guesses");

Players.allow({
  insert: function(userId, player) {
    return false;
  },
  update: function(userId, players, fields, modifier) {
    return false;
  },
  remove: function(userId, players) {
    return false;
  }
});

Phrases.allow({
  insert: function(userId, phrase) {
    return false;
  },
  update: function(userId, phrases, fields, modifier) {
    return false;
  },
  remove: function(userId, phrases) {
    return false;
  }
});

Games.allow({
  insert: function(userId, game) {
    // allow text input
    return false
  },
  update: function(userId, games, fields, modifier) {
    return false;
  },
  remove: function(userId, games) {
    return false;
  }
});

Guesses.allow({
  insert: function(userId, guess) {
    // allow text input
    return false;
  },
  update: function(userId, guesses, fields, modifier) {
    return false;
  },
  remove: function(userId, guesses) {
    return false;
  }
});

if (Meteor.isServer) {
    Meteor.startup(function () {

        //clear out the old collections when restarting the server
        var clearOutOldCollections = [Phrases];
        var clearOutOldCollectionsLength = clearOutOldCollections.length;

        for (var i = 0; i < clearOutOldCollectionsLength; i++) {
            clearOutOldCollections[i].remove({});
        }

        //the phrases to choose from
        var phrases = [
            { phrase: "Some Phrase", category : "First Category" },
            { phrase: "Another Phrase", category: "Second Category" },
            { phrase: "Group of Words", category: "First Category" },
            { phrase: "Words in a Group", category: "Second Category" },
            { phrase: "Some more words", category: "First Category" },
            { phrase: "Bunch of Words", category: "Second Category" }
        ];
        for(var i = 0; i < phrases.length; i++) {
          Phrases.insert(phrases[i]);
        }
        console.log(Phrases.find({}).fetch());
    });
}
