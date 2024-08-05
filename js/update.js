window.onload = async function () {
    await fetchFlowerData();
    fillForm();
};

async function fetchFlowerData() {
    const flowerId = new URLSearchParams(window.location.search).get('id');
    try {
        const response = await axios.get(`http://localhost:8080/api/flowers/${flowerId}`);
        const flower = response.data;
        localStorage.setItem('flowerData', JSON.stringify(flower));
        fillForm();

    } catch (error) {
        console.error('Error fetching flower:', error);
    }
}

function fillForm() {
    const flowerData = localStorage.getItem('flowerData');
    if (!flowerData) {
        console.error('No flower data found in local storage');
        return;
    }
    const flower = JSON.parse(flowerData);
    populateForm(flower);

    document.getElementById("submitUpdatedFlower").addEventListener("click", function (event) {
        event.preventDefault();
        saveFlower();
    });
    console.log(flower);
}

async function populateForm(flower) {
    document.getElementById('updatedflowerName').value = flower.name;
    document.getElementById('updatedplant').value = flower.plant;
    document.getElementById('updateddescription').value = flower.family;
    document.getElementById('updatedprice').value = flower.price;

    if (flower.perennial) {
        document.getElementById('updatedperennialOption').checked = true;
    } else {
        document.getElementById('updatedannualOption').checked = true;
    }

    try {
        const typesResponse = await axios.get('http://localhost:8080/api/types');
        const types = typesResponse.data;

        const typesContainer = document.getElementById('typesContainer');
        typesContainer.innerHTML = '';

        const selectElement = document.createElement('select');
        selectElement.id = 'updatedflowerType';
        selectElement.className = 'form-control';
        typesContainer.appendChild(selectElement);

        const defaultOption = document.createElement('option');
        defaultOption.selected = true;
        defaultOption.disabled = true;
        defaultOption.textContent = flower.type.name;
        selectElement.appendChild(defaultOption);

        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type.id;
            option.textContent = type.name;
            if (type.id === flower.type.id) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        });

    } catch (error) {
        console.error('Error fetching types:', error);
    }

    try {
        const positionsResponse = await axios.get('http://localhost:8080/api/planting_positions');
        const positions = positionsResponse.data;

        const positionsContainer = document.getElementById('positionsContainer');
        positionsContainer.innerHTML = '';

        const selectElement = document.createElement('select');
        selectElement.id = 'updatedflowerPosition';
        selectElement.className = 'form-control';
        positionsContainer.appendChild(selectElement);

        const defaultOption = document.createElement('option');
        defaultOption.selected = true;
        defaultOption.disabled = true;
        defaultOption.textContent = flower.position;
        selectElement.appendChild(defaultOption);

        positions.forEach(position => {
            const option = document.createElement('option');
            option.value = position.id;
            option.textContent = position.name;
            if (position.id === flower.plantingPositionId) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        });

    } catch (error) {
        console.error('Error fetching positions:', error);
    }

    try {
        const colorsResponse = await axios.get('http://localhost:8080/api/colors');
        const colors = colorsResponse.data;

        const colorsContainer = document.getElementById('colorsContainer');
        colorsContainer.innerHTML = '';

        colors.forEach(color => {

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `colorOption${color.id}`;
            checkbox.value = color.id;
            checkbox.className = 'form-check-input';
            if (flower.colors && flower.colors.some(flowerColor => flowerColor.id === color.id)) {
                checkbox.checked = true;
            }

            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = color.name;

            colorsContainer.appendChild(checkbox);
            colorsContainer.appendChild(label);
            colorsContainer.appendChild(document.createElement('br'));

        });
    } catch (error) {
        console.error('Error fetching colors:', error);
    }
}

async function saveFlower() {
    const apiUrl = 'http://localhost:8080/api/flowers';
    const flowerId = new URLSearchParams(window.location.search).get('id');
    const name = document.getElementById('updatedflowerName').value;
    const plant = document.getElementById('updatedplant').value;
    const family = document.getElementById('updateddescription').value;
    const price = document.getElementById('updatedprice').value;
    const perennial = document.querySelector('input[name="exampleRadios"]:checked').value;
    const typeId = Number(document.getElementById('updatedflowerType').value);
    const plantingPositionId = document.getElementById('updatedflowerPosition').value;

    const colorIds = [];
    document.querySelectorAll('.form-check-input[type="checkbox"]:checked').forEach(checkbox => {
        colorIds.push(Number(checkbox.value));
    });

    const flower = {
        name,
        plant,
        family,
        price,
        perennial,
        type: { id: typeId },
        colorIds,
        plantingPositionId
    };

    try {
        await axios.put(`${apiUrl}/${flowerId}`, flower);
        window.location.href = "http://127.0.0.1:5500/view/homePage.html?info=u";
    } catch (error) {
        console.error('Error saving flower:', error);
    }
}
