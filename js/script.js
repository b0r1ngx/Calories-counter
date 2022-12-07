const WEIGHT_MULTIPLIER = 10;
const HEIGHT_MULTIPLIER = 6.25;
const AGE_MULTIPLIER = 5;
const FEMALE_ADD = 161;
const MALE_ADD = 5;
const WEIGHT_LOSS = 0.85;
const WEIGHT_GAIN = 1.15;

const ACTIVITY_COEFFICIENTS = {
    'min': 1.2,
    'low': 1.375,
    'medium': 1.55,
    'high': 1.725,
    'max': 1.9
};

const ageInput = document.querySelector('input[name="age"]');
const heightInput = document.querySelector('input[name="height"]');
const weightInput = document.querySelector('input[name="weight"]');

let ageIsEntered = false;
let heightIsEntered = false;
let weightIsEntered = false;

const resultWindow = document.querySelector('.counter__result')
const submitButton = document.querySelector('.form__submit-button');
const resetButton = document.querySelector('.form__reset-button');

let toggleButton = (button, isDisabled) => (
    button.disabled = isDisabled
);

let recomposeButtons = () => {
    if (ageIsEntered && heightIsEntered && weightIsEntered) {
        toggleButton(submitButton, false);
        toggleButton(resetButton, false);
    } else if (ageIsEntered || heightIsEntered || weightIsEntered) {
        toggleButton(submitButton, true);
        toggleButton(resetButton, false);
    } else {
        toggleButton(submitButton, true);
        toggleButton(resetButton, true);
    }
};

ageInput.addEventListener('input', function () {
    if (ageInput.value > 0) {
        ageIsEntered = true;
    }
    recomposeButtons();
});

heightInput.addEventListener('input', function () {
    if (heightInput.value > 0) {
        heightIsEntered = true;
    }
    recomposeButtons();
});

weightInput.addEventListener('input', function () {
    if (weightInput.value > 0) {
        weightIsEntered = true;
    }
    recomposeButtons();
});

let round = (x) => Math.round(x);

let calculateWeightResults = (isFemale, age, height, weight, coefficient) => {
    let maintenance = WEIGHT_MULTIPLIER * weight
        + HEIGHT_MULTIPLIER * height
        - AGE_MULTIPLIER * age;

    isFemale ? maintenance -= FEMALE_ADD : maintenance += MALE_ADD;
    maintenance *= coefficient;
    return [
        round(maintenance),
        round(maintenance * WEIGHT_LOSS),
        round(maintenance * WEIGHT_GAIN)
    ]
};

let isFemalePicked = () => (
    document.querySelector(
        'input[name="gender"]:checked'
    ).value === 'female'
);

let getInputValues = () => ([
    ageInput.value,
    heightInput.value,
    weightInput.value
]);

let getCoefficientFromInputActivityType = () => (
    ACTIVITY_COEFFICIENTS[
        document.querySelector(
            'input[name="activity"]:checked'
        ).value
        ]
);

let updateAndShowResultWindow = (maintenance, loss, gain) => {
    document.querySelector('#calories-norm').textContent = maintenance;
    document.querySelector('#calories-minimal').textContent = loss;
    document.querySelector('#calories-maximal').textContent = gain;
    resultWindow.classList.remove('counter__result--hidden');
};

let resetToDefaults = () => {
    document.querySelector('input[name="gender"]').checked = true;
    document.querySelector('input[name="age"]').value = '';
    document.querySelector('input[name="height"]').value = '';
    document.querySelector('input[name="weight"]').value = '';
    document.querySelector('input[name="activity"]').checked = true;
};

submitButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    const isFemale = isFemalePicked();
    const [age, height, weight] = getInputValues();
    const coefficient = getCoefficientFromInputActivityType();
    const [maintenance, loss, gain] = calculateWeightResults(isFemale, age, height, weight, coefficient);
    updateAndShowResultWindow(maintenance, loss, gain);
});

resetButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    resetToDefaults();
    toggleButton(submitButton, true);
    toggleButton(resetButton, true);
    resultWindow.classList.add('counter__result--hidden');
});