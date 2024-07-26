const apiUrl = 'http://localhost:8080/api/flowers';

try {
    document.getElementById("submitNewFlower").addEventListener("click", function (event) {
        saveFlower();
        event.preventDefault();
    });
} catch (Exception) { }

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
    let color = [];
    const colorOptions = document.querySelectorAll('[id^="flowerColorOption"]');
    colorOptions.forEach((option) => {
        if (option.checked) {
            color.push(option.value);
        }
    });
    const colorString = color.join(',');
    const plantingPositionId = document.getElementById('flowerPosition').value;

    const type = document.getElementById('flowerType').value;
    const flower = {
        name,
        plant,
        family,
        price,
        perennial,
        type: { id: type },
        colorId: color.length > 0 ? color[0] : null,
        plantingPositionId
    };
    console.log(flower);
    try {
        await axios.post(apiUrl, flower);
        window.location.href = "http://127.0.0.1:5500/view/homePage.html?info=u";
        showAlert(" išsaugota")
    } catch (error) {
        console.error('Error saving flower:', error);
    }
}