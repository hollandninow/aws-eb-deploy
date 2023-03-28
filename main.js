/*

***REQUIREMENTS***

- AWS CLI is configured
- User has AWS account
- User has bootstrapped AWS account in AWS CLI
- User has created a non-containerized web app using Node JS and express


***TEST PROCESS***
1. Duplicate test-app folder in a new folder outside this app

2. Run aws-eb-deploy

***PROCESS***

0. Set up. Request the following:

  0a. APP_NAME

  0b. App's root folder path

  0c. CDK version to use (provide options)

  0d. AWS_ACCOUNT_NUMBER

  0e. AWS_REGION

1. Create the CDK app

  1a. Run the following:
    i.    npm install -g cdk@1.180.0
    ii.   npm i —save-exact @aws-cdk/aws-s3-assets@1.180.0
    iii.  npm i —save-exact @aws-cdk/aws-elasticbeanstalk@1.180.0
    iv.   npm i —save-exact @aws-cdk/aws-iam@1.180.0

  1b. Create new directory 'cdk-eb-infra' in root directory of app

  1c. Move to directory 'cdk-eb-infra'

  1d. Initialize CDK application using 'cdk init app --language javascript'

  1e. In /lib/cdk-eb-infra-stack.js, replace existing code and paste code from ./cdk-eb-infra-stack.js and substitute %APP_NAME% for APP_NAME requested in 1a.

  1f. Run the following while in directory 'cdk-eb-infra'
    i.    npm i @aws-cdk/aws-s3-assets
    ii.   npm i @aws-cdk/aws-elasticbeanstalk
    iii.  npm i @aws-cdk/aws-iam


2. Zip the Node.js app as 'app.zip' into 'cdk-eb-infra' folder.

3. Bootstrap account using AWS_ACCOUNT_NUMBER and AWS_REGION in the command 'cdk bootstrap aws://AWS_ACCOUNT_NUMBER/AWS_REGION'

4. Run 'cdk deploy'
*/

const utils = require('./utils');

const readline = require('readline');
const { exec, execSync } = require('child_process');
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

  // const files = execSync('powershell ls').toString();
  // console.log(files);
};

main();

// console.log('mkdir test');
// exec('powershell mkdir test', (error, stdout, stderr) => {
//   if (error) {
//     console.error(`exec error: ${error}`);
//     return;
//   }
//   console.log(`stdout: ${stdout}`);
//   console.error(`stderr: ${stderr}`);
// });

// exec('powershell cd node_modules', (error, stdout, stderr) => {
//   if (error) {
//     console.error(`exec error: ${error}`);
//     return;
//   }
//   console.log(`stdout: ${stdout}`);
//   console.error(`stderr: ${stderr}`);
// });

// exec('powershell Get-ChildItem', (error, stdout, stderr) => {
//   if (error) {
//     console.error(`exec error: ${error}`);
//     return;
//   }
//   console.log(`stdout: ${stdout}`);
//   console.error(`stderr: ${stderr}`);
// });

// try {
//   execSync('powershell mkdir test');

//   execSync('powershell cd test');

//   const childItem = execSync('powershell Get-ChildItem');
//   console.log(childItem.toString());

//   execSync('powershell Remove-Item './test'');
// } catch (err) {
//   console.log(`exec error: ${err}`);
// }
