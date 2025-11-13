import { d as defineEventHandler, r as readBody, c as createError, D as DatabaseHelper, s as setCookie } from '../../../nitro/nitro.mjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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

const login_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!body.email || !body.password) {
      throw createError({
        statusCode: 400,
        statusMessage: "Email and password are required"
      });
    }
    const db = new DatabaseHelper();
    const admin = await db.db("admins").where("email", body.email).first();
    if (!admin) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid email or password"
      });
    }
    if (!admin.is_active) {
      throw createError({
        statusCode: 403,
        statusMessage: "Admin account is inactive"
      });
    }
    const isPasswordValid = await bcrypt.compare(body.password, admin.password);
    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid email or password"
      });
    }
    const company = await db.findById("companies", admin.company_id);
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        companyId: admin.company_id
      },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );
    setCookie(event, "auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/"
    });
    return {
      success: true,
      data: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        company
      }
    };
  } catch (error) {
    if (error) {
      throw error;
    }
    console.error("Login error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to login"
    });
  }
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
