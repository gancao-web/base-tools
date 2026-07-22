# Base Tools Web Catalog

- 包名: `@base-web-kits/base-tools-web`
- 安装: `pnpm add @base-web-kits/base-tools-web`
- 入口: `src/web/index.ts`

## Modules

### clipboard
- 来源: `src/web/clipboard/index.ts`
- 导出: `copyBlob`、`copyHtml`、`copyImage`、`copyNode`、`copyRtf`、`copyTable`、`copyText`、`copyUrl`

### config
- 来源: `src/web/config/index.ts`
- 导出: `AppConfig`、`AppLogInfo`、`getBaseToolsConfig`、`setBaseToolsConfig`

### cookie
- 来源: `src/web/cookie/index.ts`
- 导出: `getCookie`、`removeCookie`、`setCookie`

### device
- 来源: `src/web/device/index.ts`
- 导出: `getBrowserName`、`getBrowserVersion`、`getDevicePixelRatio`、`getOS`、`getUA`、`isAndroid`、`isChrome`、`isIOS`、`isMobile`、`isPC`、`isTablet`、`isTouchSupported`、`isWeChat`

### dom
- 来源: `src/web/dom/index.ts`
- 导出: `getWindowHeight`、`getWindowScrollLeft`、`getWindowScrollTop`、`getWindowWidth`、`isInViewport`、`lockBodyScroll`、`unlockBodyScroll`、`windowScrollTo`

### network

#### download
- 来源: `src/web/network/download.ts`
- 导出: `download`、`getDispositionFileName`、`hasCss`、`hasJs`、`loadCss`、`loadJs`、`preloadImage`

#### request
- 来源: `src/web/network/request.ts`
- 导出: `filterRequestData`、`filterRequestHeader`、`request`、`RequestConfig`、`RequestConfigBase`、`RequestData`、`RequestMethod`、`RequestTask`、`ResponseData`、`TransformRequestContext`、`TransformRequestResult`

#### uploadFile
- 来源: `src/web/network/uploadFile.ts`
- 导出: `OnUploadProgressUpdate`、`UploadConfig`、`UploadData`、`UploadFail`、`uploadFile`、`UploadFileOption`、`UploadProgressEvent`、`UploadTask`

### storage
- 来源: `src/web/storage/index.ts`
- 导出: `getLocalStorage`、`removeLocalStorage`、`setLocalStorage`

### url
- 来源: `src/web/url/index.ts`
- 导出: `getUrlNumber`、`getUrlParam`、`getUrlParams`
