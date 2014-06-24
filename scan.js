/*
var iframe = document.createElement('iframe');
iframe.src = 'https://PaySEPA.github.io/bookmarklet/';
iframe.id = 'scanner-frame';
iframe.width = 350;
iframe.height = 290;

var provider_url = parent.document.location.href;

if (provider_url.indexOf('portal.raiffeisen.at') > 1) {
    el = document.getElementById('j_id1_zv_WAR_zvportlet_INSTANCE_4NsO_:j_id4');
} else if (provider_url.indexOf('banking.co.at') > 1) {
    el = document.getElementById('inputAuftrag');
} else {
    el = document.body;
}

el.appendChild(iframe);



var head = document.getElementsByTagName("head")[0];
var scan = document.createElement('script');
scan.type = 'text/javascript';
scan.src = 'https://paysepa.github.io/bookmarklet/scan.js';
head.appendChild(scan);
*/

function scanHtml() {
    /*
    <h2 id="header"><i class="icon-qrcode"></i> PaySEPA</h2>
    <p id="info" class="hidden">Allow access to your webcam to scan SEPA payment codes.</p>
    <p id="sepa-code-error" class="hidden">The scanned code is no valid SEPA payment code.</p>
    
    <video id="v" width="320" height="240"></video>
    <button id="capture">Scan</button>
    <br>
    <canvas id="qr-canvas" class="hidden" width="320" height="240"></canvas>
    */
    
    var provider_url = document.location.href,
        el = null,
        supported = null,
        provider = null,
        url = null;

    if (provider_url.indexOf('portal.raiffeisen.at') > 1) {
        el = document.getElementById('j_id1_zv_WAR_zvportlet_INSTANCE_4NsO_:j_id4');
        supported = true;
        provider = 'raika'; // ELBA Raiffeisen
        url = 'https://portal.raiffeisen.at/resolveLink?serviceName=izv';
        
    } else if (provider_url.indexOf('banking.co.at') > 1) {
        el = document.getElementById('pageheader');
        supported = true;
        provider = 'hypo'; // HYPO NOE
        url = 'https://www.banking.co.at/appl/ebp/trans/initeingabegiro.html';
        
    } else if (provider_url.indexOf('bankaustria.at') > 1) {
        el = document.getElementsByClassName('wpt_wcm_content_link_container')[0];
        supported = true;
        provider = 'ba'; // Bank Austria / Uni Credit

    } else {
        // el = document.body;
    }

    if (!supported) {
        alert('Your online banking system is currently not supported.');
        return false;
    }

    if (!el) {
        alert('Could not attach ScanSEPA - navigate to the transfer form page first.');
        if (url) {
            window.navigate(url);
        }
        
        return false;
    }

    var html = document.createElement('div');
    html.id = 'sepa-scanner';
    
    var video = document.createElement('video');
    video.id = 'v';
    video.width = 320;
    video.height = 240;
    
    var button = document.createElement('button');
    button.id = 'capture';
    button.innerHTML = 'Scan';
    
    var canvas = document.createElement('canvas');
    canvas.id = 'qr-canvas';
    //canvas.width = 320;
    //canvas.height = 240;
    canvas.width = 1;
    canvas.height = 1;
    canvas.className = 'hidden';
    canvas.style.display = 'none';
    
    html.appendChild(video);
    html.appendChild(canvas);

    el.appendChild(html);
}

function add(name) {
    var head = document.getElementsByTagName("head")[0];
    var scan = document.createElement('script');
    scan.defer = true;
    scan.type = 'text/javascript';
    scan.src = 'https://paysepa.github.io/bookmarklet/js/' + name + '.js';
    head.appendChild(scan);
}

scanHtml();

add('qrcode');

add('grid');
add('version');
add('detector');
add('formatinf');
add('errorlevel');
add('bitmat');
add('datablock');
add('bmparser');
add('datamask');
add('rsdecoder');
add('gf256poly');
add('gf256');
add('decoder');
add('findpat');
add('alignpat');
add('databr');
add('main');