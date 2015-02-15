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
            this.video.pause();
            $('#sepa-scanner').remove();
            return false;
        }

        txt.replace(/\r\n/g, '\n');
        lines = txt.split('\n');

        if (provider_url.indexOf('github.io') > 1 ||
            provider_url.indexOf('paysepa.loc') > 1 ||
            provider_url.indexOf('paysepa.eu') > 1) {
            provider = 'paysepa'; // PaySEPA demo
        } else if (provider_url.indexOf('raiffeisen.at') > 1) {
            provider = 'raika'; // ELBA Raiffeisen
        } else if (provider_url.indexOf('banking.co.at') > 1) {
            provider = 'hypo'; // HYPO and others
        } else if (provider_url.indexOf('bankaustria.at') > 1) {
            provider = 'ba'; // Bank Austria Uni Credit
        } else if (provider_url.indexOf('bawagpsk.com') > 1) {
            provider = 'bawag'; // BAWAG
        } else if (provider_url.indexOf('number26.de') > 1) {
            provider = 'number26'; // NUMBER26
        }

        console.log('*** scanSEPA log', provider, lines, provider_url);

        var iban,
            bic,
            amount,
            recipient,
            reference;

        // TODO do proper validation checks here
        /*if (lines.length < 12) {
            var i = 0;
            for (l in lines) {
                i++;
            }
        }*/

        if (/*lines.length == 12 &&*/ lines[0] == 'BCD' && lines[1] == '001') {
            if (lines[7] && lines[7].indexOf('EUR') === 0) {
                lines[7] = lines[7].substr(3);
                if (lines[7].indexOf(',') < 1) {
                    lines[7] = lines[7] + ',00';
                }

                // TODO check for right format (0,00 vs 0.00)
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

            // form input IDs @ NUMBER26
            if (provider == 'number26') {
                var f_iban = 'iban',
                    f_bic = 'bic',
                    f_name = 'name',
                    f_amount = 'amount',
                    f_reference = 'description';
            }


            // form input IDs @ NUMBER26
            if (provider == 'paysepa') {
                var f_iban = 'iban',
                    f_bic = 'bic',
                    f_name = 'name',
                    f_amount = 'amount',
                    f_reference = 'description';
            }

            // form input IDs @ BAWAG
            if (provider == 'bawag') {
                // TODO
                var f_iban = 'rKontoNr_itxt2',
                    f_bic = '', // not used at domestic transfers -- SEPA: ebanking.bawagpsk.com/?template=TR_EU_TRANSFER
                    f_name = '', // use name:empfaenger instead of ID
                    f_amount = '', // splitted into name:betrageur and name:betragcent
                    f_reference = 'zRef_itxt';

                    // also available
                    // TODO
            }

            // form input IDs @ BA
            if (provider == 'ba') {
                var f_iban = 'generalForm:f06_benefAccountNumbersubviewEditRend:j_id180:j_id182:f06_benefAccountNumber',
                    f_bic = 'generalForm:f07_benefBankCodesubviewEditRend:j_id196:j_id198:f07_benefBankCode',
                    f_name = 'generalForm:f04_benefName1subviewEditRend:j_id148:j_id150:f04_benefName1',
                    f_amount = 'generalForm:f09_operationAmountsubviewEditRend:editMode:valueChangeEvent:existId:f09_operationAmount',
                    f_reference = 'generalForm:f08_customerDatasubviewEditRend:j_id219:j_id221:f08_customerData';

                // also available
                // ...
            }

            if (document.getElementById(f_name)) {
                document.getElementById(f_name).value = lines[5];
            // } else if (document.getElementsByClassName(f_name)[0]) {
            //     document.getElementsByClassName(f_name)[0].value = lines[5];
            } else if (document.getElementsByName(f_name)[0]) {
                document.getElementsByName(f_name)[0].value = lines[5];
            }

            if (document.getElementById(f_amount)) {
                document.getElementById(f_amount).value = lines[7];
            // } else if (document.getElementsByClassName(f_amount)[0]) {
            //     document.getElementsByClassName(f_amount)[0].value = lines[7];
            } else if (document.getElementsByName(f_amount)[0]) {
                document.getElementsByName(f_amount)[0].value = lines[7];
            }

            var ref = '';
            // TODO concat some if multiple values?
            if (lines[9]) {
                ref = lines[9];
            } else if (lines[10]) {
                ref = lines[10];
            } else if (lines[8]) {
                ref = lines[8];
            } else if (lines[11]) {
                ref = lines[11];
            }

            if (document.getElementById(f_reference)) {
                document.getElementById(f_reference).value = ref;
            // } else if (document.getElementsByClassName(f_reference)[0]) {
            //     document.getElementsByClassName(f_reference)[0].value = lines[9];
            } else if (document.getElementsByName(f_reference)[0]) {
                var num = 0;
                if (provider == 'number26') {
                    num = 1;
                }
                document.getElementsByName(f_reference)[num].value = ref;
            }

            iban = document.getElementById(f_iban);
            if (iban) {
                iban.value = lines[6];
            // } else if (document.getElementsByClassName(f_iban)[0]) {
            //     document.getElementsByClassName(f_iban)[0].value = lines[6];
            } else if (document.getElementsByName(f_iban)[0]) {
                document.getElementsByName(f_iban)[0].value = lines[6];
            }

            bic = document.getElementById(f_bic);
            if (bic) {
                bic.value = lines[4];
            // } else if (document.getElementsByClassName(f_bic)[0]) {
            //     document.getElementsByClassName(f_bic)[0].value = lines[4];
            } else if (document.getElementsByName(f_bic)[0]) {
                document.getElementsByName(f_bic)[0].value = lines[4];
            }

            // TODO raika? or other?
            if (provider == 'raika') {
                var press = jQuery.Event("keyup");
                press.which = 13;
                jQuery(bic).trigger( press );
            }

            // resize sepa scanner on success
            var i = document.getElementById('sepa-scanner');
            i.style.display = 'none';

            // stop updating data
            // TODO also stop the webcam
            this.video.pause();
            $('#sepa-code-error').hide();
            success = true;
        } else {
            $('#sepa-code-error').show();
        }
    },

    formatContent: function scanner_format(txt) {
        if (txt.indexOf('http') === 0) {
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


        drops('#sepa-scanner', {
                            'url': 'http://paysepa.eu/test/upload/upload.php',
                            'complete': function() {
                                            $('#sepa-scanner').hide();
                                        },
                            'success': function(xhr, file) {
                                            // console.log('file uploaded', xhr, file);
                                            $('#sepa-scanner').hide();
                                            var json = JSON.parse(xhr.response);

                                            checkDocumentStatus(json);
                                            
                                        },
                            'dragover': function() { document.getElementById('sepa-scanner').style.outline = '2px solid green'; },
                            'dragleave': function() { document.getElementById('sepa-scanner').style.outline = ''; },
                            'drop': function() { /* console.log('drop');*/  }
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
                // self.video.videoWidth,self.video.videoHeight);
            }
        }, false);
        // this.capture.style.display = 'none';
        this.video.addEventListener('play', function () {
            //It should repeatly capture till a qrcode is successfully captured.
            setInterval(function () {
                self.scanQRCode();
            }, 500);
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

        // console.log('file dropped ...', files);

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
        this.context.drawImage(this.video, 0, 0, this.width, this.height);
        var data = this.canvas.toDataURL('image/png');

        if (qrcode.decode()) {
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



function checkDocumentStatus(json) {
    $.ajax({
        'url': json.gini.document_url,
        'crossDomain': true,
        'headers': {'Authorization': 'Bearer ' + json.gini.access_token,
                    'Accept': 'application/vnd.gini.v1+json',
                    },
        'success': function(xhr) {
            // console.log('sse', xhr);
            
            if (xhr.progress != 'COMPLETED') {
                setTimeout(function() { checkDocumentStatus(json); }, 500);
            } else if (xhr.progress == 'COMPLETED') {
                getExtractions(json, xhr);
            }
        }
    });
}


function getExtractions(json, xhr) {
    // console.log('getExtractions', json, xhr);
    
    $.ajax({
        'url': json.gini.document_url + '/extractions',
        'crossDomain': true,
        'headers': {'Authorization': 'Bearer ' + json.gini.access_token,
                    'Accept': 'application/vnd.gini.v1+json',
                    },
        'success': function(xhr2) {
            console.log('extractions', xhr2.extractions);

            data = xhr2.extractions;

            var iban = data.iban.value,
                bic = data.bic.value,
                name = data.senderName.value,
                amount = data.amountToPay.value.replace(':EUR', '').replace('.', ','),
                reference = (data.paymentReference && data.paymentReference.value) || (data.invoiceId && data.invoiceId.value) || (data.referenceId && data.referenceId.value) || (data.customerId && data.customerId.value);
            
            var f_iban = 'iban',
                f_bic = 'bic',
                f_name = 'name',
                f_amount = 'amount',
                f_reference = 'description';
            
            
                if (document.getElementById(f_name)) {
                    document.getElementById(f_name).value = name;
                // } else if (document.getElementsByClassName(f_name)[0]) {
                //     document.getElementsByClassName(f_name)[0].value = lines[5];
                } else if (document.getElementsByName(f_name)[0]) {
                    document.getElementsByName(f_name)[0].value = name;
                }

                if (document.getElementById(f_amount)) {
                    document.getElementById(f_amount).value = amount;
                // } else if (document.getElementsByClassName(f_amount)[0]) {
                //     document.getElementsByClassName(f_amount)[0].value = lines[7];
                } else if (document.getElementsByName(f_amount)[0]) {
                    document.getElementsByName(f_amount)[0].value = amount;
                }


                if (document.getElementById(f_reference)) {
                    document.getElementById(f_reference).value = reference;
                // } else if (document.getElementsByClassName(f_reference)[0]) {
                //     document.getElementsByClassName(f_reference)[0].value = lines[9];
                } else if (document.getElementsByName(f_reference)[0]) {
                    document.getElementsByName(f_reference)[0].value = reference;
                }

                var xiban = document.getElementById(f_iban);
                if (xiban) {
                    xiban.value = iban;
                // } else if (document.getElementsByClassName(f_iban)[0]) {
                //     document.getElementsByClassName(f_iban)[0].value = lines[6];
                } else if (document.getElementsByName(f_iban)[0]) {
                    document.getElementsByName(f_iban)[0].value = iban;
                }

                var xbic = document.getElementById(f_bic);
                if (xbic) {
                    xbic.value = bic;
                // } else if (document.getElementsByClassName(f_bic)[0]) {
                //     document.getElementsByClassName(f_bic)[0].value = lines[4];
                } else if (document.getElementsByName(f_bic)[0]) {
                    document.getElementsByName(f_bic)[0].value = bic;
                }
        }
    });
}