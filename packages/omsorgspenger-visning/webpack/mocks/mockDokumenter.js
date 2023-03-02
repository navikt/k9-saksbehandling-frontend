const path = require('path');

const saksnrDokumenterMap = {
  '200': path.join(__dirname, 'mockdata', 'dokumenter_200.json')
};

const mockDokumenter = app => {
  app.get('/api/dokumenter', (req, res) => {
    const {saksnummer} = req.query;
    const dokumenterJsonPath = saksnrDokumenterMap[saksnummer];
    return dokumenterJsonPath
      ? res.status(200).sendFile(dokumenterJsonPath)
      : res.sendStatus(404);
  });
};

module.exports = mockDokumenter;