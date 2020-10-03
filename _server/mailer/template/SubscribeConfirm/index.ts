import precss from 'precss';
import fs from 'fs';
import path from 'path';
import ejs from 'ejs';

import { MailAccepter } from '@vo';

/**
 * @description 使用precss编译scss, sass, 如果运行中需要应用更改后的scss, sass样式，需要重新调用该函数
 */
const compilerStyleFile = (isTesting: boolean = false): Promise<any> => {
  return new Promise(async (resolve) => {
    if (cssOutputString && !isTesting) {
      // 若出现雪崩问题，可使用events.EventEmitter().once解决
      // 《深入浅出Node》Ch4.3 P77
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
          return result.css.replace(/[\r|\t|\n]/g, '');
          // fs.writeFileSync(exportPath, cssOutputString);
        })
    );
  });
};

interface SubscribeConfirmAttributes {
  title: string;
  accepter: MailAccepter;
  subscribeUrl: string;
}

let cssOutputString; // 单例变量

const OutputTemplate = async (
  subscribeConfirmInfo: SubscribeConfirmAttributes,
  isTesting: boolean = false
): Promise<string> => {
  const { title, accepter, subscribeUrl } = subscribeConfirmInfo;
  const { name, address } = accepter;
  cssOutputString = await compilerStyleFile(isTesting);
  // 若出现雪崩问题，可使用events.EventEmitter().once解决
  // 《深入浅出Node》Ch4.3 P77
  const template = fs.readFileSync(path.resolve(__dirname, 'template.ejs'));
  return ejs.render(template.toString(), {
    title,
    subscribeUrl,
    name,
    address,
    css: `<style>${cssOutputString}</style>`
  });
};
export default OutputTemplate;
