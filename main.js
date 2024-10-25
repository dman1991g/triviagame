// Import JSON files
import questions from './questions.json' assert { type: 'json' };
import users from './users.json' assert { type: 'json' };

// Cache DOM elements with jQuery
const $container = $('.container');
const $usernameInput = $('#username');
const $validationMsg = $('#validation-msg');
const $startBtn = $('#start-btn');
const $nextBtns = $('.next-question');
const $playAgainBtn = $('#play-again');
const $startSection = $('#start');
const $currentUserDisplay = $('#user-display');
const $questionGroups = $('.question');
const $endSection = $('#game-end');
const $finalScoreSpan = $('#score-value');
const $answerButtons = $('.answer');

// Variables for managing the game state
let currentUser = '';
let runningScore = 0;
let currentQuestionIndex = 0;
let selectedAnswer = '';
let correctAnswer = '';

// Function to start the game
const startGame = () => {
    currentUser = $usernameInput.val();
    $currentUserDisplay.text(`Player: ${currentUser}`).show();
    $startSection.hide();
    loadQuestion();
};

// Function to load a question and answers
const loadQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    $('.question-title').text(currentQuestion.question);

    $answerButtons.each((index, button) => {
        $(button).find('.answer-text').text(currentQuestion.answers[index]);
    });

    correctAnswer = currentQuestion.correctAnswer;
};

// Function to handle answer selection
const selectAnswer = (e) => {
    selectedAnswer = $(e.target).find('.answer-text').text();

    if (selectedAnswer === correctAnswer) {
        runningScore += 100;
        $(e.target).css('color', 'green'); // Indicate correct answer
    } else {
        $(e.target).css('color', 'red'); // Indicate incorrect answer
    }

    $nextBtns.prop('disabled', false); // Enable next button
};

// Function to go to the next question or end the game
const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
        $nextBtns.prop('disabled', true); // Disable next button
    } else {
        endGame();
    }
};

// Function to end the game and display the score
const endGame = () => {
    $endSection.show();
    $finalScoreSpan.text(runningScore.toString());
    $container.hide(); // Hide the main container
};

// Event listeners
$startBtn.on('click', startGame);
$answerButtons.on('click', selectAnswer);
$nextBtns.on('click', nextQuestion);
$playAgainBtn.on('click', () => {
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