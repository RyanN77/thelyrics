document.addEventListener("DOMContentLoaded", function(e){
    let startGameButton = document.querySelector(".startgame")
    let listOfArtists = ["Frank Ocean", "Frank Zappa", "Frank Sinatra"] // we place authors here so we can get some random famous songs from different authors
    let songChoiceNum = 10 // change this to have more songs or less songs from each artist
    let Game = {
                    maxQ: 5,
                    maxTime: 10,
                    currentQ: 0,
                    correct: 0
                }

    document.addEventListener("click", function(e){
        if (e.target.className === "frankie-button"){
            let userInput = document.getElementById("artist-input").value
            console.log(song.artist.toLowerCase())
            if (userInput.toLowerCase() === song.artist.toLowerCase()){
                Game.currentQ +=1
                Game.correct +=1 
                playGame()
            }
            else {
                Game.currentQ += 1
                playGame()
            }
        }
    })

    startGameButton.addEventListener("click", e => {
        startGameButton.remove()
        playGame()
    })

    function playGame(){
        console.log(Game)
        if (Game.currentQ === Game.maxQ){
            alert(`Game Over you got ${Game.correct} out ${Game.maxQ} Franks`)
            Game.currentQ = 0
            Game.correct = 0
        } else{
            getNewArtist()
        }  
    }

    function getNewArtist(){
        let randArtistIndex = Math.floor(Math.random()*listOfArtists.length)
        getSongs(listOfArtists[randArtistIndex])
    }

    function getSongs(artist){
        let artist_string = artist.replace(" ", "%20")
        fetch(`https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.search?format=json&q_artist=${artist_string}&s_track_rating=desc&quorum_factor=1&page_size=${songChoiceNum}&page=1&apikey=47143ce136469bce4ddc6c04e13ec917`)
        .then(resp => resp.json())
        .then(function(data){
            let availableSongs = data.message.body.track_list.length
            let randomSongIndex = Math.floor((Math.random()*availableSongs))
            getLyrics(data.message.body.track_list[randomSongIndex])
        })  
    }

    function getLyrics({track}){
        fetch(`https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.lyrics.get?format=json&track_id=${track.track_id}&apikey=47143ce136469bce4ddc6c04e13ec917`)
        .then(resp => resp.json())
        .then(function(data){
            song = {
                id: track.track_id,
                name: track.name, 
                artist: track.artist_name
            }

            if (data.message.body.lyrics && data.message.body.lyrics.lyrics_body.length > 1){
                song.lyrics = data.message.body.lyrics.lyrics_body
                displayLyrics(song)
                console.log("GOT LYRICS")
            }
            else {
                getNewArtist()
                console.log("GOT NEW ARTIST")
            }
        })
    }

    function displayLyrics(song){
        let div = document.getElementById("lyrics")
        div.innerHTML = `
        <p>${song.lyrics.split("***")[0]}</p>
        <input type="text" id="artist-input"></input>
        <button class="frankie-button" id="submit-${song.id}">Frank?</button>
        `
    }


})


