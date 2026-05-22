const resultEl = document.getElementById('result');
const expressionEl = document.getElementById('expression');

let currentValue = '0';
let expression = '';
let operator = null;
let firstOperand = null;
let waitingForSecond = false;
let justEvaluated = false;

function updateDisplay() {
  resultEl.textContent = currentValue;
  resultEl.classList.toggle('small', currentValue.length > 9);
}

function inputDigit(digit) {
  if (waitingForSecond) {
    currentValue = digit;
    waitingForSecond = false;
  } else if (justEvaluated) {
    currentValue = digit;
    expression = '';
    justEvaluated = false;
  } else {
    currentValue = currentValue === '0' ? digit : currentValue + digit;
  }
  updateDisplay();
}

function inputDecimal() {
  if (waitingForSecond) {
    currentValue = '0.';
    waitingForSecond = false;
    updateDisplay();
    return;
  }
  if (justEvaluated) {
    currentValue = '0.';
    expression = '';
    justEvaluated = false;
    updateDisplay();
    return;
  }
  if (!currentValue.includes('.')) {
    currentValue += '.';
    updateDisplay();
  }
}

function handleOperator(op) {
  const current = parseFloat(currentValue);

  if (firstOperand !== null && !waitingForSecond) {
    const result = calculate(firstOperand, current, operator);
    currentValue = formatResult(result);
    firstOperand = result;
  } else {
    firstOperand = current;
  }

  operator = op;
  waitingForSecond = true;
  justEvaluated = false;
  expression = `${formatResult(firstOperand)} ${op}`;
  expressionEl.textContent = expression;
  updateDisplay();
}

function calculate(a, b, op) {
  switch (op) {
    case '+': return a + b;
    case '−': return a - b;
    case '×': return a * b;
    case '÷': return b !== 0 ? a / b : 'Error';
    case '%': return a % b;
    default: return b;
  }
}

function formatResult(value) {
  if (value === 'Error') return 'Error';
  const str = String(parseFloat(value.toFixed(10)));
  return str;
}

function handleEquals() {
  if (operator === null || waitingForSecond) return;

  const second = parseFloat(currentValue);
  const result = calculate(firstOperand, second, operator);

  expressionEl.textContent = `${formatResult(firstOperand)} ${operator} ${second} =`;
  currentValue = result === 'Error' ? 'Error' : formatResult(result);
  firstOperand = null;
  operator = null;
  waitingForSecond = false;
  justEvaluated = true;
  updateDisplay();
}

function handleClear() {
  currentValue = '0';
  expression = '';
  operator = null;
  firstOperand = null;
  waitingForSecond = false;
  justEvaluated = false;
  expressionEl.textContent = '';
  updateDisplay();
}

function handleNegate() {
  if (currentValue !== '0' && currentValue !== 'Error') {
    currentValue = currentValue.startsWith('-')
      ? currentValue.slice(1)
      : '-' + currentValue;
    updateDisplay();
  }
}

document.querySelector('.buttons').addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;

  const action = btn.dataset.action;
  const value = btn.dataset.value;

  switch (action) {
    case 'digit':    inputDigit(value); break;
    case 'decimal':  inputDecimal(); break;
    case 'operator': handleOperator(value); break;
    case 'equals':   handleEquals(); break;
    case 'clear':    handleClear(); break;
    case 'negate':   handleNegate(); break;
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') inputDigit(e.key);
  else if (e.key === '.') inputDecimal();
  else if (e.key === '+') handleOperator('+');
  else if (e.key === '-') handleOperator('−');
  else if (e.key === '*') handleOperator('×');
  else if (e.key === '/') { e.preventDefault(); handleOperator('÷'); }
  else if (e.key === '%') handleOperator('%');
  else if (e.key === 'Enter' || e.key === '=') handleEquals();
  else if (e.key === 'Escape') handleClear();
  else if (e.key === 'Backspace') {
    if (currentValue.length > 1 && !waitingForSecond) {
      currentValue = currentValue.slice(0, -1) || '0';
      updateDisplay();
    } else {
      handleClear();
    }
  }
});
