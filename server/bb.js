Players = new Meteor.Collection("players");
Phrases = new Meteor.Collection("phrases");
Games = new Meteor.Collection("games");
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
        if (!(typeof options.text === "string" && options.text.length &&
            typeof options.category === "string" && options.category.length))
            throw new Meteor.Error(400, "Required parameter missing");

        return Phrases.insert({
            text: options.text,
            category: options.category
        });
    },
    createPlayer: function(options) {
        options = options || {};
        if (!(options.gameId === "string" && options.gameId.length))
            throw new Meteor.Error(400, "Required parameter missing");

        var game = Games.findOne(options.gameId);

        if (!game)
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
        if (!(options.text === "string" && options.text.length &&
            options.playerId === "string" && options.playerId.length))
            throw new Meteor.Error(400, "Required parameter missing");
        var player = Players.findOne(options.playerId);
        var game = Games.findOne(options.gameId);
        if (!player)
            throw new Meteor.Error(404, "No such player");
        if (!game)
            throw new Meteor.Error(404, "No such game");
        if (!(game.status === "playing"))
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
        options = options || {};
        console.log('button was clicked');
        //console.log(options);
        if(!(options.gameName === "string" && options.gameName.length < 1))
            throw new Meteor.Error(400, "Required parameter missing");
        var player = Players.findOne(options.playerId);
        if(!player)
            throw new Meteor.Error(404, "No such player");
        if(!(lobby.status === "creating"))
            throw new Meteor.Error(404, "Need to create a game first");
        if(game.status === "playing")
            throw new Meteor.Error(404, "Already in a game");
    }
});


if (Meteor.isServer) {
    Games.remove({});
    Games.insert({gameName: "A name for a Game"});

    Meteor.publish("games", function() {
        return Games.find({});
    });

}
