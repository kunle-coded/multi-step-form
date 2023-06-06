'use-script';

// 1. Select all the elements in the HTML page and assign them to a variable

const progressBar = document.querySelectorAll('.progress-bar__step');
const nextButtons = document.querySelectorAll('.main--section-button-icon');
const sections = document.querySelectorAll('.main--section');
const backButtons = document.querySelectorAll('.main--section-back-button');
const changeOrder = document.querySelector(
  '.main--section-confirmation__change'
);
const formValidation = document.querySelector('.main--section-form form');

// 2. Create functionality

// 2.1 Update the style of the progress bar circle

let selectedStep = progressBar[0];

const updateProgressBar = step => {
  let progressCircle = step.firstElementChild;

  progressCircle.classList.add('selected');

  if (selectedStep && selectedStep !== step) {
    let selectedProgressCircle = selectedStep.firstElementChild;
    selectedProgressCircle.classList.remove('selected');
  }

  selectedStep = step;
};

// 2.2 Add functionality to the next button
const nextStep = () => {
  let nextStep = selectedStep.nextElementSibling;
  if (nextStep) {
    updateProgressBar(nextStep);
  }

  let nextSection = visibleSection.nextElementSibling;
  if (nextSection) {
    updateSection(nextSection);
  }
};

// 2.3 Update the visibility of the sections

let visibleSection = sections[0];
const updateSection = section => {
  section.classList.add('visible-section');

  if (visibleSection && visibleSection !== section) {
    visibleSection.classList.remove('visible-section');
  }

  visibleSection = section;
};

// 2.4 Add functionality to the back button

const backStep = () => {
  let backStep = selectedStep.previousElementSibling;
  if (backStep) {
    updateProgressBar(backStep);
  }

  let backSection = visibleSection.previousElementSibling;
  if (backSection) {
    updateSection(backSection);
  }
};

// 2.5 Add functionality to the change order button

changeOrder.addEventListener('click', e => {
  e.preventDefault();
  //   updateProgressBar(progressBar[0]);
  //   updateSection(sections[0]);
  backStep();
});

// 2.6 Add functionality to the form validation

const validateForm = () => {
  let formInputs = document.querySelectorAll('.main--section-form input');
  let formValid = true;

  formInputs.forEach(input => {
    if (!input.value) {
      formValid = false;
      input.classList.add('error');
    } else {
      input.classList.remove('error');
    }
  });

  return formValid;
};

// 3. EventListeners
progressBar.forEach(step => {
  step.addEventListener('click', () => {
    updateProgressBar(step);
  });
});

nextButtons.forEach(button => {
  if (nextButtons[0]) {
    button.addEventListener('click', () => {
      if (validateForm()) {
        nextStep();
      }
    });
  } else {
    button.addEventListener('click', nextStep);
  }
});

backButtons.forEach(button => {
  button.addEventListener('click', backStep);
});
