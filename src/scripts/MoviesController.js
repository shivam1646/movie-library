import {MOVIE_LIST_URL, API_KEY, POSTER_BASE_URL} from '../constants';
import {Movie} from './Movie';

class MoviesController {
    constructor() {
        this.moviesList = [];
        this.myLibrary = [];
        this.pageNo = 1;

        // Fetch 10 movies upfront
        this.fetchMovieslist(this.pageNo);

        //Registering Event Listeners 
        document.querySelector('#myLibrary').addEventListener('click', event => {
            document.getElementsByClassName("movie-items")[0].style.display = "none";
            document.getElementsByClassName("library")[0].style.display = "flex";
            document.getElementById("more").style.display = "none";
            if(!this.myLibrary.length) {
                if(document.getElementById('noMovieFound')) {
                    document.getElementById('noMovieFound').style.display = "block";
                }
            }
        });
        document.querySelector('#allMoviesList').addEventListener('click', eevnt => {
            document.getElementsByClassName("movie-items")[0].style.display = "flex";
            document.getElementsByClassName("library")[0].style.display = "none";
            document.getElementById("more").style.display = "flex";
        });
        document.querySelector('#showMore').addEventListener('click', event => {
            this.fetchMovieslist(++this.pageNo);
        });
        document.addEventListener('keyup', event => {
            if (!event.target) {
                return;
            }
      
            if (event.target.classList.contains('search')) {
                this.searchMovies();
            }
        });
        document.addEventListener('click', event => {
            if (!event.target) {
                return;
            }
      
            if (event.target.classList.contains('add-button')) {
                this.addMovieToLibrary(event);
            }

            if (event.target.classList.contains('delete-button')) {
                this.deleteMovieFromLibrary(event);
            }
        });
        
    }

    /*
    * Fetches list of movies
    * @param {number} indicates page number.
    */
    fetchMovieslist(pageNo) {
        const url = `${MOVIE_LIST_URL}?api_key=${API_KEY}&language=en-US&page=${pageNo}`;
        fetch(url)
        .then(response => response.json())
        .then((data) => {
            if (data && data.results && data.results.length) {
                data.results.forEach(movie => {
                    this.moviesList.push(new Movie(movie.id, movie.title, movie.release_date, movie.poster_path));
                })
            }
            this.renderMovieslist();
        })
    }

    /*
    * Search the list of movies.
    */
    searchMovies() {
        const searchText = document.getElementById('search').value.toLowerCase();
        const data = document.getElementsByClassName('movie');
        for (let i = 0; i < data.length; i++) {  
            if (!data[i].innerHTML.toLowerCase().includes(searchText)) { 
                data[i].style.display = 'none';
            } 
            else { 
                data[i].style.display = 'block';                 
            } 
        } 
    }

    /*
    * Renders  list of movies to the DOM.
    */
    renderMovieslist() {
        this.moviesListElement = document.querySelector('.movie-items');
        this.moviesListElement.innerHTML = '';
        this.moviesList.forEach(movie => {
            this.createDOMElements(movie, true);
            this.moviesListElement.appendChild(this.outerDiv);
        })

    }

    /*
    * Creates DOM elements.
    * @param {object} movie Movie details.
    * @param {Boolean} isAddButton True define render add button.
    */
    createDOMElements(movie, isAddButton) {
        this.outerDiv = document.createElement('div');
        this.outerDiv.classList.add('movie');
        // poster container
        this.posterContainer = document.createElement('div');
        this.posterContainer.classList.add('poster-container');
        // poster
        this.poster = document.createElement('img');
        this.poster.setAttribute('src', `${POSTER_BASE_URL}${movie.poster_path}`);
        this.poster.classList.add('poster');
        // append to container
        this.posterContainer.appendChild(this.poster);

        // add button for search movies page and delete button for movie library page
        if(isAddButton) {
            this.addMovieBtn = document.createElement('button');
            this.addMovieBtn.innerHTML = 'Add';
            this.addMovieBtn.classList.add('add-button');
            this.addMovieBtn.setAttribute('movie-id', movie.id);
            this.posterContainer.appendChild(this.addMovieBtn);
        } else {
            this.deleteMovieBtn = document.createElement('button');
            this.deleteMovieBtn.innerHTML = 'Delete';
            this.deleteMovieBtn.classList.add('delete-button');
            this.deleteMovieBtn.setAttribute('movie-id', movie.id);
            this.posterContainer.appendChild(this.deleteMovieBtn);
        }
        
        // movie details element
        this.movieDetailsContainer = document.createElement('div');
        this.movieDetailsContainer.classList.add('movie-details');
        // movie title
        this.movieTitle = document.createElement('p');
        this.movieTitle.classList.add('movie-title');
        this.movieTitle.innerHTML = movie.title;
        // movie release year
        this.releaseYear = document.createElement('p');
        this.releaseYear.classList.add('movie-year');
        this.releaseYear.innerHTML = movie.release_date.substring(0,4);
        // append to container
        this.movieDetailsContainer.appendChild(this.movieTitle);
        this.movieDetailsContainer.appendChild(this.releaseYear);
        

        // append everything to main division
        this.outerDiv.appendChild(this.posterContainer);
        this.outerDiv.appendChild(this.movieDetailsContainer);
        this.outerDiv.setAttribute('movie-id', movie.id);
    }

    /*
    * Add movie to my library.
    * @param {object} event click event details.
    */
    addMovieToLibrary(event) {   
        const id = event.target.getAttribute('movie-id');
        const checkIdExists = this.myLibrary.findIndex(movie => movie.id == id);
        const toastMsg = document.getElementById("toastMsg");

        if(checkIdExists !== -1) {
            toastMsg.innerHTML = 'Movie already exist in library.';
            toastMsg.className = "show";
            setTimeout(() => {
                toastMsg.className = toastMsg.className.replace("show", ""); 
            }, 2000);
            return;
        }
        const movie = this.moviesList.find(movie => movie.id == id);
        if (movie) {
            this.myLibrary.push(movie);
            toastMsg.innerHTML = 'Successfully added movie to library.';
            toastMsg.className = "show";
            setTimeout(() => {
                toastMsg.className = toastMsg.className.replace("show", ""); 
            }, 2000);
            this.renderLibrary();
        } else {
            toastMsg.innerHTML = 'Could not add movie. Please try again.';
            toastMsg.className = "show";
            setTimeout(() => {
                toastMsg.className = toastMsg.className.replace("show", ""); 
            }, 2000);
        }
    }

    /*
    * Delete movie to my library.
    * @param {object} event click event details.
    */
    deleteMovieFromLibrary(event) {
        const id = event.target.getAttribute('movie-id');
        const itemToDelete = this.myLibrary.findIndex(movie => movie.id == id);
        const toastMsg = document.getElementById("toastMsg");
        
        if (itemToDelete !== -1) {
            this.myLibrary.splice(itemToDelete, 1);
            toastMsg.innerHTML = 'Movie removed from library.';
            toastMsg.className = "show";
            setTimeout(() => {
                toastMsg.className = toastMsg.className.replace("show", ""); 
            }, 2000);
            this.renderLibrary();
        } else {
            toastMsg.innerHTML = 'Could not delete movie. Please try again.';
            toastMsg.className = "show";
            setTimeout(() => {
                toastMsg.className = toastMsg.className.replace("show", ""); 
            }, 2000);
        }
    }

    /*
    * Render my library to the DOM.
    */
    renderLibrary() {
        this.libraryElements = document.querySelector('.library');
        this.libraryElements.innerHTML = '';
        this.myLibrary.forEach(movie => {
            this.createDOMElements(movie, false);
            this.libraryElements.appendChild(this.outerDiv);
        })
    }
}

export default MoviesController;