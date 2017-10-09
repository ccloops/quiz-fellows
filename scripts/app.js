'use strict';
User.form = document.getElementById('form');
User.userNameInput = document.getElementById('username');
User.passWordInput = document.getElementById('password');

var app = {
  users: []
};

if (Boolean(localStorage.app) === true) {
  console.log(localStorage.app + ' test ');
  app = JSON.parse(localStorage.app);
}

function User (username, password) {
  this.userName = username;
  this.passWord = password;
  app.users.push(this);
}

User.handleUserLogin = function( event ) {
  event.preventDefault();
  var userName = User.userNameInput.value;
  var passWord = User.passWordInput.value;
  console.log('made it to handle');
  if (app.users.length = '0') {
    console.log('handle if?');
    new User(userName, passWord);
  } else {
    for (var i = 0; i < app.users.length; i++) {
      if (app.users[i].userName === userName && app.users[i].passWord === passWord) {
        console.log('returning user');
        alert('welcome back');
      } else {
        console.log('new user created');
        new User(userName, passWord);
      }
    }
  }
  localStorage.app = JSON.stringify(app.users);

  console.log(' userName: ' + userName + ' ' + 'passWord: ' + passWord);
  console.log('app.users: ' + app.users);
};


User.form.addEventListener('submit', User.handleUserLogin);
