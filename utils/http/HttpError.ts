const TYPE = 'api error'

export class HttpError<DataT = any> extends Error {
  public static is(error: any): error is HttpError {
    return error?.type === TYPE
  }

  /**
   * 将HTTP status和Api code统一到一个code里
   */
  public code: number
  public data: DataT

  private type = TYPE

  public constructor(info: { code: number; msg: string; data: DataT }) {
    super(info.msg)
    this.code = info.code
    this.data = info.data
  }
}
