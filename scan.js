var scanner = document.getElementById('sepa-scanner');

function scanSEPAcode() {
    var provider_url = document.location.href,
        el = null,
        /* type = 'append', // TODO append or prepend scanner to el */
        supported = null,
        provider = null,
        url = null;

    if (provider_url.indexOf('paysepa.github.io') > 1 ||
        provider_url.indexOf('paysepa.eu') > 1) {
        el = document.getElementById('transfer');
        supported = true;
        provider = 'paysepa'; // PaySEPA demo
        url = 'https://paysepa.github.io/transfer';

    } else if (provider_url.indexOf('raiffeisen.at') > 1) {
        el = document.getElementById('j_id1_zv_WAR_zvportlet_INSTANCE_4NsO_:j_id4');
        supported = true;
        provider = 'raika'; // ELBA Raiffeisen
        url = 'https://portal.raiffeisen.at/resolveLink?serviceName=izv';
    } else if (provider_url.indexOf('banking.co.at') > 1) {
        el = document.getElementById('pageheader');
        if (provider_url.indexOf('sea_i.html') < 1) {
            // el not on the create payment form page
            el = null;
        }
        supported = true;
        provider = 'hypo'; // HYPO NOE
        url = 'https://www.banking.co.at/appl/ebp/trans/initeingabegiro.html';
    } else if (provider_url.indexOf('bawagpsk.com') > 1) {
        el = document.getElementsByClassName('top-text')[0];
        supported = true;
        provider = 'bawag'; // BAWAG
        url = 'https://ebanking.bawagpsk.com/?template=TR_DOMESTIC_TRANSFER';
    } else if (provider_url.indexOf('number26.de') > 1) {
        el = document.getElementsByClassName('UITransfers')[0];
        if (el) {
            el = el.getElementsByClassName('wrapper')[0].getElementsByTagName('h1')[0];
        }
        supported = true;
        provider = 'number26'; // NUMBER26
        url = 'https://my.number26.de/#/transfers';
    } else if (provider_url.indexOf('bankaustria.at') > 1) {
        el = document.getElementsByClassName('wpt_wcm_content_link_container')[0];
        supported = false;
        provider = 'ba'; // Bank Austria / Uni Credit
    }

    if (!supported) {
        alert('Your online banking system is currently not supported.');
        return false;
    }

    if (!el /*|| provider_url != url*/) {
        alert('Could not attach ScanSEPA - navigate to the transfer form page first.');
        if (url) {
            window.location.href = url;
        } else {
            return false;
        }
    }

    if (scanner) {
        scanner.style.display = 'block';
    } else {
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
        canvas.width = 1;
        canvas.height = 1;
        canvas.className = 'hidden';
        canvas.style.display = 'none';

        var error = document.createElement('p');
        var errorMsg = document.createTextNode('The scanned code is no valid SEPA payment code.');
        error.id = 'sepa-code-error';
        error.style.display = 'none';
        error.appendChild(errorMsg);

        var info = document.createElement('p');
        var infoMsg = document.createTextNode('Allow access to your webcam to scan SEPA payment codes.');
        info.id = 'sepa-code-info';
        info.style.display = 'none';
        info.appendChild(infoMsg);

        html.appendChild(video);
        html.appendChild(canvas);
        html.appendChild(error);
        html.appendChild(info);

        el.appendChild(html);
    }
}

function add(name) {
    var head = document.getElementsByTagName("head")[0];
    var scan = document.createElement('script');
    scan.defer = true;
    scan.type = 'text/javascript';
    scan.src = 'https://paysepa.github.io/bookmarklet/js/' + name + '.js';
    head.appendChild(scan);
}


if (!window.jQuery) {
    add('jquery');
}

if (!scanner) {
    add('sepacode-scanner');
}

scanSEPAcode();
