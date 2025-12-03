/* 小程序版本更新 */
export function mpUpdate() {
  // #ifdef MP
  const updateManager = uni.getUpdateManager();

  updateManager.onCheckForUpdate(function (res) {
    if (res.hasUpdate) {
      updateManager.onUpdateReady(function () {
        updateManager.applyUpdate();
      });
    }
  });
  // #endif
}

/* app版本更新 TODO */
// export function appUpdate() {
//   // #ifdef APP-PLUS
//   // 热更新: wgt
//   // 整包升级: android下载apk安装, ios跳app store
//   // #endif
// }
