const firebaseConfig = {
apiKey: "AIzaSyAi9Fpm0AYulvJjiu__lTjP-xwfFpzIsck",
authDomain: "moxmessenger-6a5ba.firebaseapp.com",
databaseURL: "https://moxmessenger-6a5ba-default-rtdb.firebaseio.com/",
projectId: "moxmessenger-6a5ba",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let room = "";
let userId = Math.random().toString(36).substring(2);

function joinRoom(){

let code = document.getElementById("roomCode").value;

if(code.length !== 4){
alert("Kode harus 4 digit");
return;
}

let roomRef = db.ref("rooms/"+code+"/users");

roomRef.once("value",snap=>{

let users = snap.val();

if(!users){

roomRef.child(userId).set(true);
startChat(code);

}

else{

let count = Object.keys(users).length;

if(count >= 2){
alert("Room sudah dipakai");
return;
}

roomRef.child(userId).set(true);
startChat(code);

}

});

}

function startChat(code){

room = code;

document.getElementById("login").style.display="none";
document.getElementById("chat").style.display="block";

let userRef = db.ref("rooms/"+room+"/users/"+userId);

userRef.onDisconnect().remove();

checkRoomEmpty();

listenMsg();

}

function sendMsg(){

let text = document.getElementById("msg").value;

if(text=="") return;

db.ref("rooms/"+room+"/messages").push({
user:userId,
msg:text,
time:Date.now()
});

document.getElementById("msg").value="";
}

function listenMsg(){

db.ref("rooms/"+room+"/messages").on("child_added",snap=>{

let data = snap.val();

let div = document.createElement("div");
div.className="msg";

if(data.user==userId){
div.innerHTML="You: "+data.msg;
}else{
div.innerHTML="Stranger: "+data.msg;
}

document.getElementById("messages").appendChild(div);

});

}

function clearChat(){

db.ref("rooms/"+room+"/messages").remove();

document.getElementById("messages").innerHTML="";

}

function checkRoomEmpty(){

db.ref("rooms/"+room+"/users").on("value",snap=>{

let users = snap.val();

if(!users){

db.ref("rooms/"+room).remove();

}

});

}