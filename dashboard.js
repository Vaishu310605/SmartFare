window.onload = function () {
  const data = JSON.parse(localStorage.getItem("fares") || "[]");
  const tableBody = document.querySelector("#fareTable tbody");
  const totalRides = document.getElementById("totalRides");
  const totalRevenue = document.getElementById("totalRevenue");

  if (data.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='5'>No records found</td></tr>";
    return;
  }

  let totalFare = 0;
  const stopCounts = {};

  data.forEach(record => {
    const row = `<tr>
      <td>${record.cardId}</td>
      <td>${record.from}</td>
      <td>${record.to}</td>
      <td>${record.fare}</td>
      <td>${record.time}</td>
    </tr>`;
    tableBody.innerHTML += row;
    totalFare += record.fare;

    stopCounts[record.from] = (stopCounts[record.from] || 0) + 1;
    stopCounts[record.to] = (stopCounts[record.to] || 0) + 1;
  });

  totalRides.textContent = `Total Rides: ${data.length}`;
  totalRevenue.textContent = `Total Revenue: ₹${totalFare}`;

  // Chart.js
  const ctx = document.getElementById("ridesChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(stopCounts),
      datasets: [{
        label: "Rides per Stop",
        data: Object.values(stopCounts),
        backgroundColor: "#0077b6"
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
};
