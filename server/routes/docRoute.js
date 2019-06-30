const mongoose = require('mongoose');
const Doc = mongoose.model('docs');

module.exports = app => {
  app.post('/doc', (req, res) => {
    res.send('done');
    console.log(req.body.title);
    Doc.countDocuments({ docId: 2 }, async function(err, count) {
      console.log(count);
      if (count === 0) {
        const doc = new Doc({
          docId: 2,
          title: req.body.title,
          doc: req.body.doc,
          userAddPlaces: req.body.userAddPlaces
        });
        doc.save();
      } else {
        const doc = await Doc.findOne({ docId: 2 });
        doc.set('title', req.body.title);
        doc.set('doc', req.body.doc);
        doc.set('userAddPlaces', req.body.userAddPlaces);
        doc.save();
      }
    });
  });
  app.get('/title', (req, res) => {
    res.send('Hi there');
  });
};
