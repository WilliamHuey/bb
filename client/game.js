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

                var idOfCurrent = this.userId + "";

                Template.userEntries.UserColors = function () {
                    return UserColors.find();
                }
            }
        });

        //console.log('id is now ' + this.userId);

        /*
        ////////// Helpers for in-place editing //////////

        // Returns an event_map key for attaching "ok/cancel" events to
        // a text input (given by selector)
        var okcancel_events = function (selector) {
            return 'keyup ' + selector + ', keypress ' + selector + ', focusout ' + selector;
        };

        // Creates an event handler for interpreting "escape", "return", and "blur"
        // on a text field and calling "ok" or "cancel" callbacks.
        var make_okcancel_handler = function (options) {
            var ok = options.ok || function () {
            };
            var cancel = options.cancel || function () {
            };

            return function (evt) {
                if (evt.type === "keypress" && evt.which === 27) {
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
        */
        function getUserId() {
            return this.userId;
        }

        //Template.userInput.events = {};
        Template.userInput.events({
            'keypress': function (event) {
                console.log('here');
                //status indicator if entry is permitted or not
                var allowedEntry = false;

                

                //clear out the input field upon refresh
                //$('#inputofuser').val('');

                //detecting any changes in the input field
                $('#inputofuser').on('input propertychange',
                    function(event) {
                        console.log('onchange');
                        var $thisValue = $(this).val();
                        var letterNumber = /^[a-zA-Z]+$/;

                        //adding an error if number is detected
                        if (! ($thisValue.match(letterNumber)) == true && $thisValue.length !== 0) {
                            //show the error message
                            console.log('number detected');
                            $('.errorMessageHidden').addClass('showError').removeClass('errorMessageHidden');
                            allowedEntry = false;
                        }

                        //removing the error message if seen before
                        if (! ($thisValue.match(letterNumber)) == false || $thisValue.length === 0) {
                            //remove the error message
                            console.log('removing error message');
                            $('.showError').addClass('errorMessageHidden').removeClass('showError');
                            allowedEntry = false;
                        }

                        //permitting the entry if no numbers detected and not empty length
                        if ($thisValue.match(letterNumber) && $thisValue.length !== 0) {
                            //valid input; enter is allowed on input field
                            console.log('valid input');
                            allowedEntry = true;
                        }
                    });

                //$('#inputofuser').on("keypress",
                    //function(event) {
                           console.log('evaluation');
                            console.log(allowedEntry);
                            console.log('____________________');

                        var letterNumber = /^[a-zA-Z]+$/;
                        var $this = $('#inputofuser');
                        var $thisValue = $this.val();

                        if (event.which === 13 && $('#inputofuser').val().match(letterNumber)) {
                            console.log('allowed entry');
                           

                            //output the valid result

                            var colorOfUser = UserColors.find({userid: getUserId()}).fetch()[0].color;

                            UserEntries.insert({userId: getUserId(), userEntry:$thisValue, userColor:colorOfUser});

                            //clear the input field
                            $this.val('');
                        }
                        /*
                        if (event.which === 13 && allowedEntry === false) {
                             console.log('suppose to go here if number was entered')
                            event.preventDefault();
                        }
                        */
                    //});
            }
        }); //end  Template.userInput.events[okcancel_events('#inputofuser')]
    }


    Template.userEntries.userEntries = function () {
        return UserEntries.find();
    }

    Handlebars.registerHelper('getStatusColor', function (color) {
        return color;
    });

    Template.phrases.Phrases = function () {
        return Phrases.find();
    };

/*
    Template.details.creatorName = function () {
        var owner = this.userId
        console.log(owner);
    };
*/
}
