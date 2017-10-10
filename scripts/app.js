'use strict';
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

if (localStorage.users) { // adds the localstorage.users to the app.users object
  alert('testing retrieveApp');
  var retrieveApp = JSON.parse(localStorage.users);
  app.users = retrieveApp;
  var retrieveCurrentUser = JSON.parse(localStorage.currentUser);
  app.currentUser = retrieveCurrentUser;
}
console.log(app.currentUser + 'currentuser after');
User.handleUserLogin = function( event ) {
  event.preventDefault();
  var userName = User.userNameInput.value.toLowerCase();
  var passWord = User.passWordInput.value;

  if (app.users.length === 0) {// if no users are stored then creates a new user

    console.log('app.users.length = 0 true');
    confirm('Created New User \nUsername: ' + userName + '\n Password: ' + passWord);
    new User(userName, passWord);
    localStorage.users = JSON.stringify(app.users);
    localStorage.currentUser = 0;

  } else {
    for (var i = 0; i < app.users.length; i++) {
      if (userName === app.users[i].userName) { // check to see if user exsists
        console.log('returning user');
        if (passWord === app.users[i].passWord) {// compare the password to the username
          console.log('password correct');
          alert('welcome back!');
          app.currentUser = i;
          localStorage.currentUser = i;
          User.form.innerHTML = '';
          // localStorage.currentUser = JSON.stringify(app.currentUser);

          break;
        } else {//inncorrect password verify
          console.log('password wrong');
          alert('Password does not match');
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
      confirm('Created New User \nUsername: ' + userName + '\n Password: ' + passWord);
      new User(userName, passWord);
      app.currentUser = userCounter;
      localStorage.currentUser = userCounter;
      localStorage.users = JSON.stringify(app.users);
      alert('Welcome!');
    }
  }
};

User.form.addEventListener('submit', User.handleUserLogin);
