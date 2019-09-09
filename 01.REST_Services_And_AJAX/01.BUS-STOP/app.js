function getInfo() {
    let inputElement = document.getElementById('stopId');
    const url = `https://judgetests.firebaseio.com/businfo/${inputElement.value}.json`;
    let busesInfo = document.getElementById('buses');

    function fillBusInfo(data) {
        document.getElementById('stopName').textContent = data.name;
        busesInfo.innerHTML = '';

        let busesArray = Object.entries(data.buses);

        for (let [busNumber, busTime] of busesArray) {
            let li = document.createElement('li');
            li.textContent = `Bus ${busNumber} arrives in ${busTime} minutes.`;

            busesInfo.appendChild(li);
        }

        inputElement.value = '';
    }

    function handleError() {
        document.getElementById('stopName').textContent = 'Error';
        inputElement.value = '';
    }

    fetch(url)
        .then((info) => info.json())
        .then((data) => {
                fillBusInfo(data);
            }
        ).catch(() => handleError())
}