const display = document.getElementById("display");
const historyDisplay = document.getElementById("history");
const errorMessage = document.getElementById("error-message");
const keys = document.querySelector(".keys");

let currentInput = "0";
let previousInput = null;
let operator = null;
let shouldResetDisplay = false;
let justCalculated = false;

function updateDisplay() {
  display.textContent = currentInput;
}

function showError(message) {
  errorMessage.textContent = message;
}

function clearError() {
  errorMessage.textContent = "";
}

function clearCalculator() {
  currentInput = "0";
  previousInput = null;
  operator = null;
  shouldResetDisplay = false;
  justCalculated = false;
  historyDisplay.textContent = "";
  clearError();
  updateDisplay();
}

function inputNumber(number) {
  clearError();

  if (shouldResetDisplay || justCalculated) {
    currentInput = number;
    shouldResetDisplay = false;
    justCalculated = false;
  } else if (currentInput === "0") {
    currentInput = number;
  } else if (currentInput.length < 15) {
    currentInput += number;
  }

  updateDisplay();
}

function inputDecimal() {
  clearError();

  if (shouldResetDisplay || justCalculated) {
    currentInput = "0.";
    shouldResetDisplay = false;
    justCalculated = false;
  } else if (!currentInput.includes(".")) {
    currentInput += ".";
  }

  updateDisplay();
}

function chooseOperator(nextOperator) {
  clearError();

  if (operator !== null && !shouldResetDisplay) {
    calculate();
    if (operator === null) return;
  }

  previousInput = Number(currentInput);
  operator = nextOperator;
  shouldResetDisplay = true;
  justCalculated = false;

  const symbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };
  historyDisplay.textContent = `${currentInput} ${symbols[operator]}`;
}

function calculate() {
  if (operator === null || previousInput === null) return;

  const first = previousInput;
  const second = Number(currentInput);
  let result;

  switch (operator) {
    case "+":
      result = first + second;
      break;
    case "-":
      result = first - second;
      break;
    case "*":
      result = first * second;
      break;
    case "/":
      if (second === 0) {
        showError("Cannot divide by zero.");
        currentInput = "0";
        previousInput = null;
        operator = null;
        shouldResetDisplay = true;
        historyDisplay.textContent = "";
        updateDisplay();
        return;
      }
      result = first / second;
      break;
    default:
      return;
  }

  if (!Number.isFinite(result)) {
    showError("Result is outside the supported range.");
    clearCalculator();
    return;
  }

  const symbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };
  historyDisplay.textContent =
    `${first} ${symbols[operator]} ${second} =`;

  currentInput = String(Number(result.toPrecision(12)));
  previousInput = null;
  operator = null;
  shouldResetDisplay = true;
  justCalculated = true;

  updateDisplay();
}

function deleteLastDigit() {
  clearError();

  if (shouldResetDisplay || justCalculated) {
    currentInput = "0";
    shouldResetDisplay = false;
    justCalculated = false;
  } else {
    currentInput = currentInput.length > 1
      ? currentInput.slice(0, -1)
      : "0";

    if (currentInput === "-") currentInput = "0";
  }

  updateDisplay();
}

function toggleSign() {
  clearError();

  if (currentInput === "0") return;

  currentInput = currentInput.startsWith("-")
    ? currentInput.slice(1)
    : `-${currentInput}`;

  shouldResetDisplay = false;
  justCalculated = false;
  updateDisplay();
}

function applyPercent() {
  clearError();

  const value = Number(currentInput) / 100;

  if (!Number.isFinite(value)) {
    showError("Invalid percentage.");
    return;
  }

  currentInput = String(Number(value.toPrecision(12)));
  shouldResetDisplay = false;
  justCalculated = false;
  updateDisplay();
}

keys.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.number !== undefined) {
    inputNumber(button.dataset.number);
    return;
  }

  if (button.dataset.operator) {
    chooseOperator(button.dataset.operator);
    return;
  }

  switch (button.dataset.action) {
    case "clear":
      clearCalculator();
      break;
    case "delete":
      deleteLastDigit();
      break;
    case "decimal":
      inputDecimal();
      break;
    case "equals":
      calculate();
      break;
    case "sign":
      toggleSign();
      break;
    case "percent":
      applyPercent();
      break;
  }
});

document.addEventListener("keydown", (event) => {
  if (/^[0-9]$/.test(event.key)) {
    inputNumber(event.key);
  } else if (event.key === ".") {
    inputDecimal();
  } else if (["+", "-", "*", "/"].includes(event.key)) {
    chooseOperator(event.key);
  } else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    calculate();
  } else if (event.key === "Backspace") {
    deleteLastDigit();
  } else if (event.key === "Escape") {
    clearCalculator();
  } else {
    return;
  }
});

updateDisplay();