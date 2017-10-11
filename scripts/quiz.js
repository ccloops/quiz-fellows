'use strict';

/*Answer Constructor*/
function Answer( answerText, isCorrect ) {
  this.answerText = answerText;
  this.isCorrect = isCorrect;
}

/*Question Constructor*/
function Question( questionText ) {
  this.questionText = this.formatQuestionText( questionText );
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

Question.prototype.setSelectedAnswer = function( selectedAnswer ) { //update the selected answer and class label
  if( this.selectedAnswer > -1 ) {
    var liEl = document.getElementById( 'answer' + this.selectedAnswer );
    if( liEl.classList.length > 1 ) {
      liEl.classList.remove( 'selected' );
    } else {
      liEl.removeAttribute( 'class' );
    }
  }
  this.selectedAnswer = selectedAnswer;
  liEl = document.getElementById( 'answer' + this.selectedAnswer );
  if( liEl !== null ) {
    liEl.classList.add( 'selected' );
  }
};

Question.prototype.renderQuestion = function() { //render question to the page
  var articleEl = document.getElementById( 'quiz-content' );
  articleEl.innerHTML = null;
  articleEl.appendChild( this.questionText );
  var olEl = document.createElement( 'ol' );
  this.answers.forEach( function( answer, index ) {
    var liEl = document.createElement( 'li' );
    liEl.id = 'answer' + index;
    if( index % 2 === 0 ) { //add a shade class to even rows
      liEl.classList.add( 'shade' );
    }
    if( index === this.selectedAnswer ) { //add a class of selected to previously selected answer
      liEl.classList.add( 'selected' );
    }
    liEl.textContent = answer.answerText;
    olEl.appendChild( liEl );
  }.bind( this ) );
  articleEl.appendChild( olEl );
};

Question.prototype.formatQuestionText = function( questionText ) { //adds line breaks if <br> found, returns h3 element
  var h3El = document.createElement( 'h3' );
  h3El.id = 'question-text';
  if( questionText.includes( '<br>' ) ) {
    var pieces = questionText.split( '<br>' );
    pieces.forEach( function( phrase ) {
      var divEl = document.createElement( 'div' );
      divEl.textContent = phrase;
      h3El.appendChild( divEl );
    } );
  } else {
    h3El.textContent = questionText;
  }
  return h3El;
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

Quiz.prototype.renderPrevious = function() { //change to the last question
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

Quiz.prototype.renderQuiz = function () { //called when a quiz is loaded for the first time to create the back and next buttons
  var sectionEl = document.getElementById( 'quiz' );
  sectionEl.innerHTML = null; //clears out main page

  [ 'Previous', 'Next' ].forEach( function ( label, index ) {
    var buttEl = document.createElement( 'button' );
    buttEl.textContent = label;
    if( Number( index ) === 0 ) {
      buttEl.setAttribute( 'class', 'hidden' ); //used to hide previous button on first page
      buttEl.id = 'previous-button';
      buttEl.addEventListener( 'click', this.renderPrevious.bind( this ) );
    } else {
      buttEl.id = 'next-button';
      buttEl.addEventListener( 'click', this.renderNext.bind( this ) );
    }
    sectionEl.appendChild( buttEl );
  }.bind( this )); //bind added to give context to anonymous function
  var articleEl = document.createElement( 'article' );
  articleEl.id = 'quiz-content';
  articleEl.addEventListener( 'click', this.handleSelectAnswer.bind( this ) );
  sectionEl.appendChild( articleEl );
  this.questions[ 0 ].renderQuestion();
};

Quiz.prototype.handleSelectAnswer = function ( e ) { //set selected answer when clicked
  var ansNum = e.target.id.replace( 'answer', '' );
  var currentQuestion = this.questions[ this.currentQuestion ];
  if( ansNum.length === 1 && currentQuestion.selectedAnswer !== Number( ansNum ) ) {
    currentQuestion.setSelectedAnswer( Number( ansNum ) );
  }
};

Quiz.prototype.getPoints = function () {
  var pointsEarned = 0;
  this.userAnswers = [];
  for( var i = 0; i < this.questions.length; i++ ) {
    if ( this.questions[i].selectedAnswer === this.questions[i].correctAnswer ) {
      pointsEarned++;
      this.userAnswers.push( true );
    } else {
      this.userAnswers.push( false );
    }
  }
  return pointsEarned;
};

Quiz.prototype.getPercent = function () {
  var points = this.getPoints();
  var percent = points / this.questions.length;
  percent = Math.floor( percent * 10000 ) / 100;
  return percent;
};

Quiz.prototype.renderResults = function() {
  var percent = this.getPercent();
  var sectionEl = document.getElementById( 'quiz' );
  var results = '<h2>User\'s Results</h2><ol>'; // TODO: ADD USER NAME
  for( var i in this.questions ) {
    results += '<li class="';
    if( ! this.userAnswers[ i ] ) {
      results += 'in';
    }
    results += 'correct" id="question' + i + '"><h3>Question ' + ( Number( i ) + 1 ) + '</h3></li>';
  }
  sectionEl.innerHTML = results;
  for( var j in this.questions ) {
    var liEl = document.getElementById( 'question' + j );
    liEl.appendChild( this.questions[ j ].questionText );
  }

  // results = 'You earned ' + this.getPoints() + ' out of ' + this.questions.length + ' possible points for a score of ' + this.getPercent();

};
