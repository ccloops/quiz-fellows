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

Question.prototype.setCorrectIndex = function() {
  for( var answer in this.answers ) {
    if( this.answers[ answer ].isCorrect ) {
      this.correctAnswer = Number( answer );
      break;
    }
  }
};

Question.prototype.renderQuestion = function() { //render question to the page
  var sectionEl = document.getElementById( 'quiz' );
  sectionEl.innerHTML = null; //clear out old content
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










var myQuestion = new Question( 'What color is the table?' );
myQuestion.addAnswer( 'Purple' );
myQuestion.addAnswer( 'Blue' );
myQuestion.addAnswer( 'White', true );
myQuestion.addAnswer( 'Green' );
