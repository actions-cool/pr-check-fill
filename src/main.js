const core = require('@actions/core');
const github = require('@actions/github');

// ************************************************
const context = github.context;

const { listComments, deleteComment, checkInclude, createComment } = require('./util');

const { dealStringToArr } = require('actions-util');

// ************************************************
async function run() {
  try {
    const owner = context.repo.owner;
    const repo = context.repo.repo;
    const FIXCOMMENT = `<!-- Created by actions-cool/pr-check-fill. Do not remove. -->`;

    if (context.eventName.includes('pull_request')) {
      const number = context.payload.pull_request.number;
      const creater = context.payload.pull_request.user.login;

      const title = context.payload.pull_request.title;
      const body = context.payload.pull_request.body;

      const comments = await listComments(owner, repo, number);
      const filterComments = [];
      comments.forEach(comment => {
        if (comment.body.includes(FIXCOMMENT)) {
          filterComments.push(comment.id);
        }
      });

      if (filterComments.length > 1) {
        core.info(`Error: filterComments length is ${filterComments.length}.`);
        return false;
      }

      const skipTitleStart = core.getInput('skip-title-start');
      if (skipTitleStart && title.startsWith(skipTitleStart)) {
        if (filterComments.length == 1) {
          await deleteComment(owner, repo, filterComments[0]);
        }
        return false;
      }

      const filterStart = core.getInput('filter-start');
      const requireInclude = core.getInput('require-include');

      let lines = body.split('\n');
      let out = true;
      lines.forEach(line => {
        const a = line.startsWith(filterStart);
        const b = requireInclude ? checkInclude(dealStringToArr(requireInclude), line) : true;
        if (a && b) {
          let temp = line;
          temp = line.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\|]/g, '');
          if (requireInclude) {
            dealStringToArr(requireInclude).forEach(re => {
              temp = temp.replace(re, '');
            });
          }
          temp = temp.trim();
          if (temp.length == 0) {
            out = false;
            core.info(`[Check line false][${line}]`);
          }
        }
      });

      const commentBody = core.getInput('comment-body');
      if (!out) {
        if (filterComments.length == 0) {
          await createComment(owner, repo, numner, commentBody, FIXCOMMENT);
          core.setFailed(`PR check fill failed. See comment!`);
          return false;
        }
      } else if (filterComments.length == 1) {
        await deleteComment(owner, repo, filterComments[0]);
        return false;
      }
    } else {
      core.setFailed(`This Action only support pr!`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
