// Import JSON files
import questions from './questions.json' assert { type: 'json' };

// Get all DOM elements
const container = document.querySelector('.container');
const usernameInput = document.getElementById('username');
const validationMsg = document.getElementById('validation-msg');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.querySelector('.next-question');
const playAgainBtn = document.getElementById('play-again');
const startSection = document.getElementById('start');
const currentUserDisplay = document.getElementById('user-display');
const endSection = document.getElementById('game-end');
const finalScoreSpan = document.getElementById('score-value');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('modal-close');
const answerButtons = document.querySelectorAll('.answer');

// Game state variables
let currentUser = '';
let runningScore = 0;
let currentQuestionIndex = 0;
let selectedAnswer = '';
let correctAnswer = '';

// Start Game
const startGame = () => {
    currentUser = usernameInput.value;
    currentUserDisplay.innerText = `Player: ${currentUser}`;
    currentUserDisplay.style.display = 'block';
    startSection.style.display = 'none';
    loadQuestion();
};

// Load question and display modal
const loadQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    document.querySelector('.question-title').innerText = currentQuestion.question;

    // Populate answers
    const answerNodes = Array.from(document.querySelectorAll('.answer-text'));
    answerNodes.forEach((node, index) => {
        node.innerText = currentQuestion.answers[index];
        answerButtons[index].style.color = ''; // Reset answer colors
    });

    correctAnswer = currentQuestion.correctAnswer;

    // Open modal for question display
    modal.showModal();
};

// Answer selection
const selectAnswer = (e) => {
    selectedAnswer = e.target.querySelector('.answer-text').innerText;

    if (selectedAnswer === correctAnswer) {
        runningScore += 100;
        e.target.style.color = 'green';
    } else {
        e.target.style.color = 'red';
    }

    nextBtn.removeAttribute('disabled'); // Enable next button
};

// Next question or end game
const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
        nextBtn.setAttribute('disabled', ''); // Disable next button
    } else {
        endGame();
    }
};

// End Game
const endGame = () => {
    endSection.style.display = 'block';
    finalScoreSpan.innerText = runningScore.toString();
    container.style.display = 'none';
    modal.close(); // Close the modal at the end
};

// Modal close event listeners
modal.addEventListener('click', (e) => {
    if (e.target.nodeName === "DIALOG") {
        modal.close();
    }
});

closeModal.addEventListener("click", () => {
    modal.close();
});

// Event listeners
startBtn.addEventListener('click', startGame);
answerButtons.forEach(answer => answer.addEventListener('click', selectAnswer));
nextBtn.addEventListener('click', nextQuestion);
playAgainBtn.addEventListener('click', () => {
    window.location.reload(); // Reload to restart the game
});