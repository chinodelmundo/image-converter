const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const { createWorker } = require('tesseract.js');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage }).single('avatar');

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/upload', (req, res) => {
  upload(req, res, err => {
    fs.readFile(`./uploads/${req.file.originalname}`, (err, file) => {
      if (err) return console.log('This is your error'.err);

      const worker = createWorker({
        logger: m => console.log(m)
      });

      (async () => {
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        await worker.recognize(file);

        const { data } = await worker.getPDF('Tesseract OCR Result');
        fs.writeFileSync(
          `${__dirname}/outputs/${req.file.originalname}.pdf`,
          Buffer.from(data)
        );
        await worker.terminate();
        res.redirect(`/download?filename=${req.file.originalname}.pdf`);
      })();
    });
  });
});

router.get('/download', (req, res) => {
  const file = `${__dirname}/outputs/${req.query.filename}`;
  res.download(file);
});

module.exports = router;
