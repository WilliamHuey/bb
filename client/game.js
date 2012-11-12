Phrases = new Meteor.Collection("phrases");
PhraseInformation = new Meteor.Collection("phraseInformation");
UserEntries = new Meteor.Collection("userEntries");
UserColors = new Meteor.Collection("userColors");

if (Meteor.isClient) {

    Meteor.subscribe('userEntries', function () {
    });

    Meteor.subscribe('phrases', function () {
    });

    Meteor.subscribe('phraseInformation', function () {
    });

    //only subscribe to the collections if user is logged in
    //users not logged in should not have access to any collections
    if (this.userId) {
        console.log('here');
        Meteor.subscribe('userColors', function () {
            //make sure the user is logged in before a color is assigned
            if (UserColors.find({userid:this.userId}).count() === 0) {
                //generate a color for the user
                var userColor = ("#" + Math.random().toString(16).slice(2, 8));
                //insert into the UserColors collection
                UserColors.insert({userid:this.userId, color:userColor});
            }
        });

        function getUserId() {
            return this.userId;
        }

        Template.userEntries.UserColors = function () {
            return UserColors.find();
        };

        Template.userInput.events({
            'keypress': function (event) {

                //detecting any changes in the input field
                $('#inputofuser').on('input propertychange',
                    function(event) {
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
        }); //end Template.userInput.events

        Template.userEntries.userEntries = function () {
            return UserEntries.find();
        };

        Template.phrases.Phrases = function () {
            return Phrases.find();
        };

        Template.phraseInformationHeader.phraseInfo = function () {
            return PhraseInformation.find();
        };
    }


}
