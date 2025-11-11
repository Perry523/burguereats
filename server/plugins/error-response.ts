import { H3Error, setResponseStatus } from 'h3'
import { sendError } from '~/server/utils/http'

const isH3Error = (error: unknown): error is H3Error => error instanceof H3Error

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:error', (error, { event }) => {
    if (!event) {
      return
    }

    if (isH3Error(error)) {
      const statusCode = error.statusCode ?? 500
      const statusMessage = error.statusMessage ?? 'Unexpected error'
      const code = typeof (error.data as any)?.code === 'string' ? (error.data as any).code : `HTTP_${statusCode}`
      setResponseStatus(event, statusCode, statusMessage)
      return sendError(event, {
        statusCode,
        code,
        message: statusMessage,
        details: error.data ?? error,
      })
    }

    setResponseStatus(event, 500, 'Internal Server Error')
    return sendError(event, {
      statusCode: 500,
      code: 'UNEXPECTED_ERROR',
      message: 'Internal Server Error',
      details: error,
    })
  })
})
