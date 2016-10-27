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

  function createPoint (x, y) { return { x: x, y: y }; }
  function createRect (x1, y1, x2, y2) {
    return {
      x: x1,
      y: y1,
      width: Math.abs(x1-x2),
      height: Math.abs(y1-y2)
    };
  }

  exports.Face = Face;
})(this);
