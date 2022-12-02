# final-320

## URL

https://em-320-final.web.app

This website allows users to create an account, login, and logout. Each user has a unique ID that is stored in firestore, along with the user's first name, last name, and email address. I have attemped to allow users to create a recipe and have it saved into Firestore with no luck. If this website were fully functioning, it would pull the user's data from each recipe they've made, unique to them based on their ID, and allow them to view and edit them, along with being able to create more recipes. 

The user's data is saved in the firestore database by using the object userObj, created in the createAccount function, and passing that through the argument in the updateUserInfo function. Everytime a new user is created, this process runs, allowing each user to have their unique ID and information tied to it. 
