module.exports = app => {
  app.post(
    '/title',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );
};
