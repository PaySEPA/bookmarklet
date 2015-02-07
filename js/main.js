var success = false;

var SEPACodeScanner = {
    canvas: document.getElementById('qr-canvas'),
    video: document.getElementById('v'),
    capture: document.getElementById('capture'),
    info: document.getElementById('info'),
    error: document.getElementById('sepa-code-error'),
    header: document.getElementById('header'),
    width: 320,
    height: 240,
    streaming: false,

    /**
     * Present content on screen
     */
    read: function scanner_read(txt) {

        var lines = [],
            provider = null,
            provider_url = parent.document.location.href,
            iFrame = null;

        if (success) {
            return false;
        }

        txt.replace(/\r\n/g, '\n');
        lines = txt.split('\n');

        if (provider_url.indexOf('raiffeisen.at') > 1) {
            provider = 'raika'; // ELBA Raiffeisen
        } else if (provider_url.indexOf('banking.co.at') > 1) {
            provider = 'hypo'; // HYPO NOE
        } else if (provider_url.indexOf('bankaustria.at') > 1) {
            provider = 'ba'; // Bank Austria Uni Credit
        } else if (provider_url.indexOf('bawagpsk.com') > 1) {
            provider = 'bawag';
        } else if (provider_url.indexOf('number26.com') > 1) {
            provider = 'number26';
        }

        // local dev stuff
        if (provider_url.indexOf('ELBA') > 1) {
            provider = 'raika'; // ELBA Raiffeisen
        } else if (provider_url.indexOf('HYPO') > 1) {
            provider = 'hypo'; // HYPO NOE
        }

        console.log(lines);
        console.log(provider, provider_url);

        var iban,
            bic,
            amount,
            recipient,
            reference;

        if(lines[0] == 'BCD' && lines[1] == '001') {
            if (lines[7].indexOf('EUR') === 0) {
                lines[7] = lines[7].substr(3);
                if (lines[7].indexOf(',') < 1) {
                    lines[7] = lines[7] + ',00';
                }

                // check for right format (0,00 vs 0.00)
                // console.log('** amount', lines[7]);
            }
            
            if (lines[6]) {
                // use print format for all right now
                lines[6] = IBAN.printFormat(lines[6]);
            }

            // form input IDs @ ELBA
            if (provider == 'raika') {
                var f_iban = 'j_id1_zv_WAR_zvportlet_INSTANCE_4NsO_:auftrag:empfaenger_IbanUndKontonummer',
                    f_bic = 'j_id1_zv_WAR_zvportlet_INSTANCE_4NsO_:auftrag:empfaenger_BicUndBlz',
                    f_name = 'j_id1_zv_WAR_zvportlet_INSTANCE_4NsO_:auftrag:empfaenger_name',
                    f_amount = 'j_id1_zv_WAR_zvportlet_INSTANCE_4NsO_:auftrag:betrag',
                    f_reference = 'j_id1_zv_WAR_zvportlet_INSTANCE_4NsO_:auftrag:zahlungsreferenz';

                    // also available
                    // empfaenger_anschrift, verwendungszweck_zeile[1-4], auftraggeberreferenz, durchfuehrungsdatum
            }

            // form input IDs @ HYPO
            if (provider == 'hypo') {
                var f_iban = 'ntfempfkto',
                    f_bic = 'bankCode',
                    f_name = 'recname',
                    f_amount = 'amount',
                    f_reference = 'ntfzahlungsreferenz';

                    // also available
                    // usage[1-4], origId, caldate
            }

            // form input IDs @ HYPO
            if (provider == 'number26') {
                var f_iban = 'iban',
                    f_bic = 'bic',
                    f_name = 'name',
                    f_amount = 'amount',
                    f_reference = 'description';

                    // also available
                    // usage[1-4], origId, caldate
            }

            // form input IDs @ BAWAG
            if (provider == 'bawag') {
                var f_iban = 'rKontoNr_itxt2',
                    f_bic = '', // not used at domestic transfers -- SEPA: ebanking.bawagpsk.com/?template=TR_EU_TRANSFER
                    f_name = '', // use name:empfaenger instead of ID
                    f_amount = '', // splitted into name:betrageur and name:betragcent
                    f_reference = 'zRef_itxt';

                    // also available
                    // 
            }

            // form input IDs @ BA
            if (provider == 'ba') {
                var f_iban = 'generalForm:f06_benefAccountNumbersubviewEditRend:j_id180:j_id182:f06_benefAccountNumber',
                    f_bic = 'generalForm:f07_benefBankCodesubviewEditRend:j_id196:j_id198:f07_benefBankCode',
                    f_name = 'generalForm:f04_benefName1subviewEditRend:j_id148:j_id150:f04_benefName1',
                    f_amount = 'generalForm:f09_operationAmountsubviewEditRend:editMode:valueChangeEvent:existId:f09_operationAmount',
                    f_reference = 'generalForm:f08_customerDatasubviewEditRend:j_id219:j_id221:f08_customerData';

                // not working
                iFrame = window.frames['appFrameUnico'];
                iFrame.document.getElementById(f_iban).value = lines[6];
                iFrame.document.getElementById(f_bic).value = lines[4];
                iFrame.document.getElementById(f_name).value = lines[5];
                iFrame.document.getElementById(f_amount).value = lines[7];
                iFrame.document.getElementById(f_reference).value = lines[9];

                // also available
                // ...
            }

            if (document.getElementById(f_name)) {
                document.getElementById(f_name).value = lines[5];
            } else if (document.getElementsByClassName(f_name)[0]) {
                document.getElementsByClassName(f_name)[0].value = lines[5];
            } else if (document.getElementsByName(f_name)[0]) {
                document.getElementsByName(f_name)[0].value = lines[5];
            }
            
            if (document.getElementById(f_amount)) {
                document.getElementById(f_amount).value = lines[7];
            } else if (document.getElementsByClassName(f_amount)[0]) {
                document.getElementsByClassName(f_amount)[0].value = lines[7];
            } else if (document.getElementsByName(f_amount)[0]) {
                document.getElementsByName(f_amount)[0].value = lines[7];
            }

            if (document.getElementById(f_reference)) {
                document.getElementById(f_reference).value = lines[9];
            } else if (document.getElementsByClassName(f_reference)[0]) {
                document.getElementsByClassName(f_reference)[0].value = lines[9];
            } else if (document.getElementsByName(f_reference)[0]) {
                document.getElementsByName(f_reference)[0].value = lines[9];
            }
            
            iban = document.getElementById(f_iban);
            if (iban) {
                iban.value = lines[6];
            } else if (document.getElementsByClassName(f_iban)[0]) {
                document.getElementsByClassName(f_iban)[0].value = lines[6];
            } else if (document.getElementsByName(f_iban)[0]) {
                document.getElementsByName(f_iban)[0].value = lines[6];
            }
            
            bic = document.getElementById(f_bic);
            if (bic) {
                bic.value = lines[4];
            } else if (document.getElementsByClassName(f_bic)[0]) {
                document.getElementsByClassName(f_bic)[0].value = lines[4];
            } else if (document.getElementsByName(f_bic)[0]) {
                document.getElementsByName(f_bic)[0].value = lines[4];
            }

            var press = jQuery.Event("keyup");
            press.which = 13;
            jQuery(bic).trigger( press );

            // resize scanner iframe on success
            var i = document.getElementById('sepa-scanner');
            i.style.display = 'none';
            // i.width = 100;
            // i.height = 30;

            // stop updating data
            // TODO also stop the webcam
            success = true;
        } else {
            error.show();
            return false;
        }

        if(txt) {
            this.video.pause();
        }
    },

    formatContent: function scanner_format(txt) {
        if(txt.indexOf('http') === 0) {
            return '<a href="' + txt + '" target="_blank">' + txt + '</a>';
        } else {
            return txt;
        }
    },

    // imageData: null,
    context: null,

    init: function scanner_init() {
        navigator.getMedia = (navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);
        var self = this;
        navigator.getMedia({
                video: true,
                audio: false
            },
            function (stream) {
                // if (navigator.mozGetUserMedia) {
                //   self.video.mozSrcObject = stream;
                // } else {
                var vendorURL = window.URL || window.webkitURL;
                self.video.src = vendorURL.createObjectURL(stream);
                // }
                self.video.play();
            },
            function (err) {
                console.log("An error occured! " + err);
            }
        );

        this.canvas.addEventListener("dragenter", this.dragenter, false);
        this.canvas.addEventListener("dragover", this.dragover, false);
        this.canvas.addEventListener("drop", this.drop.bind(this), false);

        qrcode.callback = this.read.bind(this);

        this.video.addEventListener('canplay', function (ev) {
            if(!self.streaming) {
                // self.height = self.video.videoHeight / (self.video.videoWidth/self.width);
                self.video.setAttribute('width', self.width);
                self.video.setAttribute('height', self.height);
                self.canvas.setAttribute('width', self.width);
                self.canvas.setAttribute('height', self.height);
                self.streaming = true;
                // console.log('w:'+self.video.videoWidth+'/h:'+self.video.videoHeight);
                self.canvas.style.width = self.width + "px";
                self.canvas.style.height = self.height + "px";
                self.canvas.width = self.width;
                self.canvas.height = self.height;
                self.context = self.canvas.getContext("2d");
                self.context.clearRect(0, 0, self.width, self.height);
                // self.imageData = self.context.getImageData(0,0,
                //   self.video.videoWidth,self.video.videoHeight);
            }
        }, false);

        // this.capture.style.display = 'none';

        this.video.addEventListener('play', function () {
            //It should repeatly capture till a qrcode is successfully captured.
            setInterval(function () {
                self.scanQRCode();
            }, 1000);
        }, false);
    },

    dragenter: function scanner_dragenter(e) {
        e.stopPropagation();
        e.preventDefault();
    },

    dragover: function scanner_dragover(e) {
        e.stopPropagation();
        e.preventDefault();
    },

    drop: function scanner_drop(e) {
        e.stopPropagation();
        e.preventDefault();

        var dt = e.dataTransfer;
        var files = dt.files;

        this.handleFiles(files);
    },

    handleFiles: function scanner_handleFiles(f) {
        var o = [];
        for(var i = 0; i < f.length; i++) {
            var reader = new FileReader();

            reader.onload = (function (theFile) {
                return function (e) {
                    qrcode.decode(e.target.result);
                };
            })(f[i]);

            // Read in the image file as a data URL.
            reader.readAsDataURL(f[i]);
        }
    },

    /**
     * Decode the QRCode
     */
    scanQRCode: function scanner_scanQRCode() {
        // this.video.play();
        this.context.drawImage(this.video, 0, 0, this.width, this.height);
        var data = this.canvas.toDataURL('image/png');
        // this.photo.setAttribute('src', data);

        if(qrcode.decode()) {
            // Stop automatic capture.
            // this.capture.style.display = 'block';
            this.video.pause();

            var self = this;
            // Restart video capturing.
            /* this.capture.addEventListener('click', function () {
                document.getElementById('message').innerHTML = "";
                self.capture.style.display = 'none';
                self.video.play();
            }, false); */
        }
    }
};

SEPACodeScanner.init();

/*window.addEventListener('load', function onload_scanner() {
    window.removeEventListener('load', onload_scanner);
    SEPACodeScanner.init();
});*/