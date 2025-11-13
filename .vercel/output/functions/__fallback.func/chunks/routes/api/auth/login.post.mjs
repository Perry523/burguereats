import { d as defineEventHandler, r as readBody, c as createError, s as setCookie } from '../../../nitro/nitro.mjs';
import { D as DatabaseHelper } from '../../../_/database.mjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'events';
import 'timers';
import 'util';
import 'lodash/cloneDeep';
import 'lodash/defaults';
import 'lodash/uniqueId';
import 'stream';
import 'lodash/differenceWith';
import 'lodash/get';
import 'lodash/isEmpty';
import 'lodash/max';
import 'path';
import 'lodash/template';
import 'fs';
import 'lodash/flatten';
import 'lodash/sortBy';
import 'get-package-type';
import 'url';
import 'colorette';
import 'lodash/includes';
import 'lodash/merge';
import 'lodash/chunk';
import 'assert';
import 'lodash/assign';
import 'lodash/clone';
import 'lodash/each';
import 'lodash/isPlainObject';
import 'lodash/last';
import 'lodash/reject';
import 'lodash/tail';
import 'lodash/toArray';
import 'lodash/isTypedArray';
import 'lodash/reduce';
import 'lodash/transform';
import 'lodash/compact';
import 'lodash/groupBy';
import 'lodash/has';
import 'lodash/map';
import 'lodash/omitBy';
import 'lodash/extend';
import 'lodash/indexOf';
import 'lodash/first';
import 'lodash/constant';
import 'lodash/identity';
import 'lodash/some';
import 'lodash/filter';
import 'lodash/values';
import 'sqlite3';
import 'better-sqlite3';
import 'postgres-array';
import 'postgres-date';
import 'postgres-interval';
import 'postgres-bytea';
import 'crypto';
import 'dns';
import 'net';
import 'tls';
import 'split2';
import 'pg-query-stream';
import 'lodash/isNil';
import 'tedious';
import 'lodash/defer';
import 'mysql';
import 'mysql2';
import 'lodash/uniq';
import 'oracledb';
import '@supabase/supabase-js';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@iconify/utils';
import 'consola';
import 'node:url';
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
    const admin = await db.db("Admins").where("email", body.email).first();
    if (!admin) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid email or password"
      });
    }
    if (!admin.isActive) {
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
    const company = await db.findById("Company", admin.companyId);
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        companyId: admin.companyId
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
