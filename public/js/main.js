(function (exports, $, Face, Webcam, SVG) {

  $(document).ready(function () {
    Webcam.attach('#my_camera');
    var popup = document.getElementById('popup');

    $('#snapshot_btn').on('click', function () {
      Webcam.snap(function (data_uri) {
        document.getElementById('my_result').innerHTML = '';
        document.getElementById('my_result').innerHTML = '<img src="' + data_uri + '"/>';
        popup.classList.remove('hidden');

        requestFaceMeta(data_uri).then(function (data) {
          console.log('data=', data);
          $('#sm').empty();

          var test_w = 320;
          var test_h = 240;
          var draw = SVG('sm').size(test_w, test_h);

          var face = data[0];
          var fw = face.faceRectangle.width;
          var fh = face.faceRectangle.height;
          var mouthRect = {
            left: Math.abs(face.faceLandmarks.mouthLeft.x - face.faceRectangle.left) / fw,
            top: Math.abs(face.faceLandmarks.upperLipTop.y - face.faceRectangle.top) / fh,
            width: Math.abs(face.faceLandmarks.mouthRight.x - face.faceLandmarks.mouthLeft.x) / fw,
            height: Math.abs(face.faceLandmarks.upperLipTop.y - face.faceLandmarks.underLipBottom.y) / fh
          };
          draw.rect(mouthRect.width*test_w, mouthRect.height*test_h).attr({ fill: 'red' })
            .move(mouthRect.left*test_w, mouthRect.top*test_h);

          var leftEyeRect = {
            left: Math.abs(face.faceLandmarks.eyeLeftOuter.x - face.faceRectangle.left) / fw,
            top: Math.abs(face.faceLandmarks.eyeLeftTop.y - face.faceRectangle.top) / fh,
            width: Math.abs(face.faceLandmarks.eyeLeftOuter.x - face.faceLandmarks.eyeLeftInner.x) / fw,
            height: Math.abs(face.faceLandmarks.eyeLeftBottom.y - face.faceLandmarks.eyeLeftTop.y) / fh
          };
          draw.rect(leftEyeRect.width*test_w, leftEyeRect.height*test_h).attr({ fill: 'white' })
            .move(leftEyeRect.left*test_w, leftEyeRect.top*test_h);

          var rightEyeRect = {
            left: Math.abs(face.faceLandmarks.eyeRightInner.x - face.faceRectangle.left) / fw,
            top: Math.abs(face.faceLandmarks.eyeRightTop.y - face.faceRectangle.top) / fh,
            width: Math.abs(face.faceLandmarks.eyeRightOuter.x - face.faceLandmarks.eyeRightInner.x) / fw,
            height: Math.abs(face.faceLandmarks.eyeRightBottom.y - face.faceLandmarks.eyeRightTop.y) / fh
          };
          draw.rect(rightEyeRect.width*test_w, rightEyeRect.height*test_h).attr({ fill: 'white' })
            .move(rightEyeRect.left*test_w, rightEyeRect.top*test_h);

          var noseRect = {
            left: (Math.abs(face.faceLandmarks.noseTip.x - face.faceRectangle.left) - 0.1*fw) / fw,
            top: Math.abs(face.faceLandmarks.noseTip.y - face.faceRectangle.top) / fh,
            width: 0.2,
            height: 0.1
          };
          draw.rect(noseRect.width*test_w, noseRect.height*test_h).attr({ fill: 'brown' })
            .move(noseRect.left*test_w, noseRect.top*test_h);

          svg.find('#Mouth').attr('transform', 'matrix(' + getPositionMatrix('#Mouth', mouthRect).join(',') + ')');
          svg.find('#Left_Eye').attr('transform', 'matrix(' + getPositionMatrix('#Left_Eye', leftEyeRect).join(',') + ')');
        });
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
        document.getElementById('my_result').innerHTML = '';
        document.getElementById('my_result').appendChild(img);
        popup.classList.remove('hidden');

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

    $('.close').on('click', function () {
      $('#popup').addClass('hidden');
      $('#my_result').html('');
    });
  });

  var svg = $('#smiley svg');
  var svgRect = svg[0].getBoundingClientRect();

  var initPositions = {
    '#Mouth': normalizePoint($('#Mouth')[0].getBoundingClientRect(), svgRect),
    '#Left_Eye': normalizePoint($('#Left_Eye')[0].getBoundingClientRect(), svgRect)
  };

  function getPositionMatrix ( svgElementSelector, partRectangle ) {
    var svgRect = svg[0].getBoundingClientRect();
    var elRect = initPositions[svgElementSelector]; //normalizePoint($el[0].getBoundingClientRect(), svgRect);

    var svg_w = 237;
    var svg_h = 270.8;

    var scaleX = (partRectangle.width * svgRect.width) / elRect.width; // * (svgRect.width / svg_w);
    var scaleY = (partRectangle.height * svgRect.height) / elRect.height; // * (svgRect.height / svg_h);
    var moveX = elRect.left - partRectangle.left * svgRect.width;
    var moveY = elRect.top - partRectangle.top * svgRect.height;

    console.log('scales=',[scaleX, scaleY])
    var result = [
      1, //scaleX,
      0,
      0,
      1, //scaleY,
      moveX,// * (1 - scaleX),
      moveY// * (1 - scaleY)
    ];
    return result;
  }

  function normalizePoint (rectangle, baseRect) {
    return {
      left: rectangle.left - baseRect.left,
      top: rectangle.top - baseRect.top,
      width: rectangle.width,
      height: rectangle.height
    };
  }

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
      returnFaceId: 'true',
      returnFaceLandmarks: 'true',
      returnFaceAttributes: 'gender,age'
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
})(this, jQuery, Face, Webcam, SVG);
