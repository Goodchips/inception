var socket;

window.onload = function() {

    var messages = [];
    socket = io.connect(window.location.href);
    var chat = document.getElementById("chat");
    var sendButton = chat.getElementsByClassName("send");
    var content = document.getElementById("content");

    socket.on('message', function (data) {
        if(data.message) {
            messages.push(data);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
                html += messages[i].message + '<br />';
            }
            content.innerHTML = html;
            content.scrollTop = content.scrollHeight;
            console.log(html);
        } else {
            console.log("There is a problem:", data);
        }
    });
    socket.on('refreshUserList', function(data){
	    document.getElementById("userlist").innerHTML = "";
	    for (var user in data){
		    document.getElementById("userlist").innerHTML += data[user]+'<br>';
	    }
    });
    socket.emit('login',document.getElementsByClassName("name")[0].value);
}

function sendMessage() {
	var text = document.getElementsByClassName("field")[0];
	var name = document.getElementsByClassName("name")[0];
    socket.emit('send', { message: text.value, username: name.value });
    text.value = "";
}
function checkInput(evt){
	if(evt.keyCode == 13) {
        sendMessage();
    }
}
function drag(target, evt) {
	evt.dataTransfer.setData("Text", target.id);
	evt.dataTransfer.setDragImage(document.createElement("img"),0,0);
	var pepito = target.firstElementChild.style.top+"   "+target.firstElementChild.style.left;
}
function dragEnter(target,evt){
	target.classList.remove("dreamer-2");
	target.classList.add("dreamer-2-drop");
}
function dragLeave(target,evt){
	target.classList.remove("dreamer-2-drop");
	target.classList.add("dreamer-2");
}
function drop(target, evt) {
	var id = evt.dataTransfer.getData("Text");
	target.appendChild(document.getElementById(id));
	evt.preventDefault();
}
function supprime(target){
	target.parentNode.removeChild(target);
}
function duplicate(target,evt){
	var cardClone = target.cloneNode(false);
	cardClone.id = target.id + "-" + evt.timeStamp;
	document.getElementById("test").appendChild(cardClone);
}
function duplicateAndTransform(evt){
	evt.preventDefault();
	var formatBGC = document.getElementById("img-bg-color").value;
	var formatR = document.getElementById("img-rotate").value;
	var formatS = document.getElementById("img-scale").value;
	formatS = (formatS == "" || formatS == "0") ? 1 : formatS;
	var formatH = document.getElementById("orientation-horizontal");
	var formatV = document.getElementById("orientation-vertical");
	var idClone = formatH.checked ? formatH.value : formatV.value;
	var cardClone = document.getElementById(idClone).cloneNode(true);
	cardClone.id += "-" + evt.timeStamp;

	cardClone.firstElementChild.style.backgroundColor = formatBGC;
	cardClone.firstElementChild.style.transform = "rotate("+formatR+"deg) ";
	cardClone.firstElementChild.style.transform += "scale("+formatS+") ";
	cardClone.firstElementChild.style.webkitTransform = "rotate("+formatR+"deg) ";
	cardClone.firstElementChild.style.webkitTransform += "scale("+formatS+") ";

	document.getElementById("test").appendChild(cardClone);
	if (formatR == "0" || formatR == "180"){
		cardClone.firstElementChild.style.top = (-1 * cardClone.offsetHeight * (1 - formatS) / 2) + "px";
		cardClone.firstElementChild.style.left = (-1 * cardClone.offsetWidth * (1 - formatS) / 2) + "px";
		cardClone.style.width = cardClone.offsetWidth * formatS + "px";
		cardClone.style.height = cardClone.offsetHeight * formatS + "px";
	}
	else if (formatR == "90" || formatR == "270"){
		var h = cardClone.offsetHeight;
		var w = cardClone.offsetWidth;
		cardClone.firstElementChild.style.top = (-1 * Math.abs(h - w * formatS) / 2) + "px";
		cardClone.firstElementChild.style.left = (formatS == 1) ? (1 * Math.abs(w - h * formatS) / 2) + "px" : (-1 * Math.abs(w - h * formatS) / 2) + "px";
		cardClone.style.width = h * formatS + "px";
		cardClone.style.height = w * formatS + "px";
	}
}
function clickHandler(el,evt){
	evt.preventDefault();
	switch(evt.button){
		case 0:
			var cardClone = el.cloneNode(false);
			cardClone.id = el.id + "-" + evt.timeStamp;
			document.getElementById("test").appendChild(cardClone);
		break;
		case 2:
			el.parentNode.removeChild(el);
		break;
	}
}