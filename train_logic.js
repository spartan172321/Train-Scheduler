// Initialize Firebase
var config = {
  apiKey: "AIzaSyD5_fTnm1Y5G6dMX7ycT7cV1vdTbaDQh0M",
  authDomain: "train-schedule-e2dd5.firebaseapp.com",
  databaseURL: "https://train-schedule-e2dd5.firebaseio.com",
  projectId: "train-schedule-e2dd5",
  storageBucket: "train-schedule-e2dd5.appspot.com",
  messagingSenderId: "795918784849"
};

firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

// Initial Values
var name = "";
var dest = "";
var first = 0; //must only accept (HH:mm - military time)
var freq = 0; // must be in min
var freqMin = 0

// Capture Button Click
$("#add-train-btn").on("click", function(event) {

  event.preventDefault();

  $('#trainName').removeClass("has-error has-feedback")
  $('#destiny').removeClass("has-error has-feedback")
  $('#firstOne').removeClass("has-error has-feedback")
  $('#frequent').removeClass("has-error has-feedback")


  if(validateForm() && validateTime()){
    // Grabbed values from text boxes
    name = $("#train-name-input").val().trim();

    dest = $("#destination-input").val().trim();

    first = $("#first-input").val().trim(); //must only accept (HH:mm - military time)
   
    freq = $("#frequency-input").val().trim(); // must be in min
  
    database.ref().push({
      name: name,
      dest: dest,
      first: first,
      freq: freq
    });
  }

});

// function to check if all fields are filled
function validateForm(){
  var fields = ["train-name", "destination", "first", "frequency"]
  var i, l = fields.length;
  var fieldname;
  var count = 0;

  for (i = 0; i < l; i++) {

    fieldname = fields[i];

    if ($("#"+fieldname+"-input").val().trim() === "") {
      var par = $("#"+fieldname+"-input").parent()
      par.addClass("has-error has-feedback")
      $(".glyhicon").toggle();
      count++
    }
  }

  if(count === 0){
    return true
  }
  else if(count !== 0){
    return false;
  }
}

function validateTime(){
  
  if(moment($("#first-input").val().trim(), "HH:mm", true).isValid()){
    $("#first-input").parent().removeClass("has-warning has-feedback")
    return true
  }

  else{
    $("#first-input").parent().addClass("has-warning has-feedback")
    return false
  }
}



database.ref().on("child_added", function(childSnapshot, prevChildKey){

  // Store all the inputs into variables.
  var trainName = childSnapshot.val().name;
  var trainDest = childSnapshot.val().dest;
  var trainFirst = childSnapshot.val().first;
  var trainFreq = childSnapshot.val().freq;

  // First Time (pushed back 1 year to make sure it comes before current time)
  var trainFirstConverted = moment(trainFirst, "hh:mm").subtract(1, "years");
 
  // Difference between the times
  var diffTime = moment().diff(moment(trainFirstConverted), "minutes");
 
  // Time apart (remainder)
  var tRemainder = diffTime % trainFreq;
  
  // Minute Until Train
  var tMinutesTillTrain = trainFreq - tRemainder;
 
  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  var nextTrainAmPm = moment(nextTrain).format("hh:mm a");
 

  // checking required info in console
  // console.log('train name: '+ trainName);
  // console.log('train dest: '+ trainDest);
  // console.log('first train: ' + trainFirst); //(HH:mm - military time)
  // console.log('frequency: '+trainFreq+' min');
  // console.log('next arrival: '+ moment(nextTrain).format("hh:mm a"));
  // console.log('min to arrival: '+ tMinutesTillTrain);
  // console.log("============================================================")

  // Add each train's data into the table
  $("#trainData").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" +
  trainFreq + "</td><td>" + nextTrainAmPm + "</td><td>" + tMinutesTillTrain + "</td></tr>");
});
// // Handle the errors
// , function(errorObject) {
// console.log("Errors handled: " + errorObject.code);
// });

// reset database!
// var adaRef = firebase.database().ref();
// adaRef.remove()
//   .then(function() {
//     console.log("Remove succeeded.")
//   })
//   .catch(function(error) {
//     console.log("Remove failed: " + error.message)
// });