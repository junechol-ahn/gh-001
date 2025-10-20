import { getBooleanInput, getInput, info } from '@actions/core';

async function run() {
  const baseBranch = getInput('base-branch');
  const targetBranch = getInput('target-branch');
  const workingDirectory = getInput('working-directory');
  const githubToken = getInput('gh-token');
  const isDebug = getBooleanInput('debug');


  info(`${baseBranch}, ${targetBranch}, ${workingDirectory}, ${githubToken}, ${isDebug}`);
}

run();