// console.log('liri.js--running')
require("dotenv").config()

// Let's make some variables

//export modules
var fs = require('fs')
var request = require('request')
var Twitter = require('twitter')
//---i tried these other packages and couldn't get them to work---//
    // var spotify = require('spotify')
    // var SpotifyWebApi = require('spotify-web-api-node')
var Spotify = require('node-spotify-api')
var keys = require("./keys.js")
// variables to store commands and user inputs
var command = process.argv[2]
var userInput = process.argv[3]
// default searches when user input is empty
var defaultSong = "The Sign"
var defaultMovie = "Mr. Nobody"
// variables to access keys
var client = new Twitter(keys.twitter)
//---part of code for previous packages that i couldn't get to work---//
    // var spotify = new spotify(keys.spotify)
    // var spotifyApi = new SpotifyWebApi(keys.spotify)
var spotify = new Spotify(keys.spotify)




//Let's create some switch case statements
//---wrapped switch case statements in runCommand() so do-what-it-says command does what random.txt says---//
function runCommand(argument) {
    switch(command){
        case 'my-tweets':
            console.log('Here are the latest tweets...\n=============================================')
            getTweets()
            break
        case 'spotify-this-song':
            if(userInput === undefined){
                userInput = defaultSong
            }
             console.log('Searching Spotify for: '+userInput+'...\n===============================')    
            spotifyThis(userInput)
            break
        case'movie-this':
            if (userInput === undefined) {
                movieThis(defaultMovie)
                console.log("If you haven't watched "+'"Mr.Nobody," '+"then you should: http://www.imdb.com/title/tt0485947/\nIt's on Netflix!")
                break
            }
            
            getMovie(userInput)
            break
        case 'do-what-it-says':
            doIt()
            break
        default: 
            console.log("Please type any of the following commands: my-tweets spotify-this-song movie-this do-what-it-says.")
    }
}



function getTweets() {
    //Display last 20 Tweets
    //code from npm install twitter
    var params = { screen_name: 'Fafnir001' };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                var date = tweets[i].created_at;
                console.log("@Fafnir001: " + tweets[i].text + " Created: " + date.substring(0, 19));
                console.log("-----------------------");

                //adds text to log.txt file
                // fs.appendFile('log.txt', "@Fafnir001: " + tweets[i].text + " -- Created: " + date.substring(0, 19));
                // fs.appendFile('log.txt', "-----------------------");
            }
        } else {console.log('Error occurred')};
    });
}

function spotifyThis(song){
    spotify.search({ type: 'track', query: song }, function(err, data) {
      if (err) {
        return console.log('Error occurred: ' + err)
      }
      // console.log(data.tracks.items[0])
      for (var i = 0; i < data.tracks.items.length; i++) {
      console.log('Artist(s): '+data.tracks.items[i].artists[0].name)
      console.log('Song Name: '+data.tracks.items[i].name)
      console.log('Preview Link: '+data.tracks.items[i].preview_url)
      console.log('Album: '+data.tracks.items[i].album.name)
      console.log('------------------------------')

       // fs.appendFile('log.txt', '' + song + '\n\n');
    }
    })
}

function getMovie(movie) {
    var omdbURL = 'http://www.omdbapi.com/?t=' + movie + '&y=&plot=short&apikey=18f14c81'


    request(omdbURL, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var body = JSON.parse(body);

            console.log("Title: " + body.Title);
            console.log("Release Year: " + body.Year);
            console.log("IMdB Rating: " + body.imdbRating);
            console.log("Rotten Tomatoes Rating: " + body.Metascore);
            console.log("Country: " + body.Country);
            console.log("Language: " + body.Language);
            console.log("Plot: " + body.Plot);
            console.log("Actors: " + body.Actors);

        } else {
            console.log('Error occurred.')
        }
        if (movie === "Mr. Nobody") {
            console.log("-----------------------");
            console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            console.log("It's on Netflix!");
        }
    });
}


//function to run spotifyThis() on text in random.txt
function doIt() {
    // Read the existing random.txt file
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
          return console.log(err);
        }
        // separate data into command and userInput
        data = data.split(",");
        // console.log(data)
        command = data[0]
        userInput = data[1]
       
        console.log('you want me to run '+command+' on '+userInput)
        runCommand(command)
    })
}




// run liri bot
runCommand()