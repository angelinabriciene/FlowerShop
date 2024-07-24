async function fetchFlowerData() {

    console.log("fech flowerD pasiekta");

    const flowerId = new URLSearchParams(window.location.search).get('id');

    console.log("fech id ", flowerId);

    try {
        
        const response = await axios.get(`http://localhost:8080/api/flowers/${flowerId}`);
        const flower = response.data;

        localStorage.setItem('flowerData', JSON.stringify(flower));

        console.log(flower);

        fillForm(flowerId);

    } catch (error) {
        console.error('Error fetching flower:', error);
    }
}

function fillForm() {
    const flowerId = new URLSearchParams(window.location.search).get('id');

    console.log("ID ", flowerId);

    const flowerData = localStorage.getItem('flowerData');

    console.log("gele: ", flowerData);

    if (!flowerData) {
        console.error('No flower data found in local storage');
        return;
    }
    const flower = JSON.parse(flowerData);
    populateForm(flower);

    document.getElementById("submitUpdatedFlower").addEventListener("click", function (event) {
        saveFlower(flowerId);
        event.preventDefault();
    });
}
window.onload = async function () {
    await fetchFlowerData();
    fillForm();
};



function populateForm(flower) {
    document.getElementById('updatedflowerName').value = flower.name;
    document.getElementById('updatedplant').value = flower.plant;
    document.getElementById('updateddescription').value = flower.family;
    document.getElementById('updatedprice').value = flower.price;

    if (flower.perennial) {
        document.getElementById('updatedperennialOption').checked = true;
    } else {
        document.getElementById('updatedannualOption').checked = true;
    }

    document.getElementById("updatedflowerType").value = flower.typeId;

    const colorCheckboxes = document.querySelectorAll('.form-check-input[type="checkbox"]');
    colorCheckboxes.forEach((checkbox) => {
        if (checkbox.value === flower.colorId.toString()) {
            checkbox.checked = true;
        }
    });
    document.getElementById("updatedflowerPosition").value = flower.plantingPositionId;

    document.getElementById("submitUpdatedFlower").addEventListener("click", function (event) {
        saveFlower(flowerId);
        event.preventDefault();
    });
}

async function saveFlower() {
    const flowerId = new URLSearchParams(window.location.search).get('id');
    const name = document.getElementById('updatedflowerName').value;
    const plant = document.getElementById('updatedplant').value;
    const family = document.getElementById('updateddescription').value;
    const price = document.getElementById('updatedprice').value;
    let perennial;
    const perennialRadios = document.getElementsByName('exampleRadios');
    for (let i = 0; i < perennialRadios.length; i++) {
        if (perennialRadios[i].checked) {
            perennial = perennialRadios[i].value;
            break;
        }
    }
    const type = document.getElementById('updatedflowerType').value;
    let color = [];
    const colorOptions = document.querySelectorAll('[id^="flowerColorOption"]');
    colorOptions.forEach((option) => {
        if (option.checked) {
            color.push(option.value);
        }
    });
    const colorString = color.join(',');
    const plantingPositionId = document.getElementById('updatedflowerPosition').value;

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
            console.log('saveFlower iškviesta id:', flowerId);
            await axios.put(`${apiUrl}/${flowerId}`, flower);
        
        window.location.href = "http://127.0.0.1:5500/view/homePage.html";
    } catch (error) {
        console.error('Error saving flower:', error);
    }
}