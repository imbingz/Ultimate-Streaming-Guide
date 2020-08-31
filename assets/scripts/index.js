$(document).ready(function() {

/* GLOBAL VARIABLES
 ==================================================================================================== */
	
	
	//OMDB API key
	const omdbKey = 'dd9cc031';
	// Search Input element 
	let userInput = $('#user-input');

	// Get the modal
	var modal = document.getElementById("myModal");

	// Get the button that opens the modal
	var btn = document.getElementById("myBtn");

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];
	
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
	return 'https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=' + movieName + '&country=uk';
}

// OMDB INFORMATION AND CALL

	function omdbAPI(movie) {
	console.log(movie);
	return `https://www.omdbapi.com/?apikey=${omdbKey}&s=${movie}`;
}


	

$('#aBtn').click(function(event) {
	event.preventDefault();
	let omdbEndPoint = omdbAPI(userInput.val().trim());
	$.ajax(omdbEndPoint)
		.then(omdbMovieResult)
		.catch(function(err) {
		console.log(err);
	});
})
	
// USING USERINPUT TO GET MOVIE SEARCH RESULT FROM OMDB
	
	function omdbMovieResult(omdbResponse) {
		console.log(omdbResponse);

		// save response.search to a variable
		let movies = omdbResponse.Search;
		//Set an empty variable to hold all movie results for display later 
		let moviesOutput = '';

		//Use for-loop to append each movie result 
		$.each(movies, function(index, movie) {
			console.log('for loop is running ');
			//Set HTML structure and assign to a variable 
			moviesOutput += `
			<div class="three columns" id="movie-item">
				<div class="movie-card">
					<img class="movie-poster" src="${movie.Poster}" alt="movie cover image">
					<div class="movie-details">
						<button id="selected-movie" class="button select-btn" data-id="${movie.imdbID}">Movie Details</button>
					</div>
				</div>
			</div>
		`;
		});
		//Append the movie result to HTML movie-display <div>
		$('#movie-display').append(moviesOutput)
	}
	

/* EVENT HANDLERS 
======================================================================================================== */
	
	
// On click listener for the button to collect the data from omdb and console.log
$('#aBtn').click(function() {

	// Prevent form submisson and page reload 
	event.preventDefault(); 

	//Set a variable for user movie input 
	let movie = userInput.val().trim();

	//First check if there is movie input 

	if (movie) {
	
	//omdb query call func
	omdbQuery(); 

	// utelly querry call 
	let uTellyEndPoint = uTellyURL(userInput.val().trim());
	$.ajax(uTellyEndPoint, settings).then(function(response) {
		console.log(response);
	}).catch(function(err) {
		console.log(err);
	});;
	}


});



// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}





}) 


//The document.ready ends here 
