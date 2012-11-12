Phrases = new Meteor.Collection("phrases");
PhraseInformation = new Meteor.Collection("phraseInformation");
UserEntries = new Meteor.Collection("userEntries");
UserColors = new Meteor.Collection("userColors");

//auto publish is on by default, and is removed by meteor remove autopublish
Meteor.publish('phrases', function () {
    return Phrases.find();
});

Meteor.publish('userEntries', function () {
    return UserEntries.find();
});

Meteor.publish('userColors', function () {
    return UserColors.find();
});

Meteor.publish('phraseInformation', function () {
    return PhraseInformation.find();
});

if (Meteor.isServer) {
    Meteor.startup(function () {

        //clear out the old collections when restarting the server
        var clearOutOldCollections = [UserEntries, Phrases, UserColors, PhraseInformation];
        var clearOutOldCollectionsLength = clearOutOldCollections.length;

        for(var i=0; i < clearOutOldCollectionsLength; i++){
            clearOutOldCollections[i].remove({});
        }

        //the phrases to choose from
        var phrases = [
            ["Some Phrase", "First Category"],
            ["Another Phrase", "Second Category"],
            ["Group of Words", "First Category"],
            ["Words in a Group", "Second Category"],
            ["Some more words", "First Category"],
            ["Bunch of Words", "Second Category"]
        ];

        //get a random number that is within the range of the phrases to choose from
        function getRandomNumber(a, b) {
            return Math.floor(Math.random() * (1 + b - a)) + a;
        }

        var indexPhrase = getRandomNumber(0, (phrases.length - 1));

        //the random index allows us to get a random phrase
        //get the random phrase length for iterating through
        var lengthOfPhrase = phrases[indexPhrase][0].length;

        //the actual random phrase
        var phrase = phrases[indexPhrase][0];

        //insert the random phrase into the phrase collection
        Phrases.insert({phrase:phrases[indexPhrase][0], category:phrases[indexPhrase][1]});

        for (var i = 0; i < lengthOfPhrase; i++) {
            //determine which position is an alphabet
            if (phrase[i].match(/^[a-zA-Z]+$/)) {
                PhraseInformation.insert({location: i, type: "letter"});
            //determine if position is a space
            } else if (phrase[i].match(/^[\t\n\v\f\r \u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000]+$/)){
                PhraseInformation.insert({location: i, type: "space"});
            }

        }
    });
}
