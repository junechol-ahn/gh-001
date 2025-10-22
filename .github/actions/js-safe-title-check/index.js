import core from '@actions/core';
import exec from '@actions/exec';
import github from '@actions/github';



async function run() {
  const prTitle = core.getInput('pr-title', { required: true });
  
  if (prTitle.startsWith('feat')) {
    core
  } else {  
    core.info("PR is not a feature")
  }  
}

run();