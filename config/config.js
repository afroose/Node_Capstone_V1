// exports.DATABASE_URL =  process.env.DATABASE_URL || 'mongodb://localhost/menu-select-app';
exports.DATABASE_URL =  process.env.DATABASE_URL || 'mongodb://MasterChef:4Tune8!!@ds111622.mlab.com:11622/menu-select-app';
exports.TEST_DATABASE_URL = (
	process.env.TEST_DATABASE_URL ||
	'mongodb://localhost/menu-select-test-app');
exports.PORT = process.env.PORT || 8080;
