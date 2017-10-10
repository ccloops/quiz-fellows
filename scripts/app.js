'use strict';
User.form = document.getElementById('form');
User.userNameInput = document.getElementById('username');
User.passWordInput = document.getElementById('password');

var app = {
  users: [],
};
console.log(app);

function User (username, password) {
  this.userName = username;
  this.passWord = password;
  app.users.push(this);
}

User.handleUserLogin = function( event ) {
  event.preventDefault();
  var userName = User.userNameInput.value;
  var passWord = User.passWordInput.value;

  if (app.users.length === 0) {// if no users are stored then creates a new user

    console.log('app.users.length = 0 true');
    new User(userName, passWord);

  } else { // check to see if user exsists
    for (var i = 0; i < app.users.length; i++) {
      if (userName === app.users[i].userName && passWord === app.users[i].passWord) {
        console.log('returning user');
        alert('welcome back');
        break;
      } else {
        alert('new user');
        var userCounter = 0;
        for (var j = 0; j < app.users.length; j++) {
          if (userName !== app.users[j].userName && passWord !== app.users[j].passWord) { //add to counter for each time the the un and pw do not match
            userCounter += 1;
          }
        }
        console.log('counter: ' + userCounter);
        if (userCounter === app.users.length) { //if every user was accounted for with counter = every user then create new user.
          alert('create new user');
          new User(userName, passWord);
        }
      }
    }
  }
};

User.form.addEventListener('submit', User.handleUserLogin);
