'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pdfkit = require('pdfkit');

var _pdfkit2 = _interopRequireDefault(_pdfkit);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pdfGen = {

  generateDoc: function generateDoc(materials) {
    var doc = new _pdfkit2.default({
      size: [360, 504],
      margins: { // by default, all are 72
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      },
      layout: 'landscape' // can be 'landscape'
    });

    var stream = doc.pipe(_fs2.default.createWriteStream('pdf/moodboard.pdf').on("error", function (err) {
      console.log(err.message);
    }));
    doc.registerFont('Verdana', 'fonts/Verdana.ttf');

    var tags = materials.length;
    var pictures = [];
    for (var i = 0; i < materials.length; i++) {
      pictures.push({
        name: materials[i].name,
        photo: materials[i].photo[0].fileName
      });
    }
    var remainder = tags % 2;
    var rows = Math.floor(tags / 2);
    var total_rows = remainder ? rows + 1 : rows;

    var picture_width = 252;
    var picture_height = 360 / total_rows;
    var row = 0;
    for (var i = 0; i < pictures.length; i++) {
      var odd = i % 2 == 0 ? 0 : 1;
      var extra_width = 1;
      if (i == pictures.length - 1 && odd == 0) extra_width = 2;

      var position = {
        x: picture_width * odd,
        y: picture_height * row
      };

      doc.image('pictures/' + pictures[i].photo, position.x, position.y, { width: picture_width * extra_width, height: picture_height });
      doc.font('Verdana');
      doc.text(pictures[i].name, position.x + 10, position.y + 10);
      if (odd) {
        row++;
      }
    }
    doc.image('pictures/IKEA_logo_RGB.png', 10, 330, { width: 50 });
    doc.rect(340, 330, 180, 15).fill("white");
    doc.save();
    doc.fill("black");
    doc.text('#IKEASpreitenbach', 350, 330);
    doc.end();
    return stream;
  }

};

exports.default = pdfGen;