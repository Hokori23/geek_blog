import precss from 'precss';
import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import moment from 'moment';
import juice from 'juice';
moment.locale('zh-cn');

import { blogConfig } from '@config';
import { MailAccepter } from '@vo';

/**
 * @description 使用precss编译scss, sass, 如果非调试状态(isTesting = false)运行中需要应用更改后的scss, sass样式，需要重新调用该函数
 */
const compilerStyleFile = (isTesting: boolean = false): Promise<any> => {
  return new Promise(async (resolve) => {
    if (cssOutputString && !isTesting) {
      // 若出现雪崩问题，可使用events.EventEmitter().once解决
      // 《深入浅出Node》Ch4.3 P77
      fs.writeFileSync(
        path.resolve(__dirname, 'template.css'),
        cssOutputString
      );
      return resolve(cssOutputString);
    }
    const importPath = path.resolve(__dirname, 'template.scss');
    return resolve(
      precss
        .process(fs.readFileSync(importPath), {
          from: importPath
          // to: exportPath
        })
        .then((result) => {
          result.warnings().forEach((warn) => {
            console.warn(warn.toString());
          });
          fs.writeFileSync(
            path.resolve(__dirname, 'template.css'),
            result.css
          );
          return result.css.replace(/[\r|\t|\n]/g, '');
        })
    );
  });
};

interface UnsubscribeConfirmAttributes {
  title: string;
  accepter: MailAccepter;
  unsubscribeUrl: string;
}

let cssOutputString; // 单例变量

const OutputTemplate = async (
  unsubscribeConfirmInfo: UnsubscribeConfirmAttributes,
  isTesting: boolean = false
): Promise<string> => {
  const { title, accepter, unsubscribeUrl } = unsubscribeConfirmInfo;
  const { name, address } = accepter;
  cssOutputString = await compilerStyleFile(isTesting);
  // 若出现雪崩问题，可使用events.EventEmitter().once解决
  // 《深入浅出Node》Ch4.3 P77
  const template = fs.readFileSync(path.resolve(__dirname, 'template.ejs'));
  return juice(
    ejs.render(template.toString(), {
      title,
      unsubscribeUrl,
      name,
      address,
      css: `<style>${cssOutputString}</style>`,
      blogConfig,
      time: moment().format('lll')
    }),
    { inlinePseudoElements: true }
  );
};
export default OutputTemplate;
