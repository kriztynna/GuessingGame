var target;
var maxGuesses = 5;
var guesses = [];
var guessesRemaining = function () {return maxGuesses-guesses.length;};

$(document).ready(function(){
	target =  setTarget();
	$('#guessButton').on('click', checkGuess);
	$('#guessBox').on('keyup', function(e){
		if (e.keyCode=='13') {checkGuess();$(this).val('');}
	})
	$('#startOver').on('click', startOver);
	$('#getHint').on('click', getHint);
	$('#guessBox').on('focus', function () {$(this).val('');});
})

function validateInput(){
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
	var currGuess = validateInput();
	var msg = "";
	if (currGuess) {
		if (currGuess==target) {
			guesses.push(currGuess)
			msg = 'You got it! The answer is '+target+"!";
			$('#msg').text(msg);
			/* Voila my creative flourish */
			$("#list").fadeOut('slow');
			$("#guessCounter").fadeOut('slow');
		}
		else {
			guesses.push(currGuess)
			
			var status = "";
			if (Math.abs(currGuess-target)<10) {status = "hot";}
			else {status="cold";}

			msg+= "You are "+status+". "; 

			if (guesses.length>1) {
				var progress = "";
				/* 
				 * Because the current guess has already been pushed to the array, its index is
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
			updateList();

			if ( guessesRemaining() < 1){ msg = 'Sorry, you\'re out of guesses.';}
			$('#msg').text(msg);
		}
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
	 * Add the target value, sort the array numerically, then
	 * find its position in the array.
	 */
	visualList.push(target)
	visualList.sort(function(a,b){return a-b;})

	/*
	 * Transform array elements jQuery objects too.
	 */
	for (var i=0;i<visualList.length;i++) {
		var value = visualList[i];

		if (value==target) {
			visualList[i] = '<span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span>';
		}

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
	target = setTarget();
	/* One method of clearing an array is to set its length to 0. */
	guesses.length = 0 
	$('#list').text("");
	var msg = "Your game has been restarted, submit a new guess!"
	$('#guessCounter').html("<span id='guessesRemaining'>5</span> guesses remaining")
	$('#msg').text(msg);
	$("#guessBox").val('');
	/* 
	 * We call show #list and #guessCounter again because they will have been
	 * hidden if the game has been won.
	 */
	$('#list').show();
	$('#guessCounter').show();
	$("#startOver").removeClass("btn-success");
	$("#startOver").addClass("btn-default");
}

function getHint() {
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

