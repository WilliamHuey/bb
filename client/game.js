
Phrases = new Meteor.Collection("phrases");
UserEntries = new Meteor.Collection("userEntries");

/*
Meteor.subscribe('userEntries', function () {
    var userEntry = UserEntries.find();  
	//console.log(userEntry); 
});

Meteor.subscribe('userEntries', function () {
    var userEntry = UserEntries.find();  
	//console.log(userEntry); 
});
*/


 ////////// Helpers for in-place editing //////////
  
  // Returns an event_map key for attaching "ok/cancel" events to
  // a text input (given by selector)
  var okcancel_events = function (selector) {
    return 'keyup '+selector+', keydown '+selector+', focusout '+selector;
  };
  
  // Creates an event handler for interpreting "escape", "return", and "blur"
  // on a text field and calling "ok" or "cancel" callbacks.
  var make_okcancel_handler = function (options) {
    var ok = options.ok || function () {};
    var cancel = options.cancel || function () {};
  
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
	ok: function(text,event){
		var inputStuff = document.getElementById('inputofuser');

				function alphanumeric(inputtxt) {  
				 	var letterNumber = /^[a-zA-Z]+$/;  
				 	if(inputtxt.match(letterNumber)){  
				   		return true;						
				  	} else {   
				   		return false; 
				    }  
				} 

			if(alphanumeric(inputStuff.value) === true){
				UserEntries.insert({userEntry: inputStuff.value});
				$('#errorMessage').html("");
				console.log($('.phrase').first().html());
				
			}
			else {
				$('#errorMessage').html("Sorry, can only enter letters")
			}

		event.target.value = "";

		
	}
});

Template.userEntries.userEntries = function(){
	UserEntries.remove({});
	return UserEntries.find();
}

Template.phrases.Phrases = function(){
		console.log('last');
		return Phrases.find();	
	};


