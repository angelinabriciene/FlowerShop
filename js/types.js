const apiUrl = 'http://localhost:8080/api/flowers';

let currentPage = 1;
const itemsPerPage = 9;

fetchFlowers();
fetchTypes();

const filterInput = document.getElementById('filter');
const applyFilterButton = document.getElementById('apply-filter');

applyFilterButton.addEventListener('click', applyFilter);

async function fetchFlowers() {
    const typeId = new URLSearchParams(window.location.search).get('id');
    try {
        const response = await axios.get(`http://localhost:8080/api/types/${typeId}`);
        const type = response.data;
        const flowers = type.flowers;

        const totalItemCount = flowers.length;
        const typeHeader = document.getElementById('typeHeader');
        typeHeader.innerHTML = `<h2>${type.name} (${totalItemCount})</h2>`;

        const flowerList = document.getElementById('flower-list');
        flowerList.innerHTML = '';

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
                fetchFlowers();
            });
            paginationButtons.appendChild(button);
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

async function fetchTypes() {
    try {
        const response = await axios.get("http://localhost:8080/api/types");
        const types = response.data;
        const typeList = document.getElementById('menuSideBar');
        typeList.innerHTML = '';

        types.forEach(type => {
            const typeRow = `
                <li class="nav-item">
                    <a class="nav-link" href="oneType.html?id=${type.id}">₰ ${type.name}</a>
                </li>
            `;
            typeList.insertAdjacentHTML('beforeend', typeRow);
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
