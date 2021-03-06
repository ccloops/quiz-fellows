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
  this.questionForm.answers = tempAnswers.concat(this.questionForm.answers.slice(index + 1));
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
  newAnswerButton.textContent = 'Add New Answer';
  newAnswerButton.setAttribute('class', 'form-button');
  this.newQuestionArticle.appendChild(newAnswerButton);
  newAnswerButton.addEventListener('click', this.addNewAnswer.bind(this));

  var removeQuestionButton = document.createElement('button');
  removeQuestionButton.setAttribute('type', 'click');
  removeQuestionButton.textContent = 'Remove Question';
  removeQuestionButton.setAttribute('class', 'form-button');
  removeQuestionButton.addEventListener('click', this.removeQuestion.bind(this));
  this.newQuestionArticle.appendChild(removeQuestionButton);

  var hrEl = document.createElement( 'hr' );
  this.newQuestionArticle.appendChild( hrEl );

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
  if( confirm( 'Are you sure you want to remove this question?' ) ) {
    this.newQuestionArticle.remove();
    var tempQuestions = QuestionForm.all.slice(0, this.questionIndex);
    QuestionForm.all = tempQuestions.concat(QuestionForm.all.slice(this.questionIndex + 1));
    QuestionForm.updateQuestionAndAnswers();
  }
};


QuestionForm.prototype.getQuestionAndAnswers = function () {
  this.answersText = [];
  for(var i = 0; i < this.answers.length; i++) {
    this.answersText.push(this.answers[i].inputEl.value);
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


QuestionForm.getAllData = function() {
  var quizTitle = document.getElementById('quizTitle').value;
  var quizDescription = document.getElementById('quizDescription').value;
  if(!quizTitle || !quizDescription) {
    alert('Please make sure to enter a valid quiz title and description!');
    return false;
  }
  var questionsAndAnswers = [];
  for(var i = 0; i < QuestionForm.all.length; i++) {
    var currentQuestion = QuestionForm.all[i];
    currentQuestion.getQuestionAndAnswers();
    if(currentQuestion.correctAnswer === -1) {
      return alert('Please select a correct answer for Question ' + (i + 1));
    }
    questionsAndAnswers.push({questionText: currentQuestion.questionText, answers: currentQuestion.answersText, correctAnswer: currentQuestion.correctAnswer});
  }
  if( questionsAndAnswers.length < 1 ) {
    return alert( 'You must enter at least one question.' );
  }

  for( var k = 0; k < questionsAndAnswers.length; k++ ) {
    var tempAnswers = questionsAndAnswers[ k ].answers;
    if( tempAnswers.length < 2 ) {
      return alert( 'You must enter at least two answers per question.' );
    }
  }

  return {title: quizTitle, description: quizDescription, questions: questionsAndAnswers};
};

QuestionForm.submitQuiz = function() {
  event.preventDefault();
  var quizData = QuestionForm.getAllData();
  if(quizData) {
    var myQuiz = new Quiz(quizData.title, quizData.description);
    for(var i = 0; i < quizData.questions.length; i++) {
      var questionText = quizData.questions[i].questionText;
      var answers = quizData.questions[i].answers;
      var correctAnswer = quizData.questions[i].correctAnswer;
      answers[correctAnswer] = [answers[correctAnswer]];
      myQuiz.addQuestionAndAnswers(questionText, answers);
    }
    if(confirm ('Are you sure you want to submit your quiz?')) {
      QuestionForm.saveQuiz( myQuiz );
      if(confirm ('Would you like to go to your quizzes?')) {
        document.getElementById('quizTitle').value = null;
        document.getElementById('quizDescription').value = null;
        window.location.href = 'quiz.html';
      } else {
        window.location.href = 'home.html';
      }
    }
  }
};

QuestionForm.saveQuiz = function( newQuiz ) {
  Quiz.getUser(); //Store logged in user as Quiz.currentUser
  if( ! Quiz.currentUser.myQuizzes ) { //if no user quizzes yet
    Quiz.currentUser.myQuizzes = [];
  }
  Quiz.currentUser.myQuizzes.push( newQuiz );
  Quiz.allUsers[ Quiz.currentUserIndex ] = Quiz.currentUser; //add updated user back to the list of local users
  localStorage.users = JSON.stringify( Quiz.allUsers ); //add the updated array of users back to localStorage
};

document.getElementById('newQuestion').addEventListener('click', QuestionForm.addNewQuestion);

document.getElementById('submit').addEventListener('click', QuestionForm.submitQuiz);
