'use strict';
User.main = document.getElementById('main');
User.form = document.getElementById('form');
User.userNameInput = document.getElementById('username');
User.passWordInput = document.getElementById('password');
var app = {
  users: [],
  currentUser: -1
};
console.log( app.currentUser + 'currentuser before');

function User (username, password) {
  this.userName = username;
  this.passWord = password;
  app.users.push(this);
  // localStorage.currentUser = app.users.length - 1;
}


User.header = document.getElementById('header');
User.ulEl = document.createElement('ul');
User.liEl = document.createElement('li');
User.buttEl = document.createElement('button');
User.buttEl.type = 'click';
User.buttEl.id = 'logout';
User.buttEl.textContent = 'Logout';

User.logoutButtRender = function() { //clears login form and adds logout button.
  User.main.removeChild(User.form);
  User.header.appendChild(User.ulEl);
  User.ulEl.appendChild(User.liEl);
  User.liEl.appendChild(User.buttEl);
};

User.splashPageRender = function() {//renders splash page
  User.divEl = document.createElement('div');

  User.h2El1 = document.createElement('h2');
  User.h2El1.id = 'jh2';
  User.h2El1.textContent = 'Take a Quiz';

  User.h2El2 = document.createElement('h2');
  User.h2El2.id = 'jh2';
  User.h2El2.textContent = 'Make a Quiz';

  User.h2El3 = document.createElement('h2');
  User.h2El3.id = 'jh2';
  User.h2El3.textContent = 'About us';

  User.ul2El = document.createElement('ul');

  User.liEl2 = document.createElement('li');
  User.liEl2.id = 'jli';

  User.liEl3 = document.createElement('li');
  User.liEl3.id = 'jli';

  User.liEl4 = document.createElement('li');
  User.liEl4.id = 'jli';

  User.imgEl1 = document.createElement('img');
  User.imgEl1.id = 'jimgs';
  User.imgEl1.src = 'stockimgs/red-quiz-button.jpg';

  User.imgEl2 = document.createElement('img');
  User.imgEl2.id = 'jimgs';
  User.imgEl2.src = 'stockimgs/bigstock-Quill-pen-and-ink-well-resting-89718662.jpg';

  User.imgEl3 = document.createElement('img');
  User.imgEl3.id = 'jimgs';
  User.imgEl3.src = 'stockimgs/about-us.png';

  User.aEl1 = document.createElement('a');
  User.aEl1.href = 'html/quiz.html';

  User.aEl2 = document.createElement('a');
  User.aEl2.href = 'html/template.html';

  User.aEl3 = document.createElement('a');
  User.aEl3.href = 'html/about.html';

  User.main.appendChild(User.divEl);
  User.divEl.appendChild(User.h2El1);
  User.divEl.appendChild(User.h2El2);
  User.divEl.appendChild(User.h2El3);
  User.divEl.appendChild(User.ul2El);
  User.ul2El.appendChild(User.liEl2);
  User.ul2El.appendChild(User.liEl3);
  User.ul2El.appendChild(User.liEl4);
  User.liEl2.appendChild(User.aEl1);
  User.aEl1.appendChild(User.imgEl1);

  User.liEl3.appendChild(User.aEl2);
  User.aEl2.appendChild(User.imgEl2);

  User.liEl4.appendChild(User.aEl3);
  User.aEl3.appendChild(User.imgEl3);
};//renders after login

User.loginConditions = function() {

};

if (localStorage.users) { // adds the localstorage.users to the app.users object.
  alert('testing retrieveApp');
  var retrieveApp = JSON.parse(localStorage.users);
  app.users = retrieveApp;
  var retrieveCurrentUser = JSON.parse(localStorage.currentUser);
  app.currentUser = retrieveCurrentUser;
}

if (app.currentUser > -1) {//if currentUser exsists then remove login form.
  User.logoutButtRender();
  User.splashPageRender();
}
console.log(app.currentUser + 'currentuser after');


User.handleUserLogin = function( event ) {
  event.preventDefault();
  var userName = User.userNameInput.value.toLowerCase();
  var passWord = User.passWordInput.value.toLowerCase();
  if (app.users.length === 0) {// if no users are stored then creates a new user.

    console.log('app.users.length = 0 true');
    confirm('Created New User \nUsername: ' + userName + '\n Password: ' + passWord);
    new User(userName, passWord);
    localStorage.users = JSON.stringify(app.users);
    localStorage.currentUser = 0;
    User.logoutButtRender();
    User.splashPageRender();

  } else {
    for (var i = 0; i < app.users.length; i++) {
      if (userName === app.users[i].userName) { // check to see if user exsists
        console.log('returning user');
        if (passWord === app.users[i].passWord) {// compare the password to the username
          console.log('password correct');
          alert('welcome back!');
          app.currentUser = i;
          localStorage.currentUser = i;
          User.userNameInput.value = '';
          User.passWordInput.value = '';
          User.logoutButtRender();
          User.splashPageRender();

          break;
        } else {//inncorrect password verify
          console.log('password wrong');
          alert('Password does not match');
          User.passWordInput.value = '';
        }

      } else {//goes through all the users with what the user entered to determine if it exsists
        console.log('validating user');
        var userCounter = 0;
        for (var j = 0; j < app.users.length; j++) {
          if (userName !== app.users[j].userName && passWord !== app.users[j].passWord) { //add to counter for each time the the un and pw do not match
            userCounter += 1;
          }
        }
      }
    }
    console.log('counter: ' + userCounter);
    if (userCounter === app.users.length) { //creates a new user if validating user doesn't find a username
      confirm('Creating new user. \n Is this correct? \nUsername: ' + userName + '\n Password: ' + passWord);
      new User(userName, passWord);
      app.currentUser = userCounter;
      localStorage.currentUser = userCounter;
      localStorage.users = JSON.stringify(app.users);
      alert('Welcome!');
      User.userNameInput.value = '';
      User.passWordInput.value = '';
      User.logoutButtRender();
      User.splashPageRender();
    }
  }
}; //handles the login process and conditions

User.handleUserLogout = function() {
  localStorage.currentUser = -1;
  User.header.removeChild(User.ulEl);
  User.main.removeChild(User.divEl);
  User.main.appendChild(User.form);
};

User.buttEl.addEventListener('click', User.handleUserLogout);
User.form.addEventListener('submit', User.handleUserLogin);
console.log(app.currentUser);
console.log(localStorage.currentUser);
