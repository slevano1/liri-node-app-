require('dotenv').config();


var fs = require('fs');
var Twitter = require('twitter');
var spotify = require('node-spotify-api');
var request = require('request');
var Argv = process.argv;
var command = process.argv[2];
var valueEntered = process.argv[3];

// load user twitter
var keys = require('./keys.js');
var client = new Twitter(keys.twitter);

// var spotify = new Spotify(keys.spotify);

//
var myTweets = 'my-tweets';
var songs = 'spotify-this-song';
var movies = 'movie-this';
var doWhat = 'do-what-it-says';

// var liriCommand = '';
// for (var i=3; i<Argv.length; i++) {
//  command += Argv[i] + ' ';
// }



//The switch statement evaluates an expression, matching the expression's value to a case clause, 
// and executes statements associated with that case, as well as statements in cases that follow the matching case.

switch (command){
  case "my-tweets":
  getTweets();
  break;

  case "spotify-this-song":
  if(valueEntered){
    spotifySong(valueEntered);
  } else {
    spotifySong("The Sign")
  }
  break;

  case "movie-this":
  if(valueEntered){
    getMovie(valueEntered);
  } else {
    getMovie("Mr. Nobody")
  }
  break;

  case "do-what-it-says":
  doWhat();
  break;

  default:
  console.log("Please enter only: my-tweets, spotify-this-song, movie-this, do-what-it-says");
  break;
  }


function getTweets(){
  //Display last 20 Tweets
  var params = {screen_name: 'Fafnir001'};
  client.get('statuses/user_timeline', params, function(error, tweets, response){
    if(!error){
      for(var i = 0; i<tweets.length; i++){
        var date = tweets[i].created_at;
        console.log("@Fafnir001: " + tweets[i].text + " Created: " + date.substring(0, 19));
        console.log("-----------------------");
        
        //adds text to log.txt file
        // fs.appendFile('log.txt', "@Fafnir001: " + tweets[i].text + " Created: " + date.substring(0, 19));
        // fs.appendFile('log.txt', "-----------------------");
      }
    }else{
      console.log('Error occurred');
    }
  });
}

function getMovie(movie){
  var omdbURL = 'http://www.omdbapi.com/?t=' + movie + '&y=&plot=short&apikey=18f14c81'
  

  request(omdbURL, function (error, response, body){
    if(!error && response.statusCode == 200){
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
    if(movie === "Mr. Nobody"){
      console.log("-----------------------");
      console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      console.log("It's on Netflix!");
      }
    });
}

//
