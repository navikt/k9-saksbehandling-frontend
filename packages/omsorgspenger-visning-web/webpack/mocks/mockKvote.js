const path = require('path');

const saksnrKvoteMap = {
  '200': path.join(__dirname, 'mockdata', 'kvote_200.json'),
};

const mockKvote = app => {
  app.get('/api/kvote', (req, res) => {
    const { saksnummer } = req.query;
    const kvoteJsonPath = saksnrKvoteMap[saksnummer];

    if (kvoteJsonPath) {
      return res.status(200).sendFile(kvoteJsonPath);
    }

    return res.sendStatus(404);
  });
};

module.exports = mockKvote;
