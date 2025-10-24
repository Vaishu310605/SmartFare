let users = {};
let rides = [];

function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// Bank linking
function linkBank() {
  const cardId = document.getElementById("bankCardId").value.trim();
  const bankAcc = document.getElementById("bankAcc").value.trim();
  const pin = document.getElementById("pin").value.trim();
  const gender = document.getElementById("gender").value;
  
  if (!cardId || !bankAcc || !pin) {
    document.getElementById("msg").innerText = "⚠️ Please fill all details.";
    return;
  }

  users[cardId] = { bankAcc, pin, balance: 500, gender }; // default ₹500
  document.getElementById("msg").innerText = "✅ Bank Linked Successfully!";
  document.getElementById("balanceAmount").innerText = users[cardId].balance;
  document.getElementById("balanceBox").style.display = "block";
}

// Fare calculation
function calculateFare() {
  const cardId = document.getElementById("cardId").value.trim();
  const from = document.getElementById("fromStop").value;
  const to = document.getElementById("toStop").value;

  if (!users[cardId]) {
    document.getElementById("result").innerText = "❌ Card not linked!";
    return;
  }

  const gender = users[cardId].gender;
  let fare = 50; // base fare
  if (gender === "Female") fare = 0; // free ride for women

  if (users[cardId].balance < fare) {
    document.getElementById("result").innerText = "⚠️ Insufficient balance!";
    return;
  }

  users[cardId].balance -= fare;
  document.getElementById("result").innerText = `✅ Ticket booked! Fare: ₹${fare}`;
  
  rides.push({ cardId, gender, from, to, fare, time: new Date().toLocaleString() });
  updateDashboard();
}

// Update dashboard
function updateDashboard() {
  const totalRevenue = rides.reduce((sum, r) => sum + r.fare, 0);
  document.getElementById("totalRides").innerText = `🚌 Total Rides: ${rides.length}`;
  document.getElementById("totalRevenue").innerText = `💰 Total Revenue: ₹${totalRevenue}`;

  const tbody = document.querySelector("#fareTable tbody");
  tbody.innerHTML = "";
  rides.forEach(r => {
    const row = `<tr><td>${r.cardId}</td><td>${r.gender}</td><td>${r.from}</td><td>${r.to}</td><td>${r.fare}</td><td>${r.time}</td></tr>`;
    tbody.innerHTML += row;
  });
}
