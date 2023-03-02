const path = require('path');

const saksnrFordelingMap = {
  '200': path.join(__dirname, 'mockdata', 'fordelinger_200.json')
};

const mockFordelinger = app => {
  app.get('/api/fordelinger', (req, res) => {
    const {saksnummer} = req.query;
    const fordelingJsonPath = saksnrFordelingMap[saksnummer];
    return fordelingJsonPath
      ? res.status(200).sendFile(fordelingJsonPath)
      : res.sendStatus(404);
  });
};

module.exports = mockFordelinger;