var firebaseConfig = {
  apiKey: "AIzaSyDR_Qf7sf-KKez13CSgav_Xt-f5jD2PbWw",
  authDomain: "studentdb-a2bb6.firebaseapp.com",
  databaseURL: "https://studentdb-a2bb6.firebaseio.com",
  projectId: "studentdb-a2bb6",
  storageBucket: "studentdb-a2bb6.appspot.com",
  messagingSenderId: "245310208541",
  appId: "1:245310208541:web:b8d4f79cf903d277ebe4f4"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

/*  MY TEST CODE
 var databaseRef = firebase.database().ref();

databaseRef.on("child_added", function(snap) {
   console.log("added:", snap.key);
  console.log("info:",snap.val());

});
*/

const DataBaseReference = firebase.database().ref();
const UsersReference = DataBaseReference.child('students');

readUserData(); 


function userClicked(e) {


		var userID = e.target.getAttribute("user-key");

		const userRef = DataBaseReference.child('students/' + userID);
		const userDetailUI = document.getElementById("userDetail");

		userRef.on("value", snap => {

			userDetailUI.innerHTML = ""

			snap.forEach(childSnap => {
				var $p = document.createElement("p");
				$p.innerHTML = childSnap.key.toUpperCase()  + " : " +  childSnap.val();
				userDetailUI.append($p);
			})

		});
	

}

const addUserBtnUI = document.getElementById("add-user-btn");
addUserBtnUI.addEventListener("click", addUserBtnClicked);

// --------------------------
// ADD STUDENT
// --------------------------
function addUserBtnClicked(e) {
  const addUserInputsUI = document.getElementsByClassName("user-input");

  // this object will hold the new user information 
  let newUser = {};

  // loop through View to get the data for the model 
  for (let i = 0, len = addUserInputsUI.length; i < len; i++) {
    let key = addUserInputsUI[i].getAttribute('data-key');
    let value = addUserInputsUI[i].value;

    if(value==null || value.trim() == "")                   
    {   
      alert("Please enter all student details");
      return;
    }
    newUser[key] = value;
  }

  UsersReference.push(newUser, function () {
    console.log("data has been inserted");
  })
}


// --------------------------
// READ
// --------------------------
function readUserData() {

	const userListUI = document.getElementById("userList");

	UsersReference.orderByChild("name").on("value", snap => {

		userListUI.innerHTML = ""

		snap.forEach(childSnap => {

			let key = childSnap.key,
				value = childSnap.val()
  			
			let $li = document.createElement("li");

			// edit icon
			let editIconUI = document.createElement("span");
			editIconUI.class = "edit-user";
			editIconUI.innerHTML = " ✎";
			editIconUI.setAttribute("userid", key);
			editIconUI.addEventListener("click", editButtonClicked)

			// delete icon
			let deleteIconUI = document.createElement("span");
			deleteIconUI.class = "delete-user";
			deleteIconUI.innerHTML = " ☓";
			deleteIconUI.setAttribute("userid", key);
			deleteIconUI.addEventListener("click", deleteButtonClicked)
			
			$li.innerHTML = value.name;
			$li.append(editIconUI);
			$li.append(deleteIconUI);

			$li.setAttribute("user-key", key);
			$li.addEventListener("click", userClicked)
			userListUI.append($li);

 		});


	})

}

// --------------------------
// EDIT
// --------------------------
function editButtonClicked(e) {
	console.log("edit clicked");
	document.getElementById('edit-user-module').style.display = "block";

	//set user id to the hidden input field
	document.querySelector(".edit-userid").value = e.target.getAttribute("userid");

	const userRef = DataBaseReference.child('students/' + e.target.getAttribute("userid"));
  console.log(userRef);

	// set data to the user field
	const editUserInputsUI = document.querySelectorAll(".edit-user-input");


	userRef.on("value", snap => {

		for(var i = 0, len = editUserInputsUI.length; i < len; i++) {

			var key = editUserInputsUI[i].getAttribute("data-key");
					editUserInputsUI[i].value = snap.val()[key];
		}

	});

	const saveBtn = document.querySelector("#edit-user-btn");
	saveBtn.addEventListener("click", saveUserBtnClicked)
}


// --------------------------
// DELETE
// --------------------------
function deleteButtonClicked(e) {

		e.stopPropagation();

		var userID = e.target.getAttribute("userid");

		const userRef = DataBaseReference.child('students/' + userID);
		
		userRef.remove();

}


// --------------------------
// SAVE
// --------------------------
function saveUserBtnClicked(e) {
 
	const userID = document.querySelector(".edit-userid").value;
	const userRef = DataBaseReference.child('students/' + userID);

	var editedUserObject = {}

	const editUserInputsUI = document.querySelectorAll(".edit-user-input");

	editUserInputsUI.forEach(function(textField) {
		let key = textField.getAttribute("data-key");
		let value = textField.value;
  		editedUserObject[textField.getAttribute("data-key")] = textField.value
	});



	userRef.update(editedUserObject);

	document.getElementById('edit-user-module').style.display = "none";


}
