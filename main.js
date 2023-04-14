const utils = require('./utils');
const powershellHelper = require('./powershellHelper');
const { deploy } = require('./deploy');

const elasticBeanstalkFolder =
  '/Users/holla/OneDrive/Desktop/Webdev/aws-eb-projects';

options1 = {
  appName: 'test-app',
  appSourcePath: './test-app',
  appDestinationPath: `${elasticBeanstalkFolder}/test-app`,
  accountNumber: process.env.AWS_ACCOUNT_NUMBER,
  region: 'us-east-1',
  excludeDirsArray: ['node_modules', '.cache'],
};

options2 = {
  appName: 'Natours',
  appSourcePath:
    '/Users/holla/OneDrive/Desktop/complete-node-bootcamp-master/4-natours/starter',
  appDestinationPath: `${elasticBeanstalkFolder}/natours`,
  accountNumber: process.env.AWS_ACCOUNT_NUMBER,
  region: 'us-east-1',
  excludeDirsArray: ['node_modules', '.cache'],
};

const main = async () => {
  let options;

  if (process.argv[2] === '--test') {
    options = options1;
  } else {
    options = options2;
  }

  await deploy(options);
};

main();
