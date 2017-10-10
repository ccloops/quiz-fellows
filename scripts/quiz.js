'use strict';

/*Answer Constructor*/
function Answer( answerText, isCorrect ) {
  this.answerText = answerText;
  this.isCorrect = isCorrect;
}


/*Question Constructor*/
function Question( questionText ) {
  this.questionText = questionText;
  this.answers = [];
  this.correctAnswer = -1;
  this.selectedAnswer = -1;
}

Question.prototype.addAnswer = function( answerText, isCorrect ) { //add a new answer to a question object
  if( typeof( isCorrect ) === 'undefined' ) { //establish a default value of false for isCorrect
    isCorrect = false;
  }
  this.answers.push( new Answer( answerText, isCorrect ) );
  this.setCorrectAnswer(); //last correct answer added will be set as the correct answer
};

Question.prototype.addAllAnswers = function( answers ) { //answers is an array of answer text strings, with the correct answer wrapped in an array as such: [ answerText ]
  answers.forEach( function( answer ) {
    if ( typeof( answer ) === 'string' ) {
      this.addAnswer( answer );
    } else {
      this.addAnswer( answer[ 0 ], true );
    }
  }.bind( this ) ); //binding to give the anonymous function context
};

Question.prototype.setCorrectAnswer = function() { //Set the correct answer, called on addAnswer
  for( var answer in this.answers ) {
    if( this.answers[ answer ].isCorrect ) {
      this.correctAnswer = Number( answer );
      break;
    }
  }
};

Question.prototype.setSelectedAnswer = function( selectedAnswer ) { //update the selected answer (called on answer click)
  this.selectedAnswer = selectedAnswer;
};

Question.prototype.renderQuestion = function() { //render question to the page
  var sectionEl = document.getElementById( 'quiz' );
  sectionEl.lastElementChild.remove();
  var articleEl = document.createElement( 'article' );
  var h2El = document.createElement( 'h2' );
  h2El.textContent = this.questionText;
  articleEl.appendChild( h2El );
  var olEl = document.createElement( 'ol' );
  olEl.id = 'answers-list';
  this.answers.forEach( function( answer, index ) {
    var liEl = document.createElement( 'li' );
    liEl.id = 'answer' + index;
    liEl.textContent = answer.answerText;
    olEl.appendChild( liEl );
  } );
  articleEl.appendChild( olEl );
  sectionEl.appendChild( articleEl );
};


/*Quiz Constructor*/
function Quiz( title, description ) {
  this.title = title;
  this.description = description;
  this.questions = [];
  this.currentQuestion = 0;
}

Quiz.prototype.addQuestionAndAnswers = function( questionText, answers ) { //answers is an array of answer text strings, with the correct answer wrapped in an array as such: [ answerText ]
  this.questions.push( new Question( questionText ) );
  this.questions[ this.questions.length - 1 ].addAllAnswers( answers );
};

Quiz.prototype.renderNext = function() { //change to the next question
  if( this.currentQuestion < this.questions.length - 1 ) {
    this.currentQuestion++;
    this.questions[ this.currentQuestion ].renderQuestion();
  }
  if( this.currentQuestion === this.questions.length - 1 ) {
    document.getElementById( 'next-button' ).textContent = 'Submit';
  }
  if( this.currentQuestion === 1 ) {
    document.getElementById( 'previous-button' ).removeAttribute( 'class' );
  }
};

Quiz.prototype.renderLast = function() { //change to the last question
  if( this.currentQuestion > 0 ) {
    this.currentQuestion--;
    this.questions[ this.currentQuestion ].renderQuestion();
  }
  if( this.currentQuestion === 0 ) {
    document.getElementById( 'previous-button' ).setAttribute( 'class', 'hidden' );
  }
  if( this.currentQuestion === this.questions.length - 2 ) {
    document.getElementById( 'next-button' ).textContent = 'Next';
  }
};

Quiz.prototype.renderButtons = function () { //called when a quiz is loaded for the first time to create the back and next buttons
  var sectionEl = document.getElementById( 'quiz' );
  sectionEl.innerHTML = null; //clears out main page

  [ 'Previous', 'Next' ].forEach( function ( label, index ) {
    var buttEl = document.createElement( 'button' );
    buttEl.textContent = label;
    if( Number( index ) === 0 ) {
      buttEl.setAttribute( 'class', 'hidden' ); //used to hide previous button on first page
      buttEl.id = 'previous-button';
      buttEl.addEventListener( 'click', this.renderLast.bind( this ) );
    } else {
      buttEl.id = 'next-button';
      buttEl.addEventListener( 'click', this.renderNext.bind( this ) );
    }
    sectionEl.appendChild( buttEl );
  }.bind( this )); //bind added to give context to anonymous function
  sectionEl.appendChild( document.createElement( 'div' ) );
  this.questions[ 0 ].renderQuestion();
};




var myQuiz = new Quiz( 'My First Quiz', 'A quiz to test the functionality of stuff.' );

myQuiz.addQuestionAndAnswers( 'What color is the table?', [
  'Purple',
  'Blue',
  [ 'White' ], //array indicates correct answer
  'Green'
] );

myQuiz.addQuestionAndAnswers( 'When is it time to go?', [
  'Never',
  '12:00',
  'Sometime',
  [ 'Whenever you need to' ]
] );

myQuiz.renderButtons();
// myQuiz.questions[ 0 ].renderQuestion();
