// Fetch JSON data instead of importing
let questions = [];
let users = [];

fetch('./questions.json')
    .then(response => response.json())
    .then(data => { questions = data; })
    .catch(error => console.error('Failed to load questions:', error));

fetch('./users.json')
    .then(response => response.json())
    .then(data => { users = data; })
    .catch(error => console.error('Failed to load users:', error));

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

const answers = [...answerButtons];

let currentUser = '';
let runningScore = 0;
let currentQuestionIndex = 0;
let selectedAnswer = '';
let correctAnswer = '';

// Enable start button when username is entered
usernameInput.addEventListener('input', () => {
    startBtn.disabled = !usernameInput.value.trim();
});

const startGame = () => {
    currentUser = usernameInput.value.trim();
    currentUserDisplay.innerText = `Player: ${currentUser}`;
    currentUserDisplay.style.display = 'block';
    startSection.style.display = 'none';
    loadQuestion();
};

const loadQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    document.querySelector('.question-title').innerText = currentQuestion.question;

    const answerNodes = Array.from(document.querySelectorAll('.answer-text'));
    answerNodes.forEach((node, index) => {
        node.innerText = currentQuestion.answers[index];
        answers[index].style.color = ''; // Reset color
    });

    correctAnswer = currentQuestion.correctAnswer;
};

const selectAnswer = (e) => {
    selectedAnswer = e.target.querySelector('.answer-text').innerText;

    if (selectedAnswer === correctAnswer) {
        runningScore += 100;
        e.target.style.color = 'green';
    } else {
        e.target.style.color = 'red';
    }

    nextBtns[0].removeAttribute('disabled');
};

const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
        nextBtns[0].setAttribute('disabled', ''); // Disable next button
    } else {
        endGame();
    }
};

const endGame = () => {
    endSection.style.display = 'block';
    finalScoreSpan.innerText = runningScore.toString();
    container.style.display = 'none';
};

startBtn.addEventListener('click', startGame);
answers.forEach(answer => answer.addEventListener('click', selectAnswer));
nextBtns[0].addEventListener('click', nextQuestion);
playAgainBtn.addEventListener('click', () => {
    window.location.reload();
});

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