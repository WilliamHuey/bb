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

    function getUserId() {
        return this.userId;
    }

    //user does not have an id and will be shown the front page
    Template.main.showFrontPage = function(){
        console.log(Meteor.users.findOne({_id: this.userId}));
        console.log(Meteor.users.findOne());
        console.log('front show ' + this.userId);
        if(typeof getUserId() === "undefined")
            Session.set("showFrontPage", true);
        return Session.get("showFrontPage");
    };

    //user is now a player because the user has an id
    //front page variable is no longer true
    Template.main.showLobby = function(){
        console.log(Meteor.users.findOne({_id: this.userId}));
        console.log(Meteor.users.findOne());
        console.log('lobby show ' + this.userId);
        if(typeof getUserId() !== "undefined")
            Session.set("showLobby", true);
        return Session.get("showLobby");
    };

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
