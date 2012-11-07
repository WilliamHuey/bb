Phrases = new Meteor.Collection("phrases");
UserEntries = new Meteor.Collection("userEntries");
UserColors = new Meteor.Collection("userColors");

/*
 //auto publish is on by default
 //Phrases = Phrases.find({},{phrase: "Some Phrase", category: "First Category"});
 Meteor.publish('phrases', function () {
 return Phrases.find();
 //console.log(Phrases.find({},{phrase: "Bunch of Words", category: "Second Category"}));
 //return Phrases.find({},{phrase: "Some Phrase", category: "First Category"});
 });

 Meteor.publish('userEntries', function () {
 return UserEntries.find();
 });
 */

if (Meteor.isServer) {
    Meteor.startup(function () {
        UserEntries.remove({});
        Phrases.remove({});
        UserColors.remove({});

        //UserColors.insert({session:Math.random()});
        //console.log('server restarted');
        var phrases = [
            ["Some Phrase", "First Category"],
            ["Another Phrase", "Second Category"],
            ["Group of Words", "First Category"],
            ["Words in a Group", "Second Category"],
            ["Some more words", "First Category"],
            ["Bunch of Words", "Second Category"]
        ];

        function getRandomizer(a, b) {
            return Math.floor(Math.random() * (1 + b - a)) + a;
        }

        var indexPhrase = getRandomizer(0, (phrases.length - 1));
        Phrases.insert({phrase:phrases[indexPhrase][0], category:phrases[indexPhrase][1]});

    });
}
