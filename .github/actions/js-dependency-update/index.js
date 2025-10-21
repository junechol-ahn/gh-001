import core from '@actions/core';
import exec from '@actions/exec';
import github from '@actions/github';

const validateBranchName = ({ branchName }) =>
  /^[a-zA-Z0-9_\-\.\/]+$/.test(branchName);
const validateDirectoryName = ({ dirName }) =>
  /^[a-zA-Z0-9_\-\.\/]+$/.test(dirName);

async function run() {
  const baseBranch = core.getInput('base-branch', { required: true });
  const targetBranch = core.getInput('target-branch', { required: true });
  const workingDirectory = core.getInput('working-directory', { required: true });
  const githubToken = core.getInput('gh-token', { required: true });
  const debug = core.getBooleanInput('debug');

  const commonExecOpts = {
    cwd: workingDirectory,
  }

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

  await exec.exec('npm update', [], { ...commonExecOpts });

  const gitStatus = await exec.getExecOutput('git status -s package*.json', [], { ...commonExecOpts });

  if (gitStatus.stdout === '') {
    core.info('[js-dependency-update] : No dependency updates found.');
    core.setOutput('updates-available', 'false');
    return;
  }

  await exec.exec(`git config --global user.name "github-actions[bot]"`);
  await exec.exec(`git config --global user.email "github-actions[bot]@users.noreply.github.com"`);
  await exec.exec(`git checkout -b ${targetBranch}`, [], { ...commonExecOpts });
  await exec.exec(`git add package*.json`, [], { ...commonExecOpts });
  await exec.exec(`git commit -m "chore: update dependencies"`, [], { ...commonExecOpts });
  await exec.exec(
    `git push -u origin ${targetBranch} --force`, [], { ...commonExecOpts }
  );

  const oktokit = github.getOctokit(githubToken);
  try {
    await oktokit.rest.pulls.create({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      title: `Dependency Update`,
      body: `Automated dependency update by js-dependency-update action.`,
      head: targetBranch,
      base: baseBranch,
    })
  } catch (e) {
    core.warning('[js-dependency-update] : Failed to create pull request. Check logs for details.');
    core.warning(e.message);
  }


  core.info(`git status:\n${gitStatus.stdout}`);
  core.setOutput('updates-available', 'true');
}

run();