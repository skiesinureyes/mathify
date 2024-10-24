// Show take test popup
takeTestBtn.onclick = () => {
    takeTestModal.style.display = 'flex';
}

// Show about
document.getElementById('aboutBtn').addEventListener('click', function() {
    clearInterval(timer);
    document.querySelector(".about").style.display = 'block';
    document.querySelector(".landing").style.display = 'none';
    document.querySelector(".takeTestSection").style.display = 'none';
});

// Close popups
closeTakeTest.onclick = () => takeTestModal.style.display = 'none';
closeTestSummary.onclick = () => testSummaryModal.style.display = 'none';

// Start test
document.getElementById("startTestBtn").addEventListener("click", function() {
    document.querySelector(".landing").style.display = "none";
    document.getElementById("takeTestModal").style.display = "none";
    document.querySelector(".takeTestSection").style.display = "block";
});

// Back to landing page through logo
document.getElementById("logo-container").addEventListener("click", function() {
    clearInterval(timer);
    document.querySelector(".landing").style.display = 'block';

    document.querySelector(".about").style.display = 'none';

    document.querySelector(".takeTestSection").style.display = 'none';
});

// Test logic
let rightScore = 0;
let wrongScore = 0;
let timer;
let timeLeft = 60;
let currentAnswer;
let questionsAnswered = 0;
let totalTime = 60;
let summaryShown = false;

// function generateQuestion() {
//     const num1 = Math.floor(Math.random() * 10);
//     const num2 = Math.floor(Math.random() * 10);
//     const operator = Math.random() < 0.5 ? '+' : '-';
//     const question = `${num1} ${operator} ${num2} = `;
//     const answer = operator === '+' ? num1 + num2 : num1 - num2; 
//     return { question, answer };
// }

function generateQuestion() {
    // Generate two random numbers for addition and subtraction, ranging from 1 to 100
    const num1 = Math.floor(Math.random() * 100) + 1; // Range: 1 to 100
    const num2 = Math.floor(Math.random() * 100) + 1; // Range: 1 to 100

    // Generate two random numbers for multiplication, limited to one digit (1-9)
    const mulNum1 = Math.floor(Math.random() * 9) + 1; // Range: 1 to 9
    const mulNum2 = Math.floor(Math.random() * 9) + 1; // Range: 1 to 9

    // Randomly select an operator, including +, -, *, and /
    const operators = ['+', '-', '*', '/'];
    const operator = operators[Math.floor(Math.random() * operators.length)];

    let question, answer;

    if (operator === '/') {
        // Ensure num1 is a multiple of the divisor to avoid fractions
        const divisor = Math.floor(Math.random() * 9) + 1; // Range: 1 to 9
        const dividend = divisor * (Math.floor(Math.random() * 10) + 1); // Generate a multiple of divisor
        question = `${dividend} / ${divisor} = `;
        answer = dividend / divisor; // Division will yield an integer
    } else if (operator === '*') {
        question = `${mulNum1} * ${mulNum2} = `;
        answer = mulNum1 * mulNum2; // Multiplication
    } else {
        // For + and - ensure no negatives
        if (operator === '+') {
            question = `${num1} + ${num2} = `;
            answer = num1 + num2; // Addition
        } else { // operator === '-'
            // Ensure num1 >= num2 for subtraction
            const validNum2 = Math.floor(Math.random() * num1) + 1; // Range: 1 to num1
            question = `${num1} - ${validNum2} = `;
            answer = num1 - validNum2; // Subtraction
        }
    }

    return { question, answer };
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            document.getElementById('timer').textContent = timeLeft;
        } else {
            clearInterval(timer);
            showSummary();
        }
    }, 1000);
}

// Show test summary
function showSummary() {
    const accuracy = (rightScore + wrongScore) > 0 ? (rightScore / (rightScore + wrongScore) * 100).toFixed(2) : 0;
    const speed = calculateSpeed();
    const tier = getTier(speed);

    const summaryText = `
        You are a ${tier}<br><br>
        Average Speed: ${speed} QPM <br>
        Accuracy: ${accuracy}%<br><br>
        Right Answers: ${rightScore}<br>
        Wrong Answers: ${wrongScore}<br><br>
    `;
    
    document.getElementById('testSummaryText').innerHTML = summaryText;
    document.getElementById('testSummaryModal').style.display = 'block'; 
}

function calculateSpeed() {
    if (rightScore === 0) {
        return 0; 
    }
    return ((rightScore / totalTime)*100).toFixed(0);
}

function getTier(speed) {
    if (speed <= 15) {
        return "Snail Slowpoke 🐌";
    } else if (speed <= 30) {
        return "Bouncy Bunny 🐰";
    } else if (speed <= 45) {
        return "Speedy Turtle 🐢💨";
    } else if (speed <= 60) {
        return "Zippy Zebra 🦓⚡";
    } else if (speed <= 75) {
        return "Flashy Fox 🦊🌟";
    } else {
        return "Lightning Lemur ⚡🐒";
    }
}

function resetGame() {
    rightScore = 0;
    wrongScore = 0;
    timeLeft = 60;
    document.getElementById('rightScore').textContent = rightScore;
    document.getElementById('wrongScore').textContent = wrongScore;
    document.getElementById('timer').textContent = timeLeft;
    generateNewQuestion();
    startTimer();
}

function generateNewQuestion() {
    const { question, answer } = generateQuestion();
    document.getElementById('question').textContent = question;
    currentAnswer = answer;
    document.getElementById('answer').value = ''; 
}

document.getElementById('answer').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        const userAnswer = parseInt(this.value); // Parse the user input as an integer

        // Check if the answer is correct
        if (!isNaN(userAnswer)) { // Ensure user input is a number
            if (userAnswer === currentAnswer) {
                rightScore++;
                questionsAnswered++;
                document.getElementById('rightScore').textContent = rightScore;
            } else { // Only count wrong answer if there's some input
                wrongScore++;
                document.getElementById('wrongScore').textContent = wrongScore;
            }

            // Clear the input field for the next question
            this.value = '';

            // Generate a new question after answering
            generateNewQuestion();
        }
    }
});

document.getElementById('startTestBtn').addEventListener('click', function() {
    resetGame();
    startTimer(); 
});

// Home button functionality
document.getElementById('homeBtn').addEventListener('click', function() {
    document.getElementById('testSummaryModal').style.display = 'none'; // Close the modal
    document.querySelector(".takeTestSection").style.display = 'none';
    document.querySelector(".landing").style.display = 'block';
    summaryShown = false;
});

// Leave button functionality
document.getElementById('leaveBtn').addEventListener('click', function() {
    document.querySelector(".takeTestSection").style.display = 'none';
    document.querySelector(".landing").style.display = 'block';
});

// Restart button functionality
document.getElementById('restartBtn').addEventListener('click', function() {
    resetGame();
    startTimer();
});

// Start again button functionality
document.getElementById('startAgainBtn').addEventListener('click', function() {
    document.getElementById('testSummaryModal').style.display = 'none'; // Close the modal
    resetGame();
    startTimer();
});