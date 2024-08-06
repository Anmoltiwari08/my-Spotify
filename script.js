console.log("getting started");
let currentSong = new Audio()
let allSongs
let songs;
let currentTrack
let playPause
let play = document.querySelector('.play')
let previous = document.querySelector('.previous')
let next = document.querySelector('.next')
let isPlaying = false;


async function getSongs(folder) {
   fetch(`/songs/${folder}`)
      .then((res) => res.text()
      )
      .then((res) => {

         let div = document.createElement('div')
         div.innerHTML = res

         let anchortag = div.getElementsByTagName('a')

         songs = []

         for (let index = 0; index < anchortag.length; index++) {
            const element = anchortag[index];
            // console.log(element.href);

            if (element.href.endsWith('.mp3')) {
               songs.push(element.href.split(`${folder}/`)[1])

            }

         }

         // show hamberger for the responsive evetn 

         const leftElement = document.querySelector('.left');

         // window.addEventListener('resize', checkScreenWidthForResponsive);
 
         function checkScreenWidthForResponsive() {
            if (window.innerWidth < 1300) {
               leftElement.style.transform = "translate(0)";
               window.removeEventListener('resize', checkScreenWidthForResponsive);
               console.log("done");
               
            }
         }
         checkScreenWidthForResponsive()

         let songUl = document.querySelector('.shown-library').getElementsByTagName('ul')[0]
         songUl.innerHTML = ""
         for (const song of songs) {
            songUl.innerHTML += `<li>
                        <img src="/img/music.svg" width="34" class="invert">
                        <div class="info">
                          ${song.replaceAll("%20", " ")}
                        </div>
                        <div class="playnow">
                            <!-- <span>Play now</span> -->
                            <img src="/img/play.svg" class="invert" alt="">
                        </div>
                    </li>`
         }

         allSongs = Array.from(document.querySelectorAll('.shown-library>ul li'))

         allSongs.forEach((e) => {
            e.addEventListener('click', item => {
               let track = e.querySelector('.info').innerHTML.trim()
               playPause = e.querySelector('.playnow > img')
               // console.log(playPause);

               playmusic(track, folder, playPause)

               let songinfo = document.querySelector('.song-info')
               songinfo.innerHTML = track
               // console.log(track);

            })
            if (e.querySelector('.info').innerHTML.trim() === currentTrack) {
               if (isPlaying) {
                  e.querySelector('.playnow > img').src = '/img/pause.svg'

               }
               else {
                  e.querySelector('.playnow > img').src = '/img/play.svg'
               }
            }

         })

      })
      .catch((err) => {
         console.log("error generatd is ", err);
      }
      )
}

function playmusic(track, folder) {
   // Set the source for the current song
   let allimgsrc = Array.from(document.querySelectorAll('.shown-library>ul li> .playnow >img'))
   allimgsrc.forEach((img) => {

      img.src = '/img/play.svg'

   })

   // Check if the selected track is different from the currently playing track
   if (currentTrack !== track) {
      currentSong.src = `/songs/${folder}/` + track;
      currentSong.play()
      currentTrack = track;
      isPlaying = true
      playPause.src = '/img/pause.svg'
      play.src = '/img/pause.svg'

   } else {
      // If the same track is selected
      if (currentSong.paused) {
         currentSong.play(); // Play if paused
         playPause.src = '/img/pause.svg'
         play.src = '/img/pause.svg'
         isPlaying = true

      } else {
         currentSong.pause(); // Pause if playing
         playPause.src = '/img/play.svg'
         play.src = '/img/play.svg'
         isPlaying = false

      }

   }

}

async function displayAlbums() {
   fetch('/songs/')
      .then((res) => res.text())
      .then(async res => {

         let div = document.createElement('div')
         div.innerHTML = res
          console.log(res);
          
         let anchortag = div.getElementsByTagName('a')

         let cardRow = document.querySelector('.card-row')

         let array = Array.from(anchortag)
         for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if (element.href.includes('/songs/')) {
               let foldername = element.href.split('/songs/')[1]
               let data = await fetch(`/songs/${foldername}/info.json`)
               let res = await data.json()

               cardRow.innerHTML += `
                          <div data-folder="${foldername}" class="card-box flex  " >
                            <div  class="card-img">
                              <img src="songs/${foldername}/cover.jpeg" alt="">
                            </div>
                            <h3>${res.Title}</h3> 
                            <p>${res.Description}</p> 
                            <div class="play-icon">
                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                             color="#0c0c0c" fill="none">
                                           <circle cx="12" cy="12" r="10" stroke="" stroke-width="1.5" fill="#1ed760" />
                                         <path
                                           d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z"
                                           fill="currentColor" />
                                   </svg>
                            </div>
                          </div>
                        `;

            }

         }

         let card = Array.from(document.querySelectorAll('.card-box'))
         console.log("cards are", card);

         for (const item of card) {
            item.classList.add('cursor')
         }

         let box = document.getElementsByClassName('card-box')
         Array.from(box).forEach((e) => {

            e.addEventListener('click', async (item) => {
               // console.log(item.currentTarget.dataset.folder);
               await getSongs(item.currentTarget.dataset.folder)

            })
         })
      }

      ).catch(err => {
         console.log("Error is", err);
      })

}

function playPausebutton() {
   play.addEventListener('click', (item) => {
      if (currentSong.paused) {
         playPause.src = '/img/pause.svg'
         // console.log(playPause.src);

         play.src = '/img/pause.svg'
         currentSong.play()
         // console.log("songs played ");

         isPlaying = true
         // console.log(playPause);

         allSongs.forEach((e) => {
            if (e.querySelector('.info').innerHTML.trim() === currentTrack) {
               e.querySelector('.playnow > img').src = '/img/pause.svg'
               // console.log(e.querySelector('.playnow > img').src);

            }
         })

      }
      else {
         play.src = '/img/play.svg'
         playPause.src = '/img/play.svg'
         // console.log(playPause.src);
         // console.log(playPause);


         // console.log(playPause.src);
         currentSong.pause()
         // console.log("songs paused");

         isPlaying = false
         // console.log(playPause);

         allSongs.forEach((e) => {
            if (e.querySelector('.info').innerHTML.trim() === currentTrack) {
               e.querySelector('.playnow > img').src = '/img/play.svg'
               // console.log(e.querySelector('.playnow > img').src);
            }
         })

      }
   }
   )
}

function minuteTosecond(seconds) {
   if (isNaN(seconds) || seconds < 0) {
      return "00:00";
   }

   const minute = Math.floor(seconds / 60)
   const second = Math.floor(seconds % 60)

   const formattedMinutes = String(minute).padStart(2, '0')
   const formattedSeconds = String(second).padStart(2, '0')

   // console.log(`${formattedMinutes}:${formattedSeconds}`);

   return `${formattedMinutes}:${formattedSeconds}`

}

function main() {
   // funtion to display all albums 
   displayAlbums()

   // play pause buttton in seekbar 
   playPausebutton()

   // time update function as song increasing or completing 
   currentSong.addEventListener('timeupdate', (item) => {
      document.querySelector('.song-time').innerHTML = `${minuteTosecond(currentSong.currentTime)}/${minuteTosecond(currentSong.duration)}`
      document.querySelector('.circle').style.left = (currentSong.currentTime / currentSong.duration) * 100 + '%'

   })

   // seekbar update functionality
   document.querySelector('.seekbar').addEventListener('click', (e) => {
      let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
      document.querySelector('.circle').style.left = percent + '%'
      currentSong.currentTime = (percent * currentSong.duration) / 100

   })

   // function to previous songs play
   previous.addEventListener('click', (e) => {
      currentSong.pause()
      let folder = currentSong.src.split('/').slice(-2)[0]
      let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])
      let nextTrack = songs[index - 1]
      let songinfo = document.querySelector('.song-info')
      songinfo.innerHTML = nextTrack.replaceAll('%20', " ")
      allSongs.forEach((e) => {
         if (e.querySelector('.info').innerHTML.trim() == nextTrack.replaceAll('%20', " ")) {
            playPause = e.querySelector('.playnow > img')

         }
      })

      playmusic(nextTrack.replaceAll('%20', " "), folder)

   })

   // function to next songs play
   next.addEventListener('click', (e) => {
      currentSong.pause()
      let folder = currentSong.src.split('/').slice(-2)[0]

      let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])
      let nextTrack = songs[index + 1]

      let songinfo = document.querySelector('.song-info')
      songinfo.innerHTML = nextTrack.replaceAll('%20', " ")
      allSongs.forEach((e) => {
         if (e.querySelector('.info').innerHTML.trim() == nextTrack.replaceAll('%20', " ")) {
            playPause = e.querySelector('.playnow > img')
         }
      })

      playmusic(nextTrack.replaceAll('%20', " "), folder)


   })

   // volume increase and decrease 
   document.querySelector('.soundbar').getElementsByTagName('input')[0].addEventListener('change', (e) => {
      console.log(e.target.value);
      console.log(e.target.value / 100);
      currentSong.volume = e.target.value / 100

   })

   // mute or volume the song audio
   document.querySelector('.sound >img').addEventListener('click', (e) => {
      console.log(e.target.src.includes('/img/volume'));
      if (e.target.src.includes('/img/volume.svg')) {
         e.target.src = e.target.src.replace('volume.svg', 'mute.svg')
         currentSong.volume = 0
         document.querySelector("#range").value = 0;
      }
      else {
         e.target.src = e.target.src.replace('mute.svg', 'volume.svg')
         currentSong.volume = 0.5
         document.querySelector("#range").value = 10;
      }

   })

   // js for showing hamberger 
   document.querySelector('.hamberger').addEventListener('click', () => {
      document.querySelector('.left').style.transform = "translate(0%)"
   })


   // problem related to hambeger 
   const leftElement = document.querySelector('.left');
   const crossElement = document.querySelector('.cross');

   crossElement.addEventListener('click', () => {
      leftElement.style.transform = "translate(-100%)";
      window.addEventListener('resize', checkScreenWidth);
   });

   function checkScreenWidth() {
      if (window.innerWidth > 1300) {
         leftElement.style.transform = "translate(0)";
         window.removeEventListener('resize', checkScreenWidth);
      }
   }

   // When the current song ends, move to the next song or stop
   currentSong.addEventListener('ended', () => {
      let folder = currentSong.src.split('/').slice(-2)[0];
      console.log(folder);

      let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0]);
      console.log(index);

      // console.log(currentTrack);

      let nextTrack = songs[index + 1];
      console.log(nextTrack);

      if (nextTrack) {
         // If there is a next track, play it
         let songinfo = document.querySelector('.song-info');
         songinfo.innerHTML = nextTrack.replaceAll('%20', " ");
         playPause = allSongs[index + 1].querySelector('.playnow > img');
         playmusic(nextTrack.replaceAll('%20', " "), folder);
      } else {
         // If it's the last track, stop the playback
         isPlaying = false;
         play.src = '/img/play.svg';
         playPause.src = '/img/play.svg';
         console.log("Playback stopped. Last song has ended.");
      }
   });




}

main()
