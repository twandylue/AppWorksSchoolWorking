let person = { // object 
  firstName: "Andy", // key: value 
  lastName: "Lu",
  getFullName(year) { // method
    let fullName = this.firstName + " " + this.lastName + " " + year;
    return fullName;
  }
};

console.log(person.getFullName("19xx")); // print Andy Lu 1994

// logNameAndYear是個function, person是個object, 將logNameAndYear綁定person
let logNameAndYear = function() {
  console.log("1: ");
  console.log("firstName: " + this.firstName); // print An
  console.log("lastName: " + this.lastName); // print Lu
  console.log("Logged: " + this.getFullName("199x")); // this重新指向person，故可以使用person內部的method(getFullName) 
  console.log(this); // print content of person object
}.bind(person); 

// logNameAndYear是個function, 沒有綁定person
let logNameAndYearNotBind = function() {
  console.log("2: ");
  console.log(this); // print content of window object(global)
}; 

// logNameAndYear是個function, person是個object, 將logNameAndYear綁定person，並在logNameAndYear內改變person的value，故稱雙向
let logNameAndYearChange = function() {
  console.log("3: ")
  this.firstName = "Amy";
  this.lastName = "Lu";
  console.log("Logged: " + this.getFullName("199x")); // this重新指向person，故可以使用person內部的method(getFullName) 
  console.log(this); // print content of new person object
}.bind(person); 


logNameAndYear(); // call fuction and pring Logged:Andy Lu 199x
logNameAndYearNotBind(); 
logNameAndYearChange(); // call fuction and pring Logged:Amy Lu 199x
console.log("after changing");
console.log(person); // print content of new person object

// 更簡化的寫法
let personInfo = function () {
  console.log("Logged: " + this.getFullName("199x"));
}
let logPersonName = logNameAndYear.bind(person); // 綁定
logPersonName(); // print Logged: Amy Lu 199x


// // logNameAndYear是個function, person是個object, 將logNameAndYear綁定person
// let logNameAndYear = function() {
//   console.log("1: ");
//   console.log("firstName: " + this.firstName); // print An
//   console.log("lastName: " + this.lastName); // print Lu
//   console.log("Logged: " + this.getFullName("199x")); // this重新指向person，故可以使用person內部的method(getFullName) 
//   // console.log(this); // print content of person object
// }.bind(person); 
