(function (exports) {

  var Canvas = {
    draw: draw
  }
  function draw (param) {
    var ctx = document.getElementById('canvas').getContext('2d');
    var coeff = 14;
// ctx.strokeRect(0,0,350,350);
    ctx.beginPath();
    ctx.strokeStyle = '#fff';
    ctx.fillStyle = 'wheat';
    ctx.arc(75, 75, 75, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();

//left eye
    ctx.beginPath();
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.moveTo(param.eyeLeftOuter.x, param.eyeLeftOuter.y);  //eyeLeftOuter
    // ctx.moveTo(293-260, 156.1-100);  //eyeLeftOuter
    ctx.lineTo(param.eyeLeftTop.x, param.eyeLeftTop.y); // eyeLeftTop
    // ctx.lineTo(303.7-260, 152.7-100); // eyeLeftTop
    ctx.lineTo(param.eyeLeftInner.x, param.eyeLeftInner.y); // eyeLeftInner
    // ctx.lineTo(312.8-260, 157.7-100); // eyeLeftInner
    ctx.lineTo(param.eyeLeftBottom.x, param.eyeLeftBottom.y); // eyeLeftBottom
    // ctx.lineTo(302.7-260, 159-100); // eyeLeftBottom
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

//right eye
    ctx.beginPath();
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    // ctx.moveTo(377.1-260, 161-100);  //eyeRightOuter
    ctx.moveTo(param.eyeRightOuter.x, param.eyeRightOuter.y);  //eyeRightOuter
    // ctx.lineTo(368-260, 162.6-100); //eyeRightBottom
    ctx.lineTo(param.eyeRightBottom.x, param.eyeRightBottom.y); //eyeRightBottom
    // ctx.lineTo(359.2-260, 160.7-100); //eyeRightInner
    ctx.lineTo(param.eyeRightInner.x, param.eyeRightInner.y); //eyeRightInner
    // ctx.lineTo(368.7-260, 157.1-100); //eyeRightTop
    ctx.lineTo(param.eyeRightTop.x, param.eyeRightTop.y); //eyeRightTop
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

// left eye pupil
    ctx.beginPath();
    ctx.fillStyle = '#000';
    ctx.arc(param.pupilLeft.x, param.pupilLeft.y, 3, 0 * Math.PI, 1.5 * Math.PI);  //pupilLeft
    ctx.fill();
    ctx.closePath();

// right eye pupil
    ctx.beginPath();
    ctx.fillStyle = '#000';
    ctx.arc(param.pupilRight.x, param.pupilRight.y, 3, 0 * Math.PI, 1.5 * Math.PI);   //pupilRight
    ctx.fill();
    ctx.closePath();

//mouth
    ctx.beginPath();
    ctx.fillStyle = '#f00';
    ctx.moveTo(param.mouthLeft.x, param.mouthLeft.y); //mouthLeft
    // ctx.moveTo(291.2-260,211.7-100); //mouthLeft
// ctx.lineTo(332.4-260,209.8-100); //upperLipTop
// ctx.lineTo(369.3-260,218.7-100); //mouthRight
// ctx.lineTo(331.6-260,216-100); //upperLipBottom
// ctx.lineTo(291.2-260,211.7-100); //mouthLeft
// ctx.lineTo(328.3-260, 244.9-100); //underLipBottom
// ctx.lineTo(369.3-260,218.7-100); //mouthRight
// ctx.lineTo(329.4-260, 235-100); //underLipTop
// ctx.lineTo(291.2-260,211.7-100); //mouthLeft
//     ctx.quadraticCurveTo(331.6-260,216-100,369.3-260,218.7-100);
//     ctx.quadraticCurveTo(332.4-260,209.8-100,291.2-260,211.7-100);
//     ctx.quadraticCurveTo(328.3-260,244.9-100,369.3-260,218.7-100);
//     ctx.quadraticCurveTo(329.4-260,235-100,291.2-260,211.7-100);
    ctx.quadraticCurveTo(param.upperLipBottom.x, param.upperLipBottom.y, param.mouthRight.x, param.mouthRight.y);
    ctx.quadraticCurveTo(param.upperLipTop.x, param.upperLipTop.y, param.mouthLeft.x, param.mouthLeft.y);
    ctx.quadraticCurveTo(param.underLipBottom.x, param.underLipBottom.y, param.mouthRight.x, param.mouthRight.y);
    ctx.quadraticCurveTo(param.underLipTop.x, param.underLipTop.x, param.mouthLeft.x, param.mouthLeft.y);
    ctx.fill();
    ctx.closePath();

//eyebrow Left
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.moveTo(param.eyebrowLeftOuter.x, param.eyebrowLeftOuter.y); //eyebrowLeftOuter
    // ctx.moveTo(280.7-260, 144.4-100); //eyebrowLeftOuter
    ctx.quadraticCurveTo((param.eyebrowLeftInner.x - param.eyebrowLeftOuter.x) / 2 + param.eyebrowLeftOuter.x, param.eyebrowLeftOuter.y - coeff, param.eyebrowLeftInner.x, param.eyebrowLeftInner.y);
// ctx.lineTo(324.7-260, 143.2-100); //eyebrowLeftInner
    ctx.stroke();
    ctx.closePath();

//eyebrow Right
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.moveTo(param.eyebrowRightOuter.x, param.eyebrowLRightOuter.y); //eyebrowRightOuter
    ctx.quadraticCurveTo((param.eyebrowRightInner.x - param.eyebrowRightOuter.x) / 2 + param.eyebrowRightOuter.x, param.eyebrowRightOuter.y - coeff, param.eyebrowRightInner.x, param.eyebrowRightInner.y);
// ctx.lineTo(388.8-260,151.7-100); //eyebrowRightInner
    ctx.stroke();
    ctx.closePath();

//nose
    ctx.beginPath();
    ctx.strokeStyle = '#ccc';

    ctx.moveTo(param.noseRootLeft.x, param.noseRootLeft.y); //noseRootLeft
    // ctx.moveTo(326.3-260,159.7-100); //noseRootLeft
    ctx.lineTo(param.noseLeftAlarTop.x, param.noseLeftAlarTop.y); //noseLeftAlarTop
    // ctx.lineTo(320.2-260,175.2-100); //noseLeftAlarTop
    ctx.lineTo(param.noseLeftAlarTip.x, param.noseLeftAlarTip.y); //noseLeftAlarTip
    ctx.quadraticCurveTo(param.noseTip.x, param.noseTip.y, param.noseRightAlarTip.x, param.noseRightAlarTip.y);
    // ctx.quadraticCurveTo(334.8-260,191.3-100,361.4-260,190.2-100);
// ctx.lineTo(334.8-260,191.3-100); //noseTip
// ctx.lineTo(361.4-260,190.2-100); //noseRightAlarTip
    ctx.lineTo(param.noseRightAlarTop.x, param.noseRightAlarTop.y); //noseRightAlarTop
    ctx.lineTo(param.noseRootRight.x, param.noseRootRight.y); //noseRootRight
    // ctx.lineTo(346.3-260,161.5-100); //noseRootRight
    ctx.stroke();
    ctx.closePath();

    return ctx;
  }


    exports.Canvas = Canvas;


})(this);
