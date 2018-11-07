import PDFDocument from 'pdfkit';
import fs from 'fs';


const pdfGen = {

  generateDoc : (materials)=>{
    let doc = new PDFDocument({
     size: [360,504],
     margins : { // by default, all are 72
         top: 0,
         bottom: 0,
         left: 0,
         right: 0
     },
     layout: 'landscape', // can be 'landscape'
   });

    doc.pipe(
      fs.createWriteStream('pdf/moodboard.pdf').on("error", (err) => {
        console.log(err.message);
      })
    );
    doc.registerFont('Verdana', 'fonts/Verdana.ttf');

    const tags = materials.length;
    let pictures = [];
    for (var i = 0; i < materials.length; i++) {
      pictures.push({
        name: materials[i].name,
        photo: materials[i].photo[0].fileName
      })
    }
    const remainder = tags % 2;
    const rows = Math.floor(tags / 2);
    const total_rows = remainder ? rows +1 : rows;

    const picture_width = 252;
    const picture_height = 360/total_rows;
    let row = 0;
    for (var i = 0; i < pictures.length; i++) {
      let odd= (i % 2) == 0 ? 0 : 1
      let extra_width = 1;
      if (i == (pictures.length-1) && odd==0 )
        extra_width=2;

      let position = {
        x: picture_width * odd,
        y: picture_height*row
      }

      doc.image('pictures/'+pictures[i].photo, position.x, position.y, { width: picture_width*extra_width, height: picture_height});
      doc.font('Verdana');
      doc.text(pictures[i].name, position.x + 10, position.y +10);
      if (odd) {
        row++;
      }
    }
    doc.image('pictures/IKEA_logo_RGB.png',10,330, {width:50});
    doc.rect(340, 330, 180, 15).fill("white");
    doc.save();
    doc.fill("black");
    doc.text('#IKEASpreitenbach', 350, 330);
    doc.end()
  }

}


export default pdfGen;
