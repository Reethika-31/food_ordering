<?php

@include 'config.php';
$errors = array();

if(isset($_POST['submit'])){
    $Username = mysqli_real_escape_string($conn,$_POST['Username']);
    $Email = mysqli_real_escape_string($conn,$_POST['Email']);
    $pass= mysqli_real_escape_string($conn, $_POST['pass']);

    if (empty($Username)) { array_push($errors, "Username is required"); }
    if (empty($Email)) { array_push($errors, "Email is required"); }
    if (empty($pass)) { array_push($errors, "Password is required"); }
  
    // first check the database to make sure 
    // a user does not already exist with the same username and/or email
    $user_check_query = "SELECT * FROM order_table WHERE Username='$Username' OR Email='$Email' LIMIT 1";
    $result = mysqli_query($conn, $user_check_query);
    $user = mysqli_fetch_assoc($result);
    
    if ($user) { // if user exists
      if ($user['Username'] === $Username) {
        array_push($errors, "Username already exists..");
      }
  
      if ($user['Email'] === $Email) {
        array_push($errors, "Email already exists..");
      }
    }
  
    // Finally, register user if there are no errors in the form
    if (count($errors) == 0) {
        $pass = md5($pass);//encrypt the password before saving in the database
  
        $query = "INSERT INTO order_table (Username, Email, pass) 
                  VALUES('$Username', '$Email', '$pass')";
        mysqli_query($conn, $query);
        $_SESSION['Username'] = $Username;
        $_SESSION['success'] = "You are now logged in";
        header('location: signin.php');
    }
  
};

?>


<!DOCTYPE html>
<html lang="en">
<head>
    
    <title>register form</title>
    <link rel="stylesheet" href="homestyle.css">
</head>
<body>
    <div class="register">
        <form action="" method="post">
        <h1>register Here</h1>
        <?php
        if(isset($errors)){
            foreach($errors as $error){
                echo '<span class="error-msg">'.$error.'</span>';
            };
        };
        ?>
        <label for="">enter username:</label>
        <input type="text" name="Username" required placeholder="enter username" class="input">
    
        <label for="">enter mail-id:</label>
        <input type="email" name="Email" required placeholder="enter email" class="input">
       
        <label for="">enter password:</label>
        <input type="password" name="pass" required placeholder="enter the password" class="input">
      
        <input type="submit" name="submit" value="register now" class="btn">
        <p>Already have an account? <a href="signin.php">login now</a></p>
        </form>
    </div>
    
</body>
</html>