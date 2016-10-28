(function (exports, $, Face, Webcam, SVG, Canvas) {

  $(document).ready(function () {
    Webcam.attach('#my_camera');
    var popup = document.getElementById('popup');

    var coef = {
      teen_male: {
        hb: 1/3,
        hk: 3/5,
        wb: 0,
        wk: 1
      },
      teen_female: {
        hb: 1/3,
        hk: 3/6,
        wb: 1/9,
        wk: 0.7
      },
      mid_male: {
        hb: 1.5/5,
        hk: 3/5,
        wb: 0,
        wk: 1
      },
      mid_female: {
        hb: 1.7/5,
        hk: 2/5,
        wb: 1/9,
        wk: 0.8
      },
      mature_male: {
        hb: 1/5,
        hk: 4/5,
        wb: 0,
        wk: 1
      },
      mature_female: {
        hb: 1/3,
        hk: 4/6,
        wb: 1/9,
        wk: 0.8
      }
    };

    $('#snapshot_btn').on('click', function () {
      Webcam.snap(function (data_uri) {
        document.getElementById('my_result').innerHTML = '';
        document.getElementById('my_result').innerHTML = '<img src="' + data_uri + '"/>';
        popup.classList.remove('hidden');

        requestFaceMeta(data_uri)
          .then(function (data) {
            $('#smiley-container').empty();
            var test_w = 320;
            var test_h = 370;

            var face = data[0];
            if (!face) {
              alert('No face detected');
              return;
            }

            var fw = face.faceRectangle.width;
            var fh = face.faceRectangle.height;

            var age = face.faceAttributes.age > 60 ? 'mature' :
              face.faceAttributes.age > 18 ? 'mid' :
              face.faceAttributes.age > 5 ? 'teen' :
                'mid';

            var category = age + '_' + face.faceAttributes.gender;
            var emotions = ['Normal', 'Happy', 'Angry', 'Surprised', 'Hug', 'Sad'];

            for (var i=0; i !== 6; ++i) {
              $('<div id="smiley' +i +'" class="memojy-block">').appendTo('#smiley-container');
              var draw = SVG('smiley'+i).size(test_w, test_h);

              var path = category + '/0' + (i+1) + '-' + emotions[i];

              var faceRect = {
                  left: 0,
                  top: 0,
                  width: test_w / fw,
                  height: test_h / fh
              };

              draw.image('images/smileys/'+ path +'/face.svg' ,
                  test_w, test_h)
                  .move(faceRect.left * test_w, faceRect.top*test_h)
                  .scale(1,1);

              var mouthRect = {
                left: Math.abs(face.faceLandmarks.mouthLeft.x - face.faceRectangle.left) / fw,
                top: Math.abs(face.faceLandmarks.upperLipTop.y - face.faceRectangle.top) / fh,
                width: Math.abs(face.faceLandmarks.mouthRight.x - face.faceLandmarks.mouthLeft.x) / fw,
                height: Math.abs(face.faceLandmarks.upperLipTop.y - face.faceLandmarks.underLipBottom.y) / fh
              };

              //draw.rect(mouthRect.width*test_w, mouthRect.height*test_h).attr({ fill: 'red' })
              //  .move(mouthRect.left*test_w, mouthRect.top*test_h);

              drawBodyPart(category, draw, 'images/smileys/'+ path + '/mouth.svg', mouthRect, test_w, test_h );
              var leftEyeRect = {
                left: Math.abs(face.faceLandmarks.eyeLeftOuter.x - face.faceRectangle.left) / fw,
                top: Math.abs(face.faceLandmarks.eyeLeftTop.y - face.faceRectangle.top) / fh,
                width: Math.abs(face.faceLandmarks.eyeLeftOuter.x - face.faceLandmarks.eyeLeftInner.x) / fw,
                height: Math.abs(face.faceLandmarks.eyeLeftBottom.y - face.faceLandmarks.eyeLeftTop.y) / fh
              };

              //draw.rect(leftEyeRect.width*test_w, leftEyeRect.height*test_h)
              //  .fill('#ff0')
              //  .move(leftEyeRect.left*test_w, leftEyeRect.top*test_h);

              drawBodyPart(category, draw, 'images/smileys/'+ path +'/left-eye.svg', leftEyeRect, test_w, test_h, true );

              var rightEyeRect = {
                left: Math.abs(face.faceLandmarks.eyeRightInner.x - face.faceRectangle.left) / fw,
                top: Math.abs(face.faceLandmarks.eyeRightTop.y - face.faceRectangle.top) / fh,
                width: Math.abs(face.faceLandmarks.eyeRightOuter.x - face.faceLandmarks.eyeRightInner.x) / fw,
                height: Math.abs(face.faceLandmarks.eyeRightBottom.y - face.faceLandmarks.eyeRightTop.y) / fh
              };
              //draw.rect(rightEyeRect.width*test_w, rightEyeRect.height*test_h).attr({ fill: 'white' })
              //  .move(rightEyeRect.left*test_w, rightEyeRect.top*test_h);

              drawBodyPart(category, draw, 'images/smileys/' + path + '/right-eye.svg', rightEyeRect, test_w, test_h, true );

              var noseRect = {
                left: (Math.abs(face.faceLandmarks.noseTip.x - face.faceRectangle.left) - 0.1*fw) / fw,
                top: Math.abs(face.faceLandmarks.noseTip.y - face.faceRectangle.top) / fh,
                width: 0.2,
                height: 0.1
              };
              //draw.rect(noseRect.width*test_w, noseRect.height*test_h).attr({ fill: 'brown' })
              //  .move(noseRect.left*test_w, noseRect.top*test_h);

              if (path.indexOf('mid_female') === -1) {
                drawBodyPart(category, draw, 'images/smileys/' + path + '/nose.svg', noseRect, test_w, test_h );
              }
            }

            function drawBodyPart (category, draw, url, rect, container_w , container_h, dont_stretch) {
              draw.image(url , rect.width*container_w, rect.height*container_h)
                .move(
                  container_w * (coef[category].wb + rect.left * coef[category].wk),
                  container_h * (coef[category].hb + rect.top * coef[category].hk)
                )
                .scale(
                  !dont_stretch ? 1 : rect.width > rect.height ? rect.width/rect.height : 1,
                  !dont_stretch ? 1 : rect.width > rect.height ? 1 : rect.height/rect.width
              );
            }
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
      returnFaceAttributes: 'gender,age,headPose,smile,facialHair,glasses'
    };

    // canvas.draw(params.returnFaceLandmarks);
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
})(this, jQuery, Face, Webcam, SVG, Canvas);
