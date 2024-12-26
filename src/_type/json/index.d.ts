interface IBaseResponse {
  success: boolean
  stautsCode: number
}

export interface IFailedResponse extends IBaseResponse {
  success: false
  message: string
}

export interface ISuccessResponse<T> extends IBaseResponse {
  success: true
  data: T
}
