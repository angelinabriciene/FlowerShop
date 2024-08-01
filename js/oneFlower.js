const apiUrl = 'http://localhost:8080/api/flowers';

displayFlowerInfo();
fetchTypes();

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

async function deleteFlower() {
    const flowerId = new URLSearchParams(window.location.search).get('id');
    try {
        await axios.delete(`${apiUrl}/${flowerId}`);
        window.location.href = "http://127.0.0.1:5500/view/homePage.html?info=d";

    } catch (error) {
        console.error('Error deleting author:', error);
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