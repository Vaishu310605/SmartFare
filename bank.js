function linkBank() {
  const cardId = document.getElementById("cardId").value.trim();
  const bankAcc = document.getElementById("bankAcc").value.trim();
  const pin = document.getElementById("pin").value.trim();
  const msg = document.getElementById("msg");

  if (!cardId || !bankAcc || pin.length !== 4) {
    msg.textContent = "Please fill valid details.";
    msg.style.color = "red";
    return;
  }

  const users = JSON.parse(localStorage.getItem("users") || "{}");

  // Create fake balance between 500 – 2000 ₹
  const balance = Math.floor(Math.random() * 1500) + 500;

  users[cardId] = { bankAcc, pin, balance };
  localStorage.setItem("users", JSON.stringify(users));

  msg.textContent = `Bank linked successfully! Balance: ₹${balance}`;
  msg.style.color = "green";

  document.getElementById("balanceBox").style.display = "block";
  document.getElementById("balanceAmount").textContent = balance;
}

function generateQR() {
  const cardId = document.getElementById("cardId").value.trim();
  const qrcodeDiv = document.getElementById("qrcode");
  qrcodeDiv.innerHTML = "";
  new QRCode(qrcodeDiv, {
    text: `smartfare://${cardId}`,
    width: 128,
    height: 128
  });
  alert("QR generated! Scan to pay (simulation).");
}

// Example fare deduction simulation
function deductFare(cardId, fare) {
  const users = JSON.parse(localStorage.getItem("users") || "{}");
  if (!users[cardId]) return false;
  if (users[cardId].balance < fare) return false;
  users[cardId].balance -= fare;
  localStorage.setItem("users", JSON.stringify(users));
  return true;
}
