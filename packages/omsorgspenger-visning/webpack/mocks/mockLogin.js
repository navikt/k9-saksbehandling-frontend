let lastFakeLogin;

const mockLogin = app => {
  app.get('/me', (req, res) => {
    const femMinSiden = new Date();
    femMinSiden.setMinutes(femMinSiden.getMinutes() - 5);

    if (!lastFakeLogin || lastFakeLogin < femMinSiden) {
      lastFakeLogin = new Date();
      return res.sendStatus(401);
    }

    return res.status(200).json({ name: 'Test Brukersen' });
  });

  app.get('/login', (req, res) => {
    const redirectUrl = req.query.redirect_uri;
    console.log('redirectUrl', redirectUrl);

    res.redirect(redirectUrl);
  });
};

module.exports = mockLogin;
