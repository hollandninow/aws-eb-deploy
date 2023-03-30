const utils = require('./utils');
const powershellHelper = require('./powershellHelper');

const readline = require('readline');
const { exec } = require('child_process');
const fse = require('fs-extra');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const elasticBeanstalkFolder =
  '/Users/holla/OneDrive/Desktop/Webdev/aws-eb-projects';

const main = async () => {
  let appName, appSourcePath, accountNumber, region;

  if (process.argv[2] === '--test') {
    appName = 'test-app';
    appSourcePath = './test-app';
    accountNumber = process.env.AWS_ACCOUNT_NUMBER;
    region = 'us-east-1';
  } else {
    ({ appName, appSourcePath, accountNumber, region } =
      await utils.getDeploymentParametersFromUser(rl));
  }

  const appDestinationPath = `${elasticBeanstalkFolder}/${appName}`;
  fse.copySync(appSourcePath, appDestinationPath);

  // 1a. Run the following:
  //  i.    npm install -g cdk@1.180.0
  //  ii.   npm i —save-exact @aws-cdk/aws-s3-assets@1.180.0
  //  iii.  npm i —save-exact @aws-cdk/aws-elasticbeanstalk@1.180.0
  //  iv.   npm i —save-exact @aws-cdk/aws-iam@1.180.0
  await powershellHelper.runMultiplePowershellCmd(appDestinationPath, [
    'npm install -g cdk@1.180.0',
    'npm i --save-exact @aws-cdk/aws-s3-assets@1.180.0',
    'npm i --save-exact @aws-cdk/aws-elasticbeanstalk@1.180.0',
    'npm i --save-exact @aws-cdk/aws-iam@1.180.0',
  ]);

  // to do: 1b. and beyond
};

main();
