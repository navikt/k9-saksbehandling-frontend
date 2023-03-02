const path = require('path');

const saksnrBarnMap = {
  '200': path.join(__dirname, 'mockdata', 'barn_200.json')
};

const mockBarn = app => {
  app.get('/api/barn', (req, res) => {
    const {saksnummer} = req.query;
    const barnJsonPath = saksnrBarnMap[saksnummer];
    return barnJsonPath
      ? res.status(200).sendFile(barnJsonPath)
      : res.sendStatus(404);
  });
};

module.exports = mockBarn;