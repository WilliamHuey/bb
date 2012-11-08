Phrases = new Meteor.Collection("phrases");
UserEntries = new Meteor.Collection("userEntries");
UserColors = new Meteor.Collection("userColors");



if (Meteor.isClient) {

    Meteor.subscribe('userEntries', function () {
    });

    Meteor.subscribe('phrases', function () {
    });

    if (this.userId) {
        Meteor.subscribe('userColors', function () {
            if (UserColors.find({userid:this.userId}).count() === 0) {
                var userColor = ("#" + Math.random().toString(16).slice(2, 8));
                UserColors.insert({userid:this.userId, color:userColor});
            }
        });

    }

    ////////// Helpers for in-place editing //////////

    // Returns an event_map key for attaching "ok/cancel" events to
    // a text input (given by selector)
    var okcancel_events = function (selector) {
        return 'keyup ' + selector + ', keydown ' + selector + ', focusout ' + selector;
    };

    // Creates an event handler for interpreting "escape", "return", and "blur"
    // on a text field and calling "ok" or "cancel" callbacks.
    var make_okcancel_handler = function (options) {
        var ok = options.ok || function () {
        };
        var cancel = options.cancel || function () {
        };

        return function (evt) {
            if (evt.type === "keydown" && evt.which === 27) {
                // escape = cancel
                cancel.call(this, evt);
            } else if (evt.type === "keyup" && evt.which === 13) {
                // blur/return/enter = ok/submit if non-empty
                var value = String(evt.target.value || "");
                if (value)
                    ok.call(this, value, evt);
                else
                    cancel.call(this, evt);
            }
        };
    };

    Template.userInput.events = {};
    Template.userInput.events[okcancel_events('#inputofuser')] = make_okcancel_handler({
        ok:function (text, event) {

            //onsole.log(Session.get());
            //var another = Phrases.findOne(Session.get("something"));
            //console.log(another);

            var inputStuff = document.getElementById('inputofuser');

            function onlyAlphabets(inputtxt) {
                var letterNumber = /^[a-zA-Z]+$/;
                if (inputtxt.match(letterNumber)) {
                    return true;
                } else {
                    return false;
                }
            }

            if (onlyAlphabets(inputStuff.value) === true) {
                UserEntries.insert({userEntry:inputStuff.value});
                $('#errorMessage').html("");
                console.log($('.phrase').first().html());
            }
            else {
                $('#errorMessage').html("Sorry, can only enter letters");
            }

            event.target.value = "";

        }
    });

    Template.userEntries.userEntries = function () {
        return UserEntries.find();
    }

    Template.phrases.Phrases = function () {
        return Phrases.find();
    };

    Template.userColors.UserColors = function () {
        return UserColors.find();
    };

    Template.details.creatorName = function () {
        var owner = this.userId
        //var owner = Meteor.users.findOne(this.owner);
        //console.log(Meteor.users.find());
        console.log(owner);
        /*
         if (owner._id === Meteor.userId())
         return "me";
         return displayName(owner);
         */
    };

}
