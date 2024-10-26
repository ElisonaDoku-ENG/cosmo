
const vectorSound = new Audio('vector_beep.mp3'); 
const angrySound = new Audio('robot-abstraction-47693.mp3'); 
const nauseousSound = new Audio('robot-damaged-36712.mp3'); 


let clickCount = 0;
let isTrembling = false;
let isHalfOpen = false;
let colorLoopInterval; 

document.addEventListener("mousemove", (event) => {
  const eyes = document.querySelectorAll(".eye");
  const leftEye = document.querySelector(".left-eye");
  const rightEye = document.querySelector(".right-eye");
  const windowWidth = window.innerWidth;
  const cursorX = event.clientX;


  if (cursorX > windowWidth / 2) {
    leftEye.style.transform = "scale(1.1)"; 
    rightEye.style.transform = "scale(1)"; 
  } else {
    rightEye.style.transform = "scale(1.1)"; 
    leftEye.style.transform = "scale(1)"; 
  }

  eyes.forEach((eye) => {
    const rect = eye.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;

    const angle = Math.atan2(event.clientY - eyeCenterY, event.clientX - eyeCenterX);
    const maxMove = 20;
    const offsetX = Math.cos(angle) * maxMove;
    const offsetY = Math.sin(angle) * maxMove;

    eye.style.transform += ` translate(${offsetX}px, ${offsetY}px)`; 
  });
});


document.addEventListener("click", () => {
  clickCount++;
  const eyes = document.querySelectorAll(".eye");


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


  nauseousSound.currentTime = 0; 
  nauseousSound.play();


  eyes.forEach((eye) => {
    eye.style.backgroundColor = "#87ab08"; 
    eye.style.height = "70px"; 
    eye.classList.add("half-open"); 
  });

  
  setTimeout(() => {
    eyes.forEach((eye) => {
      eye.style.backgroundColor = ""; 
      eye.style.height = "140px"; 
      eye.classList.remove("half-open"); 
    });
    nauseousSound.pause(); // Stop the nauseous sound
    nauseousSound.currentTime = 0; 
  }, 15000); 
}

function setEyesAngry() {
  isHalfOpen = true;
  const eyes = document.querySelectorAll(".eye");

  
  angrySound.currentTime = 0; 
  angrySound.play();

 
  eyes.forEach((eye) => {
    eye.classList.remove("blinking"); 
    eye.classList.add("black-eyelids");
    eye.style.backgroundColor = "#f00"; 
    eye.style.height = "70px"; 
  });

  startTrembling();

  setTimeout(() => {
    isHalfOpen = false;
    angrySound.pause(); 
    angrySound.currentTime = 0; 
    eyes.forEach((eye) => {
      eye.style.backgroundColor = "";
      eye.style.height = "140px"; 
      eye.classList.remove("black-eyelids");
      eye.style.transform = ""; 
      eye.classList.add("blinking"); 
    });
  }, 10000);
}

function setEyesRedAngry() {
  isTrembling = true;
  const eyes = document.querySelectorAll(".eye");

  
  eyes.forEach((eye) => {
    eye.classList.remove("blinking"); 
    eye.style.backgroundColor = "#f00"; 
    eye.classList.add("black-eyelids"); 
  });

  startTrembling();

  
  setTimeout(() => {
    isTrembling = false;
    clickCount = 0; 
    eyes.forEach((eye) => {
      eye.style.backgroundColor = "";
      eye.style.height = "140px"; 
      eye.classList.remove("black-eyelids"); 
      eye.classList.add("blinking"); 
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
        eye.style.transform = ""; 
      });
      return;
    }

    let angle = Math.sin(elapsed / 50) * 10;
    eyes.forEach((eye) => {
      eye.style.transform = `rotate(${angle}deg)`; 
    });

    requestAnimationFrame(tremble);
  }
  tremble();
}
