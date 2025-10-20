import core from '@actions/core';
import exec from '@actions/exec';

const validateBranchName = ({ branchName }) =>
  /^[a-zA-Z0-9_\-\.\/]+$/.test(branchName);
const validateDirectoryName = ({ dirName }) =>
  /^[a-zA-Z0-9_\-\/]+$/.test(dirName);

async function run() {
  const baseBranch = core.getInput('base-branch');
  const targetBranch = core.getInput('target-branch');
  const workingDirectory = core.getInput('working-directory');
  const githubToken = core.getInput('gh-token');
  const debug = core.getBooleanInput('debug');

  core.setSecret(githubToken);

  if (!validateBranchName({ branchName: baseBranch })) {
    core.setFailed(`Invalid base-branch name: ${baseBranch}`);
    return;
  }

  if (!validateBranchName({ branchName: targetBranch })) {
    core.setFailed(`Invalid target-branch name: ${targetBranch}`);
    return;
  }

  if (!validateDirectoryName({ dirName: workingDirectory })) {
    core.setFailed(`Invalid working-directory name: ${workingDirectory}`);
    return;
  }

  core.info(`[js-dependency-update] : base-branch: ${baseBranch}`);
  core.info(`[js-dependency-update] : target-branch: ${targetBranch}`);
  core.info(
    `[js-dependency-update] : working-directory: ${workingDirectory}`
  );
  core.info(`[js-dependency-update] : debug: ${debug}`);

  await exec.exec('npm update', [], { cwd: workingDirectory });

  const gitStatus = await exec.getExecOutput('git status -s package*.json', [], { cwd: workingDirectory });

  if (gitStatus.stdout === '') {
    core.info('[js-dependency-update] : No dependency updates found.');
    return;
  }


  core.info(`git status:\n${gitStatus.stdout}`);
}

run();