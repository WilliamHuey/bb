
if (Meteor.isClient) {

    function showLoginBox(){
        var loginButtonsSession = Accounts._loginButtonsSession;
        loginButtonsSession.set('dropdownVisible', true);
        Meteor.flush();
    }
    Meteor.startup(function(){
        //display a loading message to tell user to wait
        $('#frontPageNotice').html("Please wait. Loading ...");
    });

    //wait for accounts login button to load before loading the sign in portion
    Template.frontPage.rendered = function(){
        //opens up the login box
        showLoginBox();
        $(".login-button-form-submit").attr('unselectable', 'on');
        $('#login-email').focus();
        //$('#frontPageNotice').html("Please login or create an account to play.");
        Session.set("loginLoaded", true);
    };

    Meteor.subscribe('players', function () {
        return Session.set("playersLoaded", true);
    });

    Meteor.subscribe('games', function onComplete() {
        return Session.set("gamesLoaded", true);
    });

    Meteor.subscribe('phrases', function () {
    });

    Meteor.subscribe('guesses', function () {
    });

    //indicate that the games collection has loaded for the first time
    Template.main.gamesLoaded = function () {
        return Session.get("gamesLoaded");
    };

    //indicate that the players collection has loaded for the first time
    Template.main.playerLoaded = function () {
        return Session.get("playersLoaded");
    };

    //user does not have an id and will be shown the front page
    Template.main.showFrontPage = function () {
        if(!Meteor.userId()){
            showLoginBox();
        }
        return !Meteor.userId();
    };

    //user is still a user until the person is a player
    Template.main.showLobby = function () {
        var player = Players.find({userId:Meteor.userId()});
        var game = Games.find({ownerId:Meteor.userId()});
        //user cannot be player when there is no game associated with the user
        if (Meteor.userId() && game.count() === 0 && player.count() === 0 && typeof game.fetch()[0] === "undefined")
            return Meteor.userId();
        //user is in the lobby because that person is not a player
        if (Meteor.userId() && player.count() === 0)
            return Meteor.userId();
    };

    Template.lobby.userId = function () {
        return Meteor.userId();
    };

    //the list of games in the lobby
    Template.listOfGames.Game = function () {
        return Games.find();
    };

    //after clicking on the join button, the showGame is set to true
    Template.listOfGames.events({
        'click .joinGameButton':function (event) {
            var joiningGameId = Games.find({_id:event.target.id}).fetch()[0]._id;
            Meteor.call("joinGame", {gameId:joiningGameId}, function (err, data) {
                if (err)
                    console.log(err);
                if (data) {
                    Session.set("showGame", true);
                    Session.set("showLobby", false);
                }
            });
            return false;
        }
    });

    //determine if players collection is loaded in the game
    Template.main.playersLoaded = function () {
        if (Players.find().count() > 0) {
            return Meteor.userId();
        }
    };

    //events for the create new game dialog
    Template.createButton.events({
        //button to activate the create game dialog
        'click #createGameButton':function () {
            Session.set("gameInitiationStatus", true);
            return false;
        },
        //cancel button in the create a game dialog
        'click #createGameCancel':function () {
            Session.set("gameInitiationStatus", false);
            return false;
        },
        //create a game button in the create a game dialog
        'click #createGameSubmit':function () {
            var name = $('#createGameNameForm').val();
            Meteor.call("createGame", {
                name:name
            });
            return false;
        }
    });

    //status to the create game dialog
    Template.createButton.newGameDialog = function () {
        return Session.get("gameInitiationStatus");
    };

    //game is valid because there is a user id associated to a game
    //game must be in defined state of waiting, playing or finished
    Template.main.showGame = function () {
        var player = Players.find({userId:Meteor.userId()});
        var game = Games.find({ownerId:Meteor.userId()});
        //owner of game is in the game
        if (Meteor.userId() && game.count() === 1 && (game.fetch()[0].status === "waiting" || game.fetch()[0].status === "playing"))
            return Meteor.userId();
        //player has join a game
        if (Meteor.userId() && player.count() === 1)
            return Meteor.userId();
    };

    //the game-play template
    Template.game.Games = function () {
        return Games.find({ownerId:Meteor.userId()});
    };

    //display the players in a game
    Template.gamePlayers.Players = function () {
        return Players.find();
    };

}
