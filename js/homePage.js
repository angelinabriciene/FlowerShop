const apiUrl = 'http://localhost:8080/api/flowers';

if (window.location.href.includes("homePage")) {
  fetchFlowers();
}

fetchTypes();

const filterInput = document.getElementById('filter');
const applyFilterButton = document.getElementById('apply-filter');
applyFilterButton.addEventListener('click', applyFilter);


try {
  document.getElementById("submitNewFlower").addEventListener("click", function (event) {
    saveFlower();
    event.preventDefault();
  });
} catch (Exception) { }

function showAlert(status) {
  const alertsContainer = document.getElementById('alert-message');
  alertsContainer.innerHTML = `
        <div class="alert alert-success">
            <strong>Success!</strong> Prekė sėkmingai  ${status}.
        </div>
    `;
  setTimeout(() => {
    alertsContainer.innerHTML = '';
  }, 3000);
}

let currentPage = 1;
const itemsPerPage = 9;

async function fetchFlowers() {
  try {
    const response = await axios.get("http://localhost:8080/api/types");
    const types = response.data;

    const flowers = types.reduce((acc, type) => {
      if (Array.isArray(type.flowers)) {
        return acc.concat(type.flowers);
      }
      return acc;
    }, []);

    const validFlowers = flowers.filter(flower => flower && typeof flower === 'object' && flower.id);

    const flowerList = document.getElementById('flower-list');
    if (!flowerList) {
      console.error('Element with id "flower-list" not found');
      return;
    }
    flowerList.innerHTML = '';

    const paginatedFlowers = paginate(validFlowers, currentPage, itemsPerPage);

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

    const typeHeader = document.getElementById('typeHeader');
    if (typeHeader) {
      typeHeader.innerHTML = `Viso prekių (${validFlowers.length})`;
    }

    const paginationButtons = document.getElementById('pagination-buttons');
    if (paginationButtons) {
      paginationButtons.innerHTML = '';

      const totalPages = Math.ceil(validFlowers.length / itemsPerPage);

      for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = 'pagination-button';

        if (i === currentPage) {
          button.classList.add('active');
        }

        button.addEventListener('click', () => {
          currentPage = i;
          fetchFlowers();
        });
        paginationButtons.appendChild(button);
      }
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  } catch (error) {
    console.error('Error fetching flowers:', error);
  }
}

function paginate(array, page, itemsPerPage) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return array.slice(startIndex, endIndex);
}


async function displayFlowerInfo() {
  const flowerId = new URLSearchParams(window.location.search).get('id');
  try {
    const response = await axios.get(`http://localhost:8080/api/flowers/${flowerId}`);
    const flower = response.data;

    const positionsResponse = await axios.get('http://localhost:8080/api/planting_positions');
    const positions = positionsResponse.data;

    const plantingPosition = positions.find(position => position.id == flower.plantingPositionId);
    const plantingPositionName = plantingPosition ? plantingPosition.name : 'Unknown';

    const perennialText = flower.perennial ? "Daugiametis" : "Vienmetis";
    const colorNames = flower.colors.map(color => color.name).join(", ");

    const flowerInfo = document.getElementById('flower-info');
    flowerInfo.innerHTML = `
                    <div class="flower-container">
                        <img class="flower-image" src="green.jpg">
                        <div class="flower-details">
                        <h2>${flower.name}, ${flower.plant}</h2>
                        <a href="oneType.html?id=${flower.type.id}">₰ ${flower.type.name}</a>
                        <p></p>
                        <p>${perennialText}</p>
                        <p><strong>Auginimas:</strong> ${plantingPositionName}</p>
                        <p><strong>Galimos spalvos:</strong> ${colorNames}</p>
                        <p><strong>Kaina:</strong> ${flower.price} €</p>
                        <p><strong>Aprašas:</strong> ${flower.family}</p>
                      </div>
                    </div>
                    <div>
                    <a href="./update.html?id=${flower.id}" class="btn btn-warning" id="updateFlower">Redaguoti</a>
                        <button class="btn btn-danger" id="deleteFlower">Ištrinti</button>
                    </div>
                    `;

    const deleteButton = document.getElementById('deleteFlower');
    deleteButton.addEventListener('click', async () => {
      deleteFlower();
    });
  } catch (error) {
    console.error('Error fetching flower:', error);
  }
}

async function saveFlower() {
  const name = document.getElementById('flowerName').value;
  const plant = document.getElementById('plant').value;
  const family = document.getElementById('descriptionNew').value;
  const price = document.getElementById('price').value;
  let perennial;
  const perennialRadios = document.getElementsByName('exampleRadios');
  for (let i = 0; i < perennialRadios.length; i++) {
    if (perennialRadios[i].checked) {
      perennial = perennialRadios[i].value;
      break;
    }
  }
  const typeId = document.getElementById('flowerType').value;

  let color = [];
  const colorOptions = document.querySelectorAll('[id^="flowerColorOption"]');
  colorOptions.forEach((option) => {
    if (option.checked) {
      color.push(option.value);
    }
  });
  const colorString = color.join(',');
  const plantingPositionId = document.getElementById('flowerPosition').value;

  const type = { id: typeId };
  const flower = {
    name,
    plant,
    family,
    price,
    perennial,
    type,
    colorId: color.length > 0 ? color[0] : null,
    plantingPositionId
  };

  try {
    await axios.post(apiUrl, flower);
    window.location.href = "http://127.0.0.1:5500/view/homePage.html?info=u";
    showAlert(" išsaugota")
  } catch (error) {
    console.error('Error saving flower:', error);
  }
}

async function deleteFlower() {
  const flowerId = new URLSearchParams(window.location.search).get('id');
  try {
    await axios.delete(`${apiUrl}/${flowerId}`);
    window.location.href = "http://127.0.0.1:5500/view/homePage.html?info=d";

  } catch (error) {
    console.error('Error deleting author:', error);
  }
}

if (window.location.href.includes("info=d")) {
  showAlert(" ištrinta");
}

if (window.location.href.includes("info=u")) {
  showAlert(" išsaugota");
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
            <a class="nav-link" href="oneType.html?id=${type.id}">₰ ${type.name}</a>
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


async function applyFilter() {
  const filterValue = filterInput.value.trim().toLowerCase();
  const flowerList = document.getElementById('flower-list');
  flowerList.innerHTML = '';

  try {
    const flowers = await fetchFlowersFiltered(filterValue);
    if (flowers.length === 0) {
      document.getElementById('flower-list').innerHTML = 'No flowers found.';
    } else {
      const paginatedFlowers = paginate(flowers, currentPage, itemsPerPage);

      paginatedFlowers.forEach(flower => {
        const flowerRow = `
            <a href="oneFlower.html?id=${flower.id}">
              <div class="card" style="width: 18rem;">
                <img class="card-img-top" src="green.jpg" alt="Card image cap">
                <div class="card-body">
                  <p id="flowerName" class="card-text">${flower.name}</p>
                  <p id="flowerName" class="card-text">${flower.plant}</p>
                  <p id="flowerPrice" class="card-text"> Kaina: ${flower.price} €</p>
                </div>
              </div>
            </a>
          `;
        flowerList.insertAdjacentHTML('beforeend', flowerRow);
      });

      const paginationButtons = document.getElementById('pagination-buttons');
      paginationButtons.innerHTML = '';

      const totalPages = Math.ceil(flowers.length / itemsPerPage);

      for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = 'pagination-button';

        if (i == currentPage) {
          button.classList.add('active');
        }

        button.addEventListener('click', () => {
          currentPage = i;
          applyFilter();
        });
        paginationButtons.appendChild(button);
      }
    }
  } catch (error) {
    console.error('Error fetching flowers:', error);
    document.getElementById('flower-list').innerHTML = 'Failed to fetch flowers. Please try again later.';
  }
}

async function fetchFlowersFiltered(filterValue = '') {
  try {
    const response = await axios.get(`http://localhost:8080/api/types`);
    const types = response.data;

    if (response.status === 200) {
      const flowers = types.flatMap(type => type.flowers.filter(flower => {
        return (
          flower.name.toLowerCase().includes(filterValue.toLowerCase()) ||
          flower.plant.toLowerCase().includes(filterValue.toLowerCase())
        );
      }));
      return flowers;
    } else {
      console.error('Error fetching flowers:', response.status);
      return [];
    }
  } catch (error) {
    console.error('Error fetching flowers:', error);
    return [];
  }
}

const priceSelect = document.getElementById('price');

priceSelect.addEventListener('change', async () => {
  const priceOption = priceSelect.options[priceSelect.selectedIndex].value;
  const flowers = await fetchFlowersByPrice(priceOption);
  const flowerList = document.getElementById('flower-list');
  flowerList.innerHTML = '';
  const paginatedFlowers = paginate(flowers, currentPage, itemsPerPage);

  let cardCount = 0;

  paginatedFlowers.forEach(flower => {
    const flowerRow = `
      <a href="oneFlower.html?id=${flower.id}">
        <div class="card" style="width: 18rem;">
          <img class="card-img-top" src="green.jpg" alt="Card image cap">
          <div class="card-body">
            <p id="flowerName" class="card-text">${flower.name}</p>
            <p id="flowerPlant" class="card-text">${flower.plant}</p>
            <p id="flowerPrice" class="card-text"> Kaina: ${flower.price} €</p>
          </div>
        </div>
      </a>
    `;
    flowerList.insertAdjacentHTML('beforeend', flowerRow);
    cardCount++;
  });
});

async function fetchFlowersByPrice(priceOption = '') {
  try {
    const response = await axios.get(`http://localhost:8080/api/types`);
    const types = response.data;

    if (response.status === 200) {
      let flowers = types.flatMap(type => type.flowers);

      if (priceOption === '1') {
        flowers.sort((a, b) => a.price - b.price);
      } else if (priceOption === '2') {
        flowers.sort((a, b) => b.price - a.price);
      }

      return flowers;
    } else {
      console.error('Error fetching flowers:', response.status);
      return [];
    }
  } catch (error) {
    console.error('Error fetching flowers:', error);
    return [];
  }
}
