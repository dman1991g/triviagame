// Import JSON file
import questions from './questions.json' assert { type: 'json' }
import users from './users.json' assert { type: 'json' }

// Get all DOM elements
const container = document.querySelector('.container')
const usernameInput = document.getElementById('username')
const validationMsg = document.getElementById('validation-msg')
const startBtn = document.getElementById('start-btn')
const nextBtns = document.querySelectorAll('.next-question')
const playAgainBtn = document.getElementById('play-again')
const startSection = document.getElementById('start')
const currentUserDisplay = document.getElementById('user-display')
const questionGroups = document.querySelectorAll('.question')
const endSection = document.getElementById('game-end')
const finalScoreSpan = document.querySelector('span[id="score"]')
const answerButtons = document.querySelectorAll('.answer')
const questionsInModal = document.querySelectorAll('.game-question')
const userStatsItems = document.querySelectorAll('.user-stat')

// Create array from all the answer buttons
const answers = [...answerButtons]

// Create array from buttons which trigger the displayed <section> element to change
const nextSectionTriggers = [startBtn, ...nextBtns]

// Create an array from all the <section> elements
const sections = [startSection, ...questionGroups, endSection]

// Create an array from all question <li> elements in detailed results modal
const resultsQuestions = [...questionsInModal]

// Create an array from all stat <li> elements at the end of the game
const resultsStats = [...userStatsItems]

// Create array from the questions.json object keys, which will help in selecting random questions
const questionsKeysArray = Object.keys(questions)

// Create array from the users.json object values
const usersValuesArray = Object.values(users)

// Create a new set which will store 10 random questions
const randomTen = new Set()

// Create a set to store fake users
const gameUsers = new Set()

// Create a variable to store current user's chosen username
let currentUser

// Create a variable to store the user's running score
let runningScore = 0

// Declare necessary variables for cycling through the <section> elements
const lastSectionIndex = sections.length - 1
let displayedSectionIndex = 0
let sectionOffset

// Declare necessary variables to display a question and store the selected answer
let nextQuestionNumber = displayedSectionIndex + 1
let currentQuestion
let selectedAnswer
let correctAnswer
let userSelection = false

// Create map to store detailed results
const currentUserDetailedResults = new Map()
currentUserDetailedResults.set("results", [])

// Create map to store all users stats 
const usersStats = new Map()
usersStats.set("stats", [])

// Add fake users’ usernames to gameUsers Set and the full fake user objects to userStats Map
for (const user of usersValuesArray) {
  gameUsers.add(user.username)
  usersStats.entries().next().value[1].push(user)
}

// Add 10 random questions from JSON file to the randomTen array
while (randomTen.size < 10) {
  const randomIndex = Math.floor(Math.random() * questionsKeysArray.length)
  const randomObjectKey = questionsKeysArray[randomIndex]
  if (randomTen.has(questions[randomObjectKey])) {
    continue;
  } else {
    randomTen.add(questions[randomObjectKey])
  }
}

// Get access to the set's values
const randomQuestionSet = randomTen.values()

/* 
   Check if DOM's readyState is "complete", then move all question sections 
   out of view 
*/
document.onreadystatechange = (e) => {
  if (document.readyState === "complete") {
    sections.forEach((section, index) => {
      section.style.transform = `translateX(${index * 100}%)`
    })
  }
}

// Define functions to handle valid and invalid state at game start
const setStartGameInvalidState = () => {
  usernameInput.style.border = "2px solid rgb(211, 70, 70)"
  validationMsg.style.display = "block"
  startBtn.setAttribute('disabled', '')
}

const setStartGameValidState = () => {
  usernameInput.style.border = "2px solid black"
  validationMsg.style.display = "none"
  startBtn.removeAttribute('disabled')
}

// Create helper function to check if gameUsers Set already contains the username entered
const userExists = (username) => {
  return gameUsers.has(username)
}

// Create helper function to check validity of usernameInput value using the Validator.js package
const isValid = (usernameInputValue) => {
  if (!validator.isEmpty(usernameInputValue) && validator.isLength(usernameInputValue, { min: 5 })) {
    return { valid: true, msg: null }
  } else {
    if (validator.isEmpty(usernameInputValue)) {
      return { valid: false, msg: "Required" }
    } else if (!validator.isLength(usernameInputValue, { min: 5 })) {
      return { valid: false, msg: "Minimum 5 characters" }
    } else {
      return { valid: false, msg: "Input invalid" }
    }
  }
}

// Create an event listener callback function to sanitize and validate the input value from the username field
const checkUsernameValidity = () => {
  const sanitizedInput = DOMPurify.sanitize(usernameInput.value)
  const trimmedInput = validator.trim(sanitizedInput)
  const escapedInput = validator.escape(trimmedInput)

  const validation = isValid(escapedInput)
  const usernameNotTaken = userExists(escapedInput)

  if (!validation.valid || usernameNotTaken) {
    setStartGameInvalidState()

    if (usernameNotTaken) {
      validationMsg.innerHTML = "Username already in use"
    } else {
      validationMsg.innerHTML = validation.msg
    }

  } else {
    currentUser = escapedInput
    setStartGameValidState()
  }
}

// Define a function to toggle the select indicator on any given answer button
const toggleSelectIndicator = (e) => {
  userSelection = true

  if (e.target.id.includes("answer-selection")) {
    const childrenArray = Array.from(e.target.parentElement.children)
    childrenArray.forEach((answerBtn) => {
      answerBtn.children[0].style.border = "2px solid #fff"
      answerBtn.children[0].style.boxShadow = "none"
    })

    e.target.children[0].style.border = "none"
    e.target.children[0].style["box-shadow"] = "var(--blue-neon-box)"

    selectedAnswer = e.target.children[1].innerText

    if (userSelection) {
      e.target.parentElement.nextElementSibling.removeAttribute('disabled')
    }

  } else if (e.target.id.includes("-indicator") || e.target.id.includes("__text")) {

    const childrenArray = Array.from(e.target.parentElement.parentElement.children)
    childrenArray.forEach((answerBtn) => {
      answerBtn.children[0].style.border = "2px solid #fff"
      answerBtn.children[0].style.boxShadow = "none"
    })

    if (e.target.id.includes("-indicator")) {

      e.target.style.border = "none"
      e.target.style["box-shadow"] = "var(--blue-neon-box)"
     
      selectedAnswer = e.target.nextElementSibling.innerText

    } else {

      e.target.previousElementSibling.style.border = "none"
      e.target.previousElementSibling.style["box-shadow"] = "var(--blue-neon-box)"

      selectedAnswer = e.target.innerText
    }

    if (userSelection) {
      e.target.parentElement.parentElement.nextElementSibling.removeAttribute('disabled')
    }
  }

  // Verify if the selected answer is correct
  if (selectedAnswer === correctAnswer) {
    e.target.style.color = "green"
  } else {
    e.target.style.color = "" // Reset color if the answer is incorrect
  }
}

// **iOS touch event handler**: Handles both click and touch events
answers.forEach((answer) => {
  answer.addEventListener('click', toggleSelectIndicator)
  answer.addEventListener('touchend', toggleSelectIndicator) // Added touch support
})

// Add input and blur listeners to username input field
usernameInput.addEventListener('input', checkUsernameValidity)
usernameInput.addEventListener('blur', checkUsernameValidity)

// Add a click listener to the Play Again button
playAgainBtn.addEventListener('click', () => window.location.reload())

// Register the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope)
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error)
      })
  })
}