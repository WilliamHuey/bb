Meteor.startup(function () {
    Games.remove({});
    Games.insert({name: "A name for a Game"});
});

Meteor.publish("games", function() {
    return Games.find({});
});