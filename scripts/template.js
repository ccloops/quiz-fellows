'use strict';

QuestionForm.all = [];

//+++++++++++++++++++++++++++++++++++++
//Question Form Constructor
//+++++++++++++++++++++++++++++++++++++

function QuestionForm() {
  this.answers = [];
  QuestionForm.all.push(this);
  this.addQuestionForm();
}

//+++++++++++++++++++++++++++++++++++++
//Appending New Question Form
//+++++++++++++++++++++++++++++++++++++

var addQuestionButton = document.getElementById('newQuestion');

QuestionForm.prototype.addQuestionForm = function() {
  var entireQuizForm = document.getElementById('entireQuizForm');
  this.newQuestionArticle = document.createElement('article');
  var newQuestionLabel = document.createElement('label');
  newQuestionLabel.for = 'newQuestion';
  newQuestionLabel.textContent = 'New Question:';
  this.newQuestionArticle.appendChild(newQuestionLabel);
  var newQuestionInput = document.createElement('input');
  newQuestionInput.name = 'newQuestion';
  newQuestionInput.type = 'text';
  this.newQuestionArticle.appendChild(newQuestionInput);

  var newAnswerButton = document.createElement('button');
  newAnswerButton.type = 'click';
  newAnswerButton.textContent = 'New Answer';
  this.newQuestionArticle.appendChild(newAnswerButton);

  newAnswerButton.addEventListener('click', this.newAnswerForm.bind(this));

  this.newAnswerForm();

  entireQuizForm.appendChild(this.newQuestionArticle);
};


QuestionForm.prototype.newAnswerForm = function() {
  event.preventDefault();
  var newAnswerLabel = document.createElement('label');
  newAnswerLabel.for = 'newAnswer';
  newAnswerLabel.textContent = 'New Answer:';
  this.newQuestionArticle.appendChild(newAnswerLabel);
  var newAnswerInput = document.createElement('input');
  newAnswerInput.name = 'newAnswer';
  newAnswerInput.type = 'text';
  this.newQuestionArticle.appendChild(newAnswerInput);
};



QuestionForm.addNewQuestion = function (e) {
  e.preventDefault();
  new QuestionForm();
};


addQuestionButton.addEventListener('click', QuestionForm.addNewQuestion);
