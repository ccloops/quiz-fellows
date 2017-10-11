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
  newQuestionLabel.setAttribute('for', 'addQuestion');
  console.log(this.questionIndex);
  newQuestionLabel.textContent = 'Question ' + (QuestionForm.all.length + 1) + ':';
  this.newQuestionArticle.appendChild(newQuestionLabel);
  this.newQuestionInput = document.createElement('input');
  this.newQuestionInput.name = 'addQuestion';
  this.newQuestionInput.type = 'text';
  this.newQuestionArticle.appendChild(this.newQuestionInput);


  var newAnswerButton = document.createElement('button');
  newAnswerButton.type = 'click';
  newAnswerButton.textContent = ' New Answer:';
  newAnswerButton.id = 'newAnswer';
  this.newQuestionArticle.appendChild(newAnswerButton);

  this.ulEl = document.createElement('ul');
  this.newQuestionArticle.appendChild(this.ulEl);

  newAnswerButton.addEventListener('click', this.newAnswerForm.bind(this));

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

  var liEl = document.createElement('li');
  this.ulEl.appendChild(liEl);

  var newAnswerLabel = document.createElement('label');
  newAnswerLabel.setAttribute('for', 'addAnswer');
  newAnswerLabel.textContent = 'Answer ' + (this.answers.length + 1) + ':';
  liEl.appendChild(newAnswerLabel);
  var newAnswerInput = document.createElement('input');
  newAnswerInput.name = 'addAnswer';
  newAnswerInput.type = 'text';
  liEl.appendChild(newAnswerInput);
  var radioButtonInput = document.createElement('input');
  radioButtonInput.type = 'radio';
  radioButtonInput.name = 'radio';
  radioButtonInput.id = 'radio';
  liEl.appendChild(radioButtonInput);
  var radioButtonLabel = document.createElement('label');
  radioButtonLabel.setAttribute('for', 'radio');
  radioButtonLabel.textContent = 'Correct Answer:';
  liEl.appendChild(radioButtonLabel);
  this.answers.push(newAnswerInput);
};


QuestionForm.addNewQuestion = function (e) {
  e.preventDefault();
  new QuestionForm();
};

console.log(addQuestionButton);
addQuestionButton.addEventListener('click', QuestionForm.addNewQuestion);
