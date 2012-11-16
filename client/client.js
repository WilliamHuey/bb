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

    Template.listOfGames.Game = function () {
        console.log(Games.find().fetch());
        //console.log('list of games');
        return Games.find();
    };
/*
    Handlebars.registerHelper('list', function(items, fn) {
        var out = "<ul>";

        for(var i=0, l=items.length; i<l; i++) {
            out = out + "<li>" + fn(items[i]) + "</li>";
        }
        return out + "</ul>";
    });
*/
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
