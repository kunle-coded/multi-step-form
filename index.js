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
const plans = document.querySelectorAll('.main--section-plan__card-item');
const billingToggle = document.querySelector(
  '.main--section-plan__billing-toggle'
);
const monthYearText = document.querySelectorAll(
  '.main--section-plan__billing-item'
);
const toggleIcon = document.querySelector(
  '.main--section-plan__billing-toggle__circle'
);

const addons = document.querySelectorAll(
  '.main--section-addons__card-item input'
);
const confirmPlanText = document.querySelector(
  '.main--section-confirmation__title'
);
const confirmPlanPriceText = document.querySelector(
  '.main--section-confirmation__plan-price'
);
const confirmationAddons = document.querySelectorAll(
  '.main--section-confirmation-addons__texts'
);
const confirmationCard = document.querySelector(
  '.main--section-confirmation__addons'
);
const confirmationTotalTitle = document.querySelector(
  '.main--section-confirmation__total-title'
);
const confirmationTotalPrice = document.querySelector(
  '.main--section-confirmation__total-price'
);
const formError = document.querySelector('.error');
const priceSlash = document.querySelectorAll(
  '.main--section-plan__price-slash'
);

// console.log(addons);

// 1.1 Create global variables

// Order data
let orderData = {
  plan: 'arcade',
  addons: ['addons-online'],
  billing: 'monthly',
  addOnPrice: 1,
  totalPlanPrice: 0,
  total: 0,
};

// Plan data
const planData = {
  arcade: {
    price: 9,
  },
  advance: {
    price: 12,
  },
  pro: {
    price: 15,
  },
};

// Addons data
const addOnData = {
  'addons-online': {
    price: 1,
  },
  'addons-storage': {
    price: 2,
  },
  'addons-custom': {
    price: 2,
  },
};

// Order validation data
const orderValidation = {
  valid: false,
  plan: orderData.plan,

  validate: function () {
    if (this.plan != null) {
      this.valid = true;
    }
    return this.valid;
  },
};

// 1.2 Create a counter -- to keep track of the current active section
let counter = 0;

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
    counter++;
  }

  if (counter === 3) {
    updateConfirmation();
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
    counter--;
  }
};

// 2.5 Add functionality to the change order button

changeOrder.addEventListener('click', e => {
  e.preventDefault();
  //   updateProgressBar(progressBar[0]);
  //   updateSection(sections[0]);
  backStep();
  backStep();
});

// 2.6 Add functionality to the form validation

const validateForm = () => {
  const formInputs = document.querySelectorAll('.main--section-form input');
  let formValid = true;

  formInputs.forEach(input => {
    const error = input.previousElementSibling.lastElementChild;

    if (input.value === '') {
      formValid = false;

      error.style.visibility = 'visible';
      input.classList.add('invalid');
    } else if (input.name === 'email') {
      if (!input.value.includes('@') || !input.value.includes('.')) {
        formValid = false;

        error.style.visibility = 'visible';
        input.classList.add('invalid');
      }
    } else {
      error.style.visibility = 'hidden';
      input.classList.remove('invalid');
    }
  });

  return formValid;
};

// 2.6.1 Add form validation before next button is clicked

const formInputs = document.querySelectorAll('.main--section-form input');

formInputs.forEach(input => {
  input.addEventListener('input', () => {
    const error = input.previousElementSibling.lastElementChild;

    if (input.validity.typeMismatch) {
      error.innerHTML = 'Please enter a valid email address';
      error.style.visibility = 'visible';
      input.classList.add('invalid');
    } else {
      error.style.visibility = 'hidden';
      input.classList.remove('invalid');
    }

    if (input.name === 'phone' && input.value != Number(input.value)) {
      error.innerHTML = 'Please enter a valid phone number';
      error.style.visibility = 'visible';
      input.classList.add('invalid');
    }

    if (input.value != '') {
      input.classList.add('valid');
    }
  });
});

// 2.7 Add functionality to the plan selection

let selectedPlan = plans[0];
plans.forEach(plan => {
  plan.addEventListener('click', () => {
    plan.classList.add('selected-plan');

    if (selectedPlan && selectedPlan !== plan) {
      selectedPlan.classList.remove('selected-plan');
    }
    selectedPlan = plan;

    const planValue = plan.id;
    orderData.plan = planValue;
  });
});

// 2.7.1 Add functionality to the billing toggle

billingToggle.addEventListener('click', () => {
  billingToggle.classList.toggle('toggled');

  const billingValue = billingToggle.classList.contains('toggled')
    ? 'yearly'
    : 'monthly';
  orderData.billing = billingValue;
  updatePriceTexts();
  updateBillingDuration();
});

// 2.7.2 Update price on plan card

const updatePriceTexts = () => {
  const prices = document.querySelectorAll('.main--section-plan__price');
  let priceValue;
  const priceText = orderData.billing === 'monthly' ? '/mo' : '/yr';

  const billingFactor = orderData.billing === 'monthly' ? 1 : 10;

  prices.forEach(price => {
    const priceId = price.id;
    const planIdNew = priceId.split('-')[0];
    const planPrice = planData[planIdNew].price;
    const planPriceText = planPrice * billingFactor;

    price.innerHTML = `$${planPriceText}<span>${priceText}</span>`;
  });

  priceSlash.forEach(slash => {
    orderData.billing === 'yearly'
      ? (slash.style.visibility = 'visible')
      : (slash.style.visibility = 'hidden');
  });
};

// 2.7.3 Update billing duration style on toggle

const updateBillingDuration = () => {
  monthYearText.forEach(text => {
    text.classList.toggle('toggled-text');
  });
};

// 2.8 Add functionality to the addons selection

const updateAdons = addon => {
  const addonId = addon.id;
  const addonValue = addon.checked;
  const noAddon = !addon.checked;
  const addonPrice = addOnData[addonId].price;

  if (addonValue) {
    if (!orderData.addons.includes(addonId)) {
      orderData.addons.push(addonId);
    }
    orderData.addOnPrice += addonPrice;
  } else {
    orderData.addons = orderData.addons.filter(item => item !== addonId);
    orderData.addOnPrice -= addonPrice;
  }

  updatePrice();
};

// 2.10 Add functionality to the price calculation

const updatePrice = () => {
  const planId = orderData.plan;
  const planPrice = planData[planId].price;
  const addonsPrice = orderData.addOnPrice;
  const billingFactor = orderData.billing === 'monthly' ? 1 : 10;

  const totalPlanPrice = planPrice * billingFactor;
  orderData.totalPlanPrice = totalPlanPrice;
  console.log(totalPlanPrice);

  const totalPrice = (planPrice + addonsPrice) * billingFactor;
  orderData.total = totalPrice;
  console.log(orderData);
};

// 2.11 Add functionality to the order confirmation

const updateConfirmation = () => {
  //updateAdons();
  updatePrice();
  const planId = orderData.plan;
  const planPrice = planData[planId].price;
  const selectedAddons = orderData.addons;
  const planText = planId[0].toLocaleUpperCase() + planId.slice(1);

  const billingFactor = orderData.billing === 'monthly' ? 1 : 10;

  const planPriceText = planPrice * billingFactor;

  const priceText = orderData.billing === 'monthly' ? '/mo' : '/yr';
  const totalText = orderData.billing === 'monthly' ? 'month' : 'year';
  const totalPrice = orderData.total;

  confirmPlanText.innerHTML = planText;
  confirmPlanPriceText.innerHTML = `$${planPriceText} <span>${priceText}</span>`;

  // Create a document fragment to temporarily store the selected add-ons
  const fragment = document.createDocumentFragment();

  // Loop through all the add-ons in the confirmationAddons NodeList
  confirmationAddons.forEach(addOn => {
    // Get the ID of the add-on from its class
    const addonId = addOn.classList[1];

    // Check if the add-on is selected in the orderData
    const isSelected = selectedAddons.includes(addonId);

    // If the add-on is selected, update its details
    if (isSelected) {
      // Move the selected add-on to the fragment
      fragment.appendChild(addOn);

      // Update the add-on details
      const addonTitleText = addOn.firstElementChild;
      const addonPriceText = addOn.lastElementChild;
      const addonPrice = addOnData[addonId].price;
      const totalAddonPrice = addonPrice * billingFactor;

      addOn.classList.add('show-addon');
      addonPriceText.innerHTML = `$${totalAddonPrice} <span>${priceText}</span>`;
    } else {
      // If the add-on is not selected, hide it from the confirmation
      addOn.classList.remove('show-addon');
    }
  });

  // Append the fragment to the beginning of the container div
  confirmationCard.prepend(fragment);

  confirmationTotalTitle.innerHTML = `Total <span>( per ${totalText} )</span>`;
  confirmationTotalPrice.innerHTML = `$${totalPrice} <span>${priceText}</span>`;
};

// 2.13 Add functionality to the order summary

// 3. EventListeners

// progressBar.forEach(step => {
//   step.addEventListener('click', () => {
//     updateProgressBar(step);
//   });
// });

nextButtons.forEach((button, index) => {
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

addons.forEach(addon => {
  addon.addEventListener('click', () => {
    updateAdons(addon);
  });
});
