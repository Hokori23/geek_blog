module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'Feat', //新功能（feature）
        'Fix', //修补bug
        'Docs', //文档（documentation）
        'Style', // 格式（不影响代码运行的变动）
        'Refactor', //重构（即不是新增功能，也不是修改bug的代码变动）
        'Test', //增加测试
        'Chore', //构建过程或辅助工具的变动
        'Revert' //回滚
      ]
    ],
    'type-case': [0],
    'subject-case': [0],
    'subject-max-length': [2, 'always', 255]
  }
};
