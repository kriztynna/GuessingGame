var target;
var maxGuesses = 5;
var guesses = [];
/*
 * guessesRemaining serves as shorthand to reaching this value that 
 * we'll need several times in the code, yet would be redundant to 
 * store and track separately. 
 */
var guessesRemaining = function () {return maxGuesses-guesses.length;};

$(document).ready(function(){
	target =  setTarget();
	/* 
	 * User can submit guess by clicking a button or hitting enter.
	 * Input field automatically cleared on enter and on focus event.
	 */
	$('#guessButton').on('click', checkGuess);
	$('#guessBox').on('keyup', function(e){
		if (e.which==13) {checkGuess();$(this).val('');}
	})
	$('#guessBox').on('focus', function () {$(this).val('');});
	$('#startOver').on('click', startOver);
	$('#getHint').on('click', getHint);
})

function validateInput(){
	/*
	 * Accepts and returns the input if and only if there are guesses
	 * remaining, the game hasn't been won yet, and the input is a number
	 * between 1 and 100 (inclusive) that hasn't been guessed already.
	 */
	var input = +$('#guessBox').val();
	var msg = "";
	if ( guesses.indexOf(target)>-1) {
		msg = 'You already won, silly! Let\'s get you a new game started.';
		$("#startOver").addClass("btn-success");
	}
	else if ( guessesRemaining() < 1) {
		msg = 'Sorry, you\'re out of guesses.';
	}
	else if (isNaN(input) || input<1 || input>100) {
		msg = ('Your guess needs to be a number between 1 and 100.');
	}
	else if (guesses.indexOf(input) > -1) {
		msg = "You already guessed that, try something else."
	}
	else {
		/* If none of the above, input must be valid. */
		return input;
	}
	/* 
	 * The below will only run if the input wasn't already 
	 * returned because it was valid. 
	 */
	$('#msg').text(msg);
	return false;
}

function checkGuess(){
	/* 
	 * currGuess will take on the value of the input if it
	 * was found to be valid, or false if not.
	 */
	var currGuess = validateInput();
	/*
	 * If the input value was passed to it above, currGuess 
	 * will read as true in the conditional.
	 */
	if (currGuess) {
		var msg = "";
		/* 
		 * If valid input, push it to the guesses array. Then take
		 * action based on how the guess compares to the target.
		 */
		guesses.push(currGuess)
		if (currGuess==target) {
			msg = 'You got it! The answer is '+target+'!';
			/* 
			 * Voilà my creative flourish!
			 * fadeTo() preferred over fadeOut() because we
			 * want the elements to continue taking up space. 
			 */
			$("#list").fadeTo(1000,0);
			$("#guessCounter").fadeTo(1000,0);
		}
		else {
			/* 
			 * If the guess was not on target, add to the visual list
			 * and continue the game.
			 */
			updateList();

			/*
			 * If this was the user's last chance to get it right, 
			 * give the game over message.
			 */
			if ( guessesRemaining() < 1){ 
				msg = 'Sorry, you\'re out of guesses.';
			}
			else {
				/*
				 * If the guess was not on target and the game is 
				 * not over, compose a message based on how close 
				 * the guess was (var status), whether it was better
				 * or worse than the last guess (var progress), and 
				 * whether the user should guess higher or lower 
				 * (var direction). 
				 */
				var msg = "";
				var status = "";
				if (Math.abs(currGuess-target)<10) {status = "hot";}
				else {status="cold";}

				msg+= "You are "+status+". "; 

				/*
				 * Only attempt comparison to previous entries if 
				 * guesses array is holding more than one guess in it.
				 */
				if (guesses.length>1) {
					var progress = "";
					/* 
					 * Since the current guess has already been pushed to the array, its index is
					 * guesses.length-1, and the index of the guess before it is guesses.length-2.
					 */
					var prevGuess = guesses[guesses.length-2];
					if (Math.abs(currGuess-target)<Math.abs(prevGuess-target)) {progress="closer";}
					else {progress="further away";}
					msg+="That was "+progress+" than your last guess. "
				}

				var direction = "";
				if (currGuess<target) {direction="higher";}
				else {direction="lower";}

				msg+= "Guess "+direction+"!"
			}
			
		}
		/* Display the appropriate message */
		$('#msg').text(msg);
	}
}

function updateList(){
	if (guessesRemaining() < 1) {
		$('#guessCounter').text('Click "Start over" to do it again!');
	}
	else {
		$("#guessesRemaining").text(guessesRemaining());
	}
	/* 
	 * Borrow the values from guesses array, because we're
	 * going to make modifications before displaying.
	 */
	var visualList = guesses.map(function(a){return a;});
	/* 
	 * Add the target value, then sort the array numerically.
	 */
	visualList.push(target)
	visualList.sort(function(a,b){return a-b;})

	/* Add HTML markup to each array object accordingly. */
	for (var i=0;i<visualList.length;i++) {
		var value = visualList[i];
		/* Replace the value with a question mark */
		if (value==target) {
			visualList[i] = '<span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span>';
		}
		/* 
		 * Add colors to previous guesses based on where they are
		 * in relation to the target.
		 */
		else {
			var classes = "";

			if (Math.abs(value-target)<10) {classes+="hot";}
			else {classes+="cold";}

			if (value<target) {classes+="-under";}
			else {classes+="-over";}
		
			visualList[i] = '<span class="'+classes+'">'+value+'</span>';
		}
	}
	var forDisplay = visualList.join(" ");
	$('#list').html(forDisplay);
}

function startOver() {
	/* Sets new target */
	target = setTarget();
	/* Clears guesses array. One method to do that is to set its length to 0. */
	guesses.length = 0;
	/* Clear the list display and the input field. */ 
	$('#list').text('');
	$("#guessBox").val('');
	/* Refresh contents of guessCounter and msg. */
	$('#guessCounter').html("<span id='guessesRemaining'>5</span> guesses remaining")
	$('#msg').text("Your game has been restarted, submit a new guess!");
	/* 
	 * Set opacity to 1 on #list and #guessCounter because it 
	 * will have been set to 0 if game has been won.
	 * See use of fadeTo() in checkGuess function.
	 */
	$('#list').css('opacity',1);
	$('#guessCounter').css('opacity',1);
	/* 
	 * Sets Start Over button color back to normal because 
	 * it could have been turned green earlier.
	 */
	$("#startOver").removeClass("btn-success");
	$("#startOver").addClass("btn-default");
}

function getHint() {
	/* 
	 * Gives away the answer, per spec. Requires user to have made 
	 * at least one guess beforehand.
	 */
	if (guesses.length>0){
		$('#guessCounter').text(target);
	}
	else {
		alert('You need to make a guess before getting a hint.')
	}
}

/* 
 * Math.random returns a number from 0 (inclusive) to 1 (exclusive).
 * Multiplying by 100 leads it to return a number from 0 up to (but not including) 100.
 * Math.floor rounds down to the nearest integer, giving us 0 to 99 (inclusive).
 * Adding 1 nudges up the range to 1-100 (inclusive), which is what we want.
 */
function setTarget(){
	return  Math.floor(Math.random() * 100) + 1;
}

