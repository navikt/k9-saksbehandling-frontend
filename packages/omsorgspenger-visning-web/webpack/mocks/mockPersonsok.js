const bodyParser = require('body-parser');

const personErrorMap = {
  '40040040040': 400,
  '40140140140': 401,
  '40340340340': 403,
  '40440440440': 404,
  '50050050050': 500,
};

const mockPersonsøk = app => {
  app.post(
    '/api/sak/saksnummer',
    bodyParser.json({ type: '*/*' }),
    (req, res) => {
      const { identitetsnummer } = req.body;

      const errCode = personErrorMap[identitetsnummer];
      if (errCode) {
        res.sendStatus(errCode);
      } else {
        res.status(200).json({ saksnummer: '200' });
      }
    },
  );
};

module.exports = mockPersonsøk;
