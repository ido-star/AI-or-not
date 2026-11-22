// Add one real and one AI image path for each round. Leave empty for placeholders.
const rounds = [
  { real: "photos/real/denis-zelenykh-gmiw2h3KX98-unsplash.jpg", ai: "photos/AI/Gemini_Generated_Image_2250nw2250nw2250.jpg" },
  { real: "photos/real/kate-trysh-ISfkqS5MtHU-unsplash.jpg", ai: "photos/AI/Gemini_Generated_Image_5pre3d5pre3d5pre.jpg" },
  { real: "photos/real/national-libary-inside-1979059903.jpg", ai: "photos/AI/Gemini_Generated_Image_991wc5991wc5991w.jpg" },
  { real: "photos/real/nelson-ndongala-jNUTiYlPMHI-unsplash.jpg", ai: "photos/AI/Gemini_Generated_Image_bnt4nqbnt4nqbnt4.jpg" },
  { real: "photos/real/roman-kurnovskii-Skk0vwkV5r0-unsplash.jpg", ai: "photos/AI/Gemini_Generated_Image_d46dpwd46dpwd46d.jpg" },
  { real: "photos/real/sean-oulashin-KMn4VEeEPR8-unsplash.jpg", ai: "photos/AI/Gemini_Generated_Image_2250nw2250nw2250.jpg" },
  { real: "photos/real/weichao-deng-eyn0LjpNWV4-unsplash.jpg", ai: "photos/AI/Gemini_Generated_Image_5pre3d5pre3d5pre.jpg" },
  { real: "photos/real/denis-zelenykh-gmiw2h3KX98-unsplash.jpg", ai: "photos/AI/Gemini_Generated_Image_991wc5991wc5991w.jpg" },
  { real: "photos/real/kate-trysh-ISfkqS5MtHU-unsplash.jpg", ai: "photos/AI/Gemini_Generated_Image_bnt4nqbnt4nqbnt4.jpg" },
  { real: "photos/real/national-libary-inside-1979059903.jpg", ai: "photos/AI/Gemini_Generated_Image_d46dpwd46dpwd46d.jpg" },
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
  playArea.hidden = true;
  result.hidden = false;
  document.querySelector("#result-label").textContent = "המשחק הסתיים";
  document.querySelector("#result-title").textContent = "כל הכבוד ששיחקתם!";
  document.querySelector("#result-message").textContent = `עניתם נכון על ${score} מתוך ${rounds.length}. הנה המספר שלכם!`;
  prize.hidden = false;
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
