document.addEventListener("DOMContentLoaded", function(e){
    let startGameButton = document.querySelector("#startgame")
    let recentScoresGameButton = document.querySelector("#recent_scores")
    let listOfArtists = ["Frank Ocean", "Frank Sinatra"] // we place authors here so we can get some random famous songs from different authors
    let songChoiceNum = 50 // change this to have more songs or less songs from each artist
    let Game = {
                    maxStrikes: 3,
                    currentStrikes: 0,
                    currentQ: 0,
                    correct: 0
                }
    let modal = document.querySelector("#modal");
    let modalContent = document.querySelector("#modalContent")
    let submitName = document.querySelector("#endGameForm")
    let lifeCount = document.querySelector("#lives")
    let scoreboard = document.querySelector("#scoreboard")
    let options = document.querySelector("#options")

submitName.addEventListener("submit", e => {
    fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "name": e.target[0].value,
            "score": Game.correct
        })
    })
})


    document.addEventListener("click", function(e){
        if (e.target.className === "frankie-button"){
            if(!song.lyrics){
                playGame()
            }
            let userInput = e.target.innerText
            document.getElementById("the_lyrics").remove()
            document.getElementById("choices").remove()

            console.log(song.artist.toLowerCase())

            if (userInput.toLowerCase().includes(song.artist.toLowerCase())){
                alert("Correct")
                Game.currentQ +=1
                Game.correct +=1 
                playGame()
            }
            else {
                alert(`Incorrect. The answer was ${song.artist.toLowerCase()}`)
                Game.currentStrikes += 1
                lifeCount.innerText = `Lives: ${Game.maxStrikes - Game.currentStrikes}`
                Game.currentQ += 1
                playGame()
            }
        }
        else if (e.target.id === "startgame"){
            startGameButton.remove()
            recentScoresGameButton.remove()
            lifeCount.innerText = "Lives: 3"
            
            playGame()
        }
        else if (e.target.id === "recent_scores"){
            startGameButton.remove()
            recentScoresGameButton.remove()
            fetch("http://localhost:3000/games").then(resp => resp.json()).then(games => {
                let scoreboardList = document.createElement("ul")
                scoreboard.appendChild(scoreboardList).setAttribute("id", "scoreboard_list")
                // let winnerWinnerChickenDinner = `<h2>Winner Winner Chicken Dinner</h2>`
                // let youSuck = `<h2>You Suck!</h2>`
                let returnMenu = `<button id="return"><- Go Back</button>`
                console.log(games.data.sort(function(a, b){a.attributes.score > b.attributes.score ? 1 : -1}))
                // scoreboardList.insertAdjacentHTML("afterbegin", winnerWinnerChickenDinner)
                // console.log(games.data)
                games.data.forEach(function(game){
                    let gameDisplayHTML = `<li>${game.attributes.user.name}: ${game.attributes.score} Frank(s)</li>`
                    scoreboardList.insertAdjacentHTML("beforeend", gameDisplayHTML)
                })
                // scoreboardList.insertAdjacentHTML("beforeend", youSuck)
                scoreboardList.insertAdjacentHTML("afterend", returnMenu)
            })
        }
        else if (e.target.id === "return"){
            options.appendChild(startGameButton)
            options.appendChild(recentScoresGameButton)
            document.getElementById("scoreboard_list").remove()
            document.getElementById("return").remove()
        } 

    })


    function playGame(){
        console.log(Game)
        if (Game.currentStrikes === Game.maxStrikes){
            modal.style.display = "block";
            let endGameHTML = `<p>Game Over you got ${Game.correct} Franks. Enter Your Name.</p>            `
            modalContent.insertAdjacentHTML("afterbegin", endGameHTML)
            // Game.currentQ = 0
            // Game.correct = 0
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
        console.log(artist_string)
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
            console.log(track.artist_name)
            if (data.message.body.lyrics && data.message.body.lyrics.lyrics_body.length > 1 && (track.artist_name === "Frank Zappa" || track.artist_name === "Frank Ocean" || track.artist_name === "Frank Sinatra")){
                song.lyrics = data.message.body.lyrics.lyrics_body
                displayLyrics(song)

                console.log("GOT LYRICS")
            }
            else {
                getNewArtist()
                // console.log("GOT NEW ARTIST")
            }
        })
    }

    function displayLyrics(song){
        let timer = false
        let index = 0
        let choicesDiv = document.querySelector("#choices")
        let div = document.querySelector("#lyrics")
        let splitLyrics = song.lyrics.split("***")[0].split(/[\s↵]/)
        let buttonChoices = `
        <button class="frankie-button" disabled>Frank Zappa</button>
        <button class="frankie-button">Frank Ocean</button>
        <button class="frankie-button">Frank Sinatra</button>
        `
        div.insertAdjacentHTML("beforeend", buttonChoices)
        console.log(splitLyrics)
        console.log(splitLyrics.length - 1)
        splitLyrics.forEach(() => {
            if (timer === false){
                console.log(index < splitLyrics.length)
                setInterval(displayWord, 500)
    
                    function displayWord(){
                        if (index < splitLyrics.length){
                            div.insertAdjacentHTML("beforeend", splitLyrics[index] + " ") 
                            timer = false
                            console.log(index)
                            index++
                        }
                    }
    
                timer = true
            }
        })
    }




//DOM

})

/*
MAJOR BUGS

- songs STILL occasionally come with no lyrics/body of undefined
- frank Zappa ALL songs are 404 

MINOR ISSUES

- need css 

*/


