const express = require("express");
const promisify = require("util").promisify;

const app = express();

// type 1
function test(a, b, callback){
    const ans = a + b;
    if (ans > 10) {
        const err = "ans is greater than 10.";
        callback(err, ans);
    } else {
        callback(null, ans);
    }
}

const ansPromise = promisify(test); // promisify function
// console.log(ansPromise);
// console.log(ansPromise(1, 5));
ansPromise(1, 5).then((result) => {
    console.log(result);
})
// .catch(() => {
//     console.log("test")
// })

// async function main() {
//     const answer = await ansPromise(1, 5);
//     console.log(answer);
// }
// main().catch(() => {
//     console.log('something is wrong')
// })


// ================end===================

// type 2
// function test(a, b, callback){
//     const ans = a + b;
//     if (ans > 10) {
//         const err = "ans is larger than 10."
//         return callback(err, ans);
//     } else {
//         return callback(null, ans);
//     }
// }

// // function callback (err, result) {
// //     if (err) {
// //         // console.log(err);
// //         return err;
// //     } else {
// //         // console.log(result);
// //         return result;
// //     }
// // }

// // console.log(test(1, 5, callback));

// const ansPromise = promisify(test); // promisify function

// // console.log(ansPromise);
// // console.log(ansPromise(1, 5, callback)); // print?
// console.log(ansPromise(1, 5)); // print?


// ================end===================







// const test2 = function (a, b, callback){
//     const ans = a + b;
//     if (ans > 10) {
//         const err = "ans is larger than 10."
//         return callback(err, ans);
//     } else {
//         return callback(null, ans)
//     }
// }

// const result = test2(1, 15, (err, data)=>{
//     if (err) {
//         // console.log(err);
//         return err
//     } else {
//         // console.log(data);
//         return data
//     }
// })

// console.log(result)

// const ansPromise = promisify(test2);
// console.log(ansPromise)

// const ansPromise = promisify(callback);
// console.log(ansPromise())

//---------------

// class personobj {
//     constructor(firstname) {
//       this.name = firstname;
//     }
//     function: getFullName() {
//       var fullName = this.name;
//       console.log(fullName);
//     }
// }

// const person = new personobj("andy");
// person.getFullName()
// function main() {
//     `use strict`;
//     console.log("=========")
//     function hello(a, b){
//     console.log(this, a, b)
//     }
//     hello(1, 2) // undefined 1 2
//     console.log("=========")
//     hello.call(undefined, 1, 2) // undefined 1 2
//     console.log("=========")
//     hello.apply(undefined, [1, 2]) // undefined 1 2
// }

// main()


// class dog{
//     constructor(name){
//       this.name = name;
//     }

//     sayHello(){
//       console.log('Hello I am ',this.name);
//     }

//     laterHello1(){
//     setTimeout(function(){
//         console.log('(1 sec...) Hi!, I am',this.name)
//       }, 1000);
//     }

//     laterHello2() {
//     setTimeout(() => {
//         console.log('(1 sec...) Hi!, I am', this.name);
//       }, 1000);
//     }

//     laterHello3(){
//     setTimeout(function(){
//         console.log('(1 sec...) Hi!, I am',this.name)
//       }.bind(this), 1000);
//     }

//     saySomeThing(mes, cb) {
//         cb(mes);
//     }
// }

// let boo = new dog('Andy');

// boo.sayHello();   // Hello I am  fongki
// boo.laterHello1(); // (1 sec...) Hi!, I am undefined
// boo.laterHello2(); // (1 sec...) Hi!, I am fongki
// boo.laterHello3(); // (1 sec...) Hi!, I am fongki

// let cb = function (mes) {
//     console.log(mes)
// }

// // cb("test")
// boo.saySomeThing("HI", cb)

// The Asyncronous Method
// function strictAddition(x, y, callback) {
//     if(typeof x !== 'number') {
//       callback("First argument is not a number", null);
//       return;
//     }
//     if(typeof y !== 'number') {
//         callback("Second argument is not a number", null);
//         // callback( new Error('Second argument is not a number') );
//         return;
//     }
//     let result = x + y;
//     setTimeout(function() {
//       callback(null, result);
//     }, 500);
// }
  
//   // The Callback
// function callback(err, data) {
//     if(err) {
//       console.log(err);
//       return;
//     }
//     console.log(data);
// }

// strictAddition("1", 2, (err, result) => {
//     if(err) {
//         console.log(err);
//         return;
//     }
//     console.log(result);
// })

// const laterCount = promisify(strictAddition);
// console.log(laterCount)
// strictAddition("1", 2,  callback);

// function strictAddition(x, y, callback) {
//     if(typeof x !== 'number') {
//       callback( new Error('First argument is not a number') );
//       return;
//     }
//     if(typeof y !== 'number') {
//       callback( new Error('Second argument is not a number') );
//       return;
//     }
//     var result = x + y;
//     setTimeout(function() {
//       callback(null, result);
//     }, 500);
// }
  
//   // The Callback
// function callback(err, data) {
//     if(err) {
//       console.log(err);
//       return;
//     }
//     console.log(data);
// }
  
//   // Examples
//   strictAddition(2, 10, callback); // 12
//   strictAddition(-2, 10, callback); // 8
//   strictAddition('uh oh', 10, callback); // Error = "First argument is not a number"
//   strictAddition(2, '10', callback); // // Error = "Second argument is not a number"


// function dbsql (sql) {
//     return new Promise((resolve, reject) => {
//         req.app.get("db").query(sql, (err, result) => {
//             if (err) throw err;
//             resolve(result);
//         });
//     });
// }

// async function main() {
//     const result = await dbsql(sql)
// }

// function test1 (cb) {
//   cb(null, 'dd')
// }
// const getTest = promisify(test1)
// console.log(getTest)
// console.log(getTest())
// getTest().then((a) => { console.log(a) })

// const sleep = promisify((ms, cb) => setTimeout(cb, ms))
// sleep(3000).then(() => console.log('3 sec pass'))

// function test(err, meg, cb) {
//     if (err) throw err;
//     const ans = "echo: " + meg;
//     return(ans)
// }

// const testPromise = promisify(test);
// console.log(testPromise)
 
// const obj = {
//     name: "ANDY",
//     getYear(year) {
//         let message = "This year: " + year
//     }
// }

// 設置port:3000的server
app.listen(3000, () => {
    // eslint-disable-next-line no-console
    console.log("running...");
}); 