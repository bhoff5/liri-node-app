require("dotenv").config();

var fs = require('fs');
var keys = require("./keys.js");
var axios = require('axios');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var moment = require('moment');
var command = process.argv[2];
var value = process.argv[3];

switch (command) {
    case "concert-this":
        concertThis(value);
        break;
    case "spotify-this-song":
        spotifyThis(value);
        break;
    case "movie-this":
        movieThis(value);
        break;
    case "do-what-it-says":
        doThis(value);
        break;
};

function concertThis(value) {
    axios.get("https://rest.bandsintown.com/artists/" + value + "/events?app_id=trilogy")
    .then(function(response) {    

        response.data.forEach(element => {
            var result = 
                "\nVenue: " + element.venue.name + 
                "\nLocation: " + element.venue.city + " " + element.venue.region + " " + element.venue.country +
                "\nDate: " + moment(element.datetime).format('MM/DD/YYYY') +
                "\n_________________________________________";
            console.log(result);
        });
    })
    .catch(function (error) {
        console.log(error);
    });
}

function spotifyThis(value) {
    if(!value){
        value = "The Sign";
    }
    spotify
    .search({ type: 'track', query: value })
    .then(function(response) {

        response.tracks.items.forEach(element => {
            var result = 
                "\nArtist: " + element.artists[0].name +
                "\nTitle: " + element.name +
                "\nPreview Link: " + element.preview_url +
                "\nAlbum: " + element.album.name +
                "\n_________________________________________";
            console.log(result);
        });
    })
    .catch(function(err) {
        console.log(err);
    });
}

function movieThis(value) {
    if(!value){
        value = "mr nobody";
    }
    axios.get("https://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=trilogy")
    .then(function(response) {
            var result = 
                 
                    "\nTitle: " + response.data.Title +  "\n" +
                    "\nYear: " + response.data.Year + "\n" +
                    "\nIMDB Rating: " + response.data.imdbRating + "\n" +
                    "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value + "\n" +
                    "\nCountry: " + response.data.Country + "\n" +
                    "\nLanguage: " + response.data.Language + "\n" +
                    "\nPlot: " + response.data.Plot + "\n" +
                    "\nStarring: " + response.data.Actors + "\n" +
                    "\n_________________________________________";
            console.log(result);
    })
    .catch(function (error) {
        console.log(error);
    });
    
}

function doThis(value) {

    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(',');
        switch (dataArr[0]) {
            case "concert-this":
                concertThis(dataArr[1]);
                break;
            case "spotify-this-song":
                spotifyThis(dataArr[1]);
                break;
            case "movie-this":
                movieThis(dataArr[1]);
                break;
        }
    })
}