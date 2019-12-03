document.addEventListener("DOMContentLoaded", function(e){
let nameOfSongs = []
let idOfSongs = []
let userList = document.querySelector("#userlist")

    fetch("http://localhost:3000/users").then(function(resp){return resp.json()}).then(function(data){
        data.forEach(function(name){
            let newListItem = `<li id=${name.id}> ${name.name} </li>`
            userList.insertAdjacentHTML("beforeend", newListItem);
        })
    })

    fetch("https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.search?format=json&q_artist=Beatles&f_artist_id=160&f_lyrics_language=en&s_track_rating=desc&quorum_factor=1&page_size=50&page=1&apikey=47143ce136469bce4ddc6c04e13ec917")
    .then(function(resp)
    {
        return resp.json()
    }).then(function(data){
        data.message.body.track_list.forEach(function(song){
            let songName = song.track.track_name
            let songId = song.track.track_id

            if(songName.includes("-")){
                let i = songName.indexOf("-")
                songName = songName.slice(0, i).trim()
            }
            else if(songName.includes("(")){
                let i = songName.indexOf("(")
                songName = songName.slice(0, i).trim()
            }
            // need to fix this if statement

            if(!nameOfSongs.includes(songName))
            {
                nameOfSongs.push(songName)
                idOfSongs.push(songId)
            }
            console.log(nameOfSongs)
            
        })
    })
        
        // data.message.body.track_list.forEach(function(songInfo){
        //     let newListItem = `<li id=${songInfo.track_id}> ${songInfo.track_name} </li>`
        //     userList.insertAdjacentHTML("beforeend", newListItem)
        // })
    
    // dont forget to remove API key before pushing to git

})


// GOAL
// we choose authors,
// from that fetch few famous songs and needs to be filtered by unique names, 
// from those names collect the ID and then fetch again for the lyrics of the song
// put lyrics and *maybe put in a timer to slowly add in lyrics