var target;
var guessesRemaining = 5;
var guesses = []

$(document).ready(function(){
	target =  setTarget();
	$('#guessButton').on('click', checkGuess);
	$('#guessBox').on('keyup', function(e){
		if (e.keyCode=='13') {checkGuess();}
	})
	$('#startOver').on('click', startOver);
	$('#getHint').on('click', getHint);
	$('#guessBox').on('focus', function () {$(this).val('');});
})

function checkGuess(){
	var currGuess = +$('#guessBox').val();
	var msg = "";
	if (guessesRemaining<1) {
		/* do nothing */
	}
	else if (isNaN(currGuess) || currGuess<1 || currGuess>100) {
		msg = ('Your guess needs to be a number between 1 and 100');
	}
	else if(currGuess==target){
		msg = 'You got it! The answer is '+target+"!";
		/* Voila my creative flourish */
		$("#list").fadeOut('slow');
		$("#guessCounter").fadeOut('slow');
	}
	else if (guesses.indexOf(currGuess) > -1) {
		msg = "You already guessed that, try something else."
	}
	else {

		var status = "";
		if (Math.abs(currGuess-target)<10) {status = "hot";}
		else {status="cold";}

		msg+= "You are "+status+". "; 

		if (guesses.length>=1) {
			var progress = "";
			var prevGuess = guesses[guesses.length-1];
			if (Math.abs(currGuess-target)<Math.abs(prevGuess-target)) {progress="closer";}
			else {progress="further away";}
			msg+="That was "+progress+" than your last guess. "
		}
		guesses.push(currGuess)

		var direction = "";
		if (currGuess<target) {direction="higher";}
		else {direction="lower";}

		msg+= "Guess "+direction+"!"
		reduceGuessesRemaining();
		updateList();
	}

	if (guessesRemaining<1){
		$('#msg').text('Sorry, you\'re out of guesses.');
	}
	else {
		$('#msg').text(msg);
	}
}

function reduceGuessesRemaining(){
	guessesRemaining--;
	if (guessesRemaining<1) {
		$('#guessCounter').text('Click "Start over" to do it again!');
	}
	else {
		$("#guessesRemaining").text(guessesRemaining);
	}
}

function startOver() {
	target = setTarget();
	guessesRemaining = 5;
	/* One method of clearing an array is to set its length to 0. */
	guesses.length = 0 
	$('#list').text("");
	var msg = "Your game has been restarted, submit a new guess!"
	$('#guessCounter').html("<span id='guessesRemaining'>5</span> guesses remaining")
	$('#msg').text(msg);
	/* 
	 * We call show #list and #guessCounter again because they will have been
	 * hidden if "Start Over" has been clicked.
	 */
	$('#list').show();
	$('#guessCounter').show();
}

function getHint() {
	$('#guessCounter').text(target);
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

function updateList(){
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