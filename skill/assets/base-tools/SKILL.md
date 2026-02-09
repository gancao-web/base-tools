---
name: 'base-tools'
description: 'Expert on internal @base-web-kits/base-tools libraries. Invoke when user needs web/ts/uni/react/vue utilities or wants to avoid code duplication.'
---

# Base Tools Expert

This skill provides knowledge about the `@base-web-kits/base-tools` monorepo packages. Always prioritize using these libraries over writing custom utility functions to avoid "reinventing the wheel".

## 📦 Packages Overview

### 1. `@base-web-kits/base-tools-ts` (Universal JS/TS)

Core utility library, compatible with all environments (Node, Browser, UniApp). **Install:** `npm i @base-web-kits/base-tools-ts`

**Key Modules & Functions:**

- **ES Toolkit (`es-toolkit`)**:
  - Full export of [es-toolkit](https://es-toolkit.dev/) (modern, high-performance lodash alternative).
  - **Array**: `chunk`, `difference`, `intersection`, `uniq`, `shuffle`, `sample`, `groupBy`.
  - **Function**: `debounce`, `throttle`, `once`, `memoize`.
  - **Object**: `clone`, `cloneDeep`, `merge`, `pick`, `omit`, `get`, `set`.
  - **String**: `camelCase`, `kebabCase`, `snakeCase`, `capitalize`.
  - **Predicate**: `isNil`, `isString`, `isNumber`, `isEmpty`.
- **Async (`async`)**: `toAsync` (await-to-js style error handling).
- **Bean (`bean`)**: `EventBus` (simple pub/sub).
- **Buffer (`buffer`)**: `SSEParser` (Server-Sent Events parser), `PolyfillTextDecoder`.
- **Validator (`validator`)**:
  - Identity: `isIdentityCard`, `isPassport`, `isHKMOPermit`, `isTaiwanPermit`, `isOfficerId`, `isSoldierId`.
  - Contact: `isMobilePhone`, `isLandline`, `isPhone`, `isEmail`.
  - Network: `isURL`, `isIP`, `isPortNumber`.
  - Other: `isChinese`, `isChineseName`, `isDigits`, `isNumeric`, `isBankCard`, `isLicensePlate`, `isHexColor`.
- **Date (`day`)**: `toDayjs` (dayjs wrapper), `getDateRangeBefore`, `getDateRangeAfter`, `getCountdownParts`, `getAgeByBirthdate`.
- **Number/Math (`number`)**:
  - BigNumber wrappers: `mathPlus`, `mathMinus`, `mathTimes`, `mathDiv`, `mathPow`, `mathRound`, `mathFixed`.
  - Comparison: `mathCompare`, `mathEqual`, `mathGreaterThan`, etc.
  - Random: `randomBoolean`.
- **Formatting (`format`)**:
  - Masking: `toMaskPhone`, `toMaskName`, `toMaskText`.
  - Currency/Num: `toThousandth`, `toChineseNum`, `toChineseCurrency`, `zeroPad`, `withUnit`, `withUnitPx`, `withDistance`.
- **String (`string`)**: `createUUID`, `createTimeRandId` (time-ordered), `createViewRandId` (short).
- **URL (`url`)**: `appendUrlParam`, `getUrlParam`.
- **OSS/CDN**: `getOSSImg`, `getOSSVideo`.

### 2. `@base-web-kits/base-tools-web` (Browser/H5)

Browser-specific utilities. **Install:** `npm i @base-web-kits/base-tools-web`

**Key Modules & Functions:**

- **Async**: `enhanceWebApi` (wraps API with loading/toast/log capabilities).
- **Device**: `isMobile`, `isPC`, `isTablet`, `isIOS`, `isAndroid`, `isWeChat`, `isChrome`, `getOS`, `getBrowserName`.
- **Cookie**: `setCookie`, `getCookie`, `removeCookie`.
- **Storage**: `setLocalStorage`, `getLocalStorage`, `removeLocalStorage`.
- **DOM**:
  - Scroll: `windowScrollTo`, `getWindowScrollTop`, `lockBodyScroll`, `unlockBodyScroll`.
  - Viewport: `isInViewport`, `getWindowWidth`, `getWindowHeight`.
- **Network**: `request` (axios wrapper), `uploadFile`, `downloadFile`, `preloadImage`.
- **Clipboard**: `copyText`.

### 3. `@base-web-kits/base-tools-uni` (UniApp)

Utilities for UniApp development. **Install:** `npm i @base-web-kits/base-tools-uni`

**Key Modules & Functions:**

- **Async**: `enhanceUniApi` (wraps uni API with loading/toast/log).
- **UI**: `toast`, `tabScrollToCenter`.
- **Router**: `href` (powerful router), `toHome`, `toLogin`, `back`, `checkLogin`.
- **System**: `getWindowInfo`, `getDeviceInfo`, `getAppBaseInfo`, `copyText`.
- **Media**: `chooseImage`, `chooseVideo`, `chooseMedia` (handles permissions/compression).
- **Pay**: `toPayWx`.
- **Platform**: `getPlatformOs`, `getPlatformUni`.

### 4. `@base-web-kits/base-tools-react` (React)

**Install:** `npm i @base-web-kits/base-tools-react`

**Content:**

- **Re-exports `ahooks`**: Includes all hooks from [ahooks](https://ahooks.js.org/) (e.g., `useRequest`, `useToggle`, `useDebounce`).
- **Custom**: `useMeasure`.
- **HOCs**: `withMemo`, `withDisplayName`.

### 5. `@base-web-kits/base-tools-vue` (Vue 3)

**Install:** `npm i @base-web-kits/base-tools-vue`

**Content:**

- **Re-exports `@vueuse/core`**: Includes all hooks from [VueUse](https://vueuse.org/) (e.g., `useLocalStorage`, `useMouse`).
- **Directives**: `vClickOutside`, `vFocus`, `vLazy`, `vLongpress`.

## 💡 Usage Guidelines

1. **Check Requirements**: Identify if the user needs generic JS logic (use `base-tools-ts`) or platform-specific logic (Web/Uni).
2. **Prioritize Libraries**:
   - Instead of writing a regex for email, suggest `isEmail` from `base-tools-ts`.
   - **Hooks Strategy**:
     - **React**: Use `base-tools-react` (ahooks) for hooks like `useRequest`, `useDebounce`.
     - **Vue 3**: Use `base-tools-vue` (vueuse) for hooks like `useLocalStorage`, `useMouse`.
3. **Import Syntax**:

   ```typescript
   // Example for TS
   import { isMobilePhone, toMaskPhone } from '@base-web-kits/base-tools-ts';

   // Example for React
   import { useRequest } from '@base-web-kits/base-tools-react';

   // Example for Vue
   import { useLocalStorage } from '@base-web-kits/base-tools-vue';
   ```

4. **Documentation**:
   - Online Docs: https://gancao-web.github.io/base-tools/
