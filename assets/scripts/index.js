$(document).ready(function () {
	/* GLOBAL VARIABLES
	 ==================================================================================================== */

	//OMDB API key
	const omdbKey = 'dd9cc031';
	// Search Input element
	let userInput = $('#user-input');

	// Get the modal
	var modal = document.getElementById('myModal');

	// Get the button that opens the modal
	var modalBtn = document.getElementById('btn-modal');

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName('close')[0];

	// UTELLY INFORMATION AND CALL
	var settings = {
		async: true,
		crossDomain: true,
		method: 'GET',
		headers: {
			'x-rapidapi-host': 'utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com',
			'x-rapidapi-key': 'f82a92dbacmsh1aca7fdf76b1beap187f62jsn400f4f407b76'
		}
	};

	/* FUNCTIONS 
	======================================================================================================== */

	// GENERATE UTELLY URL
	function uTellyURL(movieID) {
		return `https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/idlookup?country=us&source_id=${movieID}&source=imdb`;
	}

	// OMDB INFORMATION AND CALL

	function omdbAPI(movie) {
		return `https://www.omdbapi.com/?apikey=${omdbKey}&s=${movie}`;
	}

	// OMDB QUERY CALL USING AJAX

	function omdbQuery() {
		let omdbEndPoint = omdbAPI(userInput.val().trim());
		$.ajax(omdbEndPoint).then(omdbMovieResult).catch(function (err) {
			console.log(err);
		});
	}

	// USING USERINPUT TO GET MOVIE SEARCH RESULT FROM OMDB

	function omdbMovieResult(omdbResponse) {
		$('#movie-display').empty();
		// save response.search to a variable
		let movies = omdbResponse.Search;
		//Set an empty variable to hold all movie results for display later
		let moviesOutput = '';

		//Use for-loop to append each movie result
		$.each(movies, function (index, movie) {
			// Only display the search results whose images are found

			// https://stackoverflow.com/questions/9815762/detect-when-an-image-fails-to-load-in-javascript
			function testImage(URL) {
				var tester = new Image();
				tester.onload = imageFound;
				tester.onerror = imageNotFound;
				tester.src = URL;
			}

			function imageFound() {
				//Set HTML structure and assign to a variable
				moviesOutput = `
					<div class="movie-card movie-details">
						<img id="btn-modal" class="movie-poster" src="${movie.Poster}" data-id="${movie.imdbID}" alt="${movie.Title}. Click to view movie details">
					</div>
			`;
				//Append the movie result to HTML movie-display <div>
				$('#movie-display').append(moviesOutput);
			}

			function imageNotFound() {
				console.log('That image was not found.');
			}

			testImage(movie.Poster);
		});

		//Empty user input field after rendering search result
		userInput.val('');
	}

	// GET MOVIE DETAILS WHEN USER CLICK MOVIE POSTERS
	$('#movie-display').on('click', 'img', appendToModal);

	function appendToModal() {
		modal.style.display = 'block';

		$('#modal-container').empty();

		// Get the data-id info for each button clicked
		let id = $(this).attr('data-id');

		let idURL = `https://www.omdbapi.com/?i=${id}&apikey=dd9cc031`;
		$.ajax({
			url: idURL,
			method: 'GET'
		})
			.then(movieDetails)
			.catch(function (err) {
				console.log(err);
			});
	}

	// RENDER MOVIE DETAILS TO MODAL 

	function movieDetails(omdbData) {
		let movie = omdbData;
		//HTML modal structure
		let removeBtn = ""
		let temp = JSON.parse(localStorage.getItem("saved-movies"));
		if (temp && temp.find(mov => mov.id === omdbData.imdbID)) {
			removeBtn = `<button class="button-primary" id="remove-btn" data-imdbID="${omdbData.imdbID}", data-poster="${omdbData.Poster}", data-title="${omdbData.Title}" onclick="removeMovie()">Remove</button>
			`
		}

		let movieDetails = `	
		<div>
		   <span class="close">&times;</span>
		</div>
		<div class="container" id="modal-box">
		   <div class="row">
		    	<div class="five columns movie-poster " id="movie-poster">
					<img src="${movie.Poster}" class="thumbnail"/>
		      	</div>
		    	<div class="seven columns" id="modal-info">
					<h3 id="modal-movie-title">${movie.Title}</h3>
					<p id="modal-genre"><strong>Genre: </strong><span class="text genre">${movie.Genre}</span></p>
					<p id="modal-language"><strong>Language: </strong><span class="text lang">${movie.Language}</span></p>
					<p id="modal-runtime"><strong>Runtime: </strong><span class="text runtime">${movie.Runtime}</span></p>
					<p id="modal-rated"><strong>Rated: </strong><span class="text rated">${movie.Rated}</span></p>
					<p id="modal-released"><strong>Released: </strong><span class="text release">${movie.Released}</span></p>
					<p id="modal-imdb"><strong>Ratings: </strong><span class="text rating">${movie.imdbRating}</span></p>
					<p id="modal-production"><strong>Production: </strong><span class="text production">${movie.Production}</span></p>
					<p id="modal-director"><strong>Director: </strong><span class="text director">${movie.Director}</span></p>
					<p id="modal-starring"><strong>Actors: </strong><span class="text actors">${movie.Actors}</span></p>
		        </div>
			</div>
			<div class="row" id="plot-div">
				<h6 id="plot">Plot Summary</h6>
				<p><span class="text plot">${movie.Plot}</span><p>
			</div>
			<div class="row" "service-row">
				<div class="eight columns service-icon">
					<h6 id="stream-title">Streaming Available at:</h6>
					<ul id="streaming-services"></ul>
				</div>
				<div class="four columns save-button">
					<button class="button-primary" id="save-btn" data-imdbID="${omdbData.imdbID}", data-poster="${omdbData.Poster}", data-title="${omdbData.Title}">Save Movie</button>
					${removeBtn}
				</div>
			</div>
		</div>
		`;

		$('#modal-container').append(movieDetails);

		checkUndefined();

		// utelly query call
		let uTellyEndPoint = uTellyURL(movie.imdbID);
		$.ajax(uTellyEndPoint, settings)
			.then(function (response) {
				if (Object.entries(response.collection).length !== 0) {
					response.collection.locations.forEach(function (streamingLocation) {
						let liEl = `<li><a href="${streamingLocation.url}" target="_blank"><img id="modal-logo" src="${streamingLocation.icon}"/></a></li>`;
						$('#streaming-services').append(liEl);
					});
				} else {
					let liEl = `<li>This movie is not available for streaming</li>`;
					$('#streaming-services').append(liEl);
				}
			})
			.catch(function (err) {
				console.log(err);
			});

		// When the user clicks on <span> (x), close the modal
		$('.close').click(function () {
			modal.style.display = 'none';
		});
	}

	// CHANGE "UNDEFINED" TO "N/A" IN MOVIE-DETAIL MODAL

	function checkUndefined() {
		let fields = ["genre", "lang", "runtime", "rated", "release", "rating", "production", "director", "actors"]
		//use for-loop to get each field text
		for (let i = 0; i < fields.length; i++) {
			let fieldText = $('#modal-info').find(`.${fields[i]}`).text()
			//Change fieldText "undefined" to "N/A"
			if (fieldText === "undefined")
				$('#modal-info').find(`.${fields[i]}`).text("N/A")
		}
	}

	// STORE SAVED MOVIES TO LOCALSTORAGE WHEN USERS CLICK SAVE-BTN

	$('#modal-container').on('click', '#save-btn', function () {
		// get movie info and assign to variables
		let id = $(this).attr('data-imdbID');
		let poster = $(this).attr('data-poster');
		let title = $(this).attr('data-title');

		//assign data in localstorage to a varialbe
		const savedMovieStr = localStorage.getItem('saved-movies');

		// set a variable and check if any existing data in localstorage
		let savedMovies = savedMovieStr ? JSON.parse(savedMovieStr) : [];

		// filter only movie that is not duplicated with existing stored data
		savedMovies = savedMovies.filter(function (movie) {
			return movie.id !== id;
		});

		// add the saved movie data into the saveMovies Array
		savedMovies.unshift({
			id: id,
			poster: poster,
			title: title
		});

		// only store the latest 10 saved movies
		savedMovies.splice(10);

		// save the savedMovies variable to local storage
		localStorage.setItem('saved-movies', JSON.stringify(savedMovies));

		// call renderSavedMovies function
		renderSavedMovies();
	});

	//RENDER SAVEDMOVIES TO HTML
	function renderSavedMovies() {
		//clear output area first
		$('#saved-display').empty();

		const savedMovieStr = localStorage.getItem('saved-movies');
		let savedMovies = savedMovieStr ? JSON.parse(savedMovieStr) : [];
		//if no data in savedMovies, return early
		if (!savedMovies.length) return;

		//Use for-loop to append each movie result
		$.each(savedMovies, function (index, movie) {
			// Only display the search results whose images are found

			// https://stackoverflow.com/questions/9815762/detect-when-an-image-fails-to-load-in-javascript
			function testImage(URL) {
				var tester = new Image();
				tester.onload = imageFound;
				tester.onerror = imageNotFound;
				tester.src = URL;
			}

			function imageFound() {
				//Set HTML structure and assign to a variable
				let moviesOutput = `
					
					<div class="saved-movie-card movie-details">
						<img id="btn-modal" class="saved-poster" src="${movie.poster}" data-id="${movie.id}" alt="${movie.title}. Click to view movie details"</img>
					</div>
			`;
				//Append the movie result to HTML movie-display <div>
				$('#saved-display').append(moviesOutput);
			}

			function imageNotFound() {
				console.log('That image was not found.');
			}

			testImage(movie.poster);
		});
	}


	// GET MOVIE DETAILS WHEN USER CLICK SAVED MOVIE POSTERS
	$('#saved-display').on('click', 'img', savedToModal);

	function removeMovie() {
		//Remove the image from DOM
		$(this).remove();

		//assign data in localstorage to a varialbe
		const savedMovieStr = localStorage.getItem('saved-movies');

		// set a variable and check if any existing data in localstorage
		let savedMovies = savedMovieStr ? JSON.parse(savedMovieStr) : [];

		// Remove the image from local storage array 
		savedMovies = savedMovies.filter(function (movie) {
			return movie.id !== id;
		});


		// save the new array to local storage
		localStorage.setItem('saved-movies', JSON.stringify(savedMovies));
		modal.style.display = 'none';
		renderSavedMovies();
	};

	// Append saved movies to modal when clicked
	function savedToModal() {
		// Change remove button style to shown 
		$("#remove-btn").css("display", "block")
		//Show modal
		modal.style.display = 'block';
		//Clear modal 
		$('#modal-container').empty();
		//Save movie ID in variable id
		let id = $(this).attr('data-id');
		//Add click event handler on the remove button
		$('#saved-display').on('click', '#remove-btn', removeMovie);

		// Get the data-id info for each button clicked
		let idURL = `https://www.omdbapi.com/?i=${id}&apikey=dd9cc031`;

		$.ajax({
			url: idURL,
			method: 'GET'
		})
			.then(movieDetails)
			.catch(function (err) {
				console.log(err);
			});
	}


	/* EVENT HANDLERS 
	======================================================================================================== */

	// On click listener for the button to collect the data from omdb
	$('#searchBtn').click(function () {
		// Prevent form submisson and page reload
		event.preventDefault();

		//Set a variable for user movie input
		let movie = userInput.val().trim();

		//First check if there is movie input
		if (movie) {
			//omdb query call func
			omdbQuery();
		}
	});

	// * NOTE: THE MODAL CLICK FUNCTION IS IN appenToModal FUNC NOW

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function (event) {
		if (event.target == modal) {
			modal.style.display = 'none';
		}
	};
	//Display saved movies when page reload
	renderSavedMovies();
});

//The document.ready ends here
