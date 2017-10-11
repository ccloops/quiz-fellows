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
  this.newQuestionArticle = document.createElement('form');
  var newQuestionLabel = document.createElement('label');
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
  this.answers.push(newAnswerInput);

  var radioButtonInput = document.createElement('input');
  radioButtonInput.type = 'radio';
  radioButtonInput.name = 'radio';
  radioButtonInput.id = 'q' + (QuestionForm.all.length - 1) + 'a' + (this.answers.length);
  liEl.appendChild(radioButtonInput);

  var radioButtonLabel = document.createElement('label');
  radioButtonLabel.setAttribute('for', 'radio');
  radioButtonLabel.textContent = 'Correct Answer:';
  liEl.appendChild(radioButtonLabel);

//button to remove answer
  var removeAnswerButton = document.createElement('button');
  removeAnswerButton.type = 'click';
  removeAnswerButton.textContent = 'Remove Answer';
  removeAnswerButton.id = 'removeQ' + (QuestionForm.all.length - 1) + 'a' + (this.answers.length - 1);
  liEl.appendChild(removeAnswerButton);
  liEl.id = 'liQ' + (QuestionForm.all.length - 1) + 'a' + (this.answers.length - 1);

//remove answer event listener
  removeAnswerButton.addEventListener('click', this.removeAnswer.bind(this));
};


QuestionForm.addNewQuestion = function (e) {
  e.preventDefault();
  new QuestionForm();
};

// QuestionForm.isCorrect = function () {
//   for(var i = 0; i < QuestionForm.all.length; i++) {
//     var radioButtonChecked = document.getElementsByAttribute('radio');
//     if (radioButtonChecked.checked) {
//       QuestionForm.all[i].answer.value = true;
//       console.log(answer[i].value);
//     }
//   }
// };


QuestionForm.prototype.removeAnswer = function (e) {
  e.preventDefault();
  for (var i = 0; i < this.answers.length; i++) {
    var remove = document.getElementById('liQ' + (QuestionForm.all.length - 1) + 'a' + (this.answers.length - 1));
    this.ulEl.removeChild(remove);
  }

};

addQuestionButton.addEventListener('click', QuestionForm.addNewQuestion);


QuestionForm.submitQuiz = function() {
  for(var i = 0; i < QuestionForm.all.length; i++) {

  }
};
