const constants = {
    username: 'guest',
    password: 'guest',
    appKey: 'kid_B1i8tCzfH',
    appSecret: '8c6ccf72a9f04327850a5e2a75a74c3c',
    baseUrl: 'https://baas.kinvey.com/appdata/kid_B1i8tCzfH/books',
};

const auth = {
    'Authorization': 'Basic ' + btoa(`${constants.kinveyUsername}:${constants.kinveyPassword}`),
    'Content-type': 'application/json',
};


const elements = {
    submitBtn: document.getElementById("submitBtn"),
    loadBooksBtn: document.getElementById('loadBooks'),
    inputTitle: document.getElementById('title'),
    inputAuthor: document.getElementById('author'),
    inputIsbn: document.getElementById('isbn'),
    tBodyBooks: document.getElementsByClassName('tbodyBooks')[0],
    h3form: document.getElementById('formHeader'),
};

elements.submitBtn.addEventListener('click', addBook);
elements.loadBooksBtn.addEventListener('click', loadBooks);

function addBook(ev) {
    ev.preventDefault();

    let title = elements.inputTitle.value;
    let author = elements.inputAuthor.value;
    let isbn = elements.inputIsbn.value;

    let dataObj = {};

    if (title && author && isbn) {
        dataObj = {
            title: title,
            author: author,
            isbn: isbn,
        };
    }
    const headers = {
        method: 'POST',
        body: JSON.stringify(dataObj),
        credentials: 'include',
        headers: auth,
    };

    fetch(constants.baseUrl, headers)
        .then(handler)
        .then(loadBooks)
        .then(clearForm);
}

function loadBooks() {

    const headers = {
        auth,
        credentials: 'include',
    };

    fetch(constants.baseUrl, headers)
        .then(handler)
        .then((data) => {
            elements.tBodyBooks.innerHTML = '';

            data.forEach((book) => {
                    const [id, isbn, author, title] = Object.values(book);
                    const currTableRow = createTableRow(title, author, isbn, id);

                    elements.tBodyBooks.appendChild(currTableRow);
                }
            )
        });

    elements.tBodyBooks.addEventListener('click', editOtDeleteBook);
}

function createTableRow(title, author, isbn, id) {
    let tr = document.createElement('tr');

    tr.innerHTML = `<td>${title}</td>
                <td>${author}</td>
                <td>${isbn}</td>
                <td>
                    <button>Edit</button>
                    <button>Delete</button>
                </td>`;

    tr.setAttribute('id', id);

    return tr;
}


function editOtDeleteBook(ev) {
    const element = ev.target;

    if (element.textContent === 'Delete') {
        deleteBook(element);
    } else if (element.textContent === 'Edit') {
        editBook(element);
    }
}

function deleteBook(element) {
    const book = element.parentNode.parentNode;
    const bookId = book.getAttribute('id');
    const deleteUrl = constants.baseUrl + '/' + bookId;

    let body = {};

    fetch(deleteUrl, {
        method: 'DELETE',
        body: JSON.stringify(body),
        credentials: 'include',
        headers: auth,
    })
        .then(handler)
        .then(response => {
            if (response) {
                book.remove();
            }
        })
}

function editBook(element) {
    const book = element.parentNode.parentNode;
    const bookId = book.getAttribute('id');
    const editUrl = constants.baseUrl + '/' + bookId;

    elements.inputTitle.value = book.getElementsByTagName('td')[0].textContent;
    elements.inputAuthor.value = book.getElementsByTagName('td')[1].textContent;
    elements.inputIsbn.value = book.getElementsByTagName('td')[2].textContent;

    const editButton = book.getElementsByTagName('button')[0];


    editButton.addEventListener('click', () => {


        const newTitle = elements.inputTitle.value;
        const newAuthor = elements.inputAuthor.value;
        const newIsbn = elements.inputIsbn.value;

        if (newTitle && newAuthor && newIsbn) {
            const body = {
                title: newTitle,
                author: newAuthor,
                isbn: newIsbn,
            };

            fetch(editUrl, {
                method: 'PUT',
                body: JSON.stringify(body),
                credentials: 'include',
                headers: auth,
            })
                .then(handler)
                .then(loadBooks)
                .then(clearForm);
        }
    });
}

function handler(response) {
    if (response.status > 400) {
        throw new Error(`Something went wrong. Error: ${response.statusText}`)
    }

    return response.json();
}

function clearForm() {
    elements.inputTitle.value = '';
    elements.inputAuthor.value = '';
    elements.inputIsbn.value = '';
}