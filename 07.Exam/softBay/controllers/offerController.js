const offerController = function () {
    const createGet = function (context) {

        helper.addHeaderInfo(context);

        context.loadPartials({
            header: "./views/common/header.hbs",
            footer: "./views/common/footer.hbs",
        }).then(function () {
            this.partial('./views/offers/create.hbs')
        })
    };

    const createPost = function (context) {
        const payload = {
            product: context.params.product,
            description: context.params.description,
            price: Number(context.params.price),
            pictureUrl: context.params.pictureUrl,
        };

        const isValidUrl = payload.pictureUrl.startsWith('https://') || payload.pictureUrl.startsWith('http://');

        if (payload.product && payload.description && payload.price && !isNaN(payload.price) && isValidUrl) {
            requester.post('offers', 'appdata', 'Kinvey', payload)
                .then(helper.handler)
                .then(context.redirect('#/home'))
        } else {
            context.redirect('#/createOffer')
        }
    };

    const loadOffers = function (context) {
        helper.addHeaderInfo(context);

        requester.get('offers', 'appdata', 'Kinvey')
            .then(helper.handler)
            .then((offers) => {

                const userId = sessionStorage.getItem('userId');

                let index = 0;

                for (const offer of offers) {
                    offer.index = index++;
                    offer.isCreator = userId === offer._acl.creator
                }

                context.offers = offers;

                context.loadPartials({
                    header: './views/common/header.hbs',
                    footer: './views/common/footer.hbs',
                    offer: './views/offers/offer.hbs',
                }).then(function () {
                    this.partial('./views/offers/dashboard.hbs')
                })
            });


    };

    const loadDetails = function (context) {
        const offerId = context.params.offerId;

        helper.addHeaderInfo(context);

        requester.get(`offers/${offerId}`, 'appdata', 'Kinvey')
            .then(helper.handler)
            .then((detailsOffer) => {
                context.offer = detailsOffer;

                helper.loadPartials(context)
                    .then(function () {
                        this.partial('./views/offers/details.hbs')
                    })

            })
    };

    const editOfferGet = function (context) {
        const offerId = context.params.offerId;

        helper.addHeaderInfo(context);

        requester.get(`offers/${offerId}`, 'appdata', 'Kinvey')
            .then(helper.handler)
            .then((currOffer) => {
                context.offer = currOffer;

                helper.loadPartials(context)
                    .then(function () {
                        this.partial('./views/offers/edit.hbs');
                    })
            })
    };

    const editOfferPost = function (context) {

        const offerId = context.params.offerId;

        const payload = {
            product: context.params.product,
            description: context.params.description,
            price: Number(context.params.price),
            pictureUrl: context.params.pictureUrl,
        };

        requester.put(`offers/${offerId}`, 'appdata', 'Kinvey', payload)
            .then(helper.handler)
            .then(() => {
                context.redirect('#/dashboard');
            })
    };

    const deleteOfferGet = function (context) {
        const offerId = context.params.offerId;

        helper.addHeaderInfo(context);

        requester.get(`offers/${offerId}`, 'appdata', 'Kinvey')
            .then(helper.handler)
            .then((currOffer) => {
                context.offer = currOffer;

                helper.loadPartials(context)
                    .then(function () {
                        this.partial('./views/offers/delete.hbs');
                    })
            })
    };

    const deleteOfferPost = function (context) {
        const offerId = context.params.offerId;

        requester.del(`offers/${offerId}`, 'appdata', 'Kinvey')
            .then(helper.handler)
            .then(() => {
                context.redirect('#/dashboard');
            })
    };

    return {
        createGet,
        createPost,
        loadOffers,
        loadDetails,
        editOfferGet,
        editOfferPost,
        deleteOfferGet,
        deleteOfferPost,

    }

}();