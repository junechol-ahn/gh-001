import core from '@actions/core';


async function run() {
  const prTitle = core.getInput('pr-title', { required: true });
  
  if (prTitle.startsWith('feat')) {
    core
  } else {  
    core.info("PR is not a feature")
  }  
}

run();