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
  roundHeading.innerHTML = `סיבוב <bdi dir="ltr">${String(Math.min(roundIndex + 1, rounds.length)).padStart(2, "0")} <span>/ ${rounds.length}</span></bdi>`;
  scoreDisplay.innerHTML = `<bdi dir="ltr">${score} <span>/ ${rounds.length}</span></bdi>`;
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
      image.alt = `אפשרות ${index === 0 ? "א" : "ב"}`;
      imageContainer.append(image);
    } else {
      imageContainer.textContent = isReal ? "אמיתי" : "בינה מלאכותית";
    }
    choice.disabled = false;
    choice.classList.remove("correct", "incorrect");
    choice.setAttribute("aria-label", `בחירת אפשרות ${index === 0 ? "א" : "ב"} כתמונה האמיתית${imagePath ? "" : `, מציין מקום: ${isReal ? "אמיתי" : "בינה מלאכותית"}`}`);
  });
  feedback.textContent = "סמכו על העיניים שלכם ובחרו בתמונה האמיתית.";
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
  feedback.textContent = correct ? "כל הכבוד! מצאתם את התמונה האמיתית." : "לא הפעם! התמונה המודגשת היא האמיתית.";
  feedback.classList.add("answered");
  nextButton.textContent = roundIndex === rounds.length - 1 ? "לתוצאות ←" : "לסיבוב הבא ←";
  nextButton.hidden = false;
  updateStats(roundIndex + 1);
}

function showResult() {
  const won = score >= 6;
  playArea.hidden = true;
  result.hidden = false;
  document.querySelector("#result-label").textContent = won ? "האתגר הושלם" : "המשחק הסתיים";
  document.querySelector("#result-title").textContent = won ? "יש לכם עין חדה!" : "ניסיון יפה!";
  document.querySelector("#result-message").textContent = won
    ? `עניתם נכון על ${score} מתוך ${rounds.length}. בזכות העין החדה שלכם זכיתם במספר.`
    : `עניתם נכון על ${score} מתוך ${rounds.length}. צריך לפחות 6 תשובות נכונות כדי לגלות את המספר.`;
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
