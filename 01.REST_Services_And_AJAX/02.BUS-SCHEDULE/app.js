function solve() {

    let baseUrl = 'https://judgetests.firebaseio.com/schedule/';
    let currentStopId = 'depot';
    let currentStop = '';
    const span = document.querySelector('span.info');
    const departButton = document.getElementById('depart');
    const arriveButton = document.getElementById('arrive');

    function loadStop(data) {
        currentStop = data;
        span.textContent = `Next stop ${currentStop.name}`;
        currentStopId = currentStop.next;
        departButton.disabled = true;
        arriveButton.disabled = false;

    }

    function depart() {
        const url = baseUrl + currentStopId + '.json';

        fetch(url)
            .then((req) => req.json())
            .then((data) => loadStop(data))

    }

    function arrive() {
        span.textContent = `Arriving at ${currentStop.name}`;
        currentStopId = currentStop.next;
        departButton.disabled = false;
        arriveButton.disabled = true;
    }

    return {
        depart,
        arrive
    };
}

let result = solve();