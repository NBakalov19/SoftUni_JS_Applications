(function () {

    const elements = {
        loadTownBtn: document.getElementById('btnLoadTowns'),
        input: document.getElementById('towns'),
    };

    elements.loadTownBtn.addEventListener('click', loadTowns);

    function loadTowns() {
        let towns = elements.input
            .value.split(', ')
            .map(element =>
                ({name: element})
            );

        renderTowns(towns);
    }

    function renderTowns(towns) {
        let template = document.getElementById('townsTemplate').innerHTML;

        let compiled = Handlebars.compile(template);

        document.getElementById('root').innerHTML = compiled({towns});
    }

}());