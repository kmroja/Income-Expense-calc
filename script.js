const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const addBtn = document.getElementById("add-btn");
const resetBtn = document.getElementById("reset-btn");
const entryList = document.getElementById("entry-list");

const incomeText = document.getElementById("income");
const expenseText = document.getElementById("expense");
const balanceText = document.getElementById("balance");

let entries = [];
let editIndex = -1;

function updateSummary() {
  let income = entries.filter(e => e.type === "income").reduce((a, b) => a + b.amount, 0);
  let expense = entries.filter(e => e.type === "expense").reduce((a, b) => a + b.amount, 0);
  let balance = income - expense;

  incomeText.textContent = `₹${income.toFixed(2)}`;
  expenseText.textContent = `₹${expense.toFixed(2)}`;
  balanceText.textContent = `₹${balance.toFixed(2)}`;

  // Optional: Set colors dynamically
  incomeText.className = "income";
  expenseText.className = "expense";
  balanceText.className = "balance";
}

function renderEntries() {
  entryList.innerHTML = "";
  const filterType = document.querySelector('input[name="filter"]:checked').value;
  const filtered = entries.filter(e => filterType === "all" || e.type === filterType);

  filtered.forEach((entry, i) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${entry.description}</td>
      <td>₹${entry.amount.toFixed(2)}</td>
      <td class="${entry.type}">${entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}</td>
      <td>
        <i class="fas fa-pen edit-btn" title="Edit" onclick="editEntry(${i})"></i>
        <i class="fas fa-trash delete-btn" title="Delete" onclick="deleteEntry(${i})"></i>
      </td>
    `;

    entryList.appendChild(tr);
  });
}

function addEntry() {
  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = document.querySelector('input[name="type"]:checked').value;

  if (!description || isNaN(amount) || amount <= 0) {
    alert("Please enter a valid description and amount.");
    return;
  }

  const newEntry = { description, amount, type };

  if (editIndex >= 0) {
    entries[editIndex] = newEntry;
    editIndex = -1;
  } else {
    entries.push(newEntry);
  }

  descriptionInput.value = "";
  amountInput.value = "";
  document.querySelector('input[name="type"][value="income"]').checked = true;

  updateSummary();
  renderEntries();
}

function deleteEntry(index) {
  if (confirm("Are you sure you want to delete this entry?")) {
    entries.splice(index, 1);
    updateSummary();
    renderEntries();
  }
}

function editEntry(index) {
  const entry = entries[index];
  descriptionInput.value = entry.description;
  amountInput.value = entry.amount;
  document.querySelector(`input[name="type"][value="${entry.type}"]`).checked = true;
  editIndex = index;
}

addBtn.addEventListener("click", addEntry);

resetBtn.addEventListener("click", () => {
  if (confirm("Clear all entries?")) {
    entries = [];
    updateSummary();
    renderEntries();
  }
});

document.querySelectorAll('input[name="filter"]').forEach(radio => {
  radio.addEventListener("change", renderEntries);
});
