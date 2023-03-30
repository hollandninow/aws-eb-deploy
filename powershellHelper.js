const util = require('node:util');
const execAsync = util.promisify(require('node:child_process').exec);

exports.runPowershellCmd = async (cwd, cmdStr) => {
  const { stdout, stderr } = await execAsync(cmdStr, {
    cwd: cwd,
    shell: 'powershell.exe',
  });

  console.log(stdout);
  console.log(stderr);

  return;
};

exports.runMultiplePowershellCmd = async (cwd, cmdStrArr) => {
  for (const cmd of cmdStrArr) {
    console.log(`Running ${cmd}`);
    await this.runPowershellCmd(cwd, cmd);
  }
};
