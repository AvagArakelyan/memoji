(function (exports, $, Face, Webcam) {

    $(document).ready(function () {
        Webcam.attach('#my_camera');

        $('#snapshot_btn').on('click', function () {
            Webcam.snap(function (data_uri) {
                requestFaceMeta(data_uri).then(function (data) {
                    console.log('data=', data);
                });

                document.getElementById('my_result').innerHTML = '<img src="' + data_uri + '"/>';
            });
        });
        $('#upload_photo').on('change', function () {
            var files = this.files;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var imageType = /image.*/;
                if (!file.type.match(imageType)) {
                    continue;
                }
                var img = new Image();
                img.file = file;
                document.getElementById('my_result').appendChild(img);
                var reader = new FileReader();
                reader.onload = (function (aImg) {
                    return function (e) {
                        aImg.src = e.target.result;
                        requestFaceMeta(aImg.src).then(function (data) {
                            console.log('data=', data);
                        });
                    };
                })(img);
                reader.readAsDataURL(file);
            }
        });
    });


    function requestFaceMeta(imageUri) {
        var data = /data:(image\/\w+);base64,(.*)/gmi.exec(imageUri);
        var format = data[1];
        var ext = format.split('/')[1];
        var binary = atob(data[2]);

        var imageData = new Uint8Array(binary.length);
        for (var i = 0; i < binary.length; i++) {
            imageData[i] = binary.charCodeAt(i);
        }

        var params = {
            'returnFaceId': 'true',
            'returnFaceLandmarks': 'false',
            'returnFaceAttributes': 'gender,age'
        };
        return $.ajax({
            url: 'https://api.projectoxford.ai/face/v1.0/detect?' + $.param(params),
            beforeSend: function (xhrObj) {
                xhrObj.setRequestHeader('Content-Type', 'application/octet-stream');
                xhrObj.setRequestHeader('Ocp-Apim-Subscription-Key', 'c557e467c8954049aa3156f874d3b694');
            },
            type: 'POST',
            data: imageData,
            processData: false
        });
    }


})(this, jQuery, Face, Webcam);
