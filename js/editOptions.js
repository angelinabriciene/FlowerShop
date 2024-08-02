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

        const inputContainer = document.getElementById('inputContainer');
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
                <button type="button" class="btn btn-outline-danger" data-id="${type.id}">Ištrinti</button>
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

                    const inputContainer = document.getElementById('inputContainer');
                    inputContainer.appendChild(inputField);
                    inputContainer.appendChild(saveButton);
                }
            });
        });

        document.querySelectorAll('.btn-outline-danger').forEach(button => {
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
                <button type="button" class="btn btn-outline-warning">Redaguoti</button>
                <button type="button" class="btn btn-outline-danger">Ištrinti</button>
            </td>
        </tr>
    `;
            colorList.insertAdjacentHTML('beforeend', colorRow);
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
        const inputContainer = document.getElementById('inputContainer');
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
        console.error('Error deleting author:', error);

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
        const inputContainer = document.getElementById('inputContainer');
        inputContainer.innerHTML = '';
    } catch (error) {
        console.error('Error updating type:', error);
    }
}
