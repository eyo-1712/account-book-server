interface BaseResponse {
  success: boolean
  statusCode: number
}

export interface FailedResponse extends BaseResponse {
  success: false
  message: string
}

export interface SuccessResponse<T> extends BaseResponse {
  success: true
  data: T
  hasNext?: boolean
}
