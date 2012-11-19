

if (Meteor.isServer) {
    Meteor.startup(function () {
        Games.remove({});
        Players.remove({});
    });
    Meteor.publish("games", function () {
        return Games.find({});
    });
    Meteor.publish("players", function () {
        return Players.find({});
    });
}
