Players = new Meteor.Collection("players");
Phrases = new Meteor.Collection("phrases");
Games   = new Meteor.Collection("games");
Guesses = new Meteor.Collection("guesses");

if (Meteor.isClient) {

    Meteor.subscribe('players', function () {
    });

    Meteor.subscribe('games', function(){
    });

    Meteor.subscribe('phrases', function () {
    });

    Meteor.subscribe('guesses', function () {
    });

    function getUserId() {
        return this.userId;
    }



    Template.listOfGames.games = function() {
        return Games.find({});
    };
    Template.createButton.events({
        'click #createGameButton': function(){
            //Meteor.call("createGame");
            Session.set("gameInitiationStatus", true);
            return false;
        }
    });
    Template.createButton.newGameDialog = function(){
       //var gameInitiationStatus = false;
        //console.log();
        //return gameInitiationStatus;
        return Session.get("gameInitiationStatus");
    };
}
