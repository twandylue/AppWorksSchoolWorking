const express = require("express");

const app = express();

// var n = 123; // allocates memory for a number
// var s = 'Andy'; // allocates memory for a string

// var o = {
//   a: 1,
//   b: null
// }; // allocates memory for an object and contained values

// // (like object) allocates memory for the array and
// // contained values
// var a = [1, null, 'Lu'];

// function f(a) {
//   return a + 2;
// } // allocates a function (which is a callable object)

// // function expressions also allocate an object
// someElement.addEventListener('click', function() {
//   someElement.style.backgroundColor = 'blue';
// }, false);

// Reference-counting garbage collection
let x = {
    a: {
        b: 2
    }
};
// 2 objects are created. One is referenced by the other as one of its properties.
// The other is referenced by virtue of being assigned to the 'x' variable.
// Obviously, none can be garbage-collected.

let y = x; // The 'y' variable is the second thing that has a reference to the object.

// console.log(y);

x = 1; // Now, the object that was originally in 'x' has a unique reference
//   embodied by the 'y' variable.

// console.log(y);

let z = y.a; // Reference to 'a' property of the object.
//   This object now has 2 references: one as a property,
//   the other as the 'z' variable.

// console.log(z);

y = "mozilla"; // The object that was originally in 'x' has now zero
//   references to it. It can be garbage-collected.
//   However its 'a' property is still referenced by
//   the 'z' variable, so it cannot be freed.

z = null; // The 'a' property of the object originally in x
//   has zero references to it. It can be garbage collected.

// Limitation: Circular references
function f () {
    const x = {};
    const y = {};
    x.a = y; // x references y
    y.a = x; // y references x

    return "azerty";
}

f();

// 設置port:3000的server
app.listen(3000, () => {
    // eslint-disable-next-line no-console
    console.log("running...");
});
