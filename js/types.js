const apiUrl = 'http://localhost:8080/api/flowers';

let currentPage = 1;
const itemsPerPage = 6;

fetchFlowers();
fetchTypes();

async function fetchFlowers() {
    const typeId = new URLSearchParams(window.location.search).get('id');
    try {
        const response = await axios.get(`http://localhost:8080/api/types/${typeId}`);
        const type = response.data;
        const flowers = type.flowers;

        const typeHeader = document.getElementById('typeHeader');
        typeHeader.innerHTML = `<h2>${type.name}</h2>`;

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
                    <a class="nav-link" href="oneType.html?id=${type.id}">${type.name}</a>
                </li>
            `;
            typeList.insertAdjacentHTML('beforeend', typeRow);
        });
    } catch (error) {
        console.error('Error fetching types:', error);
    }
}
