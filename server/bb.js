Phrases = new Meteor.Collection("phrases");
UserEntries = new Meteor.Collection("userEntries");
UserColors = new Meteor.Collection("userColors");

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

Meteor.publish('userColors', function () {
    return UserColors.find();
});

var displayName = function (user) {
    if (user.profile && user.profile.name)
        return user.profile.name;
    return user.emails[0].address;
};

if (Meteor.isServer) {
    Meteor.startup(function () {
        UserEntries.remove({});
        Phrases.remove({});
        UserColors.remove({});

        //UserColors.insert({session:Math.random()});
        //console.log('server restarted');
        /*
        var phrases = [
            ["Some Phrase", "First Category"],
            ["Another Phrase", "Second Category"],
            ["Group of Words", "First Category"],
            ["Words in a Group", "Second Category"],
            ["Some more words", "First Category"],
            ["Bunch of Words", "Second Category"]
        ];
        */

        var phrases = [
            ["Some Phrase", "Some Phrase"],
            ["Another Phrase", "Another Phrase"],
            ["Group of Words", "Group of Words"],
            ["Words in a Group", "Words in a Group"],
            ["Some more words", "Some more words"],
            ["Bunch of Words", "Bunch of Words"]
        ];

        function getRandomizer(a, b) {
            return Math.floor(Math.random() * (1 + b - a)) + a;
        }

        var indexPhrase = getRandomizer(0, (phrases.length - 1));
        console.log('random index is ' + indexPhrase);

        var lengthOfPhrase = phrases[indexPhrase][0].length;

        var phrase = phrases[indexPhrase][0];

        var nonWordIndex = [];
        //console.log('phrase length is ' + lengthOfPhrase);
        //console.log('phrase is ' + phrase);
        //console.log(phrase[0]);

        Phrases.insert({phrase:phrases[indexPhrase][0], category:phrases[indexPhrase][1]});

        for(var i=0; i< lengthOfPhrase; i++){
            if (phrase[i].match(/^[\t\n\v\f\r \u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000]+$/)){
                nonWordIndex.push(i);
            }
        }
        Phrases.insert({phraseLength: lengthOfPhrase, nonWordIndex: nonWordIndex});





    });
}
