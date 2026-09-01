/** 响应转换配置。默认保持输入、输出类型一致。 */
export type ResponseTransformer<Input = unknown, Output = Input> = {
  /** 响应数据的转换。 */
  transformResponse?: (response: Input) => Output;
};

/** API 业务响应字段配置。 */
export type ApiResponseConfig = {
  /** 接口返回响应数据的字段，支持 "a[0].b.c" 格式；配置 false 时返回完整响应。 */
  resKey: string | false;
  /** 接口返回响应消息的字段，支持 "a[0].b.c" 格式。 */
  msgKey: string;
  /** 接口返回响应状态码的字段，支持 "a[0].b.c" 格式。 */
  codeKey: string;
  /** 接口返回成功状态码的字段，支持 "a[0].b.c" 格式；不配置时使用 codeKey。 */
  successKey?: string;
  /** 成功状态码。 */
  successCode: (number | string)[];
  /** 登录过期状态码。 */
  reloginCode: (number | string)[];
};

/** API 业务响应字段的可选配置。 */
export type ApiResponseConfigOptions = Partial<ApiResponseConfig>;
