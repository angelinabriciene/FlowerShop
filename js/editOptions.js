document.getElementById('createType').addEventListener('click', function () {
    if (!document.getElementById('newTypeInput')) {
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.id = 'newTypeInput';
        inputField.className = 'form-control';
        inputField.placeholder = 'Įveskite tipo pavadinimą';

        const saveButton = document.createElement('button');
        saveButton.type = 'button';
        saveButton.className = 'btn btn-outline-success';
        saveButton.innerText = 'Išsaugoti';
        saveButton.addEventListener('click', createType);

        const inputContainer = document.getElementById('typeInputContainer');
        inputContainer.appendChild(inputField);
        inputContainer.appendChild(saveButton);
    }
});

document.getElementById('createColor').addEventListener('click', function () {
    if (!document.getElementById('newColorInput')) {
        const inputField = document.createElement('input');
        inputField.color = 'text';
        inputField.id = 'newColorInput';
        inputField.className = 'form-control';
        inputField.placeholder = 'Įveskite naują spalvą';

        const saveButton = document.createElement('button');
        saveButton.color = 'button';
        saveButton.className = 'btn btn-outline-success';
        saveButton.innerText = 'Išsaugoti';
        saveButton.addEventListener('click', createColor);

        const inputContainer = document.getElementById('colorInputContainer');
        inputContainer.appendChild(inputField);
        inputContainer.appendChild(saveButton);
    }
});

try {
    document.getElementById("submitNewType").addEventListener("click", function (event) {
        saveType();
        event.preventDefault();
    });
} catch (Exception) { }

try {
    document.getElementById("submitNewColor").addEventListener("click", function (event) {
        saveColor();
        event.preventDefault();
    });
} catch (Exception) { }

fetchTypes();
fetchColors();
fetchPositions();

function showAlert(status) {
    const alertsContainer = document.getElementById('alert-message');
    alertsContainer.innerHTML = `
          <div class="alert alert-success">${status}.
          </div>
      `;
    setTimeout(() => {
        alertsContainer.innerHTML = '';
    }, 3000);
}

async function fetchTypes() {
    try {
        const response = await axios.get("http://localhost:8080/api/types");
        const types = response.data;
        const typeList = document.getElementById('typeList');
        typeList.innerHTML = '';

        types.forEach(type => {
            const typeRow = `
             <tr>
            <td>
                <a href="oneType.html?id=${type.id}">${type.name}</a>
            </td>
            <td>
                <button type="button" class="btn btn-outline-warning" data-id="${type.id}">Redaguoti</button>
                <button type="button" class="btn btn-outline-danger type-delete" data-id="${type.id}">Ištrinti</button>
            </td>
        </tr>
    `;
            typeList.insertAdjacentHTML('beforeend', typeRow);
        });

        document.querySelectorAll('.btn-outline-warning').forEach(button => {
            button.addEventListener('click', async function () {
                const typeId = this.getAttribute('data-id');
                const type = types.find(t => t.id === parseInt(typeId));

                if (!document.getElementById('newTypeInput')) {
                    const inputField = document.createElement('input');
                    inputField.type = 'text';
                    inputField.id = 'editTypeInput';
                    inputField.className = 'form-control';
                    inputField.placeholder = type.name;

                    const saveButton = document.createElement('button');
                    saveButton.type = 'button';
                    saveButton.className = 'btn btn-outline-success';
                    saveButton.innerText = 'Išsaugoti';

                    saveButton.addEventListener('click', () => updateType(typeId));

                    const inputContainer = document.getElementById('typeInputContainer');
                    inputContainer.appendChild(inputField);
                    inputContainer.appendChild(saveButton);
                }
            });
        });

        document.querySelectorAll('.type-delete').forEach(button => {
            button.addEventListener('click', async function () {
                const typeId = this.getAttribute('data-id');
                await deleteType(typeId);
            });
        });

    } catch (error) {
        console.error('Error fetching types:', error);
    }
}

async function fetchColors() {
    try {
        const response = await axios.get("http://localhost:8080/api/colors");
        const colors = response.data;
        const colorList = document.getElementById('colorList');
        colorList.innerHTML = '';

        colors.forEach(color => {
            const colorRow = `
                  <tr>
            <td>
                <a href="oneColor.html?id=${color.id}">${color.name}</a>
            </td>
            <td>
                <button type="button" class="btn btn-outline-warning" data-id="${color.id}">Redaguoti</button>
                <button type="button" class="btn btn-outline-danger color-delete" data-id="${color.id}">Ištrinti</button>
            </td>
        </tr>
    `;
            colorList.insertAdjacentHTML('beforeend', colorRow);
        });

        document.querySelectorAll('.btn-outline-warning').forEach(button => {
            button.addEventListener('click', async function () {
                const colorId = this.getAttribute('data-id');
                const color = colors.find(t => t.id === parseInt(colorId));

                if (!document.getElementById('newColorInput')) {
                    const inputField = document.createElement('input');
                    inputField.type = 'text';
                    inputField.id = 'editColorInput';
                    inputField.className = 'form-control';
                    inputField.placeholder = color.name;

                    const saveButton = document.createElement('button');
                    saveButton.type = 'button';
                    saveButton.className = 'btn btn-outline-success';
                    saveButton.innerText = 'Išsaugoti';

                    saveButton.addEventListener('click', () => updateColor(colorId));

                    const inputContainer = document.getElementById('colorInputContainer');
                    inputContainer.appendChild(inputField);
                    inputContainer.appendChild(saveButton);
                }
            });
        });

        document.querySelectorAll('.color-delete').forEach(button => {
            button.addEventListener('click', async function () {
                const colorId = this.getAttribute('data-id');
                await deleteColor(colorId);
            });
        });

    } catch (error) {
        console.error('Error fetching types:', error);
    }
}

async function fetchPositions() {
    try {
        const response = await axios.get("http://localhost:8080/api/planting_positions");
        const positions = response.data;
        const positionList = document.getElementById('positionList');
        positionList.innerHTML = '';

        positions.forEach(position => {
            const positionRow = `
                  <tr>
            <td>
                <a href="onePosition.html?id=${position.id}">${position.name}</a>
            </td>
            <td>
                <button type="button" class="btn btn-outline-warning">Redaguoti</button>
                <button type="button" class="btn btn-outline-danger">Ištrinti</button>
            </td>
        </tr>
    `;
            positionList.insertAdjacentHTML('beforeend', positionRow);
        });
    } catch (error) {
        console.error('Error fetching types:', error);
    }
}

async function createType() {
    const name = document.getElementById('newTypeInput').value;

    const type = {
        name
    };

    try {
        await axios.post('http://localhost:8080/api/types', type);
        fetchTypes();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        showAlert("Naujas tipas išsaugotas");
        const inputContainer = document.getElementById('typeInputContainer');
        inputContainer.innerHTML = '';
    } catch (error) {
        console.error('Error saving flower:', error);
    }
}

async function deleteType(typeId) {
    try {
        await axios.delete(`${'http://localhost:8080/api/types'}/${typeId}`);
        fetchTypes();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        showAlert("Tipas ištrintas");
    } catch (error) {
        console.error('Error deleting color:', error);

        if (error.response) {
            if (error.response.status === 409) {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                showAlert("Negalima ištrinti tipo, nes jis turi susijusių gėlių.");
            } else {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                showAlert("Įvyko klaida, bandykite dar kartą.");
            }
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            showAlert("Įvyko klaida, bandykite dar kartą.");
        }
    }
}

async function updateType(typeId) {
    const apiUrl = 'http://localhost:8080/api/types';
    const name = document.getElementById('editTypeInput').value;
    try {
        await axios.put(`${apiUrl}/${typeId}`, { name: name }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        fetchTypes();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        showAlert("Tipas redaguotas");
        const inputContainer = document.getElementById('typeInputContainer');
        inputContainer.innerHTML = '';
    } catch (error) {
        console.error('Error updating type:', error);
    }
}

async function createColor() {
    const name = document.getElementById('newColorInput').value;

    const color = {
        name
    };

    try {
        await axios.post('http://localhost:8080/api/colors', color);
        fetchColors();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        showAlert("Nauja spalva išsaugota");
        const inputContainer = document.getElementById('colorInputContainer');
        inputContainer.innerHTML = '';
    } catch (error) {
        console.error('Error saving flower:', error);
    }
}

async function deleteColor(colorId) {
    try {
        await axios.delete(`${'http://localhost:8080/api/colors'}/${colorId}`);
        fetchColors();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        showAlert("Spalva ištrinta");
    } catch (error) {
        console.error('Error deleting color:', error);

        if (error.response && error.response.status === 409) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            showAlert("Negalima ištrinti spalvos, nes ji turi susijusių gėlių.");
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            showAlert("Įvyko klaida, bandykite dar kartą.");
        }
    }
}

async function updateColor(colorId) {
    const apiUrl = 'http://localhost:8080/api/colors';
    const name = document.getElementById('editColorInput').value;
    try {
        await axios.put(`${apiUrl}/${colorId}`, { name: name }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        fetchColors();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        showAlert("Spalva redaguota");
        const inputContainer = document.getElementById('colorInputContainer');
        inputContainer.innerHTML = '';
    } catch (error) {
        console.error('Error updating color:', error);
    }
}