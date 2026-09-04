const questionE1 = document.getElementById("question");
const formE1 = document.getElementById("form");
const scoreE1 = document.getElementById("score");
const inputE1 = document.getElementById("input");

let score = 0;

scoreE1.innerText = `Score: ${score}`;

function generateNewQuestion() {
  const num1 = Math.ceil(Math.random() * 10);
  const num2 = Math.ceil(Math.random() * 10);
  questionE1.innerText = `What is ${num1} multiply by ${num2}?`;
  return num1 * num2;
}

let correctAns = generateNewQuestion();

formE1.addEventListener("submit", (e) => {
  e.preventDefault();
  const userAns = +inputE1.value;

  if (isNaN(userAns) || userAns === "") {
    alert("Please enter a valid number");
    inputE1.value = "";
    return;
  }

  if (userAns === correctAns) {
    score++;
    alert("Correct! 🎉");
  } else {
    score--;
    alert(`Wrong! Correct answer is ${correctAns}`);
  }

  if (score < 0) {
    score = 0;
  }

  scoreE1.innerText = `Score: ${score}`;
  localStorage.setItem("score", JSON.stringify(score));
  inputE1.value = "";
  correctAns = generateNewQuestion();
  inputE1.focus();
});
