function attachEvents() {
    const btnCreate = document.getElementById('btnCreate');
    let personInput = document.getElementById("person");
    let phoneInput = document.getElementById("phone");
    const btnLoad = document.getElementById('btnLoad');
    const phoneBookList = document.getElementById('phonebook');
    const baseUrl = 'https://phonebook-nakov.firebaseio.com/phonebook.json';

    function load() {
        fetch(baseUrl)
            .then(req => req.json())
            .then(data => displayContacts(data))
    }

    function displayContacts(contacts) {
        phoneBookList.innerHTML = '';

        Object
            .entries(contacts)
            .forEach(([id, contact]) => {
                let listItem = document.createElement('li');

                listItem.textContent = `${contact.person}: ${contact.phone} `;

                let deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.setAttribute("id", id);
                deleteBtn.addEventListener("click", deleteContact);

                listItem.appendChild(deleteBtn);

                phoneBookList.appendChild(listItem);
            })
    }

    function create() {
        const person = personInput.value;
        const phone = phoneInput.value;

        const data = {
            person,
            phone
        };

        fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(x => x.json())
            .then(x => {
                load()
            })
    }

    function deleteContact(ev) {
        fetch(baseUrl, {
            method: 'DELETE'
        })
            .then(x => x.json())
            .then(x => load())
            .catch(handleError);
    }


    function handleError(err) {
        alert('Error!');
    }

    btnLoad.addEventListener("click", load);


    btnCreate.addEventListener("click", create);


}

attachEvents();