Players = new Meteor.Collection("players");
Phrases = new Meteor.Collection("phrases");
Games   = new Meteor.Collection("games");
Guesses = new Meteor.Collection("guesses");

if (Meteor.isClient) {

    Meteor.subscribe('players', function () {
        return Session.set("playersLoaded", true)
    });

    Meteor.subscribe('games', function onComplete() {
        return Session.set("gamesLoaded", true)
    });

    Meteor.subscribe('phrases', function () {
    });

    Meteor.subscribe('guesses', function () {
    });

    Template.main.gamesLoaded = function(){
        return Session.get("gamesLoaded");
    }
    Template.gamePlayers.playersLoaded = function(){
        return Session.get("playersLoaded");
    }

    //user does not have an id and will be shown the front page
    Template.main.showFrontPage = function(){
        return !Meteor.userId();
    };
    //user is now a player because the user has an id
    Template.main.showLobby = function(){
        var game = Games.find({ownerId: Meteor.userId()});
        //check to make sure player is not in a game and status is undefined
        //once a game of a player is undefined, the player can not be in any game state

        if(Meteor.userId() && game.count() === 0 && typeof game.fetch()[0] === "undefined")
            //return Meteor.userId();
            return Meteor.userId();
    };
    Template.lobby.userId = function(){
        return Meteor.userId();
    }
    //the list of games in the lobby
    Template.listOfGames.Game = function () {
        return Games.find();
    };
    Template.listOfGames.events({
        'click .joinGameButton': function(event){
            var joiningGameId = Games.find({_id: event.target.id}).fetch()[0]._id;
            console.log(joiningGameId);
            Meteor.call("joinGame",{gameId: joiningGameId});
            return false;
        }
    });
    Template.gamePlayers.Players = function() {
        console.log('the players');
        console.log(Players.find().fetch());
        return Players.find();
    };




        //events for the create new game dialog
    Template.createButton.events({
        //button to activate the create game dialog
        'click #createGameButton': function () {
            Session.set("gameInitiationStatus", true);
            return false;
        },
        //cancel button in the create a game dialog
        'click #createGameCancel': function () {
            Session.set("gameInitiationStatus", false);
            return false;
        },
        //create a game button in the create a game dialog
        'click #createGameSubmit': function () {
            var name = $('#createGameNameForm').val();
            Meteor.call("createGame",{
                name: name
            });
            return false;
        }
    });
    //status to the create game dialog
    Template.createButton.newGameDialog = function(){
        return Session.get("gameInitiationStatus");
    };
    //game is valid because there is a user id associated to a game
    //game must be in defined state of waiting, playing or finished
    Template.main.showGame = function(){
        var game = Games.find({ownerId: Meteor.userId()});
        if(Meteor.userId() && game.count() === 1 && (game.fetch()[0].status === "waiting" || game.fetch()[0].status === "playing"))
            return Meteor.userId();
    }
    //the game-play template
    Template.game.Games = function(){
        console.log(Games.find({ownerId: Meteor.userId()}));
        return Games.find({ownerId: Meteor.userId()});
    }

}
