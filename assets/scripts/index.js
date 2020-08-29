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

function uTellyURL(movieName) {
	return 'https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=' + movieName + '&country=uk';
}

// OMDB INFORMATION AND CALL
const omdbKey = 'dd9cc031';
let userInput = $('#user-input');
function omdbAPI(movie) {
	return `https://www.omdbapi.com/?apikey=${omdbKey}&s=${movie}`;
}

// On click listener for the button to collect the data from omdb and console.log
$('#aBtn').click(function() {
	let omdbEndPoint = omdbAPI(userInput.val().trim());
	$.ajax(omdbEndPoint).then(function(response) {
		console.log(response);
	});
	let uTellyEndPoint = uTellyURL(userInput.val().trim());
	$.ajax(uTellyEndPoint, settings).then(function(response) {
		console.log(response);
	});
});

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

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