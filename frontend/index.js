document.addEventListener("DOMContentLoaded", function(e){
let lyricsDiv = document.querySelector("#lyrics")
let listOfArtists = ["Beatles", "Aretha Franklin"] // we place authors here so we can get some random famous songs from different authors
const songs = [] // this will hold the whole song list from all the authors
const idOfSongs = [] // will hold all the IDs of the song which can be used to obtain the lyrics


/* GOALS needed to finish project: 
    - dynamically change fetches so that they can 
        1. fetch based on the authors from our list of authors to get a few famous songs.
        2. need to do Math.floor/random in order to randomize each song with it's respective id (random range must be between the length.)
        3. need to show the lyrics through a span/p/div in main body for the game. **could also add a setInterval and some css to style the lyrics appearing
        4. create a timer for the game that would show them a score (thinking about a score per song based on the time spent)
        *5. add an optional button to skip if user doesn't know

    - user can login and play as respective user
    - user can see a scoreboard 
*/

let userList = document.querySelector("#userlist")

    fetch("http://localhost:3000/users").then(function(resp){return resp.json()}).then(function(data){
        data.forEach(function(name){
            let newListItem = `<li id=${name.id}> ${name.name} </li>`
            userList.insertAdjacentHTML("beforeend", newListItem);
        })
    })
    
listOfArtists.forEach(function(artist){
    let artist_string = artist.replace(" ", "%20")
    fetch(`https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.search?format=json&q_artist=${artist_string}&s_track_rating=desc&quorum_factor=1&page_size=5&page=1&apikey=47143ce136469bce4ddc6c04e13ec917`)
    .then(function(resp)
    {
        return resp.json()
    }).then(function(data){
        data.message.body.track_list.forEach(function(song){
            let songName = song.track.track_name
            let songId = song.track.track_id
    
        if(songName.includes("- ")){
            let i = songName.indexOf("-")
            songName = songName.slice(0, i).trim()
        }
        else if(songName.includes("( ")){
            let i = songName.indexOf("(")
            songName = songName.slice(0, i).trim()
        }
            console.log(songName)
            let theSong = {name: songName, id: songId, lyrics: "" }
            getLyrics(theSong)
            })
        })
        
    })


    function getLyrics(song){
        fetch(`https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.lyrics.get?format=json&track_id=${song.id}&apikey=47143ce136469bce4ddc6c04e13ec917`)
        .then(function(resp){
            return resp.json();
        })
        .then(function(data){
            song.lyrics = data.message.body.lyrics.lyrics_body
            songs.push(song)
            displayLyrics(songs)
            console.log(songs)
        })
    }
    

    function displayLyrics(songs){
        let songLyrics = `<span id=${songs.id}>${songs.lyrics}</span>`
        lyricsDiv.insertAdjacentHTML("beforeend", songLyrics)
    }


        


})


