<?php 
// header("Access-Control-Allow-Origin: *");

// Check for empty fields
if(empty($_GET['name'])   ||
   empty($_GET['phone'])  ||
   empty($_GET['kids'])   ||
   empty($_GET['address'])) {
	  echo json_encode(array('status' => 'ko','message'=> 'Missing parameters.'));
	  return false;
   }
	
$name = $_GET['name'];
$phone = $_GET['phone'];
$kids = $_GET['kids'];
$address = $_GET['address'];
$message = $_GET['message'];

function mailFree($to , $subject , $message , $additional_headers=null , $additional_parameters=null) {
   $start_time = time();
   $resultat = mail( $to , $subject, $message, $additional_headers, $additional_parameters);
   $time = time() - $start_time;
   return $resultat & ($time>1);
}

$out = '';
$res = false;
$kidsStr = 'enfant';
if ($kids > 0) {
    $kidsStr = 'enfants';
}

// Create the email and send the message
$to = 'mariage.greg.anne@gmail.com';
$email_subject = "[SAVE-THE-DATE] - $name a repondu au Save-The-Date";
$email_body = "
   <h4>$name a répondu au Save-The-Date !!</h4>
   <dl>
      <dt>Ses informations de contact :</dt>
      <dd>
         $phone<br/>
         $address<br/>
         $kids $kidsStr<br/>
      </dd>
   </dl>
   $message
   <hr/>
   <p>Ces informations ont été automatiquement enregistrées dans un fichier excel.<br/>
   <a href='http://www.mariage-greg-anne.fr/save_the_date.csv'>Cliquez ici pour le consulter</a></p>";
$headers  = "From: noreply@mariage-greg-anne.fr\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=utf-8\r\n";
$headers .= "Return-Path: noreply@mariage-greg-anne.fr\r\n";
if (mail( $to , $subject, $message, $additional_headers, $additional_parameters)) {
    $fp = fopen('../save_date_date.csv', 'a');
    $data = $name.";".$phone.";".$address.";".$kids.";".$message."\n";
    $writeOK = fwrite($fp, $data);
    fclose($fp);
    if ($writeOK) {
        echo json_encode(array('status' => 'ok','message'=> 'Data written in file and mail sent.'));
    } else {
        echo json_encode(array('status' => 'ko','message'=> 'Data not written in file and mail sent.'));
    }
} else {
    echo json_encode(array('status' => 'ko','message'=> 'Unable to send mail.'));
}
?>