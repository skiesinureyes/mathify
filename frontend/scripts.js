// Sign up function
async function registerUser() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const responseDiv = document.getElementById('register-response');

    // Reset responseDiv
    responseDiv.textContent = '';

    if (!name || !email || !password) {
        console.log("All fields are required.");
        alert("Please fill all fields");
        return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password }) // Pastikan struktur ini benar
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error message from server:", errorData.message);
        responseDiv.textContent = `Error: ${errorData.message}`;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);

      const responseDiv = document.getElementById('register-response');
      responseDiv.textContent = data.message;

    } 
    
    catch (error) {
      console.error('Error:', error);
    }
  }

// Log in function
  async function loginUser() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const responseDiv = document.getElementById('login-response');

    if (!email || !password) {
        console.log("All fields are required.");
        alert("Please fill all fields");
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        // Menyimpan token JWT jika login berhasil
        if (data.token) {
            localStorage.setItem('token', data.token);
            responseDiv.textContent = "Login successful!";
        } else {
            responseDiv.textContent = data.message;
        }

    } catch (error) {
        console.error('Error:', error);
        responseDiv.textContent = "Login failed!";
    }
}

// Event listener log in & sign up
document.getElementById('login-btn').addEventListener('click', loginUser);
document.getElementById('register-btn').addEventListener('click', registerUser);

// Save test result
async function saveTestResult(speed, accuracy, rightAnswers, wrongAnswers) {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/user-activity/saveTestResult', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Assumes token is stored in localStorage
            },
            body: JSON.stringify({ speed, accuracy, rightAnswers, wrongAnswers })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data.message);
    } catch (error) {
        console.error('Error saving test result:', error);
    }
}

// Load test result
async function loadQuizResults() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/user-activity/getTestResults', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const results = await response.json();
        displayResultsChart(results); // Pass results to chart display function
    } 
    
    catch (error) {
        console.error('Error loading quiz results:', error);
    }
}

// Display chart
function displayResultsChart(results) {
    const ctx = document.getElementById('resultsChart').getContext('2d');
    const labels = results.map(result => new Date(result.date).toLocaleDateString());
    const speeds = results.map(result => result.speed);
    const accuracies = results.map(result => result.accuracy);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { label: 'Speed (QPM)', data: speeds, borderColor: 'blue', fill: false },
                { label: 'Accuracy (%)', data: accuracies, borderColor: 'green', fill: false }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// Toggle to "My Progress" view
document.getElementById('progress-btn').addEventListener('click', function() {
    document.getElementById("landingSection").style.display = 'none';
    document.getElementById('progress-section').style.display = 'block';
    loadQuizResults();
});

// Back to the quiz or home view
document.getElementById('back-to-quiz').addEventListener('click', function() {
    document.getElementById('progress-section').style.display = 'none';
    document.getElementById("landingSection").style.display = 'block';
});


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
let timeLeft = 10;
let currentAnswer;
let questionsAnswered = 0;
let totalTime = 10;
let summaryShown = false;

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

// Start timer
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

    // Save test result
    // saveTestResult(speed, accuracy, rightScore, wrongScore);

    const summaryText = `
        You are a ${tier}<br><br>
        Average Speed: ${speed} QPM <br>
        Accuracy: ${accuracy}%<br><br>
        Right Answers: ${rightScore}<br>
        Wrong Answers: ${wrongScore}<br><br>
    `;
    
    // Event listener
    document.getElementById('testSummaryText').innerHTML = `
        Average Speed: ${speed} QPM <br>
        Accuracy: ${accuracy}%<br>
        Right Answers: ${rightScore}<br>
        Wrong Answers: ${wrongScore}<br>
    `;
    document.getElementById('testSummaryModal').style.display = 'block';

    // Automatically save test results if user is logged in
    if (localStorage.getItem('token')) {
        saveTestResult(speed, accuracy, rightScore, wrongScore);
    }
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
    document.querySelector(".about").style.display = 'none';
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