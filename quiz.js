const quizContainer = document.querySelector(".quiz-container");
const questionBox = document.querySelector(".question");
const choicesBox = document.querySelector(".choices");
const nextButton = document.querySelector(".nextbutton");
const restartButton = document.createElement("button"); // Create Restart Button
restartButton.textContent = "Restart";
restartButton.classList.add("restartbutton", "d-none"); // Initially hidden
quizContainer.appendChild(restartButton); // Add Restart Button to the Quiz Container
const scoreCard = document.querySelector(".scorecard");
const startButtons = document.querySelectorAll(".startbutton");
const timerDisplay = document.querySelector(".timer");

let currentQuiz = [];
let currentQuizType = "";
let currentQuestionIndex = 0;
let score = 0;
let timerId;
let timeLeft = 30;
let userAnswers = [];

// Question sets for each quiz
const quizData = {
    html: [
        { question: "What does HTML stand for?", choices: ["Hypertext Markup Language", "Hyperlink Text Markup Language", "Home Tool Markup Language", "Hyperlink Text Modifiable Language"], answer: "Hypertext Markup Language" },
        { question: "Which tag is used for creating a hyperlink?", choices: ["<link>", "<a>", "<href>", "<hyper>"], answer: "<a>" },
        { question: "What does the <div> tag represent?", choices: ["A division or section", "An image tag", "A heading tag", "A paragraph tag"], answer: "A division or section" },
        { question: "Which of the following is not a valid HTML tag?", choices: ["<p>", "<br>", "<section>", "<image>"], answer: "<image>" },
        { question: "Which tag is used for inserting an image?", choices: ["<img>", "<image>", "<picture>", "<src>"], answer: "<img>" },
        { question: "What is the correct HTML element for inserting a line break?", choices: ["<break>", "<lb>", "<br>", "<hr>"], answer: "<br>" },
        { question: "Which of these attributes is used to add a description to an image in HTML?", choices: ["alt", "title", "src", "description"], answer: "alt" },
        { question: "Which HTML element is used to define the metadata of a document?", choices: ["<meta>", "<head>", "<title>", "<body>"], answer: "<meta>" },
        { question: "What does the <h1> tag represent?", choices: ["A header", "A heading 1", "A hyperlink", "A paragraph"], answer: "A heading 1" },
        { question: "How do you create a checkbox in HTML?", choices: ["<checkbox>", "<input type='checkbox'>", "<input type='radio'>", "<input type='button'>"], answer: "<input type='checkbox'>" }
    ],
    css: [
        { question: "What does CSS stand for?", choices: ["Cascading Style Sheets", "Colorful Style Sheets", "Creative Style Sheets", "Computer Style Sheets"], answer: "Cascading Style Sheets" },
        { question: "Which property changes the background color?", choices: ["color", "background", "background-color", "bgcolor"], answer: "background-color" },
        { question: "Which property is used to change the font size in CSS?", choices: ["font-size", "text-size", "font", "text-style"], answer: "font-size" },
        { question: "Which of these is a valid CSS color?", choices: ["#ff0000", "red", "rgb(255, 0, 0)", "All of the above"], answer: "All of the above" },
        { question: "How do you select an element with the class name 'example' in CSS?", choices: [".example", "#example", "example", "*example"], answer: ".example" },
        { question: "How do you make text bold in CSS?", choices: ["font-weight: bold;", "text-style: bold;", "font-style: bold;", "text-weight: bold;"], answer: "font-weight: bold;" },
        { question: "Which property is used to add space between elements in CSS?", choices: ["padding", "margin", "spacing", "space-between"], answer: "margin" },
        { question: "How can you change the font of an element in CSS?", choices: ["font-family", "text-font", "font-style", "text-family"], answer: "font-family" },
        { question: "Which CSS property controls the layout of an element?", choices: ["layout", "position", "display", "size"], answer: "display" },
        { question: "What does the CSS 'float' property do?", choices: ["It floats the element to the top", "It positions an element to the left or right", "It aligns an element vertically", "It adds a shadow to the element"], answer: "It positions an element to the left or right" }
    ],
    javascript: [
        { question: "What is used to declare a variable?", choices: ["var", "let", "const", "All of the above"], answer: "All of the above" },
        { question: "What does 'this' refer to in JavaScript?", choices: ["The current object", "The parent object", "The DOM", "None of the above"], answer: "The current object" },
        { question: "Which operator is used for equality in JavaScript?", choices: ["=", "==", "===", "!="], answer: "==" },
        { question: "What is the correct way to write a function in JavaScript?", choices: ["function myFunction()", "function: myFunction()", "myFunction()", "function = myFunction()"], answer: "function myFunction()" },
        { question: "Which of the following is not a valid JavaScript data type?", choices: ["String", "Boolean", "Float", "Object"], answer: "Float" },
        { question: "What is the correct syntax to call a function named 'myFunction'?", choices: ["myFunction()", "call myFunction()", "invoke myFunction()", "call function myFunction()"], answer: "myFunction()" },
        { question: "What will the following code output: console.log(2 + '2')?", choices: ["4", "22", "NaN", "undefined"], answer: "22" },
        { question: "How do you write an if statement in JavaScript?", choices: ["if (x > 5)", "if x > 5 then", "if (x > 5) {}", "if x > 5 {}"], answer: "if (x > 5)" },
        { question: "Which method is used to convert a string to an integer in JavaScript?", choices: ["parseInt()", "toInteger()", "parseFloat()", "Number()"], answer: "parseInt()" },
        { question: "Which symbol is used to access a property of an object in JavaScript?", choices: [".", "#", "&", "::"], answer: "." }
    ],
    cplusplus: [
        { question: "What is the correct syntax for declaring a variable in C++?", choices: ["var a;", "int a;", "let a;", "dim a;"], answer: "int a;" },
        { question: "Which function is used to print to the console in C++?", choices: ["console.log()", "echo()", "cout <<", "printf()"], answer: "cout <<" },
        { question: "What is the default value of an uninitialized variable in C++?", choices: ["0", "null", "undefined", "garbage value"], answer: "garbage value" },
        { question: "Which operator is used to access members of a structure in C++?", choices: [".", "->", "::", "."], answer: "." },
        { question: "What is the size of a `char` in C++?", choices: ["1 byte", "2 bytes", "4 bytes", "8 bytes"], answer: "1 byte" },
        { question: "Which of the following is used to allocate memory dynamically in C++?", choices: ["malloc()", "new", "calloc()", "alloc()"], answer: "new" },
        { question: "Which keyword is used to define a constant in C++?", choices: ["constant", "final", "const", "static"], answer: "const" },
        { question: "What is the correct way to declare a function in C++?", choices: ["void function()", "function()", "def function()", "function: void"], answer: "void function()" },
        { question: "Which method is used to find the length of a string in C++?", choices: ["str.length()", "length(str)", "strlen()", "sizeof()"], answer: "strlen()" },
        { question: "Which header file is needed to use `cin` and `cout` in C++?", choices: ["#include <iostream>", "#include <cinout>", "#include <stdio.h>", "#include <iostream.h>"], answer: "#include <iostream>" }
    ],
    python: [
        { question: "Which of the following is used to output to the console in Python?", choices: ["console.log()", "echo()", "print()", "printf()"], answer: "print()" },
        { question: "Which symbol is used for comments in Python?", choices: ["//", "#", "/*", "<!--"], answer: "#" },
        { question: "How do you define a function in Python?", choices: ["def function()", "function def()", "def: function()", "function()"], answer: "def function()" },
        { question: "Which of the following is used to create a list in Python?", choices: ["[]", "()", "{}", "<>"], answer: "[]" },
        { question: "How do you write an if statement in Python?", choices: ["if (x == 10):", "if x == 10", "if x == 10 {}", "if x == 10 then"], answer: "if x == 10" },
        { question: "Which method is used to remove whitespace from a string in Python?", choices: ["trim()", "strip()", "remove()", "clean()"], answer: "strip()" },
        { question: "What is the keyword used for defining a class in Python?", choices: ["class", "def", "object", "type"], answer: "class" },
        { question: "Which function is used to get the length of a list in Python?", choices: ["len()", "length()", "size()", "count()"], answer: "len()" },
        { question: "What is the correct way to create a tuple in Python?", choices: ["()", "[]", "{}", "<>"], answer: "()" },
        { question: "Which of the following is not a valid data type in Python?", choices: ["int", "string", "list", "double"], answer: "double" }
    ],
    java: [
        { question: "Which method is used to print in Java?", choices: ["println()", "print()", "cout <<", "System.out.println()"], answer: "System.out.println()" },
        { question: "Which class is the parent class of all classes in Java?", choices: ["Object", "Base", "Super", "Parent"], answer: "Object" },
        { question: "How do you define a method in Java?", choices: ["void method()", "function method()", "def method()", "method void()"], answer: "void method()" },
        { question: "What is the correct way to create a string object in Java?", choices: ["String str = 'Hello';", "String str = new String('Hello');", "String str = 'new String(Hello)';", "String str = 'new Hello';"], answer: "String str = new String('Hello');" },
        { question: "Which of these is not a primitive data type in Java?", choices: ["int", "char", "String", "boolean"], answer: "String" },
        { question: "Which keyword is used to define a constant in Java?", choices: ["final", "const", "static", "constant"], answer: "final" },
        { question: "What is the default value of a boolean variable in Java?", choices: ["true", "false", "null", "undefined"], answer: "false" },
        { question: "Which of the following is used to define a package in Java?", choices: ["#include", "import", "package", "define"], answer: "package" },
        { question: "Which method is used to parse a string to an integer in Java?", choices: ["Integer.parseInt()", "parseInt()", "int.parse()", "parseInt(string)"], answer: "Integer.parseInt()" },
        { question: "How do you declare a class in Java?", choices: ["class ClassName {}", "class = ClassName {}", "def ClassName {}", "Class ClassName {}"], answer: "class ClassName {}" }
    ]
};

// Start quiz
function startQuiz(quizType) {
    currentQuizType = quizType;
    currentQuiz = shuffleQuestions(quizData[quizType]);
    currentQuestionIndex = 0;
    score = 0;
    const testimonialsSection = document.getElementById('testimonials')
    testimonialsSection.style.display = 'none';

// Hide the About Us section
const aboutSection = document.getElementById("about");
if (aboutSection) {
    aboutSection.style.display = "none";
}

// Show the quiz container and hide other sections
document.querySelector(".quiz-container").style.display = "block";
document.querySelector(".carousel").style.display = "none";
document.querySelector(".container").style.display = "none";
nextButton.classList.add("d-none"); // Hide Next Button at start
restartButton.classList.add("d-none"); // Hide Restart Button at start

showQuestion();
}

// Show questions
function showQuestion() {
    const currentQuestion = currentQuiz[currentQuestionIndex];
    questionBox.textContent = currentQuestion.question;
    choicesBox.innerHTML = "";

    currentQuestion.choices.forEach((choice) => {
        const choiceDiv = document.createElement("div");
        choiceDiv.textContent = choice;
        choiceDiv.classList.add("choice");
        choicesBox.appendChild(choiceDiv);

        choiceDiv.addEventListener("click", () => {
            if (choiceDiv.classList.contains("selected")) {
                // Deselect if already selected
                choiceDiv.classList.remove("selected");
                nextButton.classList.add("d-none");
            } else {
                // Select new option
                document.querySelectorAll(".choice").forEach((el) => el.classList.remove("selected"));
                choiceDiv.classList.add("selected");
                nextButton.classList.remove("d-none");
            }
        });
    });

    startTimer();
}

// Shuffle the questions
function shuffleQuestions(quiz) {
    return quiz.sort(() => Math.random() - 0.5);
}

// Timer logic
function startTimer() {
    clearInterval(timerId);  // Clear any previous timer
    timeLeft = 30;  // Reset timer
    timerDisplay.textContent = timeLeft;

    timerId = setInterval(() => {
        timeLeft--;  // Decrease time left
        timerDisplay.textContent = timeLeft;

        if (timeLeft === 0) {
            clearInterval(timerId);  // Stop the timer
            showAnswer(false);  // Show the answer even if time is up
            moveToNextQuestion(); // Move to the next question automatically
        }
    }, 1000);
}


// Show answer and feedback when time is up or answer is selected
function showAnswer(isAnswerSelected) {
    clearInterval(timerId);  // Stop the timer as answer is being processed

    const selectedChoice = document.querySelector(".choice.selected");

    if (!isAnswerSelected) {
        alert("Time's up! Moving to the next question.");
    } else if (selectedChoice) {
        const correctAnswer = currentQuiz[currentQuestionIndex].answer;
        if (selectedChoice.textContent.trim() === correctAnswer.trim()) {
            alert("Correct!");
        } else {
            alert(`Wrong! The correct answer is: ${correctAnswer}`);
        }
    } else {
        alert("No answer selected. Moving to the next question.");
    }

    // Show Next button after an answer or timeout
    nextButton.textContent = "Next Question";
    nextButton.classList.remove("d-none");

    // Move to the next question after showing feedback
    nextButton.addEventListener("click", moveToNextQuestion);
}

// Move to the next question
function moveToNextQuestion() {
    if (currentQuestionIndex < currentQuiz.length - 1) {
        currentQuestionIndex++;  // Increment to the next question
        nextButton.classList.add("d-none"); // Hide Next Button initially
        showQuestion(); // Display the next question
    } else {
        endQuiz(); // End the quiz if all questions are answered
    }
}


// Check and move to the next question
function checkAnswer() {
    const selectedChoice = document.querySelector(".choice.selected");
    if (!selectedChoice) {
        alert("Please select an answer!");
        return;
    }

    // Validate answer and increment score if correct
    const correctAnswer = currentQuiz[currentQuestionIndex].answer;
    if (selectedChoice.textContent.trim() === correctAnswer.trim()) {
        score++; // Increment score if the answer is correct
        alert("Correct!");
    } else {
        alert(`Wrong! The correct answer is: ${correctAnswer}`);
    }

    // Move to the next question
    if (currentQuestionIndex < currentQuiz.length - 1) {
        currentQuestionIndex++;
        nextButton.classList.add("d-none");
        showQuestion();
    } else {
        endQuiz();
    }
}

// End quiz
function endQuiz() {
    clearInterval(timerId); // Stop the timer
    questionBox.textContent = "Quiz Completed!"; // Set the final question message
    choicesBox.textContent = ""; // Clear the choices
    scoreCard.textContent = `You scored ${score} out of ${currentQuiz.length}`; // Display the score
    nextButton.classList.add("d-none"); // Hide Next Button
    restartButton.classList.remove("d-none"); // Show Restart Button
    
    // Hide the timer after the quiz ends
    timerDisplay.classList.add("d-none");
}


// Event listeners for start buttons
startButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const quizType = button.getAttribute("data-quiz");
        startQuiz(quizType);
    });
});

// Next button logic
nextButton.addEventListener("click", () => {
    checkAnswer(); // Evaluate and move to the next question
});

// Listen for the Enter key to trigger the Next button click
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        nextButton.click(); // Simulate click on the Next button
    }
});


// Restart button logic
restartButton.addEventListener("click", () => {
    scoreCard.textContent = ""; // Clear the scoreboard
    timerDisplay.classList.remove("d-none"); // Ensure timer is visible
    startQuiz(currentQuizType); // Start the quiz again
    startTimer(); // Restart the timer
});


// Select all cards
const cards = document.querySelectorAll('.card');

// Create an Intersection Observer
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view'); // Add 'in-view' class when in viewport
            } else {
                entry.target.classList.remove('in-view'); // Remove 'in-view' class when out of viewport
            }
        });
    },
    {
        threshold: 0.2, // Trigger when 20% of the card is visible
    }
);

// Attach observer to each card
cards.forEach((card) => {
    observer.observe(card);
});

// Select all team cards
const teamCards = document.querySelectorAll('.card1');

// Create an Intersection Observer
const observer1 = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
                entry.target.classList.remove('in-view');
            }
        });
    },
    {
        rootMargin: "0px", // Add margin to help trigger detection sooner
        threshold: 0.1, // Adjust as necessary
    }
);


// Attach observer to each card
teamCards.forEach((card) => {
    observer1.observe(card);
});


// Select all testimonial cards
const testimonialCards = document.querySelectorAll('.testimonial-card');

// Create an Intersection Observer
const observer2 = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view'); // Add 'in-view' when in the viewport
            } else {
                entry.target.classList.remove('in-view'); // Remove 'in-view' when out of viewport
            }
        });
    },
    {
        threshold: 0.1, // Trigger when 10% of the card is visible
    }
);

// Attach observer to each card
testimonialCards.forEach((card) => {
    observer2.observe(card);
});

testimonialCards.forEach((card, index) => {
    observer2.observe(card);
    card.style.transitionDelay = `${index * 0.2}s`; // Stagger each card
});

// Mock login status
let isLoggedIn = false;
let userName = ''; // Variable to store the username

// Get references to the login button and profile link
const loginBtn = document.getElementById('login-btn');
const profileLink = document.getElementById('profile-link');
const profileName = document.getElementById('profile-name');
const logoutBtn = document.getElementById('logout-btn');

// Function to update the navbar based on login status
function updateNavbar() {
    if (isLoggedIn) {
        // Show profile link and update the login button to logout
        profileLink.style.display = 'block';
        profileName.innerText = `${userName.toUpperCase()}`; // Display user's name
        loginBtn.style.display = 'none'; // Hide login button when logged in
        logoutBtn.style.display = 'block'; // Show logout button
    } else {
        // Hide profile link and reset the login button
        profileLink.style.display = 'none';
        loginBtn.style.display = 'block'; // Show login button
        logoutBtn.style.display = 'none'; // Hide logout button
    }
}

// Handle logout
function handleLogout(event) {
    event.preventDefault(); // Prevent default link behavior
    isLoggedIn = false;
    userName = ''; // Clear the stored username
    localStorage.removeItem('userName'); // Remove username from localStorage
    alert('You have been logged out.');
    updateNavbar(); // Update navbar to reflect logout
}

// Handle login (this could be replaced with actual login logic)
function handleLogin() {
    const username = prompt("Please enter your username:"); // Prompt the user for their username

    if (username) {
        isLoggedIn = true;
        userName = username; // Store the username
        localStorage.setItem('userName', userName); // Store the username in localStorage
        updateNavbar();
    } else {
        alert("Username is required for login.");
    }
}

// On page load, check for login status and update the navbar
document.addEventListener('DOMContentLoaded', () => {
    // Retrieve user data from localStorage if available
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
        isLoggedIn = true;
        userName = storedUserName;
    }

    // Update navbar on page load
    updateNavbar();

    // If not logged in, trigger login prompt
    if (!isLoggedIn) {
        handleLogin();
    }
});

// Logout button event
logoutBtn.addEventListener('click', handleLogout);

// Login button event (optional, depending on your actual logic)
document.getElementById('login-btn').addEventListener('click', function (event) {
    // Redirect to login form page if needed
    window.location.href = 'form1.html';
});
