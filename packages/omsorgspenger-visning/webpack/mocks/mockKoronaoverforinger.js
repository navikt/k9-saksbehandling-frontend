const path = require('path');

const saksnrOverføringMap = {
  '200': path.join(__dirname, 'mockdata', 'koronaoverforinger_200.json'),
};

const mockKoronaoverføringer = app => {
  app.get('/api/rammemeldinger/korona-overforinger', (req, res) => {
    const { saksnummer } = req.query;
    const overføringJsonPath = saksnrOverføringMap[saksnummer];

    if (overføringJsonPath) {
      return res.status(200).sendFile(overføringJsonPath);
    }

    return res.sendStatus(404);
  });
};

module.exports = mockKoronaoverføringer;
