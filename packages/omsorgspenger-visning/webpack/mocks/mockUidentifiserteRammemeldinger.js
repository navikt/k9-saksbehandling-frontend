const path = require('path');

const saksnrUidentifiserteRammemeldingerMap = {
  '200': path.join(__dirname, 'mockdata', 'uidentifiserteRammemeldinger_200.json')
};

const mockUidentifiserteRammemeldinger = app => {
  app.get('/api/uidentifiserteRammemeldinger', (req, res) => {
    const {saksnummer} = req.query;
    const uidentifiserteRammemeldinger = saksnrUidentifiserteRammemeldingerMap[saksnummer];
    return uidentifiserteRammemeldinger
      ? res.status(200).sendFile(uidentifiserteRammemeldinger)
      : res.sendStatus(404);
  });
};

module.exports = mockUidentifiserteRammemeldinger;