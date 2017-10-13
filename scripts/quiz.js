'use strict';

//////////////////////
//Answer Constructor//
//////////////////////
function Answer( answerText, isCorrect ) {
  this.answerText = answerText;
  this.isCorrect = isCorrect;
}


////////////////////////
//Question Constructor//
////////////////////////

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
  this.articleEl = document.getElementById( 'quiz-content' );
  this.articleEl.innerHTML = null;
  this.articleEl.appendChild( this.questionText );
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
  this.articleEl.appendChild( olEl );
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


////////////////////
//Quiz Constructor//
////////////////////

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
    this.renderQuestionHeader();
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
    this.renderQuestionHeader();
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
  sectionEl.setAttribute( 'id', 'rendered-quiz' );
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
  this.renderQuestionHeader();
};

Quiz.prototype.renderQuestionHeader = function () {
  var h3El = document.createElement( 'h3' );
  h3El.textContent = 'Question ' + ( this.currentQuestion + 1 );
  var articleEl = Quiz.currentQuiz.questions[ Quiz.currentQuiz.currentQuestion ].articleEl;
  articleEl.insertBefore( h3El, articleEl.childNodes[ 0 ] );
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

Quiz.prototype.renderResults = function() {
  var sectionEl = document.getElementById( 'rendered-quiz' );
  sectionEl.setAttribute( 'id', 'quiz-results' );
  var results = '<h2>Results</h2>';
  results += '<h3>You earned ' + this.getPoints() + ' out of ' + this.questions.length + ' possible points for a score of ' + this.getPercent() + '%.</h3><ol>';
  for( var i in this.questions ) {
    results += '<li class="';
    if( ! this.userAnswers[ i ] ) {
      results += 'in';
    }
    results += 'correct" id="question' + i + '"><h3>Question ' + ( Number( i ) + 1 ) + ': ';

    if( ! this.userAnswers[ i ] ) {
      results += '<span class="wrong">Incorrect</span>';
    } else {
      results += '<span class="right">Correct</span>';
    }

    results += '</h3></li>';
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

Quiz.loadSplash = function() { //setup the splash page on page load
  var user = Quiz.currentUser.userName;
  user = user[ 0 ].toUpperCase() + user.slice( 1 );
  document.getElementById( 'user-name' ).textContent = user + '\'s Quizzes';
  Quiz.buildQuizList( 'default-quizzes', Quiz.default201Quizzes );
  if( Quiz.currentUser.myQuizzes ) {
    Quiz.buildQuizList( 'user-quizzes', Quiz.currentUser.myQuizzes );
  } else {
    var liEl = document.createElement( 'li' );
    liEl.textContent = 'You have no quizzes. Go make one!';
    liEl.id = 'go-make-quiz';
    document.getElementById( 'user-quizzes' ).appendChild( liEl );
  }
};

Quiz.buildQuizList = function ( ulId, quizList ) { //build the list of default and custom quizzes on the quiz splash page
  var quizListEl = document.getElementById( ulId );
  if( ulId === 'default-quizzes' ) {
    var prefix = 'd';
  } else {
    prefix = 'u';
  }
  quizList.forEach( function( quiz, index ) {
    var liEl = document.createElement( 'li' );
    var aEl = document.createElement( 'a' );
    aEl.id = prefix + index;
    aEl.textContent = quiz.title;
    liEl.appendChild( aEl );
    quizListEl.appendChild( liEl );
  } );
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

Quiz.getQuiz = function( source, index ) { //load the selected quiz into the Quiz.currentQuiz slot
  if( source === 'u' ) {
    var tempQuiz = Quiz.currentUser.myQuizzes[ index ]; //grab the quiz at index (referenced from click on first quiz page)
    Quiz.currentQuiz = new Quiz( tempQuiz.title, tempQuiz.description );
    for( var question in tempQuiz.questions ) { //reinstantiate each question and add it to the reinstantiated quiz
      Quiz.currentQuiz.questions.push( Quiz.instantiateQuestion( tempQuiz.questions[ question ] ) );
    }
  } else {
    Quiz.currentQuiz = Quiz.default201Quizzes[ index ];
  }
};

Quiz.getQuizAndRender = function( source, index ) {
  Quiz.getQuiz( source, index );
  Quiz.currentQuiz.renderQuiz();
};

Quiz.handleListClick = function( e ) {
  if( e.target.id ) {
    var firstLetter = String( e.target.id[ 0 ] );
    var quizNum = Number( e.target.id.slice( 1 ) );
    if( firstLetter !== 'g' ) { //if a quiz is clicked on
      Quiz.getQuizAndRender( firstLetter, Number( quizNum ) );
    } else {
      window.location.href = 'template.html';
    }
  }
};

Quiz.setupQuizPage = function() {
  Quiz.getUser();
  Quiz.loadSplash();
  document.getElementById( 'default-quizzes' ).addEventListener( 'click', Quiz.handleListClick );
  document.getElementById( 'user-quizzes' ).addEventListener( 'click', Quiz.handleListClick );
};

////////////////////
//Built in quizzes//
////////////////////


Quiz.default201Quizzes = [
  new Quiz( 'Basic HTML', 'Test your knowledge of basic HTML concepts.' ),

  new Quiz( 'Basic CSS', 'Test your knowledge of basic CSS concepts.' ),

  new Quiz( 'JavaScript Loops', 'Try your skills on some elementary JS Loops.' ),

  new Quiz( 'DOM Manipulation', 'See how much you know about all things DOM.' ),

  new Quiz( 'Object Literals', 'Practice your skills with JavaScript object literals.' ),
];

//HTML Quiz
Quiz.default201Quizzes[ 0 ].addQuestionAndAnswers( 'What does HTML stand for?', [
  [ 'Hypertext Markup Language' ],
  'Hyperterminal Markup Language',
  'Hypertext Markdown Language',
  'Hyperterminal Markdown Language'
] );

Quiz.default201Quizzes[ 0 ].addQuestionAndAnswers( 'Where in the HTML file should the link to a CSS stylesheet be placed?', [
  'The <body>',
  'The <header>',
  [ 'The <head>' ],
  'The <Footer>'
] );

Quiz.default201Quizzes[ 0 ].addQuestionAndAnswers( 'How should you begin every HTML file?', [
  '<html>',
  [ '<!DOCTYPE html>' ],
  '<title>',
  '<DOCTYPE! html>'
] );

Quiz.default201Quizzes[ 0 ].addQuestionAndAnswers( 'Which of the following is not a block element?', [
  '<p>',
  '<h1>',
  [ '<span>' ],
  '<article>',
] );

Quiz.default201Quizzes[ 0 ].addQuestionAndAnswers( 'True or False?<br>HTML files cannot contain CSS.', [
  'True',
  [ 'False' ]
] );


//CSS Quiz
Quiz.default201Quizzes[ 1 ].addQuestionAndAnswers( 'What does the \'a\' in RGBa control?', [
  'The aura',
  [ 'The opacity' ],
  'The attribute',
  'It doesn’t style anything, it is just a part of the naming convention'
] );

Quiz.default201Quizzes[ 1 ].addQuestionAndAnswers( 'How would you select an element with an id value of \'home\'?', [
  'home { /*styles*/ }',
  '.home { /*styles*/ }',
  [ '#home { /*styles*/ }' ],
  'home.id { /*styles*/ }'
] );

Quiz.default201Quizzes[ 1 ].addQuestionAndAnswers( 'What does CSS stand for?', [
  [ 'Cascading Style Sheet' ],
  'Color Style Sheet',
  'Creative Style Sheet',
  'Code Style Sheet',
  'Croutons, Salads, and Sides'
] );

Quiz.default201Quizzes[ 1 ].addQuestionAndAnswers( 'Which of the following is not a block element?', [
  '<p>',
  '<h1>',
  [ '<span>' ],
  '<article>'
] );

Quiz.default201Quizzes[ 1 ].addQuestionAndAnswers( 'Which symbol can be used to select all elements on the page for styling?', [
  '#',
  '+',
  '^',
  [ '*' ]
] );


//For Loops Quiz
Quiz.default201Quizzes[ 2 ].addQuestionAndAnswers( 'What are the two main types of loops?', [
  'If & Else',
  [ 'For & While' ],
  'Return & Break',
  'Try & Catch'
] );

Quiz.default201Quizzes[ 2 ].addQuestionAndAnswers( 'Which of the following is the correct structure of a for loop?', [
  'for ( i < array.length; i = 0; i++ ) { doStuff(); }',
  'for ( i++; i < array.length; var i = i ) { doStuff(); }',
  [ 'for ( var i = 0; i < array.length; i++ ) { doStuff(); }' ]
] );

Quiz.default201Quizzes[ 2 ].addQuestionAndAnswers( 'True or False?<br>You can have a for loop inside of a for loop.', [
  [ 'True' ],
  'False'
] );

Quiz.default201Quizzes[ 2 ].addQuestionAndAnswers( 'Assume the following:<br>var joel = \'cool\';<br>var rob = \'also cool\';<br>var cat = \'the coolest\';<br>Which of the following loops will execute the code block?', [
  [ 'while ( joel = \'cool\' ) { console.log(  \'Hello!\' ) }' ],
  'while ( rob === \'lame\' && rob !== \'lame\' ) { console.log(  \'Hello!\' ) }',
  'while ( ! cat === \'notcool\' ) { console.log(  \'Hello!\' ) }',
] );


//DOM Quiz
Quiz.default201Quizzes[ 3 ].addQuestionAndAnswers( 'How can you create an h2 element using JavaScript?', [
  [ 'var h2El = document.createElement( \'h2\' ); '],
  'var h2El = document.getElementById( \'h2\' );',
  'var h2El = document.getElementsByTagName( \'h2\' );',
  'var h2El = document.appendChild( \'h2\' );',
  'var h2El = document.newChild( \'h2\' );'
] );

Quiz.default201Quizzes[ 3 ].addQuestionAndAnswers( 'How might you add textual content to h2el?', [
  'h2El.appendChild( \'content\' );',
  'h2El.removeChild( \'content\' );',
  [ 'h2El.textContent = \'content\';' ],
  'h2El.createElement = \'content\';',
  'h2El.textContent( \'content\' );'
] );

Quiz.default201Quizzes[ 3 ].addQuestionAndAnswers( 'How could you add a <main> element inside of bodyEl?', [
  'bodyEl.appendChild( \'main\' );',
  'bodyEl.document.add( main );',
  [ 'bodyEl.innerHTML = \'<main></main>\' );' ],
  'bodyEl.outerHTML.set( document.main() );'
] );

Quiz.default201Quizzes[ 3 ].addQuestionAndAnswers( 'How would you add h2El to your mainEl?', [
  'mainEl.getElementById( \'h2El\' );',
  [ 'mainEl.appendChild( h2El );' ],
  'mainEl.createElement( h2El );',
  'mainEl.textContent( h2El );'
] );


//Object Literals Quiz
Quiz.default201Quizzes[ 4 ].addQuestionAndAnswers( 'Fill in the blank.<br>In an object, a variable is referred to as a(n) _______.', [
  'object oriented variable',
  [ 'property' ],
  'literal',
  'method'
] );

Quiz.default201Quizzes[ 4 ].addQuestionAndAnswers( 'Fill in the blank.<br>In an object, a function is referred to as a(n) _______.', [
  [ 'method' ],
  'action',
  'reaction',
  'literal verb',
  'object.do()'
] );

Quiz.default201Quizzes[ 4 ].addQuestionAndAnswers( 'Given an object called "dog", which of the following might make the dog "bark"?', [
  'dog.object.bark();',
  'bark();',
  [ 'dog.bark();' ],
  'dog.bark;'
] );

Quiz.default201Quizzes[ 4 ].addQuestionAndAnswers( 'Which of the following is a valid way to access the "breed" property of the "dog" object?<br>Select the best answer.', [
  'dog.breed;',
  'dog[ \'breed\' ]',
  'dog[ breed ]',
  [ 'Both A and B are valid' ],
  'A, B, and C are all valid'
] );

Quiz.default201Quizzes[ 4 ].addQuestionAndAnswers( 'True or False?<br>The following is a valid JavaScript object:<br>var car = { make: \'Ford\' };', [
  [ 'True' ],
  'False'
] );

Quiz.default201Quizzes[ 4 ].addQuestionAndAnswers( 'True or False?<br>The following is a valid method declaration for an object literal:<br>bark: function() { console.log( \'Woof!\' ); }', [
  [ 'True' ],
  'False'
] );

//////////////////
//PageLoad Setup//
//////////////////

//Quiz page and template page//
Quiz.notLoggedIn = ! localStorage.users || ! localStorage.currentUser || localStorage.currentUser === '-1';

(function() {
  if( Quiz.notLoggedIn ) {
    alert( 'You must first sign in to access this page.' );
    return window.location.href = '../index.html';
  }
  var buttEl = document.getElementById('logout');
  function handleUserLogout() {
    localStorage.currentUser = -1;
    window.location.href = '../index.html';
  }
  buttEl.addEventListener('click', handleUserLogout);
})();


//Quiz page only
if( document.getElementById( 'quiz' ) && ! Quiz.notLoggedIn ) {
  Quiz.getUser();
  Quiz.loadSplash();
  document.getElementById( 'default-quizzes' ).addEventListener( 'click', Quiz.handleListClick );
  document.getElementById( 'user-quizzes' ).addEventListener( 'click', Quiz.handleListClick );
}


///////
//FIN//
///////
