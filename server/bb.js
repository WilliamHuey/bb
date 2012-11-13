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

// Makeshift validation library
var Validate = {
  maxMin: function(text) {
    
  }
}

Meteor.methods({
  createPhrase: function(options) {
    options = options || {};
    if(!(typeof options.text === "string" && options.text.length &&
         typeof options.category === "string" && options.category.length))
      throw new Meteor.Error(400, "Required parameter missing");
      
    return Phrases.insert({
      text: options.text,
      category: options.category
    });
  },
  createPlayer: function(options) {
    options = options || {};
    if(!(options.gameId === "string" && options.gameId.length))
      throw new Meteor.Error(400, "Required parameter missing");
    
    var game = Games.findOne(options.gameId);
    
    if(!game)
      throw new Meteor.Error(404, "No such game");
    
    // generate a color for the player
    var randColor = ("#" + Math.random().toString(16).slice(2, 8));
    
    Players.insert({
      userId: this.userId,
      gameId: game._id,
      score: 0,
      color: randColor
    });
  },
  createGuess: function(options) {
    options = options || {};
    if(!(options.text === "string" && options.text.length &&
         options.playerId === "string" && options.playerId.length))
      throw new Meteor.Error(400, "Required parameter missing");
    var player = Players.findOne(options.playerId);
    var game = Games.findOne(options.gameId);
    if(!player)
      throw new Meteor.Error(404, "No such player");
    if(!game)
      throw new Meteor.Error(404, "No such game");
    if(!(game.status === "playing"))
      throw new Meteor.Error(404, "Invalid game");
      
    return Guesses.insert({
      text: options.text,
      playerId: player._id,
      gameId: game._id,
      isGood: false,
      createdAt: new Date()
    });
  },
  createGame: function(options) {
    ;
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
            { text: "Some Phrase", category : "First Category" },
            { text: "Another Phrase", category: "Second Category" },
            { text: "Group of Words", category: "First Category" },
            { text: "Words in a Group", category: "Second Category" },
            { text: "Some more words", category: "First Category" },
            { text: "Bunch of Words", category: "Second Category" }
        ];
        
        for(var i = 0; i < phrases.length; i++) {
          Meteor.call('createPhrase', phrases[i], function(err, res) {
          });
        }
    });
}
