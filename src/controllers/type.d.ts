import { IRouterHandler } from 'express'

export type TController = {
  [key: string]: IRouterHandler
}
