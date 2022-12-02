var currentRecipe = [
    {
    name: "",
    listItems:[
        {
            recipeImg: "",
            recipeName: "",
            recipeDescription:"",
            recipeTotalTime: "",
            recipeServingSize: ""
        }, 
        {
            ingredientOne: "",
            ingredientTwo: "",
            ingredientThree: ""
        },
        {
            instructionOne: "",
            instructionTwo: "",
            instructionThree: ""
        }
        ]
    }
   
    
];

var _db = "";
var userExists = false;
var userFullName = "";
var _userProfileInfo = {};


function barNavigation (){
    $(".bars").click(function(e){
        $(".bars").toggleClass("active");
        $(".links").toggleClass("active");
    });

    $(".links a").click(function (e){
        $(".bars").toggleClass("active");
        $(".links").toggleClass("active");
    });
}

$(document).ready(function(){
    barNavigation();
});

function initFirebase (){
    firebase.auth().onAuthStateChanged((user) => {
        if (user){
            _db = firebase.firestore(); 
            console.log("auth change logged in");
            if(user.displayName){
                $(".name").html(user.displayName); 
            }
            
            $(".signOut").prop("hidden", false);
            userExists = true;
        }else{
            _db = "";
            _userProfileInfo = {};
            $("#app").empty();
            console.log("auth change logged out");
            $(".name").html("");

            $(".signOut").attr("hidden", true);
            userExists = false;
            userFullName = "";
        }
    });
}

function updateUserInfo(userObj){
    let id = firebase.auth().currentUser.uid;
    _db.collection("Users").doc(id).update(userObj).then(()=>{
        console.log("updated doc");
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("update error " + errorMessage);
      });
}

function signOut(){
    firebase
    .auth()
    .signOut()
    .then(() => {
    // Signed in..
    alert("signed out");
  })
  .catch((error) => {
    // Signed out...
    console.log("error signing out" + errorMessage);
  }); 
}

function logIn(){
    let email = $("#logEmail").val();
    let password = $("#logPassword").val();

    firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
    // Signed in 
    var user = userCredential.user;
    alert("logged in");
    $("#logEmail").val("");
    $("#logPassword").val("");
    _db.collection("Users").doc(user.uid).get().then((doc)=>{
        console.log(doc.data());
        _userProfileInfo = doc.data();
        console.log("login userinfo ", _userProfileInfo);
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("logged in error" + errorMessage);
      });

  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("logged in error" + errorMessage);
  });
}

function createAccount() {
    let fName = $("#fName").val();
    let lName = $("#lName").val();
    let email = $("#email").val();
    let password = $("#password").val();
    let fullName = fName + " " + lName;
    let userObj = {
        firstName: fName,
        lastName: lName,
        email: email,
        currentRecipe: [],
    };
    // console.log("create " + fName + " fName " + lName);
firebase
.auth()
.createUserWithEmailAndPassword(email, password)
.then((userCredential) => {
// Signed in 
var user = userCredential.user;
alert("created");

firebase.auth()
.currentUser.updateProfile({
    displayName: fullName,
});

_db
.collection("Users")
.doc(user.uid)
.set(userObj)
.then((doc)=> {
    console.log("doc added ");
    _userProfileInfo = userObj;
    console.log("create userinfo ", _userProfileInfo);
})

.catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ..
    console.log("create error " + errorMessage);
    });

userFullName = fullName;
$(".name").html(userFullName);
$("#fName").val("");
$("#lName").val("");
$("#email").val("");
$("#password").val("");
})
.catch((error) => {
var errorCode = error.code;
var errorMessage = error.message;
// ..
console.log("create error " + errorMessage);
});
}

function signInAnon(){
    firebase
    .auth()
    .signInAnonymously()
    .then(() => {
    // Signed in..
    console.log("signed in");
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
    console.log("error signing in " + errorMessage);
  });
}

$(document).ready(function(){
    try {
        let app = firebase.app();
        
        initFirebase();
    } catch (error){
        console.log("error " + error);
    }
    
});