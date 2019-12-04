document.addEventListener("DOMContentLoaded", function(e){

    let listOfArtists = ["Frank Ocean", "Frank Zappa", "Frank Sinatra", "Aretha Franklin"] // we place authors here so we can get some random famous songs from different authors
    let songChoiceNum = 10 // change this to have more songs or less songs from each artist

    /*
        - user can login and play as respective user
        - user can see a scoreboard 
    */

    let randArtistIndex = Math.floor(Math.random()*listOfArtists.length)

    
    getSongs(listOfArtists[randArtistIndex])

    function getSongs(artist){
        let artist_string = artist.replace(" ", "%20")
        fetch(`https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.search?format=json&q_artist=${artist_string}&s_track_rating=desc&quorum_factor=1&page_size=${songChoiceNum}&page=1&apikey=47143ce136469bce4ddc6c04e13ec917`)
        .then(resp => resp.json())
        .then(function(data){
            let availableSongs = data.message.body.track_list.length
            let randomSongIndex = Math.floor((Math.random()*availableSongs))
            console.log(data.message.body.track_list[randomSongIndex])
            getLyrics(data.message.body.track_list[randomSongIndex])
        })  
    }


    function getLyrics({track}){
        fetch(`https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.lyrics.get?format=json&track_id=${track.track_id}&apikey=47143ce136469bce4ddc6c04e13ec917`)
        .then(resp => resp.json())
        .then(function(data){
            song = {}
            song.id = track.track_id
            song.name = track.name 
            song.artist = track.artist_name
            song.lyrics = data.message.body.lyrics.lyrics_body
            displayLyrics(song)
        })
    }

    function displayLyrics(song){
        let div = document.getElementById("lyrics")
        div.innerHTML += `
        <p>${song.lyrics}</p>
        <input type="text" id="artist-input"></input>
        <button id="submit-${song.id}">Frank?</button>
        `
        

        div.addEventListener('click', function(e){
            if (e.target.type === "submit"){
                let userInput = document.getElementById("artist-input").value
                console.log(userInput)
                if (userInput.toLowerCase() === song.artist.toLowerCase()){
                    alert("Winner Winner Chicken Dinner")
                }
                else {alert("YOU SUCK")}
            }
        })
    }

})


