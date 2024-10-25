// Import JSON files
import questions from './questions.json' assert { type: 'json' };
import users from './users.json' assert { type: 'json' };

// Get all DOM elements
const container = document.querySelector('.container');
const usernameInput = document.getElementById('username');
const validationMsg = document.getElementById('validation-msg');
const startBtn = document.getElementById('start-btn');
const nextBtns = document.querySelectorAll('.next-question');
const playAgainBtn = document.getElementById('play-again');
const startSection = document.getElementById('start');
const currentUserDisplay = document.getElementById('user-display');
const questionGroups = document.querySelectorAll('.question');
const endSection = document.getElementById('game-end');
const finalScoreSpan = document.getElementById('score-value');
const answerButtons = document.querySelectorAll('.answer');

// Create array from all answer buttons
const answers = [...answerButtons];

// Variables for managing the game state
let currentUser = '';
let runningScore = 0;
let currentQuestionIndex = 0;
let selectedAnswer = '';
let correctAnswer = '';

// Function to start the game
const startGame = () => {
    currentUser = usernameInput.value;
    currentUserDisplay.innerText = `Player: ${currentUser}`;
    currentUserDisplay.style.display = 'block';
    startSection.style.display = 'none';
    loadQuestion();
};

// Function to load a question and answers
const loadQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    document.querySelector('.question-title').innerText = currentQuestion.question;

    const answerNodes = Array.from(document.querySelectorAll('.answer-text'));
    answerNodes.forEach((node, index) => {
        node.innerText = currentQuestion.answers[index];
    });

    correctAnswer = currentQuestion.correctAnswer;
};

// Function to handle answer selection
const selectAnswer = (e) => {
    selectedAnswer = e.target.querySelector('.answer-text').innerText;

    if (selectedAnswer === correctAnswer) {
        runningScore += 100;
        e.target.style.color = 'green'; // Indicate correct answer
    } else {
        e.target.style.color = 'red'; // Indicate incorrect answer
    }

    nextBtns[0].removeAttribute('disabled'); // Enable next button
};

// Function to go to the next question or end the game
const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
        nextBtns[0].setAttribute('disabled', ''); // Disable next button
    } else {
        endGame();
    }
};

// Function to end the game and display the score
const endGame = () => {
    endSection.style.display = 'block';
    finalScoreSpan.innerText = runningScore.toString();
    container.style.display = 'none'; // Hide the main container
};

// Event listeners
startBtn.addEventListener('click', startGame);
answers.forEach(answer => answer.addEventListener('click', selectAnswer));
nextBtns[0].addEventListener('click', nextQuestion);
playAgainBtn.addEventListener('click', () => {
    window.location.reload(); // Reload the page to restart the game
});

// Check for service worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
    });
}