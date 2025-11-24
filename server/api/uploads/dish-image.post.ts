import { H3Error } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'

const BUCKET_NAME = 'dishes'

const toSlug = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

export default defineEventHandler(async (event) => {
  try {
    const supabase = await serverSupabaseServiceRole(event)
    const formData = await readMultipartFormData(event)

    if (!formData || !formData.length) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Dados de formulário inválidos',
      })
    }

    const filePart = formData.find((part) => part.name === 'file' && part.type)
    if (!filePart || !filePart.data) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Arquivo da imagem é obrigatório',
      })
    }

    const fileType = filePart.type ?? ''
    if (!fileType.startsWith('image/')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'O arquivo precisa ser uma imagem válida',
      })
    }

    const companyIdPart = formData.find((part) => part.name === 'companyId')
    const companyId = companyIdPart?.data?.toString('utf8').trim() ?? ''

    if (!companyId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'companyId é obrigatório',
      })
    }

    const namePart = formData.find((part) => part.name === 'name')
    const rawName = namePart?.data?.toString('utf8').trim() ?? 'prato'
    const baseName = toSlug(rawName) || 'prato'

    const extensionFromName = filePart.filename?.split('.').pop()?.toLowerCase()
    const extensionFromType = fileType.split('/').pop()
    const extension = extensionFromName || extensionFromType || 'jpg'
    const fileName = `${baseName}-${Date.now()}.${extension}`
    const filePath = `${companyId}/${fileName}`

    const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(filePath, filePart.data, {
      upsert: true,
      cacheControl: '3600',
      contentType: fileType,
    })

    if (uploadError) {
      const statusCode = (uploadError as any).statusCode || (uploadError as any).status || 500
      throw createError({
        statusCode,
        statusMessage: uploadError.message || 'Falha ao enviar imagem',
      })
    }

    const { data: publicData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)
    const publicUrl = publicData?.publicUrl?.trim()

    if (!publicUrl) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Não foi possível obter a URL da imagem enviada',
      })
    }

    return {
      success: true,
      data: {
        url: publicUrl,
        path: filePath,
      },
    }
  } catch (error) {
    if (error instanceof H3Error) {
      throw error
    }
    const message = error instanceof Error ? error.message : 'Falha ao enviar imagem'
    throw createError({
      statusCode: 500,
      statusMessage: message,
    })
  }
})
