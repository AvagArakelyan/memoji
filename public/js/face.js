/**
 * Face positioning library
 */
(function(exports) {
  var Face = {
      getPositions: function (faceMetaData) {
        return {

        };
      },
      createPoint: createPoint,
      createRect: createRect
  };

  function createPoint (left, top) { return { left: left, top: top }; }
  function createRect (x1, y1, x2, y2) {
    return {
      left: x1,
      top: y1,
      width: Math.abs(x1-x2),
      height: Math.abs(y1-y2)
    };
  }

  exports.Face = Face;
})(this);
