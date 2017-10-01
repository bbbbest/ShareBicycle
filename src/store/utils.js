/* eslint-disable no-unused-vars */
export default {
  num: 1,
  contains (array, item) {
    if (Array.isArray(array)) {
      let i;
      for (i in array) {
        if (array.hasOwnProperty(i) && item === array[i]) {
          return true;
        }
      }
      return false;
    } else throw Error('First parameter must be Array');
  },
  /**
   * 简单数组的删除
   * @param array
   * @param value
   */
  simpleDeleteIfContains (array, value) {
    if (Array.isArray(array)) {
      let i;
      for (i in array) {
        if (array.hasOwnProperty(i) && value === array[i]) {
          array.splice(i, 1);
        }
      }
    } else throw Error('First parameter must be Array');
  },
  /**
   * 对象数组的删除
   * @param array
   * @param value
   * @param test callback function, must has two parameters
   */
  deleteIfContains (array, value, test) {
    if (Array.isArray(array)) {
      let i;
      for (i in array) {
        if (array.hasOwnProperty(i) && test(array[i], value)) {
          array.splice(i, 1);
        }
      }
    } else throw Error('First parameter must be Array');
  },
  deepCopy: function (obj) {
    let keys = Object.keys(obj);
    let o = null;
    let i;
    if (Array.isArray(obj)) {
      o = [];
      for (i in obj) {
        if (typeof obj[i] === 'object' && obj.hasOwnProperty(i)) {
          o[i] = {...this.deepCopy(obj[i])};
        } else {
          o[i] = obj[i];
        }
      }
    } else if (typeof obj === 'object') {
      o = {};
      for (i in keys) {
        if (Array.isArray(obj[keys[i]])) {
          o[keys[i]] = [...this.deepCopy(obj[keys[i]])];
        } else if (typeof obj[keys[i]] === 'object') {
          o[keys[i]] = {...this.deepCopy(obj[keys[i]])};
        } else {
          o[keys[i]] = obj[keys[i]];
        }
      }
    }
    return o;
  },
  isTimeToUpdate (lastTime) {
    let now = new Date();
    return (now - lastTime) / 1000 * 3600 > 5;
  },
  parseResponseData (response) {
    return JSON.parse(response.data);
  },
  greet (name) {
    console.log(`
                     .::::.
                   .::::::::.
                  :::::::::::  Hello! ${name}
              ..:::::::::::'
            '::::::::::::'
              .::::::::::
         '::::::::::::::..
              ..::::::::::::.
            \`\`::::::::::::::::
             ::::\`\`:::::::::'        .:::.
            ::::'   ':::::'       .::::::::.
          .::::'      ::::     .:::::::'::::.
         .:::'       :::::  .:::::::::' ':::::.
        .::'        :::::.:::::::::'      ':::::.
       .::'         ::::::::::::::'         \`\`::::.
   ...:::           ::::::::::::'              \`\`::.
  \`\`\`\` ':.          ':::::::::'                  ::::..
                     '.:::::'                    ':'\`\`\`\`..`);
  }
};
