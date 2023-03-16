/*

***REQUIREMENTS***

- AWS CLI is configured
- User has AWS account
- User has bootstrapped AWS account in AWS CLI
- User has created a non-containerized web app using Node JS and express

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

  1b. Create new directory "cdk-eb-infra" in root directory of app

  1c. Move to directory "cdk-eb-infra"

  1d. Initialize CDK application using "cdk init app --language javascript"

  1e. In /lib/cdk-eb-infra-stack.js, replace existing code and paste code from ./cdk-eb-infra-stack.js and substitute %APP_NAME% for APP_NAME requested in 1a.

  1f. Run the following while in directory "cdk-eb-infra"
    i.    npm i @aws-cdk/aws-s3-assets
    ii.   npm i @aws-cdk/aws-elasticbeanstalk
    iii.  npm i @aws-cdk/aws-iam


2. Zip the Node.js app as "app.zip" into "cdk-eb-infra" folder.

3. Bootstrap account using AWS_ACCOUNT_NUMBER and AWS_REGION in the command "cdk bootstrap aws://AWS_ACCOUNT_NUMBER/AWS_REGION"

4. Run "cdk deploy"
*/

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let appName, appPath, cdkVersion, accountNumber, region;

const askQuestion = (question) =>
  new Promise((resolve) => rl.question(question, resolve));

const gatherInfoForElasticBeanstalkDeployment = async () => {
  appName = await askQuestion(
    "What is the name of your app? App name must be minimum length 1, maximum length 100."
  );

  appPath = await askQuestion("Provide the folder path for your app. ");

  cdkVersion = await askQuestion("Choose your CDK version.");

  accountNumber = await askQuestion("Enter your AWS account number.");

  region = await askQuestion("Enter the AWS region you wish to use.");
};
