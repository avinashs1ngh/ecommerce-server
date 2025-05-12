const app = require('./app');
const config = require('./config/config');

const PORT = config.port || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});