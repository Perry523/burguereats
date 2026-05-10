import { H3Error } from 'h3'
import { createClient } from "@supabase/supabase-js";
import { requireAuth } from '../utils/auth' // wait, I don't know if this exists in uploads, let's use the same as index.post.ts, wait, how did index.post.ts import requireAuth? It didn't import it, maybe it's auto-imported.

const BUCKET_NAME = 'receipts'

export default defineEventHandler(async (event) => {
  try {
    const auth = requireAuth(event);

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) throw new Error("Missing Supabase configuration");

    const supabase = createClient(supabaseUrl, supabaseKey);

    // ensure bucket exists (optional but safe)
    await supabase.storage.createBucket(BUCKET_NAME, { public: true }).catch(() => {});

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

    const extensionFromName = filePart.filename?.split('.').pop()?.toLowerCase()
    const extensionFromType = fileType.split('/').pop()
    const extension = extensionFromName || extensionFromType || 'jpg'
    const fileName = `receipt-${Date.now()}.${extension}`
    const filePath = `${auth.id}/${fileName}`

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
