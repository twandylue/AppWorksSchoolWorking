

const sleep = promisify( (ms,cb) => setTimeout(cb,ms) );
sleep(3000).then(()=>console.log('3 sec pass'));

// let sum = {
//     name: "App",
//     count(x, y)
// }

// function CalNumber() {
//     return new Promise((resolve, reject) => {
        
//     })
// }

// async function main() {
//     const answer = await CalNumber
// }

// main();