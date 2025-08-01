document.addEventListener('DOMContentLoaded', () => {
  // Sample load data for the demo load board
  const loads = [
    { origin: 'Dallas, TX', destination: 'Atlanta, GA', equipment: 'Dry Van', weight: '40,000 lbs', rate: '$2,300' },
    { origin: 'Chicago, IL', destination: 'Houston, TX', equipment: 'Reefer', weight: '35,000 lbs', rate: '$2,800' },
    { origin: 'Los Angeles, CA', destination: 'Denver, CO', equipment: 'Flatbed', weight: '42,000 lbs', rate: '$3,200' },
    { origin: 'New York, NY', destination: 'Miami, FL', equipment: 'Dry Van', weight: '38,000 lbs', rate: '$4,100' },
    { origin: 'Seattle, WA', destination: 'Phoenix, AZ', equipment: 'Step Deck', weight: '30,000 lbs', rate: '$2,700' },
    { origin: 'San Antonio, TX', destination: 'Kansas City, MO', equipment: 'Dry Van', weight: '40,000 lbs', rate: '$2,000' },
  ];

  const tableBody = document.querySelector('#loadsTable tbody');
  const searchInput = document.getElementById('searchInput');

  // Render the table rows based on the provided data
  function renderTable(data) {
    tableBody.innerHTML = '';
    data.forEach(load => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${load.origin}</td>
        <td>${load.destination}</td>
        <td>${load.equipment}</td>
        <td>${load.weight}</td>
        <td>${load.rate}</td>
        <td><button class="book-btn">Book</button></td>
      `;
      tableBody.appendChild(row);
    });
  }

  // Initial render
  renderTable(loads);

  // Filter the table when the user types in the search input
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    const filtered = loads.filter(load =>
      load.origin.toLowerCase().includes(query) ||
      load.destination.toLowerCase().includes(query) ||
      load.equipment.toLowerCase().includes(query)
    );
    renderTable(filtered);
  });

  // Handle booking button clicks
  tableBody.addEventListener('click', (event) => {
    if (event.target.classList.contains('book-btn')) {
      alert('Booking request received! An agent will reach out shortly.');
    }
  });
});
