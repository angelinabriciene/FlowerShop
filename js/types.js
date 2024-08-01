let currentPage = 1;
const itemsPerPage = 9;
let allFlowers = [];
let filterValue = '';
let priceOption = '';

function paginate(array, page, itemsPerPage) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return array.slice(startIndex, endIndex);
}

async function fetchFlowers() {
  const typeId = new URLSearchParams(window.location.search).get('id');
  try {
    const response = await axios.get(`http://localhost:8080/api/types/${typeId}`);
    const type = response.data;
    const flowers = type.flowers || [];

    const validFlowers = flowers.filter(flower => flower && typeof flower === 'object' && flower.id);
    
    const totalItemCount = validFlowers.length;
    const typeHeader = document.getElementById('typeHeader');
    typeHeader.innerHTML = `<h2>${type.name} (${totalItemCount})</h2>`;

    allFlowers = validFlowers;

    applyFilters();
  } catch (error) {
    console.error('Error fetching flowers:', error);
  }
}

async function fetchTypes() {
  try {
    const response = await axios.get("http://localhost:8080/api/types");
    const types = response.data;

    if (!Array.isArray(types)) {
      throw new Error('Invalid data format');
    }

    const typeList = document.getElementById('menuSideBar');
    typeList.innerHTML = '';

    types.forEach(type => {
      if (type && type.id && type.name) {
        const typeRow = `
          <li class="nav-item">
            <a class="nav-link" href="oneType.html?id=${type.id}" data-type="${type.id}">₰ ${type.name}</a>
          </li>
        `;
        typeList.insertAdjacentHTML('beforeend', typeRow);
      } else {
        console.warn('Invalid type object:', type);
      }
    });

  } catch (error) {
    console.error('Error fetching types:', error);
  }
}

function applyFilters() {
  let filteredFlowers = allFlowers;

  if (filterValue) {
    filteredFlowers = filteredFlowers.filter(flower =>
      flower.name.toLowerCase().includes(filterValue.toLowerCase()) ||
      flower.plant.toLowerCase().includes(filterValue.toLowerCase())
    );
  }

  if (priceOption) {
    if (priceOption === '1') {
      filteredFlowers.sort((a, b) => a.price - b.price);
    } else if (priceOption === '2') {
      filteredFlowers.sort((a, b) => b.price - a.price);
    }
  }

  displayFlowers(filteredFlowers);
}

function displayFlowers(flowers) {
  const flowerList = document.getElementById('flower-list');
  flowerList.innerHTML = '';

  const paginatedFlowers = paginate(flowers, currentPage, itemsPerPage);

  paginatedFlowers.forEach(flower => {
    if (flower && flower.id) {
      const flowerRow = `
        <a href="oneFlower.html?id=${flower.id}">
          <div class="card" style="width: 18rem;">
            <img class="card-img-top" src="green.jpg" alt="Card image cap">
            <div class="card-body">
              <p class="card-text">${flower.name}</p>
              <p class="card-text">${flower.plant}</p>
              <p class="card-text">Kaina: ${flower.price} €</p>
            </div>
          </div>
        </a>
      `;
      flowerList.insertAdjacentHTML('beforeend', flowerRow);
    } else {
      console.warn('Invalid flower object:', flower);
    }
  });

  const paginationButtons = document.getElementById('pagination-buttons');
  paginationButtons.innerHTML = '';

  const totalPages = Math.ceil(flowers.length / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.className = 'pagination-button';

    if (i === currentPage) {
      button.classList.add('active');
    }

    button.addEventListener('click', () => {
      currentPage = i;
      applyFilters();
    });
    paginationButtons.appendChild(button);
  }
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

document.getElementById('filter').addEventListener('input', (event) => {
  filterValue = event.target.value.trim().toLowerCase();
  applyFilters();
});

document.getElementById('price').addEventListener('change', (event) => {
  priceOption = event.target.value;
  applyFilters();
});

fetchTypes();
fetchFlowers();