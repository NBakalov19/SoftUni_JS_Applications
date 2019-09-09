const app = Sammy('body', function () {

    this.use('Handlebars', 'hbs');

    // Home
    this.get('#/home', homeController.getHome);

    // User
    this.get('#/login', userController.getLogin);
    this.get('#/register', userController.getRegister);
    this.get('#/logout', userController.logout);


    this.post('#/register', userController.postRegister);
    this.post('#/login', userController.postLogin);

    //Offer
    this.get('#/createOffer', offerController.createGet);
    this.post('#/createOffer', offerController.createPost);

    this.get('#/dashboard', offerController.loadOffers);

    this.get('#/offer/edit/:offerId', offerController.editOfferGet);// Edit
    this.post('#/offer/edit/:offerId', offerController.editOfferPost);//Edit

    this.get('#/offer/delete/:offerId', offerController.deleteOfferGet);//Delete
    this.post('#/offer/delete/:offerId', offerController.deleteOfferPost);//Delete

    this.get('#/offer/details/:offerId', offerController.loadDetails);//Details


});

(() => {
    app.run('#/home')
})();