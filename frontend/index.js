document.addEventListener("DOMContentLoaded", function(e){
    let lyricsDiv = document.querySelector("#lyrics")
    let listOfArtists = ["Rihanna"] // we place authors here so we can get some random famous songs from different authors
    let songs = [] 
    let itemsProccessed = 0
    const idOfSongs = [] // will hold all the IDs of the song which can be used to obtain the lyrics


/* GOALS needed to finish project: 
    - dynamically change fetches so that they can 
        1. fetch based on the authors from our list of authors to get a few famous songs.
        2. need to do Math.floor 0/random in order to randomize each song with it's respective id (random range must be between the length.)
        3. need to show the lyrics through a span/p/div in main body for the game. **could also add a setInterval and some css to style the lyrics appearing
        4. create a timer for the game that would show them a score (thinking about a score per song based on the time spent)
        *5. add an optional button to skip if user doesn't know

    - user can login and play as respective user
    - user can see a scoreboard 
*/

    let userList = document.querySelector("#userlist")

        // fetch("http://localhost:3000/users").then(function(resp){return resp.json()}).then(function(data){
        //     data.forEach(function(name){
        //         let newListItem = `<li id=${name.id}> ${name.name} </li>`
        //         userList.insertAdjacentHTML("beforeend", newListItem);
        //     })
        // })
        
    listOfArtists.forEach(function(artist){
        let artist_string = artist.replace(" ", "%20")
        fetch(`https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.search?format=json&q_artist=${artist_string}&s_track_rating=desc&quorum_factor=1&page_size=5&page=1&apikey=47143ce136469bce4ddc6c04e13ec917`)
        .then(function(resp)
        {
            return resp.json()
        })
        .then(function(data){
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
            let theSong = {name: songName, id: songId, lyrics: "" }
            getLyrics(theSong)
                .then(function(){
                    itemsProccessed++
                    if (itemsProccessed === data.message.body.track_list.length){
                        displayLyrics(songs)
                        console.log("DONE PROCESSING")
                        itemsProccessed = 0
                    }
                })

            })

            })
            
        })


    function getLyrics(song){
        return fetch(`https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.lyrics.get?format=json&track_id=${song.id}&apikey=47143ce136469bce4ddc6c04e13ec917`)
        .then(function(resp){
            return resp.json();
        })
        .then(function(data){
            let lyrics = data.message.body.lyrics.lyrics_body
            song.lyrics = lyrics.split("*")[0]
            songs.push(song)
        })
    }
    
    // id of the form linked to the key
    // form anwer to equal key
    // ${songObj[songs.length-1].id}

    function displayLyrics(songArray){
        let div = document.getElementById("lyrics")
        songArray.forEach(function(song){
            console.log(song)
            div.innerHTML += `
            <p>${song.lyrics}
            <br>
            <input id="guess-${song.id}" type="text" placeholder="Name of song">
            <button id="song-${song.id}">Submit</button>
            </p>
            <hr>
            `
        })  
        div.addEventListener("click", function(e){
            if(e.target.type === "submit"){
                let idValue = e.target.id.split("-")[1]
                let inputValue = e.target.closest("p").getElementsByTagName("input")[0].value
                let targetObj = songArray.find(obj => obj.id == idValue)
                console.log(targetObj.name === inputValue)
                // console.log(songArray.some(song => song.name == inputValue))
            }
            



        })
    }

})


