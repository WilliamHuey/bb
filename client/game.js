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
                //generate a color for the user
                var userColor = ("#" + Math.random().toString(16).slice(2, 8));
                UserColors.insert({userid:this.userId, color:userColor});
            }
        });
        //console.log('id is now ' + this.userId);

        function getUserId() {
            return this.userId;
        }

        Template.userEntries.UserColors = function () {
            return UserColors.find();
        }

        //Template.userInput.events = {};
        Template.userInput.events({
            'keypress': function (event) {

                //detecting any changes in the input field
                $('#inputofuser').on('input propertychange',
                    function(event) {
                        //console.log('onchange');
                        var $thisValue = $(this).val();
                        var letterOnly = /^[a-zA-Z]+$/;

                        //adding an error if number is detected
                        if (! ($thisValue.match(letterOnly)) == true && $thisValue.length !== 0) {
                            //show the error message
                            //console.log('number detected');
                            $('.errorMessageHidden').addClass('showError').removeClass('errorMessageHidden');
                        }

                        //removing the error message if seen before
                        if (!! ($thisValue.match(letterOnly)) || $thisValue.length === 0) {
                            //remove the error message
                            //console.log('removing error message');
                            $('.showError').addClass('errorMessageHidden').removeClass('showError');
                        }

                        /*
                         //permitting the entry if no numbers detected and not empty length
                         if ($thisValue.match(letterOnly) && $thisValue.length !== 0) {
                         //valid input; enter is allowed on input field
                         console.log('valid input');
                         }
                         */
                    });

                var letterOnly = /^[a-zA-Z]+$/;
                var $this = $('#inputofuser');
                var $thisValue = $this.val();

                if (event.which === 13 && $('#inputofuser').val().match(letterOnly)) {
                    //output the valid result
                    var colorOfUser = UserColors.find({userid: getUserId()}).fetch()[0].color;
                    UserEntries.insert({userId: getUserId(), userEntry:$thisValue, userColor:colorOfUser});
                    //clear the input field upon successful enter
                    $this.val('');
                }
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
