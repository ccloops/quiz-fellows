'use strict';

//+++++++++++++++++++++++++++++++++++++
//Appending New Question Form
//+++++++++++++++++++++++++++++++++++++

function addQuestionForm() {
  event.preventDefault();
  var entireQuizForm = document.getElementById('entireQuizForm');
  var newQuestionArticle = document.createElement('article');
  var newQuestionLabel = document.createElement('label');
  newQuestionLabel.for = 'newQuestion';
  newQuestionLabel.textContent = 'New Question';
  newQuestionArticle.appendChild(newQuestionLabel);
  var newQuestionInput = document.createElement('input');
  newQuestionInput.name = 'newQuestion';
  newQuestionInput.type = 'text';
  newQuestionArticle.appendChild(newQuestionInput);
  var newAnswerButton = document.createElement('button');
  newAnswerButton.type = 'click';
  newAnswerButton.textContent = 'New Answer';
  newQuestionArticle.appendChild(newAnswerButton);

  entireQuizForm.appendChild(newQuestionArticle);
}

var addQuestionButton = document.getElementById('newQuestion');

addQuestionButton.addEventListener('click', addQuestionForm);

// function newAnswerForm() {
//   var newAnswerLabel = document.createElement('label');
//   newAnswerLabel.for = 'newAnswer';
//   newAnswerLabel.textContent = 'New Answer';
//
// }
