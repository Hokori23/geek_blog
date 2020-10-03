import fs from 'fs';
import path from 'path';

import { MailAccepter } from '@vo';
import { debounce } from '@public';
import OutputTemplate from './index';

/**
 * @description 用于sass、scss热重载，输出文件为.html用于VSCode插件 -- Live Server预览
 */
const isTesting: boolean = true; //Editable
let isWatching: boolean = false;
/**
 * 测试函数
 * @param { string } outputFilePath
 * @param { Array<string>} watchFiles
 * @param { Function } callback
 */
const Test = async (
  outputFilePath: string,
  watchFiles: Array<string> = [],
  callback?: Function
) => {
  const outputString = await OutputTemplate(
    {
      title: '标题',
      accepter: <MailAccepter>{
        name: 'testName',
        address: 'example@example.com'
      },
      subscribeUrl: 'https://example.com'
    },
    true
  );

  fs.writeFileSync(outputFilePath, outputString);
  console.log('Compiled Successfully');
  if (!isWatching) {
    watchFiles.forEach((file) => {
      const cb = debounce((filename) => {
        console.log(`${filename} just changed`);
        Test(outputFilePath, watchFiles);
      }, 200);
      fs.watch(file, (eventType, filename) => {
        cb(filename);
      });
    });
    isWatching = true;
  }
};

/**
 * Test Here
 */
if (isTesting) {
  console.log('Start testing template');
  const outputFileName = 'test.html';
  const outputFilePath = path.resolve(__dirname, outputFileName);
  const watchFiles = [
    path.resolve(__dirname, 'template.ejs'),
    path.resolve(__dirname, 'template.scss')
  ];
  Test(outputFilePath, watchFiles);
}
