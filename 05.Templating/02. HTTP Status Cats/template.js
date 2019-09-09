(() => {
    renderCatTemplate();

    function renderCatTemplate() {
        const template = document.getElementById('cat-template').innerHTML;
        const compiled = Handlebars.compile(template);

        document.getElementById('allCats').innerHTML = compiled({
            cats: window.cats,
        });
    }

    const section = document.getElementById('allCats');

    function showMoreInfo(ev) {
        const btn = ev.target;
        if (btn.className === 'showBtn') {
            if (btn.textContent === 'Show status code') {
                btn.textContent = 'Hide status code';
                btn.nextElementSibling.style.display = 'block';
            } else {
                btn.nextElementSibling.style.display = 'none';
                btn.textContent = 'Show status code';
            }
        }
    }

    section.addEventListener('click', showMoreInfo);

})();

