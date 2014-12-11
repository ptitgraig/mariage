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

$out = '';
$res = false;
$kidsStr = 'enfant';
if ($kids > 1) {
    $kidsStr = 'enfants';
}

// Create the email and send the message
$to = 'mariage.greg.anne@gmail.com';
$subject = "[SAVE-THE-DATE] - $name a repondu au Save-The-Date";
$email_body = "
   <h4>$name a répondu au Save-The-Date !!</h4>
   <p>Ses informations de contact :<br/>
    $phone<br/>
    $address<br/>
    $kids $kidsStr<br/>
    $message<br/>
</p>
   <p>Ces informations ont été automatiquement enregistrées dans un fichier excel.<br/>
   <a href='http://www.mariage-greg-anne.fr/save_the_date.csv'>Cliquez ici pour le consulter</a></p>";

$headers ='From: savethedate@mariage-greg-anne.fr'."\n";
$headers .='Reply-To: pas-de-reponse@mariage-greg-anne.fr'."\n";
$headers .='Content-Type: text/html; charset="iso-8859-1"'."\n";
$headers .='Content-Transfer-Encoding: 8bit';

if (mail( $to , $subject, nl2br($email_body), $headers)) {
    $fp = fopen('../save_the_date.csv', 'a');
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