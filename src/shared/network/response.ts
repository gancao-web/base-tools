import { getObjectValue } from '../../ts/object';

/** 响应转换配置。默认保持输入、输出类型一致。 */
export type ResponseTransformer<Input = unknown, Output = Input> = {
  /** 响应数据的转换。 */
  transformResponse?: (response: Input) => Output;
};

/** 响应字段路径。可声明多个候选路径，按顺序取第一个非 null、非 undefined 的值。 */
export type ResponseKey = string | readonly string[];

/** API 业务响应字段配置。 */
export type ApiResponseConfig = {
  /** 接口返回响应数据的字段，支持点路径或候选路径数组；配置 false 时返回完整响应。 */
  resKey: ResponseKey | false;
  /** 接口返回响应消息的字段，支持点路径或候选路径数组。 */
  msgKey: ResponseKey;
  /** 接口返回响应状态码的字段，支持点路径或候选路径数组。 */
  codeKey: ResponseKey;
  /** 接口返回成功状态码的字段，支持点路径或候选路径数组；不配置时使用 codeKey。 */
  successKey?: ResponseKey;
  /** 成功状态码 */
  successCode: readonly (number | string)[];
  /** 登录过期状态码 */
  reloginCode: readonly (number | string)[];
};

/** API 业务响应字段的可选配置。 */
export type ApiResponseConfigOptions = Partial<ApiResponseConfig>;

/** 按响应字段路径读取值；传入候选路径数组时，按顺序返回第一个非 null、非 undefined 的值。 */
export function getResponseValue(response: unknown, key: ResponseKey | undefined): unknown {
  if (Array.isArray(key)) {
    for (const candidate of key) {
      const value = getObjectValue(response, candidate);
      if (value !== undefined && value !== null) return value;
    }
    return undefined;
  }

  return key === undefined ? undefined : getObjectValue(response, key);
}
