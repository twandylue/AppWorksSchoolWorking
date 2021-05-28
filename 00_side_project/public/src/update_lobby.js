function updateLobby (roomInfo) {
    const rooms = document.querySelectorAll(".room");
    for (let i = 0; i < rooms.length; i++) {
        rooms[i].id = roomInfo[i].room_id;
    }
    const roomNames = document.querySelectorAll(".room-name");
    for (let i = 0; i < roomNames.length; i++) {
        roomNames[i].innerHTML = `Room: ${roomInfo[i].room_id}`;
    }
    const roomStates = document.querySelectorAll(".room-state");
    for (let i = 0; i < roomNames.length; i++) {
        const str = `現在人數: ${roomInfo[i].player}/上限人數: ${roomInfo[i].player_limit}/觀戰人數: ${roomInfo[i].watcher}`;
        roomStates[i].innerHTML = str;
    }
    // const roomName = document.querySelector("#room1 .room-name");
    const joinButtons = document.querySelectorAll(".join"); // 房間人數超過上限時，disable button
    for (let i = 0; i < joinButtons.length; i++) {
        if (roomInfo[i].player >= roomInfo[i].player_limit) {
            joinButtons[i].disabled = "disabled";
        }
    }
}

export { updateLobby };
