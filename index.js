const { startServer, server } = require('./app');

(async () => {
  try {
    await startServer();
    // Run Server
    await server.listen("4000");
    console.log('Listening on port http://localhost:%d', server.address().port);
  } catch (err) {
    console.log(err);
    throw new Error('Internal server error', err);
  }
})();
