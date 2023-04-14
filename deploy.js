const utils = require('./utils');
const powershellHelper = require('./powershellHelper');

const fse = require('fs-extra');
const replace = require('replace-in-file');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

exports.deploy = async (options) => {
  const {
    appName,
    appSourcePath,
    appDestinationPath,
    accountNumber,
    region,
    excludeDirsArray,
  } = options;

  const templateCdkInfraStackTemplateCodePath =
    './cdk-eb-infra-stack/cdk-eb-infra-stack.js';

  await utils.copyAppFolder(
    appSourcePath,
    appDestinationPath,
    excludeDirsArray
  );

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

  // 1b. Create new directory 'cdk-eb-infra' in root directory of app
  await powershellHelper.runPowershellCmd(
    appDestinationPath,
    'New-Item -Path . -Name "cdk-eb-infra" -ItemType "directory"'
  );

  // 1c. Move to directory 'cdk-eb-infra' (as parameter in runPowershellCmd())
  const cdkPath = `${appDestinationPath}/cdk-eb-infra`;

  // 1d. Initialize CDK application using 'cdk init app --language javascript'
  await powershellHelper.runPowershellCmd(
    cdkPath,
    'cdk init app --language javascript'
  );

  // Acknowledge notice 19836 to not clutter up every command going forward
  await powershellHelper.runPowershellCmd(cdkPath, 'cdk acknowledge 19836');

  // 1e.i. Copy cdk-eb-infra-stack.js in ./cdk-eb-infra-stack and replace the same named file in the target app under /test-app/cdk-eb-infra/lib
  fse.copyFileSync(
    templateCdkInfraStackTemplateCodePath,
    `${cdkPath}/lib/cdk-eb-infra-stack.js`
  );

  // 1e.ii. Substitute %APP_NAME% for APP_NAME requested in 1a.
  try {
    const results = await replace({
      files: `${cdkPath}/lib/cdk-eb-infra-stack.js`,
      from: '%APP_NAME%',
      to: appName,
    });
    console.log(`Replacement results: ${results}`);
  } catch (err) {
    console.log(`Replacement error: ${err}`);
  }

  // 1f. Run the following while in directory 'cdk-eb-infra'
  //  i. npm i @aws-cdk/aws-s3-assets
  //  ii. npm i @aws-cdk/aws-elasticbeanstalk
  //  iii. npm i @aws-cdk/aws-iam
  await powershellHelper.runMultiplePowershellCmd(cdkPath, [
    'npm i @aws-cdk/aws-s3-assets',
    'npm i @aws-cdk/aws-elasticbeanstalk',
    'npm i @aws-cdk/aws-iam',
  ]);

  // 2. Zip the Node.js app as 'app.zip' into 'cdk-eb-infra' folder.
  await utils.zipDirectory(appDestinationPath, `${cdkPath}/app.zip`);

  // 3. Bootstrap account using AWS_ACCOUNT_NUMBER and AWS_REGION in the command 'cdk bootstrap aws://AWS_ACCOUNT_NUMBER/AWS_REGION'
  await powershellHelper.runPowershellCmd(
    cdkPath,
    `cdk bootstrap aws://${accountNumber}/${region}`
  );

  // 4. Run 'cdk deploy'
  await powershellHelper.runPowershellCmd(
    cdkPath,
    'cdk deploy --require-approval never'
  );
};
