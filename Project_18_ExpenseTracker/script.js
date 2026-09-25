// Select elements
const desc = document.getElementById("desc");
const amount = document.getElementById("amount");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("list");

const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");

// Load from LocalStorage or start empty
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Save to LocalStorage
function saveData() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Format numbers as rupees
function formatMoney(n) {
  return "₹" + n.toLocaleString("en-IN");
}

// Render all items
function renderList() {
  list.innerHTML = "";

  transactions.forEach((t) => {
    const li = document.createElement("li");
    li.style.borderColor = t.amount > 0 ? "#10b981" : "#ef4444";

    li.innerHTML = `
      <span class="text">${t.desc}</span>
      <span class="amount ${t.amount > 0 ? "green" : "red"}">${formatMoney(t.amount)}</span>
      <button class="del-btn" onclick="deleteItem(${t.id})">✖</button>
    `;

    list.appendChild(li);
  });

  updateSummary();
}

// Update totals using reduce()
function updateSummary() {
  const amounts = transactions.map((t) => t.amount);

  const total = amounts.reduce((acc, v) => acc + v, 0);
  const income = amounts.filter((v) => v > 0).reduce((a, b) => a + b, 0);
  const expense = amounts.filter((v) => v < 0).reduce((a, b) => a + b, 0);

  balanceEl.textContent = formatMoney(total);
  incomeEl.textContent = formatMoney(income);
  expenseEl.textContent = formatMoney(expense);
}

// Add transaction
addBtn.addEventListener("click", () => {
  const d = desc.value.trim();
  const a = Number(amount.value);

  if (!d || !amount.value) {
    alert("Please enter both description and amount.");
    return;
  }

  const t = {
    id: Date.now(),
    desc: d,
    amount: a
  };

  transactions.push(t);
  saveData();
  renderList();

  desc.value = "";
  amount.value = "";
});

// Delete item
function deleteItem(id) {
  transactions = transactions.filter((t) => t.id !== id);
  saveData();
  renderList();
}

// INITIAL RENDER
renderList();
