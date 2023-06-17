// Initial References
let draggableObjects;
let dropPoints;
let correctAnswers = 0;
let currentQuestionIndex = 0;
let incorrectAnswers = [];

const questionContainer = document.getElementById("question-container");
const totalCorrectAnswersElement = document.getElementById("total-correct-answers");
const incorrectAnswersList = document.getElementById("incorrect-answers-list");

const startButton = document.getElementById("start");
const submitButton = document.getElementById('submit');
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
const dragContainer = document.querySelector(".draggable-objects");
const dropContainer = document.querySelector(".drop-points");
const nextButton = document.getElementById("next-button");
const endScreen = document.getElementById("end");
const endScr = document.querySelector(".end-screen");
const percentageContainer = document.getElementById("percentage-container");
const percentageElement = document.createElement("div");

percentageElement.id = "percentage";
endScreen.appendChild(percentageElement);

const popupOverlay = document.getElementById("popup-overlay");
const popupContent = document.getElementById("popup-content");
const popupContent2 = document.getElementById("popup-content2");
const popupPercentage = document.getElementById("popup-percentage");
const popupMessage = document.getElementById("popup-message");
const confirmButton = document.getElementById("confirm-button");
const cancelButton = document.getElementById("cancel-button");
const endQuizButton = document.getElementById("end-quiz-button");
const restartButton = document.getElementById("restart-button");
restartButton.addEventListener("click", () => {
  location.reload();
});

endQuizButton.addEventListener("click", () => {
  popupOverlay.style.display = "block";
});
let countdownTimer;
const countdownElement = document.getElementById("countdown");

// Function to start the countdown
const startCountdown = () => {
  let timeRemaining = 60; // 60 seconds
  countdownElement.textContent = `⏰ ${timeRemaining} giây`;

  countdownTimer = setInterval(() => {
    timeRemaining--;
    countdownElement.textContent = `⏰ ${timeRemaining} giây`;

    if (timeRemaining <= 0) {
      clearInterval(countdownTimer);
      countdownElement.textContent = "Time's up!";

      // Xoá dropcontainer và dragcontainer
      dragContainer.innerHTML = "";

      // Hiển thị dòng chữ "EndQuiz" và nút Restart
      result.textContent = "EndQuiz";
      endQuizButton.style.display = "none";
      nextButton.style.display = "none";
      restartButton.style.display = "block";
    }
  }, 1000);
};

// Đăng ký sự kiện click cho nút "Có"
confirmButton.addEventListener("click", () => {
  // Ẩn các nút "Có" và "Không"
  location.reload();

});

// Đăng ký sự kiện click cho nút "Không"
cancelButton.addEventListener("click", () => {
  // Ẩn popup
  popupOverlay.style.display = "none";

});

const data = [
  "belgium",
  "bhutan",
  "brazil",
  "china",
  "cuba",
  "ecuador",
  "georgia",
  "germany",
  "hong-kong",
  "india",
  "iran",
  "myanmar",
  "norway",
  "spain",
  "sri-lanka",
  "sweden",
  "switzerland",
  "united-states",
  "uruguay",
  "wales",
];

let deviceType = "";
let initialX = 0,
  initialY = 0;
let currentElement = "";
let moveElement = false;

// Detect touch device
const isTouchDevice = () => {
  try {
    // We try to create Touch Event (It would fail for desktops and throw error)
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
  } catch (e) {
    deviceType = "mouse";
    return false;
  }
};

let count = 0;

// Random value from Array
const randomValueGenerator = () => {
  return data[Math.floor(Math.random() * data.length)];
};

// Drag & Drop Functions
function dragStart(e) {
  if (isTouchDevice()) {
    initialX = e.touches[0].clientX;
    initialY = e.touches[0].clientY;
    // Start movement for touch
    moveElement = true;
    currentElement = e.target;
  } else {
    // For non-touch devices set data to be transferred
    e.dataTransfer.setData("text", e.target.id);
  }
}

// Events fired on the drop target
function dragOver(e) {
  e.preventDefault();
}

// For touchscreen movement
const touchMove = (e) => {
  if (moveElement) {
    e.preventDefault();
    let newX = e.touches[0].clientX;
    let newY = e.touches[0].clientY;
    let currentSelectedElement = document.getElementById(e.target.id);
    currentSelectedElement.parentElement.style.top =
      currentSelectedElement.parentElement.offsetTop - (initialY - newY) + "px";
    currentSelectedElement.parentElement.style.left =
      currentSelectedElement.parentElement.offsetLeft -
      (initialX - newX) +
      "px";
    initialX = newX;
    initialY = newY;
  }
};

const drop = (e) => {
  e.preventDefault();
  // For touch screen
  if (isTouchDevice()) {
    moveElement = false;
    // Select country name div using the custom attribute
    const currentDrop = document.querySelector(`div[data-id='${e.target.id}']`);
    // Get boundaries of div
    const currentDropBound = currentDrop.getBoundingClientRect();
    // If the position of flag falls inside the bounds of the country name
    if (
      initialX >= currentDropBound.left &&
      initialX <= currentDropBound.right &&
      initialY >= currentDropBound.top &&
      initialY <= currentDropBound.bottom
    ) {
      currentDrop.classList.add("dropped");
      // Hide actual image
      currentElement.classList.add("hide");
      currentDrop.innerHTML = ``;
      // Insert new img element
      currentDrop.insertAdjacentHTML(
        "afterbegin",
        `<img src="${currentElement.id}.png">`
      );
      count += 1;
    }
  } else {
    // Access data
    const draggedElementData = e.dataTransfer.getData("text");
    // Get custom attribute value
    const droppableElementData = e.target.getAttribute("data-id");
    const draggedElement = document.getElementById(draggedElementData);
    // Dropped class
    e.target.classList.add("dropped");
    // Hide current img
    draggedElement.classList.add("hide");
    // Draggable set to false
    draggedElement.setAttribute("draggable", "false");
    e.target.innerHTML = ``;
    // Insert new img
    e.target.insertAdjacentHTML(
      "afterbegin",
      `<img src="${draggedElementData}.png">`
    );
    count += 1;
  }
  // Win
  if (count == 4) {
    submitButton.style.display = 'block';
  }
};

// Creates flags and countries
const creator = () => {
  dragContainer.innerHTML = "";
  dropContainer.innerHTML = "";
  let randomData = [];
  // For generating random values in array
  for (let i = 1; i <= 4; i++) {
    let randomValue = randomValueGenerator();
    if (!randomData.includes(randomValue)) {
      randomData.push(randomValue);
    } else {
      // If value already exists then decrement i by 1
      i -= 1;
    }
  }
  for (let i of randomData) {
    const flagDiv = document.createElement("div");
    flagDiv.classList.add("draggable-image");
    flagDiv.setAttribute("draggable", true);
    if (isTouchDevice()) {
      flagDiv.style.position = "absolute";
    }
    flagDiv.innerHTML = `<img src="${i}.png" id="${i}">`;
    dragContainer.appendChild(flagDiv);
  }
  // Sort the array randomly before creating country divs
  randomData = randomData.sort(() => 0.5 - Math.random());
  for (let i of randomData) {
    const countryDiv = document.createElement("div");
    countryDiv.innerHTML = `<div class='countries' data-id='${i}'>
      ${i.charAt(0).toUpperCase() + i.slice(1).replace("-", " ")}
    </div>`;
    dropContainer.appendChild(countryDiv);
  }
};

// Drop complete event
const dropComplete = () => {
  // Check if all drop points have images
  const allDropped = Array.from(dropPoints).every((dropPoint) =>
    dropPoint.querySelector("img")
  );
  if (allDropped) {
    showSubmitButton();
  }
};

// Check Results
const checkResults = () => {
  const countries = Array.from(document.querySelectorAll(".countries"));
  let correctCount = 0;
  event.preventDefault();

  countries.forEach((country) => {
    const countryId = country.getAttribute("data-id");
    const image = country.querySelector("img");
    const status = document.createElement("span");
    status.className = "status";

    if (image && image.src.includes(`${countryId}.png`)) {
      status.textContent = "ĐÚNG";
      country.style.color = "green";
      correctCount++;
    } else {
      status.textContent = "SAI";
      country.style.color = "red";
    }

    country.appendChild(status);
  });

  const result = document.getElementById("result");
  const totalCorrectAnswersElement = document.getElementById("total-correct-answers");
  const correctCountElement = document.getElementById("correct-count");
  const nextButton = document.getElementById("next-button");

  if (correctCount === 4) {
    result.innerHTML = "All correct!";
  } else {
    result.innerHTML = `Đúng ${correctCount} / 4câu`;

  }
  nextButton.style.display = "block";


  isGameCompleted = true;
  correctAnswers += correctCount; // Cộng giá trị của correctCount vào correctAnswers
  console.log(`Tổng điểm: ${correctAnswers}`);
  totalCorrectAnswersElement.textContent = `Tổng điểm: ${correctAnswers}`;
  correctCountElement.textContent = `Đúng: ${correctCount} / 4câu`;
};


// Start Game
startButton.addEventListener("click",
  (startGame = async () => {
    currentElement = "";
    controls.classList.add("hide");
    startButton.classList.add("hide");
    endScreen.style.display = "none";
    popupOverlay.style.display = "none";
    startCountdown();
    await creator();
    count = 0;
    dropPoints = document.querySelectorAll(".countries");
    draggableObjects = document.querySelectorAll(".draggable-image");
    draggableObjects.forEach((element) => {
      element.addEventListener("dragstart", dragStart);
      // For touch screen
      element.addEventListener("touchstart", dragStart);
      element.addEventListener("touchend", drop);
      element.addEventListener("touchmove", touchMove);
    });
    dropPoints.forEach((element) => {
      element.addEventListener("dragover", dragOver);
      element.addEventListener("drop", drop);
    });
  })
);
nextButton.addEventListener("click", () => {
  // Xóa nội dung câu trả lời đúng của câu hỏi hiện tại
  currentQuestionIndex++;
  console.log(currentQuestionIndex);

  // Kiểm tra nếu là câu hỏi số 5
  if (currentQuestionIndex === 100) {
    stopGame();
    return; // Kết thúc sự kiện và không tiếp tục hiển thị câu hỏi tiếp theo
  } else {

    displayQuestion();
    const totalQuestions = currentQuestionIndex * 4; // Tổng số câu hỏi
    const correctPercentage = (correctAnswers / totalQuestions) * 100; // Tính phần trăm câu trả lời đúng
    const Tq = (currentQuestionIndex) * 4;
    // Cập nhật nội dung của phần trăm

    percentageElement.textContent = `Tổng: ${correctAnswers}/${Tq}câu`;
    percentageContainer.innerHTML = '';
    percentageContainer.appendChild(percentageElement);
    var anotherContainer = document.getElementById("anotherContainer");

    if (correctPercentage >= 95 && correctPercentage <= 100) {
      anotherContainer.textContent = "👏🎉 Quá xuất sắc";
    } else if (correctPercentage >= 90 && correctPercentage <= 94) {
      anotherContainer.textContent = "👍 Xuất sắc";
    } else if (correctPercentage >= 80 && correctPercentage <= 89) {
      anotherContainer.textContent = "✨👌 Tuyệt vời";
    } else if (correctPercentage >= 70 && correctPercentage <= 79) {
      anotherContainer.textContent = "👏🌟 Rất tốt";
    } else if (correctPercentage >= 50 && correctPercentage <= 69) {
      anotherContainer.textContent = "💪🔥 Cố gắng thêm!";
    } else {
      anotherContainer.textContent = "😕 Chưa tốt";
    }



  }

  endQuizButton.style.display = "none";
  nextButton.style.display = "none";
});

submitButton.addEventListener("click", () => {
  checkResults();
  submitButton.style.display = "none";
  nextButton.style.display = "block";
});
endScreen.addEventListener("click", () => {
  stopGame();

});

const displayQuestion = async () => {
  currentElement = "";
  controls.classList.add("hide");
  startButton.classList.add("hide");
  await creator();
  count = 0;
  dropPoints = document.querySelectorAll(".countries");
  draggableObjects = document.querySelectorAll(".draggable-image");
  draggableObjects.forEach((element) => {
    element.addEventListener("dragstart", dragStart);
    // For touch screen
    element.addEventListener("touchstart", dragStart);
    element.addEventListener("touchend", drop);
    element.addEventListener("touchmove", touchMove);
  });
  dropPoints.forEach((element) => {
    element.addEventListener("dragover", dragOver);
    element.addEventListener("drop", drop);
  });
  const questionIndex = currentQuestionIndex + 1;



  // Cập nhật nội dung của phần tử "question-index"
  const questionIndexElement = document.getElementById("question-index");
  questionIndexElement.textContent = `Câu ${questionIndex}`;

};



// Win Game Display
const stopGame = () => {
  controls.classList.remove("hide");
  startButton.classList.remove("hide");
  endScreen.style.display = "block";
  totalCorrectAnswersElement.style.display = "block";
};

const showScore = () => {
  const totalCorrectAnswersElement = document.getElementById("total-correct-answers");
  totalCorrectAnswersElement.textContent = correctAnswers;

  if (incorrectAnswers.length > 0) {
    const incorrectAnswersHTML = incorrectAnswers.map((incorrectAnswer) => `<li>${incorrectAnswer}</li>`).join("");
    const incorrectAnswersList = document.getElementById("incorrect-answers-list");
    incorrectAnswersList.innerHTML = incorrectAnswersHTML;
  }
};


const showEndScreen = () => {
  questionContainer.style.display = "none";

  totalCorrectAnswersElement.textContent = correctAnswers;

  if (incorrectAnswers.length > 0) {
    const incorrectAnswersHTML = incorrectAnswers.map((incorrectAnswer) => `<li>${incorrectAnswer}</li>`).join("");
    incorrectAnswersList.innerHTML = incorrectAnswersHTML;
  }
};


