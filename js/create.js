const apiUrl = 'http://localhost:8080/api/flowers';

try {
    document.getElementById("submitNewFlower").addEventListener("click", function (event) {
        saveFlower();
        event.preventDefault();
    });
} catch (Exception) { }

window.onload = function () {
    populateColors();
    populateTypes();
};

async function populateColors() {
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

async function populateTypes() {
    try {
        const typesResponse = await axios.get('http://localhost:8080/api/types');
        const types = typesResponse.data;

        const flowerTypeSelect = document.getElementById('flowerType');
        flowerTypeSelect.innerHTML = '<option selected>Augalo tipas</option>';

        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type.id;
            option.textContent = type.name;
            flowerTypeSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching types:', error);
    }
}

async function saveFlower() {
    const name = document.getElementById('flowerName').value;
    const plant = document.getElementById('plant').value;
    const family = document.getElementById('descriptionNew').value;
    const price = document.getElementById('price').value;
    const perennial = document.querySelector('input[name="exampleRadios"]:checked').value;
    const typeId = document.getElementById('flowerType').value;
    const plantingPositionId = document.getElementById('flowerPosition').value;

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
        type: { id: Number(typeId) },
        colorIds,
        plantingPositionId
    };
    
    try {
        await axios.post(apiUrl, flower);
        window.location.href = "http://127.0.0.1:5500/view/homePage.html?info=u";
        showAlert("Išsaugota");
    } catch (error) {
        console.error('Error saving flower:', error);
    }
}