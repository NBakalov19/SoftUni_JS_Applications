function attachEvents() {

    const elements = {
        inputField: document.getElementById('location'),
        submitButton: document.getElementById('submit'),
        forecast: document.getElementById('forecast'),
        current: document.getElementById('current'),
        upcoming: document.getElementById('upcoming'),
    };

    const urls = {
        url: 'https://judgetests.firebaseio.com/locations.json',
        baseCurrentConditionUrl: 'https://judgetests.firebaseio.com/forecast/today/',
        baseUpcomingConditionsUrl: 'https://judgetests.firebaseio.com/forecast/upcoming/',
    };

    const symbols = {
        sunny: '☀',
        partlySunny: '⛅',
        overcast: '☁',
        rain: '☂',
        degrees: '°',
    };

    elements.submitButton.addEventListener('click', loadWeatherInfo);

    function loadWeatherInfo() {


        fetch(urls.url)
            .then(handler)
            .then(loadLocationWeatherInfo);
    }

    function loadLocationWeatherInfo(data) {
        const inputFieldValue = elements.inputField.value;
        if (!inputFieldValue) {
            return;
        }
        let location = data.filter((o) => o.name === inputFieldValue)[0];

        const fullCurrentConditionUrl = urls.baseCurrentConditionUrl + location.code + '.json';

        fetch(fullCurrentConditionUrl)
            .then(handler)
            .then((data) => showLocationCurrentWeather(data, location.code));
    }


    function showLocationCurrentWeather(data, code) {

        elements.current.innerHTML = '<div class="label">Current conditions</div>';

        elements.forecast.style.display = 'block';

        let divForecast = createHtmlElement('div', 'forecast');

        const currSymbol = symbols[data.forecast.condition.toLowerCase()];

        const spanSymbol =
            createHtmlElement('span', ['condition', 'symbol'], currSymbol);

        let spanCondition = createHtmlElement('span', 'condition');

        const currLocation = data.name;
        const spanLocation = createHtmlElement('span', 'forecast-data', currLocation);

        const degrees = `${data.forecast.low}${symbols.degrees}/${data.forecast.high}${symbols.degrees}`;
        const spanTemperatures = createHtmlElement('span', 'forecast-data', degrees);

        const currCondition = data.forecast.condition;
        const spanCurrentCondition = createHtmlElement('span', 'forecast-data', currCondition);

        spanCondition = appendChildren([spanLocation, spanTemperatures, spanCurrentCondition], spanCondition);

        divForecast = appendChildren([spanSymbol, spanCondition], divForecast);

        elements.current.appendChild(divForecast);

        loadLocationUpcomingWeatherInfo(code);
    }

    function loadLocationUpcomingWeatherInfo(code) {
        const fullUpcomingConditionUrl = urls.baseUpcomingConditionsUrl + code + '.json';

        fetch(fullUpcomingConditionUrl)
            .then(handler)
            .then(showLocationUpcomingWeather)


    }

    function showLocationUpcomingWeather(data) {

        elements.upcoming.innerHTML = '<div class="label">Three-day forecast</div>';

        const divForecastInfo = createHtmlElement('div', 'forecast-info');

        data.forecast.forEach((o) => {
            const spanHolder = createHtmlElement('span', 'upcoming');

            const currSymbol = symbols[o.condition.toLowerCase()] || symbols['partlySunny'];
            const spanSymbol = createHtmlElement('span', 'symbol', currSymbol);

            const degrees = `${o.low}${symbols.degrees}/${o.high}${symbols.degrees}`;
            const spanTemperatures = createHtmlElement('span', 'upcoming', degrees);


            const spanCondition = createHtmlElement('span', 'upcoming', o.condition);

            divForecastInfo.appendChild(
                appendChildren([spanSymbol, spanTemperatures, spanCondition], spanHolder));

        });

        elements.upcoming.appendChild(divForecastInfo);
    }

    function createHtmlElement(tagName, className, textContent) {
        let currElement = document.createElement(tagName);

        if (className) {
            if (typeof className === 'string') {
                currElement.classList.add(className);
            } else if (typeof className === 'object') {
                currElement.classList.add(...className);
            }
        }

        if (textContent) {
            currElement.textContent = textContent;
        }

        return currElement;
    }

    function appendChildren(children, parent) {
        children.forEach((child) => parent.appendChild(child));

        return parent;
    }

    function handler(response) {

        if (response.status > 400) {
            elements.forecast.innerHTML = '';
            elements.forecast.appendChild(createHtmlElement('div', 'error', 'ERROR'));
            elements.forecast.style.display = 'block';
            throw new Error(`Something went wrong. Error: ${response.statusText}`)
        }

        return response.json();
    }
}

attachEvents();