const movieController = function () {

    const createGet = function (context) {
        helper.addHeaderInfo(context);

        context.loadPartials({
            header: "./views/common/header.hbs",
            footer: "./views/common/footer.hbs",
        }).then(function () {
            this.partial('./views/movies/create.hbs')
        })
    };

    const createPost = function (context) {
        const payload = {
            title: context.params.title,
            imageUrl: context.params.imageUrl,
            description: context.params.description,
            tickets: Number(context.params.tickets),
            genres: context.params.genres,
        };

        requester.post('movies', 'appdata', 'Kinvey', payload)
            .then(helper.handler)
            .then(context.redirect('#/home'))
    };

    const loadMovies = function (context) {
        helper.addHeaderInfo(context);

        const sortCriteria = JSON.stringify({
            'tickets': -1,
        });

        const endpoint = `movies?query={}&sort=${sortCriteria}`;

        requester.get(endpoint, 'appdata', 'Kinvey')
            .then(helper.handler)
            .then((movies) => {

                context.movies = movies;

                context.loadPartials({
                    header: './views/common/header.hbs',
                    footer: './views/common/footer.hbs',
                    movie: './views/movies/movie.hbs',
                }).then(function () {
                    this.partial('./views/movies/movies.hbs')
                })
            });
    };

    const myMovies = function (context) {
        const endpoint = `movies?query={"_acl.creator":"${sessionStorage.getItem('userId')}"}`;

        helper.addHeaderInfo(context);

        requester.get(endpoint, 'appdata', 'Kinvey')
            .then(helper.handler)
            .then((myMovies) => {
                context.movies = myMovies;

                context.loadPartials({
                    header: './views/common/header.hbs',
                    footer: './views/common/footer.hbs',
                    'my-movie': './views/movies/my-movie.hbs',
                }).then(function () {
                    this.partial('./views/movies/my-movies.hbs')
                })
            })
    };

    const editMovieGet = function (context) {
        const movieId = context.params.movieId;

        helper.addHeaderInfo(context);

        requester.get(`movies/${movieId}`, 'appdata', 'Kinvey')
            .then(helper.handler)
            .then((movie) => {
                context.movie = movie;

                helper.loadPartials(context)
                    .then(function () {
                        this.partial('./views/movies/edit-movie.hbs');
                    })
            })
    };

    const editMoviePost = function (context) {
        const movieId = context.params.movieId;

        const payload = {
            title: context.params.title,
            imageUrl: context.params.imageUrl,
            description: context.params.description,
            tickets: Number(context.params.tickets),
            genres: context.params.genres,
        };

        requester.put(`movies/${movieId}`, 'appdata', 'Kinvey', payload)
            .then(helper.handler)
            .then(() => {
                context.redirect('#/movie/user');
            })
    };

    const deleteMovieGet = function (context) {
        const movieId = context.params.movieId;

        helper.addHeaderInfo(context);

        requester.get(`movies/${movieId}`, 'appdata', 'Kinvey')
            .then(helper.handler)
            .then((movie) => {
                context.movie = movie;

                helper.loadPartials(context)
                    .then(function () {
                        this.partial('./views/movies/delete-movie.hbs');
                    })
            })
    };

    const deleteMoviePost = function (context) {
        const movieId = context.params.movieId;

        requester.del(`movies/${movieId}`, 'appdata', 'Kinvey')
            .then(helper.handler)
            .then(() => {
                context.redirect('#/home');
            })
    };

    const loadDetails = function (context) {
        const movieId = context.params.movieId;

        helper.addHeaderInfo(context);

        requester.get(`movies/${movieId}`, 'appdata', 'Kinvey')
            .then(helper.handler)
            .then((detailsMovie) => {
                context.movie = detailsMovie;
                context.movie.myGenres = detailsMovie.genres.split('').join(',');

                helper.loadPartials(context)
                    .then(function () {
                        this.partial('./views/movies/details-movie.hbs')
                    })

            })
    };

    const buyTicket = function (context) {
        const movieId = context.params.movieId;

        requester.get(`movies/${movieId}`, 'appdata', 'Kinvey')
            .then(helper.handler)
            .then((movie) => {
                movie.tickets--;

                return requester.put(`movies/${movieId}`, 'appdata', 'Kinvey', movie);
            })
            .then(helper.handler)
            .then(() => {
                context.redirect('#/movie/user');
            });
    };

    return {
        createGet,
        createPost,
        loadMovies,
        myMovies,
        editMovieGet,
        editMoviePost,
        deleteMovieGet,
        deleteMoviePost,
        loadDetails,
        buyTicket,
    }
}();