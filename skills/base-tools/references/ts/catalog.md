# Base Tools TS Catalog

- 包名: `@base-web-kits/base-tools-ts`
- 安装: `pnpm add @base-web-kits/base-tools-ts`
- 入口: `src/ts/index.ts`

## Modules

### array
- 来源: `src/ts/array/index.ts`
- 导出: `arrayMove`

### async
- 来源: `src/ts/async/index.ts`
- 导出: `toAsync`

### bean

#### EventBus
- 来源: `src/ts/bean/EventBus.ts`
- 导出: `EventBus`

### buffer

#### SSEParser
- 来源: `src/ts/buffer/SSEParser.ts`
- 导出: `MessageCallback`、`SSEMessage`、`SSEParser`

### day
- 来源: `src/ts/day/index.ts`
- 导出: `dateFormat`、`dayjs`、`getAgeByBirthdate`、`getCountdownParts`、`getDateRangeAfter`、`getDateRangeBefore`、`toDayjs`

### es-toolkit
- 来源: `src/ts/es-toolkit/index.ts`
- re-export: `es-toolkit`

### number

#### big
- 来源: `src/ts/number/big.ts`
- 导出: `BigNumber`、`mathCompare`、`mathDiv`、`mathEqual`、`mathFixed`、`mathGreaterThan`、`mathGreaterThanOrEqual`、`mathLessThan`、`mathLessThanOrEqual`、`mathMinus`、`mathPlus`、`mathPow`、`mathRound`、`mathTimes`、`NumLike`

#### format
- 来源: `src/ts/number/format.ts`
- 导出: `toChineseCurrency`、`toChineseNum`、`toThousandth`、`withDistance`、`withUnit`、`withUnitPx`、`zeroPad`

#### random
- 来源: `src/ts/number/random.ts`
- 导出: `randomBoolean`

### object
- 来源: `src/ts/object/index.ts`
- 导出: `getObjectKeys`、`getObjectValue`、`setObjectValue`

### string

#### format
- 来源: `src/ts/string/format.ts`
- 导出: `toMaskName`、`toMaskPhone`、`toMaskText`

#### other
- 来源: `src/ts/string/other.ts`
- 导出: `getByteLength`

#### random
- 来源: `src/ts/string/random.ts`
- 导出: `createTimeRandId`、`createUUID`、`createViewRandId`

### typing
- 来源: `src/ts/typing/index.ts`
- 导出: `Brand`、`DeepPartial`、`DeepRequired`、`Exact`、`JsonArray`、`JsonObject`、`JsonPrimitive`、`JsonValue`、`KeysOfType`、`Merge`、`Mutable`、`Nullable`、`OptionalKeys`、`PickByType`、`ReadonlyDeep`、`RequiredKeys`、`SetOptional`、`SetRequired`、`UnionToIntersection`、`ValueOf`

### url

#### file
- 来源: `src/ts/url/file/index.ts`
- 导出: `getFileSuffix`、`getFileType`

#### oss
- 来源: `src/ts/url/oss/index.ts`
- 导出: `buildOSSUrl`、`getOSSAudio`、`getOSSHls`、`getOSSImg`、`getOSSVideo`

#### param
- 来源: `src/ts/url/param/index.ts`
- 导出: `appendUrlParam`

#### path
- 来源: `src/ts/url/path/index.ts`
- 导出: `joinUrlPath`

#### qn
- 来源: `src/ts/url/qn/index.ts`
- 导出: `getQnAudio`、`getQnHls`、`getQnImg`、`getQnVideo`

### validator
- 来源: `src/ts/validator/index.ts`
- 导出: `isBankCard`、`isChinese`、`isChineseName`、`isDigits`、`isEmail`、`isHexColor`、`isHKMOPermit`、`isIdentityCard`、`isIP`、`isIPRange`、`isIPv6`、`isLandline`、`isLatitude`、`isLetter`、`isLicensePlate`、`isLongitude`、`isMilitaryId`、`isMobilePhone`、`isNumeric`、`isOfficerId`、`isPassport`、`isPhone`、`isPortNumber`、`isSoldierId`、`isTaiwanPermit`、`isTaxID`、`isURL`

## Third-party Re-exports

- `es-toolkit`
