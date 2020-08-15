namespace _PUBLIC {
  /**
   * 判断变量是否已定义
   * @param { object } v
   */
  export const isDef = (v: any): boolean => {
    return v !== undefined && v !== null;
  };

  /**
   * 判断变量是否未定义
   * @param { object } v
   */
  export const isUndef = (v: any): boolean => {
    return v === undefined || v === null;
  };

  /**
   * @param { array } objArrg
   * @param { boolean } flag
   * @description 当flag == true时，后面源对象可枚举属性isUndef时，不会覆盖前方对象属性
   */
  export const assign = (objArr: Array<Object>, flag?: boolean): any => {
    if (isUndef(objArr)) {
      return new ReferenceError('Excepted for arguments: [objArr, flag]');
    }
    // 检查传参类型
    if (!(objArr instanceof Array)) {
      throw new TypeError('Excepted for Array at 1st argument');
    }

    if (!flag) {
      return Object.assign({}, ...objArr);
    }

    // 检查传参类型
    for (let i = objArr.length - 1; i > 0; i--) {
      if (
        typeof objArr[i] !== 'object' ||
        objArr[i].toString() !== '[object Object]'
      ) {
        throw new TypeError('Excepted for Object arguments in 1st Array');
      }
      Object.keys(objArr[i]).forEach((v: string): void => {
        if (isDef(objArr[i][v])) {
          objArr[i - 1][v] = objArr[i][v];
        }
      });
    }
    return objArr[0];
  };
}