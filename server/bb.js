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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function mulStr (str, num) {
    if (!num) return "";
    var	orig = str,
        soFar = [str],
        added = 1,
        left, i;
    while (added < num) {
        left = num - added;
        str = orig;
        for (i = 2; i < left; i *= 2) {
            str += str;
        }
        soFar.push(str);
        added += (i / 2);
    }
    return soFar.join("");
}

Meteor.methods({
    createPhrase: function(options) {
        options = options || {};
        if (!(typeof options.text === "string" && options.text.length &&
            typeof options.category === "string" && options.category.length))
            throw new Meteor.Error(400, "Required parameter missing");

        return Phrases.insert({
            text: options.text,
            category: options.category,
            randomIdx: getRandomInt(1, 500)
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
    getRandPhrase: function() {
      var phrase = Phrases.findOne({randomIdx: getRandomInt(1, 500)});
      while(!phrase)
        phrase = Phrases.findOne({randomIdx: getRandomInt(1, 500)});
      return phrase;
    },
    createGame: function(options) {
      var today = new Date();
      var phrase = this.getRandPhrase();
      return Games.insert({
        name: options.name || "Game " + today.toString(),
        maxPlayers: 2,
        jackpot: 0,
        guessPhrase: multStr(' ', phrase.text.length),
        status: 'waiting',
        createdAt: today,
        startedAt: null,
        endedAt: null
      });
    }
});


if (Meteor.isServer) {
    Games.remove({});
    Games.insert({gameName: "A name for a Game"});

    Meteor.publish("games", function() {
        return Games.find({});
    });

}
