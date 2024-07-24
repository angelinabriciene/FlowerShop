const apiUrl = 'http://localhost:8080/api/flowers';

if (window.location.href.includes("homePage")) {
    fetchFlowers();
}

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
const itemsPerPage = 5;

async function fetchFlowers() {
    try {
        const response = await axios.get(apiUrl);
        const flowers = response.data;
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

async function displayFlowerInfo() {
    const flowerId = new URLSearchParams(window.location.search).get('id');
    try {
        const response = await axios.get(`http://localhost:8080/api/flowers/${flowerId}`);
        const flower = response.data;
        const flowerInfo = document.getElementById('flower-info');
        flowerInfo.innerHTML = `
                    <div class="flower-container">
                        <img class="flower-image" src="green.jpg">
                        <div class="flower-details">
                        <h2>${flower.name}, ${flower.plant}</h2>
                        <p>Kaina: ${flower.price} €</p>
                        <p>Aprašas: ${flower.family}</p>
                        <p>Spalva: ${flower.colorId}</p>
                        <a href="./update.html?id=${flower.id}" class="btn btn-warning">Redaguoti</a>
                        <button class="btn btn-danger" id="deleteFlower">Ištrinti</button>
                        </div>
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
    const type = document.getElementById('flowerType').value;
    let color = [];
    const colorOptions = document.querySelectorAll('[id^="flowerColorOption"]');
    colorOptions.forEach((option) => {
        if (option.checked) {
            color.push(option.value);
        }
    });
    const colorString = color.join(',');
    const plantingPositionId = document.getElementById('flowerPosition').value;

    const flower = {
        name,
        plant,
        family,
        price,
        perennial,
        typeId: type,
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
    console.log("pasirodyk");
    showAlert(" ištrinta");
}

if (window.location.href.includes("info=u")) {
    console.log("pasirodyk");
    showAlert(" išsaugota");
}