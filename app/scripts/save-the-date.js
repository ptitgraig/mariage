var isDev = document.location.href.split('localhost').length > 1,
    $btn = document.getElementById('submit'),
    $btnError = document.getElementById('submitError'),
    $btnSending = document.getElementById('submitSending'),
    $btnSent = document.getElementById('submitSent'),
    $name = document.getElementById('name'),
    $phone = document.getElementById('phone'),
    $address = document.getElementById('address'),
    $kids = document.getElementById('kids'),
    $kidsNumber = document.getElementById('kidsNumber'),
    $message = document.getElementById('message'),
    errors = [];
    

function addEvent(evnt, elem, func) {
    if (elem.addEventListener)  {
        elem.addEventListener(evnt,func,false);
    } else if (elem.attachEvent) {
        elem.attachEvent("on"+evnt, func);
    } else {
        elem[evnt] = func;
    }
}

addEvent('click', $btn, submitForm);
addEvent('touchstart', $btn, submitForm);

addEvent('click', $btnError, submitForm);
addEvent('touchstart',$btnError, submitForm);

addEvent('change',$kids, toggleKidsNumber);

addEvent('focus',$name, function(){removeError($name)});
addEvent('focus',$phone, function(){removeError($phone)});
addEvent('focus',$address, function(){removeError($address)});
addEvent('focus',$kids, function(){removeError($kids)});
addEvent('focus',$kidsNumber, function(){removeError($kidsNumber)});

function submitForm(){
    var url = (isDev ? 'http://localhost:8888/mariage/mail/save-the-date.php' : 'mail/save-the-date.php');
    $name.value === '' ? addError($name) : removeError($name);
    $phone.value === '' ? addError($phone) : removeError($phone);
    $address.value === '' ? addError($address) : removeError($address);
    if ($kids.value === 'with') {
        $kidsNumber.value === '-1' ? addError($kidsNumber) : removeError($kidsNumber);
    }
    
    if (errors.length > 0) {
        location.hash = "#top-form" ;
        return;
    }

    $btn.style.display = 'none';
    $btnSent.style.display = 'none';
    $btnError.style.display = 'none';
    $btnSending.style.display = 'block';
    
    url += '?name=' + $name.value;
    url += '&phone=' + $phone.value;
    url += '&address=' + $address.value;
    url += '&kids=' + $kids.value;
    if ($message.value !== '') { url += '&message=' + $message.value; }
    if ($kids.value === 'with') { url += '&kidsNumber=' + $kidsNumber.value; }
    
    //url = "http://localhost:8888/mariage/mail/save-the-date.php";
    load(url, function(xhr) {
        var res;
        if (xhr.responseText) {
            res = xhr.responseText;
        } else {
            res = xhr.response;
        }
        resJSON = JSON.parse(res);
        if (resJSON.status === 'ko') {
            window.setTimeout(function() {
                $btn.style.display = 'none';
                $btnSent.style.display = 'none';
                $btnError.style.display = 'block';
                $btnSending.style.display = 'none';
                $btnError.innerHTML = resJSON.message;
            }, 2000);    
        } else {
            window.setTimeout(function() {
                $btn.style.display = 'none';
                $btnSent.style.display = 'block';
                $btnError.style.display = 'none';
                $btnSending.style.display = 'none';
            }, 2000);
        }
    });
}
function toggleKidsNumber() {
    removeError($kidsNumber);
    if ($kids.value === 'without') {
        $kidsNumber.style.display = 'none';
    } else {
        $kidsNumber.style.display = 'block';
    }
}
function nextElementSibling(el) {
    do { el = el.nextSibling } while ( el && el.nodeType !== 1 );
    return el;
}
function addError(elt) {
    var elNext = elt.nextElementSibling || nextElementSibling(elt);
    elNext.style.display = 'block';
    elt.parentNode.className = 'form-group has-error';
    errors.push('1');
}
function removeError(elt) {
    var elNext = elt.nextElementSibling || nextElementSibling(elt);
    if (elNext === null) return;
    elNext.style.display = 'none';
    elt.parentNode.className = 'form-group';
    errors.pop();
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
        if(xhr.readyState === 4) { callback(xhr); }           
    }
    xhr.open('GET', url, true);
    xhr.send('');
}