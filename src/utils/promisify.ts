/**
 * 
 * @param taroApi 
 * @returns 
 */
export const promisify = taroApi => (options, ...args) =>
  new Promise((res, rej) =>
    taroApi(
      {
        ...options,
        success: res,
        fail: err => {
          console.log(err);
          rej(err);
        },
      },
      ...args
    )
  );
