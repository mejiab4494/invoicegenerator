export function openReceiptPopup(items, total, taxText) {
  fetch('receipt.html')
    .then(res => res.text())
    .then(html => {
      const receiptWindow = window.open('', '_blank');
      receiptWindow.document.open();
      receiptWindow.document.write(html);
      receiptWindow.document.close();

      receiptWindow.onload = function () {
        const body = receiptWindow.document.getElementById("receiptBody");

        items.forEach(item => {
          const task = item.querySelector("p").childNodes[0].textContent.trim();
          const price = item.querySelector(".priceVal").textContent;

          const row = receiptWindow.document.createElement("tr");
          row.innerHTML = `<td>${task}</td><td>${price}</td>`;
          body.appendChild(row);
        });

        receiptWindow.document.getElementById("receiptTax").textContent = `Tax: $${taxText}`;
        receiptWindow.document.getElementById("receiptTotal").textContent = `Total: $${total.toFixed(2)}`;

        // Print Button
        receiptWindow.document.getElementById('printBtn').addEventListener('click', () => {
          receiptWindow.print();
        });

        // Copy Button (only copies the receipt section)
        receiptWindow.document.getElementById('copyBtn').addEventListener('click', () => {
          const receiptContent = receiptWindow.document.getElementById('receiptContainer');
          const range = receiptWindow.document.createRange();
          range.selectNode(receiptContent);
          const selection = receiptWindow.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);

          try {
            const successful = receiptWindow.document.execCommand('copy');
            alert(successful ? 'Receipt copied!' : 'Copy failed.');
          } catch (err) {
            alert('Copy not supported by this browser.');
          }

          selection.removeAllRanges();
        });
      };
    });
}
