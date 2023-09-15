<?php

include 'config.php';
$errors = array(); 

if(isset($_POST['submit'])) {
    $Email = mysqli_real_escape_string($conn, $_POST['Email']);
    $pass = mysqli_real_escape_string($conn, $_POST['pass']);
  
    if (empty($Email)) {
        array_push($errors, "Username is required");
    }
    if (empty($pass)) {
        array_push($errors, "Password is required");
    }
        $pass = md5($pass);
        $query = mysqli_query($conn, "SELECT * FROM `order_table` WHERE Email='$Email' AND pass='$pass'") or die('query failed');
        if(mysqli_num_rows($query) > 0){
            $row = mysqli_fetch_assoc($query);
            $_SESSION['Email'] = $row['Email'];
            header('location:homepage.html');
         }else{
          
            array_push($errors, "incorrect password or email!");
         }
      
  };


?>
<!DOCTYPE html>
<html lang="en">
<head>
    
    <title>login form</title>
    <link rel="stylesheet" href="homestyle.css">
</head>
<body>
    <div class="register">
        <form action="" method="post">
        <h1>Login to place order</h1>
        <?php
        if(isset($errors)){
            foreach($errors as $error){
                echo '<span class="error-msg">'.$error.'</span>';
            };
        };
        ?>
      
       
        <label for="">enter mail-id:</label>
        <input type="email" name="Email" required placeholder="enter email" class="input">
        
        <label for="">enter password:</label>
        <input type="password" name="pass" required placeholder="enter the password" class="input">
        
        <input type="submit" name="submit" value="Login now" class="btn">
        <p>Don't have an account? <a href="register.php">register now</a></p>
        </form>
    </div>
    
</body>
</html>