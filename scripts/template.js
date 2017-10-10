'use strict';

//+++++++++++++++++++++++++++++++++++++
//Appending New Question Form
//+++++++++++++++++++++++++++++++++++++
var addQuestionButton = document.getElementById('newQuestion');


// newQuestions = [];

function addQuestionForm() {
  event.preventDefault();
  var entireQuizForm = document.getElementById('entireQuizForm');
  var newQuestionArticle = document.createElement('article');
  var newQuestionLabel = document.createElement('label');
  newQuestionLabel.for = 'newQuestion';
  newQuestionLabel.textContent = 'New Question:';
  newQuestionArticle.appendChild(newQuestionLabel);
  var newQuestionInput = document.createElement('input');
  newQuestionInput.name = 'newQuestion';
  newQuestionInput.type = 'text';
  newQuestionArticle.appendChild(newQuestionInput);

  newAnswerForm(newQuestionArticle);

  entireQuizForm.appendChild(newQuestionArticle);
}


addQuestionButton.addEventListener('click', addQuestionForm);


function newAnswerForm(newQuestionArticle) {
  event.preventDefault();
  var newAnswerButton = document.createElement('button');
  var newAnswerLabel = document.createElement('label');
  newAnswerLabel.for = 'newAnswer';
  newAnswerLabel.textContent = 'New Answer:';
  newQuestionArticle.appendChild(newAnswerLabel);
  var newAnswerInput = document.createElement('input');
  newAnswerInput.name = 'newAnswer';
  newAnswerInput.type = 'text';
  newQuestionArticle.appendChild(newAnswerInput);
  newAnswerButton.type = 'click';
  newAnswerButton.textContent = 'New Answer';
  newQuestionArticle.appendChild(newAnswerButton);

  newAnswerButton.addEventListener('click', newAnswerForm);
}
