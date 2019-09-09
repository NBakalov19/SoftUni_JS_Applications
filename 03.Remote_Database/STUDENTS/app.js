const constants = {
    username: 'guest',
    password: 'guest',
    appKey: 'kid_B1i8tCzfH',
    appSecret: '8c6ccf72a9f04327850a5e2a75a74c3c',
    baseUrl: 'https://baas.kinvey.com/appdata/kid_B1i8tCzfH/students',
};

const auth = {
    'Authorization': 'Basic ' + btoa(`${constants.username}:${constants.password}`),
};

const tableBody = document.querySelector('tbody');

function loadStudents() {


    fetch(constants.baseUrl, {
        headers: auth
    })
        .then(handler)
        .then(data => {

            data.sort((a, b) => a.ID - b.ID);

            data.forEach((student) => {
                const id = student.ID;
                const firstName = student.FirstName;
                const lastName = student.LastName;
                const facultyNumber = student.FacultyNumber;
                const grade = student.Grade;

                const newRow = createTableRow([id, firstName, lastName, facultyNumber, grade]);

                tableBody.appendChild(newRow);
            })
        })
}

function handler(response) {
    if (response.status > 400) {
        throw new Error(`Something went wrong. Error: ${response.statusText}`)
    }

    return response.json();
}

function createTableRow(params) {
    let tr = document.createElement('tr');

    params.forEach(param => {
        let th = document.createElement('th');

        th.textContent = param;
        tr.appendChild(th);

    });

    return tr;
}

window.addEventListener('load', loadStudents);