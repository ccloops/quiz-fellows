'use strict';

//+++++++++++++++++++++++++++++++++++++
//Appending New Question Form
//+++++++++++++++++++++++++++++++++++++

function addQuestionForm() {
  var entireQuizForm = document.getElementById('entireQuizForm');
  var newQuestionArticle = document.createElement('article');
  var newQuestionLabel = document.createElement('label');
  newQuestionLabel.for = 'newQuestion';
  newQuestionLabel.textContent = 'New Question';
  newQuestionArticle.appendChild(newQuestionLabel);
  var newQuestionInput = document.createElement('input');
  newQuestionInput.name = 'newQuestion';
  newQuestionInput.type = 'text';
  // var newAnswerButton = document.createElement
  newQuestionArticle.appendChild(newQuestionInput);

  entireQuizForm.appendChild(newQuestionArticle);
}

addQuestionForm();
