let video = document.querySelector("video")
let recordBtnCont = document.querySelector(".record-btn-cont")
let captureBtnCont = document.querySelector(".capture-btn-cont")
let recordBtn = document.querySelector(".record-btn")
let captureBtn = document.querySelector(".capture-btn")
let transparentColor = "transparent"
let constraints = {
    video:true,
    audio:true
}
let recordFlag = false
let recorder

let chunks = []

navigator.mediaDevices.getUserMedia(constraints)
.then((stream) => {
    video.srcObject = stream
    recorder = new MediaRecorder(stream)
    recorder.addEventListener("start",(e)=>{
        chunks=[];
    })
    recorder.addEventListener("dataavailable",(e)=>{
        chunks.push(e.data)
    })
    recorder.addEventListener("stop",(e)=>{
        //conversion to chunks media data to video
        let blob = new Blob(chunks,{type: "video/mp4"})
        let videoUrl = URL.createObjectURL(blob)
        let a = document.createElement("a")
        a.href = videoUrl
        a.download = "stream.mp4"
        a.click()
    })
})
recordBtnCont.addEventListener("click", (e)=>{
    if (!recorder) {
        return
    }
    recordFlag = !recordFlag
    if (recordFlag) {
        //start
        recorder.start()
        recordBtn.classList.add("scale-record")
        startTimer() 
    } else {
        //stop
        recorder.stop()
        recordBtn.classList.remove("scale-record")
        stopTimer()
    }
})
let timerId
let counter =  0
let timer  = document.querySelector(".timer")
function startTimer() {
    timer.style.display = "block"
    function displayTimer() {
        let totalSeconds = counter
        let hours = Number.parseInt(counter/3600)
        totalSeconds = totalSeconds % 3600 // remaining seconds
        let minutes = Number.parseInt(totalSeconds/60) 
        totalSeconds = totalSeconds%60
        let seconds = totalSeconds

        hours = (hours<10)? `0${hours}` : hours
        minutes = (minutes<10)? `0${minutes}` : minutes
        seconds = (seconds<10)? `0${seconds}` : seconds

        timer.innerText = `${hours}:${minutes}:${seconds}`
        counter++
    }
    timerId = setInterval(displayTimer, 100)
}
function stopTimer() {
    clearInterval(timerId)
    timer.style.display = "none"
    timer.innerText = "00:00:00"
}
//videos is a collection of frames
captureBtnCont.addEventListener("click",(e)=>{
    let canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoWidth
    let tool = canvas.getContext("2d")
    tool.drawImage(video, 0, 0, canvas.width, canvas.height)
    //filter
    tool.fillStyle = transparentColor
    tool.fillRect(0,0,canvas.width, canvas.height)
    let imageURL = canvas.toDataURL();
    let a = document.createElement("a")
    a.href = imageURL
    a.download = "image.jpg"
    a.click()
})



//filtering
let allFilters = document.querySelectorAll(".filter")
let filterLayer = document.querySelector(".filter-layer")
allFilters.forEach(filterElem => {
    filterElem.addEventListener("click",(e)=>{
        transparentColor = getComputedStyle(filterElem).getPropertyValue("background-color")
        filterLayer.style.backgroundColor = transparentColor
    })
});

