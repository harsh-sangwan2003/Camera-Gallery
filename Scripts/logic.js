let video = document.querySelector('video');
let recordBtnCont = document.querySelector('.record-btn-cont');
let recordBtn = document.querySelector('.record-btn');
let captureBtnCont = document.querySelector('.capture-btn-cont');
let captureBtn = document.querySelector('.capture-btn');
let timer = document.querySelector('.timer');
let filterCont = document.querySelector('.filter-cont');
let allFilterColors = document.querySelectorAll('.filter');
let filterLayer = document.querySelector('.filter-layer');
let span = document.querySelector('span');

let recordFlag = false;
let recorder;
let chunks = [];
let transparentColor = "transparent";
const constraints = {

    audio:true,
    video:true
}

navigator.mediaDevices.getUserMedia(constraints)
.then(stream=>{

    video.srcObject = stream;

    recorder = new MediaRecorder(stream);

    recorder.addEventListener("start",e=>{

        chunks = [];
        startTimer();
    })

    recorder.addEventListener("dataavailable",e=>{

        chunks.push(e.data);
    })

    recorder.addEventListener("stop",e=>{

        let blob = new Blob(chunks,{type:"video/mp4"});
        let videoUrl = URL.createObjectURL(blob);

        if(db){

            let videoId = shortid();
            
            let dbTransaction = db.transaction("video","readwrite");
            let videoStore = dbTransaction.objectStore("video");
            let videoEntry = {

                id:`vid-${videoId}`,
                blobData:blob
            };

            videoStore.add(videoEntry);

        }

        stopTimer();
    })


})

recordBtnCont.addEventListener("click",e=>{

    if(!recorder) return;

    recordFlag = !recordFlag;

    if(recordFlag){

        //Start recording
        recorder.start();
        recordBtn.classList.add("scale-record");
    }

    else{

        //Stop recording
        recorder.stop();
        recordBtn.classList.remove("scale-record");
    }
})

let counter = 0;
let timerID;

function startTimer(){

    timer.style.display = "block";

    function displayTimer(){

        counter++;

        let totalSeconds = counter;

        let hours = Number.parseInt(totalSeconds/3600);
        totalSeconds%=3600;

        let minutes = Number.parseInt(totalSeconds/3600);
        totalSeconds%=3600;

        let seconds = totalSeconds;

        hours = (hours<10)?`0${hours}`:hours;
        minutes = (minutes<10)?`0${minutes}`:minutes;
        seconds = (seconds<10)?`0${seconds}`:seconds;

        timer.innerText = `${hours}:${minutes}:${seconds}`;
    }

    timerID = setInterval(displayTimer,1000);
}

function stopTimer(){

    clearInterval(timerID);
    timer.innerText = `00:00:00`;
}

captureBtnCont.addEventListener("click",e=>{

    captureBtn.classList.add("scale-record");

    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    let tool = canvas.getContext("2d");
    tool.drawImage(video,0,0,canvas.width,canvas.height);

    //Filtering
    tool.fillStyle = transparentColor;
    tool.fillRect(0,0,canvas.width,canvas.height);

    let imageURL = canvas.toDataURL();

    if(db){

        let imgId = shortid();
        
        let dbTransaction = db.transaction("image","readwrite");
        let imgStore = dbTransaction.objectStore("image");
        let imgEntry = {

            id:`img-${imgId}`,
            url:imageURL
        };

        imgStore.add(imgEntry);

    }

    setTimeout(() => {
        captureBtn.classList.remove("scale-record");
    }, 500);

})

allFilterColors.forEach(colorEle=>{

    colorEle.addEventListener("click",e=>{

        transparentColor = getComputedStyle(colorEle).getPropertyValue('background-color');
        filterLayer.style.backgroundColor = transparentColor;
    })
})

span.addEventListener("click",e=>{

    location.href = "./gallery.html";
})