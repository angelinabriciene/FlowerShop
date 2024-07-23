const apiUrl = 'http://localhost:8080/api/flowers';

if (window.location.href.includes("homePage")) {
    fetchFlowers();
}

document.getElementById("submitNewFlower").addEventListener("click", function (event) {
    saveFlower();
    event.preventDefault();
});

function showAlert(message) {
    let alertMessage = document.getElementById("alert-message");
    alertMessage.textContent = message;
    alertMessage.classList.add("show");
    setTimeout(function () {
        alertMessage.classList.remove("show");
    }, 3000);
}

async function fetchFlowers() {
    try {
        const response = await axios.get(apiUrl);
        const flowers = response.data;
        const flowerList = document.getElementById('flower-list');
        flowerList.innerHTML = '';

        flowers.forEach(flower => {
            const flowerRow = `
            <a href="oneFlower.html?id=${flower.id}">
                <div class="card" style="width: 18rem;">
                    <img class="card-img-top" src="green.jpg" alt="Card image cap">
                     <div class="card-body">
                     <p id="flowerName" class="card-text">${flower.name}</p>
                    <p id="flowerPrice" class="card-text"> Kaina: ${flower.price} €</p>
                </div>
            </div>
        </a>
     `;
            flowerList.insertAdjacentHTML('beforeend', flowerRow);
        });
    } catch (error) {
        console.error('Error fetching flowers:', error);
    }
}

async function displayFlowerInfo() {
    const flowerId = new URLSearchParams(window.location.search).get('id');
    try {
        const response = await axios.get(`http://localhost:8080/api/flowers/${flowerId}`);
        const flower = response.data;
        const flowerInfo = document.getElementById('flower-info');
        flowerInfo.innerHTML = `
          <img src="green.jpg">
          <h2>${flower.name}, ${flower.latinName}</h2>
          <p>Aprašas?: ${flower.family}</p>
          <p>Kaina: ${flower.price} €</p>
          <button class="btn btn-warning" id="updateFlower">Atnaujinti</button>
          <button class="btn btn-danger" id="deleteFlower">Ištrinti</button>
        `;
        const updateButton = document.getElementById('updateFlower');
        updateButton.addEventListener('click', async () => {
            fetchFlowerData();
        });

        const deleteButton = document.getElementById('deleteFlower');
        deleteButton.addEventListener('click', async () => {
            deleteFlower();
        });
    } catch (error) {
        console.error('Error fetching flower:', error);
    }
}

async function fetchFlowerData() {
    const flowerId = new URLSearchParams(window.location.search).get('id');
    try {
        const response = await axios.get(`http://localhost:8080/api/flowers/${flowerId}`);
        const flower = response.data;

        localStorage.setItem('flowerData', JSON.stringify(flower));

        console.log(flower);

        window.location.href = "http://127.0.0.1:5500/update.html";

    } catch (error) {
        console.error('Error fetching flower:', error);
    }
}
document.addEventListener('DOMContentLoaded', fillForm);

function fillForm() {
    const flowerId = new URLSearchParams(window.location.search).get('id');
            window.location.href = `http://127.0.0.1:5500/update.html?id=${flowerId}`;
    const flowerData = localStorage.getItem('flowerData');

console.log(flowerData);

    if (flowerData) {
        const flower = JSON.parse(flowerData);

        document.getElementById('updatedflowerName').value = flowerData.name;
        document.getElementById('updatedlatinName').value = flowerData.latinName;
        document.getElementById('updateddescription').value = flowerData.family;
        document.getElementById('updatedprice').value = flowerData.price;

        if (flowerData.perennial) {
            document.getElementById('updatedperennialOption').checked = true;
        } else {
            document.getElementById('updatedannualOption').checked = true;
        }

        const flowerTypeSelect = document.getElementById('updatedflowerType');
        flowerTypeSelect.text = flowerData.type;

        let color = [];
        const colorOptions = document.querySelectorAll('[id^="updatedflowerColorOption"]');
        colorOptions.forEach((option) => {
            if (option.checked) {
                color.push(option.value);
            }
        });
        const colorString = color.join(',');

        document.getElementById('updatedflowerPosition').value = flowerData.position;
    }
    document.getElementById("submitUpdatedFlower").addEventListener("click", function (event) {
        saveFlower(flowerId);
        event.preventDefault();
    });
}

async function saveFlower(flowerId) {
    const name = document.getElementById('flowerName').value;
    const latinName = document.getElementById('latinName').value;
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
        latinName,
        family,
        price,
        perennial,
        typeId: type,
        colorId: color.length > 0 ? color[0] : null,
        plantingPositionId
    };

    try {
        if (flowerId) {
            console.log('saveFlower iškviesta id:', flowerId);
            await axios.put(`${apiUrl}/${flowerId}`, flower);
        } else {
            await axios.post(apiUrl, flower);
        }

        window.location.href = "http://127.0.0.1:5500/homePage.html";
    } catch (error) {
        console.error('Error saving flower:', error);
    }
}

async function deleteFlower() {
    const flowerId = new URLSearchParams(window.location.search).get('id');
    try {
        await axios.delete(`${apiUrl}/${flowerId}`);
        window.location.href = "http://127.0.0.1:5500/homePage.html";
        alertMessage("Prekė ištrinta");
    } catch (error) {
        console.error('Error deleting author:', error);
    }
}
