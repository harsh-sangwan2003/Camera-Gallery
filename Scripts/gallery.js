let backBtn = document.querySelector('.back');

backBtn.addEventListener("click",e=>{

    location.href = "./index.html";
})

setTimeout(()=>{

    if(db){

        let videoDBtransaction = db.transaction("video","readonly");
        let videoStore = videoDBtransaction.objectStore("video");

        //event driven
        let videoRequest = videoStore.getAll();
        videoRequest.onsuccess = (e)=>{

            let videoResult = videoRequest.result;
            let galleryCont = document.querySelector('.gallery-cont');

            videoResult.forEach(videoObj=>{

                let mediaEle = document.createElement("div");
                mediaEle.setAttribute("class","media-cont");
                mediaEle.classList.add("hover");
                mediaEle.setAttribute("id",videoObj.id);

                let url = URL.createObjectURL(videoObj.blobData);

                mediaEle.innerHTML = `
                <div class="media">
                <video src="${url}" autoplay loop></video>
                </div>
                <div class="delete action-btn">Delete</div>
                <div class="download action-btn">Download</div>
                `;

                galleryCont.appendChild(mediaEle);

                let deleteBtn = mediaEle.querySelector('.delete')
                let downloadBtn = mediaEle.querySelector('.download');
                deleteBtn.addEventListener("click",deleteCard);
                downloadBtn.addEventListener("click",downloadCard);
            })
        }

        let imgDBTransaction = db.transaction("image","readonly");
        let imgStore = imgDBTransaction.objectStore("image");

        //event driven
        let imgRequest = imgStore.getAll();
        imgRequest.onsuccess = (e)=>{

            let imgResult = imgRequest.result;
            let galleryCont = document.querySelector('.gallery-cont');

            imgResult.forEach(imgObj=>{

                let mediaEle = document.createElement("div");
                mediaEle.setAttribute("class","media-cont");
                mediaEle.classList.add("hover");
                mediaEle.setAttribute("id",imgObj.id);

                let url = imgObj.url;

                mediaEle.innerHTML = `
                <div class="media">
                <img src="${url}"/>
                </div>
                <div class="delete action-btn">Delete</div>
                <div class="download action-btn">Download</div>
                `;

                galleryCont.appendChild(mediaEle);

                let deleteBtn = mediaEle.querySelector('.delete')
                let downloadBtn = mediaEle.querySelector('.download');
                deleteBtn.addEventListener("click",deleteCard);
                downloadBtn.addEventListener("click",downloadCard);
            })
        }
    }
},100);


function deleteCard(e){

    //DB Removal
    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0,3);

    if(type==="vid"){

        let videoDBtransaction = db.transaction("video","readwrite");
        let videoStore = videoDBtransaction.objectStore("video");

        videoStore.delete(id);
    }

    else if(type==="img"){

        let imgDBTransaction = db.transaction("image","readwrite");
        let imgStore = imgDBTransaction.objectStore("image");

        imgStore.delete(id);
    }

    //UI Removal
    e.target.parentElement.remove();
}

function downloadCard(e){

    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0,3);
    
    if(type==="vid"){

        let videoDBtransaction = db.transaction("video","readwrite");
        let videoStore = videoDBtransaction.objectStore("video");
        let videoRequest = videoStore.get(id);

        videoRequest.onsuccess = (e)=>{

            let videoResult = videoRequest.result;

            let url = URL.createObjectURL(videoResult.blobData);

            let a = document.createElement("a");
            a.href = url;
            a.download = "stream.mp4";
            a.click();
        }
    }

    else if(type==="img"){

        let imgDBTransaction = db.transaction("image","readwrite");
        let imgStore = imgDBTransaction.objectStore("image");
        let imgRequest = imgStore.get(id);

        imgRequest.onsuccess = (e)=>{

            let imgResult = imgRequest.result;

            let a = document.createElement("a");
            a.href = imgResult.url;
            a.download = "img.jpg";
            a.click();
        }
        
    }
}