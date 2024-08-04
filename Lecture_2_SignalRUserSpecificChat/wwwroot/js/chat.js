"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, message) {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    li.textContent = `${user} says ${message}`;
});

connection.start().then(function () {
    console.log("Connection started");
}).catch(function (err) {
    console.error("Connection failed:", err.toString());
});

document.getElementById("registerButton").addEventListener("click", function () {
    var username = document.getElementById("usernameInput").value;
    if (username === "") {
        console.error("Username is required");
        return;
    }
    connection.invoke("Register", username).then(function () {
        document.getElementById("sendButton").disabled = false;
        var li = document.createElement("li");
        document.getElementById("messagesList").appendChild(li);
        li.textContent = `Registered as ${username}`;
    }).catch(function (err) {
        console.error("Failed to register user:", err.toString());
    });
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var targetUser = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;

    connection.invoke("SendMessageToUser", targetUser, message).catch(function (err) {
        console.error("Failed to send message:", err.toString());
    });
    event.preventDefault();
});
