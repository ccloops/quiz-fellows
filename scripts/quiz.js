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
};

Question.prototype.renderQuestion = function() {
  var sectionEl = document.getElementById( 'quiz' );
  sectionEl.innerHTML = null;
  var articleEl = document.createElement( 'article' );
  var h2El = document.createElement( 'h2' );
  h2El.id = 'question-text';
  h2El.textContent = this.questionText;
  articleEl.appendChild( h2El );
  var olEl = document.createElement( 'ol' );
  this.answers.forEach( function( answer, index ) {
    var liEl = document.createElement( 'li' );
    liEl.id = 'answer' + index;
    liEl.textContent = answer.answerText;
    olEl.appendChild( liEl );
  } );
  articleEl.appendChild( olEl );
  sectionEl.appendChild( articleEl );
};

var myQuestion = new Question( 'Who are the best teammates?' );
myQuestion.addAnswer( 'Catherine is the best teammate', true );
myQuestion.addAnswer( 'Joel is the best teammate', true );
myQuestion.addAnswer( 'Rob is the best teammate', true );
myQuestion.addAnswer( 'None of the above' );
