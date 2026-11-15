// Add one real and one AI image path for each round. Leave empty for placeholders.
const rounds = [
  { real: "", ai: "" },
  { real: "", ai: "" },
  { real: "", ai: "" },
  { real: "", ai: "" },
  { real: "", ai: "" },
  { real: "", ai: "" },
  { real: "", ai: "" },
  { real: "", ai: "" },
  { real: "", ai: "" },
  { real: "", ai: "" },
];

const choices = [...document.querySelectorAll(".choice")];
const roundHeading = document.querySelector("#round-heading");
const scoreDisplay = document.querySelector("#score");
const progress = document.querySelector(".progress");
const progressFill = document.querySelector("#progress-fill");
const feedback = document.querySelector("#feedback");
const nextButton = document.querySelector("#next-button");
const playArea = document.querySelector("#play-area");
const result = document.querySelector("#result");
const prize = document.querySelector("#prize");
let roundIndex = 0;
let score = 0;
let realPosition = 0;
let answered = false;

function updateStats(completed) {
  roundHeading.innerHTML = `Round ${String(Math.min(roundIndex + 1, rounds.length)).padStart(2, "0")} <span>/ ${rounds.length}</span>`;
  scoreDisplay.innerHTML = `${score} <span>/ ${rounds.length}</span>`;
  progress.setAttribute("aria-valuenow", completed);
  progressFill.style.width = `${completed / rounds.length * 100}%`;
}

function showRound() {
  answered = false;
  realPosition = Math.random() < 0.5 ? 0 : 1;
  const round = rounds[roundIndex];
  choices.forEach((choice, index) => {
    const isReal = index === realPosition;
    const imagePath = isReal ? round.real : round.ai;
    const imageContainer = choice.querySelector(".choice-image");
    imageContainer.replaceChildren();
    if (imagePath) {
      const image = document.createElement("img");
      image.src = imagePath;
      image.alt = `Option ${index === 0 ? "A" : "B"}`;
      imageContainer.append(image);
    } else {
      imageContainer.textContent = isReal ? "REAL" : "AI";
    }
    choice.disabled = false;
    choice.classList.remove("correct", "incorrect");
    choice.setAttribute("aria-label", `Choose option ${index === 0 ? "A" : "B"} as the real image${imagePath ? "" : `, placeholder ${isReal ? "real" : "AI"}`}`);
  });
  feedback.textContent = "Trust your eyes. Choose the real one.";
  feedback.classList.remove("answered");
  nextButton.hidden = true;
  updateStats(roundIndex);
}

function choose(index) {
  if (answered) return;
  answered = true;
  const correct = index === realPosition;
  if (correct) score++;
  choices.forEach((choice, choiceIndex) => {
    choice.disabled = true;
    if (choiceIndex === realPosition) choice.classList.add("correct");
    else if (choiceIndex === index) choice.classList.add("incorrect");
  });
  feedback.textContent = correct ? "Nice eye! You found the real one." : "Not quite! The highlighted one is real.";
  feedback.classList.add("answered");
  nextButton.textContent = roundIndex === rounds.length - 1 ? "See results →" : "Next round →";
  nextButton.hidden = false;
  updateStats(roundIndex + 1);
}

function showResult() {
  const won = score >= 6;
  playArea.hidden = true;
  result.hidden = false;
  document.querySelector("#result-label").textContent = won ? "CHALLENGE COMPLETE" : "CHALLENGE FINISHED";
  document.querySelector("#result-title").textContent = won ? "You’ve got the eye." : "Good try!";
  document.querySelector("#result-message").textContent = won
    ? `You got ${score} out of ${rounds.length} right. Your powers of observation have earned you a number.`
    : `You got ${score} out of ${rounds.length} right. You need at least 6 to reveal the number.`;
  prize.hidden = !won;
  document.querySelector("#restart-button").focus();
}

choices.forEach((choice, index) => choice.addEventListener("click", () => choose(index)));
nextButton.addEventListener("click", () => {
  roundIndex++;
  if (roundIndex === rounds.length) showResult();
  else {
    showRound();
    choices[0].focus();
  }
});
document.querySelector("#restart-button").addEventListener("click", () => {
  roundIndex = 0;
  score = 0;
  result.hidden = true;
  prize.hidden = true;
  playArea.hidden = false;
  showRound();
  choices[0].focus();
});

showRound();
