const core = require('@actions/core');
const { Octokit } = require('@octokit/rest');
const token = core.getInput('token');
const octokit = new Octokit({ auth: `token ${token}` });

// ************************************************
async function listComments(owner, repo, number, page = 1) {
  let { data: comments } = await octokit.issues.listComments({
    owner,
    repo,
    issue_number: number,
    per_page: 100,
    page,
  });
  if (comments.length >= 100) {
    comments = comments.concat(await listComments(owner, repo, number, page + 1));
  }
  return comments;
}

async function deleteComment(owner, repo, commentID) {
  await octokit.issues.deleteComment({
    owner,
    repo,
    comment_id: commentID,
  });
  core.info(`Actions: [delete-comment][${commentID}] success!`);
}

function checkInclude(arr, str) {
  let result = false;
  for (let i = 0; i < arr.length; i += 1) {
    if (str.includes(arr[i])) {
      result = true;
      break;
    }
  }
  return result;
}

async function createComment(owner, repo, number, commentBody, FIXCOMMENT) {
  await octokit.issues.createComment({
    owner,
    repo,
    issue_number: number,
    body: commentBody + '\n' + FIXCOMMENT,
  });
  core.info(`Actions: [create-comment][${number}] success!`);
}

// ************************************************
module.exports = {
  listComments,
  deleteComment,
  checkInclude,
  createComment,
};
