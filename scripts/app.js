'use strict';
User.main = document.getElementById('main');
User.form = document.getElementById('form');
User.userNameInput = document.getElementById('username');
User.passWordInput = document.getElementById('password');
var app = {
  users: [],
  currentUser: -1
};

function User (username, password) {
  this.userName = username;
  this.passWord = password;
  app.users.push(this);
}

if (localStorage.users) { // adds the localstorage.users to the app.users object.
  var retrieveApp = JSON.parse(localStorage.users);
  app.users = retrieveApp;
  var retrieveCurrentUser = JSON.parse(localStorage.currentUser);
  app.currentUser = retrieveCurrentUser;
}

User.buttEl = document.getElementById('logout');
if (app.currentUser < 0) {
  User.navUl = document.getElementById('navul');
  User.navLi = document.getElementById('logoutbutt');
  User.navLi.removeChild(User.buttEl);
}

User.handleUserLogin = function( event ) {
  event.preventDefault();
  var userName = User.userNameInput.value.toLowerCase().replace(/ /g, '');
  var passWord = User.passWordInput.value.toLowerCase().replace(/ /g, '');

  if (userName == '' || passWord == '') {
    alert('Input fields cannot be blank.');
  } else if (passWord.length < 7 || passWord.length > 20) {
    alert('Password must be between 8-20 characters.');
  }else {

    if (app.users.length === 0) {// if no users are stored then creates a new user.

      confirm('Created New User \n\nUsername: ' + userName + '\nPassword: ' + passWord.replace(/./g,'*'));
      new User(userName, passWord);
      alert('Welcome!');
      localStorage.users = JSON.stringify(app.users);
      localStorage.currentUser = 0;
      User.userNameInput.value = '';
      User.passWordInput.value = '';
      window.location.href = 'html/home.html';

    } else {
      for (var i = 0; i < app.users.length; i++) {
        if (userName === app.users[i].userName) { // check to see if user exsists
          if (passWord === app.users[i].passWord) {// compare the password to the username
            alert('Welcome back!');
            app.currentUser = i;
            localStorage.currentUser = i;
            User.userNameInput.value = '';
            User.passWordInput.value = '';
            window.location.href = 'html/home.html';

            break;
          } else {//inncorrect password verify
            alert('Password does not match.');
            User.passWordInput.value = '';
          }

        } else {//goes through all the users with what the user entered to determine if it exsists
          var userCounter = 0;
          for (var j = 0; j < app.users.length; j++) {
            if (userName !== app.users[j].userName) { //add to counter for each time the the un and pw do not match
              userCounter += 1;
            }
          }
        }
      }
      if (userCounter === app.users.length) { //creates a new user if validating user doesn't find a username
        var userConfirm = confirm('Creating new user. \n\nIs this correct? \n\nUsername: ' + userName + '\nPassword: ' + passWord.replace(/./g,'*'));
        if (userConfirm === true) {
          new User(userName, passWord);
          app.currentUser = userCounter;
          localStorage.currentUser = userCounter;
          localStorage.users = JSON.stringify(app.users);
          alert('Welcome!');
          User.userNameInput.value = '';
          User.passWordInput.value = '';
          window.location.href = 'html/home.html';
        } else {
          alert('Sending back to login.');
        }
      }
    }
  }
}; //handles the login process and conditions

User.handleUserLogout = function() {
  localStorage.currentUser = -1;
  window.location.href = '../index.html';
};

User.buttEl.addEventListener('click', User.handleUserLogout);
User.form.addEventListener('submit', User.handleUserLogin);
