let db;

let openRequest = indexedDB.open("myDatabase");
openRequest.addEventListener("success",e=>{

    db = openRequest.result;
})
openRequest.addEventListener("error",e=>{

    console.log("DB error");
})
openRequest.addEventListener("upgradeneeded",e=>{

    db = openRequest.result;

    db.createObjectStore("video",{keyPath:"id"});
    db.createObjectStore("image",{keyPath:"id"});
})