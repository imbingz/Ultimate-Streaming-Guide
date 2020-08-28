const omdbKey = "dd9cc031";
let userInput = $("#user-input");
function omdbAPI(movie) {
    return `https://www.omdbapi.com/?apikey=${omdbKey}&t=${movie}`
};

// On click listener for the button to collect the data from omdb and console.log
$("#aBtn").click(function() {
    let userMovie = omdbAPI(userInput.val().trim());
    $.ajax(userMovie).then(function(response) {
        console.log(response);
    });
});

