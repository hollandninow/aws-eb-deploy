const fse = require('fs');
const glob = require('glob');
const archiver = require('archiver');

// Accepts a question (string) and rl (readline)
const askQuestion = (question, rl) =>
  new Promise((resolve) => rl.question(question, resolve));

exports.getDeploymentParametersFromUser = async (rl) => {
  const deployParams = {};

  deployParams.appName = await askQuestion(
    'What is the name of your app? App name must be minimum length 1, maximum length 100. ',
    rl
  );

  deployParams.appSourcePath = await askQuestion(
    'Provide the source folder path for your app. ',
    rl
  );

  deployParams.accountNumber = await askQuestion(
    'Enter your AWS account number. ',
    rl
  );

  deployParams.region = await askQuestion(
    'Enter the AWS region you wish to use. ',
    rl
  );

  // console.log("Here is what you have entered: ");
  // console.log(deployParams);

  rl.close();

  return deployParams;
};

// Zips the app, but excludes /node_modules and /cdk-eb-infra
exports.zipDirectory = async (source, destination) => {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const output = fse.createWriteStream(destination);

  archive.on('error', (err) => {
    throw err;
  });

  output.on('close', () => {
    console.log(archive.pointer() + ' total bytes');
    console.log(
      'Archiver has been finalized and the output file descriptor has closed.'
    );
  });

  archive.pipe(output);

  archive.glob('**/*', {
    cwd: source,
    dot: true,
    ignore: ['cdk-eb-infra/**', 'node_modules/**'],
    matchBase: true,
  });

  await archive.finalize();
};

exports.copyAppFolder = async (source, destination, excludeDirsArray) => {
  let excludeDirsStr = '{';
  excludeDirsArray.forEach((dir, i) => {
    excludeDirsStr =
      i === 0 ? `${excludeDirsStr}${dir}` : `${excludeDirsStr},${dir}`;
  });

  excludeDirsStr = excludeDirsStr + '}';

  console.log(excludeDirsStr);

  let files;
  try {
    files = await glob('**/*', {
      cwd: source,
      ignore: ['node_modules/**', '.cache/**'],
    });
  } catch (err) {
    throw err;
  }

  console.log(files);

  fse.mkdirSync(destination);

  files.forEach((file) => {
    // console.log(file);
    const sourceFile = `${source}/${file}`;
    const destFile = `${destination}/${file}`;

    if (!file.includes('.')) {
      fse.mkdirSync(destFile);
    } else {
      fse.copyFileSync(sourceFile, destFile);
    }
  });
};
