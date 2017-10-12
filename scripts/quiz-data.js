'use strict';

/*Objects Quiz*/
var quiz0 = new Quiz( 'Code 201: Objects', 'Practice your skills with JavaScript objects.' );

quiz0.addQuestionAndAnswers( 'Fill in the blank.<br>In an object, a variable is referred to as a(n) _______.', [
  'object oriented variable',
  [ 'property' ],
  'literal',
  'method'
] );

quiz0.addQuestionAndAnswers( 'Fill in the blank.<br>In an object, a function is referred to as a(n) _______.', [
  [ 'method' ],
  'action',
  'reaction',
  'literal verb',
  'object.do()'
] );

quiz0.addQuestionAndAnswers( 'Given an object called "dog", which of the following might make the dog "bark"?', [
  'dog.object.bark();',
  'bark();',
  [ 'dog.bark();' ],
  'dog.bark;'
] );

quiz0.addQuestionAndAnswers( 'Which of the following is a valid way to access the "breed" property of the "dog" object?<br>Select the best answer.', [
  'dog.breed;',
  'dog[ \'breed\' ]',
  'dog[ breed ]',
  [ 'Both A and B are valid' ],
  'A, B, and C are all valid'
] );

quiz0.addQuestionAndAnswers( 'True or False?<br>The following is a valid JavaScript object:<br>var car = { make: \'Ford\' };', [
  [ 'True' ],
  'False'
] );

quiz0.addQuestionAndAnswers( 'True or False?<br>The following is a valid method declaration for an object literal:<br>bark: function() { console.log( \'Woof!\' ); }', [
  [ 'True' ],
  'False'
] );




var quiz1 = new Quiz( 'Code 201: Objects', 'Practice your skills with JavaScript objects.' );

quiz1.addQuestionAndAnswers( 'Hi Joel', [
  'wrong',
  [ 'correct' ],
  'asdsad',
  'asdasd'
] );

quiz1.addQuestionAndAnswers( 'Question 2', [
  [ 'correct' ],
  'nope',
  'floop',
  'smosdfohj'
] );


var default201Quizzes = [
  quiz0,
  quiz1
];

default201Quizzes; //garbage code to appease the linter, variable called in Quiz.js
