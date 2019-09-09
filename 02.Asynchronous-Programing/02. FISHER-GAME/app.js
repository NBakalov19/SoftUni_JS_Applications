function attachEvents() {

    const elements = {
        loadBtn: document.querySelector('button.load'),
        createBtn: document.querySelector('button.add'),
        updateBtn: document.querySelector('button.update'),
        deleteBtn: document.querySelector('button.delete'),
        catches: document.getElementById('catches'),
    };

    const urls = {
        baseLoadAndCreateUrl: 'https://fisher-game.firebaseio.com/catches.json',
        baseUpdateAndDeleteUrl: 'https://fisher-game.firebaseio.com/catches/', //!!!{catchId}.json'
    };


    function loadAllCatches() {
        let defaultCatch = elements.catches.children[0];
        elements.catches.innerHTML = '';
        elements.catches.appendChild(defaultCatch);
        fetch(urls.baseLoadAndCreateUrl) //,{method: 'GET'}
            .then(handler)
            .then(showAllCatches)

    }

    function showAllCatches(data) {
        Object.keys(data)
            .forEach((key) => {

                let catchElement = elements.catches.children[0].cloneNode(true);

                catchElement.style.display = 'inline-block';

                catchElement.setAttribute('data-id', key);
                catchElement.querySelector('input.angler').value = data[key].angler;
                catchElement.querySelector('input.weight').value = data[key].weight;
                catchElement.querySelector('input.species').value = data[key].species;
                catchElement.querySelector('input.location').value = data[key].location;
                catchElement.querySelector('input.bait').value = data[key].bait;
                catchElement.querySelector('input.captureTime').value = data[key].captureTime;

                catchElement.querySelector('button.update').addEventListener('click', updateCatch);
                catchElement.querySelector('button.delete').addEventListener('click', deleteCatch);

                elements.catches.appendChild(catchElement);
            });

        function deleteCatch(ev) {
            let catchId = ev.currentTarget.parentNode.getAttribute('data-id');
            let catchElement = ev.currentTarget.parentNode;

            let url = urls.baseUpdateAndDeleteUrl + catchId + '.json';

            let headers = {
                method: 'DELETE',
            };

            fetch(url, headers)
                .then(handler)
                .then((data) => {
                    catchElement.remove();
                })

        }

        function updateCatch(ev) {
            let catchId = ev.currentTarget.parentNode.getAttribute('data-id');
            let catchElement = ev.currentTarget.parentNode;

            let newValues = Array.from(catchElement.children)
                .filter((element) => element.tagName === 'INPUT')
                .reduce((acc, curr) => {
                    let prop = curr.className;
                    acc[prop] = curr.value;
                    return acc;
                }, {});

            let headers = {
                method: 'PUT',
                body: JSON.stringify(newValues),
            };
            let url = urls.baseUpdateAndDeleteUrl + catchId + '.json';

            fetch(url, headers)
                .then(handler)
                .then(elements.loadBtn.click());

        }
    }

    elements.loadBtn.addEventListener('click', loadAllCatches);
    elements.createBtn.addEventListener('click', createCatch);

    function createCatch() {
        let catchElement = document.querySelector('fieldset#addForm');

        let newValues = Array.from(catchElement.children)
            .filter((element) => element.tagName === 'INPUT')
            .reduce((acc, curr) => {
                let prop = curr.className;
                acc[prop] = curr.value;
                return acc;
            }, {});

        let headers = {
            method: 'POST',
            body: JSON.stringify(newValues),
        };

        fetch(urls.baseLoadAndCreateUrl, headers)
            .then(handler)
            .then(elements.loadBtn.click)
    }

    function createHtmlElement(tagName, className, textContent, attribute) {
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

        if (attribute) {
            currElement.setAttribute(attribute.name, attribute.value);
        }

        return currElement;
    }

    function handler(response) {
        if (response.status > 400) {
            throw new Error(`Something went wrong. Error: ${response.statusText}`)
        }

        return response.json();
    }
}

attachEvents();

