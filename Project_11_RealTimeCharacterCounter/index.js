const textareaEl = document.getElementById("textarea");
const totalCounterEl = document.getElementById("totalCounter");
const remainingCounterEl = document.getElementById("remainingCounter");

textareaEl.addEventListener("keyup", () => {
  updateCounter();
});

updateCounter();

function updateCounter() {
  const maxLength = textareaEl.getAttribute("maxlength");
  const currentLength = textareaEl.value.length;

  totalCounterEl.textContent = currentLength;
  remainingCounterEl.textContent = maxLength - currentLength;
}
