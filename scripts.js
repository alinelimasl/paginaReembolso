const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

const expenseList = document.querySelector("ul");
const expensesTotal = document.querySelector("aside header h2");
const expenseQuantity = document.querySelector("aside header p span");

amount.oninput = () => {
    let value = amount.value.replace(/\D/g, "");
    value = Number(value) / 100;
    amount.value = formatCurrencyBRL(value);
};

function formatCurrencyBRL(value) {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

form.onsubmit = (event) => {
    event.preventDefault();
    const newExpense = createExpenseObject();
    expenseAdd(newExpense);
};

function createExpenseObject() {
    return {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    };
}

function expenseAdd(newExpense) {
    try {
        const expenseItem = createExpenseItem(newExpense);
        expenseList.appendChild(expenseItem);
        formClear();
        updateTotals();
    } catch (error) {
        handleError("Não foi possível atualizar a lista de despesas.", error);
    }
}

function createExpenseItem(newExpense) {
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    const expenseIcon = document.createElement("img");
    expenseIcon.src = `img/${newExpense.category_id}.svg`;
    expenseIcon.alt = newExpense.category_name;

    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");
    expenseInfo.append(createExpenseName(newExpense.expense), createExpenseCategory(newExpense.category_name));

    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`;

    const removeIcon = document.createElement("img");
    removeIcon.classList.add("remove-icon");
    removeIcon.src = "img/remove.svg";
    removeIcon.alt = "Remover";

    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);
    return expenseItem;
}

function createExpenseName(expenseName) {
    const nameElement = document.createElement("strong");
    nameElement.textContent = expenseName;
    return nameElement;
}

function createExpenseCategory(categoryName) {
    const categoryElement = document.createElement("span");
    categoryElement.textContent = categoryName;
    return categoryElement;
}

function updateTotals() {
    try {
        const items = expenseList.children;
        expenseQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`;
        
        const total = Array.from(items).reduce((acc, item) => {
            const itemAmount = item.querySelector(".expense-amount");
            const value = parseFloat(itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", "."));
            if (isNaN(value)) throw new Error("Valor não é um número válido.");
            return acc + value;
        }, 0);

        expensesTotal.innerHTML = `<small>R$</small>${formatCurrencyBRL(total).toUpperCase().replace("R$", "")}`;
    } catch (error) {
        handleError("Não foi possível atualizar os totais.", error);
    }
}

expenseList.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-icon")) {
        event.target.closest(".expense").remove();
        updateTotals();
    }
});

function formClear() {
    expense.value = "";
    amount.value = "";
    category.value = "";
    expense.focus();
}

function handleError(message, error) {
    alert(message);
    console.error(error);
}
