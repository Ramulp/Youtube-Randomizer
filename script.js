
const VIDEOSELECT = document.getElementById("videoSelect");

let SongIndex = 0;
let SongIds = [];
var FrResult = "";
var array;

document.getElementById('InputFile')
    .addEventListener('change', function () {

        var fr = new FileReader();
        fr.onload = function () {

            FrResult = fr.result;
            getIds("InputFile", FrResult);

        }

        fr.readAsText(this.files[0]);
    })


function getIds(from, data) {

    //document.getElementById('Text')
    //    .textContent = FrResult;
    if (from == "InputFile") {


        array = data.split("\r\n");

        for (var i = 0; i < array.length; i++) {
            SongIds[i] = array[i].substring(0, 11);
        }
    }
    else if (from = "YTList") {

    }


    for (var i = 0; i < array.length; i++) {
        var element = document.createElement("option");
        element.innerText = String(i + 1).padStart(4, '0') + array[i].substring(11, 99);
        element.value = i;
        VIDEOSELECT.appendChild(element);
    }

    if (document.getElementById("CBResumeSession").checked == true && localStorage.getItem("SongIndex") > 0){

        VIDEOSELECT.options.selectedIndex = localStorage.getItem("SongIndex");
        changeVideo(VIDEOSELECT.options.selectedIndex);
    }
    else{
        VIDEOSELECT.options.selectedIndex = 0;
        changeVideo(0)
    }



}


function removeOldVideos() {
    while (VIDEOSELECT.firstChild) {
        VIDEOSELECT.removeChild(VIDEOSELECT.firstChild);
    }
}




function NextSong() {
    SongIndex++;
    changeVideo(SongIndex);
}


function PrevSong() {
    SongIndex--;
    changeVideo(SongIndex);
}





//#region YT API IFRAME

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '360',
        width: '640',
        videoId: 'XmVIRg0Xpxk',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onError
        }
    });
}


//#endregion

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.setVolume(15);
    event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
    //if (event.data == YT.PlayerState.PLAYING && !done) {
    //    setTimeout(stopVideo, 6000);
    //    done = true;
    //}

    if (event.data == YT.PlayerState.ENDED) {
        NextSong();
    }
}


function onError(event) {
    switch (event.data) {
        case 100:
        case 101:
        case 150:
            setTimeout(NextSong, 1000);
            break;
        default:
            console.log("Error en la cancion: " + SongIds[SongIndex])
    }
}

function test() {
    console.log(player.getPlayerState())
}


function stopVideo() {
    player.stopVideo();
}

function changeVideo(index) {
    if (SongIndex != index) {
        SongIndex = index;
        player.loadVideoById(SongIds[SongIndex], 0, 'small');
    }
    else {
        player.loadVideoById(SongIds[SongIndex], 0, 'small');
    }

    VIDEOSELECT.children[SongIndex].selected = true;
    saveIndex(SongIndex);
}









function saveIndex(index) {
    localStorage.setItem("SongIndex", index)
}


