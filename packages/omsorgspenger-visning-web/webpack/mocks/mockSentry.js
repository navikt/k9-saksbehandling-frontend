const bodyParser = require('body-parser');

const mockSentry = app => {
  app.all('/api/1/store', bodyParser.json({ type: '*/*' }), function (
    req,
    res,
  ) {
    req.body.exception.values.forEach(entry => {
      console.info(`Sentry mock error report: [${entry.type}] ${entry.value}`);
    });

    res.json({
      id: req.body.event_id,
    });
  });
};

module.exports = mockSentry;
