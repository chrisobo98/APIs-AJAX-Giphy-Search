$(document).ready(function () {

    // array of the best only some of the best 90s shows
    var shows = ["The Fresh Prince of Bel-Air", "Rugrats", "Ren and Stimpy", "Animaniacs", "Friends", "Hey Arnold!", "The Simpsons", "Dexter's Laboratory", "Kenan & Kel", "Powerpuff Girls", "Johny Bravo", "Batman: The Animated Series", "Pinky and the Brain"];


    function displayShowButtons() {

        // keep empty or it shows the show buttons x2
        $(".showButtons").empty();

        //Loop over the array of shows
        for (var i = 0; i < shows.length; i++) {

            //create a new button for each show
            var a = $("<button>");

            //adds styling and text to all the buttons
            a.addClass("showBtn").attr("show-name", shows[i]).text(shows[i]);

            // append to make them show up
            $(".showButtons").append(a);
        }
    }
    // Create an on-click function for the show buttons. Pass the displayGifs function as a callback to display the gifs
    $(".showButtons").on("click", ".showBtn", displayGifs);



    //call the function to show buttons for shows in the array
    displayShowButtons();

    // When the submit button is clicked
    $(".addShow").on("click", function (event) {

        // Capture the user input from the textbox in show variable
        var show = $("#showInput").val().trim();

        // if the show isnt in the array
        if ((shows.indexOf(show) === -1) && (show !== "")) {

            // Add the user's show to the array.
            shows.push(show);
        }

        // displays the buttons
        displayShowButtons();

        // empty search box after clicking search
        $("#showInput").val("");
    });

    // function to display the gifs call the API
    function displayGifs() {

        // Capture the show-name property value from whatever button is clicked
        var shows = $(this).attr("show-name");

        // Construct a queryURL using the Giphy search endpoint and the parameters listed below
        var queryURL = "https://api.giphy.com/v1/gifs/search";

        // Performing an AJAX request with the queryURL
        $.ajax({
                url: queryURL,
                method: "GET",
                data: {
                    q: shows, // use the button's attribute show-name as the search term
                    api_key: "5wtrk5V9QB5k6Qj3S33qmOOSOLXVDUUT", // my generated api-key
                    limit: 3 // request 3 gifs to keep it clean
                }
            })

            // After the promise is fulfilled
            .done(function (response) {
                // Store the data from the AJAX request in the showResults variable
                var showResults = response.data;
                console.log(response.data);

                // Clear the div where the current button's gifs should appear
                $(".gifArea").empty();

                // Loop through each result item
                for (var i = 0, len = showResults.length; i < len; i++) {

                    // Create and store a div element, and give it a class
                    var allGifs = $("<div class = 'gifDiv'>");

                    // Create and store an image element
                    var showImage = $("<img>");

                    // holds the version of the image that will initially be displayed
                    showImage.attr("src", showResults[i].images.fixed_height_still.url);

                    // hold the frozen version of the gif for later acccess
                    showImage.attr("data-frozen", showResults[i].images.fixed_height_still.url);

                    // hold the animated version of the gif for later access
                    showImage.attr("gif-animate", showResults[i].images.fixed_height.url);

                    // attribute to hold the current state of the gif
                    showImage.attr("gif-state", "frozen");

                    // Create a paragraph tag with the result item's rating
                    var showRating = $("<p>").text("Rating: " + showResults[i].rating);

                    // Append show image and rating
                    allGifs.append(showImage).append(showRating);

                    // hide gifs for clean fade in
                    allGifs.hide();

                    // Prependng allGifs to gifArea
                    $(".gifArea").prepend(allGifs);

                    // Give the gif a fade in of 2.5 seconds or 2500 ms
                    allGifs.fadeIn(2500);
                }
            });
    };

    // create function to animate gif 
    function animateIt() {

        // value of the data attribute 'gif-state'
        var state = $(this).attr("gif-state");

        // If state = frozen, change its src attribute to what its 'gif-animate' attribute value, set the gifs's gif-state to animate
        if (state === "frozen") {
            $(this).attr("src", $(this).attr("gif-animate"));
            $(this).attr("gif-state", "animate");

            // Else set src to the 'data-frozen' attribute value and set the gifs gif-state to frozen
        } else {
            $(this).attr("src", $(this).attr("data-frozen"));
            $(this).attr("gif-state", "frozen");
        }
    };

    // Create an on-click for the image to animate it passing the animateIt function as a callback
    $(".gifArea").on("click", "img", animateIt);

});