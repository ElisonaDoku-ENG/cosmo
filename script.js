// Load the Vector-like sound effect for clicks
const vectorSound = new Audio('vector_beep.mp3'); // Adjust path as needed
// Load the angry sound effect
const angrySound = new Audio('robot-abstraction-47693.mp3'); // Adjust path as needed
// Load the nauseous sound effect
const nauseousSound = new Audio('robot-damaged-36712.mp3'); // Adjust path as needed

// Track the number of mouse clicks
let clickCount = 0;
let isTrembling = false;
let isHalfOpen = false;
let colorLoopInterval; // Interval for the color and size loop

// Event listener for mouse movement (eye following and scaling effect)
document.addEventListener("mousemove", (event) => {
  const eyes = document.querySelectorAll(".eye");
  const leftEye = document.querySelector(".left-eye");
  const rightEye = document.querySelector(".right-eye");
  const windowWidth = window.innerWidth;
  const cursorX = event.clientX;

  // Determine scaling based on cursor position
  if (cursorX > windowWidth / 2) {
    leftEye.style.transform = "scale(1.1)"; // 10% larger
    rightEye.style.transform = "scale(1)"; // Normal size
  } else {
    rightEye.style.transform = "scale(1.1)"; // 10% larger
    leftEye.style.transform = "scale(1)"; // Normal size
  }

  // Eye movement logic
  eyes.forEach((eye) => {
    const rect = eye.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;

    const angle = Math.atan2(event.clientY - eyeCenterY, event.clientX - eyeCenterX);
    const maxMove = 20;
    const offsetX = Math.cos(angle) * maxMove;
    const offsetY = Math.sin(angle) * maxMove;

    eye.style.transform += ` translate(${offsetX}px, ${offsetY}px)`; // Add to the existing transform
  });
});

// Event listener for mouse clicks with conditional sound effect
document.addEventListener("click", () => {
  clickCount++;
  const eyes = document.querySelectorAll(".eye");

  // Play the Vector-like sound on each click only if neither angrySound nor nauseousSound are playing
  if (angrySound.paused && nauseousSound.paused) {
    vectorSound.play();
  }

  if (clickCount === 5 && !isTrembling) {
    setEyesNauseous();
  }

  if (clickCount === 10 && !isHalfOpen) {
    setEyesAngry();
  }

  if (clickCount >= 13 && !isTrembling) {
    setEyesRedAngry();
  }
});

function setEyesNauseous() {
  const eyes = document.querySelectorAll(".eye");

  // Start playing the nauseous sound
  nauseousSound.currentTime = 0; // Start from beginning
  nauseousSound.play();

  // Nauseous state with half-open eyes and greenish color
  eyes.forEach((eye) => {
    eye.style.backgroundColor = "#87ab08"; // Greenish color for nauseous
    eye.style.height = "70px"; // Make eyes half-height for nauseous
    eye.classList.add("half-open"); // Add half-open class for styling
  });

  // Revert to normal and stop nauseous sound after 15 seconds
  setTimeout(() => {
    eyes.forEach((eye) => {
      eye.style.backgroundColor = ""; // Reset background color
      eye.style.height = "140px"; // Reset height to full
      eye.classList.remove("half-open"); // Remove half-open styling
    });
    nauseousSound.pause(); // Stop the nauseous sound
    nauseousSound.currentTime = 0; // Reset to the beginning for the next use
  }, 15000); // Prolonged to 15 seconds
}

function setEyesAngry() {
  isHalfOpen = true;
  const eyes = document.querySelectorAll(".eye");

  // Play the angry sound effect
  angrySound.currentTime = 0; // Reset the sound to the start
  angrySound.play();

  // Stop blinking and apply angry state with red color and trembling effect
  eyes.forEach((eye) => {
    eye.classList.remove("blinking"); // Stop blinking
    eye.classList.add("black-eyelids");
    eye.style.backgroundColor = "#f00"; // Set to red for angry
    eye.style.height = "70px"; // Set to half height for half-open effect (adjust as desired)
  });

  startTrembling();

  // Revert to normal and stop angry sound after 10 seconds
  setTimeout(() => {
    isHalfOpen = false;
    angrySound.pause(); // Stop the angry sound
    angrySound.currentTime = 0; // Reset the sound for next use
    eyes.forEach((eye) => {
      eye.style.backgroundColor = "";
      eye.style.height = "140px"; // Reset to full height
      eye.classList.remove("black-eyelids");
      eye.style.transform = ""; // Reset transformations
      eye.classList.add("blinking"); // Resume blinking
    });
  }, 10000);
}

function setEyesRedAngry() {
  isTrembling = true;
  const eyes = document.querySelectorAll(".eye");

  // Stop blinking and apply red angry state
  eyes.forEach((eye) => {
    eye.classList.remove("blinking"); // Stop blinking for red angry state
    eye.style.backgroundColor = "#f00"; // Bright red for extra anger
    eye.classList.add("black-eyelids"); // Apply eyelids for angry look
  });

  startTrembling();

  // Revert after 10 seconds and resume blinking
  setTimeout(() => {
    isTrembling = false;
    clickCount = 0; // Reset click count to allow new emotions
    eyes.forEach((eye) => {
      eye.style.backgroundColor = "";
      eye.style.height = "140px"; // Reset to full height
      eye.classList.remove("black-eyelids"); // Remove black eyelids
      eye.classList.add("blinking"); // Resume blinking
    });
  }, 10000);
}

function startTrembling() {
  const eyes = document.querySelectorAll(".eye");
  let tremblingTime = 10000;
  let startTime = Date.now();

  function tremble() {
    if (!isTrembling) return;
    let elapsed = Date.now() - startTime;

    if (elapsed >= tremblingTime) {
      isTrembling = false;
      eyes.forEach((eye) => {
        eye.style.transform = ""; // Reset transformation
      });
      return;
    }

    let angle = Math.sin(elapsed / 50) * 10;
    eyes.forEach((eye) => {
      eye.style.transform = `rotate(${angle}deg)`; // Apply trembling effect
    });

    requestAnimationFrame(tremble);
  }
  tremble();
}
