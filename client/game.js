Phrases = new Meteor.Collection("phrases");
UserEntries = new Meteor.Collection("userEntries");
UserColors = new Meteor.Collection("userColors");


if (Meteor.isClient) {

    console.log(this.userId);
    console.log('top');

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
                    //console.log('current is id');
                    //console.log(idOfCurrent);



                    return UserColors.find();
                }

                

            }
        });

console.log('id is now ' + this.userId);
//begin


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
    
    function getUserId(){
      return this.userId;
    }


    Template.userInput.events = {};
    Template.userInput.events[okcancel_events('#inputofuser')] = make_okcancel_handler({
        ok:function (text, event) {
        //console.log('here');
            //status indicator if entry is permitted or not
    var allowedEntry = false;

    //clear out the input field upon refresh
    $('#inputStuff').val('');

    //detecting any changes in the input field
    $('#inputofuser').on('input propertychange',
    function(event) {

    var $thisValue = $(this).val();
    var letterNumber = /^[a-zA-Z]+$/;
    
    
        //adding an error if number is detected
    if (! ($thisValue.match(letterNumber)) == true && $thisValue.length !== 0) {
        //show the error message
        $('.errorMessageHidden').addClass('showError').removeClass('errorMessageHidden');
        allowedEntry = false;
    }

    //removing the error message if seen before
    if (! ($thisValue.match(letterNumber)) == false || $thisValue.length === 0) {
        //remove the error message
        $('.showError').addClass('errorMessageHidden').removeClass('showError');
        allowedEntry = false;
    }

    //permitting the entry if no numbers detected and not empty length
    if ($thisValue.match(letterNumber) && $thisValue.length !== 0) {
        //valid input; enter is allowed on input field
        allowedEntry = true;
    }
});

$('#inputofuser').on("keypress",
function(event) {

    if (event.which === 13 && allowedEntry === true) {

        var $this = $(this);
        var $thisValue = $(this).val();

        //output the valid result
        //$('#outputGuess').append(" " + $thisValue);
        
        var colorOfUser = UserColors.find({userid: getUserId()}).fetch()[0].color;
  
                UserEntries.insert({userId: getUserId(), userEntry:$thisValue, userColor:colorOfUser});

        //clear the input field
        $this.val('');
    }
});

            /*
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
    
                var colorOfUser = UserColors.find({userid: getUserId()}).fetch()[0].color;
  
                UserEntries.insert({userId: getUserId(), userEntry:inputStuff.value, userColor:colorOfUser});
          
                $('#errorMessage').html("");
                console.log($('.phrase').first().html());
            }
            else {
                $('#errorMessage').html("Sorry, can only enter letters");
            }

            event.target.value = "";
            */


        }
    }); //end  Template.userInput.events[okcancel_events('#inputofuser')]
//end
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
