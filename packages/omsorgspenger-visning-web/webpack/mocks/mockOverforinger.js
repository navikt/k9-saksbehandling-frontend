const path = require('path');

const saksnrOverføringMap = {
  '200': path.join(__dirname, 'mockdata', 'overforinger_200.json'),
};

const mockOverføringer = app => {
  app.get('/api/rammemeldinger/overforinger', (req, res) => {
    const { saksnummer } = req.query;
    const overføringJsonPath = saksnrOverføringMap[saksnummer];

    if (overføringJsonPath) {
      return res.status(200).sendFile(overføringJsonPath);
    }

    return res.sendStatus(404);
  });
};

module.exports = mockOverføringer;
