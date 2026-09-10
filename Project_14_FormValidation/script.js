// Regex definitions (simple but effective)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const PHONE_RE = /^(?:\+91[\s-]?|0)?[6-9]\d{9}$/; 
const PWD_RULES = {
  length: { test: pw => pw.length >= 8, msg: 'At least 8 characters' },
  lower: { test: pw => /[a-z]/.test(pw), msg: 'Lowercase letter' },
  upper: { test: pw => /[A-Z]/.test(pw), msg: 'Uppercase letter' },
  number: { test: pw => /[0-9]/.test(pw), msg: 'Number' },
  special: { test: pw => /[^A-Za-z0-9]/.test(pw), msg: 'Special character' }
};

// Elements
const form = document.getElementById('signupForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirm');
const phoneInput = document.getElementById('phone');
const termsInput = document.getElementById('terms');

const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const confirmError = document.getElementById('confirmError');
const phoneError = document.getElementById('phoneError');
const termsError = document.getElementById('termsError');

const pwBar = document.getElementById('pwBar');
const formMessage = document.getElementById('formMessage');

const togglePwd = document.getElementById('togglePwd');
const resetBtn = document.getElementById('resetBtn');

// Utilities
function setError(el, msg){
  el.textContent = msg || '';
}
function setValidState(input, ok){
  if(ok) input.style.borderColor = 'rgba(16,185,129,0.6)'; // green
  else input.style.borderColor = 'rgba(239,68,68,0.6)'; // red
}

// Validation functions
function validateName(){
  const v = nameInput.value.trim();
  if(!v){
    setError(nameError,'Please enter your full name.');
    setValidState(nameInput, false);
    return false;
  }
  setError(nameError,'');
  setValidState(nameInput, true);
  return true;
}

function validateEmail(){
  const v = emailInput.value.trim();
  if(!v){
    setError(emailError,'Email is required.');
    setValidState(emailInput, false);
    return false;
  }
  if(!EMAIL_RE.test(v)){
    setError(emailError,'Enter a valid email address.');
    setValidState(emailInput, false);
    return false;
  }
  setError(emailError,'');
  setValidState(emailInput, true);
  return true;
}

function passwordStrength(pw){
  // score 0..100 based on rules and length
  let score = 0;
  if(PWD_RULES.length.test(pw)) score += 30;
  if(PWD_RULES.lower.test(pw)) score += 15;
  if(PWD_RULES.upper.test(pw)) score += 15;
  if(PWD_RULES.number.test(pw)) score += 20;
  if(PWD_RULES.special.test(pw)) score += 20;
  return Math.min(100, score);
}

function validatePassword(){
  const pw = passwordInput.value;
  const fails = Object.values(PWD_RULES).filter(r => !r.test(pw)).map(r => r.msg);
  if(!pw){
    setError(passwordError,'Password is required.');
    setValidState(passwordInput, false);
    updateStrength(0);
    return false;
  }
  if(fails.length){
    setError(passwordError, 'Missing: ' + fails.join(', '));
    setValidState(passwordInput, false);
    updateStrength(passwordStrength(pw));
    return false;
  }
  setError(passwordError,'');
  setValidState(passwordInput, true);
  updateStrength(passwordStrength(pw));
  return true;
}

function validateConfirm(){
  const pw = passwordInput.value;
  const c = confirmInput.value;
  if(!c){
    setError(confirmError,'Please confirm your password.');
    setValidState(confirmInput, false);
    return false;
  }
  if(pw !== c){
    setError(confirmError,'Passwords do not match.');
    setValidState(confirmInput, false);
    return false;
  }
  setError(confirmError,'');
  setValidState(confirmInput, true);
  return true;
}

function validatePhone(){
  const v = phoneInput.value.trim();
  if(!v){
    setError(phoneError,'');
    phoneInput.style.borderColor = '';
    return true; // optional
  }
  if(!PHONE_RE.test(v)){
    setError(phoneError,'Enter a valid phone number.');
    setValidState(phoneInput, false);
    return false;
  }
  setError(phoneError,'');
  setValidState(phoneInput, true);
  return true;
}

function validateTerms(){
  if(!termsInput.checked){
    setError(termsError,'You must accept the terms.');
    return false;
  }
  setError(termsError,'');
  return true;
}

// Strength bar UI
function updateStrength(score){
  pwBar.style.width = score + '%';
  if(score < 35) pwBar.style.background = '#ef4444';
  else if(score < 70) pwBar.style.background = '#f59e0b';
  else pwBar.style.background = '#10b981';
}

// Event listeners for live validation
nameInput.addEventListener('input', validateName);
emailInput.addEventListener('input', validateEmail);
passwordInput.addEventListener('input', () => {
  validatePassword();
  validateConfirm(); // re-check confirmation live
});
confirmInput.addEventListener('input', validateConfirm);
phoneInput.addEventListener('input', validatePhone);
termsInput.addEventListener('change', validateTerms);

// Toggle show/hide password
togglePwd.addEventListener('click', () => {
  const type = passwordInput.type === 'password' ? 'text' : 'password';
  passwordInput.type = type;
  confirmInput.type = type;
  togglePwd.textContent = type === 'text' ? 'Hide' : 'Show';
  togglePwd.setAttribute('aria-pressed', type === 'text');
});

// Reset
resetBtn.addEventListener('click', () => {
  form.reset();
  // clear errors & styles
  [nameError,emailError,passwordError,confirmError,phoneError,termsError].forEach(e => e.textContent = '');
  [nameInput,emailInput,passwordInput,confirmInput,phoneInput].forEach(i => i.style.borderColor = '');
  updateStrength(0);
  formMessage.textContent = '';
});

// Final submit
form.addEventListener('submit', (ev) => {
  ev.preventDefault();
  formMessage.textContent = '';
  const ok = [
    validateName(),
    validateEmail(),
    validatePassword(),
    validateConfirm(),
    validatePhone(),
    validateTerms()
  ].every(Boolean);

  if(!ok){
    formMessage.textContent = 'Please fix the errors above before submitting.';
    formMessage.style.color = '#f59e0b';
    return;
  }

  // Simulate successful submission (replace with real registration logic)
  formMessage.textContent = 'Success! Form validated — ready to submit to the server.';
  formMessage.style.color = '#10b981';

  // Optionally collect data
  const payload = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim() || null
    // IMPORTANT: in real apps never send plain password unless over HTTPS and following best practices
  };
  console.log('Validated payload:', payload);

  // Optionally clear sensitive fields
  passwordInput.value = '';
  confirmInput.value = '';
  updateStrength(0);
});
