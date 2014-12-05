var isDev = document.location.href.split('localhost').length > 1,
    $btn = document.getElementById('submit'),
    $btnError = document.getElementById('submitError'),
    $btnSending = document.getElementById('submitSending'),
    $btnSent = document.getElementById('submitSent'),
    $name = document.getElementById('name'),
    $phone = document.getElementById('phone'),
    $address = document.getElementById('address'),
    $kids = document.getElementById('kids'),
    $message = document.getElementById('message'),
    errors = [];
    

$btn.addEventListener('click', submitForm);
$btn.addEventListener('touchstart', submitForm);

$btnError.addEventListener('click', submitForm);
$btnError.addEventListener('touchstart', submitForm);

$name.addEventListener('focus', removeErrorMsg);
$phone.addEventListener('focus', removeErrorMsg);
$address.addEventListener('focus', removeErrorMsg);
$kids.addEventListener('focus', removeErrorMsg);

function submitForm(){
    var url = (isDev ? 'http://localhost:8888/mariage/mail/save-the-date.php' : 'mail/save-the-date.php');
    $name.value === '' ? addError($name) : removeError($name);
    $phone.value === '' ? addError($phone) : removeError($phone);
    $address.value === '' ? addError($address) : removeError($address);
    $kids.value === '' ? addError($kids) : removeError($kids);
    
    if (errors.length > 0) return;

    $btn.style.display = 'none';
    $btnSent.style.display = 'none';
    $btnError.style.display = 'none';
    $btnSending.style.display = 'block';
    // $btn.className = 'btn btn-xl btn-sending';
    // $btn.innerHTML = 'Envoi en cours <i class="icon icon-paperplane"></i>';
    
    url += '?name=' + $name.value;
    url += '&phone=' + $phone.value;
    url += '&address=' + $address.value;
    url += '&kids=' + $kids.value;
    url += '&message=' + $message.value;
    // url = "http://localhost:8888/mariage/mail/save-the-date.php";
    load(url, function(xhr) {
        var res = JSON.parse(xhr.response);
        if (res.status === 'ko') {
            window.setTimeout(function() {
                $btn.style.display = 'none';
                $btnSent.style.display = 'none';
                $btnError.style.display = 'block';
                $btnSending.style.display = 'none';
                // $btn.className = 'btn btn-xl btn-danger';
                // $btn.innerHTML = 'Oops, une erreur. Ré-essayez.';
            }, 2500);    
        } else {
            window.setTimeout(function() {
                $btn.style.display = 'none';
                $btnSent.style.display = 'block';
                $btnError.style.display = 'none';
                $btnSending.style.display = 'none';
                // $btn.className = 'btn btn-xl btn-sent';
                // $btn.innerHTML = 'Message envoyé. <i class="icon icon-check-mark"></i>';
            }, 2500);
        }
    });
}

function addError(elt) {
    elt.nextElementSibling.style.display = 'block';
    elt.parentNode.className = 'form-group has-error';
    errors.push('1');
}
function removeError(elt) {
    elt.nextElementSibling.style.display = 'none';
    elt.parentNode.className = 'form-group';
    errors.pop();
}
function removeErrorMsg(elt) {
    removeError(elt.currentTarget);
}
function load(url, callback) {
    var xhr;
    if(typeof XMLHttpRequest !== 'undefined') {
        xhr = new XMLHttpRequest();
    } else {
        var versions = ["MSXML2.XmlHttp.5.0", 
                        "MSXML2.XmlHttp.4.0",
                        "MSXML2.XmlHttp.3.0", 
                        "MSXML2.XmlHttp.2.0",
                        "Microsoft.XmlHttp"]
        for(var i = 0, len = versions.length; i < len; i++) {
            try {
                xhr = new ActiveXObject(versions[i]);
                break;
            } catch(e){}
        }
    }
    xhr.onreadystatechange = ensureReadiness;
    function ensureReadiness() {
        if(xhr.readyState < 4) { return; }
        if(xhr.status !== 200) { return; }
        // all is well
        if(xhr.readyState === 4) { callback(xhr); }           
    }
    xhr.open('GET', url, true);
    xhr.send('');
}