Players = new Meteor.Collection("players");
Phrases = new Meteor.Collection("phrases");
Games = new Meteor.Collection("games");
Guesses = new Meteor.Collection("guesses");

Players.allow({
    insert:function (userId, player) {
        return false;
    },
    update:function (userId, players, fields, modifier) {
        return false;
    },
    remove:function (userId, players) {
        return false;
    }
});

Phrases.allow({
    insert:function (userId, phrase) {
        return false;
    },
    update:function (userId, phrases, fields, modifier) {
        return false;
    },
    remove:function (userId, phrases) {
        return false;
    }
});

Games.allow({
    insert:function (userId, game) {
        // allow text input
        return false
    },
    update:function (userId, games, fields, modifier) {
        return false;
    },
    remove:function (userId, games) {
        return false;
    }
});

Guesses.allow({
    insert:function (userId, guess) {
        // allow text input
        return false;
    },
    update:function (userId, guesses, fields, modifier) {
        return false;
    },
    remove:function (userId, guesses) {
        return false;
    }
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

Meteor.methods({
    createPhrase:function (options) {
        var options = options || {};
        //phrase must have defined length and of data type string
        if (!(typeof options.text === "string" && options.text.length &&
            typeof options.category === "string" && options.category.length))
            throw new Meteor.Error(400, "Required parameter missing");
        return Phrases.insert({
            text:options.text,
            category:options.category,
            randomIdx:getRandomInt(1, 500)
        });
    },
    createPlayer:function (options) {
        var options = options || {};
        var game = Games.findOne(options.gameId);
        // generate a color for the player
        var randColor = ("#" + Math.random().toString(16).slice(2, 8));
        //game must have name and has a gameId
        if (!(typeof options.gameId === "string" && options.gameId.length > 0))
            throw new Meteor.Error(400, "Required parameter missing");
        //game must exist
        if (!game)
            throw new Meteor.Error(404, "No such game");
        Players.insert({
            userId:Meteor.userId(),
            gameId:game._id,
            score:0,
            color:randColor
        });
        return Players.find().fetch();
    },
    createGuess:function (options) {
        var options = options || {};
        var player = Players.findOne(options.playerId);
        var game = Games.findOne(options.gameId);

        if (!(typeof options.text === "string" && options.text.length > 0 &&
            typeof options.playerId === "string" && options.playerId.length > 0))
            throw new Meteor.Error(400, "Required parameter missing");
        if (!player)
            throw new Meteor.Error(404, "No such player");
        if (!game)
            throw new Meteor.Error(404, "No such game");
        if (!(game.status === "playing"))
            throw new Meteor.Error(404, "Invalid game");

        return Guesses.insert({
            text:options.text,
            playerId:player._id,
            gameId:game._id,
            isGood:false,
            createdAt:new Date()
        });
    },
    createGame:function (options) {
        Phrases.remove({});
        Phrases.insert({text:"A phrase to remember", category:"A Category"});
        var phrase = Phrases.findOne({text:"A phrase to remember", category:"A Category"});
        var today = new Date();
        //owner of game can't make another game
        if (Games.find({ownerId:Meteor.userId()}).count() === 1)
            throw new Meteor.Error(400, "You already created a game");
        //player in a game can't create a new game
        if (Players.find({userId:Meteor.userId()}).count() === 1)
            throw new Meteor.Error(400, "Already playing a game")
        Games.insert({
            ownerId:Meteor.userId(),
            name:options.name || "Game " + today.toString(),
            maxPlayers:2,
            phrase:phrase.text,
            category:phrase.category,
            jackpot:0,
            guessPhrase:new Array(phrase),
            status:'waiting',
            createdAt:today,
            startedAt:null,
            endedAt:null,
            players:[]
        });
        //a owner of a game is also a player
        var gameInfo = {};
        gameInfo.gameId = Games.find({ownerId:Meteor.userId()}).fetch()[0]._id;
        //make the owner a player
        Meteor.call("createPlayer", gameInfo);
    },
    joinGame:function (options) {
        var gameId = Games.findOne(options.gameId);
        //must be valid user
        if (!Meteor.userId())
            throw new Meteor.Error(400, "Not a valid user")
        //user is already a player in another game
        if (Players.find({userId:Meteor.userId()}).count() === 1)
            throw new Meteor.Error(404, "Already playing another game.");
        //player cannot join an invalid game
        if (!gameId)
            throw new Meteor.Error(404, "No such game");
        //player can not join if game already has max permitted players in room
        if (Players.find({gameId:gameId}).count() === Games.findOne(options.maxPlayers))
            throw new Meteor.Error(400, "Game is full");
        var playerCreated = {};
        //joining a game makes the user a player
        //playerCreated callback to wait for player creation
        Meteor.call("createPlayer", options, function (err, data) {
            if (err)
                console.log(err);
            playerCreated = data;
        });
        return playerCreated;
    }
});