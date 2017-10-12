'use strict';

QuestionForm.all = [];

//+++++++++++++++++++++++++++++++++++++
//Question Form Constructor
//+++++++++++++++++++++++++++++++++++++

function QuestionForm() {
  this.answersText = [];
  this.answers = [];
  this.addQuestionForm();
  this.questionIndex = QuestionForm.all.length;
  QuestionForm.all.push(this);
  this.correctAnswer = -1;
}

function AnswerForm(question) {
  this.liEl = document.createElement('li');
  this.inputLabelEl = document.createElement('label');
  this.inputEl = document.createElement('input');
  this.radioEl = document.createElement('input');
  this.radioLabelEl = document.createElement('label');
  this.removeEl = document.createElement('button');
  this.removeEl.setAttribute('class', 'form-button');
  this.questionForm = question;
  this.removeEl.addEventListener('click', this.removeAnswer.bind(this));
  this.appendAll();
}

AnswerForm.prototype.removeAnswer = function(e) {
  event.preventDefault();
  var index = Number(e.target.id.replace('a', ''));
  this.questionForm.ulEl.removeChild(this.liEl);
  var tempAnswers = this.questionForm.answers.slice(0, index);
  console.log(this.questionForm.answers);
  this.questionForm.answers = tempAnswers.concat(this.questionForm.answers.slice(index + 1));
  console.log(this.questionForm.answers);
  this.questionForm.updateAnswerForm();
};

AnswerForm.prototype.appendAll = function() {
  this.liEl.appendChild(this.inputLabelEl);
  this.liEl.appendChild(this.inputEl);
  this.liEl.appendChild(this.radioEl);
  this.liEl.appendChild(this.radioLabelEl);
  this.liEl.appendChild(this.removeEl);
};

QuestionForm.prototype.addNewAnswer = function() {
  event.preventDefault();
  var newAnswer = new AnswerForm(this);
  this.answers.push(newAnswer);
  this.ulEl.appendChild(newAnswer.liEl);
  this.updateAnswerForm();
};

QuestionForm.prototype.updateAnswerForm = function() {
  for(var i = 0; i < this.answers.length; i++) {
    var answerForm = this.answers[i];
    answerForm.inputLabelEl.textContent = 'Answer ' + (i + 1) + ':';
    answerForm.inputLabelEl.setAttribute('for', 'q' + this.questionIndex + 'a' + i);
    answerForm.inputEl.setAttribute('name', 'q' + this.questionIndex + 'a' + i);
    answerForm.inputEl.setAttribute('type', 'text');
    answerForm.radioEl.setAttribute('type', 'radio');
    answerForm.radioEl.setAttribute('name', 'q' + this.questionIndex);
    answerForm.radioLabelEl.textContent = 'Correct Answer';
    answerForm.removeEl.textContent = 'Remove Answer';
    answerForm.removeEl.id = 'a' + i;
  }
};

//+++++++++++++++++++++++++++++++++++++
//Appending New Question Form
//+++++++++++++++++++++++++++++++++++++

var addQuestionButton = document.getElementById('newQuestion');

QuestionForm.prototype.addQuestionForm = function() {
  var entireQuizForm = document.getElementById('entireQuizForm');
  this.newQuestionArticle = document.createElement('form');
  this.newQuestionLabel = document.createElement('label');
  this.newQuestionLabel.textContent = 'Question ' + (QuestionForm.all.length + 1) + ':';
  this.newQuestionArticle.appendChild(this.newQuestionLabel);
  this.newQuestionInput = document.createElement('input');
  this.newQuestionInput.name = 'addQuestion';
  this.newQuestionInput.type = 'text';
  this.newQuestionArticle.appendChild(this.newQuestionInput);

  this.ulEl = document.createElement('ul');
  this.newQuestionArticle.appendChild(this.ulEl);

  var newAnswerButton = document.createElement('button');
  newAnswerButton.type = 'click';
  newAnswerButton.textContent = 'New Answer';
  newAnswerButton.setAttribute('class', 'form-button');
  this.newQuestionArticle.appendChild(newAnswerButton);
  newAnswerButton.addEventListener('click', this.addNewAnswer.bind(this));

  var removeQuestionButton = document.createElement('button');
  removeQuestionButton.setAttribute('type', 'click');
  removeQuestionButton.textContent = 'Remove Question';
  removeQuestionButton.setAttribute('class', 'form-button');
  removeQuestionButton.addEventListener('click', this.removeQuestion.bind(this));
  this.newQuestionArticle.appendChild(removeQuestionButton);

  entireQuizForm.appendChild(this.newQuestionArticle);

};

QuestionForm.updateQuestionAndAnswers = function() {
  for(var i = 0; i < QuestionForm.all.length; i++) {
    QuestionForm.all[i].questionIndex = i;
    QuestionForm.all[i].updateAnswerForm();
    QuestionForm.all[i].newQuestionLabel.textContent = 'Question ' + (i + 1);
  }
};

QuestionForm.prototype.removeQuestion = function() {
  event.preventDefault();
  this.newQuestionArticle.remove();
  var tempQuestions = QuestionForm.all.slice(0, this.questionIndex);
  console.log(QuestionForm.all);
  QuestionForm.all = tempQuestions.concat(QuestionForm.all.slice(this.questionIndex + 1));
  console.log(QuestionForm.all);
  QuestionForm.updateQuestionAndAnswers();
};


QuestionForm.prototype.getQuestionAndAnswers = function () {
  for(var i = 0; i < this.answers.length; i++) {
    this.answersText.push(this.answers[i].inputEl.value);
    console.log(this.answers[i]);
    var radioButtonStatus = this.answers[i].radioEl.checked;
    if(radioButtonStatus) {
      this.correctAnswer = i;
    }
  }
  this.questionText = this.newQuestionInput.value;
};


QuestionForm.addNewQuestion = function (e) {
  e.preventDefault();
  new QuestionForm();
};


addQuestionButton.addEventListener('click', QuestionForm.addNewQuestion);


QuestionForm.submitQuiz = function() {
  for(var i = 0; i < QuestionForm.all.length; i++) {

  }
};
