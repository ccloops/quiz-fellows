'use strict';

/*Answer Constructor*/
function Answer( answerText, isCorrect ) {
  this.answerText = answerText;
  this.isCorrect = isCorrect;
}

/*Question Constructor*/
function Question( questionText ) {
  this.rawQuestionText = questionText;
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

Question.prototype.formatQuestionText = function( questionText ) { //adds line breaks if <br> found, returns p element
  var pEl = document.createElement( 'p' );
  pEl.id = 'question-text';
  if( questionText.includes( '<br>' ) ) {
    var pieces = questionText.split( '<br>' );
    pieces.forEach( function( phrase ) {
      var divEl = document.createElement( 'div' );
      divEl.textContent = phrase;
      pEl.appendChild( divEl );
    } );
  } else {
    pEl.textContent = questionText;
  }
  return pEl;
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
  if( this.currentQuestion === this.questions.length - 1 ) {
    if( this.checkAnswers() ) {
      return Quiz.currentQuiz.renderResults();
    } else {
      return alert( 'Please answer the following question(s) before continuing:\n\n' + this.unansweredQuestions.join( ', ' ) );
    }
  }
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

Quiz.prototype.checkAnswers = function () { //determine if there are any unansweredQuestions
  this.unansweredQuestions = [];
  Quiz.currentQuiz.questions.forEach( function( question, index ) {
    if( question.selectedAnswer === -1 ) {
      this.unansweredQuestions.push( index + 1 );
    }
  }.bind( this ) );
  if( this.unansweredQuestions.length === 0 ) { //return true if all answered
    return true;
  } else { //return false if any unanswered
    return false;
  }
};

Quiz.prototype.renderResults = function() { // TODO: must have all answers selected before calling this
  var sectionEl = document.getElementById( 'quiz' );
  var results = '<h2>User\'s Results</h2>'; // TODO: ADD USER NAME
  results += '<h3>You earned ' + this.getPoints() + ' out of ' + this.questions.length + ' possible points for a score of ' + this.getPercent() + '%.</h3><ol>';
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
    var h3El = document.createElement( 'h3' );
    h3El.textContent = 'Your response: ';
    liEl.appendChild( h3El );
    var pEl = document.createElement( 'p' );
    pEl.textContent = this.questions[ j ].answers[ this.questions[ j ].selectedAnswer ].answerText;
    liEl.appendChild( pEl );
  }
};

Quiz.getUser = function() {
  Quiz.allUsers = JSON.parse( localStorage.users ); //Add all user objects from localStorage to array
  Quiz.currentUserIndex = Number( localStorage.currentUser ); //load locally the current user Index
  Quiz.currentUser = Quiz.allUsers[ Quiz.currentUserIndex ]; //local reference to the current user
};

Quiz.instantiateQuestion = function( questionObject ) { //reinstantiates a question from a returned JSON "questionObject"
  var questionText = questionObject.rawQuestionText;
  var answers = questionObject.answers;
  var newQuestion = new Question( questionText );
  for( var answer in answers ) {
    newQuestion.addAnswer( answers[ answer ].answerText, answers[ answer ].isCorrect );
  }
  return newQuestion;
};

Quiz.getQuiz = function( index ) {
  var tempQuiz = Quiz.currentUser.myQuizzes[ index ]; //grab the quiz at index (referenced from click on first quiz page)
  Quiz.currentQuiz = new Quiz( tempQuiz.title, tempQuiz.description );
  for( var question in tempQuiz.questions ) { //reinstantiate each question and add it to the reinstantiated quiz
    Quiz.currentQuiz.questions.push( Quiz.instantiateQuestion( tempQuiz.questions[ question ] ) );
  }
};

Quiz.getQuizAndRender = function( index ) { //needs Quiz.getUser() first, which should happen on pageLoad
  Quiz.getQuiz( index );
  Quiz.currentQuiz.renderQuiz();
};

Quiz.getUser();
