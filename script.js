
const VIDEOSELECT = document.getElementById("videoSelect");
//const MUSICA_RARA_ID = 


let SongIndex = 0;
let SongIds = [];
var FrResult = "";
var inputFileArray;

document.getElementById('InputFile')
    .addEventListener('change', function () {

        var fr = new FileReader();
        fr.onload = function () {

            FrResult = fr.result;
            getIds("InputFile", FrResult);

        }

        fr.readAsText(this.files[0]);
})

function LoadSession(){
    
    if (document.getElementById("CBResumeSession").checked == true && localStorage.getItem("SongIndex").length > 0 && localStorage.getItem("SongIdTitle").length > 0){

        inputFileArray = localStorage.getItem("SongIdTitle");
        getIds("PreviousSession", inputFileArray);
        VIDEOSELECT.options.selectedIndex = localStorage.getItem("SongIndex");
        changeVideo(VIDEOSELECT.options.selectedIndex);
    }
}

function Shuffle(){

    if (inputFileArray.length != 0){
        for (let i = inputFileArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = inputFileArray[i];
            inputFileArray[i] = inputFileArray[j];
            inputFileArray[j] = temp;
        }
    }

    for (var i = VIDEOSELECT.children.length; i > 0; i--) {
        VIDEOSELECT.removeChild(VIDEOSELECT.lastChild);
    }
    
    for (var i = 0; i < inputFileArray.length; i++) {
        var element = document.createElement("option");
        element.innerText = String(i + 1).padStart(4, '0') + inputFileArray[i].substring(11, 99);
        element.value = i;
        VIDEOSELECT.appendChild(element);
    }
    
    for (var i = 0; i < inputFileArray.length; i++) {
        SongIds[i] = inputFileArray[i].substring(0, 11);
    }

    changeVideo(0)

    
    var SongIdTitle = "";
    for (var i = 0; i < inputFileArray.length; i++) {
        SongIdTitle += inputFileArray[i] + "\\\\-//";
    }
    localStorage.setItem("SongIdTitle", SongIdTitle)
}

function getIds(from, data) {


    //document.getElementById('Text')
    //    .textContent = FrResult;
    if (from == "InputFile") {

        

        inputFileArray = data.split("\r\n");

        for (var i = 0; i < inputFileArray.length; i++) {
            SongIds[i] = inputFileArray[i].substring(0, 11);
        }
    }
    else if (from == "PreviousSession") {

        

        inputFileArray = data.split("\\\\-//");

        for (var i = 0; i < inputFileArray.length; i++) {
            SongIds[i] = inputFileArray[i].substring(0, 11);
        }
    }
    else if (from == "YTList") {

    }
    else if( document.getElementById("InputFile").files.length == 0 ){
        console.log("no files selected");

        var fr = new FileReader();
        
        fr.readAsText("Musica_rara_ID.txt");
        
        data = fr.result;

        console.log(data);

        inputFileArray = data.split("\r\n");

        for (var i = 0; i < inputFileArray.length; i++) {
            SongIds[i] = inputFileArray[i].substring(0, 11);
        }

    }


    for (var i = 0; i < inputFileArray.length; i++) {
        var element = document.createElement("option");
        element.innerText = String(i + 1).padStart(4, '0') + inputFileArray[i].substring(11, 99);
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

    var SongIdTitle = "";
    for (var i = 0; i < inputFileArray.length; i++) {
        SongIdTitle += inputFileArray[i] + "\\\\-//";
    }

    localStorage.setItem("SongIdTitle", SongIdTitle)
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


