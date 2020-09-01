$(document).ready(function() {
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
	function uTellyURL(movieName) {
		return 'https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=' + movieName + '&country=us';
	}

	// OMDB INFORMATION AND CALL

	function omdbAPI(movie) {
		// console.log(movie);
		return `https://www.omdbapi.com/?apikey=${omdbKey}&s=${movie}`;
	}

	// OMDB QUERY CALL USING AJAX

	function omdbQuery() {
		let omdbEndPoint = omdbAPI(userInput.val().trim());
		$.ajax(omdbEndPoint).then(omdbMovieResult).catch(function(err) {
			console.log(err);
		});
	}

	// USING USERINPUT TO GET MOVIE SEARCH RESULT FROM OMDB

	function omdbMovieResult(omdbResponse) {
		// console.log(omdbResponse);
		$('#movie-display').empty();
		// save response.search to a variable
		let movies = omdbResponse.Search;
		//Set an empty variable to hold all movie results for display later
		let moviesOutput = '';
	
		//Use for-loop to append each movie result
		$.each(movies, function(index, movie) {
			
      // Only display the search results that have movie posters 
			if (movie.Poster !== "N/A") {
        
				//Set HTML structure and assign to a variable
				moviesOutput += `
				<div class="three columns" id="movie-item">
					<div class="movie-card movie-details">
						<img id="btn-modal" class="movie-poster" src="${movie.Poster}" data-id="${movie.imdbID}" alt="${movie.Title}. Click to view movie details">
					</div>
				</div>
			`;
			}
		});
		//Append the movie result to HTML movie-display <div>
		$('#movie-display').append(moviesOutput);

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

		//Save the last selected movieID to local storage
		localStorage.setItem('movieID', id);

		//get movieID from local Storage
		let movieID = localStorage.getItem('movieID');

		let idURL = `https://www.omdbapi.com/?i=${movieID}&apikey=dd9cc031`;
		console.log(idURL);
		$.ajax({
			url: idURL,
			method: 'GET'
		})
			.then(movieDetails)
			.catch(function(err) {
				console.log(err);
			});
	}

	// Render movie details to modal
	function movieDetails(omdbData) {
		// console.log(omdbData);
		let movie = omdbData;
		//HTML modal structure
		let movieDetails = `	
		<div>
		   <span class="close">&times;</span>
		</div>
		<div class="container" id="modal-box">
		   <div class="row">
		    	<div class="five columns" id="movie-poster">
					<img src="${movie.Poster}" class="thumbnail"/>
		      	</div>
		    	<div class="seven columns" id="modal-info">
					<h3 id="modal-movie-title">${movie.Title}</h3>
					<p id="modal-genre"><strong>Genre: </strong>${movie.Genre}</p>
					<p id="modal-language"><strong>Language: </strong>${movie.Language}</p>
					<p id="modal-runtime"><strong>Runtime: </strong>${movie.Runtime}</p>
					<p id="modal-rated"><strong>Rated: </strong>${movie.Rated}</p>
					<p id="modal-released"><strong>Released: </strong>${movie.Released}</p>
					<p id="modal-imdb"><strong>Ratings: </strong>${movie.imdbRating}</p>
					<p id="modal-production"><strong>Genre: </strong>${movie.Production}</p>
					<p id="modal-writer"><strong>Production: </strong>${movie.Writer}</p>
					<p id="modal-director"><strong>Director: </strong>${movie.Director}</p>
					<p id="modal-starring"><strong>Actors: </strong>${movie.Actors}</p>
		        </div>
			</div>
			<hr>
			<div class="row" id="plot-div">
				<h6 id="plot">Plot Summary</h6>
				<p>${movie.Plot}<p>
			</div>
			<div class="row" "service-row">
				<h6 id="stream-title">Streaming Available at:</h6>
				<ul id="streaming-services"></ul>
			</div>
		</div>
		`;

		$('#modal-container').append(movieDetails);

		// utelly query call
		let uTellyEndPoint = uTellyURL(movie.Title);
		$.ajax(uTellyEndPoint, settings)
			.then(function(response) {
				console.log(response);
				let matches = response.results.filter(function(potentialMatch) {
					return potentialMatch.name === movie.Title;
				});
				if (matches.length === 1 && matches[0].locations.length > 0) {
					matches[0].locations.forEach(function(streamingLocation) {
						let liEl = `<li><img src="${streamingLocation.icon}"/></li>`
						$("#streaming-services").append(liEl);
					});
				} else {
					let liEl = `<li>This movie is not available for streaming</li>`
					$("#streaming-services").append(liEl);
				}
				console.log(matches);
			})
			.catch(function(err) {
				console.log(err);
			});


		// When the user clicks on <span> (x), close the modal
		$('.close').click(function() {
			modal.style.display = 'none';
		});
	}

	/* EVENT HANDLERS 
	======================================================================================================== */

	// On click listener for the button to collect the data from omdb and console.log
	$('#searchBtn').click(function() {
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
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = 'none';
		}
	};
});

//The document.ready ends here
