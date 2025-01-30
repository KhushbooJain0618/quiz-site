document.getElementById('to-sign-up').addEventListener('click', function() {
  document.querySelector('.login').style.transform = 'translateX(-100%)';
  document.querySelector('.sign-up').style.transform = 'translateX(0)';
});

document.getElementById('to-login').addEventListener('click', function() {
  document.querySelector('.login').style.transform = 'translateX(0)';
  document.querySelector('.sign-up').style.transform = 'translateX(100%)';
});

document.getElementById("google-login").addEventListener("click", function () {
  window.open("https://accounts.google.com/signin", "_blank");
});

document.getElementById("facebook-login").addEventListener("click", function () {
  window.open("https://www.facebook.com/login", "_blank");
});

document.getElementById("instagram-login").addEventListener("click", function () {
  window.open("https://www.instagram.com/accounts/login/", "_blank");
});

document.getElementById("linkedin-login").addEventListener("click", function () {
  window.open("https://www.linkedin.com/login", "_blank");
});



// Sign-up form functionality
const signUpForm = document.querySelector('.sign-up form');
signUpForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form from submitting normally

  const username = signUpForm.querySelector('input[type="text"]').value;
  const email = signUpForm.querySelector('input[type="email"]').value;
  const password = signUpForm.querySelector('input[type="password"]').value;

  if (!username || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  // Save user data to localStorage
  const user = { username, email, password };
  localStorage.setItem(email, JSON.stringify(user));

  alert("Sign-up successful! You can now log in.");
  // Clear the form
  signUpForm.reset();
});

// Login form functionality
const loginForm = document.querySelector('.login form');
loginForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form from submitting normally

  const emailOrUsername = loginForm.querySelector('input[type="text"]').value;
  const password = loginForm.querySelector('input[type="password"]').value;

  let loggedIn = false;

  // Iterate through localStorage to check for matching user
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const user = JSON.parse(localStorage.getItem(key));

    if ((user.email === emailOrUsername || user.username === emailOrUsername) && user.password === password) {
      loggedIn = true;
      break;
    }
  }

  if (loggedIn) {
    alert("Login successful!");
    window.location.href = 'quiz.html'; // Redirect to quiz page
  } else {
    alert("Invalid username/email or password. Please try again.");
  }
});


