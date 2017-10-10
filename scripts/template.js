'use strict';

QuestionForm.all = [];

//+++++++++++++++++++++++++++++++++++++
//Question Form Constructor
//+++++++++++++++++++++++++++++++++++++

function QuestionForm() {
  this.answersText = [];
  this.answers = [];
  this.addQuestionForm();
  QuestionForm.all.push(this);
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
  this.newQuestionInput = document.createElement('input');
  this.newQuestionInput.name = 'newQuestion';
  this.newQuestionInput.type = 'text';
  this.newQuestionArticle.appendChild(this.newQuestionInput);

  var newAnswerButton = document.createElement('button');
  newAnswerButton.type = 'click';
  newAnswerButton.textContent = ' New Answer:';
  newAnswerButton.id = 'newAnswer';
  this.newQuestionArticle.appendChild(newAnswerButton);

  newAnswerButton.addEventListener('click', this.newAnswerForm.bind(this));

  this.newAnswerForm();

  entireQuizForm.appendChild(this.newQuestionArticle);
};

QuestionForm.prototype.getQuestionAndAnswers = function () {
  for(var i = 0; i < this.answers.length; i++) {
    this.answersText.push(this.answers[i].value);
  }
  this.questionText = this.newQuestionInput.value;
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
  this.answers.push(newAnswerInput);
};



QuestionForm.addNewQuestion = function (e) {
  e.preventDefault();
  new QuestionForm();
};


addQuestionButton.addEventListener('click', QuestionForm.addNewQuestion);
