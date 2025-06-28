import { openReceiptPopup } from './receipt.js';


const serviceInput = document.getElementById("serviceInput");
const priceInput = document.getElementById("priceInput");
const taxInput = document.getElementById("taxInput");
const invoice = document.getElementById("invoice");
const enterInfo = document.getElementById("enterBtn");
const clearBtn = document.getElementById("clearBtn");
const invoiceBtn = document.getElementById("invoiceBtn");

let totalArr = [];

function generateService() {
    const service = serviceInput.value.trim();
    const price = parseFloat(priceInput.value.trim());

    if (!service || isNaN(price)) {
        alert("Please enter a valid service and numeric price.");
        return;
    }

    invoice.innerHTML += `
        <div class="item">
            <p>${service} <span class="singleDlt">Remove</span></p>
            <p class="priceVal">$${price.toFixed(2)}</p>
        </div>
    `;

    totalArr.push(price);
    sum();
    showTotalSection();

    serviceInput.value = '';
    priceInput.value = '';
    serviceInput.focus();
}

function calculateTotal() {
    const subtotal = totalArr.reduce((acc, curr) => acc + curr, 0);
    const taxVal = taxInput.value.trim();
    const taxNum = parseFloat(taxVal);
    if (!taxVal || isNaN(taxNum)) return subtotal;

    return subtotal + (subtotal * (taxNum / 100));
}

function sum() {
    const subtotal = totalArr.reduce((acc, curr) => acc + curr, 0);
    const taxVal = taxInput.value.trim();
    const taxNum = parseFloat(taxVal);
    const taxAmount = isNaN(taxNum) ? 0 : subtotal * (taxNum / 100);
    const total = subtotal + taxAmount;

    document.querySelector(".tax").textContent = `Tax: $${taxAmount.toFixed(2)}`;
    document.querySelector(".total").textContent = `$${total.toFixed(2)}`;
}

function showTotalSection() {
    document.querySelector(".display-total").style.display = "flex";
}

function clear() {
    document.querySelector(".display-total").style.display = "none";
    document.querySelector(".total").textContent = '';
    document.querySelector(".tax").textContent = '';
    invoice.innerHTML = '';
    serviceInput.value = '';
    priceInput.value = '';
    taxInput.value = '';
    serviceInput.focus();
    totalArr = [];
}

function clearSingleItem(e) {
    if (e.target.classList.contains("singleDlt")) {
        const item = e.target.closest(".item");
        const priceText = item.querySelector(".priceVal").textContent.replace('$', '');
        const price = parseFloat(priceText);
        const index = totalArr.indexOf(price);
        if (index !== -1) totalArr.splice(index, 1);
        item.remove();
        sum();
    }
}

enterInfo.addEventListener("click", generateService);

document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" &&
        (document.activeElement === serviceInput ||
            document.activeElement === priceInput ||
            document.activeElement === taxInput)) {
        generateService();
    }
});

clearBtn.addEventListener("click", clear);
invoice.addEventListener("click", clearSingleItem);

invoiceBtn.addEventListener("click", () => {
    const totalText = document.querySelector(".total").textContent.trim();
    if (!totalText) {
        alert("Please add some items before previewing.");
        return;
    }

    const items = document.querySelectorAll("#invoice .item");
    const total = calculateTotal();
    const taxText = document.querySelector(".tax").textContent.replace("Tax: ", "");

    openReceiptPopup(items, total, taxText);
    
});