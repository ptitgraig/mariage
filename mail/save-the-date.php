<?php
// header("Access-Control-Allow-Origin: *");

// Check for empty fields
if(empty($_GET['name'])     ||
   empty($_GET['phone'])    ||
   empty($_GET['address'])  ||
   ($_GET['kids'] == 'with' && $_GET['kidsNumber'] == '-1')) {
	  echo json_encode(array('status' => 'ko','message'=> 'Paramètres manquants.'));
	  return false;
   }

$kidsWord = 'enfant';
$pluriel = '';
$kidsStr = '';
$out = '';
$res = false;

$name = $_GET['name'];
$phone = $_GET['phone'];
$address = $_GET['address'];
$message = $_GET['message'];

$kids = ($_GET['kids'] == 'with') ? 'avec' : 'sans';
if ($kids == 'avec') {
    $kidsNumber = $_GET['kidsNumber'];
    if ($kidsNumber > 1) {
        $pluriel = 's';
    }
    $kidsStr =  'avec '.$kidsNumber.$kidsWord.$pluriel;
    if ($kidsNumber == 'gt6') {
        $kidsStr =  'avec plus de 6 enfants';
        $kidsNumber = 'plus de 6';
    }
} else {
    $kidsNumber = '0';
    $kidsStr =  'sans enfant';
}

// Create the email and send the message
$to = 'mariage.greg.anne@gmail.com';
$subject = "[SAVE-THE-DATE] - $name a repondu au Save-The-Date";
$email_body = "
   <h4>$name a répondu au Save-The-Date !!</h4>
   <p>Ses informations de contact :<br/>
    $phone<br/>
    $address<br/>
    $name viendra $kidsStr<br/>
    $message<br/>
    <br/>
   </p>
   <p>Ces informations ont été automatiquement enregistrées dans un fichier excel.<br/>
   <a href='http://www.mariage-greg-anne.fr/save_the_date.csv'>Cliquez ici pour le consulter</a></p>";

$headers ='From: savethedate@mariage-greg-anne.fr'."\n";
$headers .='Reply-To: pas-de-reponse@mariage-greg-anne.fr'."\n";
$headers .='Content-Type: text/html; charset="iso-8859-1"'."\n";
$headers .='Content-Transfer-Encoding: 8bit';

if (mail( $to , $subject, nl2br($email_body), $headers)) {
    $fp = fopen('../save_the_date.csv', 'a');
    $data = $name.";".$phone.";".$address.";".$kidsNumber.";".$message."\n";
    $writeOK = fwrite($fp, $data);
    fclose($fp);
    if ($writeOK) {
        echo json_encode(array('status' => 'ok','message'=> 'Données écrites et mail envoyé.'));
    } else {
        echo json_encode(array('status' => 'ko','message'=> 'Données écrites mais mail non envoyé.'));
    }
} else {
    echo json_encode(array('status' => 'ko','message'=> 'Mail non envoyé.'));
}
?>