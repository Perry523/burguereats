import type { H3Event } from 'h3'
import { setResponseStatus } from 'h3'

export interface ApiSuccessResponse<T> {
  success: true
  data: T
}

export interface ApiErrorBody {
  code: string
  message: string
  details?: unknown
}

export interface ApiErrorResponse {
  success: false
  error: ApiErrorBody
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

interface SuccessOptions<T> {
  statusCode?: number
  data: T
}

interface ErrorOptions {
  statusCode?: number
  code?: string
  message: string
  details?: unknown
}

const isDevelopment = process.env.NODE_ENV !== 'production'

const formatErrorDetails = (details: unknown) => {
  if (!isDevelopment) {
    return undefined
  }
  if (details instanceof Error) {
    return {
      message: details.message,
      stack: details.stack,
    }
  }
  return details
}

export const sendSuccess = <T>(event: H3Event, options: SuccessOptions<T>): ApiSuccessResponse<T> => {
  const statusCode = options.statusCode ?? 200
  setResponseStatus(event, statusCode)
  return {
    success: true,
    data: options.data,
  }
}

export const sendError = (event: H3Event, options: ErrorOptions): ApiErrorResponse => {
  const statusCode = options.statusCode ?? 500
  const code = options.code ?? 'UNEXPECTED_ERROR'
  setResponseStatus(event, statusCode)
  return {
    success: false,
    error: {
      code,
      message: options.message,
      ...(options.details !== undefined
        ? { details: formatErrorDetails(options.details) }
        : {}),
    },
  }
}

export const handleServerError = (
  event: H3Event,
  error: unknown,
  context: { message: string; code: string; statusCode?: number }
) => {
  console.error(`[API] ${context.code}:`, error)
  return sendError(event, {
    statusCode: context.statusCode ?? 500,
    code: context.code,
    message: context.message,
    details: error,
  })
}
