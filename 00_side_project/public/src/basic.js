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

    const targetList = []
    for (let i = 0; i < targets.length; i++) {
        targetList.push(targets[i].value)
    }
    const details = {
        type: type.innerHTML,
        number: number.innerHTML,
        rounds: rounds.innerHTML,
        targets: targetList
    }
    console.log(details);
});

const roundsNumber = document.querySelector("#rounds")
roundsNumber.addEventListener('change', ()=>{
    const number = document.querySelector("#rounds option:checked")
    const target = document.querySelector('#target')
    const targetList = document.querySelectorAll('.target_item')
    for (let i = 0; i < targetList.length; i++) {
        targetList[i].remove();
    }
    for (let i = 0; i < parseInt(number.innerHTML); i++){
        const roundsItem = document.createElement('input')
        roundsItem.className = "target_item"
        roundsItem.id = `round_${i+1}_target` 
        roundsItem.placeholder = `Round ${i+1} target`
        target.append(roundsItem)
    }
})

const sendMsg = document.querySelector('#send');
sendMsg.addEventListener('click', () => {
    const msg = document.querySelector("#sendmsg input")
    console.log(msg.value)
})