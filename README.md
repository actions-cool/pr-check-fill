# 👀 PR Check Fill

![](https://img.shields.io/github/workflow/status/actions-cool/pr-check-fill/CI?style=flat-square)
[![](https://img.shields.io/badge/marketplace-pr--check--fill-blueviolet?style=flat-square)](https://github.com/marketplace/actions/pr-check-fill)
[![](https://img.shields.io/github/v/release/actions-cool/pr-check-fill?style=flat-square&color=orange)](https://github.com/actions-cool/pr-check-fill/releases)

A GitHub Action help you to check the filling format of PR.

## 🚀 How to use?

```yml
name: PR check Fill

on:
  pull_request_target:
    types: [opened, edited, reopened]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - name: check fill
        uses: actions-cool/pr-check-fill@v1.0.0
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          filter-start: '|'
          require-include: 'English'
          comment-body: 'Check failed.'
          skip-title-start: 'docs'
```

| Name | Desc | Type | Required |
| -- | -- | -- | -- |
| token | GitHub token. | string | ✖ |
| filter-start | Content lines detection and filtering. | string | ✔ |
| require-include | Further filtering lines. | string | ✖ |
| comment-body | Comment reminder when not filled in. | string | ✔ |
| skip-title-start | Skip PR title start with. | string | ✖ |

## ⚡ Feedback

You are very welcome to try it out and put forward your comments. You can use the following methods:

- Report bugs or consult with [Issue](https://github.com/actions-cool/pr-check-fill/issues)
- Submit [Pull Request](https://github.com/actions-cool/pr-check-fill/pulls) to improve the code of `pr-check-fill`

也欢迎加入 钉钉交流群

![](https://github.com/actions-cool/resources/blob/main/dingding.jpeg?raw=true)

## Changelog

[CHANGELOG](./CHANGELOG.md)

## LICENSE

[MIT](./LICENSE)
