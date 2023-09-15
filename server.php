<?php
session_start();

// initializing variables
$Username = "";
$Email    = "";
$errors = array(); 

// connect to the database
$db = mysqli_connect('localhost', 'root', '', 'food_order');

// REGISTER USER
if (isset($_POST['register'])) {
  // receive all input values from the form
  $Username = mysqli_real_escape_string($db, $_POST['Username']);
  $Email = mysqli_real_escape_string($db, $_POST['Email']);
  $pass= mysqli_real_escape_string($db, $_POST['pass']);
  

  // form validation: ensure that the form is correctly filled ...
  // by adding (array_push()) corresponding error unto $errors array
  if (empty($Username)) { array_push($errors, "Username is required"); }
  if (empty($Email)) { array_push($errors, "Email is required"); }
  if (empty($pass)) { array_push($errors, "Password is required"); }

  // first check the database to make sure 
  // a user does not already exist with the same username and/or email
  $user_check_query = "SELECT * FROM order_table WHERE Username='$Username' OR Email='$Email' LIMIT 1";
  $result = mysqli_query($db, $user_check_query);
  $user = mysqli_fetch_assoc($result);
  
  if ($user) { // if user exists
    if ($user['Username'] === $Username) {
      array_push($errors, "Username already exists");
    }

    if ($user['Email'] === $Email) {
      array_push($errors, "email already exists");
    }
  }

  // Finally, register user if there are no errors in the form
  if (count($errors) == 0) {
  	$pass = md5($pass);//encrypt the password before saving in the database

  	$query = "INSERT INTO order_table (Username, Email, pass) 
  			  VALUES('$Username', '$Email', '$pass')";
  	mysqli_query($db, $query);
  	$_SESSION['Username'] = $Username;
  	$_SESSION['success'] = "You are now logged in";
  	header('location: login.php');
  }
}

// LOGIN USER
if (isset($_POST['login'])) {
  $Email = mysqli_real_escape_string($db, $_POST['Email']);
  $pass = mysqli_real_escape_string($db, $_POST['pass']);

  if (empty($Email)) {
  	array_push($errors, "Username is required");
  }
  if (empty($pass)) {
  	array_push($errors, "Password is required");
  }

  if (count($errors) == 0) {
  	$pass = md5($pass);
  	$query = "SELECT * FROM order_table WHERE Email='$Email' AND pass='$pass'";
  	$results = mysqli_query($db, $query);
  	if (mysqli_num_rows($results) == 1) {
  	  $_SESSION['Email'] = $Email;
  	  $_SESSION['success'] = "You are now logged in";
  	  header('location: homepage.html');
  	}else {
  		array_push($errors, "Wrong username/password combination");
  	}
  }
}

?>