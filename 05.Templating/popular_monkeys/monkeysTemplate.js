(() => {
    loadMonkeys();


    async function loadMonkeys() {
        const allMonkeysString = await fetch('allMonkeys.html')
            .then((response) => {
                return response.text();
            });

        const monkeyString = await fetch('monkey.html')
            .then((response) => {
                return response.text();
            });

        const compiledAllMonkeysTemplate = Handlebars.compile(allMonkeysString);
        const compiledMonkeyTemplate = Handlebars.compile(monkeyString);
        const context = {
            monkeys
        };

        Handlebars.registerPartial('monkey', monkeyString);

        const allMonkeysDiv = document.getElementsByClassName('monkeys')[0];
        allMonkeysDiv.innerHTML = compiledAllMonkeysTemplate(context);

        allMonkeysDiv.addEventListener('click', showInfo);

        function showInfo(ev) {
            const btn = ev.target;

            if (btn.textContent === 'Info') {
                if (btn.nextElementSibling.style.display === 'none') {
                    btn.nextElementSibling.style.display = 'block';
                } else {
                    btn.nextElementSibling.style.display = 'none';
                }
            }
        }
    }


})();