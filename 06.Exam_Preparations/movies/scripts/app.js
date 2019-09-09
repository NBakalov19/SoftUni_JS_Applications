const app = Sammy('#container', function () {

    this.use('Handlebars', 'hbs');

    // Home
    this.get('#/home', homeController.getHome);

    // User
    this.get('#/login', userController.getLogin);
    this.get('#/register', userController.getRegister);
    this.get('#/logout', userController.logout);


    this.post('#/register', userController.postRegister);
    this.post('#/login', userController.postLogin);

    //Movie
    this.get('#/movie/create', movieController.createGet);
    this.get('#/cinema', movieController.loadMovies);
    this.get('#/movie/user', movieController.myMovies);
    this.get('#/movie/edit/:movieId', movieController.editMovieGet);
    this.get('#/movie/delete/:movieId', movieController.deleteMovieGet);
    this.get('#/movie/details/:movieId', movieController.loadDetails);
    this.get('#/movie/buy/:movieId',movieController.buyTicket);

    this.post('#/movie/create', movieController.createPost);
    this.post('#/movie/edit/:movieId', movieController.editMoviePost);
    this.post('#/movie/delete/:movieId', movieController.deleteMoviePost);

});

(() => {
    app.run('#/home')
})();