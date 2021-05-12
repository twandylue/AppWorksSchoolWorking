const music = document.querySelector("#music");
music.addEventListener("change", () => {
    const song = document.querySelector("#music option:checked");
    console.log(song);
});

const submitName = document.querySelector("#submit_name");
submitName.addEventListener("click", () => {
    const name = document.querySelector("#input_name");
    const removeItem = document.querySelector("#input");
    removeItem.remove();
    const userName = document.createElement("div");
    userName.id = "main_user_name";
    userName.innerHTML = name.value;
    const userContainer = document.querySelector("#user_container");
    userContainer.append(userName);
});

const start = document.querySelector("#start");
start.addEventListener("click", () => {
    const type = document.querySelector("#type option:checked");
    const number = document.querySelector("#number_of_cards option:checked");
    const rounds = document.querySelector("#rounds option:checked");
    const targets = document.querySelectorAll(".target_item");
    for (let i = 0; i < targets.length; i++) {
        console.log(targets[i].value);
    }
    const details = [type.innerHTML, number.innerHTML, rounds.innerHTML];
    // console.log(details);
    // const target =
});
