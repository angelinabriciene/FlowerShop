fetchTypes();
fetchColors();
fetchPositions();

async function fetchTypes() {
    try {
        const response = await axios.get("http://localhost:8080/api/types");
        const types = response.data;
        const typeList = document.getElementById('typeList');
        typeList.innerHTML = '';

        types.forEach(type => {
            const typeRow = `
                  <tr>
          <td></td>
          <td>${type.name}
          <button type="button" class="btn btn-outline-warning">Redaguoti</button>
          <button type="button" class="btn btn-outline-danger">Ištrinti</button>
          </td>
          <td></td>
        </tr>
      `;
            typeList.insertAdjacentHTML('beforeend', typeRow);
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
          <td></td>
          <td>${color.name}
          <button type="button" class="btn btn-outline-warning">Redaguoti</button>
          <button type="button" class="btn btn-outline-danger">Ištrinti</button>
          </td>
          <td></td>
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
          <td></td>
          <td>${position.name}
          <button type="button" class="btn btn-outline-warning">Redaguoti</button>
          <button type="button" class="btn btn-outline-danger">Ištrinti</button>
          </td>
          <td></td>
        </tr>
      `;
            positionList.insertAdjacentHTML('beforeend', positionRow);
        });
    } catch (error) {
        console.error('Error fetching types:', error);
    }
}