Players = new Meteor.Collection("players");
Phrases = new Meteor.Collection("phrases");
Games   = new Meteor.Collection("games");
Guesses = new Meteor.Collection("guesses");

if (Meteor.isClient) {

    Meteor.subscribe('players', function () {
    });

    Meteor.subscribe('games', function () {
    });

    Meteor.subscribe('phrases', function () {
    });

    Meteor.subscribe('guesses', function () {
    });

    //user does not have an id and will be shown the front page
    Template.main.showFrontPage = function(){
        return !Meteor.userId();
    };

    //user is now a player because the user has an id
    Template.main.showLobby = function(){
        return Meteor.userId();
    };
    //game is valid because there is a user id associated to game
    Template.main.showGame = function(){
        if(Games.find({ownerId: Meteor.userId()}).count() > 0)
            return true
    }
    Template.game.Games = function(){
        return Games.find();
    }

    Template.listOfGames.Game = function () {
        return Games.find();
    };


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
            console.log('create game attempt');
            return false;
        }
    });
    //status to the create game dialog
    Template.createButton.newGameDialog = function(){
        return Session.get("gameInitiationStatus");
    };
}
