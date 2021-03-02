import axios from "axios";
/*
 * runScript：一个promise同步方法。可以代替创建一个script标签，然后加载服务
 * */
const runScript = (url) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.onload = function () {
      console.log("succ:", url);
      resolve();
    };
    script.onerror = reject;
    const firstScript = document.getElementsByTagName("script")[0];
    firstScript.parentNode.insertBefore(script, firstScript);
  });
};

/*
 * getManifest：远程加载manifest.json 文件，解析需要加载的js
 * */
const getManifest = (url, bundle) =>
  new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(({ data }) => {
        const { entrypoints, publicPath } = data;
        const assets = entrypoints[bundle].assets.filter((a) => {
          return !/^.+\.hot-update.js$/.test(a);
        });
        console.log("load", 1);

        function next(index) {
          if (index >= assets.length) {
            resolve();
            return;
          }
          let asset = assets[index];
          console.log(publicPath + asset);
          runScript(publicPath + asset)
            .then(() => {
              console.log("curIndex", index);
              next(++index);
            })
            .catch(reject);
        }
        next(0);
      }, reject)
      .catch(reject);
  });

export { getManifest, runScript };
