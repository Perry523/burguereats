import { d as defineEventHandler, k as readMultipartFormData, c as createError, j as supabase, H as H3Error } from '../../../nitro/nitro.mjs';
import 'knex';
import 'node:process';
import 'node:path';
import 'node:url';
import 'node:module';
import 'node:fs';
import 'node:child_process';
import 'node:fs/promises';
import 'node:os';
import 'node:util';
import 'node:async_hooks';
import 'node:events';
import '@supabase/supabase-js';
import 'node:http';
import 'node:https';
import 'node:buffer';
import 'node:crypto';
import '@iconify/utils';
import 'consola';
import 'ipx';

const BUCKET_NAME = "dishes";
const toSlug = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
const dishImage_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  try {
    const formData = await readMultipartFormData(event);
    if (!formData || !formData.length) {
      throw createError({
        statusCode: 400,
        statusMessage: "Dados de formul\xE1rio inv\xE1lidos"
      });
    }
    const filePart = formData.find((part) => part.name === "file" && part.type);
    if (!filePart || !filePart.data) {
      throw createError({
        statusCode: 400,
        statusMessage: "Arquivo da imagem \xE9 obrigat\xF3rio"
      });
    }
    const fileType = (_a = filePart.type) != null ? _a : "";
    if (!fileType.startsWith("image/")) {
      throw createError({
        statusCode: 400,
        statusMessage: "O arquivo precisa ser uma imagem v\xE1lida"
      });
    }
    const companyIdPart = formData.find((part) => part.name === "companyId");
    const companyId = (_c = (_b = companyIdPart == null ? void 0 : companyIdPart.data) == null ? void 0 : _b.toString("utf8").trim()) != null ? _c : "";
    if (!companyId) {
      throw createError({
        statusCode: 400,
        statusMessage: "companyId \xE9 obrigat\xF3rio"
      });
    }
    const namePart = formData.find((part) => part.name === "name");
    const rawName = (_e = (_d = namePart == null ? void 0 : namePart.data) == null ? void 0 : _d.toString("utf8").trim()) != null ? _e : "prato";
    const baseName = toSlug(rawName) || "prato";
    const extensionFromName = (_g = (_f = filePart.filename) == null ? void 0 : _f.split(".").pop()) == null ? void 0 : _g.toLowerCase();
    const extensionFromType = fileType.split("/").pop();
    const extension = extensionFromName || extensionFromType || "jpg";
    const fileName = `${baseName}-${Date.now()}.${extension}`;
    const filePath = `${companyId}/${fileName}`;
    const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(filePath, filePart.data, {
      upsert: true,
      cacheControl: "3600",
      contentType: fileType
    });
    if (uploadError) {
      throw createError({
        statusCode: typeof uploadError.statusCode === "number" ? uploadError.statusCode : 500,
        statusMessage: uploadError.message || "Falha ao enviar imagem"
      });
    }
    const { data: publicData, error: publicError } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
    if (publicError) {
      throw createError({
        statusCode: typeof publicError.statusCode === "number" ? publicError.statusCode : 500,
        statusMessage: publicError.message || "N\xE3o foi poss\xEDvel gerar a URL p\xFAblica da imagem"
      });
    }
    const publicUrl = (_h = publicData == null ? void 0 : publicData.publicUrl) == null ? void 0 : _h.trim();
    if (!publicUrl) {
      throw createError({
        statusCode: 500,
        statusMessage: "N\xE3o foi poss\xEDvel obter a URL da imagem enviada"
      });
    }
    return {
      success: true,
      data: {
        url: publicUrl,
        path: filePath
      }
    };
  } catch (error) {
    if (error instanceof H3Error) {
      throw error;
    }
    const message = error instanceof Error ? error.message : "Falha ao enviar imagem";
    throw createError({
      statusCode: 500,
      statusMessage: message
    });
  }
});

export { dishImage_post as default };
//# sourceMappingURL=dish-image.post.mjs.map
