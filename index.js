const { startServer, server } = require('./app');

(async () => {
  try {
    await startServer();
    // Run Server
    const port = process.env.PORT || 3000;
    await server.listen(port);
    console.log('Listening on port http://localhost:%d', server.address().port);
  } catch (err) {
    console.log(err);
    throw new Error('Internal server error', err);
  }
})();
