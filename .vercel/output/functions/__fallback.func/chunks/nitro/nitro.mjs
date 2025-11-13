import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import * as events from 'events';
import * as timers from 'timers';
import * as util$1 from 'util';
import * as cloneDeep$1 from 'lodash/cloneDeep';
import * as defaults$6 from 'lodash/defaults';
import * as uniqueId$2 from 'lodash/uniqueId';
import * as stream$1 from 'stream';
import * as differenceWith$1 from 'lodash/differenceWith';
import * as get$1 from 'lodash/get';
import * as isEmpty$5 from 'lodash/isEmpty';
import * as max$1 from 'lodash/max';
import * as path$6 from 'path';
import * as template$1 from 'lodash/template';
import * as fs$1 from 'fs';
import * as flatten$3 from 'lodash/flatten';
import * as sortBy$1 from 'lodash/sortBy';
import * as getPackageType from 'get-package-type';
import * as url from 'url';
import * as colorette from 'colorette';
import * as includes$1 from 'lodash/includes';
import * as merge$1 from 'lodash/merge';
import * as chunk$1 from 'lodash/chunk';
import * as assert$3 from 'assert';
import * as assign$7 from 'lodash/assign';
import * as clone$2 from 'lodash/clone';
import * as each$2 from 'lodash/each';
import * as isPlainObject$5 from 'lodash/isPlainObject';
import * as last$1 from 'lodash/last';
import * as reject$1 from 'lodash/reject';
import * as tail$4 from 'lodash/tail';
import * as toArray$4 from 'lodash/toArray';
import * as isTypedArray$1 from 'lodash/isTypedArray';
import * as reduce$2 from 'lodash/reduce';
import * as transform$1 from 'lodash/transform';
import * as compact$1 from 'lodash/compact';
import * as groupBy$4 from 'lodash/groupBy';
import * as has$2 from 'lodash/has';
import * as map$1 from 'lodash/map';
import * as omitBy$1 from 'lodash/omitBy';
import * as extend$3 from 'lodash/extend';
import * as indexOf$1 from 'lodash/indexOf';
import * as first$1 from 'lodash/first';
import * as constant from 'lodash/constant';
import * as identity from 'lodash/identity';
import * as some from 'lodash/some';
import * as filter from 'lodash/filter';
import * as values from 'lodash/values';
import * as sqlite3$1 from 'sqlite3';
import * as betterSqlite3$1 from 'better-sqlite3';
import * as postgresArray from 'postgres-array';
import * as postgresDate from 'postgres-date';
import * as postgresInterval from 'postgres-interval';
import * as postgresBytea from 'postgres-bytea';
import * as crypto$2 from 'crypto';
import * as dns$1 from 'dns';
import * as net from 'net';
import * as tls from 'tls';
import * as split2 from 'split2';
import * as pgQueryStream from 'pg-query-stream';
import * as isNil from 'lodash/isNil';
import * as tedious from 'tedious';
import * as defer$2 from 'lodash/defer';
import * as mysql$1 from 'mysql';
import * as mysql2$1 from 'mysql2';
import * as uniq from 'lodash/uniq';
import * as oracledb$1 from 'oracledb';
import { createClient } from '@supabase/supabase-js';
import http from 'node:http';
import https from 'node:https';
import { EventEmitter as EventEmitter$a } from 'node:events';
import { Buffer as Buffer$1 } from 'node:buffer';
import { promises, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { createHash } from 'node:crypto';
import { getIcons } from '@iconify/utils';
import { consola } from 'consola';
import { fileURLToPath } from 'node:url';
import { ipxFSStorage, ipxHttpStorage, createIPX, createIPXH3Handler } from 'ipx';

function _mergeNamespaces(n, m) {
  for (var i = 0; i < m.length; i++) {
    const e = m[i];
    if (typeof e !== 'string' && !Array.isArray(e)) { for (const k in e) {
      if (k !== 'default' && !(k in n)) {
        const d = Object.getOwnPropertyDescriptor(e, k);
        if (d) {
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () { return e[k]; }
          });
        }
      }
    } }
  }
  return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: 'Module' }));
}

const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function decode$1(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodeQueryKey(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = /* @__PURE__ */ Object.create(null);
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map(
      (_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`
    ).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}

const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/");
  }
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/") ? input : input + "/";
  }
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    return input;
  }
  return joinURL(_base, input);
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const trimmed = input.slice(_base.length);
  return trimmed[0] === "/" ? trimmed : "/" + trimmed;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function getQuery$1(input) {
  return parseQuery(parseURL(input).search);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}
function joinRelativeURL(..._input) {
  const JOIN_SEGMENT_SPLIT_RE = /\/(?!\/)/;
  const input = _input.filter(Boolean);
  const segments = [];
  let segmentsDepth = 0;
  for (const i of input) {
    if (!i || i === "/") {
      continue;
    }
    for (const [sindex, s] of i.split(JOIN_SEGMENT_SPLIT_RE).entries()) {
      if (!s || s === ".") {
        continue;
      }
      if (s === "..") {
        if (segments.length === 1 && hasProtocol(segments[0])) {
          continue;
        }
        segments.pop();
        segmentsDepth--;
        continue;
      }
      if (sindex === 1 && segments[segments.length - 1]?.endsWith(":/")) {
        segments[segments.length - 1] += "/" + s;
        continue;
      }
      segments.push(s);
      segmentsDepth++;
    }
  }
  let url = segments.join("/");
  if (segmentsDepth >= 0) {
    if (input[0]?.startsWith("/") && !url.startsWith("/")) {
      url = "/" + url;
    } else if (input[0]?.startsWith("./") && !url.startsWith("./")) {
      url = "./" + url;
    }
  } else {
    url = "../".repeat(-1 * segmentsDepth) + url;
  }
  if (input[input.length - 1]?.endsWith("/") && !url.endsWith("/")) {
    url += "/";
  }
  return url;
}

const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

function parse$9(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = {};
  const opt = {};
  const dec = opt.decode || decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;
      continue;
    }
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function decode(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}

const fieldContentRegExp = /^[\u0009\u0020-\u007E\u0080-\u00FF]+$/;
function serialize$5(name, value, options) {
  const opt = options || {};
  const enc = opt.encode || encodeURIComponent;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  const encodedValue = enc(value);
  if (encodedValue && !fieldContentRegExp.test(encodedValue)) {
    throw new TypeError("argument val is invalid");
  }
  let str = name + "=" + encodedValue;
  if (void 0 !== opt.maxAge && opt.maxAge !== null) {
    const maxAge = opt.maxAge - 0;
    if (Number.isNaN(maxAge) || !Number.isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    if (!isDate$1(opt.expires) || Number.isNaN(opt.expires.valueOf())) {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + opt.expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.priority) {
    const priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
    switch (priority) {
      case "low": {
        str += "; Priority=Low";
        break;
      }
      case "medium": {
        str += "; Priority=Medium";
        break;
      }
      case "high": {
        str += "; Priority=High";
        break;
      }
      default: {
        throw new TypeError("option priority is invalid");
      }
    }
  }
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true: {
        str += "; SameSite=Strict";
        break;
      }
      case "lax": {
        str += "; SameSite=Lax";
        break;
      }
      case "strict": {
        str += "; SameSite=Strict";
        break;
      }
      case "none": {
        str += "; SameSite=None";
        break;
      }
      default: {
        throw new TypeError("option sameSite is invalid");
      }
    }
  }
  if (opt.partitioned) {
    str += "; Partitioned";
  }
  return str;
}
function isDate$1(val) {
  return Object.prototype.toString.call(val) === "[object Date]" || val instanceof Date;
}

function parseSetCookie(setCookieValue, options) {
  const parts = (setCookieValue || "").split(";").filter((str) => typeof str === "string" && !!str.trim());
  const nameValuePairStr = parts.shift() || "";
  const parsed = _parseNameValuePair(nameValuePairStr);
  const name = parsed.name;
  let value = parsed.value;
  try {
    value = options?.decode === false ? value : (options?.decode || decodeURIComponent)(value);
  } catch {
  }
  const cookie = {
    name,
    value
  };
  for (const part of parts) {
    const sides = part.split("=");
    const partKey = (sides.shift() || "").trimStart().toLowerCase();
    const partValue = sides.join("=");
    switch (partKey) {
      case "expires": {
        cookie.expires = new Date(partValue);
        break;
      }
      case "max-age": {
        cookie.maxAge = Number.parseInt(partValue, 10);
        break;
      }
      case "secure": {
        cookie.secure = true;
        break;
      }
      case "httponly": {
        cookie.httpOnly = true;
        break;
      }
      case "samesite": {
        cookie.sameSite = partValue;
        break;
      }
      default: {
        cookie[partKey] = partValue;
      }
    }
  }
  return cookie;
}
function _parseNameValuePair(nameValuePairStr) {
  let name = "";
  let value = "";
  const nameValueArr = nameValuePairStr.split("=");
  if (nameValueArr.length > 1) {
    name = nameValueArr.shift();
    value = nameValueArr.join("=");
  } else {
    value = nameValuePairStr;
  }
  return { name, value };
}

const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};

function createRouter$1(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p) => options.strictTrailingSlash ? p : p.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
    }
  }
  return {
    ctx,
    lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: (path) => remove$1(ctx, normalizeTrailingSlash(path))
  };
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode === void 0) {
      if (node && node.placeholderChildren.length > 1) {
        const remaining = sections.length - i;
        node = node.placeholderChildren.find((c) => c.maxDepth === remaining) || null;
      } else {
        node = node.placeholderChildren[0] || null;
      }
      if (!node) {
        break;
      }
      if (node.paramName) {
        params[node.paramName] = section;
      }
      paramsFound = true;
    } else {
      node = nextNode;
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : void 0
    };
  }
  return node.data;
}
function insert(ctx, path, data) {
  let isStaticRoute = true;
  const sections = path.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  const matchedNodes = [node];
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildren.push(childNode);
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      matchedNodes.push(childNode);
      node = childNode;
    }
  }
  for (const [depth, node2] of matchedNodes.entries()) {
    node2.maxDepth = Math.max(matchedNodes.length - depth, node2.maxDepth || 0);
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node;
  }
  return node;
}
function remove$1(ctx, path) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections.at(-1) || "";
    node.data = null;
    if (Object.keys(node.children).length === 0 && node.parent) {
      node.parent.children.delete(lastSection);
      node.parent.wildcardChildNode = null;
      node.parent.placeholderChildren = [];
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    maxDepth: 0,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildren: []
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}

function toRouteMatcher(router) {
  const table = _routerNodeToTable("", router.ctx.rootNode);
  return _createMatcher(table, router.ctx.options.strictTrailingSlash);
}
function _createMatcher(table, strictTrailingSlash) {
  return {
    ctx: { table },
    matchAll: (path) => _matchRoutes(path, table, strictTrailingSlash)
  };
}
function _createRouteTable() {
  return {
    static: /* @__PURE__ */ new Map(),
    wildcard: /* @__PURE__ */ new Map(),
    dynamic: /* @__PURE__ */ new Map()
  };
}
function _matchRoutes(path, table, strictTrailingSlash) {
  if (strictTrailingSlash !== true && path.endsWith("/")) {
    path = path.slice(0, -1) || "/";
  }
  const matches = [];
  for (const [key, value] of _sortRoutesMap(table.wildcard)) {
    if (path === key || path.startsWith(key + "/")) {
      matches.push(value);
    }
  }
  for (const [key, value] of _sortRoutesMap(table.dynamic)) {
    if (path.startsWith(key + "/")) {
      const subPath = "/" + path.slice(key.length).split("/").splice(2).join("/");
      matches.push(..._matchRoutes(subPath, value));
    }
  }
  const staticMatch = table.static.get(path);
  if (staticMatch) {
    matches.push(staticMatch);
  }
  return matches.filter(Boolean);
}
function _sortRoutesMap(m) {
  return [...m.entries()].sort((a, b) => a[0].length - b[0].length);
}
function _routerNodeToTable(initialPath, initialNode) {
  const table = _createRouteTable();
  function _addNode(path, node) {
    if (path) {
      if (node.type === NODE_TYPES.NORMAL && !(path.includes("*") || path.includes(":"))) {
        if (node.data) {
          table.static.set(path, node.data);
        }
      } else if (node.type === NODE_TYPES.WILDCARD) {
        table.wildcard.set(path.replace("/**", ""), node.data);
      } else if (node.type === NODE_TYPES.PLACEHOLDER) {
        const subTable = _routerNodeToTable("", node);
        if (node.data) {
          subTable.static.set("/", node.data);
        }
        table.dynamic.set(path.replace(/\/\*|\/:\w+/, ""), subTable);
        return;
      }
    }
    for (const [childPath, child] of node.children.entries()) {
      _addNode(`${path}/${childPath}`.replace("//", "/"), child);
    }
  }
  _addNode(initialPath, initialNode);
  return table;
}

function isPlainObject$4(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject$4(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject$4(value) && isPlainObject$4(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();
const defuFn = createDefu((object, key, currentValue) => {
  if (object[key] !== void 0 && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});

function o(n){throw new Error(`${n} is not implemented yet!`)}let i$1 = class i extends EventEmitter$a{__unenv__={};readableEncoding=null;readableEnded=true;readableFlowing=false;readableHighWaterMark=0;readableLength=0;readableObjectMode=false;readableAborted=false;readableDidRead=false;closed=false;errored=null;readable=false;destroyed=false;static from(e,t){return new i(t)}constructor(e){super();}_read(e){}read(e){}setEncoding(e){return this}pause(){return this}resume(){return this}isPaused(){return  true}unpipe(e){return this}unshift(e,t){}wrap(e){return this}push(e,t){return  false}_destroy(e,t){this.removeAllListeners();}destroy(e){return this.destroyed=true,this._destroy(e),this}pipe(e,t){return {}}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return this.destroy(),Promise.resolve()}async*[Symbol.asyncIterator](){throw o("Readable.asyncIterator")}iterator(e){throw o("Readable.iterator")}map(e,t){throw o("Readable.map")}filter(e,t){throw o("Readable.filter")}forEach(e,t){throw o("Readable.forEach")}reduce(e,t,r){throw o("Readable.reduce")}find(e,t){throw o("Readable.find")}findIndex(e,t){throw o("Readable.findIndex")}some(e,t){throw o("Readable.some")}toArray(e){throw o("Readable.toArray")}every(e,t){throw o("Readable.every")}flatMap(e,t){throw o("Readable.flatMap")}drop(e,t){throw o("Readable.drop")}take(e,t){throw o("Readable.take")}asIndexedPairs(e){throw o("Readable.asIndexedPairs")}};let l$1 = class l extends EventEmitter$a{__unenv__={};writable=true;writableEnded=false;writableFinished=false;writableHighWaterMark=0;writableLength=0;writableObjectMode=false;writableCorked=0;closed=false;errored=null;writableNeedDrain=false;writableAborted=false;destroyed=false;_data;_encoding="utf8";constructor(e){super();}pipe(e,t){return {}}_write(e,t,r){if(this.writableEnded){r&&r();return}if(this._data===void 0)this._data=e;else {const s=typeof this._data=="string"?Buffer$1.from(this._data,this._encoding||t||"utf8"):this._data,a=typeof e=="string"?Buffer$1.from(e,t||this._encoding||"utf8"):e;this._data=Buffer$1.concat([s,a]);}this._encoding=t,r&&r();}_writev(e,t){}_destroy(e,t){}_final(e){}write(e,t,r){const s=typeof t=="string"?this._encoding:"utf8",a=typeof t=="function"?t:typeof r=="function"?r:void 0;return this._write(e,s,a),true}setDefaultEncoding(e){return this}end(e,t,r){const s=typeof e=="function"?e:typeof t=="function"?t:typeof r=="function"?r:void 0;if(this.writableEnded)return s&&s(),this;const a=e===s?void 0:e;if(a){const u=t===s?void 0:t;this.write(a,u,s);}return this.writableEnded=true,this.writableFinished=true,this.emit("close"),this.emit("finish"),this}cork(){}uncork(){}destroy(e){return this.destroyed=true,delete this._data,this.removeAllListeners(),this}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return Promise.resolve()}};const c$1=class c{allowHalfOpen=true;_destroy;constructor(e=new i$1,t=new l$1){Object.assign(this,e),Object.assign(this,t),this._destroy=m(e._destroy,t._destroy);}};function _(){return Object.assign(c$1.prototype,i$1.prototype),Object.assign(c$1.prototype,l$1.prototype),c$1}function m(...n){return function(...e){for(const t of n)t(...e);}}const g=_();class A extends g{__unenv__={};bufferSize=0;bytesRead=0;bytesWritten=0;connecting=false;destroyed=false;pending=false;localAddress="";localPort=0;remoteAddress="";remoteFamily="";remotePort=0;autoSelectFamilyAttemptedAddresses=[];readyState="readOnly";constructor(e){super();}write(e,t,r){return  false}connect(e,t,r){return this}end(e,t,r){return this}setEncoding(e){return this}pause(){return this}resume(){return this}setTimeout(e,t){return this}setNoDelay(e){return this}setKeepAlive(e,t){return this}address(){return {}}unref(){return this}ref(){return this}destroySoon(){this.destroy();}resetAndDestroy(){const e=new Error("ERR_SOCKET_CLOSED");return e.code="ERR_SOCKET_CLOSED",this.destroy(e),this}}class y extends i$1{aborted=false;httpVersion="1.1";httpVersionMajor=1;httpVersionMinor=1;complete=true;connection;socket;headers={};trailers={};method="GET";url="/";statusCode=200;statusMessage="";closed=false;errored=null;readable=false;constructor(e){super(),this.socket=this.connection=e||new A;}get rawHeaders(){const e=this.headers,t=[];for(const r in e)if(Array.isArray(e[r]))for(const s of e[r])t.push(r,s);else t.push(r,e[r]);return t}get rawTrailers(){return []}setTimeout(e,t){return this}get headersDistinct(){return p(this.headers)}get trailersDistinct(){return p(this.trailers)}}function p(n){const e={};for(const[t,r]of Object.entries(n))t&&(e[t]=(Array.isArray(r)?r:[r]).filter(Boolean));return e}class w extends l$1{statusCode=200;statusMessage="";upgrading=false;chunkedEncoding=false;shouldKeepAlive=false;useChunkedEncodingByDefault=false;sendDate=false;finished=false;headersSent=false;strictContentLength=false;connection=null;socket=null;req;_headers={};constructor(e){super(),this.req=e;}assignSocket(e){e._httpMessage=this,this.socket=e,this.connection=e,this.emit("socket",e),this._flush();}_flush(){this.flushHeaders();}detachSocket(e){}writeContinue(e){}writeHead(e,t,r){e&&(this.statusCode=e),typeof t=="string"&&(this.statusMessage=t,t=void 0);const s=r||t;if(s&&!Array.isArray(s))for(const a in s)this.setHeader(a,s[a]);return this.headersSent=true,this}writeProcessing(){}setTimeout(e,t){return this}appendHeader(e,t){e=e.toLowerCase();const r=this._headers[e],s=[...Array.isArray(r)?r:[r],...Array.isArray(t)?t:[t]].filter(Boolean);return this._headers[e]=s.length>1?s:s[0],this}setHeader(e,t){return this._headers[e.toLowerCase()]=t,this}setHeaders(e){for(const[t,r]of Object.entries(e))this.setHeader(t,r);return this}getHeader(e){return this._headers[e.toLowerCase()]}getHeaders(){return this._headers}getHeaderNames(){return Object.keys(this._headers)}hasHeader(e){return e.toLowerCase()in this._headers}removeHeader(e){delete this._headers[e.toLowerCase()];}addTrailers(e){}flushHeaders(){}writeEarlyHints(e,t){typeof t=="function"&&t();}}const E=(()=>{const n=function(){};return n.prototype=Object.create(null),n})();function R(n={}){const e=new E,t=Array.isArray(n)||H(n)?n:Object.entries(n);for(const[r,s]of t)if(s){if(e[r]===void 0){e[r]=s;continue}e[r]=[...Array.isArray(e[r])?e[r]:[e[r]],...Array.isArray(s)?s:[s]];}return e}function H(n){return typeof n?.entries=="function"}function v(n={}){if(n instanceof Headers)return n;const e=new Headers;for(const[t,r]of Object.entries(n))if(r!==void 0){if(Array.isArray(r)){for(const s of r)e.append(t,String(s));continue}e.set(t,String(r));}return e}const S=new Set([101,204,205,304]);async function b(n,e){const t=new y,r=new w(t);t.url=e.url?.toString()||"/";let s;if(!t.url.startsWith("/")){const d=new URL(t.url);s=d.host,t.url=d.pathname+d.search+d.hash;}t.method=e.method||"GET",t.headers=R(e.headers||{}),t.headers.host||(t.headers.host=e.host||s||"localhost"),t.connection.encrypted=t.connection.encrypted||e.protocol==="https",t.body=e.body||null,t.__unenv__=e.context,await n(t,r);let a=r._data;(S.has(r.statusCode)||t.method.toUpperCase()==="HEAD")&&(a=null,delete r._headers["content-length"]);const u={status:r.statusCode,statusText:r.statusMessage,headers:r._headers,body:a};return t.destroy(),r.destroy(),u}async function C(n,e,t={}){try{const r=await b(n,{url:e,...t});return new Response(r.body,{status:r.status,statusText:r.statusText,headers:v(r.headers)})}catch(r){return new Response(r.toString(),{status:Number.parseInt(r.statusCode||r.code)||500,statusText:r.statusText})}}

function useBase(base, handler) {
  base = withoutTrailingSlash(base);
  if (!base || base === "/") {
    return handler;
  }
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _path = event._path || event.node.req.url || "/";
    event._path = withoutBase(event.path || "/", base);
    event.node.req.url = event._path;
    try {
      return await handler(event);
    } finally {
      event._path = event.node.req.url = _path;
    }
  });
}

function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

class H3Error extends Error {
  static __h3_error__ = true;
  statusCode = 500;
  fatal = false;
  unhandled = false;
  statusMessage;
  data;
  cause;
  constructor(message, opts = {}) {
    super(message, opts);
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
}
function createError$1(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function sendError$1(event, error, debug) {
  if (event.handled) {
    return;
  }
  const h3Error = isError(error) ? error : createError$1(error);
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  };
  if (debug) {
    responseBody.stack = (h3Error.stack || "").split("\n").map((l) => l.trim());
  }
  if (event.handled) {
    return;
  }
  const _code = Number.parseInt(h3Error.statusCode);
  setResponseStatus(event, _code, h3Error.statusMessage);
  event.node.res.setHeader("content-type", MIMES.json);
  event.node.res.end(JSON.stringify(responseBody, void 0, 2));
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}

function parse$8(multipartBodyBuffer, boundary) {
  let lastline = "";
  let state = 0 /* INIT */;
  let buffer = [];
  const allParts = [];
  let currentPartHeaders = [];
  for (let i = 0; i < multipartBodyBuffer.length; i++) {
    const prevByte = i > 0 ? multipartBodyBuffer[i - 1] : null;
    const currByte = multipartBodyBuffer[i];
    const newLineChar = currByte === 10 || currByte === 13;
    if (!newLineChar) {
      lastline += String.fromCodePoint(currByte);
    }
    const newLineDetected = currByte === 10 && prevByte === 13;
    if (0 /* INIT */ === state && newLineDetected) {
      if ("--" + boundary === lastline) {
        state = 1 /* READING_HEADERS */;
      }
      lastline = "";
    } else if (1 /* READING_HEADERS */ === state && newLineDetected) {
      if (lastline.length > 0) {
        const i2 = lastline.indexOf(":");
        if (i2 > 0) {
          const name = lastline.slice(0, i2).toLowerCase();
          const value = lastline.slice(i2 + 1).trim();
          currentPartHeaders.push([name, value]);
        }
      } else {
        state = 2 /* READING_DATA */;
        buffer = [];
      }
      lastline = "";
    } else if (2 /* READING_DATA */ === state) {
      if (lastline.length > boundary.length + 4) {
        lastline = "";
      }
      if ("--" + boundary === lastline) {
        const j = buffer.length - lastline.length;
        const part = buffer.slice(0, j - 1);
        allParts.push(process$1(part, currentPartHeaders));
        buffer = [];
        currentPartHeaders = [];
        lastline = "";
        state = 3 /* READING_PART_SEPARATOR */;
      } else {
        buffer.push(currByte);
      }
      if (newLineDetected) {
        lastline = "";
      }
    } else if (3 /* READING_PART_SEPARATOR */ === state && newLineDetected) {
      state = 1 /* READING_HEADERS */;
    }
  }
  return allParts;
}
function process$1(data, headers) {
  const dataObj = {};
  const contentDispositionHeader = headers.find((h) => h[0] === "content-disposition")?.[1] || "";
  for (const i of contentDispositionHeader.split(";")) {
    const s = i.split("=");
    if (s.length !== 2) {
      continue;
    }
    const key = (s[0] || "").trim();
    if (key === "name" || key === "filename") {
      const _value = (s[1] || "").trim().replace(/"/g, "");
      dataObj[key] = Buffer.from(_value, "latin1").toString("utf8");
    }
  }
  const contentType = headers.find((h) => h[0] === "content-type")?.[1] || "";
  if (contentType) {
    dataObj.type = contentType;
  }
  dataObj.data = Buffer.from(data);
  return dataObj;
}

function getQuery(event) {
  return getQuery$1(event.path || "");
}
function getRouterParams(event, opts = {}) {
  let params = event.context.params || {};
  if (opts.decode) {
    params = { ...params };
    for (const key in params) {
      params[key] = decode$1(params[key]);
    }
  }
  return params;
}
function getRouterParam(event, name, opts = {}) {
  const params = getRouterParams(event, opts);
  return params[name];
}
function isMethod(event, expected, allowHead) {
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected)) {
    throw createError$1({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}
function getRequestHeader(event, name) {
  const headers = getRequestHeaders(event);
  const value = headers[name.toLowerCase()];
  return value;
}
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const _header = event.node.req.headers["x-forwarded-host"];
    const xForwardedHost = (_header || "").split(",").shift()?.trim();
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}

const RawBodySymbol = Symbol.for("h3RawBody");
const ParsedBodySymbol = Symbol.for("h3ParsedBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      if (_resolved instanceof FormData) {
        return new Response(_resolved).bytes().then((uint8arr) => Buffer.from(uint8arr));
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !String(event.node.req.headers["transfer-encoding"] ?? "").split(",").map((e) => e.trim()).filter(Boolean).includes("chunked")) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
async function readBody(event, options = {}) {
  const request = event.node.req;
  if (hasProp(request, ParsedBodySymbol)) {
    return request[ParsedBodySymbol];
  }
  const contentType = request.headers["content-type"] || "";
  const body = await readRawBody(event);
  let parsed;
  if (contentType === "application/json") {
    parsed = _parseJSON(body, options.strict ?? true);
  } else if (contentType.startsWith("application/x-www-form-urlencoded")) {
    parsed = _parseURLEncodedBody(body);
  } else if (contentType.startsWith("text/")) {
    parsed = body;
  } else {
    parsed = _parseJSON(body, options.strict ?? false);
  }
  request[ParsedBodySymbol] = parsed;
  return parsed;
}
async function readMultipartFormData(event) {
  const contentType = getRequestHeader(event, "content-type");
  if (!contentType || !contentType.startsWith("multipart/form-data")) {
    return;
  }
  const boundary = contentType.match(/boundary=([^;]*)(;|$)/i)?.[1];
  if (!boundary) {
    return;
  }
  const body = await readRawBody(event, false);
  if (!body) {
    return;
  }
  return parse$8(body, boundary);
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}
function _parseJSON(body = "", strict) {
  if (!body) {
    return void 0;
  }
  try {
    return destr(body, { strict });
  } catch {
    throw createError$1({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Invalid JSON body"
    });
  }
}
function _parseURLEncodedBody(body) {
  const form = new URLSearchParams(body);
  const parsedForm = /* @__PURE__ */ Object.create(null);
  for (const [key, value] of form.entries()) {
    if (hasProp(parsedForm, key)) {
      if (!Array.isArray(parsedForm[key])) {
        parsedForm[key] = [parsedForm[key]];
      }
      parsedForm[key].push(value);
    } else {
      parsedForm[key] = value;
    }
  }
  return parsedForm;
}

function handleCacheHeaders(event, opts) {
  const cacheControls = ["public", ...opts.cacheControls || []];
  let cacheMatched = false;
  if (opts.maxAge !== void 0) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`);
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime);
    const ifModifiedSince = event.node.req.headers["if-modified-since"];
    event.node.res.setHeader("last-modified", modifiedTime.toUTCString());
    if (ifModifiedSince && new Date(ifModifiedSince) >= modifiedTime) {
      cacheMatched = true;
    }
  }
  if (opts.etag) {
    event.node.res.setHeader("etag", opts.etag);
    const ifNonMatch = event.node.req.headers["if-none-match"];
    if (ifNonMatch === opts.etag) {
      cacheMatched = true;
    }
  }
  event.node.res.setHeader("cache-control", cacheControls.join(", "));
  if (cacheMatched) {
    event.node.res.statusCode = 304;
    if (!event.handled) {
      event.node.res.end();
    }
    return true;
  }
  return false;
}

const MIMES = {
  html: "text/html",
  json: "application/json"
};

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}

function getDistinctCookieKey(name, opts) {
  return [name, opts.domain || "", opts.path || "/"].join(";");
}

function parseCookies(event) {
  return parse$9(event.node.req.headers.cookie || "");
}
function getCookie(event, name) {
  return parseCookies(event)[name];
}
function setCookie(event, name, value, serializeOptions = {}) {
  if (!serializeOptions.path) {
    serializeOptions = { path: "/", ...serializeOptions };
  }
  const newCookie = serialize$5(name, value, serializeOptions);
  const currentCookies = splitCookiesString(
    event.node.res.getHeader("set-cookie")
  );
  if (currentCookies.length === 0) {
    event.node.res.setHeader("set-cookie", newCookie);
    return;
  }
  const newCookieKey = getDistinctCookieKey(name, serializeOptions);
  event.node.res.removeHeader("set-cookie");
  for (const cookie of currentCookies) {
    const parsed = parseSetCookie(cookie);
    const key = getDistinctCookieKey(parsed.name, parsed);
    if (key === newCookieKey) {
      continue;
    }
    event.node.res.appendHeader("set-cookie", cookie);
  }
  event.node.res.appendHeader("set-cookie", newCookie);
}
function deleteCookie(event, name, serializeOptions) {
  setCookie(event, name, "", {
    ...serializeOptions,
    maxAge: 0
  });
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}

const defer$1 = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer$1(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function sendNoContent(event, code) {
  if (event.handled) {
    return;
  }
  if (!code && event.node.res.statusCode !== 200) {
    code = event.node.res.statusCode;
  }
  const _code = sanitizeStatusCode(code, 204);
  if (_code === 204) {
    event.node.res.removeHeader("content-length");
  }
  event.node.res.writeHead(_code);
  event.node.res.end();
}
function setResponseStatus(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    );
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage(text);
  }
}
function getResponseStatus(event) {
  return event.node.res.statusCode;
}
function getResponseStatusText(event) {
  return event.node.res.statusMessage;
}
function defaultContentType(event, type) {
  if (type && event.node.res.statusCode !== 304 && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function sendRedirect(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode(
    code,
    event.node.res.statusCode
  );
  event.node.res.setHeader("location", location);
  const encodedLoc = location.replace(/"/g, "%22");
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`;
  return send(event, html, MIMES.html);
}
function getResponseHeader(event, name) {
  return event.node.res.getHeader(name);
}
function setResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(
      name,
      value
    );
  }
}
const setHeaders = setResponseHeaders;
function setResponseHeader(event, name, value) {
  event.node.res.setHeader(name, value);
}
function appendResponseHeader(event, name, value) {
  let current = event.node.res.getHeader(name);
  if (!current) {
    event.node.res.setHeader(name, value);
    return;
  }
  if (!Array.isArray(current)) {
    current = [current.toString()];
  }
  event.node.res.setHeader(name, [...current, value]);
}
function isStream(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  if (typeof data.pipe === "function") {
    if (typeof data._read === "function") {
      return true;
    }
    if (typeof data.abort === "function") {
      return true;
    }
  }
  if (typeof data.pipeTo === "function") {
    return true;
  }
  return false;
}
function isWebResponse(data) {
  return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}

const PayloadMethods = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
const ignoredHeaders = /* @__PURE__ */ new Set([
  "transfer-encoding",
  "accept-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "expect",
  "host",
  "accept"
]);
async function proxyRequest(event, target, opts = {}) {
  let body;
  let duplex;
  if (PayloadMethods.has(event.method)) {
    if (opts.streamRequest) {
      body = getRequestWebStream(event);
      duplex = "half";
    } else {
      body = await readRawBody(event, false).catch(() => void 0);
    }
  }
  const method = opts.fetchOptions?.method || event.method;
  const fetchHeaders = mergeHeaders$1(
    getProxyRequestHeaders(event, { host: target.startsWith("/") }),
    opts.fetchOptions?.headers,
    opts.headers
  );
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      method,
      body,
      duplex,
      ...opts.fetchOptions,
      headers: fetchHeaders
    }
  });
}
async function sendProxy(event, target, opts = {}) {
  let response;
  try {
    response = await _getFetch(opts.fetch)(target, {
      headers: opts.headers,
      ignoreResponseError: true,
      // make $ofetch.raw transparent
      ...opts.fetchOptions
    });
  } catch (error) {
    throw createError$1({
      status: 502,
      statusMessage: "Bad Gateway",
      cause: error
    });
  }
  event.node.res.statusCode = sanitizeStatusCode(
    response.status,
    event.node.res.statusCode
  );
  event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  const cookies = [];
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-encoding") {
      continue;
    }
    if (key === "content-length") {
      continue;
    }
    if (key === "set-cookie") {
      cookies.push(...splitCookiesString(value));
      continue;
    }
    event.node.res.setHeader(key, value);
  }
  if (cookies.length > 0) {
    event.node.res.setHeader(
      "set-cookie",
      cookies.map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            "domain"
          );
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            "path"
          );
        }
        return cookie;
      })
    );
  }
  if (opts.onResponse) {
    await opts.onResponse(event, response);
  }
  if (response._data !== void 0) {
    return response._data;
  }
  if (event.handled) {
    return;
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer());
    return event.node.res.end(data);
  }
  if (response.body) {
    for await (const chunk of response.body) {
      event.node.res.write(chunk);
    }
  }
  return event.node.res.end();
}
function getProxyRequestHeaders(event, opts) {
  const headers = /* @__PURE__ */ Object.create(null);
  const reqHeaders = getRequestHeaders(event);
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name) || name === "host" && opts?.host) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}
function fetchWithEvent(event, req, init, options) {
  return _getFetch(options?.fetch)(req, {
    ...init,
    context: init?.context || event.context,
    headers: {
      ...getProxyRequestHeaders(event, {
        host: typeof req === "string" && req.startsWith("/")
      }),
      ...init?.headers
    }
  });
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch;
  }
  if (globalThis.fetch) {
    return globalThis.fetch;
  }
  throw new Error(
    "fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js."
  );
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === "string" ? { "*": map } : map;
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, "gi"),
    (match, prefix, previousValue) => {
      let newValue;
      if (previousValue in _map) {
        newValue = _map[previousValue];
      } else if ("*" in _map) {
        newValue = _map["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}
function mergeHeaders$1(defaults, ...inputs) {
  const _inputs = inputs.filter(Boolean);
  if (_inputs.length === 0) {
    return defaults;
  }
  const merged = new Headers(defaults);
  for (const input of _inputs) {
    const entries = Array.isArray(input) ? input : typeof input.entries === "function" ? input.entries() : Object.entries(input);
    for (const [key, value] of entries) {
      if (value !== void 0) {
        merged.set(key, value);
      }
    }
  }
  return merged;
}

class H3Event {
  "__is_event__" = true;
  // Context
  node;
  // Node
  web;
  // Web
  context = {};
  // Shared
  // Request
  _method;
  _path;
  _headers;
  _requestBody;
  // Response
  _handled = false;
  // Hooks
  _onBeforeResponseCalled;
  _onAfterResponseCalled;
  constructor(req, res) {
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function isEvent(input) {
  return hasProp(input, "__is_event__");
}
function createEvent(req, res) {
  return new H3Event(req, res);
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventHandler = defineEventHandler;
function isEventHandler(input) {
  return hasProp(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
  if (!isEventHandler(input)) {
    console.warn(
      "[h3] Implicit event handler conversion is deprecated. Use `eventHandler()` or `fromNodeMiddleware()` to define event handlers.",
      _route && _route !== "/" ? `
     Route: ${_route}` : "",
      `
     Handler: ${input}`
    );
  }
  return input;
}
function defineLazyEventHandler(factory) {
  let _promise;
  let _resolved;
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved);
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r) => {
        const handler2 = r.default || r;
        if (typeof handler2 !== "function") {
          throw new TypeError(
            "Invalid lazy handler result. It should be a function:",
            handler2
          );
        }
        _resolved = { handler: toEventHandler(r.default || r) };
        return _resolved;
      });
    }
    return _promise;
  };
  const handler = eventHandler((event) => {
    if (_resolved) {
      return _resolved.handler(event);
    }
    return resolveHandler().then((r) => r.handler(event));
  });
  handler.__resolve__ = resolveHandler;
  return handler;
}
const lazyEventHandler = defineLazyEventHandler;

function createApp(options = {}) {
  const stack = [];
  const handler = createAppEventHandler(stack, options);
  const resolve = createResolver(stack);
  handler.__resolve__ = resolve;
  const getWebsocket = cachedFn(() => websocketOptions(resolve, options));
  const app = {
    // @ts-expect-error
    use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
    resolve,
    handler,
    stack,
    options,
    get websocket() {
      return getWebsocket();
    }
  };
  return app;
}
function use(app, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app, i, arg2, arg3);
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app, arg1, i, arg3);
    }
  } else if (typeof arg1 === "string") {
    app.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    );
  } else if (typeof arg1 === "function") {
    app.stack.push(normalizeLayer({ ...arg2, handler: arg1 }));
  } else {
    app.stack.push(normalizeLayer({ ...arg1 }));
  }
  return app;
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : void 0;
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _reqPath = event._path || event.node.req.url || "/";
    let _layerPath;
    if (options.onRequest) {
      await options.onRequest(event);
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue;
        }
        _layerPath = _reqPath.slice(layer.route.length) || "/";
      } else {
        _layerPath = _reqPath;
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue;
      }
      event._path = _layerPath;
      event.node.req.url = _layerPath;
      const val = await layer.handler(event);
      const _body = val === void 0 ? void 0 : await val;
      if (_body !== void 0) {
        const _response = { body: _body };
        if (options.onBeforeResponse) {
          event._onBeforeResponseCalled = true;
          await options.onBeforeResponse(event, _response);
        }
        await handleHandlerResponse(event, _response.body, spacing);
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, _response);
        }
        return;
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, void 0);
        }
        return;
      }
    }
    if (!event.handled) {
      throw createError$1({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || "/"}.`
      });
    }
    if (options.onAfterResponse) {
      event._onAfterResponseCalled = true;
      await options.onAfterResponse(event, void 0);
    }
  });
}
function createResolver(stack) {
  return async (path) => {
    let _layerPath;
    for (const layer of stack) {
      if (layer.route === "/" && !layer.handler.__resolve__) {
        continue;
      }
      if (!path.startsWith(layer.route)) {
        continue;
      }
      _layerPath = path.slice(layer.route.length) || "/";
      if (layer.match && !layer.match(_layerPath, void 0)) {
        continue;
      }
      let res = { route: layer.route, handler: layer.handler };
      if (res.handler.__resolve__) {
        const _res = await res.handler.__resolve__(_layerPath);
        if (!_res) {
          continue;
        }
        res = {
          ...res,
          ..._res,
          route: joinURL(res.route || "/", _res.route || "/")
        };
      }
      return res;
    }
  };
}
function normalizeLayer(input) {
  let handler = input.handler;
  if (handler.handler) {
    handler = handler.handler;
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler);
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, void 0, input.route);
  }
  return {
    route: withoutTrailingSlash(input.route),
    match: input.match,
    handler
  };
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event);
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse(event, val);
    }
    if (isStream(val)) {
      return sendStream(event, val);
    }
    if (val.buffer) {
      return send(event, val);
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === "function") {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send(event, Buffer.from(arrayBuffer), val.type);
      });
    }
    if (val instanceof Error) {
      throw createError$1(val);
    }
    if (typeof val.end === "function") {
      return true;
    }
  }
  const valType = typeof val;
  if (valType === "string") {
    return send(event, val, MIMES.html);
  }
  if (valType === "object" || valType === "boolean" || valType === "number") {
    return send(event, JSON.stringify(val, void 0, jsonSpace), MIMES.json);
  }
  if (valType === "bigint") {
    return send(event, val.toString(), MIMES.json);
  }
  throw createError$1({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  });
}
function cachedFn(fn) {
  let cache;
  return () => {
    if (!cache) {
      cache = fn();
    }
    return cache;
  };
}
function websocketOptions(evResolver, appOptions) {
  return {
    ...appOptions.websocket,
    async resolve(info) {
      const url = info.request?.url || info.url || "/";
      const { pathname } = typeof url === "string" ? parseURL(url) : url;
      const resolved = await evResolver(pathname);
      return resolved?.handler?.__websocket__ || {};
    }
  };
}

const RouterMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
function createRouter(opts = {}) {
  const _router = createRouter$1({});
  const routes = {};
  let _matcher;
  const router = {};
  const addRoute = (path, handler, method) => {
    let route = routes[path];
    if (!route) {
      routes[path] = route = { path, handlers: {} };
      _router.insert(path, route);
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m);
      }
    } else {
      route.handlers[method] = toEventHandler(handler, void 0, path);
    }
    return router;
  };
  router.use = router.add = (path, handler, method) => addRoute(path, handler, method || "all");
  for (const method of RouterMethods) {
    router[method] = (path, handle) => router.add(path, handle, method);
  }
  const matchHandler = (path = "/", method = "get") => {
    const qIndex = path.indexOf("?");
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex));
    }
    const matched = _router.lookup(path);
    if (!matched || !matched.handlers) {
      return {
        error: createError$1({
          statusCode: 404,
          name: "Not Found",
          statusMessage: `Cannot find any route matching ${path || "/"}.`
        })
      };
    }
    let handler = matched.handlers[method] || matched.handlers.all;
    if (!handler) {
      if (!_matcher) {
        _matcher = toRouteMatcher(_router);
      }
      const _matches = _matcher.matchAll(path).reverse();
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method];
          matched.handlers[method] = matched.handlers[method] || handler;
          break;
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all;
          matched.handlers.all = matched.handlers.all || handler;
          break;
        }
      }
    }
    if (!handler) {
      return {
        error: createError$1({
          statusCode: 405,
          name: "Method Not Allowed",
          statusMessage: `Method ${method} is not allowed on this route.`
        })
      };
    }
    return { matched, handler };
  };
  const isPreemptive = opts.preemptive || opts.preemtive;
  router.handler = eventHandler((event) => {
    const match = matchHandler(
      event.path,
      event.method.toLowerCase()
    );
    if ("error" in match) {
      if (isPreemptive) {
        throw match.error;
      } else {
        return;
      }
    }
    event.context.matchedRoute = match.matched;
    const params = match.matched.params || {};
    event.context.params = params;
    return Promise.resolve(match.handler(event)).then((res) => {
      if (res === void 0 && isPreemptive) {
        return null;
      }
      return res;
    });
  });
  router.handler.__resolve__ = async (path) => {
    path = withLeadingSlash(path);
    const match = matchHandler(path);
    if ("error" in match) {
      return;
    }
    let res = {
      route: match.matched.path,
      handler: match.handler
    };
    if (match.handler.__resolve__) {
      const _res = await match.handler.__resolve__(path);
      if (!_res) {
        return;
      }
      res = { ...res, ..._res };
    }
    return res;
  };
  return router;
}
function toNodeListener(app) {
  const toNodeHandle = async function(req, res) {
    const event = createEvent(req, res);
    try {
      await app.handler(event);
    } catch (_error) {
      const error = createError$1(_error);
      if (!isError(_error)) {
        error.unhandled = true;
      }
      setResponseStatus(event, error.statusCode, error.statusMessage);
      if (app.options.onError) {
        await app.options.onError(error, event);
      }
      if (event.handled) {
        return;
      }
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      if (app.options.onBeforeResponse && !event._onBeforeResponseCalled) {
        await app.options.onBeforeResponse(event, { body: error });
      }
      await sendError$1(event, error, !!app.options.debug);
      if (app.options.onAfterResponse && !event._onAfterResponseCalled) {
        await app.options.onAfterResponse(event, { body: error });
      }
    }
  };
  return toNodeHandle;
}

function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
const defaultTask = { run: (function_) => function_() };
const _createTask = () => defaultTask;
const createTask = typeof console.createTask !== "undefined" ? console.createTask : _createTask;
function serialTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return hooks.reduce(
    (promise, hookFunction) => promise.then(() => task.run(() => hookFunction(...args))),
    Promise.resolve()
  );
}
function parallelTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
}
function callEachWith(callbacks, arg0) {
  for (const callback of [...callbacks]) {
    callback(arg0);
  }
}

class Hookable {
  constructor() {
    this._hooks = {};
    this._before = void 0;
    this._after = void 0;
    this._deprecatedMessages = void 0;
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, function_, options = {}) {
    if (!name || typeof function_ !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let dep;
    while (this._deprecatedHooks[name]) {
      dep = this._deprecatedHooks[name];
      name = dep.to;
    }
    if (dep && !options.allowDeprecated) {
      let message = dep.message;
      if (!message) {
        message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
      }
      if (!this._deprecatedMessages) {
        this._deprecatedMessages = /* @__PURE__ */ new Set();
      }
      if (!this._deprecatedMessages.has(message)) {
        console.warn(message);
        this._deprecatedMessages.add(message);
      }
    }
    if (!function_.name) {
      try {
        Object.defineProperty(function_, "name", {
          get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
          configurable: true
        });
      } catch {
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(function_);
    return () => {
      if (function_) {
        this.removeHook(name, function_);
        function_ = void 0;
      }
    };
  }
  hookOnce(name, function_) {
    let _unreg;
    let _function = (...arguments_) => {
      if (typeof _unreg === "function") {
        _unreg();
      }
      _unreg = void 0;
      _function = void 0;
      return function_(...arguments_);
    };
    _unreg = this.hook(name, _function);
    return _unreg;
  }
  removeHook(name, function_) {
    if (this._hooks[name]) {
      const index = this._hooks[name].indexOf(function_);
      if (index !== -1) {
        this._hooks[name].splice(index, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
    const _hooks = this._hooks[name] || [];
    delete this._hooks[name];
    for (const hook of _hooks) {
      this.hook(name, hook);
    }
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
    for (const name in deprecatedHooks) {
      this.deprecateHook(name, deprecatedHooks[name]);
    }
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map(
      (key) => this.hook(key, hooks[key])
    );
    return () => {
      for (const unreg of removeFns.splice(0, removeFns.length)) {
        unreg();
      }
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  removeAllHooks() {
    for (const key in this._hooks) {
      delete this._hooks[key];
    }
  }
  callHook(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(serialTaskCaller, name, ...arguments_);
  }
  callHookParallel(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(parallelTaskCaller, name, ...arguments_);
  }
  callHookWith(caller, name, ...arguments_) {
    const event = this._before || this._after ? { name, args: arguments_, context: {} } : void 0;
    if (this._before) {
      callEachWith(this._before, event);
    }
    const result = caller(
      name in this._hooks ? [...this._hooks[name]] : [],
      arguments_
    );
    if (result instanceof Promise) {
      return result.finally(() => {
        if (this._after && event) {
          callEachWith(this._after, event);
        }
      });
    }
    if (this._after && event) {
      callEachWith(this._after, event);
    }
    return result;
  }
  beforeEach(function_) {
    this._before = this._before || [];
    this._before.push(function_);
    return () => {
      if (this._before !== void 0) {
        const index = this._before.indexOf(function_);
        if (index !== -1) {
          this._before.splice(index, 1);
        }
      }
    };
  }
  afterEach(function_) {
    this._after = this._after || [];
    this._after.push(function_);
    return () => {
      if (this._after !== void 0) {
        const index = this._after.indexOf(function_);
        if (index !== -1) {
          this._after.splice(index, 1);
        }
      }
    };
  }
}
function createHooks() {
  return new Hookable();
}

const s$1=globalThis.Headers,i=globalThis.AbortController,l=globalThis.fetch||(()=>{throw new Error("[node-fetch-native] Failed to fetch: `globalThis.fetch` is not available!")});

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  if (value instanceof FormData || value instanceof URLSearchParams) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (contentType === "text/event-stream") {
    return "stream";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input);
  }
  const headers = new Headers(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers
      ),
      response: void 0,
      error: void 0
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
      if (!(context.options.headers instanceof Headers)) {
        context.options.headers = new Headers(
          context.options.headers || {}
          /* compat */
        );
      }
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        const contentType = context.options.headers.get("content-type");
        if (typeof context.options.body !== "string") {
          context.options.body = contentType === "application/x-www-form-urlencoded" ? new URLSearchParams(
            context.options.body
          ).toString() : JSON.stringify(context.options.body);
        }
        if (!contentType) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || "false");
  if (!useKeepAlive) {
    return l;
  }
  const agentOptions = { keepAlive: true };
  const httpAgent = new http.Agent(agentOptions);
  const httpsAgent = new https.Agent(agentOptions);
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
    }
  };
  return function nodeFetchWithKeepAlive(input, init) {
    return l(input, { ...nodeFetchOptions, ...init });
  };
}
const fetch = globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch();
const Headers$1 = globalThis.Headers || s$1;
const AbortController = globalThis.AbortController || i;
createFetch({ fetch, Headers: Headers$1, AbortController });

function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}

const storageKeyProperties = [
  "has",
  "hasItem",
  "get",
  "getItem",
  "getItemRaw",
  "set",
  "setItem",
  "setItemRaw",
  "del",
  "remove",
  "removeItem",
  "getMeta",
  "setMeta",
  "removeMeta",
  "getKeys",
  "clear",
  "mount",
  "unmount"
];
function prefixStorage(storage, base) {
  base = normalizeBaseKey(base);
  if (!base) {
    return storage;
  }
  const nsStorage = { ...storage };
  for (const property of storageKeyProperties) {
    nsStorage[property] = (key = "", ...args) => (
      // @ts-ignore
      storage[property](base + key, ...args)
    );
  }
  nsStorage.getKeys = (key = "", ...arguments_) => storage.getKeys(base + key, ...arguments_).then((keys) => keys.map((key2) => key2.slice(base.length)));
  nsStorage.keys = nsStorage.getKeys;
  nsStorage.getItems = async (items, commonOptions) => {
    const prefixedItems = items.map(
      (item) => typeof item === "string" ? base + item : { ...item, key: base + item.key }
    );
    const results = await storage.getItems(prefixedItems, commonOptions);
    return results.map((entry) => ({
      key: entry.key.slice(base.length),
      value: entry.value
    }));
  };
  nsStorage.setItems = async (items, commonOptions) => {
    const prefixedItems = items.map((item) => ({
      key: base + item.key,
      value: item.value,
      options: item.options
    }));
    return storage.setItems(prefixedItems, commonOptions);
  };
  return nsStorage;
}
function normalizeKey$1(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey$1(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey$1(base);
  return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true;
  }
  let substrCount = 0;
  let index = key.indexOf(":");
  while (index > -1) {
    substrCount++;
    index = key.indexOf(":", index + 1);
  }
  return substrCount <= depth;
}
function filterKeyByBase(key, base) {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== "$";
  }
  return key[key.length - 1] !== "$";
}

function defineDriver$1(factory) {
  return factory;
}

const DRIVER_NAME$1 = "memory";
const memory = defineDriver$1(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME$1,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});

function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey$1(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey$1(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey$1(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base)
      );
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey$1(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey$1(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}

const _assets = {

};

const normalizeKey = function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
};

const assets = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

function defineDriver(factory) {
  return factory;
}
function createError(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, createError);
  }
  return err;
}
function createRequiredError(driver, name) {
  if (Array.isArray(name)) {
    return createError(
      driver,
      `Missing some of the required options ${name.map((n) => "`" + n + "`").join(", ")}`
    );
  }
  return createError(driver, `Missing required option \`${name}\`.`);
}

function ignoreNotfound(err) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}
function ignoreExists(err) {
  return err.code === "EEXIST" ? null : err;
}
async function writeFile$2(path, data, encoding) {
  await ensuredir(dirname(path));
  return promises.writeFile(path, data, encoding);
}
function readFile$2(path, encoding) {
  return promises.readFile(path, encoding).catch(ignoreNotfound);
}
function unlink(path) {
  return promises.unlink(path).catch(ignoreNotfound);
}
function readdir$2(dir) {
  return promises.readdir(dir, { withFileTypes: true }).catch(ignoreNotfound).then((r) => r || []);
}
async function ensuredir(dir) {
  if (existsSync(dir)) {
    return;
  }
  await ensuredir(dirname(dir)).catch(ignoreExists);
  await promises.mkdir(dir).catch(ignoreExists);
}
async function readdirRecursive(dir, ignore, maxDepth) {
  if (ignore && ignore(dir)) {
    return [];
  }
  const entries = await readdir$2(dir);
  const files = [];
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve(dir, entry.name);
      if (entry.isDirectory()) {
        if (maxDepth === void 0 || maxDepth > 0) {
          const dirFiles = await readdirRecursive(
            entryPath,
            ignore,
            maxDepth === void 0 ? void 0 : maxDepth - 1
          );
          files.push(...dirFiles.map((f) => entry.name + "/" + f));
        }
      } else {
        if (!(ignore && ignore(entry.name))) {
          files.push(entry.name);
        }
      }
    })
  );
  return files;
}
async function rmRecursive(dir) {
  const entries = await readdir$2(dir);
  await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve(dir, entry.name);
      if (entry.isDirectory()) {
        return rmRecursive(entryPath).then(() => promises.rmdir(entryPath));
      } else {
        return promises.unlink(entryPath);
      }
    })
  );
}

const PATH_TRAVERSE_RE = /\.\.:|\.\.$/;
const DRIVER_NAME = "fs-lite";
const unstorage_47drivers_47fs_45lite = defineDriver((opts = {}) => {
  if (!opts.base) {
    throw createRequiredError(DRIVER_NAME, "base");
  }
  opts.base = resolve(opts.base);
  const r = (key) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError(
        DRIVER_NAME,
        `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`
      );
    }
    const resolved = join(opts.base, key.replace(/:/g, "/"));
    return resolved;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    flags: {
      maxDepth: true
    },
    hasItem(key) {
      return existsSync(r(key));
    },
    getItem(key) {
      return readFile$2(r(key), "utf8");
    },
    getItemRaw(key) {
      return readFile$2(r(key));
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await promises.stat(r(key)).catch(() => ({}));
      return { atime, mtime, size, birthtime, ctime };
    },
    setItem(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile$2(r(key), value, "utf8");
    },
    setItemRaw(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile$2(r(key), value);
    },
    removeItem(key) {
      if (opts.readOnly) {
        return;
      }
      return unlink(r(key));
    },
    getKeys(_base, topts) {
      return readdirRecursive(r("."), opts.ignore, topts?.maxDepth);
    },
    async clear() {
      if (opts.readOnly || opts.noClear) {
        return;
      }
      await rmRecursive(r("."));
    }
  };
});

const storage = createStorage({});

storage.mount('/assets', assets);

storage.mount('data', unstorage_47drivers_47fs_45lite({"driver":"fsLite","base":"./.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

function serialize$4(o){return typeof o=="string"?`'${o}'`:new c().serialize(o)}const c=/*@__PURE__*/function(){class o{#t=new Map;compare(t,r){const e=typeof t,n=typeof r;return e==="string"&&n==="string"?t.localeCompare(r):e==="number"&&n==="number"?t-r:String.prototype.localeCompare.call(this.serialize(t,true),this.serialize(r,true))}serialize(t,r){if(t===null)return "null";switch(typeof t){case "string":return r?t:`'${t}'`;case "bigint":return `${t}n`;case "object":return this.$object(t);case "function":return this.$function(t)}return String(t)}serializeObject(t){const r=Object.prototype.toString.call(t);if(r!=="[object Object]")return this.serializeBuiltInType(r.length<10?`unknown:${r}`:r.slice(8,-1),t);const e=t.constructor,n=e===Object||e===void 0?"":e.name;if(n!==""&&globalThis[n]===e)return this.serializeBuiltInType(n,t);if(typeof t.toJSON=="function"){const i=t.toJSON();return n+(i!==null&&typeof i=="object"?this.$object(i):`(${this.serialize(i)})`)}return this.serializeObjectEntries(n,Object.entries(t))}serializeBuiltInType(t,r){const e=this["$"+t];if(e)return e.call(this,r);if(typeof r?.entries=="function")return this.serializeObjectEntries(t,r.entries());throw new Error(`Cannot serialize ${t}`)}serializeObjectEntries(t,r){const e=Array.from(r).sort((i,a)=>this.compare(i[0],a[0]));let n=`${t}{`;for(let i=0;i<e.length;i++){const[a,l]=e[i];n+=`${this.serialize(a,true)}:${this.serialize(l)}`,i<e.length-1&&(n+=",");}return n+"}"}$object(t){let r=this.#t.get(t);return r===void 0&&(this.#t.set(t,`#${this.#t.size}`),r=this.serializeObject(t),this.#t.set(t,r)),r}$function(t){const r=Function.prototype.toString.call(t);return r.slice(-15)==="[native code] }"?`${t.name||""}()[native]`:`${t.name}(${t.length})${r.replace(/\s*\n\s*/g,"")}`}$Array(t){let r="[";for(let e=0;e<t.length;e++)r+=this.serialize(t[e]),e<t.length-1&&(r+=",");return r+"]"}$Date(t){try{return `Date(${t.toISOString()})`}catch{return "Date(null)"}}$ArrayBuffer(t){return `ArrayBuffer[${new Uint8Array(t).join(",")}]`}$Set(t){return `Set${this.$Array(Array.from(t).sort((r,e)=>this.compare(r,e)))}`}$Map(t){return this.serializeObjectEntries("Map",t.entries())}}for(const s of ["Error","RegExp","URL"])o.prototype["$"+s]=function(t){return `${s}(${t})`};for(const s of ["Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Uint16Array","Int32Array","Uint32Array","Float32Array","Float64Array"])o.prototype["$"+s]=function(t){return `${s}[${t.join(",")}]`};for(const s of ["BigInt64Array","BigUint64Array"])o.prototype["$"+s]=function(t){return `${s}[${t.join("n,")}${t.length>0?"n":""}]`};return o}();

const e=globalThis.process?.getBuiltinModule?.("crypto")?.hash,r="sha256",s="base64url";function digest(t){if(e)return e(r,t,s);const o=createHash(r).update(t);return globalThis.process?.versions?.webcontainer?o.digest().toString(s):o.digest(s)}

function hash$1(input) {
  return digest(serialize$4(input));
}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize$3(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize$3(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		if (x.constructor !== Object && typeof x.constructor === 'function') {
			tmp = new x.constructor();
			for (k in x) {
				if (x.hasOwnProperty(k) && tmp[k] !== x[k]) {
					tmp[k] = klona(x[k]);
				}
			}
		} else {
			tmp = {}; // null
			for (k in x) {
				if (k === '__proto__') {
					Object.defineProperty(tmp, k, {
						value: klona(x[k]),
						configurable: true,
						enumerable: true,
						writable: true,
					});
				} else {
					tmp[k] = klona(x[k]);
				}
			}
		}
		return tmp;
	}

	if (str === '[object Array]') {
		k = x.length;
		for (tmp=Array(k); k--;) {
			tmp[k] = klona(x[k]);
		}
		return tmp;
	}

	if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
		return tmp;
	}

	if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
		return tmp;
	}

	if (str === '[object Date]') {
		return new Date(+x);
	}

	if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
		tmp.lastIndex = x.lastIndex;
		return tmp;
	}

	if (str === '[object DataView]') {
		return new x.constructor( klona(x.buffer) );
	}

	if (str === '[object ArrayBuffer]') {
		return x.slice(0);
	}

	// ArrayBuffer.isView(x)
	// ~> `new` bcuz `Buffer.slice` => ref
	if (str.slice(-6) === 'Array]') {
		return new x.constructor(x);
	}

	return x;
}

const inlineAppConfig = {
  "nuxt": {},
  "ui": {
    "colors": {
      "primary": "green",
      "secondary": "blue",
      "success": "green",
      "info": "blue",
      "warning": "yellow",
      "error": "red",
      "neutral": "slate"
    },
    "icons": {
      "arrowLeft": "i-lucide-arrow-left",
      "arrowRight": "i-lucide-arrow-right",
      "check": "i-lucide-check",
      "chevronDoubleLeft": "i-lucide-chevrons-left",
      "chevronDoubleRight": "i-lucide-chevrons-right",
      "chevronDown": "i-lucide-chevron-down",
      "chevronLeft": "i-lucide-chevron-left",
      "chevronRight": "i-lucide-chevron-right",
      "chevronUp": "i-lucide-chevron-up",
      "close": "i-lucide-x",
      "ellipsis": "i-lucide-ellipsis",
      "external": "i-lucide-arrow-up-right",
      "file": "i-lucide-file",
      "folder": "i-lucide-folder",
      "folderOpen": "i-lucide-folder-open",
      "loading": "i-lucide-loader-circle",
      "minus": "i-lucide-minus",
      "plus": "i-lucide-plus",
      "search": "i-lucide-search",
      "upload": "i-lucide-upload"
    }
  },
  "icon": {
    "provider": "iconify",
    "class": "",
    "aliases": {},
    "iconifyApiEndpoint": "https://api.iconify.design",
    "localApiEndpoint": "/api/_nuxt_icon",
    "fallbackToApi": true,
    "cssSelectorPrefix": "i-",
    "cssWherePseudo": true,
    "cssLayer": "components",
    "mode": "css",
    "attrs": {
      "aria-hidden": true
    },
    "collections": [
      "academicons",
      "akar-icons",
      "ant-design",
      "arcticons",
      "basil",
      "bi",
      "bitcoin-icons",
      "bpmn",
      "brandico",
      "bx",
      "bxl",
      "bxs",
      "bytesize",
      "carbon",
      "catppuccin",
      "cbi",
      "charm",
      "ci",
      "cib",
      "cif",
      "cil",
      "circle-flags",
      "circum",
      "clarity",
      "codicon",
      "covid",
      "cryptocurrency",
      "cryptocurrency-color",
      "dashicons",
      "devicon",
      "devicon-plain",
      "ei",
      "el",
      "emojione",
      "emojione-monotone",
      "emojione-v1",
      "entypo",
      "entypo-social",
      "eos-icons",
      "ep",
      "et",
      "eva",
      "f7",
      "fa",
      "fa-brands",
      "fa-regular",
      "fa-solid",
      "fa6-brands",
      "fa6-regular",
      "fa6-solid",
      "fad",
      "fe",
      "feather",
      "file-icons",
      "flag",
      "flagpack",
      "flat-color-icons",
      "flat-ui",
      "flowbite",
      "fluent",
      "fluent-emoji",
      "fluent-emoji-flat",
      "fluent-emoji-high-contrast",
      "fluent-mdl2",
      "fontelico",
      "fontisto",
      "formkit",
      "foundation",
      "fxemoji",
      "gala",
      "game-icons",
      "geo",
      "gg",
      "gis",
      "gravity-ui",
      "gridicons",
      "grommet-icons",
      "guidance",
      "healthicons",
      "heroicons",
      "heroicons-outline",
      "heroicons-solid",
      "hugeicons",
      "humbleicons",
      "ic",
      "icomoon-free",
      "icon-park",
      "icon-park-outline",
      "icon-park-solid",
      "icon-park-twotone",
      "iconamoon",
      "iconoir",
      "icons8",
      "il",
      "ion",
      "iwwa",
      "jam",
      "la",
      "lets-icons",
      "line-md",
      "logos",
      "ls",
      "lucide",
      "lucide-lab",
      "mage",
      "majesticons",
      "maki",
      "map",
      "marketeq",
      "material-symbols",
      "material-symbols-light",
      "mdi",
      "mdi-light",
      "medical-icon",
      "memory",
      "meteocons",
      "mi",
      "mingcute",
      "mono-icons",
      "mynaui",
      "nimbus",
      "nonicons",
      "noto",
      "noto-v1",
      "octicon",
      "oi",
      "ooui",
      "openmoji",
      "oui",
      "pajamas",
      "pepicons",
      "pepicons-pencil",
      "pepicons-pop",
      "pepicons-print",
      "ph",
      "pixelarticons",
      "prime",
      "ps",
      "quill",
      "radix-icons",
      "raphael",
      "ri",
      "rivet-icons",
      "si-glyph",
      "simple-icons",
      "simple-line-icons",
      "skill-icons",
      "solar",
      "streamline",
      "streamline-emojis",
      "subway",
      "svg-spinners",
      "system-uicons",
      "tabler",
      "tdesign",
      "teenyicons",
      "token",
      "token-branded",
      "topcoat",
      "twemoji",
      "typcn",
      "uil",
      "uim",
      "uis",
      "uit",
      "uiw",
      "unjs",
      "vaadin",
      "vs",
      "vscode-icons",
      "websymbol",
      "weui",
      "whh",
      "wi",
      "wpf",
      "zmdi",
      "zondicons"
    ],
    "fetchTimeout": 1500
  }
};



const appConfig = defuFn(inlineAppConfig);

const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ["-", "_", "/", "."];
function isUppercase(char = "") {
  if (NUMBER_CHAR_RE.test(char)) {
    return void 0;
  }
  return char !== char.toLowerCase();
}
function splitByCase(str, separators) {
  const splitters = STR_SPLITTERS;
  const parts = [];
  if (!str || typeof str !== "string") {
    return parts;
  }
  let buff = "";
  let previousUpper;
  let previousSplitter;
  for (const char of str) {
    const isSplitter = splitters.includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = "";
      previousUpper = void 0;
      continue;
    }
    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1);
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }
  parts.push(buff);
  return parts;
}
function kebabCase(str, joiner) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => p.toLowerCase()).join(joiner) : "";
}
function snakeCase(str) {
  return kebabCase(str || "", "_");
}

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "989b81e0-fc2f-4daf-9d1a-970fa8239f98",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false,
        "isr": false
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      },
      "/_fonts/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_scripts/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      }
    }
  },
  "public": {
    "supabaseUrl": "https://whavxzbykisexeyeqnwj.supabase.co",
    "supabaseAnonKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoYXZ4emJ5a2lzZXhleWVxbndqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzOTI5NTcsImV4cCI6MjA3Nzk2ODk1N30.NPX0UYpGhLlkgv4HwpYMyl0mzONUJ6dP1csYM1nHdUI",
    "nuxt-scripts": {
      "version": "",
      "defaultScriptOptions": {
        "trigger": "onNuxtReady"
      }
    },
    "persistedState": {
      "storage": "localStorage",
      "debug": false,
      "cookieOptions": {}
    }
  },
  "databaseUrl": "postgresql://postgres:nlJTEAzLxMYEt7k3@db.whavxzbykisexeyeqnwj.supabase.co:5432/postgres",
  "jwtSecret": "your-super-secret-jwt-key-change-in-production",
  "supabaseUrl": "https://whavxzbykisexeyeqnwj.supabase.co",
  "supabaseAnonKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoYXZ4emJ5a2lzZXhleWVxbndqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzOTI5NTcsImV4cCI6MjA3Nzk2ODk1N30.NPX0UYpGhLlkgv4HwpYMyl0mzONUJ6dP1csYM1nHdUI",
  "supabaseServiceRoleKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoYXZ4emJ5a2lzZXhleWVxbndqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjM5Mjk1NywiZXhwIjoyMDc3OTY4OTU3fQ.jfApn50McOEsbKFSUXx-Gp5y2plOQgDBLEdcvdW2494",
  "icon": {
    "serverKnownCssClasses": []
  },
  "nuxt-scripts": {
    "version": "0.13.0"
  },
  "ipx": {
    "baseURL": "/_ipx",
    "alias": {},
    "fs": {
      "dir": "../../static"
    },
    "http": {
      "domains": []
    }
  }
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
const _sharedAppConfig = _deepFreeze(klona(appConfig));
function useAppConfig(event) {
  {
    return _sharedAppConfig;
  }
}
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());

getContext("nitro-app", {
  asyncContext: false,
  AsyncLocalStorage: void 0
});

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter$1({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function isJsonRequest(event) {
  if (hasReqHeader(event, "accept", "text/html")) {
    return false;
  }
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}

const errorHandler$0 = (async function errorhandler(error, event, { defaultHandler }) {
  if (event.handled || isJsonRequest(event)) {
    return;
  }
  const defaultRes = await defaultHandler(error, event, { json: true });
  const statusCode = error.statusCode || 500;
  if (statusCode === 404 && defaultRes.status === 302) {
    setResponseHeaders(event, defaultRes.headers);
    setResponseStatus(event, defaultRes.status, defaultRes.statusText);
    return send(event, JSON.stringify(defaultRes.body, null, 2));
  }
  const errorObject = defaultRes.body;
  const url = new URL(errorObject.url);
  errorObject.url = withoutBase(url.pathname, useRuntimeConfig(event).app.baseURL) + url.search + url.hash;
  errorObject.message ||= "Server Error";
  errorObject.data ||= error.data;
  errorObject.statusMessage ||= error.statusMessage;
  delete defaultRes.headers["content-type"];
  delete defaultRes.headers["content-security-policy"];
  setResponseHeaders(event, defaultRes.headers);
  const reqHeaders = getRequestHeaders(event);
  const isRenderingError = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"];
  const res = isRenderingError ? null : await useNitroApp().localFetch(
    withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject),
    {
      headers: { ...reqHeaders, "x-nuxt-error": "true" },
      redirect: "manual"
    }
  ).catch(() => null);
  if (event.handled) {
    return;
  }
  if (!res) {
    const { template } = await import('../_/error-500.mjs');
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    return send(event, template(errorObject));
  }
  const html = await res.text();
  for (const [header, value] of res.headers.entries()) {
    if (header === "set-cookie") {
      appendResponseHeader(event, header, value);
      continue;
    }
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
  return send(event, html);
});

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  function defaultNitroErrorHandler(error, event) {
    const res = defaultHandler(error, event);
    setResponseHeaders(event, res.headers);
    setResponseStatus(event, res.status, res.statusText);
    return send(event, JSON.stringify(res.body, null, 2));
  }
);
function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    console.error(`[request error] ${tags} [${event.method}] ${url}
`, error);
  }
  const headers = {
    "content-type": "application/json",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'none'; frame-ancestors 'none';"
  };
  setResponseStatus(event, statusCode, statusMessage);
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = {
    error: true,
    url: url.href,
    statusCode,
    statusMessage,
    message: isSensitive ? "Server Error" : error.message,
    data: isSensitive ? void 0 : error.data
  };
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}

const errorHandlers = [errorHandler$0, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

function defineNitroPlugin(def) {
  return def;
}

const formatErrorDetails = (details) => {
  {
    return void 0;
  }
};
const sendSuccess = (event, options) => {
  var _a;
  const statusCode = (_a = options.statusCode) != null ? _a : 200;
  setResponseStatus(event, statusCode);
  return {
    success: true,
    data: options.data
  };
};
const sendError = (event, options) => {
  var _a, _b;
  const statusCode = (_a = options.statusCode) != null ? _a : 500;
  const code = (_b = options.code) != null ? _b : "UNEXPECTED_ERROR";
  setResponseStatus(event, statusCode);
  return {
    success: false,
    error: {
      code,
      message: options.message,
      ...options.details !== void 0 ? { details: formatErrorDetails(options.details) } : {}
    }
  };
};
const handleServerError = (event, error, context) => {
  var _a;
  console.error(`[API] ${context.code}:`, error);
  return sendError(event, {
    statusCode: (_a = context.statusCode) != null ? _a : 500,
    code: context.code,
    message: context.message,
    details: error
  });
};

const isH3Error = (error) => error instanceof H3Error;
const _xx2DB3090hcz91n39p8Pam0AxY6_ldCjX6gUWVfN5Hk = defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("render:error", (error, { event }) => {
    var _a, _b, _c, _d;
    if (!event) {
      return;
    }
    if (isH3Error(error)) {
      const statusCode = (_a = error.statusCode) != null ? _a : 500;
      const statusMessage = (_b = error.statusMessage) != null ? _b : "Unexpected error";
      const code = typeof ((_c = error.data) == null ? void 0 : _c.code) === "string" ? error.data.code : `HTTP_${statusCode}`;
      setResponseStatus(event, statusCode, statusMessage);
      return sendError(event, {
        statusCode,
        code,
        message: statusMessage,
        details: (_d = error.data) != null ? _d : error
      });
    }
    setResponseStatus(event, 500, "Internal Server Error");
    return sendError(event, {
      statusCode: 500,
      code: "UNEXPECTED_ERROR",
      message: "Internal Server Error",
      details: error
    });
  });
});

const plugins = [
  _xx2DB3090hcz91n39p8Pam0AxY6_ldCjX6gUWVfN5Hk
];

const _SxA8c9 = defineEventHandler(() => {});

const _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};
const basename = function(p, extension) {
  const segments = normalizeWindowsPath(p).split("/");
  let lastSegment = "";
  for (let i = segments.length - 1; i >= 0; i--) {
    const val = segments[i];
    if (val) {
      lastSegment = val;
      break;
    }
  }
  return extension && lastSegment.endsWith(extension) ? lastSegment.slice(0, -extension.length) : lastSegment;
};

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

function buildAssetsDir() {
  return useRuntimeConfig().app.buildAssetsDir;
}
function buildAssetsURL(...path) {
  return joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path);
}
function publicAssetsURL(...path) {
  const app = useRuntimeConfig().app;
  const publicBase = app.cdnURL || app.baseURL;
  return path.length ? joinRelativeURL(publicBase, ...path) : publicBase;
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : "undefined" !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function getDefaultExportFromNamespaceIfNotNamed (n) {
	return n && Object.prototype.hasOwnProperty.call(n, 'default') && Object.keys(n).length === 1 ? n['default'] : n;
}

var tarn = {exports: {}};

var Pool$5 = {};

var PendingOperation$1 = {};

var TimeoutError$2 = {};

Object.defineProperty(TimeoutError$2, "__esModule", { value: true });
let TimeoutError$1 = class TimeoutError extends Error {
};
TimeoutError$2.TimeoutError = TimeoutError$1;

var utils$7 = {};

var PromiseInspection$1 = {};

Object.defineProperty(PromiseInspection$1, "__esModule", { value: true });
class PromiseInspection {
    constructor(args) {
        this._value = args.value;
        this._error = args.error;
    }
    value() {
        return this._value;
    }
    reason() {
        return this._error;
    }
    isRejected() {
        return !!this._error;
    }
    isFulfilled() {
        return !!this._value;
    }
}
PromiseInspection$1.PromiseInspection = PromiseInspection;

Object.defineProperty(utils$7, "__esModule", { value: true });
const PromiseInspection_1 = PromiseInspection$1;
function defer() {
    let resolve = null;
    let reject = null;
    const promise = new Promise((resolver, rejecter) => {
        resolve = resolver;
        reject = rejecter;
    });
    return {
        promise,
        resolve,
        reject
    };
}
utils$7.defer = defer;
function now() {
    return Date.now();
}
utils$7.now = now;
function duration(t1, t2) {
    return Math.abs(t2 - t1);
}
utils$7.duration = duration;
function checkOptionalTime(time) {
    if (typeof time === 'undefined') {
        return true;
    }
    return checkRequiredTime(time);
}
utils$7.checkOptionalTime = checkOptionalTime;
function checkRequiredTime(time) {
    return typeof time === 'number' && time === Math.round(time) && time > 0;
}
utils$7.checkRequiredTime = checkRequiredTime;
function delay$2(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}
utils$7.delay = delay$2;
function reflect(promise) {
    return promise
        .then(value => {
        return new PromiseInspection_1.PromiseInspection({ value });
    })
        .catch(error => {
        return new PromiseInspection_1.PromiseInspection({ error });
    });
}
utils$7.reflect = reflect;
function tryPromise(cb) {
    try {
        const result = cb();
        return Promise.resolve(result);
    }
    catch (err) {
        return Promise.reject(err);
    }
}
utils$7.tryPromise = tryPromise;

Object.defineProperty(PendingOperation$1, "__esModule", { value: true });
const TimeoutError_1 = TimeoutError$2;
const utils_1$2 = utils$7;
class PendingOperation {
    constructor(timeoutMillis) {
        this.timeoutMillis = timeoutMillis;
        this.deferred = utils_1$2.defer();
        this.possibleTimeoutCause = null;
        this.isRejected = false;
        this.promise = timeout$4(this.deferred.promise, timeoutMillis).catch(err => {
            if (err instanceof TimeoutError_1.TimeoutError) {
                if (this.possibleTimeoutCause) {
                    err = new TimeoutError_1.TimeoutError(this.possibleTimeoutCause.message);
                }
                else {
                    err = new TimeoutError_1.TimeoutError('operation timed out for an unknown reason');
                }
            }
            this.isRejected = true;
            return Promise.reject(err);
        });
    }
    abort() {
        this.reject(new Error('aborted'));
    }
    reject(err) {
        this.deferred.reject(err);
    }
    resolve(value) {
        this.deferred.resolve(value);
    }
}
PendingOperation$1.PendingOperation = PendingOperation;
function timeout$4(promise, time) {
    return new Promise((resolve, reject) => {
        const timeoutHandle = setTimeout(() => reject(new TimeoutError_1.TimeoutError()), time);
        promise
            .then(result => {
            clearTimeout(timeoutHandle);
            resolve(result);
        })
            .catch(err => {
            clearTimeout(timeoutHandle);
            reject(err);
        });
    });
}

var Resource$1 = {};

Object.defineProperty(Resource$1, "__esModule", { value: true });
const utils_1$1 = utils$7;
class Resource {
    constructor(resource) {
        this.resource = resource;
        this.resource = resource;
        this.timestamp = utils_1$1.now();
        this.deferred = utils_1$1.defer();
    }
    get promise() {
        return this.deferred.promise;
    }
    resolve() {
        this.deferred.resolve(undefined);
        return new Resource(this.resource);
    }
}
Resource$1.Resource = Resource;

const require$$2$b = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(events);

const require$$4$4 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(timers);

Object.defineProperty(Pool$5, "__esModule", { value: true });
const PendingOperation_1 = PendingOperation$1;
const Resource_1 = Resource$1;
const utils_1 = utils$7;
const events_1 = require$$2$b;
const timers_1 = require$$4$4;
let Pool$4 = class Pool {
    constructor(opt) {
        this.destroyed = false;
        this.emitter = new events_1.EventEmitter();
        opt = opt || {};
        if (!opt.create) {
            throw new Error('Tarn: opt.create function most be provided');
        }
        if (!opt.destroy) {
            throw new Error('Tarn: opt.destroy function most be provided');
        }
        if (typeof opt.min !== 'number' || opt.min < 0 || opt.min !== Math.round(opt.min)) {
            throw new Error('Tarn: opt.min must be an integer >= 0');
        }
        if (typeof opt.max !== 'number' || opt.max <= 0 || opt.max !== Math.round(opt.max)) {
            throw new Error('Tarn: opt.max must be an integer > 0');
        }
        if (opt.min > opt.max) {
            throw new Error('Tarn: opt.max is smaller than opt.min');
        }
        if (!utils_1.checkOptionalTime(opt.acquireTimeoutMillis)) {
            throw new Error('Tarn: invalid opt.acquireTimeoutMillis ' + JSON.stringify(opt.acquireTimeoutMillis));
        }
        if (!utils_1.checkOptionalTime(opt.createTimeoutMillis)) {
            throw new Error('Tarn: invalid opt.createTimeoutMillis ' + JSON.stringify(opt.createTimeoutMillis));
        }
        if (!utils_1.checkOptionalTime(opt.destroyTimeoutMillis)) {
            throw new Error('Tarn: invalid opt.destroyTimeoutMillis ' + JSON.stringify(opt.destroyTimeoutMillis));
        }
        if (!utils_1.checkOptionalTime(opt.idleTimeoutMillis)) {
            throw new Error('Tarn: invalid opt.idleTimeoutMillis ' + JSON.stringify(opt.idleTimeoutMillis));
        }
        if (!utils_1.checkOptionalTime(opt.reapIntervalMillis)) {
            throw new Error('Tarn: invalid opt.reapIntervalMillis ' + JSON.stringify(opt.reapIntervalMillis));
        }
        if (!utils_1.checkOptionalTime(opt.createRetryIntervalMillis)) {
            throw new Error('Tarn: invalid opt.createRetryIntervalMillis ' +
                JSON.stringify(opt.createRetryIntervalMillis));
        }
        const allowedKeys = {
            create: true,
            validate: true,
            destroy: true,
            log: true,
            min: true,
            max: true,
            acquireTimeoutMillis: true,
            createTimeoutMillis: true,
            destroyTimeoutMillis: true,
            idleTimeoutMillis: true,
            reapIntervalMillis: true,
            createRetryIntervalMillis: true,
            propagateCreateError: true
        };
        for (const key of Object.keys(opt)) {
            if (!allowedKeys[key]) {
                throw new Error(`Tarn: unsupported option opt.${key}`);
            }
        }
        this.creator = opt.create;
        this.destroyer = opt.destroy;
        this.validate = typeof opt.validate === 'function' ? opt.validate : () => true;
        this.log = opt.log || (() => { });
        this.acquireTimeoutMillis = opt.acquireTimeoutMillis || 30000;
        this.createTimeoutMillis = opt.createTimeoutMillis || 30000;
        this.destroyTimeoutMillis = opt.destroyTimeoutMillis || 5000;
        this.idleTimeoutMillis = opt.idleTimeoutMillis || 30000;
        this.reapIntervalMillis = opt.reapIntervalMillis || 1000;
        this.createRetryIntervalMillis = opt.createRetryIntervalMillis || 200;
        this.propagateCreateError = !!opt.propagateCreateError;
        this.min = opt.min;
        this.max = opt.max;
        // All the resources, which are either already acquired or which are
        // considered for being passed to acquire in async validation phase.
        this.used = [];
        // All the resources, which are either just created and free or returned
        // back to pool after using.
        this.free = [];
        this.pendingCreates = [];
        this.pendingAcquires = [];
        this.pendingDestroys = [];
        // When acquire is pending, but also still in validation phase
        this.pendingValidations = [];
        this.destroyed = false;
        this.interval = null;
        this.eventId = 1;
    }
    numUsed() {
        return this.used.length;
    }
    numFree() {
        return this.free.length;
    }
    numPendingAcquires() {
        return this.pendingAcquires.length;
    }
    numPendingValidations() {
        return this.pendingValidations.length;
    }
    numPendingCreates() {
        return this.pendingCreates.length;
    }
    acquire() {
        const eventId = this.eventId++;
        this._executeEventHandlers('acquireRequest', eventId);
        const pendingAcquire = new PendingOperation_1.PendingOperation(this.acquireTimeoutMillis);
        this.pendingAcquires.push(pendingAcquire);
        // If the acquire fails for whatever reason
        // remove it from the pending queue.
        pendingAcquire.promise = pendingAcquire.promise
            .then(resource => {
            this._executeEventHandlers('acquireSuccess', eventId, resource);
            return resource;
        })
            .catch(err => {
            this._executeEventHandlers('acquireFail', eventId, err);
            remove(this.pendingAcquires, pendingAcquire);
            return Promise.reject(err);
        });
        this._tryAcquireOrCreate();
        return pendingAcquire;
    }
    release(resource) {
        this._executeEventHandlers('release', resource);
        for (let i = 0, l = this.used.length; i < l; ++i) {
            const used = this.used[i];
            if (used.resource === resource) {
                this.used.splice(i, 1);
                this.free.push(used.resolve());
                this._tryAcquireOrCreate();
                return true;
            }
        }
        return false;
    }
    isEmpty() {
        return ([
            this.numFree(),
            this.numUsed(),
            this.numPendingAcquires(),
            this.numPendingValidations(),
            this.numPendingCreates()
        ].reduce((total, value) => total + value) === 0);
    }
    /**
     * Reaping cycle.
     */
    check() {
        const timestamp = utils_1.now();
        const newFree = [];
        const minKeep = this.min - this.used.length;
        const maxDestroy = this.free.length - minKeep;
        let numDestroyed = 0;
        this.free.forEach(free => {
            if (utils_1.duration(timestamp, free.timestamp) >= this.idleTimeoutMillis &&
                numDestroyed < maxDestroy) {
                numDestroyed++;
                this._destroy(free.resource);
            }
            else {
                newFree.push(free);
            }
        });
        this.free = newFree;
        // Pool is completely empty, stop reaping.
        // Next .acquire will start reaping interval again.
        if (this.isEmpty()) {
            this._stopReaping();
        }
    }
    destroy() {
        const eventId = this.eventId++;
        this._executeEventHandlers('poolDestroyRequest', eventId);
        this._stopReaping();
        this.destroyed = true;
        // First wait for all the pending creates get ready.
        return utils_1.reflect(Promise.all(this.pendingCreates.map(create => utils_1.reflect(create.promise)))
            .then(() => {
            // eslint-disable-next-line
            return new Promise((resolve, reject) => {
                // poll every 100ms and wait that all validations are ready
                if (this.numPendingValidations() === 0) {
                    resolve();
                    return;
                }
                const interval = setInterval(() => {
                    if (this.numPendingValidations() === 0) {
                        timers_1.clearInterval(interval);
                        resolve();
                    }
                }, 100);
            });
        })
            .then(() => {
            // Wait for all the used resources to be freed.
            return Promise.all(this.used.map(used => utils_1.reflect(used.promise)));
        })
            .then(() => {
            // Abort all pending acquires.
            return Promise.all(this.pendingAcquires.map(acquire => {
                acquire.abort();
                return utils_1.reflect(acquire.promise);
            }));
        })
            .then(() => {
            // Now we can destroy all the freed resources.
            return Promise.all(this.free.map(free => utils_1.reflect(this._destroy(free.resource))));
        })
            .then(() => {
            // Also wait rest of the pending destroys to finish
            return Promise.all(this.pendingDestroys.map(pd => pd.promise));
        })
            .then(() => {
            this.free = [];
            this.pendingAcquires = [];
        })).then(res => {
            this._executeEventHandlers('poolDestroySuccess', eventId);
            this.emitter.removeAllListeners();
            return res;
        });
    }
    on(event, listener) {
        this.emitter.on(event, listener);
    }
    removeListener(event, listener) {
        this.emitter.removeListener(event, listener);
    }
    removeAllListeners(event) {
        this.emitter.removeAllListeners(event);
    }
    /**
     * The most important method that is called always when resources
     * are created / destroyed / acquired / released. In other words
     * every time when resources are moved from used to free or vice
     * versa.
     *
     * Either assigns free resources to pendingAcquires or creates new
     * resources if there is room for it in the pool.
     */
    _tryAcquireOrCreate() {
        if (this.destroyed) {
            return;
        }
        if (this._hasFreeResources()) {
            this._doAcquire();
        }
        else if (this._shouldCreateMoreResources()) {
            this._doCreate();
        }
    }
    _hasFreeResources() {
        return this.free.length > 0;
    }
    _doAcquire() {
        // Acquire as many pending acquires as possible concurrently
        while (this._canAcquire()) {
            // To allow async validation, we actually need to move free resource
            // and pending acquire temporary from their respective arrays and depending
            // on validation result to either leave the free resource to used resources array
            // or destroy the free resource if validation did fail.
            const pendingAcquire = this.pendingAcquires.shift();
            const free = this.free.pop();
            if (free === undefined || pendingAcquire === undefined) {
                const errMessage = 'this.free was empty while trying to acquire resource';
                this.log(`Tarn: ${errMessage}`, 'warn');
                throw new Error(`Internal error, should never happen. ${errMessage}`);
            }
            // Make sure that pendingAcquire that is being validated is not lost and
            // can be freed when pool is destroyed.
            this.pendingValidations.push(pendingAcquire);
            // Must be added here pre-emptively to prevent logic that decides
            // if new resources are created will keep on working correctly.
            this.used.push(free);
            // if acquire fails also pending validation, must be aborted so that pre reserved
            // resource will be returned to free resources immediately
            const abortAbleValidation = new PendingOperation_1.PendingOperation(this.acquireTimeoutMillis);
            // eslint-disable-next-line
            pendingAcquire.promise.catch(err => {
                abortAbleValidation.abort();
            });
            abortAbleValidation.promise
                .catch(err => {
                // There's nothing we can do here but log the error. This would otherwise
                // leak out as an unhandled exception.
                this.log('Tarn: resource validator threw an exception ' + err.stack, 'warn');
                return false;
            })
                .then(validationSuccess => {
                try {
                    if (validationSuccess && !pendingAcquire.isRejected) {
                        // At least one active resource exist, start reaping.
                        this._startReaping();
                        pendingAcquire.resolve(free.resource);
                    }
                    else {
                        remove(this.used, free);
                        // Only destroy the resource if the validation has failed
                        if (!validationSuccess) {
                            this._destroy(free.resource);
                            // Since we destroyed an invalid resource and were not able to fulfill
                            // all the pending acquires, we may need to create new ones or at
                            // least run this acquire loop again to verify it. But not immediately
                            // to prevent starving event loop.
                            setTimeout(() => {
                                this._tryAcquireOrCreate();
                            }, 0);
                        }
                        else {
                            this.free.push(free);
                        }
                        // is acquire was canceled, failed or timed out already
                        // no need to return it to pending queries
                        if (!pendingAcquire.isRejected) {
                            this.pendingAcquires.unshift(pendingAcquire);
                        }
                    }
                }
                finally {
                    remove(this.pendingValidations, pendingAcquire);
                }
            });
            // try to validate
            this._validateResource(free.resource)
                .then(validationSuccess => {
                abortAbleValidation.resolve(validationSuccess);
            })
                .catch(err => {
                abortAbleValidation.reject(err);
            });
        }
    }
    _canAcquire() {
        return this.free.length > 0 && this.pendingAcquires.length > 0;
    }
    _validateResource(resource) {
        try {
            return Promise.resolve(this.validate(resource));
        }
        catch (err) {
            // prevent leaking of sync exception
            return Promise.reject(err);
        }
    }
    _shouldCreateMoreResources() {
        return (this.used.length + this.pendingCreates.length < this.max &&
            this.pendingCreates.length < this.pendingAcquires.length);
    }
    _doCreate() {
        const pendingAcquiresBeforeCreate = this.pendingAcquires.slice();
        const pendingCreate = this._create();
        pendingCreate.promise
            .then(() => {
            // Not returned on purpose.
            this._tryAcquireOrCreate();
            return null;
        })
            .catch(err => {
            if (this.propagateCreateError && this.pendingAcquires.length !== 0) {
                // If propagateCreateError is true, we don't retry the create
                // but reject the first pending acquire immediately. Intentionally
                // use `this.pendingAcquires` instead of `pendingAcquiresBeforeCreate`
                // in case some acquires in pendingAcquiresBeforeCreate have already
                // been resolved.
                this.pendingAcquires[0].reject(err);
            }
            // Save the create error to all pending acquires so that we can use it
            // as the error to reject the acquire if it times out.
            pendingAcquiresBeforeCreate.forEach(pendingAcquire => {
                pendingAcquire.possibleTimeoutCause = err;
            });
            // Not returned on purpose.
            utils_1.delay(this.createRetryIntervalMillis).then(() => this._tryAcquireOrCreate());
        });
    }
    _create() {
        const eventId = this.eventId++;
        this._executeEventHandlers('createRequest', eventId);
        const pendingCreate = new PendingOperation_1.PendingOperation(this.createTimeoutMillis);
        // If an error occurs (likely a create timeout) remove this creation from
        // the list of pending creations so we try to create a new one.
        pendingCreate.promise = pendingCreate.promise.catch(err => {
            if (remove(this.pendingCreates, pendingCreate)) {
                // TODO: figure out more consistent way for different error handlers in next rewrite
                this._executeEventHandlers('createFail', eventId, err);
            }
            throw err;
        });
        this.pendingCreates.push(pendingCreate);
        callbackOrPromise(this.creator)
            .then(resource => {
            if (pendingCreate.isRejected) {
                this.destroyer(resource);
                return null;
            }
            remove(this.pendingCreates, pendingCreate);
            this.free.push(new Resource_1.Resource(resource));
            // Not returned on purpose.
            pendingCreate.resolve(resource);
            this._executeEventHandlers('createSuccess', eventId, resource);
            return null;
        })
            .catch(err => {
            if (pendingCreate.isRejected) {
                return null;
            }
            if (remove(this.pendingCreates, pendingCreate)) {
                this._executeEventHandlers('createFail', eventId, err);
            }
            // Not returned on purpose.
            pendingCreate.reject(err);
            return null;
        });
        return pendingCreate;
    }
    _destroy(resource) {
        const eventId = this.eventId++;
        this._executeEventHandlers('destroyRequest', eventId, resource);
        // this.destroyer can be both synchronous and asynchronous.
        // so we wrap it to promise to get all exceptions through same pipeline
        const pendingDestroy = new PendingOperation_1.PendingOperation(this.destroyTimeoutMillis);
        const retVal = Promise.resolve().then(() => this.destroyer(resource));
        retVal
            .then(() => {
            pendingDestroy.resolve(resource);
        })
            .catch((err) => {
            pendingDestroy.reject(err);
        });
        this.pendingDestroys.push(pendingDestroy);
        // In case of an error there's nothing we can do here but log it.
        return pendingDestroy.promise
            .then(res => {
            this._executeEventHandlers('destroySuccess', eventId, resource);
            return res;
        })
            .catch(err => this._logDestroyerError(eventId, resource, err))
            .then(res => {
            const index = this.pendingDestroys.findIndex(pd => pd === pendingDestroy);
            this.pendingDestroys.splice(index, 1);
            return res;
        });
    }
    _logDestroyerError(eventId, resource, err) {
        this._executeEventHandlers('destroyFail', eventId, resource, err);
        this.log('Tarn: resource destroyer threw an exception ' + err.stack, 'warn');
    }
    _startReaping() {
        if (!this.interval) {
            this._executeEventHandlers('startReaping');
            this.interval = setInterval(() => this.check(), this.reapIntervalMillis);
        }
    }
    _stopReaping() {
        if (this.interval !== null) {
            this._executeEventHandlers('stopReaping');
            timers_1.clearInterval(this.interval);
        }
        this.interval = null;
    }
    _executeEventHandlers(eventName, ...args) {
        const listeners = this.emitter.listeners(eventName);
        // just calling .emit() would stop running rest of the listeners if one them fails
        listeners.forEach(listener => {
            try {
                listener(...args);
            }
            catch (err) {
                // There's nothing we can do here but log the error. This would otherwise
                // leak out as an unhandled exception.
                this.log(`Tarn: event handler "${eventName}" threw an exception ${err.stack}`, 'warn');
            }
        });
    }
};
Pool$5.Pool = Pool$4;
function remove(arr, item) {
    const idx = arr.indexOf(item);
    if (idx === -1) {
        return false;
    }
    else {
        arr.splice(idx, 1);
        return true;
    }
}
function callbackOrPromise(func) {
    return new Promise((resolve, reject) => {
        const callback = (err, resource) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(resource);
            }
        };
        utils_1.tryPromise(() => func(callback))
            .then(res => {
            // If the result is falsy, we assume that the callback will
            // be called instead of interpreting the falsy value as a
            // result value.
            if (res) {
                resolve(res);
            }
        })
            .catch(err => {
            reject(err);
        });
    });
}

(function (module, exports$1) {
	Object.defineProperty(exports$1, "__esModule", { value: true });
	const Pool_1 = Pool$5;
	exports$1.Pool = Pool_1.Pool;
	const TimeoutError_1 = TimeoutError$2;
	exports$1.TimeoutError = TimeoutError_1.TimeoutError;
	module.exports = {
	    Pool: Pool_1.Pool,
	    TimeoutError: TimeoutError_1.TimeoutError
	}; 
} (tarn, tarn.exports));

var tarnExports = tarn.exports;

const require$$1$e = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(util$1);

/*eslint max-len: 0, no-var:0 */

const charsRegex = /[\0\b\t\n\r\x1a"'\\]/g; // eslint-disable-line no-control-regex
const charsMap = {
  '\0': '\\0',
  '\b': '\\b',
  '\t': '\\t',
  '\n': '\\n',
  '\r': '\\r',
  '\x1a': '\\Z',
  '"': '\\"',
  "'": "\\'",
  '\\': '\\\\',
};

function wrapEscape(escapeFn) {
  return function finalEscape(val, ctx = {}) {
    return escapeFn(val, finalEscape, ctx);
  };
}

function makeEscape$1(config = {}) {
  const finalEscapeDate = config.escapeDate || dateToString$1;
  const finalEscapeArray = config.escapeArray || arrayToList;
  const finalEscapeBuffer = config.escapeBuffer || bufferToString;
  const finalEscapeString = config.escapeString || escapeString;
  const finalEscapeObject = config.escapeObject || escapeObject;
  const finalWrap = config.wrap || wrapEscape;

  function escapeFn(val, finalEscape, ctx) {
    if (val === undefined || val === null) {
      return 'NULL';
    }
    switch (typeof val) {
      case 'boolean':
        return val ? 'true' : 'false';
      case 'number':
        return val + '';
      case 'object':
        if (val instanceof Date) {
          val = finalEscapeDate(val, finalEscape, ctx);
        } else if (Array.isArray(val)) {
          return finalEscapeArray(val, finalEscape, ctx);
        } else if (Buffer.isBuffer(val)) {
          return finalEscapeBuffer(val, finalEscape, ctx);
        } else {
          return finalEscapeObject(val, finalEscape, ctx);
        }
    }
    return finalEscapeString(val, finalEscape, ctx);
  }

  return finalWrap ? finalWrap(escapeFn) : escapeFn;
}

function escapeObject(val, finalEscape, ctx) {
  if (val && typeof val.toSQL === 'function') {
    return val.toSQL(ctx);
  } else {
    return JSON.stringify(val);
  }
}

function arrayToList(array, finalEscape, ctx) {
  let sql = '';
  for (let i = 0; i < array.length; i++) {
    const val = array[i];
    if (Array.isArray(val)) {
      sql +=
        (i === 0 ? '' : ', ') + '(' + arrayToList(val, finalEscape, ctx) + ')';
    } else {
      sql += (i === 0 ? '' : ', ') + finalEscape(val, ctx);
    }
  }
  return sql;
}

function bufferToString(buffer) {
  return 'X' + escapeString(buffer.toString('hex'));
}

function escapeString(val, finalEscape, ctx) {
  let chunkIndex = (charsRegex.lastIndex = 0);
  let escapedVal = '';
  let match;

  while ((match = charsRegex.exec(val))) {
    escapedVal += val.slice(chunkIndex, match.index) + charsMap[match[0]];
    chunkIndex = charsRegex.lastIndex;
  }

  if (chunkIndex === 0) {
    // Nothing was escaped
    return "'" + val + "'";
  }

  if (chunkIndex < val.length) {
    return "'" + escapedVal + val.slice(chunkIndex) + "'";
  }

  return "'" + escapedVal + "'";
}

function dateToString$1(date, finalEscape, ctx = {}) {
  const timeZone = ctx.timeZone || 'local';

  const dt = new Date(date);
  let year;
  let month;
  let day;
  let hour;
  let minute;
  let second;
  let millisecond;

  if (timeZone === 'local') {
    year = dt.getFullYear();
    month = dt.getMonth() + 1;
    day = dt.getDate();
    hour = dt.getHours();
    minute = dt.getMinutes();
    second = dt.getSeconds();
    millisecond = dt.getMilliseconds();
  } else {
    const tz = convertTimezone(timeZone);

    if (tz !== false && tz !== 0) {
      dt.setTime(dt.getTime() + tz * 60000);
    }

    year = dt.getUTCFullYear();
    month = dt.getUTCMonth() + 1;
    day = dt.getUTCDate();
    hour = dt.getUTCHours();
    minute = dt.getUTCMinutes();
    second = dt.getUTCSeconds();
    millisecond = dt.getUTCMilliseconds();
  }

  // YYYY-MM-DD HH:mm:ss.mmm
  return (
    zeroPad(year, 4) +
    '-' +
    zeroPad(month, 2) +
    '-' +
    zeroPad(day, 2) +
    ' ' +
    zeroPad(hour, 2) +
    ':' +
    zeroPad(minute, 2) +
    ':' +
    zeroPad(second, 2) +
    '.' +
    zeroPad(millisecond, 3)
  );
}

function zeroPad(number, length) {
  number = number.toString();
  while (number.length < length) {
    number = '0' + number;
  }
  return number;
}

function convertTimezone(tz) {
  if (tz === 'Z') {
    return 0;
  }
  const m = tz.match(/([+\-\s])(\d\d):?(\d\d)?/);
  if (m) {
    return (
      (m[1] == '-' ? -1 : 1) *
      (parseInt(m[2], 10) + (m[3] ? parseInt(m[3], 10) : 0) / 60) *
      60
    );
  }
  return false;
}

var string = {
  makeEscape: makeEscape$1,
};

const require$$4$3 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(cloneDeep$1);

const require$$0$k = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(defaults$6);

const require$$6 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(uniqueId$2);

var timeout$3 = {};

let KnexTimeoutError$4 = class KnexTimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = 'KnexTimeoutError';
  }
};

function timeout$2(promise, ms) {
  return new Promise(function (resolve, reject) {
    const id = setTimeout(function () {
      reject(new KnexTimeoutError$4('operation timed out'));
    }, ms);

    function wrappedResolve(value) {
      clearTimeout(id);
      resolve(value);
    }

    function wrappedReject(err) {
      clearTimeout(id);
      reject(err);
    }

    promise.then(wrappedResolve, wrappedReject);
  });
}

timeout$3.KnexTimeoutError = KnexTimeoutError$4;
timeout$3.timeout = timeout$2;

function ensureConnectionCallback$1(runner) {
  runner.client.emit('start', runner.builder);
  runner.builder.emit('start', runner.builder);
  const sql = runner.builder.toSQL();

  if (runner.builder._debug) {
    runner.client.logger.debug(sql);
  }

  if (Array.isArray(sql)) {
    return runner.queryArray(sql);
  }
  return runner.query(sql);
}

function ensureConnectionStreamCallback$1(runner, params) {
  try {
    const sql = runner.builder.toSQL();

    if (Array.isArray(sql) && params.hasHandler) {
      throw new Error(
        'The stream may only be used with a single query statement.'
      );
    }

    return runner.client.stream(
      runner.connection,
      sql,
      params.stream,
      params.options
    );
  } catch (e) {
    params.stream.emit('error', e);
    throw e;
  }
}

var ensureConnectionCallback_1 = {
  ensureConnectionCallback: ensureConnectionCallback$1,
  ensureConnectionStreamCallback: ensureConnectionStreamCallback$1,
};

const require$$2$a = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(stream$1);

const { KnexTimeoutError: KnexTimeoutError$3 } = timeout$3;
const { timeout: timeout$1 } = timeout$3;
const {
  ensureConnectionCallback,
  ensureConnectionStreamCallback,
} = ensureConnectionCallback_1;

let Transform;

// The "Runner" constructor takes a "builder" (query, schema, or raw)
// and runs through each of the query statements, calling any additional
// "output" method provided alongside the query and bindings.
let Runner$1 = class Runner {
  constructor(client, builder) {
    this.client = client;
    this.builder = builder;
    this.queries = [];

    // The "connection" object is set on the runner when
    // "run" is called.
    this.connection = undefined;
  }

  // "Run" the target, calling "toSQL" on the builder, returning
  // an object or array of queries to run, each of which are run on
  // a single connection.
  async run() {
    const runner = this;
    try {
      const res = await this.ensureConnection(ensureConnectionCallback);

      // Fire a single "end" event on the builder when
      // all queries have successfully completed.
      runner.builder.emit('end');
      return res;

      // If there are any "error" listeners, we fire an error event
      // and then re-throw the error to be eventually handled by
      // the promise chain. Useful if you're wrapping in a custom `Promise`.
    } catch (err) {
      if (runner.builder._events && runner.builder._events.error) {
        runner.builder.emit('error', err);
      }
      throw err;
    }
  }

  // Stream the result set, by passing through to the dialect's streaming
  // capabilities. If the options are
  stream(optionsOrHandler, handlerOrNil) {
    const firstOptionIsHandler =
      typeof optionsOrHandler === 'function' && arguments.length === 1;

    const options = firstOptionIsHandler ? {} : optionsOrHandler;
    const handler = firstOptionIsHandler ? optionsOrHandler : handlerOrNil;

    // Determines whether we emit an error or throw here.
    const hasHandler = typeof handler === 'function';

    // Lazy-load the "Transform" dependency.
    Transform = Transform || require$$2$a.Transform;

    const queryContext = this.builder.queryContext();

    const stream = new Transform({
      objectMode: true,
      transform: (chunk, _, callback) => {
        callback(null, this.client.postProcessResponse(chunk, queryContext));
      },
    });
    stream.on('close', () => {
      this.client.releaseConnection(this.connection);
    });

    // If the stream is manually destroyed, the close event is not
    // propagated to the top of the pipe chain. We need to manually verify
    // that the source stream is closed and if not, manually destroy it.
    stream.on('pipe', (sourceStream) => {
      const cleanSourceStream = () => {
        if (!sourceStream.closed) {
          sourceStream.destroy();
        }
      };

      // Stream already closed, cleanup immediately
      if (stream.closed) {
        cleanSourceStream();
      } else {
        stream.on('close', cleanSourceStream);
      }
    });

    const connectionAcquirePromise = this.ensureConnection(
      ensureConnectionStreamCallback,
      {
        options,
        hasHandler,
        stream,
      }
    )
      // Emit errors on the stream if the error occurred before a connection
      // could be acquired.
      // If the connection was acquired, assume the error occurred in the client
      // code and has already been emitted on the stream. Don't emit it twice.
      .catch((err) => {
        if (!this.connection) {
          stream.emit('error', err);
        }
      });

    // If a function is passed to handle the stream, send the stream
    // there and return the promise, otherwise just return the stream
    // and the promise will take care of itself.
    if (hasHandler) {
      handler(stream);
      return connectionAcquirePromise;
    }
    return stream;
  }

  // Allow you to pipe the stream to a writable stream.
  pipe(writable, options) {
    return this.stream(options).pipe(writable);
  }

  // "Runs" a query, returning a promise. All queries specified by the builder are guaranteed
  // to run in sequence, and on the same connection, especially helpful when schema building
  // and dealing with foreign key constraints, etc.
  async query(obj) {
    const { __knexUid, __knexTxId } = this.connection;

    this.builder.emit('query', Object.assign({ __knexUid, __knexTxId }, obj));

    const runner = this;
    const queryContext = this.builder.queryContext();
    // query-error events are emitted before the queryPromise continuations.
    // pass queryContext into client.query so it can be raised properly.
    if (obj !== null && typeof obj === 'object') {
      obj.queryContext = queryContext;
    }
    let queryPromise = this.client.query(this.connection, obj);

    if (obj.timeout) {
      queryPromise = timeout$1(queryPromise, obj.timeout);
    }

    // Await the return value of client.processResponse; in the case of sqlite3's
    // dropColumn()/renameColumn(), it will be a Promise for the transaction
    // containing the complete rename procedure.
    return queryPromise
      .then((resp) => this.client.processResponse(resp, runner))
      .then((processedResponse) => {
        const postProcessedResponse = this.client.postProcessResponse(
          processedResponse,
          queryContext
        );

        this.builder.emit(
          'query-response',
          postProcessedResponse,
          Object.assign({ __knexUid, __knexTxId }, obj),
          this.builder
        );

        this.client.emit(
          'query-response',
          postProcessedResponse,
          Object.assign({ __knexUid, __knexTxId }, obj),
          this.builder
        );

        return postProcessedResponse;
      })
      .catch((error) => {
        if (!(error instanceof KnexTimeoutError$3)) {
          return Promise.reject(error);
        }
        const { timeout, sql, bindings } = obj;

        let cancelQuery;
        if (obj.cancelOnTimeout) {
          cancelQuery = this.client.cancelQuery(this.connection);
        } else {
          // If we don't cancel the query, we need to mark the connection as disposed so that
          // it gets destroyed by the pool and is never used again. If we don't do this and
          // return the connection to the pool, it will be useless until the current operation
          // that timed out, finally finishes.
          this.connection.__knex__disposed = error;
          cancelQuery = Promise.resolve();
        }

        return cancelQuery
          .catch((cancelError) => {
            // If the cancellation failed, we need to mark the connection as disposed so that
            // it gets destroyed by the pool and is never used again. If we don't do this and
            // return the connection to the pool, it will be useless until the current operation
            // that timed out, finally finishes.
            this.connection.__knex__disposed = error;

            // cancellation failed
            throw Object.assign(cancelError, {
              message: `After query timeout of ${timeout}ms exceeded, cancelling of query failed.`,
              sql,
              bindings,
              timeout,
            });
          })
          .then(() => {
            // cancellation succeeded, rethrow timeout error
            throw Object.assign(error, {
              message: `Defined query timeout of ${timeout}ms exceeded when running query.`,
              sql,
              bindings,
              timeout,
            });
          });
      })
      .catch((error) => {
        this.builder.emit(
          'query-error',
          error,
          Object.assign({ __knexUid, __knexTxId, queryContext }, obj)
        );
        throw error;
      });
  }

  // In the case of the "schema builder" we call `queryArray`, which runs each
  // of the queries in sequence.
  async queryArray(queries) {
    if (queries.length === 1) {
      const query = queries[0];

      if (!query.statementsProducer) {
        return this.query(query);
      }

      const statements = await query.statementsProducer(
        undefined,
        this.connection
      );

      const sqlQueryObjects = statements.sql.map((statement) => ({
        sql: statement,
        bindings: query.bindings,
      }));
      const preQueryObjects = statements.pre.map((statement) => ({
        sql: statement,
        bindings: query.bindings,
      }));
      const postQueryObjects = statements.post.map((statement) => ({
        sql: statement,
        bindings: query.bindings,
      }));

      let results = [];

      await this.queryArray(preQueryObjects);

      try {
        await this.client.transaction(
          async (trx) => {
            const transactionRunner = new Runner(trx.client, this.builder);
            transactionRunner.connection = this.connection;

            results = await transactionRunner.queryArray(sqlQueryObjects);

            if (statements.check) {
              const foreignViolations = await trx.raw(statements.check);

              if (foreignViolations.length > 0) {
                throw new Error('FOREIGN KEY constraint failed');
              }
            }
          },
          { connection: this.connection }
        );
      } finally {
        await this.queryArray(postQueryObjects);
      }

      return results;
    }

    const results = [];
    for (const query of queries) {
      results.push(await this.queryArray([query]));
    }
    return results;
  }

  // Check whether there's a transaction flag, and that it has a connection.
  async ensureConnection(cb, cbParams) {
    // Use override from a builder if passed
    if (this.builder._connection) {
      this.connection = this.builder._connection;
    }

    if (this.connection) {
      return cb(this, cbParams);
    }

    let acquiredConnection;
    try {
      acquiredConnection = await this.client.acquireConnection();
    } catch (error) {
      if (!(error instanceof KnexTimeoutError$3)) {
        return Promise.reject(error);
      }
      if (this.builder) {
        error.sql = this.builder.sql;
        error.bindings = this.builder.bindings;
      }
      throw error;
    }
    try {
      this.connection = acquiredConnection;
      return await cb(this, cbParams);
    } finally {
      await this.client.releaseConnection(acquiredConnection);
    }
  }
};

var runner = Runner$1;

function createDebug(namespace) {
	return Object.assign((...args) => {
		const env = globalThis.process?.env.DEBUG;
		if (!env || env !== "*" && !env.startsWith(namespace)) return;
		console.debug(...args);
	}, {
		color: "#000000",
		diff: 0,
		enabled: true,
		log: console.debug.bind(console),
		namespace,
		destroy: () => false,
		extend: (ns, _del) => createDebug(namespace + ns)
	});
}
const debug$4 = Object.assign(createDebug, {
	coerce: (val) => val,
	disable: () => "",
	enable: (_namespaces) => {},
	enabled: (_namespaces) => true,
	formatArgs(args) {
		args[0] = `${this.namespace} ${args[0]}`;
	},
	log: console.debug.bind(console),
	selectColor: (_namespace) => 0,
	humanize: (num) => `${num}ms`,
	inspectOpts: {},
	names: [],
	skips: [],
	formatters: {}
});
const coerce = debug$4.coerce;
const disable = debug$4.disable;
const enable = debug$4.enable;
const enabled = debug$4.enabled;
const formatArgs = debug$4.formatArgs;
const log = debug$4.log;
const selectColor = debug$4.selectColor;
const humanize = debug$4.humanize;
const names = debug$4.names;
const skips = debug$4.skips;
const formatters = debug$4.formatters;

const debug$5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  coerce: coerce,
  default: debug$4,
  disable: disable,
  enable: enable,
  enabled: enabled,
  formatArgs: formatArgs,
  formatters: formatters,
  humanize: humanize,
  log: log,
  names: names,
  selectColor: selectColor,
  skips: skips
}, Symbol.toStringTag, { value: 'Module' }));

const require$$2$9 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(debug$5);

const require$$0$j = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(differenceWith$1);

const require$$1$d = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(get$1);

const require$$2$8 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(isEmpty$5);

const require$$3$4 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(max$1);

//Get schema-aware table name
function getTableName$3(tableName, schemaName) {
  return schemaName ? `${schemaName}.${tableName}` : tableName;
}

//Get schema-aware query builder for a given table and schema name
function getTable$2(trxOrKnex, tableName, schemaName) {
  return schemaName
    ? trxOrKnex(tableName).withSchema(schemaName)
    : trxOrKnex(tableName);
}
function getLockTableName$2(tableName) {
  return tableName + '_lock';
}

function getLockTableNameWithSchema$1(tableName, schemaName) {
  return schemaName
    ? schemaName + '.' + getLockTableName$2(tableName)
    : getLockTableName$2(tableName);
}

var tableResolver = {
  getLockTableName: getLockTableName$2,
  getLockTableNameWithSchema: getLockTableNameWithSchema$1,
  getTable: getTable$2,
  getTableName: getTableName$3,
};

const {
  getTable: getTable$1,
  getLockTableName: getLockTableName$1,
  getLockTableNameWithSchema,
  getTableName: getTableName$2,
} = tableResolver;

function ensureTable$1(tableName, schemaName, trxOrKnex) {
  const lockTable = getLockTableName$1(tableName);
  return getSchemaBuilder$1(trxOrKnex, schemaName)
    .hasTable(tableName)
    .then((exists) => {
      return !exists && _createMigrationTable(tableName, schemaName, trxOrKnex);
    })
    .then(() => {
      return getSchemaBuilder$1(trxOrKnex, schemaName).hasTable(lockTable);
    })
    .then((exists) => {
      return (
        !exists && _createMigrationLockTable(lockTable, schemaName, trxOrKnex)
      );
    })
    .then(() => {
      return getTable$1(trxOrKnex, lockTable, schemaName).select('*');
    })
    .then((data) => {
      return (
        !data.length && _insertLockRowIfNeeded(tableName, schemaName, trxOrKnex)
      );
    });
}

function _createMigrationTable(tableName, schemaName, trxOrKnex) {
  return getSchemaBuilder$1(trxOrKnex, schemaName).createTable(
    getTableName$2(tableName),
    function (t) {
      t.increments();
      t.string('name');
      t.integer('batch');
      t.timestamp('migration_time');
    }
  );
}

function _createMigrationLockTable(tableName, schemaName, trxOrKnex) {
  return getSchemaBuilder$1(trxOrKnex, schemaName).createTable(
    tableName,
    function (t) {
      t.increments('index').primary();
      t.integer('is_locked');
    }
  );
}

function _insertLockRowIfNeeded(tableName, schemaName, trxOrKnex) {
  const lockTableWithSchema = getLockTableNameWithSchema(tableName, schemaName);
  return trxOrKnex
    .select('*')
    .from(lockTableWithSchema)
    .then((data) => {
      return !data.length
        ? trxOrKnex.from(lockTableWithSchema).insert({ is_locked: 0 })
        : null;
    });
}

//Get schema-aware schema builder for a given schema nam
function getSchemaBuilder$1(trxOrKnex, schemaName) {
  return schemaName
    ? trxOrKnex.schema.withSchema(schemaName)
    : trxOrKnex.schema;
}

var tableCreator = {
  ensureTable: ensureTable$1,
  getSchemaBuilder: getSchemaBuilder$1,
};

const { getTableName: getTableName$1 } = tableResolver;
const { ensureTable } = tableCreator;

// Lists all available migration versions, as a sorted array.
function listAll(migrationSource, loadExtensions) {
  return migrationSource.getMigrations(loadExtensions);
}

// Lists all migrations that have been completed for the current db, as an
// array.
async function listCompleted(tableName, schemaName, trxOrKnex) {
  await ensureTable(tableName, schemaName, trxOrKnex);

  return await trxOrKnex
    .from(getTableName$1(tableName, schemaName))
    .orderBy('id')
    .select('name');
}

// Gets the migration list from the migration directory specified in config, as well as
// the list of completed migrations to check what should be run.
function listAllAndCompleted(config, trxOrKnex) {
  return Promise.all([
    listAll(config.migrationSource, config.loadExtensions),
    listCompleted(config.tableName, config.schemaName, trxOrKnex),
  ]);
}

var migrationListResolver$1 = {
  listAll,
  listAllAndCompleted,
  listCompleted,
};

const require$$0$i = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(path$6);

const require$$0$h = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(template$1);

const require$$1$c = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(fs$1);

const require$$1$b = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(flatten$3);

const fs = require$$1$c;
const flatten$2 = require$$1$b;
const path$5 = require$$0$i;
const { promisify: promisify$2 } = require$$1$e;

// Promisify common fs functions.
const stat = promisify$2(fs.stat);
const readFile$1 = promisify$2(fs.readFile);
const writeFile$1 = promisify$2(fs.writeFile);
const readdir$1 = promisify$2(fs.readdir);
const mkdir = promisify$2(fs.mkdir);

/**
 * Ensures the given path exists.
 *  - If the path already exist, it's fine - it does nothing.
 *  - If the path doesn't exist, it will create it.
 *
 * @param {string} path
 * @returns {Promise}
 */
function ensureDirectoryExists$2(dir) {
  return stat(dir).catch(() => mkdir(dir, { recursive: true }));
}

/**
 * Read a directory,
 * sorting folders and files by alphabetically order.
 * Can be browsed recursively.
 *
 * @param {string} dir
 * The directory to analyse
 *
 * @param {boolean} recursive
 * Browse directory recursively
 *
 * @returns {Promise<[string]>}
 * All found files, concatenated to the current dir
 */
async function getFilepathsInFolder$1(dir, recursive = false) {
  const pathsList = await readdir$1(dir);
  return flatten$2(
    await Promise.all(
      pathsList.sort().map(async (currentPath) => {
        const currentFile = path$5.resolve(dir, currentPath);
        const statFile = await stat(currentFile);
        if (statFile && statFile.isDirectory()) {
          if (recursive) {
            return await getFilepathsInFolder$1(currentFile, true);
          }
          return [];
        }
        return [currentFile];
      })
    )
  );
}

var fs_1 = {
  readdir: readdir$1,
  readFile: readFile$1,
  writeFile: writeFile$1,
  ensureDirectoryExists: ensureDirectoryExists$2,
  getFilepathsInFolder: getFilepathsInFolder$1,
};

const template = require$$0$h;

const { readFile, writeFile } = fs_1;

/**
 * Light wrapper over lodash templates making it safer to be used with javascript source code.
 *
 * In particular, doesn't interfere with use of interpolated strings in javascript.
 *
 * @param {string} content Template source
 * @param {_.TemplateOptions} options Template options
 */
const jsSourceTemplate = (content, options) =>
  template(content, {
    interpolate: /<%=([\s\S]+?)%>/g,
    ...options,
  });

/**
 * Compile the contents of specified (javascript) file as a lodash template
 *
 * @param {string} filePath Path of file to be used as template
 * @param {_.TemplateOptions} options Lodash template options
 */
const jsFileTemplate = async (filePath, options) => {
  const contentBuffer = await readFile(filePath);
  return jsSourceTemplate(contentBuffer.toString(), options);
};

/**
 * Write a javascript file using another file as a (lodash) template
 *
 * @param {string} targetFilePath
 * @param {string} sourceFilePath
 * @param {_.TemplateOptions} options options passed to lodash templates
 */
const writeJsFileUsingTemplate$2 = async (
  targetFilePath,
  sourceFilePath,
  options,
  variables
) =>
  writeFile(
    targetFilePath,
    (await jsFileTemplate(sourceFilePath, options))(variables)
  );

var template_1 = {
  writeJsFileUsingTemplate: writeJsFileUsingTemplate$2,
};

const require$$1$a = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(sortBy$1);

function commonjsRequire(path) {
	throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}

const require$$0$g = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(getPackageType);

var isModuleType;
var hasRequiredIsModuleType;

function requireIsModuleType () {
	if (hasRequiredIsModuleType) return isModuleType;
	hasRequiredIsModuleType = 1;
	const getPackageType = require$$0$g;

	isModuleType = async function isModuleType(filepath) {
	  return (
	    filepath.endsWith('.mjs') ||
	    (!filepath.endsWith('.cjs') &&
	      (await getPackageType(filepath)) === 'module')
	  );
	};
	return isModuleType;
}

const require$$1$9 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(url);

var importFile;
var hasRequiredImportFile;

function requireImportFile () {
	if (hasRequiredImportFile) return importFile;
	hasRequiredImportFile = 1;
	const isModuleType = /*@__PURE__*/ requireIsModuleType();

	/**
	 * imports 'mjs', else requires.
	 * NOTE: require me late!
	 * @param {string} filepath
	 */
	importFile = async function importFile(filepath) {
	  return (await isModuleType(filepath))
	    ? import(require$$1$9.pathToFileURL(filepath))
	    : commonjsRequire(filepath);
	};
	return importFile;
}

const path$4 = require$$0$i;
const DEFAULT_LOAD_EXTENSIONS$2 = Object.freeze([
  '.co',
  '.coffee',
  '.eg',
  '.iced',
  '.js',
  '.cjs',
  '.litcoffee',
  '.ls',
  '.ts',
]);

let AbstractMigrationsLoader$2 = class AbstractMigrationsLoader {
  constructor(migrationDirectories, sortDirsSeparately, loadExtensions) {
    this.sortDirsSeparately = sortDirsSeparately;

    if (!Array.isArray(migrationDirectories)) {
      migrationDirectories = [migrationDirectories];
    }
    this.migrationsPaths = migrationDirectories;
    this.loadExtensions = loadExtensions || DEFAULT_LOAD_EXTENSIONS$2;
  }

  getFile(migrationsInfo) {
    const absoluteDir = path$4.resolve(process.cwd(), migrationsInfo.directory);
    const _path = path$4.join(absoluteDir, migrationsInfo.file);
    const importFile = /*@__PURE__*/ requireImportFile(); // late import
    return importFile(_path);
  }
};

var MigrationsLoader = {
  DEFAULT_LOAD_EXTENSIONS: DEFAULT_LOAD_EXTENSIONS$2,
  AbstractMigrationsLoader: AbstractMigrationsLoader$2,
};

const path$3 = require$$0$i;
const sortBy = require$$1$a;

const { readdir } = fs_1;
const { AbstractMigrationsLoader: AbstractMigrationsLoader$1 } = MigrationsLoader;

let FsMigrations$1 = class FsMigrations extends AbstractMigrationsLoader$1 {
  /**
   * Gets the migration names
   * @returns Promise<string[]>
   */
  getMigrations(loadExtensions) {
    // Get a list of files in all specified migration directories
    const readMigrationsPromises = this.migrationsPaths.map((configDir) => {
      const absoluteDir = path$3.resolve(process.cwd(), configDir);
      return readdir(absoluteDir).then((files) => ({
        files,
        configDir,
        absoluteDir,
      }));
    });

    return Promise.all(readMigrationsPromises).then((allMigrations) => {
      const migrations = allMigrations.reduce((acc, migrationDirectory) => {
        // When true, files inside the folder should be sorted
        if (this.sortDirsSeparately) {
          migrationDirectory.files = migrationDirectory.files.sort();
        }

        migrationDirectory.files.forEach((file) =>
          acc.push({ file, directory: migrationDirectory.configDir })
        );

        return acc;
      }, []);

      // If true we have already sorted the migrations inside the folders
      // return the migrations fully qualified
      if (this.sortDirsSeparately) {
        return filterMigrations(
          this,
          migrations,
          loadExtensions || this.loadExtensions
        );
      }

      return filterMigrations(
        this,
        sortBy(migrations, 'file'),
        loadExtensions || this.loadExtensions
      );
    });
  }

  getMigrationName(migration) {
    return migration.file;
  }

  getMigration(migrationInfo) {
    return this.getFile(migrationInfo);
  }
};

function filterMigrations(migrationSource, migrations, loadExtensions) {
  return migrations.filter((migration) => {
    const migrationName = migrationSource.getMigrationName(migration);
    const extension = path$3.extname(migrationName);
    return loadExtensions.includes(extension);
  });
}

var fsMigrations = {
  FsMigrations: FsMigrations$1,
};

const require$$0$f = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(colorette);

function isString$6(value) {
  return typeof value === 'string';
}

function isNumber$3(value) {
  return typeof value === 'number';
}

function isBoolean$2(value) {
  return typeof value === 'boolean';
}

function isUndefined$1(value) {
  return typeof value === 'undefined';
}

function isObject$5(value) {
  return typeof value === 'object' && value !== null;
}

function isFunction$5(value) {
  return typeof value === 'function';
}

var is = {
  isString: isString$6,
  isNumber: isNumber$3,
  isBoolean: isBoolean$2,
  isUndefined: isUndefined$1,
  isObject: isObject$5,
  isFunction: isFunction$5,
};

const color = require$$0$f;
const { inspect } = require$$1$e;
const { isString: isString$5, isFunction: isFunction$4 } = is;

let Logger$3 = class Logger {
  constructor(config = {}) {
    const {
      log: {
        debug,
        warn,
        error,
        deprecate,
        inspectionDepth,
        enableColors,
      } = {},
    } = config;
    this._inspectionDepth = inspectionDepth || 5;
    this._enableColors = resolveIsEnabledColors(enableColors);
    this._debug = debug;
    this._warn = warn;
    this._error = error;
    this._deprecate = deprecate;
  }

  _log(message, userFn, colorFn) {
    if (userFn != null && !isFunction$4(userFn)) {
      throw new TypeError('Extensions to knex logger must be functions!');
    }

    if (isFunction$4(userFn)) {
      userFn(message);
      return;
    }

    if (!isString$5(message)) {
      message = inspect(message, {
        depth: this._inspectionDepth,
        colors: this._enableColors,
      });
    }

    console.log(colorFn ? colorFn(message) : message);
  }

  debug(message) {
    this._log(message, this._debug);
  }

  warn(message) {
    this._log(message, this._warn, color.yellow);
  }

  error(message) {
    this._log(message, this._error, color.red);
  }

  deprecate(method, alternative) {
    const message = `${method} is deprecated, please use ${alternative}`;

    this._log(message, this._deprecate, color.yellow);
  }
};

function resolveIsEnabledColors(enableColorsParam) {
  if (enableColorsParam != null) {
    return enableColorsParam;
  }

  if (process && process.stdout) {
    return process.stdout.isTTY;
  }

  return false;
}

var logger = Logger$3;

const { FsMigrations } = fsMigrations;
const Logger$2 = logger;
const { DEFAULT_LOAD_EXTENSIONS: DEFAULT_LOAD_EXTENSIONS$1 } = MigrationsLoader;
const defaultLogger$1 = new Logger$2();

const CONFIG_DEFAULT$1 = Object.freeze({
  extension: 'js',
  loadExtensions: DEFAULT_LOAD_EXTENSIONS$1,
  tableName: 'knex_migrations',
  schemaName: null,
  directory: './migrations',
  disableTransactions: false,
  disableMigrationsListValidation: false,
  sortDirsSeparately: false,
});

function getMergedConfig$4(config, currentConfig, logger = defaultLogger$1) {
  // config is the user specified config, mergedConfig has defaults and current config
  // applied to it.
  const mergedConfig = Object.assign(
    {},
    CONFIG_DEFAULT$1,
    currentConfig || {},
    config
  );

  if (
    config &&
    // If user specifies any FS related config,
    // clear specified migrationSource to avoid ambiguity
    (config.directory ||
      config.sortDirsSeparately !== undefined ||
      config.loadExtensions)
  ) {
    if (config.migrationSource) {
      logger.warn(
        'FS-related option specified for migration configuration. This resets migrationSource to default FsMigrations'
      );
    }
    mergedConfig.migrationSource = null;
  }

  // If the user has not specified any configs, we need to
  // default to fs migrations to maintain compatibility
  if (!mergedConfig.migrationSource) {
    mergedConfig.migrationSource = new FsMigrations(
      mergedConfig.directory,
      mergedConfig.sortDirsSeparately,
      mergedConfig.loadExtensions
    );
  }

  return mergedConfig;
}

var migratorConfigurationMerger = {
  getMergedConfig: getMergedConfig$4,
};

function yyyymmddhhmmss$2() {
  const now = new Date();

  return (
    now.getUTCFullYear().toString() +
    (now.getUTCMonth() + 1).toString().padStart(2, '0') +
    now.getUTCDate().toString().padStart(2, '0') +
    now.getUTCHours().toString().padStart(2, '0') +
    now.getUTCMinutes().toString().padStart(2, '0') +
    now.getUTCSeconds().toString().padStart(2, '0')
  );
}

var timestamp = { yyyymmddhhmmss: yyyymmddhhmmss$2 };

const path$2 = require$$0$i;
const { writeJsFileUsingTemplate: writeJsFileUsingTemplate$1 } = template_1;
const { getMergedConfig: getMergedConfig$3 } = migratorConfigurationMerger;
const { ensureDirectoryExists: ensureDirectoryExists$1 } = fs_1;
const { yyyymmddhhmmss: yyyymmddhhmmss$1 } = timestamp;

let MigrationGenerator$1 = class MigrationGenerator {
  constructor(migrationConfig, logger) {
    this.config = getMergedConfig$3(migrationConfig, undefined, logger);
  }

  // Creates a new migration, with a given name.
  async make(name, config, logger) {
    this.config = getMergedConfig$3(config, this.config, logger);
    if (!name) {
      return Promise.reject(
        new Error('A name must be specified for the generated migration')
      );
    }
    await this._ensureFolder();
    const createdMigrationFilePath = await this._writeNewMigration(name);
    return createdMigrationFilePath;
  }

  // Ensures a folder for the migrations exist, dependent on the migration
  // config settings.
  _ensureFolder() {
    const dirs = this._absoluteConfigDirs();

    const promises = dirs.map(ensureDirectoryExists$1);

    return Promise.all(promises);
  }

  _getStubPath() {
    return (
      this.config.stub ||
      path$2.join(__dirname, 'stub', this.config.extension + '.stub')
    );
  }

  _getNewMigrationName(name) {
    if (name[0] === '-') name = name.slice(1);
    return (
      yyyymmddhhmmss$1() + '_' + name + '.' + this.config.extension.split('-')[0]
    );
  }

  _getNewMigrationPath(name) {
    const fileName = this._getNewMigrationName(name);
    const dirs = this._absoluteConfigDirs();
    const dir = dirs.slice(-1)[0]; // Get last specified directory
    return path$2.join(dir, fileName);
  }

  // Write a new migration to disk, using the config and generated filename,
  // passing any `variables` given in the config to the template.
  async _writeNewMigration(name) {
    const migrationPath = this._getNewMigrationPath(name);
    await writeJsFileUsingTemplate$1(
      migrationPath,
      this._getStubPath(),
      { variable: 'd' },
      this.config.variables || {}
    );
    return migrationPath;
  }

  _absoluteConfigDirs() {
    const directories = Array.isArray(this.config.directory)
      ? this.config.directory
      : [this.config.directory];
    return directories.map((directory) => {
      if (!directory) {
        console.warn(
          'Failed to resolve config file, knex cannot determine where to generate migrations'
        );
      }
      return path$2.resolve(process.cwd(), directory);
    });
  }
};

var MigrationGenerator_1 = MigrationGenerator$1;

// Migrator
// -------
const differenceWith = require$$0$j;
const get = require$$1$d;
const isEmpty$4 = require$$2$8;
const max = require$$3$4;
const {
  getLockTableName,
  getTable,
  getTableName,
} = tableResolver;
const { getSchemaBuilder } = tableCreator;
const migrationListResolver = migrationListResolver$1;
const MigrationGenerator = MigrationGenerator_1;
const { getMergedConfig: getMergedConfig$2 } = migratorConfigurationMerger;
const { isBoolean: isBoolean$1, isFunction: isFunction$3 } = is;

class LockError extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'MigrationLocked';
  }
}

// The new migration we're performing, typically called from the `knex.migrate`
// interface on the main `knex` object. Passes the `knex` instance performing
// the migration.
let Migrator$1 = class Migrator {
  constructor(knex) {
    // Clone knex instance and remove post-processing that is unnecessary for internal queries from a cloned config
    if (isFunction$3(knex)) {
      if (!knex.isTransaction) {
        this.knex = knex.withUserParams({
          ...knex.userParams,
        });
      } else {
        this.knex = knex;
      }
    } else {
      this.knex = Object.assign({}, knex);
      this.knex.userParams = this.knex.userParams || {};
    }

    this.config = getMergedConfig$2(
      this.knex.client.config.migrations,
      undefined,
      this.knex.client.logger
    );
    this.generator = new MigrationGenerator(
      this.knex.client.config.migrations,
      this.knex.client.logger
    );
    this._activeMigration = {
      fileName: null,
    };
  }

  // Migrators to the latest configuration.
  async latest(config) {
    this._disableProcessing();
    this.config = getMergedConfig$2(config, this.config, this.knex.client.logger);

    const allAndCompleted = await migrationListResolver.listAllAndCompleted(
      this.config,
      this.knex
    );

    if (!this.config.disableMigrationsListValidation) {
      validateMigrationList(this.config.migrationSource, allAndCompleted);
    }

    const [all, completed] = allAndCompleted;

    const migrations = getNewMigrations(
      this.config.migrationSource,
      all,
      completed
    );

    const transactionForAll =
      !this.config.disableTransactions &&
      !(
        await Promise.all(
          migrations.map(async (migration) => {
            const migrationContents =
              await this.config.migrationSource.getMigration(migration);
            return !this._useTransaction(migrationContents);
          })
        )
      ).some((isTransactionUsed) => isTransactionUsed);

    if (transactionForAll) {
      return this.knex.transaction((trx) => {
        return this._runBatch(migrations, 'up', trx);
      });
    } else {
      return this._runBatch(migrations, 'up');
    }
  }

  // Runs the next migration that has not yet been run
  async up(config) {
    this._disableProcessing();
    this.config = getMergedConfig$2(config, this.config, this.knex.client.logger);

    const allAndCompleted = await migrationListResolver.listAllAndCompleted(
      this.config,
      this.knex
    );

    if (!this.config.disableMigrationsListValidation) {
      validateMigrationList(this.config.migrationSource, allAndCompleted);
    }
    const [all, completed] = allAndCompleted;

    const newMigrations = getNewMigrations(
      this.config.migrationSource,
      all,
      completed
    );

    let migrationToRun;
    const name = this.config.name;
    if (name) {
      if (!completed.includes(name)) {
        migrationToRun = newMigrations.find((migration) => {
          return (
            this.config.migrationSource.getMigrationName(migration) === name
          );
        });
        if (!migrationToRun) {
          throw new Error(`Migration "${name}" not found.`);
        }
      }
    } else {
      migrationToRun = newMigrations[0];
    }

    const useTransaction =
      !migrationToRun ||
      this._useTransaction(
        await this.config.migrationSource.getMigration(migrationToRun)
      );

    const migrationsToRun = [];
    if (migrationToRun) {
      migrationsToRun.push(migrationToRun);
    }

    const transactionForAll =
      !this.config.disableTransactions && (!migrationToRun || useTransaction);

    if (transactionForAll) {
      return await this.knex.transaction((trx) => {
        return this._runBatch(migrationsToRun, 'up', trx);
      });
    } else {
      return await this._runBatch(migrationsToRun, 'up');
    }
  }

  // Rollback the last "batch", or all, of migrations that were run.
  rollback(config, all = false) {
    this._disableProcessing();
    return new Promise((resolve, reject) => {
      try {
        this.config = getMergedConfig$2(
          config,
          this.config,
          this.knex.client.logger
        );
      } catch (e) {
        reject(e);
      }
      migrationListResolver
        .listAllAndCompleted(this.config, this.knex)
        .then((value) => {
          if (!this.config.disableMigrationsListValidation) {
            validateMigrationList(this.config.migrationSource, value);
          }
          return value;
        })
        .then((val) => {
          const [allMigrations, completedMigrations] = val;

          return all
            ? allMigrations
                .filter((migration) => {
                  return completedMigrations
                    .map((migration) => migration.name)
                    .includes(
                      this.config.migrationSource.getMigrationName(migration)
                    );
                })
                .reverse()
            : this._getLastBatch(val);
        })
        .then((migrations) => {
          return this._runBatch(migrations, 'down');
        })
        .then(resolve, reject);
    });
  }

  down(config) {
    this._disableProcessing();
    this.config = getMergedConfig$2(config, this.config, this.knex.client.logger);

    return migrationListResolver
      .listAllAndCompleted(this.config, this.knex)
      .then((value) => {
        if (!this.config.disableMigrationsListValidation) {
          validateMigrationList(this.config.migrationSource, value);
        }
        return value;
      })
      .then(([all, completed]) => {
        const completedMigrations = all.filter((migration) => {
          return completed
            .map((migration) => migration.name)
            .includes(this.config.migrationSource.getMigrationName(migration));
        });

        let migrationToRun;
        const name = this.config.name;
        if (name) {
          migrationToRun = completedMigrations.find((migration) => {
            return (
              this.config.migrationSource.getMigrationName(migration) === name
            );
          });
          if (!migrationToRun) {
            throw new Error(`Migration "${name}" was not run.`);
          }
        } else {
          migrationToRun = completedMigrations[completedMigrations.length - 1];
        }

        const migrationsToRun = [];
        if (migrationToRun) {
          migrationsToRun.push(migrationToRun);
        }

        return this._runBatch(migrationsToRun, 'down');
      });
  }

  status(config) {
    this._disableProcessing();
    this.config = getMergedConfig$2(config, this.config, this.knex.client.logger);

    return Promise.all([
      getTable(this.knex, this.config.tableName, this.config.schemaName).select(
        '*'
      ),
      migrationListResolver.listAll(this.config.migrationSource),
    ]).then(([db, code]) => db.length - code.length);
  }

  // Retrieves and returns the current migration version we're on, as a promise.
  // If no migrations have been run yet, return "none".
  currentVersion(config) {
    this._disableProcessing();
    this.config = getMergedConfig$2(config, this.config, this.knex.client.logger);

    return migrationListResolver
      .listCompleted(this.config.tableName, this.config.schemaName, this.knex)
      .then((completed) => {
        const val = max(completed.map((value) => value.name.split('_')[0]));
        return val === undefined ? 'none' : val;
      });
  }

  // list all migrations
  async list(config) {
    this._disableProcessing();
    this.config = getMergedConfig$2(config, this.config, this.knex.client.logger);

    const [all, completed] = await migrationListResolver.listAllAndCompleted(
      this.config,
      this.knex
    );

    if (!this.config.disableMigrationsListValidation) {
      validateMigrationList(this.config.migrationSource, [all, completed]);
    }

    const newMigrations = getNewMigrations(
      this.config.migrationSource,
      all,
      completed
    );
    return [completed, newMigrations];
  }

  async forceFreeMigrationsLock(config) {
    this._disableProcessing();
    this.config = getMergedConfig$2(config, this.config, this.knex.client.logger);
    const { schemaName, tableName } = this.config;
    const lockTableName = getLockTableName(tableName);
    const { knex } = this;
    const getLockTable = () => getTable(knex, lockTableName, schemaName);
    const tableExists = await getSchemaBuilder(knex, schemaName).hasTable(
      lockTableName
    );
    if (tableExists) {
      await getLockTable().del();
      await getLockTable().insert({
        is_locked: 0,
      });
    }
  }

  // Creates a new migration, with a given name.
  make(name, config) {
    return this.generator.make(name, config, this.knex.client.logger);
  }

  _disableProcessing() {
    if (this.knex.disableProcessing) {
      this.knex.disableProcessing();
    }
  }

  _lockMigrations(trx) {
    const tableName = getLockTableName(this.config.tableName);
    return getTable(this.knex, tableName, this.config.schemaName)
      .transacting(trx)
      .where('is_locked', '=', 0)
      .update({ is_locked: 1 })
      .then((rowCount) => {
        if (rowCount !== 1) {
          throw new Error('Migration table is already locked');
        }
      });
  }

  _getLock(trx) {
    const transact = trx ? (fn) => fn(trx) : (fn) => this.knex.transaction(fn);
    return transact((trx) => {
      return this._lockMigrations(trx);
    }).catch((err) => {
      throw new LockError(err.message);
    });
  }

  _freeLock(trx = this.knex) {
    const tableName = getLockTableName(this.config.tableName);
    return getTable(trx, tableName, this.config.schemaName).update({
      is_locked: 0,
    });
  }

  // Run a batch of current migrations, in sequence.
  async _runBatch(migrations, direction, trx) {
    const canGetLockInTransaction =
      this.knex.client.driverName !== 'cockroachdb';
    try {
      await this._getLock(canGetLockInTransaction ? trx : undefined);
      // When there is a wrapping transaction, some migrations
      // could have been done while waiting for the lock:
      const completed = trx
        ? await migrationListResolver.listCompleted(
            this.config.tableName,
            this.config.schemaName,
            trx
          )
        : [];

      migrations = getNewMigrations(
        this.config.migrationSource,
        migrations,
        completed
      );

      await Promise.all(
        migrations.map(this._validateMigrationStructure.bind(this))
      );

      let batchNo = await this._latestBatchNumber(trx);
      if (direction === 'up') batchNo++;
      const res = await this._waterfallBatch(
        batchNo,
        migrations,
        direction,
        trx
      );
      await this._freeLock(canGetLockInTransaction ? trx : undefined);
      return res;
    } catch (error) {
      let cleanupReady = Promise.resolve();

      if (error instanceof LockError) {
        // If locking error do not free the lock.
        this.knex.client.logger.warn(
          `Can't take lock to run migrations: ${error.message}`
        );
        this.knex.client.logger.warn(
          'If you are sure migrations are not running you can release the ' +
            "lock manually by running 'knex migrate:unlock'"
        );
      } else {
        if (this._activeMigration.fileName) {
          this.knex.client.logger.warn(
            `migration file "${this._activeMigration.fileName}" failed`
          );
        }
        this.knex.client.logger.warn(
          `migration failed with error: ${error.message}`
        );
        // If the error was not due to a locking issue, then remove the lock.
        cleanupReady = this._freeLock(
          canGetLockInTransaction ? trx : undefined
        );
      }

      try {
        await cleanupReady;
        // eslint-disable-next-line no-empty
      } catch (e) {}
      throw error;
    }
  }

  // Validates some migrations by requiring and checking for an `up` and `down`
  // function.
  async _validateMigrationStructure(migration) {
    const migrationName =
      this.config.migrationSource.getMigrationName(migration);
    // maybe promise
    const migrationContent = await this.config.migrationSource.getMigration(
      migration
    );
    if (
      typeof migrationContent.up !== 'function' ||
      typeof migrationContent.down !== 'function'
    ) {
      throw new Error(
        `Invalid migration: ${migrationName} must have both an up and down function`
      );
    }

    return migration;
  }

  // Get the last batch of migrations, by name, ordered by insert id in reverse
  // order.
  async _getLastBatch([allMigrations]) {
    const { tableName, schemaName } = this.config;
    const migrationNames = await getTable(this.knex, tableName, schemaName)
      .where('batch', function (qb) {
        qb.max('batch').from(getTableName(tableName, schemaName));
      })
      .orderBy('id', 'desc');

    const lastBatchMigrations = migrationNames.map((migration) => {
      return allMigrations.find((entry) => {
        return (
          this.config.migrationSource.getMigrationName(entry) === migration.name
        );
      });
    });
    return Promise.all(lastBatchMigrations);
  }

  // Returns the latest batch number.
  _latestBatchNumber(trx = this.knex) {
    return trx
      .from(getTableName(this.config.tableName, this.config.schemaName))
      .max('batch as max_batch')
      .then((obj) => obj[0].max_batch || 0);
  }

  // If transaction config for a single migration is defined, use that.
  // Otherwise, rely on the common config. This allows enabling/disabling
  // transaction for a single migration at will, regardless of the common
  // config.
  _useTransaction(migrationContent, allTransactionsDisabled) {
    const singleTransactionValue = get(migrationContent, 'config.transaction');

    return isBoolean$1(singleTransactionValue)
      ? singleTransactionValue
      : !allTransactionsDisabled;
  }

  // Runs a batch of `migrations` in a specified `direction`, saving the
  // appropriate database information as the migrations are run.
  _waterfallBatch(batchNo, migrations, direction, trx) {
    const trxOrKnex = trx || this.knex;
    const { tableName, schemaName, disableTransactions } = this.config;
    let current = Promise.resolve();
    const log = [];
    migrations.forEach((migration) => {
      const name = this.config.migrationSource.getMigrationName(migration);
      this._activeMigration.fileName = name;
      const migrationContent =
        this.config.migrationSource.getMigration(migration);

      // We're going to run each of the migrations in the current "up".
      current = current
        .then(async () => await migrationContent) //maybe promise
        .then((migrationContent) => {
          this._activeMigration.fileName = name;
          if (
            !trx &&
            this._useTransaction(migrationContent, disableTransactions)
          ) {
            this.knex.enableProcessing();
            return this._transaction(
              this.knex,
              migrationContent,
              direction,
              name
            );
          }

          trxOrKnex.enableProcessing();
          return checkPromise(
            this.knex.client.logger,
            migrationContent[direction](trxOrKnex),
            name
          );
        })
        .then(() => {
          trxOrKnex.disableProcessing();
          this.knex.disableProcessing();
          log.push(name);
          if (direction === 'up') {
            return trxOrKnex.into(getTableName(tableName, schemaName)).insert({
              name,
              batch: batchNo,
              migration_time: new Date(),
            });
          }
          if (direction === 'down') {
            return trxOrKnex
              .from(getTableName(tableName, schemaName))
              .where({ name })
              .del();
          }
        });
    });

    return current.then(() => [batchNo, log]);
  }

  _transaction(knex, migrationContent, direction, name) {
    return knex.transaction((trx) => {
      return checkPromise(
        knex.client.logger,
        migrationContent[direction](trx),
        name,
        () => {
          trx.commit();
        }
      );
    });
  }
};

// Validates that migrations are present in the appropriate directories.
function validateMigrationList(migrationSource, migrations) {
  const [all, completed] = migrations;
  const diff = getMissingMigrations(migrationSource, completed, all);
  if (!isEmpty$4(diff)) {
    const names = diff.map((d) => d.name);
    throw new Error(
      `The migration directory is corrupt, the following files are missing: ${names.join(
        ', '
      )}`
    );
  }
}

function getMissingMigrations(migrationSource, completed, all) {
  return differenceWith(completed, all, (c, a) => {
    return c.name === migrationSource.getMigrationName(a);
  });
}

function getNewMigrations(migrationSource, all, completed) {
  return differenceWith(all, completed, (a, c) => {
    return c.name === migrationSource.getMigrationName(a);
  });
}

function checkPromise(logger, migrationPromise, name, commitFn) {
  if (!migrationPromise || typeof migrationPromise.then !== 'function') {
    logger.warn(`migration ${name} did not return a promise`);
    if (commitFn) {
      commitFn();
    }
  }
  return migrationPromise;
}

var Migrator_1 = {
  Migrator: Migrator$1,
};

const require$$2$7 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(includes$1);

const path$1 = require$$0$i;
const flatten$1 = require$$1$b;
const includes = require$$2$7;
const { AbstractMigrationsLoader } = MigrationsLoader;
const { getFilepathsInFolder } = fs_1;

const filterByLoadExtensions = (extensions) => (value) => {
  const extension = path$1.extname(value);
  return includes(extensions, extension);
};

let FsSeeds$1 = class FsSeeds extends AbstractMigrationsLoader {
  _getConfigDirectories(logger) {
    const directories = this.migrationsPaths;
    return directories.map((directory) => {
      if (!directory) {
        logger.warn(
          'Empty value passed as a directory for Seeder, this is not supported.'
        );
      }
      return path$1.resolve(process.cwd(), directory);
    });
  }

  async getSeeds(config) {
    const { loadExtensions, recursive, specific } = config;

    const seeds = flatten$1(
      await Promise.all(
        this._getConfigDirectories(config.logger).map((d) =>
          getFilepathsInFolder(d, recursive)
        )
      )
    );

    // if true, each dir are already sorted
    // (getFilepathsInFolderRecursively does this)
    // if false, we need to sort all the seeds
    let files = seeds.filter(filterByLoadExtensions(loadExtensions));
    if (!this.sortDirsSeparately) {
      files.sort();
    }

    if (specific) {
      files = files.filter((file) => path$1.basename(file) === specific);
      if (files.length === 0) {
        throw new Error(
          `Invalid argument provided: the specific seed "${specific}" does not exist.`
        );
      }
    }

    return files;
  }

  async getSeed(filepath) {
    const importFile = /*@__PURE__*/ requireImportFile(); // late import
    const seed = await importFile(filepath);
    return seed;
  }
};

var fsSeeds = {
  FsSeeds: FsSeeds$1,
};

const { FsSeeds } = fsSeeds;
const Logger$1 = logger;
const { DEFAULT_LOAD_EXTENSIONS } = MigrationsLoader;
const defaultLogger = new Logger$1();

const CONFIG_DEFAULT = Object.freeze({
  extension: 'js',
  directory: './seeds',
  loadExtensions: DEFAULT_LOAD_EXTENSIONS,
  specific: null,
  timestampFilenamePrefix: false,
  recursive: false,
  sortDirsSeparately: false,
});

function getMergedConfig$1(config, currentConfig, logger = defaultLogger) {
  // config is the user specified config, mergedConfig has defaults and current config
  // applied to it.
  const mergedConfig = Object.assign(
    {},
    CONFIG_DEFAULT,
    currentConfig || {},
    config,
    {
      logger,
    }
  );

  if (
    config &&
    // If user specifies any FS related config,
    // clear specified migrationSource to avoid ambiguity
    (config.directory ||
      config.sortDirsSeparately !== undefined ||
      config.loadExtensions)
  ) {
    if (config.seedSource) {
      logger.warn(
        'FS-related option specified for seed configuration. This resets seedSource to default FsMigrations'
      );
    }
    mergedConfig.seedSource = null;
  }

  // If the user has not specified any configs, we need to
  // default to fs migrations to maintain compatibility
  if (!mergedConfig.seedSource) {
    mergedConfig.seedSource = new FsSeeds(
      mergedConfig.directory,
      mergedConfig.sortDirsSeparately,
      mergedConfig.loadExtensions
    );
  }

  return mergedConfig;
}

var seederConfigurationMerger = {
  getMergedConfig: getMergedConfig$1,
};

// Seeder
// -------

const path = require$$0$i;
const { ensureDirectoryExists } = fs_1;
const { writeJsFileUsingTemplate } = template_1;
const { yyyymmddhhmmss } = timestamp;
const { getMergedConfig } = seederConfigurationMerger;

// The new seeds we're performing, typically called from the `knex.seed`
// interface on the main `knex` object. Passes the `knex` instance performing
// the seeds.
let Seeder$1 = class Seeder {
  constructor(knex) {
    this.knex = knex;
    this.config = this.resolveConfig(knex.client.config.seeds);
  }

  // Runs seed files for the given environment.
  async run(config) {
    this.config = this.resolveConfig(config);
    const files = await this.config.seedSource.getSeeds(this.config);
    return this._runSeeds(files);
  }

  // Creates a new seed file, with a given name.
  async make(name, config) {
    this.config = this.resolveConfig(config);
    if (!name)
      throw new Error('A name must be specified for the generated seed');
    await this._ensureFolder(config);
    const seedPath = await this._writeNewSeed(name);
    return seedPath;
  }

  // Ensures a folder for the seeds exist, dependent on the
  // seed config settings.
  _ensureFolder() {
    const dirs = this.config.seedSource._getConfigDirectories(
      this.config.logger
    );
    const promises = dirs.map(ensureDirectoryExists);
    return Promise.all(promises);
  }

  // Run seed files, in sequence.
  async _runSeeds(seeds) {
    for (const seed of seeds) {
      await this._validateSeedStructure(seed);
    }
    return this._waterfallBatch(seeds);
  }

  async _validateSeedStructure(filepath) {
    const seed = await this.config.seedSource.getSeed(filepath);
    if (typeof seed.seed !== 'function') {
      throw new Error(
        `Invalid seed file: ${filepath} must have a seed function`
      );
    }
    return filepath;
  }

  _getStubPath() {
    return (
      this.config.stub ||
      path.join(__dirname, 'stub', this.config.extension + '.stub')
    );
  }

  _getNewStubFileName(name) {
    if (name[0] === '-') name = name.slice(1);

    if (this.config.timestampFilenamePrefix === true) {
      name = `${yyyymmddhhmmss()}_${name}`;
    }

    return `${name}.${this.config.extension}`;
  }

  _getNewStubFilePath(name) {
    const fileName = this._getNewStubFileName(name);
    const dirs = this.config.seedSource._getConfigDirectories(
      this.config.logger
    );
    const dir = dirs.slice(-1)[0]; // Get last specified directory
    return path.join(dir, fileName);
  }

  // Write a new seed to disk, using the config and generated filename,
  // passing any `variables` given in the config to the template.
  async _writeNewSeed(name) {
    const seedPath = this._getNewStubFilePath(name);
    await writeJsFileUsingTemplate(
      seedPath,
      this._getStubPath(),
      { variable: 'd' },
      this.config.variables || {}
    );
    return seedPath;
  }

  async _listAll(config) {
    this.config = this.resolveConfig(config);
    return this.config.seedSource.getSeeds(this.config);
  }

  // Runs a batch of seed files.
  async _waterfallBatch(seeds) {
    const { knex } = this;
    const log = [];
    for (const seedPath of seeds) {
      const seed = await this.config.seedSource.getSeed(seedPath);
      try {
        await seed.seed(knex);
        log.push(seedPath);
      } catch (originalError) {
        const error = new Error(
          `Error while executing "${seedPath}" seed: ${originalError.message}`
        );
        error.original = originalError;
        error.stack =
          error.stack.split('\n').slice(0, 2).join('\n') +
          '\n' +
          originalError.stack;
        throw error;
      }
    }
    return [log];
  }

  resolveConfig(config) {
    return getMergedConfig(config, this.config, this.knex.client.logger);
  }
};

var Seeder_1 = Seeder$1;

// FunctionHelper
// -------
// Used for adding functions from the builder
// Example usage: table.dateTime('datetime_to_date').notNull().defaultTo(knex.fn.now());
let FunctionHelper$1 = class FunctionHelper {
  constructor(client) {
    this.client = client;
  }

  now(precision) {
    if (typeof precision === 'number') {
      return this.client.raw(`CURRENT_TIMESTAMP(${precision})`);
    }
    return this.client.raw('CURRENT_TIMESTAMP');
  }

  uuid() {
    switch (this.client.driverName) {
      case 'sqlite3':
      case 'better-sqlite3':
        return this.client.raw(
          "(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"
        );
      case 'mssql':
        return this.client.raw('(NEWID())');
      case 'pg':
      case 'pgnative':
      case 'cockroachdb':
        return this.client.raw('(gen_random_uuid())');
      case 'oracle':
      case 'oracledb':
        return this.client.raw('(random_uuid())');
      case 'mysql':
      case 'mysql2':
        return this.client.raw('(UUID())');
      default:
        throw new Error(
          `${this.client.driverName} does not have a uuid function`
        );
    }
  }

  uuidToBin(uuid, ordered = true) {
    const buf = Buffer.from(uuid.replace(/-/g, ''), 'hex');
    return ordered
      ? Buffer.concat([
          buf.slice(6, 8),
          buf.slice(4, 6),
          buf.slice(0, 4),
          buf.slice(8, 16),
        ])
      : Buffer.concat([
          buf.slice(0, 4),
          buf.slice(4, 6),
          buf.slice(6, 8),
          buf.slice(8, 16),
        ]);
  }

  binToUuid(bin, ordered = true) {
    const buf = Buffer.from(bin, 'hex');
    return ordered
      ? [
          buf.toString('hex', 4, 8),
          buf.toString('hex', 2, 4),
          buf.toString('hex', 0, 2),
          buf.toString('hex', 8, 10),
          buf.toString('hex', 10, 16),
        ].join('-')
      : [
          buf.toString('hex', 0, 4),
          buf.toString('hex', 4, 6),
          buf.toString('hex', 6, 8),
          buf.toString('hex', 8, 10),
          buf.toString('hex', 10, 16),
        ].join('-');
  }
};

var FunctionHelper_1 = FunctionHelper$1;

// All properties we can use to start a query chain
// from the `knex` object, e.g. `knex.select('*').from(...`
var methodConstants = [
  'with',
  'withRecursive',
  'withMaterialized',
  'withNotMaterialized',
  'select',
  'as',
  'columns',
  'column',
  'from',
  'fromJS',
  'fromRaw',
  'into',
  'withSchema',
  'table',
  'distinct',
  'join',
  'joinRaw',
  'innerJoin',
  'leftJoin',
  'leftOuterJoin',
  'rightJoin',
  'rightOuterJoin',
  'outerJoin',
  'fullOuterJoin',
  'crossJoin',
  'where',
  'andWhere',
  'orWhere',
  'whereNot',
  'orWhereNot',
  'whereLike',
  'andWhereLike',
  'orWhereLike',
  'whereILike',
  'andWhereILike',
  'orWhereILike',
  'whereRaw',
  'whereWrapped',
  'havingWrapped',
  'orWhereRaw',
  'whereExists',
  'orWhereExists',
  'whereNotExists',
  'orWhereNotExists',
  'whereIn',
  'orWhereIn',
  'whereNotIn',
  'orWhereNotIn',
  'whereNull',
  'orWhereNull',
  'whereNotNull',
  'orWhereNotNull',
  'whereBetween',
  'whereNotBetween',
  'andWhereBetween',
  'andWhereNotBetween',
  'orWhereBetween',
  'orWhereNotBetween',
  'groupBy',
  'groupByRaw',
  'orderBy',
  'orderByRaw',
  'union',
  'unionAll',
  'intersect',
  'except',
  'having',
  'havingRaw',
  'orHaving',
  'orHavingRaw',
  'offset',
  'limit',
  'count',
  'countDistinct',
  'min',
  'max',
  'sum',
  'sumDistinct',
  'avg',
  'avgDistinct',
  'increment',
  'decrement',
  'first',
  'debug',
  'pluck',
  'clearSelect',
  'clearWhere',
  'clearGroup',
  'clearOrder',
  'clearHaving',
  'insert',
  'update',
  'returning',
  'del',
  'delete',
  'truncate',
  'transacting',
  'connection',

  // JSON methods

  // Json manipulation functions
  'jsonExtract',
  'jsonSet',
  'jsonInsert',
  'jsonRemove',

  // Wheres Json
  'whereJsonObject',
  'orWhereJsonObject',
  'andWhereJsonObject',
  'whereNotJsonObject',
  'orWhereNotJsonObject',
  'andWhereNotJsonObject',

  'whereJsonPath',
  'orWhereJsonPath',
  'andWhereJsonPath',

  'whereJsonSupersetOf',
  'orWhereJsonSupersetOf',
  'andWhereJsonSupersetOf',
  'whereJsonNotSupersetOf',
  'orWhereJsonNotSupersetOf',
  'andWhereJsonNotSupersetOf',

  'whereJsonSubsetOf',
  'orWhereJsonSubsetOf',
  'andWhereJsonSubsetOf',
  'whereJsonNotSubsetOf',
  'orWhereJsonNotSubsetOf',
  'andWhereJsonNotSubsetOf',
];

const require$$5$1 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(merge$1);

const require$$0$e = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(chunk$1);

/**
 * @param {number} delay
 * @returns {Promise<void>}
 */

var delay$1 = (delay) =>
  new Promise((resolve) => setTimeout(resolve, delay));

const chunk = require$$0$e;
const flatten = require$$1$b;
const delay = delay$1;
const { isNumber: isNumber$2 } = is;

function batchInsert$1(client, tableName, batch, chunkSize = 1000) {
  let returning = undefined;
  let transaction = null;
  if (!isNumber$2(chunkSize) || chunkSize < 1) {
    throw new TypeError(`Invalid chunkSize: ${chunkSize}`);
  }
  if (!Array.isArray(batch)) {
    throw new TypeError(`Invalid batch: Expected array, got ${typeof batch}`);
  }
  const chunks = chunk(batch, chunkSize);

  const runInTransaction = (cb) => {
    if (transaction) {
      return cb(transaction);
    }
    return client.transaction(cb);
  };

  return Object.assign(
    Promise.resolve().then(async () => {
      //Next tick to ensure wrapper functions are called if needed
      await delay(1);
      return runInTransaction(async (tr) => {
        const chunksResults = [];
        for (const items of chunks) {
          chunksResults.push(await tr(tableName).insert(items, returning));
        }
        return flatten(chunksResults);
      });
    }),
    {
      returning(columns) {
        returning = columns;

        return this;
      },
      transacting(tr) {
        transaction = tr;

        return this;
      },
    }
  );
}

var batchInsert_1 = batchInsert$1;

/**
 * Sets a hidden (non-enumerable) property on the `target` object, copying it
 * from `source`.
 *
 * This is useful when we want to protect certain data from being accidentally
 * leaked through logs, also when the property is non-enumerable on the `source`
 * object and we want to ensure that it is properly copied.
 *
 * @param {object} target
 * @param {object} source - default: target
 * @param {string} propertyName - default: 'password'
 */

function setHiddenProperty$2(target, source, propertyName = 'password') {
  if (!source) {
    source = target;
  }

  Object.defineProperty(target, propertyName, {
    enumerable: false,
    value: source[propertyName],
  });
}

var security = {
  setHiddenProperty: setHiddenProperty$2,
};

const { EventEmitter: EventEmitter$9 } = require$$2$b;

const { Migrator } = Migrator_1;
const Seeder = Seeder_1;
const FunctionHelper = FunctionHelper_1;
const QueryInterface$1 = methodConstants;
const merge = require$$5$1;
const batchInsert = batchInsert_1;
const { isObject: isObject$4 } = is;
const { setHiddenProperty: setHiddenProperty$1 } = security;

// Javascript does not officially support "callable objects".  Instead,
// you must create a regular Function and inject properties/methods
// into it.  In other words: you can't leverage Prototype Inheritance
// to share the property/method definitions.
//
// To work around this, we're creating an Object Property Definition.
// This allow us to quickly inject everything into the `knex` function
// via the `Object.defineProperties(..)` function.  More importantly,
// it allows the same definitions to be shared across `knex` instances.
const KNEX_PROPERTY_DEFINITIONS = {
  client: {
    get() {
      return this.context.client;
    },
    set(client) {
      this.context.client = client;
    },
    configurable: true,
  },

  userParams: {
    get() {
      return this.context.userParams;
    },
    set(userParams) {
      this.context.userParams = userParams;
    },
    configurable: true,
  },

  schema: {
    get() {
      return this.client.schemaBuilder();
    },
    configurable: true,
  },

  migrate: {
    get() {
      return new Migrator(this);
    },
    configurable: true,
  },

  seed: {
    get() {
      return new Seeder(this);
    },
    configurable: true,
  },

  fn: {
    get() {
      return new FunctionHelper(this.client);
    },
    configurable: true,
  },
};

// `knex` instances serve as proxies around `context` objects.  So, calling
// any of these methods on the `knex` instance will forward the call to
// the `knex.context` object. This ensures that `this` will correctly refer
// to `context` within each of these methods.
const CONTEXT_METHODS = [
  'raw',
  'batchInsert',
  'transaction',
  'transactionProvider',
  'initialize',
  'destroy',
  'ref',
  'withUserParams',
  'queryBuilder',
  'disableProcessing',
  'enableProcessing',
];

for (const m of CONTEXT_METHODS) {
  KNEX_PROPERTY_DEFINITIONS[m] = {
    value: function (...args) {
      return this.context[m](...args);
    },
    configurable: true,
  };
}

function makeKnex$2(client) {
  // The object we're potentially using to kick off an initial chain.
  function knex(tableName, options) {
    return createQueryBuilder(knex.context, tableName, options);
  }

  redefineProperties(knex, client);
  return knex;
}

function initContext(knexFn) {
  const knexContext = knexFn.context || {};
  Object.assign(knexContext, {
    queryBuilder() {
      return this.client.queryBuilder();
    },

    raw() {
      return this.client.raw.apply(this.client, arguments);
    },

    batchInsert(table, batch, chunkSize = 1000) {
      return batchInsert(this, table, batch, chunkSize);
    },

    // Creates a new transaction.
    // If container is provided, returns a promise for when the transaction is resolved.
    // If container is not provided, returns a promise with a transaction that is resolved
    // when transaction is ready to be used.
    transaction(container, _config) {
      // Overload support of `transaction(config)`
      if (!_config && isObject$4(container)) {
        _config = container;
        container = null;
      }

      const config = Object.assign({}, _config);
      config.userParams = this.userParams || {};
      if (config.doNotRejectOnRollback === undefined) {
        config.doNotRejectOnRollback = true;
      }

      return this._transaction(container, config);
    },

    // Internal method that actually establishes the Transaction.  It makes no assumptions
    // about the `config` or `outerTx`, and expects the caller to handle these details.
    _transaction(container, config, outerTx = null) {
      if (container) {
        const trx = this.client.transaction(container, config, outerTx);
        return trx;
      } else {
        return new Promise((resolve, reject) => {
          this.client.transaction(resolve, config, outerTx).catch(reject);
        });
      }
    },

    transactionProvider(config) {
      let trx;
      return () => {
        if (!trx) {
          trx = this.transaction(undefined, config);
        }
        return trx;
      };
    },

    // Typically never needed, initializes the pool for a knex client.
    initialize(config) {
      return this.client.initializePool(config);
    },

    // Convenience method for tearing down the pool.
    destroy(callback) {
      return this.client.destroy(callback);
    },

    ref(ref) {
      return this.client.ref(ref);
    },

    // Do not document this as public API until naming and API is improved for general consumption
    // This method exists to disable processing of internal queries in migrations
    disableProcessing() {
      if (this.userParams.isProcessingDisabled) {
        return;
      }
      this.userParams.wrapIdentifier = this.client.config.wrapIdentifier;
      this.userParams.postProcessResponse =
        this.client.config.postProcessResponse;
      this.client.config.wrapIdentifier = null;
      this.client.config.postProcessResponse = null;
      this.userParams.isProcessingDisabled = true;
    },

    // Do not document this as public API until naming and API is improved for general consumption
    // This method exists to enable execution of non-internal queries with consistent identifier naming in migrations
    enableProcessing() {
      if (!this.userParams.isProcessingDisabled) {
        return;
      }
      this.client.config.wrapIdentifier = this.userParams.wrapIdentifier;
      this.client.config.postProcessResponse =
        this.userParams.postProcessResponse;
      this.userParams.isProcessingDisabled = false;
    },

    withUserParams(params) {
      const knexClone = shallowCloneFunction(knexFn); // We need to include getters in our clone
      if (this.client) {
        knexClone.client = Object.create(this.client.constructor.prototype); // Clone client to avoid leaking listeners that are set on it
        merge(knexClone.client, this.client);
        knexClone.client.config = Object.assign({}, this.client.config); // Clone client config to make sure they can be modified independently

        if (this.client.config.password) {
          setHiddenProperty$1(knexClone.client.config, this.client.config);
        }
      }

      redefineProperties(knexClone, knexClone.client);
      _copyEventListeners('query', knexFn, knexClone);
      _copyEventListeners('query-error', knexFn, knexClone);
      _copyEventListeners('query-response', knexFn, knexClone);
      _copyEventListeners('start', knexFn, knexClone);
      knexClone.userParams = params;
      return knexClone;
    },
  });

  if (!knexFn.context) {
    knexFn.context = knexContext;
  }
}

function _copyEventListeners(eventName, sourceKnex, targetKnex) {
  const listeners = sourceKnex.listeners(eventName);
  listeners.forEach((listener) => {
    targetKnex.on(eventName, listener);
  });
}

function redefineProperties(knex, client) {
  // Allow chaining methods from the root object, before
  // any other information is specified.
  //
  // TODO: `QueryBuilder.extend(..)` allows new QueryBuilder
  //       methods to be introduced via external components.
  //       As a side-effect, it also pushes the new method names
  //       into the `QueryInterface` array.
  //
  //       The Problem: due to the way the code is currently
  //       structured, these new methods cannot be retroactively
  //       injected into existing `knex` instances!  As a result,
  //       some `knex` instances will support the methods, and
  //       others will not.
  //
  //       We should revisit this once we figure out the desired
  //       behavior / usage.  For instance: do we really want to
  //       allow external components to directly manipulate `knex`
  //       data structures?  Or, should we come up w/ a different
  //       approach that avoids side-effects / mutation?
  //
  //      (FYI: I noticed this issue because I attempted to integrate
  //       this logic directly into the `KNEX_PROPERTY_DEFINITIONS`
  //       construction.  However, `KNEX_PROPERTY_DEFINITIONS` is
  //       constructed before any `knex` instances are created.
  //       As a result, the method extensions were missing from all
  //       `knex` instances.)
  for (let i = 0; i < QueryInterface$1.length; i++) {
    const method = QueryInterface$1[i];
    knex[method] = function () {
      const builder = this.queryBuilder();
      return builder[method].apply(builder, arguments);
    };
  }

  Object.defineProperties(knex, KNEX_PROPERTY_DEFINITIONS);

  initContext(knex);
  knex.client = client;
  knex.userParams = {};

  // Hook up the "knex" object as an EventEmitter.
  const ee = new EventEmitter$9();
  for (const key in ee) {
    knex[key] = ee[key];
  }

  // Unfortunately, something seems to be broken in Node 6 and removing events from a clone also mutates original Knex,
  // which is highly undesirable
  if (knex._internalListeners) {
    knex._internalListeners.forEach(({ eventName, listener }) => {
      knex.client.removeListener(eventName, listener); // Remove duplicates for copies
    });
  }
  knex._internalListeners = [];

  // Passthrough all "start" and "query" events to the knex object.
  _addInternalListener(knex, 'start', (obj) => {
    knex.emit('start', obj);
  });
  _addInternalListener(knex, 'query', (obj) => {
    knex.emit('query', obj);
  });
  _addInternalListener(knex, 'query-error', (err, obj) => {
    knex.emit('query-error', err, obj);
  });
  _addInternalListener(knex, 'query-response', (response, obj, builder) => {
    knex.emit('query-response', response, obj, builder);
  });
}

function _addInternalListener(knex, eventName, listener) {
  knex.client.on(eventName, listener);
  knex._internalListeners.push({
    eventName,
    listener,
  });
}

function createQueryBuilder(knexContext, tableName, options) {
  const qb = knexContext.queryBuilder();
  if (!tableName)
    knexContext.client.logger.warn(
      'calling knex without a tableName is deprecated. Use knex.queryBuilder() instead.'
    );
  return tableName ? qb.table(tableName, options) : qb;
}

function shallowCloneFunction(originalFunction) {
  const fnContext = Object.create(
    Object.getPrototypeOf(originalFunction),
    Object.getOwnPropertyDescriptors(originalFunction)
  );

  const knexContext = {};
  const knexFnWrapper = (tableName, options) => {
    return createQueryBuilder(knexContext, tableName, options);
  };

  const clonedFunction = knexFnWrapper.bind(fnContext);
  Object.assign(clonedFunction, originalFunction);
  clonedFunction.context = knexContext;
  return clonedFunction;
}

var makeKnex_1 = makeKnex$2;

var noop$1 = function () {};

const noop = noop$1;

const finallyMixin$2 = (prototype) =>
  Object.assign(prototype, {
    finally(onFinally) {
      return this.then().finally(onFinally);
    },
  });

// FYI: Support for `Promise.prototype.finally` was not introduced until Node 9.
//      Therefore, Knex will need to conditionally inject support for `.finally(..)`
//      until support for Node 8 is officially dropped.
var finallyMixin_1 = Promise.prototype.finally ? finallyMixin$2 : noop;

// Transaction
// -------
const { EventEmitter: EventEmitter$8 } = require$$2$b;
const Debug = require$$2$9;
const uniqueId$1 = require$$6;
const { callbackify: callbackify$1 } = require$$1$e;

const makeKnex$1 = makeKnex_1;
const { timeout, KnexTimeoutError: KnexTimeoutError$2 } = timeout$3;
const finallyMixin$1 = finallyMixin_1;

const debug$3 = Debug('knex:tx');

// FYI: This is defined as a function instead of a constant so that
//      each Transactor can have its own copy of the default config.
//      This will minimize the impact of bugs that might be introduced
//      if a Transactor ever mutates its config.
function DEFAULT_CONFIG() {
  return {
    userParams: {},
    doNotRejectOnRollback: true,
  };
}
// These aren't supported in sqlite3 which is serialized already so it's as
// safe as reasonable, except for a special read_uncommitted pragma
const validIsolationLevels = [
  // Doesn't really work in postgres, it treats it as read committed
  'read uncommitted',
  'read committed',
  'snapshot',
  // snapshot and repeatable read are basically the same, most "repeatable
  // read" implementations are actually "snapshot" also known as Multi Version
  // Concurrency Control (MVCC). Mssql's repeatable read doesn't stop
  // repeated reads for inserts as it uses a pessimistic locking system so
  // you should probably use 'snapshot' to stop read skew.
  'repeatable read',
  // mysql pretends to have serializable, but it is not
  'serializable',
];

// Acts as a facade for a Promise, keeping the internal state
// and managing any child transactions.
let Transaction$1 = class Transaction extends EventEmitter$8 {
  constructor(client, container, config = DEFAULT_CONFIG(), outerTx = null) {
    super();
    this.userParams = config.userParams;
    this.doNotRejectOnRollback = config.doNotRejectOnRollback;

    const txid = (this.txid = uniqueId$1('trx'));

    this.client = client;
    this.logger = client.logger;
    this.outerTx = outerTx;
    this.trxClient = undefined;
    this._completed = false;
    this._debug = client.config && client.config.debug;

    this.readOnly = config.readOnly;
    if (config.isolationLevel) {
      this.setIsolationLevel(config.isolationLevel);
    }

    debug$3(
      '%s: Starting %s transaction',
      txid,
      outerTx ? 'nested' : 'top level'
    );

    // `this` can potentially serve as an `outerTx` for another
    // Transaction.  So, go ahead and establish `_lastChild` now.
    this._lastChild = Promise.resolve();

    const _previousSibling = outerTx ? outerTx._lastChild : Promise.resolve();

    // FYI: As you will see in a moment, this Promise will be used to construct
    //      2 separate Promise Chains.  This ensures that each Promise Chain
    //      can establish its error-handling semantics without interfering
    //      with the other Promise Chain.
    const basePromise = _previousSibling.then(() =>
      this._evaluateContainer(config, container)
    );

    // FYI: This is the Promise Chain for EXTERNAL use.  It ensures that the
    //      caller must handle any exceptions that result from `basePromise`.
    this._promise = basePromise.then((x) => x);

    if (outerTx) {
      // FYI: This is the Promise Chain for INTERNAL use.  It serves as a signal
      //      for when the next sibling should begin its execution.  Therefore,
      //      exceptions are caught and ignored.
      outerTx._lastChild = basePromise.catch(() => {});
    }
  }

  isCompleted() {
    return (
      this._completed || (this.outerTx && this.outerTx.isCompleted()) || false
    );
  }

  begin(conn) {
    const trxMode = [
      this.isolationLevel ? `ISOLATION LEVEL ${this.isolationLevel}` : '',
      this.readOnly ? 'READ ONLY' : '',
    ]
      .join(' ')
      .trim();

    if (trxMode.length === 0) {
      return this.query(conn, 'BEGIN;');
    }

    return this.query(conn, `SET TRANSACTION ${trxMode};`).then(() =>
      this.query(conn, 'BEGIN;')
    );
  }

  savepoint(conn) {
    return this.query(conn, `SAVEPOINT ${this.txid};`);
  }

  commit(conn, value) {
    return this.query(conn, 'COMMIT;', 1, value);
  }

  release(conn, value) {
    return this.query(conn, `RELEASE SAVEPOINT ${this.txid};`, 1, value);
  }

  setIsolationLevel(isolationLevel) {
    if (!validIsolationLevels.includes(isolationLevel)) {
      throw new Error(
        `Invalid isolationLevel, supported isolation levels are: ${JSON.stringify(
          validIsolationLevels
        )}`
      );
    }
    this.isolationLevel = isolationLevel;
    return this;
  }

  rollback(conn, error) {
    return timeout(this.query(conn, 'ROLLBACK', 2, error), 5000).catch(
      (err) => {
        if (!(err instanceof KnexTimeoutError$2)) {
          return Promise.reject(err);
        }
        this._rejecter(error);
      }
    );
  }

  rollbackTo(conn, error) {
    return timeout(
      this.query(conn, `ROLLBACK TO SAVEPOINT ${this.txid}`, 2, error),
      5000
    ).catch((err) => {
      if (!(err instanceof KnexTimeoutError$2)) {
        return Promise.reject(err);
      }
      this._rejecter(error);
    });
  }

  query(conn, sql, status, value) {
    const q = this.trxClient
      .query(conn, sql)
      .catch((err) => {
        status = 2;
        value = err;
        this._completed = true;
        debug$3('%s error running transaction query', this.txid);
      })
      .then((res) => {
        if (status === 1) {
          this._resolver(value);
        }
        if (status === 2) {
          if (value === undefined) {
            if (this.doNotRejectOnRollback && /^ROLLBACK\b/i.test(sql)) {
              this._resolver();
              return;
            }

            value = new Error(`Transaction rejected with non-error: ${value}`);
          }
          this._rejecter(value);
        }
        return res;
      });
    if (status === 1 || status === 2) {
      this._completed = true;
    }
    return q;
  }

  debug(enabled) {
    this._debug = arguments.length ? enabled : true;
    return this;
  }

  async _evaluateContainer(config, container) {
    return this.acquireConnection(config, (connection) => {
      const trxClient = (this.trxClient = makeTxClient(
        this,
        this.client,
        connection
      ));
      const init = this.client.transacting
        ? this.savepoint(connection)
        : this.begin(connection);
      const executionPromise = new Promise((resolver, rejecter) => {
        this._resolver = resolver;
        this._rejecter = rejecter;
      });

      init
        .then(() => {
          return makeTransactor(this, connection, trxClient);
        })
        .then((transactor) => {
          this.transactor = transactor;
          if (this.outerTx) {
            transactor.parentTransaction = this.outerTx.transactor;
          }
          transactor.executionPromise = executionPromise;

          // If we've returned a "thenable" from the transaction container, assume
          // the rollback and commit are chained to this object's success / failure.
          // Directly thrown errors are treated as automatic rollbacks.
          let result;
          try {
            result = container(transactor);
          } catch (err) {
            result = Promise.reject(err);
          }
          if (result && result.then && typeof result.then === 'function') {
            result
              .then((val) => {
                return transactor.commit(val);
              })
              .catch((err) => {
                return transactor.rollback(err);
              });
          }
          return null;
        })
        .catch((e) => {
          return this._rejecter(e);
        });

      return executionPromise;
    });
  }

  // Acquire a connection and create a disposer - either using the one passed
  // via config or getting one off the client. The disposer will be called once
  // the original promise is marked completed.
  async acquireConnection(config, cb) {
    const configConnection = config && config.connection;
    const connection =
      configConnection || (await this.client.acquireConnection());

    try {
      connection.__knexTxId = this.txid;
      return await cb(connection);
    } finally {
      if (!configConnection) {
        debug$3('%s: releasing connection', this.txid);
        this.client.releaseConnection(connection);
      } else {
        debug$3('%s: not releasing external connection', this.txid);
      }
    }
  }

  then(onResolve, onReject) {
    return this._promise.then(onResolve, onReject);
  }

  catch(...args) {
    return this._promise.catch(...args);
  }

  asCallback(cb) {
    callbackify$1(() => this._promise)(cb);
    return this._promise;
  }
};
finallyMixin$1(Transaction$1.prototype);

// The transactor is a full featured knex object, with a "commit", a "rollback"
// and a "savepoint" function. The "savepoint" is just sugar for creating a new
// transaction. If the rollback is run inside a savepoint, it rolls back to the
// last savepoint - otherwise it rolls back the transaction.
function makeTransactor(trx, connection, trxClient) {
  const transactor = makeKnex$1(trxClient);

  transactor.context.withUserParams = () => {
    throw new Error(
      'Cannot set user params on a transaction - it can only inherit params from main knex instance'
    );
  };

  transactor.isTransaction = true;
  transactor.userParams = trx.userParams || {};

  transactor.context.transaction = function (container, options) {
    if (!options) {
      options = { doNotRejectOnRollback: true };
    } else if (options.doNotRejectOnRollback === undefined) {
      options.doNotRejectOnRollback = true;
    }

    return this._transaction(container, options, trx);
  };

  transactor.savepoint = function (container, options) {
    return transactor.transaction(container, options);
  };

  if (trx.client.transacting) {
    transactor.commit = (value) => trx.release(connection, value);
    transactor.rollback = (error) => trx.rollbackTo(connection, error);
  } else {
    transactor.commit = (value) => trx.commit(connection, value);
    transactor.rollback = (error) => trx.rollback(connection, error);
  }

  transactor.isCompleted = () => trx.isCompleted();

  return transactor;
}

// We need to make a client object which always acquires the same
// connection and does not release back into the pool.
function makeTxClient(trx, client, connection) {
  const trxClient = Object.create(client.constructor.prototype);
  trxClient.version = client.version;
  trxClient.config = client.config;
  trxClient.driver = client.driver;
  trxClient.connectionSettings = client.connectionSettings;
  trxClient.transacting = true;
  trxClient.valueForUndefined = client.valueForUndefined;
  trxClient.logger = client.logger;

  trxClient.on('start', function (arg) {
    trx.emit('start', arg);
    client.emit('start', arg);
  });

  trxClient.on('query', function (arg) {
    trx.emit('query', arg);
    client.emit('query', arg);
  });

  trxClient.on('query-error', function (err, obj) {
    trx.emit('query-error', err, obj);
    client.emit('query-error', err, obj);
  });

  trxClient.on('query-response', function (response, obj, builder) {
    trx.emit('query-response', response, obj, builder);
    client.emit('query-response', response, obj, builder);
  });

  const _query = trxClient.query;
  trxClient.query = function (conn, obj) {
    const completed = trx.isCompleted();
    return new Promise(function (resolve, reject) {
      try {
        if (conn !== connection)
          throw new Error('Invalid connection for transaction query.');
        if (completed) completedError(trx, obj);
        resolve(_query.call(trxClient, conn, obj));
      } catch (e) {
        reject(e);
      }
    });
  };
  const _stream = trxClient.stream;
  trxClient.stream = function (conn, obj, stream, options) {
    const completed = trx.isCompleted();
    return new Promise(function (resolve, reject) {
      try {
        if (conn !== connection)
          throw new Error('Invalid connection for transaction query.');
        if (completed) completedError(trx, obj);
        resolve(_stream.call(trxClient, conn, obj, stream, options));
      } catch (e) {
        reject(e);
      }
    });
  };
  trxClient.acquireConnection = function () {
    return Promise.resolve(connection);
  };
  trxClient.releaseConnection = function () {
    return Promise.resolve();
  };

  return trxClient;
}

function completedError(trx, obj) {
  const sql = typeof obj === 'string' ? obj : obj && obj.sql;
  debug$3('%s: Transaction completed: %s', trx.txid, sql);
  throw new Error(
    'Transaction query already complete, run with DEBUG=knex:tx for more info'
  );
}

var transaction$5 = Transaction$1;

const _debugQuery = require$$2$9('knex:query');
const debugBindings$2 = require$$2$9('knex:bindings');
const debugQuery = (sql, txId) => _debugQuery(sql.replace(/%/g, '%%'), txId);
const { isString: isString$4 } = is;

function formatQuery$1(sql, bindings, timeZone, client) {
  bindings = bindings == null ? [] : [].concat(bindings);
  let index = 0;
  return sql.replace(/\\?\?/g, (match) => {
    if (match === '\\?') {
      return '?';
    }
    if (index === bindings.length) {
      return match;
    }
    const value = bindings[index++];
    return client._escapeBinding(value, { timeZone });
  });
}

function enrichQueryObject$1(connection, queryParam, client) {
  const queryObject = isString$4(queryParam) ? { sql: queryParam } : queryParam;

  queryObject.bindings = client.prepBindings(queryObject.bindings);
  queryObject.sql = client.positionBindings(queryObject.sql);

  const { __knexUid, __knexTxId } = connection;

  client.emit('query', Object.assign({ __knexUid, __knexTxId }, queryObject));
  debugQuery(queryObject.sql, __knexTxId);
  debugBindings$2(queryObject.bindings, __knexTxId);

  return queryObject;
}

function executeQuery$1(connection, queryObject, client) {
  return client._query(connection, queryObject).catch((err) => {
    if (client.config && client.config.compileSqlOnError === false) {
      err.message = queryObject.sql + ' - ' + err.message;
    } else {
      err.message =
        formatQuery$1(queryObject.sql, queryObject.bindings, undefined, client) +
        ' - ' +
        err.message;
    }
    client.emit(
      'query-error',
      err,
      Object.assign(
        { __knexUid: connection.__knexUid, __knexTxId: connection.__knexUid },
        queryObject
      )
    );
    throw err;
  });
}

var queryExecutioner = {
  enrichQueryObject: enrichQueryObject$1,
  executeQuery: executeQuery$1,
  formatQuery: formatQuery$1,
};

const require$$0$d = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(assert$3);

const require$$2$6 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(assign$7);

const require$$0$c = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(clone$2);

const require$$0$b = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(each$2);

const require$$3$3 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(isPlainObject$5);

const require$$7 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(last$1);

const require$$8 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(reject$1);

const require$$4$2 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(tail$4);

const require$$1$8 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(toArray$4);

const require$$1$7 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(isTypedArray$1);

// The client names we'll allow in the `{name: lib}` pairing.
const CLIENT_ALIASES$1 = Object.freeze({
  pg: 'postgres',
  postgresql: 'postgres',
  sqlite: 'sqlite3',
});

const SUPPORTED_CLIENTS$1 = Object.freeze(
  [
    'mssql',
    'mysql',
    'mysql2',
    'oracledb',
    'postgres',
    'pgnative',
    'redshift',
    'sqlite3',
    'cockroachdb',
    'better-sqlite3',
  ].concat(Object.keys(CLIENT_ALIASES$1))
);

const POOL_CONFIG_OPTIONS$1 = Object.freeze([
  'maxWaitingClients',
  'testOnBorrow',
  'fifo',
  'priorityRange',
  'autostart',
  'evictionRunIntervalMillis',
  'numTestsPerRun',
  'softIdleTimeoutMillis',
  'Promise',
]);

var constants$1 = {
  CLIENT_ALIASES: CLIENT_ALIASES$1,
  SUPPORTED_CLIENTS: SUPPORTED_CLIENTS$1,
  POOL_CONFIG_OPTIONS: POOL_CONFIG_OPTIONS$1};

const isPlainObject$3 = require$$3$3;
const isTypedArray = require$$1$7;
const { CLIENT_ALIASES } = constants$1;
const { isFunction: isFunction$2 } = is;

// Check if the first argument is an array, otherwise uses all arguments as an
// array.
function normalizeArr$2(...args) {
  if (Array.isArray(args[0])) {
    return args[0];
  }

  return args;
}

function containsUndefined(mixed) {
  let argContainsUndefined = false;

  if (isTypedArray(mixed)) return false;

  if (mixed && isFunction$2(mixed.toSQL)) {
    //Any QueryBuilder or Raw will automatically be validated during compile.
    return argContainsUndefined;
  }

  if (Array.isArray(mixed)) {
    for (let i = 0; i < mixed.length; i++) {
      if (argContainsUndefined) break;
      argContainsUndefined = containsUndefined(mixed[i]);
    }
  } else if (isPlainObject$3(mixed)) {
    Object.keys(mixed).forEach((key) => {
      if (!argContainsUndefined) {
        argContainsUndefined = containsUndefined(mixed[key]);
      }
    });
  } else {
    argContainsUndefined = mixed === undefined;
  }

  return argContainsUndefined;
}

function getUndefinedIndices(mixed) {
  const indices = [];

  if (Array.isArray(mixed)) {
    mixed.forEach((item, index) => {
      if (containsUndefined(item)) {
        indices.push(index);
      }
    });
  } else if (isPlainObject$3(mixed)) {
    Object.keys(mixed).forEach((key) => {
      if (containsUndefined(mixed[key])) {
        indices.push(key);
      }
    });
  } else {
    indices.push(0);
  }

  return indices;
}

function addQueryContext$3(Target) {
  // Stores or returns (if called with no arguments) context passed to
  // wrapIdentifier and postProcessResponse hooks
  Target.prototype.queryContext = function (context) {
    if (context === undefined) {
      return this._queryContext;
    }
    this._queryContext = context;
    return this;
  };
}

function resolveClientNameWithAliases$1(clientName) {
  return CLIENT_ALIASES[clientName] || clientName;
}

function toNumber$1(val, fallback) {
  if (val === undefined || val === null) return fallback;
  const number = parseInt(val, 10);
  return isNaN(number) ? fallback : number;
}

var helpers$7 = {
  addQueryContext: addQueryContext$3,
  containsUndefined,
  getUndefinedIndices,
  normalizeArr: normalizeArr$2,
  resolveClientNameWithAliases: resolveClientNameWithAliases$1,
  toNumber: toNumber$1,
};

const assert$2 = require$$0$d;

// JoinClause
// -------

function getClauseFromArguments(compilerType, bool, first, operator, second) {
  if (typeof first === 'function') {
    return {
      type: 'onWrapped',
      value: first,
      bool: bool,
    };
  }

  switch (arguments.length) {
    case 3:
      return { type: 'onRaw', value: first, bool };
    case 4:
      return {
        type: compilerType,
        column: first,
        operator: '=',
        value: operator,
        bool,
      };
    default:
      return {
        type: compilerType,
        column: first,
        operator,
        value: second,
        bool,
      };
  }
}

// The "JoinClause" is an object holding any necessary info about a join,
// including the type, and any associated tables & columns being joined.
let JoinClause$2 = class JoinClause {
  constructor(table, type, schema) {
    this.schema = schema;
    this.table = table;
    this.joinType = type;
    this.and = this;
    this.clauses = [];
  }

  get or() {
    return this._bool('or');
  }

  // Adds an "on" clause to the current join object.
  on(first) {
    if (typeof first === 'object' && typeof first.toSQL !== 'function') {
      const keys = Object.keys(first);
      let i = -1;
      const method = this._bool() === 'or' ? 'orOn' : 'on';
      while (++i < keys.length) {
        this[method](keys[i], first[keys[i]]);
      }
      return this;
    }

    const data = getClauseFromArguments('onBasic', this._bool(), ...arguments);

    if (data) {
      this.clauses.push(data);
    }

    return this;
  }

  // Adds an "or on" clause to the current join object.
  orOn(first, operator, second) {
    return this._bool('or').on.apply(this, arguments);
  }

  onJsonPathEquals(columnFirst, jsonPathFirst, columnSecond, jsonPathSecond) {
    this.clauses.push({
      type: 'onJsonPathEquals',
      columnFirst: columnFirst,
      jsonPathFirst: jsonPathFirst,
      columnSecond: columnSecond,
      jsonPathSecond: jsonPathSecond,
      bool: this._bool(),
      not: this._not(),
    });
    return this;
  }

  orOnJsonPathEquals(columnFirst, jsonPathFirst, columnSecond, jsonPathSecond) {
    return this._bool('or').onJsonPathEquals.apply(this, arguments);
  }

  // Adds a "using" clause to the current join.
  using(column) {
    return this.clauses.push({ type: 'onUsing', column, bool: this._bool() });
  }

  onVal(first) {
    if (typeof first === 'object' && typeof first.toSQL !== 'function') {
      const keys = Object.keys(first);
      let i = -1;
      const method = this._bool() === 'or' ? 'orOnVal' : 'onVal';
      while (++i < keys.length) {
        this[method](keys[i], first[keys[i]]);
      }
      return this;
    }

    const data = getClauseFromArguments('onVal', this._bool(), ...arguments);

    if (data) {
      this.clauses.push(data);
    }

    return this;
  }

  andOnVal() {
    return this.onVal(...arguments);
  }

  orOnVal() {
    return this._bool('or').onVal(...arguments);
  }

  onBetween(column, values) {
    assert$2(
      Array.isArray(values),
      'The second argument to onBetween must be an array.'
    );
    assert$2(
      values.length === 2,
      'You must specify 2 values for the onBetween clause'
    );
    this.clauses.push({
      type: 'onBetween',
      column,
      value: values,
      bool: this._bool(),
      not: this._not(),
    });
    return this;
  }

  onNotBetween(column, values) {
    return this._not(true).onBetween(column, values);
  }

  orOnBetween(column, values) {
    return this._bool('or').onBetween(column, values);
  }

  orOnNotBetween(column, values) {
    return this._bool('or')._not(true).onBetween(column, values);
  }

  onIn(column, values) {
    if (Array.isArray(values) && values.length === 0) return this.on(1, '=', 0);
    this.clauses.push({
      type: 'onIn',
      column,
      value: values,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  }

  onNotIn(column, values) {
    return this._not(true).onIn(column, values);
  }

  orOnIn(column, values) {
    return this._bool('or').onIn(column, values);
  }

  orOnNotIn(column, values) {
    return this._bool('or')._not(true).onIn(column, values);
  }

  onNull(column) {
    this.clauses.push({
      type: 'onNull',
      column,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  }

  orOnNull(callback) {
    return this._bool('or').onNull(callback);
  }

  onNotNull(callback) {
    return this._not(true).onNull(callback);
  }

  orOnNotNull(callback) {
    return this._not(true)._bool('or').onNull(callback);
  }

  onExists(callback) {
    this.clauses.push({
      type: 'onExists',
      value: callback,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  }

  orOnExists(callback) {
    return this._bool('or').onExists(callback);
  }

  onNotExists(callback) {
    return this._not(true).onExists(callback);
  }

  orOnNotExists(callback) {
    return this._not(true)._bool('or').onExists(callback);
  }

  // Explicitly set the type of join, useful within a function when creating a grouped join.
  type(type) {
    this.joinType = type;
    return this;
  }

  _bool(bool) {
    if (arguments.length === 1) {
      this._boolFlag = bool;
      return this;
    }
    const ret = this._boolFlag || 'and';
    this._boolFlag = 'and';
    return ret;
  }

  _not(val) {
    if (arguments.length === 1) {
      this._notFlag = val;
      return this;
    }
    const ret = this._notFlag;
    this._notFlag = false;
    return ret;
  }
};

Object.assign(JoinClause$2.prototype, {
  grouping: 'join',
});

JoinClause$2.prototype.andOn = JoinClause$2.prototype.on;
JoinClause$2.prototype.andOnIn = JoinClause$2.prototype.onIn;
JoinClause$2.prototype.andOnNotIn = JoinClause$2.prototype.onNotIn;
JoinClause$2.prototype.andOnNull = JoinClause$2.prototype.onNull;
JoinClause$2.prototype.andOnNotNull = JoinClause$2.prototype.onNotNull;
JoinClause$2.prototype.andOnExists = JoinClause$2.prototype.onExists;
JoinClause$2.prototype.andOnNotExists = JoinClause$2.prototype.onNotExists;
JoinClause$2.prototype.andOnBetween = JoinClause$2.prototype.onBetween;
JoinClause$2.prototype.andOnNotBetween = JoinClause$2.prototype.onNotBetween;
JoinClause$2.prototype.andOnJsonPathEquals =
  JoinClause$2.prototype.onJsonPathEquals;

var joinclause = JoinClause$2;

const assert$1 = require$$0$d;

// Analytic
// -------

// The "Analytic" is an object holding any necessary info about a analytic function
// e.g row_number, rank, dense_rank,
let Analytic$1 = class Analytic {
  constructor(method, schema, alias, orderBy, partitions) {
    this.schema = schema;
    this.type = 'analytic';
    this.method = method;
    this.order = orderBy || [];
    this.partitions = partitions || [];
    this.alias = alias;
    this.and = this;

    this.grouping = 'columns';
  }

  partitionBy(column, direction) {
    assert$1(
      Array.isArray(column) || typeof column === 'string',
      `The argument to an analytic partitionBy function must be either a string
            or an array of string.`
    );

    if (Array.isArray(column)) {
      this.partitions = this.partitions.concat(column);
    } else {
      this.partitions.push({ column: column, order: direction });
    }
    return this;
  }

  orderBy(column, direction) {
    assert$1(
      Array.isArray(column) || typeof column === 'string',
      `The argument to an analytic orderBy function must be either a string
            or an array of string.`
    );

    if (Array.isArray(column)) {
      this.order = this.order.concat(column);
    } else {
      this.order.push({ column: column, order: direction });
    }
    return this;
  }
};

var analytic = Analytic$1;

var saveAsyncStack$3 = function saveAsyncStack(instance, lines) {
  if (instance.client.config.asyncStackTraces) {
    // a hack to get a callstack into the client code despite this
    // node.js bug https://github.com/nodejs/node/issues/11865

    // Save error here but not error trace
    // reading trace with '--enable-source-maps' flag on node can be very costly

    instance._asyncStack = {
      error: new Error(),
      lines,
    };
  }
};

/**
 * internal constants, do not use in application code
 */

var constants = {
  lockMode: {
    forShare: 'forShare',
    forUpdate: 'forUpdate',
    forNoKeyUpdate: 'forNoKeyUpdate',
    forKeyShare: 'forKeyShare',
  },
  waitMode: {
    skipLocked: 'skipLocked',
    noWait: 'noWait',
  },
};

const clone$1 = require$$0$c;
const isEmpty$3 = require$$2$8;
const { callbackify } = require$$1$e;
const finallyMixin = finallyMixin_1;
const { formatQuery } = queryExecutioner;

function augmentWithBuilderInterface$3(Target) {
  Target.prototype.toQuery = function (tz) {
    let data = this.toSQL(this._method, tz);
    if (!Array.isArray(data)) data = [data];
    if (!data.length) {
      return '';
    }

    return data
      .map((statement) => {
        return formatQuery(statement.sql, statement.bindings, tz, this.client);
      })
      .reduce((a, c) => a.concat(a.endsWith(';') ? '\n' : ';\n', c));
  };

  // Create a new instance of the `Runner`, passing in the current object.
  Target.prototype.then = function (/* onFulfilled, onRejected */) {
    let result = this.client.runner(this).run();

    if (this.client.config.asyncStackTraces) {
      result = result.catch((err) => {
        err.originalStack = err.stack;
        const firstLine = err.stack.split('\n')[0];

        // a hack to get a callstack into the client code despite this
        // node.js bug https://github.com/nodejs/node/issues/11865
        // see lib/util/save-async-stack.js for more details
        const { error, lines } = this._asyncStack;
        const stackByLines = error.stack.split('\n');
        const asyncStack = stackByLines.slice(lines);
        asyncStack.unshift(firstLine);

        // put the fake more helpful "async" stack on the thrown error
        err.stack = asyncStack.join('\n');
        throw err;
      });
    }

    return result.then.apply(result, arguments);
  };

  // Add additional "options" to the builder. Typically used for client specific
  // items, like the `mysql` and `sqlite3` drivers.
  Target.prototype.options = function (opts) {
    this._options = this._options || [];
    this._options.push(clone$1(opts) || {});
    return this;
  };

  // Sets an explicit "connection" we wish to use for this query.
  Target.prototype.connection = function (connection) {
    this._connection = connection;
    this.client.processPassedConnection(connection);
    return this;
  };

  // Set a debug flag for the current schema query stack.
  Target.prototype.debug = function (enabled) {
    this._debug = arguments.length ? enabled : true;
    return this;
  };

  // Set the transaction object for this query.
  Target.prototype.transacting = function (transaction) {
    if (transaction && transaction.client) {
      if (!transaction.client.transacting) {
        transaction.client.logger.warn(
          `Invalid transaction value: ${transaction.client}`
        );
      } else {
        this.client = transaction.client;
      }
    }
    if (isEmpty$3(transaction)) {
      this.client.logger.error(
        'Invalid value on transacting call, potential bug'
      );
      throw Error(
        'Invalid transacting value (null, undefined or empty object)'
      );
    }
    return this;
  };

  // Initializes a stream.
  Target.prototype.stream = function (options) {
    return this.client.runner(this).stream(options);
  };

  // Initialize a stream & pipe automatically.
  Target.prototype.pipe = function (writable, options) {
    return this.client.runner(this).pipe(writable, options);
  };

  Target.prototype.asCallback = function (cb) {
    const promise = this.then();
    callbackify(() => promise)(cb);
    return promise;
  };

  Target.prototype.catch = function (onReject) {
    return this.then().catch(onReject);
  };

  Object.defineProperty(Target.prototype, Symbol.toStringTag, {
    get: () => 'object',
  });

  finallyMixin(Target.prototype);
}

var builderInterfaceAugmenter = {
  augmentWithBuilderInterface: augmentWithBuilderInterface$3,
};

// Builder
// -------
const assert = require$$0$d;
const { EventEmitter: EventEmitter$7 } = require$$2$b;
const assign$6 = require$$2$6;
const clone = require$$0$c;
const each$1 = require$$0$b;
const isEmpty$2 = require$$2$8;
const isPlainObject$2 = require$$3$3;
const last = require$$7;
const reject = require$$8;
const tail$3 = require$$4$2;
const toArray$3 = require$$1$8;

const { addQueryContext: addQueryContext$2, normalizeArr: normalizeArr$1 } = helpers$7;
const JoinClause$1 = joinclause;
const Analytic = analytic;
const saveAsyncStack$2 = saveAsyncStack$3;
const {
  isBoolean,
  isNumber: isNumber$1,
  isObject: isObject$3,
  isString: isString$3,
  isFunction: isFunction$1,
} = is;

const { lockMode, waitMode } = constants;
const {
  augmentWithBuilderInterface: augmentWithBuilderInterface$2,
} = builderInterfaceAugmenter;

const SELECT_COMMANDS = new Set(['pluck', 'first', 'select']);
const CLEARABLE_STATEMENTS = new Set([
  'with',
  'select',
  'columns',
  'hintComments',
  'where',
  'union',
  'join',
  'group',
  'order',
  'having',
  'limit',
  'offset',
  'counter',
  'counters',
]);
const LOCK_MODES = new Set([
  lockMode.forShare,
  lockMode.forUpdate,
  lockMode.forNoKeyUpdate,
  lockMode.forKeyShare,
]);

// Typically called from `knex.builder`,
// start a new query building chain.
class Builder extends EventEmitter$7 {
  constructor(client) {
    super();
    this.client = client;
    this.and = this;
    this._single = {};
    this._comments = [];
    this._statements = [];
    this._method = 'select';
    if (client.config) {
      saveAsyncStack$2(this, 5);
      this._debug = client.config.debug;
    }
    // Internal flags used in the builder.
    this._joinFlag = 'inner';
    this._boolFlag = 'and';
    this._notFlag = false;
    this._asColumnFlag = false;
  }

  toString() {
    return this.toQuery();
  }

  // Convert the current query "toSQL"
  toSQL(method, tz) {
    return this.client.queryCompiler(this).toSQL(method || this._method, tz);
  }

  // Create a shallow clone of the current query builder.
  clone() {
    const cloned = new this.constructor(this.client);
    cloned._method = this._method;
    cloned._single = clone(this._single);
    cloned._comments = clone(this._comments);
    cloned._statements = clone(this._statements);
    cloned._debug = this._debug;

    // `_option` is assigned by the `Interface` mixin.
    if (this._options !== undefined) {
      cloned._options = clone(this._options);
    }
    if (this._queryContext !== undefined) {
      cloned._queryContext = clone(this._queryContext);
    }
    if (this._connection !== undefined) {
      cloned._connection = this._connection;
    }

    return cloned;
  }

  timeout(ms, { cancel } = {}) {
    if (isNumber$1(ms) && ms > 0) {
      this._timeout = ms;
      if (cancel) {
        this.client.assertCanCancelQuery();
        this._cancelOnTimeout = true;
      }
    }
    return this;
  }

  // With
  // ------
  isValidStatementArg(statement) {
    return (
      typeof statement === 'function' ||
      statement instanceof Builder ||
      (statement && statement.isRawInstance)
    );
  }

  _validateWithArgs(alias, statementOrColumnList, nothingOrStatement, method) {
    const [query, columnList] =
      typeof nothingOrStatement === 'undefined'
        ? [statementOrColumnList, undefined]
        : [nothingOrStatement, statementOrColumnList];
    if (typeof alias !== 'string') {
      throw new Error(`${method}() first argument must be a string`);
    }

    if (this.isValidStatementArg(query) && typeof columnList === 'undefined') {
      // Validated as two-arg variant (alias, statement).
      return;
    }

    // Attempt to interpret as three-arg variant (alias, columnList, statement).
    const isNonEmptyNameList =
      Array.isArray(columnList) &&
      columnList.length > 0 &&
      columnList.every((it) => typeof it === 'string');
    if (!isNonEmptyNameList) {
      throw new Error(
        `${method}() second argument must be a statement or non-empty column name list.`
      );
    }

    if (this.isValidStatementArg(query)) {
      return;
    }
    throw new Error(
      `${method}() third argument must be a function / QueryBuilder or a raw when its second argument is a column name list`
    );
  }

  with(alias, statementOrColumnList, nothingOrStatement) {
    this._validateWithArgs(
      alias,
      statementOrColumnList,
      nothingOrStatement,
      'with'
    );
    return this.withWrapped(alias, statementOrColumnList, nothingOrStatement);
  }

  withMaterialized(alias, statementOrColumnList, nothingOrStatement) {
    throw new Error('With materialized is not supported by this dialect');
  }

  withNotMaterialized(alias, statementOrColumnList, nothingOrStatement) {
    throw new Error('With materialized is not supported by this dialect');
  }

  // Helper for compiling any advanced `with` queries.
  withWrapped(alias, statementOrColumnList, nothingOrStatement, materialized) {
    const [query, columnList] =
      typeof nothingOrStatement === 'undefined'
        ? [statementOrColumnList, undefined]
        : [nothingOrStatement, statementOrColumnList];
    const statement = {
      grouping: 'with',
      type: 'withWrapped',
      alias: alias,
      columnList,
      value: query,
    };
    if (materialized !== undefined) {
      statement.materialized = materialized;
    }
    this._statements.push(statement);
    return this;
  }

  // With Recursive
  // ------

  withRecursive(alias, statementOrColumnList, nothingOrStatement) {
    this._validateWithArgs(
      alias,
      statementOrColumnList,
      nothingOrStatement,
      'withRecursive'
    );
    return this.withRecursiveWrapped(
      alias,
      statementOrColumnList,
      nothingOrStatement
    );
  }

  // Helper for compiling any advanced `withRecursive` queries.
  withRecursiveWrapped(alias, statementOrColumnList, nothingOrStatement) {
    this.withWrapped(alias, statementOrColumnList, nothingOrStatement);
    this._statements[this._statements.length - 1].recursive = true;
    return this;
  }

  // Select
  // ------

  // Adds a column or columns to the list of "columns"
  // being selected on the query.
  columns(column) {
    if (!column && column !== 0) return this;
    this._statements.push({
      grouping: 'columns',
      value: normalizeArr$1(...arguments),
    });
    return this;
  }

  // Adds a comment to the query
  comment(txt) {
    if (!isString$3(txt)) {
      throw new Error('Comment must be a string');
    }
    const forbiddenChars = ['/*', '*/', '?'];
    if (forbiddenChars.some((chars) => txt.includes(chars))) {
      throw new Error(`Cannot include ${forbiddenChars.join(', ')} in comment`);
    }
    this._comments.push({
      comment: txt,
    });
    return this;
  }

  // Allow for a sub-select to be explicitly aliased as a column,
  // without needing to compile the query in a where.
  as(column) {
    this._single.as = column;
    return this;
  }

  // Adds a single hint or an array of hits to the list of "hintComments" on the query.
  hintComment(hints) {
    hints = Array.isArray(hints) ? hints : [hints];
    if (hints.some((hint) => !isString$3(hint))) {
      throw new Error('Hint comment must be a string');
    }
    if (hints.some((hint) => hint.includes('/*') || hint.includes('*/'))) {
      throw new Error('Hint comment cannot include "/*" or "*/"');
    }
    if (hints.some((hint) => hint.includes('?'))) {
      throw new Error('Hint comment cannot include "?"');
    }
    this._statements.push({
      grouping: 'hintComments',
      value: hints,
    });
    return this;
  }

  // Prepends the `schemaName` on `tableName` defined by `.table` and `.join`.
  withSchema(schemaName) {
    this._single.schema = schemaName;
    return this;
  }

  // Sets the `tableName` on the query.
  // Alias to "from" for select and "into" for insert statements
  // e.g. builder.insert({a: value}).into('tableName')
  // `options`: options object containing keys:
  //   - `only`: whether the query should use SQL's ONLY to not return
  //           inheriting table data. Defaults to false.
  table(tableName, options = {}) {
    this._single.table = tableName;
    this._single.only = options.only === true;
    return this;
  }

  // Adds a `distinct` clause to the query.
  distinct(...args) {
    this._statements.push({
      grouping: 'columns',
      value: normalizeArr$1(...args),
      distinct: true,
    });
    return this;
  }

  distinctOn(...args) {
    if (isEmpty$2(args)) {
      throw new Error('distinctOn requires at least on argument');
    }
    this._statements.push({
      grouping: 'columns',
      value: normalizeArr$1(...args),
      distinctOn: true,
    });
    return this;
  }

  // Adds a join clause to the query, allowing for advanced joins
  // with an anonymous function as the second argument.
  join(table, first, ...args) {
    let join;
    const schema =
      table instanceof Builder || typeof table === 'function'
        ? undefined
        : this._single.schema;
    const joinType = this._joinType();
    if (typeof first === 'function') {
      join = new JoinClause$1(table, joinType, schema);
      first.call(join, join);
    } else if (joinType === 'raw') {
      join = new JoinClause$1(this.client.raw(table, first), 'raw');
    } else {
      join = new JoinClause$1(table, joinType, schema);
      if (first) {
        join.on(first, ...args);
      }
    }
    this._statements.push(join);
    return this;
  }

  using(tables) {
    throw new Error(
      "'using' function is only available in PostgreSQL dialect with Delete statements."
    );
  }

  // JOIN blocks:
  innerJoin(...args) {
    return this._joinType('inner').join(...args);
  }

  leftJoin(...args) {
    return this._joinType('left').join(...args);
  }

  leftOuterJoin(...args) {
    return this._joinType('left outer').join(...args);
  }

  rightJoin(...args) {
    return this._joinType('right').join(...args);
  }

  rightOuterJoin(...args) {
    return this._joinType('right outer').join(...args);
  }

  outerJoin(...args) {
    return this._joinType('outer').join(...args);
  }

  fullOuterJoin(...args) {
    return this._joinType('full outer').join(...args);
  }

  crossJoin(...args) {
    return this._joinType('cross').join(...args);
  }

  joinRaw(...args) {
    return this._joinType('raw').join(...args);
  }

  // Where modifiers:
  get or() {
    return this._bool('or');
  }

  get not() {
    return this._not(true);
  }

  // The where function can be used in several ways:
  // The most basic is `where(key, value)`, which expands to
  // where key = value.
  where(column, operator, value) {
    const argsLength = arguments.length;

    // Support "where true || where false"
    if (column === false || column === true) {
      return this.where(1, '=', column ? 1 : 0);
    }

    // Check if the column is a function, in which case it's
    // a where statement wrapped in parens.
    if (typeof column === 'function') {
      return this.whereWrapped(column);
    }

    // Allows `where({id: 2})` syntax.
    if (isObject$3(column) && !column.isRawInstance)
      return this._objectWhere(column);

    // Allow a raw statement to be passed along to the query.
    if (column && column.isRawInstance && argsLength === 1)
      return this.whereRaw(column);

    // Enable the where('key', value) syntax, only when there
    // are explicitly two arguments passed, so it's not possible to
    // do where('key', '!=') and have that turn into where key != null
    if (argsLength === 2) {
      value = operator;
      operator = '=';

      // If the value is null, and it's a two argument query,
      // we assume we're going for a `whereNull`.
      if (value === null) {
        return this.whereNull(column);
      }
    }

    // lower case the operator for comparison purposes
    const checkOperator = `${operator}`.toLowerCase().trim();

    // If there are 3 arguments, check whether 'in' is one of them.
    if (argsLength === 3) {
      if (checkOperator === 'in' || checkOperator === 'not in') {
        return this._not(checkOperator === 'not in').whereIn(column, value);
      }
      if (checkOperator === 'between' || checkOperator === 'not between') {
        return this._not(checkOperator === 'not between').whereBetween(
          column,
          value
        );
      }
    }

    // If the value is still null, check whether they're meaning
    // where value is null
    if (value === null) {
      // Check for .where(key, 'is', null) or .where(key, 'is not', 'null');
      if (checkOperator === 'is' || checkOperator === 'is not') {
        return this._not(checkOperator === 'is not').whereNull(column);
      }
    }

    // Push onto the where statement stack.
    this._statements.push({
      grouping: 'where',
      type: 'whereBasic',
      column,
      operator,
      value,
      not: this._not(),
      bool: this._bool(),
      asColumn: this._asColumnFlag,
    });
    return this;
  }

  whereColumn(...args) {
    this._asColumnFlag = true;
    this.where(...args);
    this._asColumnFlag = false;
    return this;
  }

  // Adds an `or where` clause to the query.
  orWhere(column, ...args) {
    this._bool('or');
    const obj = column;
    if (isObject$3(obj) && !obj.isRawInstance) {
      return this.whereWrapped(function () {
        for (const key in obj) {
          this.andWhere(key, obj[key]);
        }
      });
    }
    return this.where(column, ...args);
  }

  orWhereColumn(column, ...args) {
    this._bool('or');
    const obj = column;
    if (isObject$3(obj) && !obj.isRawInstance) {
      return this.whereWrapped(function () {
        for (const key in obj) {
          this.andWhereColumn(key, '=', obj[key]);
        }
      });
    }
    return this.whereColumn(column, ...args);
  }

  // Adds an `not where` clause to the query.
  whereNot(column, ...args) {
    if (args.length >= 2) {
      if (args[0] === 'in' || args[0] === 'between') {
        this.client.logger.warn(
          'whereNot is not suitable for "in" and "between" type subqueries. You should use "not in" and "not between" instead.'
        );
      }
    }
    return this._not(true).where(column, ...args);
  }

  whereNotColumn(...args) {
    return this._not(true).whereColumn(...args);
  }

  // Adds an `or not where` clause to the query.
  orWhereNot(...args) {
    return this._bool('or').whereNot(...args);
  }

  orWhereNotColumn(...args) {
    return this._bool('or').whereNotColumn(...args);
  }

  // Processes an object literal provided in a "where" clause.
  _objectWhere(obj) {
    const boolVal = this._bool();
    const notVal = this._not() ? 'Not' : '';
    for (const key in obj) {
      this[boolVal + 'Where' + notVal](key, obj[key]);
    }
    return this;
  }

  // Adds a raw `where` clause to the query.
  whereRaw(sql, bindings) {
    const raw = sql.isRawInstance ? sql : this.client.raw(sql, bindings);

    this._statements.push({
      grouping: 'where',
      type: 'whereRaw',
      value: raw,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  }

  orWhereRaw(sql, bindings) {
    return this._bool('or').whereRaw(sql, bindings);
  }

  // Helper for compiling any advanced `where` queries.
  whereWrapped(callback) {
    this._statements.push({
      grouping: 'where',
      type: 'whereWrapped',
      value: callback,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  }

  // Adds a `where exists` clause to the query.
  whereExists(callback) {
    this._statements.push({
      grouping: 'where',
      type: 'whereExists',
      value: callback,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  }

  // Adds an `or where exists` clause to the query.
  orWhereExists(callback) {
    return this._bool('or').whereExists(callback);
  }

  // Adds a `where not exists` clause to the query.
  whereNotExists(callback) {
    return this._not(true).whereExists(callback);
  }

  // Adds a `or where not exists` clause to the query.
  orWhereNotExists(callback) {
    return this._bool('or').whereNotExists(callback);
  }

  // Adds a `where in` clause to the query.
  whereIn(column, values) {
    if (Array.isArray(values) && isEmpty$2(values))
      return this.where(this._not());
    this._statements.push({
      grouping: 'where',
      type: 'whereIn',
      column,
      value: values,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  }

  // Adds a `or where in` clause to the query.
  orWhereIn(column, values) {
    return this._bool('or').whereIn(column, values);
  }

  // Adds a `where not in` clause to the query.
  whereNotIn(column, values) {
    return this._not(true).whereIn(column, values);
  }

  // Adds a `or where not in` clause to the query.
  orWhereNotIn(column, values) {
    return this._bool('or')._not(true).whereIn(column, values);
  }

  // Adds a `where null` clause to the query.
  whereNull(column) {
    this._statements.push({
      grouping: 'where',
      type: 'whereNull',
      column,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  }

  // Adds a `or where null` clause to the query.
  orWhereNull(column) {
    return this._bool('or').whereNull(column);
  }

  // Adds a `where not null` clause to the query.
  whereNotNull(column) {
    return this._not(true).whereNull(column);
  }

  // Adds a `or where not null` clause to the query.
  orWhereNotNull(column) {
    return this._bool('or').whereNotNull(column);
  }

  // Adds a `where between` clause to the query.
  whereBetween(column, values) {
    assert(
      Array.isArray(values),
      'The second argument to whereBetween must be an array.'
    );
    assert(
      values.length === 2,
      'You must specify 2 values for the whereBetween clause'
    );
    this._statements.push({
      grouping: 'where',
      type: 'whereBetween',
      column,
      value: values,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  }

  // Adds a `where not between` clause to the query.
  whereNotBetween(column, values) {
    return this._not(true).whereBetween(column, values);
  }

  // Adds a `or where between` clause to the query.
  orWhereBetween(column, values) {
    return this._bool('or').whereBetween(column, values);
  }

  // Adds a `or where not between` clause to the query.
  orWhereNotBetween(column, values) {
    return this._bool('or').whereNotBetween(column, values);
  }

  _whereLike(type, column, value) {
    this._statements.push({
      grouping: 'where',
      type: type,
      column,
      value: value,
      not: this._not(),
      bool: this._bool(),
      asColumn: this._asColumnFlag,
    });
    return this;
  }

  // Adds a `where like` clause to the query.
  whereLike(column, value) {
    return this._whereLike('whereLike', column, value);
  }

  // Adds a `or where like` clause to the query.
  orWhereLike(column, value) {
    return this._bool('or')._whereLike('whereLike', column, value);
  }

  // Adds a `where ilike` clause to the query.
  whereILike(column, value) {
    return this._whereLike('whereILike', column, value);
  }

  // Adds a `or where ilike` clause to the query.
  orWhereILike(column, value) {
    return this._bool('or')._whereLike('whereILike', column, value);
  }

  // Adds a `group by` clause to the query.
  groupBy(item) {
    if (item && item.isRawInstance) {
      return this.groupByRaw.apply(this, arguments);
    }
    this._statements.push({
      grouping: 'group',
      type: 'groupByBasic',
      value: normalizeArr$1(...arguments),
    });
    return this;
  }

  // Adds a raw `group by` clause to the query.
  groupByRaw(sql, bindings) {
    const raw = sql.isRawInstance ? sql : this.client.raw(sql, bindings);
    this._statements.push({
      grouping: 'group',
      type: 'groupByRaw',
      value: raw,
    });
    return this;
  }

  // Adds a `order by` clause to the query.
  orderBy(column, direction, nulls = '') {
    if (Array.isArray(column)) {
      return this._orderByArray(column);
    }
    this._statements.push({
      grouping: 'order',
      type: 'orderByBasic',
      value: column,
      direction,
      nulls,
    });
    return this;
  }

  // Adds a `order by` with multiple columns to the query.
  _orderByArray(columnDefs) {
    for (let i = 0; i < columnDefs.length; i++) {
      const columnInfo = columnDefs[i];
      if (isObject$3(columnInfo)) {
        this._statements.push({
          grouping: 'order',
          type: 'orderByBasic',
          value: columnInfo['column'],
          direction: columnInfo['order'],
          nulls: columnInfo['nulls'],
        });
      } else if (isString$3(columnInfo) || isNumber$1(columnInfo)) {
        this._statements.push({
          grouping: 'order',
          type: 'orderByBasic',
          value: columnInfo,
        });
      }
    }
    return this;
  }

  // Add a raw `order by` clause to the query.
  orderByRaw(sql, bindings) {
    const raw = sql.isRawInstance ? sql : this.client.raw(sql, bindings);
    this._statements.push({
      grouping: 'order',
      type: 'orderByRaw',
      value: raw,
    });
    return this;
  }

  _union(clause, args) {
    let callbacks = args[0];
    let wrap = args[1];
    if (args.length === 1 || (args.length === 2 && isBoolean(wrap))) {
      if (!Array.isArray(callbacks)) {
        callbacks = [callbacks];
      }
      for (let i = 0, l = callbacks.length; i < l; i++) {
        this._statements.push({
          grouping: 'union',
          clause: clause,
          value: callbacks[i],
          wrap: wrap || false,
        });
      }
    } else {
      callbacks = toArray$3(args).slice(0, args.length - 1);
      wrap = args[args.length - 1];
      if (!isBoolean(wrap)) {
        callbacks.push(wrap);
        wrap = false;
      }
      this._union(clause, [callbacks, wrap]);
    }
    return this;
  }

  // Add a union statement to the query.
  union(...args) {
    return this._union('union', args);
  }

  // Adds a union all statement to the query.
  unionAll(...args) {
    return this._union('union all', args);
  }

  intersect(...args) {
    return this._union('intersect', args);
  }

  except(...args) {
    return this._union('except', args);
  }

  // Adds a `having` clause to the query.
  having(column, operator, value) {
    if (column.isRawInstance && arguments.length === 1) {
      return this.havingRaw(column);
    }

    // Check if the column is a function, in which case it's
    // a having statement wrapped in parens.
    if (typeof column === 'function') {
      return this.havingWrapped(column);
    }

    this._statements.push({
      grouping: 'having',
      type: 'havingBasic',
      column,
      operator,
      value,
      bool: this._bool(),
      not: this._not(),
    });
    return this;
  }

  orHaving(column, ...args) {
    this._bool('or');
    const obj = column;
    if (isObject$3(obj) && !obj.isRawInstance) {
      return this.havingWrapped(function () {
        for (const key in obj) {
          this.andHaving(key, obj[key]);
        }
      });
    }
    return this.having(column, ...args);
  }

  // Helper for compiling any advanced `having` queries.
  havingWrapped(callback) {
    this._statements.push({
      grouping: 'having',
      type: 'havingWrapped',
      value: callback,
      bool: this._bool(),
      not: this._not(),
    });
    return this;
  }

  havingNull(column) {
    this._statements.push({
      grouping: 'having',
      type: 'havingNull',
      column,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  }

  orHavingNull(callback) {
    return this._bool('or').havingNull(callback);
  }

  havingNotNull(callback) {
    return this._not(true).havingNull(callback);
  }

  orHavingNotNull(callback) {
    return this._not(true)._bool('or').havingNull(callback);
  }

  havingExists(callback) {
    this._statements.push({
      grouping: 'having',
      type: 'havingExists',
      value: callback,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  }

  orHavingExists(callback) {
    return this._bool('or').havingExists(callback);
  }

  havingNotExists(callback) {
    return this._not(true).havingExists(callback);
  }

  orHavingNotExists(callback) {
    return this._not(true)._bool('or').havingExists(callback);
  }

  havingBetween(column, values) {
    assert(
      Array.isArray(values),
      'The second argument to havingBetween must be an array.'
    );
    assert(
      values.length === 2,
      'You must specify 2 values for the havingBetween clause'
    );
    this._statements.push({
      grouping: 'having',
      type: 'havingBetween',
      column,
      value: values,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  }

  orHavingBetween(column, values) {
    return this._bool('or').havingBetween(column, values);
  }

  havingNotBetween(column, values) {
    return this._not(true).havingBetween(column, values);
  }

  orHavingNotBetween(column, values) {
    return this._not(true)._bool('or').havingBetween(column, values);
  }

  havingIn(column, values) {
    if (Array.isArray(values) && isEmpty$2(values))
      return this.where(this._not());
    this._statements.push({
      grouping: 'having',
      type: 'havingIn',
      column,
      value: values,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  }

  // Adds a `or where in` clause to the query.
  orHavingIn(column, values) {
    return this._bool('or').havingIn(column, values);
  }

  // Adds a `where not in` clause to the query.
  havingNotIn(column, values) {
    return this._not(true).havingIn(column, values);
  }

  // Adds a `or where not in` clause to the query.
  orHavingNotIn(column, values) {
    return this._bool('or')._not(true).havingIn(column, values);
  }

  // Adds a raw `having` clause to the query.
  havingRaw(sql, bindings) {
    const raw = sql.isRawInstance ? sql : this.client.raw(sql, bindings);
    this._statements.push({
      grouping: 'having',
      type: 'havingRaw',
      value: raw,
      bool: this._bool(),
      not: this._not(),
    });
    return this;
  }

  orHavingRaw(sql, bindings) {
    return this._bool('or').havingRaw(sql, bindings);
  }

  // set the skip binding parameter (= insert the raw value in the query) for an attribute.
  _setSkipBinding(attribute, options) {
    let skipBinding = options;
    if (isObject$3(options)) {
      skipBinding = options.skipBinding;
    }
    this._single.skipBinding = this._single.skipBinding || {};
    this._single.skipBinding[attribute] = skipBinding;
  }

  // Only allow a single "offset" to be set for the current query.
  offset(value, options) {
    if (value == null || value.isRawInstance || value instanceof Builder) {
      // Builder for backward compatibility
      this._single.offset = value;
    } else {
      const val = parseInt(value, 10);
      if (isNaN(val)) {
        this.client.logger.warn('A valid integer must be provided to offset');
      } else if (val < 0) {
        throw new Error(`A non-negative integer must be provided to offset.`);
      } else {
        this._single.offset = val;
      }
    }
    this._setSkipBinding('offset', options);
    return this;
  }

  // Only allow a single "limit" to be set for the current query.
  limit(value, options) {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      this.client.logger.warn('A valid integer must be provided to limit');
    } else {
      this._single.limit = val;
      this._setSkipBinding('limit', options);
    }
    return this;
  }

  // Retrieve the "count" result of the query.
  count(column, options) {
    return this._aggregate('count', column || '*', options);
  }

  // Retrieve the minimum value of a given column.
  min(column, options) {
    return this._aggregate('min', column, options);
  }

  // Retrieve the maximum value of a given column.
  max(column, options) {
    return this._aggregate('max', column, options);
  }

  // Retrieve the sum of the values of a given column.
  sum(column, options) {
    return this._aggregate('sum', column, options);
  }

  // Retrieve the average of the values of a given column.
  avg(column, options) {
    return this._aggregate('avg', column, options);
  }

  // Retrieve the "count" of the distinct results of the query.
  countDistinct(...columns) {
    let options;
    if (columns.length > 1 && isPlainObject$2(last(columns))) {
      [options] = columns.splice(columns.length - 1, 1);
    }

    if (!columns.length) {
      columns = '*';
    } else if (columns.length === 1) {
      columns = columns[0];
    }

    return this._aggregate('count', columns, { ...options, distinct: true });
  }

  // Retrieve the sum of the distinct values of a given column.
  sumDistinct(column, options) {
    return this._aggregate('sum', column, { ...options, distinct: true });
  }

  // Retrieve the vg of the distinct results of the query.
  avgDistinct(column, options) {
    return this._aggregate('avg', column, { ...options, distinct: true });
  }

  // Increments a column's value by the specified amount.
  increment(column, amount = 1) {
    if (isObject$3(column)) {
      for (const key in column) {
        this._counter(key, column[key]);
      }

      return this;
    }

    return this._counter(column, amount);
  }

  // Decrements a column's value by the specified amount.
  decrement(column, amount = 1) {
    if (isObject$3(column)) {
      for (const key in column) {
        this._counter(key, -column[key]);
      }

      return this;
    }

    return this._counter(column, -amount);
  }

  // Clears increments/decrements
  clearCounters() {
    this._single.counter = {};
    return this;
  }

  // Sets the values for a `select` query, informing that only the first
  // row should be returned (limit 1).
  first(...args) {
    if (this._method && this._method !== 'select') {
      throw new Error(`Cannot chain .first() on "${this._method}" query`);
    }

    this.select(normalizeArr$1(...args));
    this._method = 'first';
    this.limit(1);
    return this;
  }

  // Use existing connection to execute the query
  // Same value that client.acquireConnection() for an according client returns should be passed
  connection(_connection) {
    this._connection = _connection;
    this.client.processPassedConnection(_connection);
    return this;
  }

  // Pluck a column from a query.
  pluck(column) {
    if (this._method && this._method !== 'select') {
      throw new Error(`Cannot chain .pluck() on "${this._method}" query`);
    }

    this._method = 'pluck';
    this._single.pluck = column;
    this._statements.push({
      grouping: 'columns',
      type: 'pluck',
      value: column,
    });
    return this;
  }

  // Deprecated. Remove everything from select clause
  clearSelect() {
    this._clearGrouping('columns');
    return this;
  }

  // Deprecated. Remove everything from where clause
  clearWhere() {
    this._clearGrouping('where');
    return this;
  }

  // Deprecated. Remove everything from group clause
  clearGroup() {
    this._clearGrouping('group');
    return this;
  }

  // Deprecated. Remove everything from order clause
  clearOrder() {
    this._clearGrouping('order');
    return this;
  }

  // Deprecated. Remove everything from having clause
  clearHaving() {
    this._clearGrouping('having');
    return this;
  }

  // Remove everything from statement clause
  clear(statement) {
    if (!CLEARABLE_STATEMENTS.has(statement))
      throw new Error(`Knex Error: unknown statement '${statement}'`);
    if (statement.startsWith('counter')) return this.clearCounters();
    if (statement === 'select') {
      statement = 'columns';
    }
    this._clearGrouping(statement);
    return this;
  }

  // Insert & Update
  // ------

  // Sets the values for an `insert` query.
  insert(values, returning, options) {
    this._method = 'insert';
    if (!isEmpty$2(returning)) this.returning(returning, options);
    this._single.insert = values;
    return this;
  }

  // Sets the values for an `update`, allowing for both
  // `.update(key, value, [returning])` and `.update(obj, [returning])` syntaxes.
  update(values, returning, options) {
    let ret;
    const obj = this._single.update || {};
    this._method = 'update';
    if (isString$3(values)) {
      if (isPlainObject$2(returning)) {
        obj[values] = JSON.stringify(returning);
      } else {
        obj[values] = returning;
      }
      if (arguments.length > 2) {
        ret = arguments[2];
      }
    } else {
      const keys = Object.keys(values);
      if (this._single.update) {
        this.client.logger.warn('Update called multiple times with objects.');
      }
      let i = -1;
      while (++i < keys.length) {
        obj[keys[i]] = values[keys[i]];
      }
      ret = arguments[1];
    }
    if (!isEmpty$2(ret)) this.returning(ret, options);
    this._single.update = obj;
    return this;
  }

  // Sets the returning value for the query.
  returning(returning, options) {
    this._single.returning = returning;
    this._single.options = options;
    return this;
  }

  onConflict(columns) {
    if (typeof columns === 'string') {
      columns = [columns];
    }
    return new OnConflictBuilder(this, columns || true);
  }

  // Delete
  // ------

  // Executes a delete statement on the query;
  delete(ret, options) {
    this._method = 'del';
    if (!isEmpty$2(ret)) this.returning(ret, options);
    return this;
  }

  // Truncates a table, ends the query chain.
  truncate(tableName) {
    this._method = 'truncate';
    if (tableName) {
      this._single.table = tableName;
    }
    return this;
  }

  // Retrieves columns for the table specified by `knex(tableName)`
  columnInfo(column) {
    this._method = 'columnInfo';
    this._single.columnInfo = column;
    return this;
  }

  // Set a lock for update constraint.
  forUpdate(...tables) {
    this._single.lock = lockMode.forUpdate;
    if (tables.length === 1 && Array.isArray(tables[0])) {
      this._single.lockTables = tables[0];
    } else {
      this._single.lockTables = tables;
    }
    return this;
  }

  // Set a lock for share constraint.
  forShare(...tables) {
    this._single.lock = lockMode.forShare;
    this._single.lockTables = tables;
    return this;
  }

  // Set a lock for no key update constraint.
  forNoKeyUpdate(...tables) {
    this._single.lock = lockMode.forNoKeyUpdate;
    this._single.lockTables = tables;
    return this;
  }

  // Set a lock for key share constraint.
  forKeyShare(...tables) {
    this._single.lock = lockMode.forKeyShare;
    this._single.lockTables = tables;
    return this;
  }

  // Skips locked rows when using a lock constraint.
  skipLocked() {
    if (!this._isSelectQuery()) {
      throw new Error(`Cannot chain .skipLocked() on "${this._method}" query!`);
    }
    if (!this._hasLockMode()) {
      throw new Error(
        '.skipLocked() can only be used after a call to .forShare() or .forUpdate()!'
      );
    }
    if (this._single.waitMode === waitMode.noWait) {
      throw new Error('.skipLocked() cannot be used together with .noWait()!');
    }
    this._single.waitMode = waitMode.skipLocked;
    return this;
  }

  // Causes error when acessing a locked row instead of waiting for it to be released.
  noWait() {
    if (!this._isSelectQuery()) {
      throw new Error(`Cannot chain .noWait() on "${this._method}" query!`);
    }
    if (!this._hasLockMode()) {
      throw new Error(
        '.noWait() can only be used after a call to .forShare() or .forUpdate()!'
      );
    }
    if (this._single.waitMode === waitMode.skipLocked) {
      throw new Error('.noWait() cannot be used together with .skipLocked()!');
    }
    this._single.waitMode = waitMode.noWait;
    return this;
  }

  // Takes a JS object of methods to call and calls them
  fromJS(obj) {
    each$1(obj, (val, key) => {
      if (typeof this[key] !== 'function') {
        this.client.logger.warn(`Knex Error: unknown key ${key}`);
      }
      if (Array.isArray(val)) {
        this[key].apply(this, val);
      } else {
        this[key](val);
      }
    });
    return this;
  }

  fromRaw(sql, bindings) {
    const raw = sql.isRawInstance ? sql : this.client.raw(sql, bindings);
    return this.from(raw);
  }

  // Passes query to provided callback function, useful for e.g. composing
  // domain-specific helpers
  modify(callback) {
    callback.apply(this, [this].concat(tail$3(arguments)));
    return this;
  }

  upsert(values, returning, options) {
    throw new Error(
      `Upsert is not yet supported for dialect ${this.client.dialect}`
    );
  }

  // JSON support functions
  _json(nameFunction, params) {
    this._statements.push({
      grouping: 'columns',
      type: 'json',
      method: nameFunction,
      params: params,
    });
    return this;
  }

  jsonExtract() {
    const column = arguments[0];
    let path;
    let alias;
    let singleValue = true;

    // We use arguments to have the signatures :
    // - column (string or array)
    // - column + path
    // - column + path + alias
    // - column + path + alias + singleValue
    // - column array + singleValue
    if (arguments.length >= 2) {
      path = arguments[1];
    }
    if (arguments.length >= 3) {
      alias = arguments[2];
    }
    if (arguments.length === 4) {
      singleValue = arguments[3];
    }
    if (
      arguments.length === 2 &&
      Array.isArray(arguments[0]) &&
      isBoolean(arguments[1])
    ) {
      singleValue = arguments[1];
    }
    return this._json('jsonExtract', {
      column: column,
      path: path,
      alias: alias,
      singleValue, // boolean used only in MSSQL to use function for extract value instead of object/array.
    });
  }

  jsonSet(column, path, value, alias) {
    return this._json('jsonSet', {
      column: column,
      path: path,
      value: value,
      alias: alias,
    });
  }

  jsonInsert(column, path, value, alias) {
    return this._json('jsonInsert', {
      column: column,
      path: path,
      value: value,
      alias: alias,
    });
  }

  jsonRemove(column, path, alias) {
    return this._json('jsonRemove', {
      column: column,
      path: path,
      alias: alias,
    });
  }

  // Wheres for JSON
  _isJsonObject(jsonValue) {
    return isObject$3(jsonValue) && !(jsonValue instanceof Builder);
  }

  _whereJsonWrappedValue(type, column, value) {
    const whereJsonClause = {
      grouping: 'where',
      type: type,
      column,
      value: value,
      not: this._not(),
      bool: this._bool(),
      asColumn: this._asColumnFlag,
    };
    if (arguments[3]) {
      whereJsonClause.operator = arguments[3];
    }
    if (arguments[4]) {
      whereJsonClause.jsonPath = arguments[4];
    }
    this._statements.push(whereJsonClause);
  }

  whereJsonObject(column, value) {
    this._whereJsonWrappedValue('whereJsonObject', column, value);
    return this;
  }

  orWhereJsonObject(column, value) {
    return this._bool('or').whereJsonObject(column, value);
  }

  whereNotJsonObject(column, value) {
    return this._not(true).whereJsonObject(column, value);
  }

  orWhereNotJsonObject(column, value) {
    return this._bool('or').whereNotJsonObject(column, value);
  }

  whereJsonPath(column, path, operator, value) {
    this._whereJsonWrappedValue('whereJsonPath', column, value, operator, path);
    return this;
  }

  orWhereJsonPath(column, path, operator, value) {
    return this._bool('or').whereJsonPath(column, path, operator, value);
  }

  // Json superset wheres
  whereJsonSupersetOf(column, value) {
    this._whereJsonWrappedValue('whereJsonSupersetOf', column, value);
    return this;
  }

  whereJsonNotSupersetOf(column, value) {
    return this._not(true).whereJsonSupersetOf(column, value);
  }

  orWhereJsonSupersetOf(column, value) {
    return this._bool('or').whereJsonSupersetOf(column, value);
  }

  orWhereJsonNotSupersetOf(column, value) {
    return this._bool('or').whereJsonNotSupersetOf(column, value);
  }

  // Json subset wheres
  whereJsonSubsetOf(column, value) {
    this._whereJsonWrappedValue('whereJsonSubsetOf', column, value);
    return this;
  }

  whereJsonNotSubsetOf(column, value) {
    return this._not(true).whereJsonSubsetOf(column, value);
  }

  orWhereJsonSubsetOf(column, value) {
    return this._bool('or').whereJsonSubsetOf(column, value);
  }

  orWhereJsonNotSubsetOf(column, value) {
    return this._bool('or').whereJsonNotSubsetOf(column, value);
  }

  whereJsonHasNone(column, values) {
    this._not(true).whereJsonHasAll(column, values);
    return this;
  }

  // end of wheres for JSON

  _analytic(alias, second, third) {
    let analytic;
    const { schema } = this._single;
    const method = this._analyticMethod();
    alias = typeof alias === 'string' ? alias : null;

    assert(
      typeof second === 'function' ||
        second.isRawInstance ||
        Array.isArray(second) ||
        typeof second === 'string' ||
        typeof second === 'object',
      `The second argument to an analytic function must be either a function, a raw,
       an array of string or object, an object or a single string.`
    );

    if (third) {
      assert(
        Array.isArray(third) ||
          typeof third === 'string' ||
          typeof third === 'object',
        'The third argument to an analytic function must be either a string, an array of string or object or an object.'
      );
    }

    if (isFunction$1(second)) {
      analytic = new Analytic(method, schema, alias);
      second.call(analytic, analytic);
    } else if (second.isRawInstance) {
      const raw = second;
      analytic = {
        grouping: 'columns',
        type: 'analytic',
        method: method,
        raw: raw,
        alias: alias,
      };
    } else {
      const order = !Array.isArray(second) ? [second] : second;
      let partitions = third || [];
      partitions = !Array.isArray(partitions) ? [partitions] : partitions;
      analytic = {
        grouping: 'columns',
        type: 'analytic',
        method: method,
        order: order,
        alias: alias,
        partitions: partitions,
      };
    }
    this._statements.push(analytic);
    return this;
  }

  rank(...args) {
    return this._analyticMethod('rank')._analytic(...args);
  }

  denseRank(...args) {
    return this._analyticMethod('dense_rank')._analytic(...args);
  }

  rowNumber(...args) {
    return this._analyticMethod('row_number')._analytic(...args);
  }

  // ----------------------------------------------------------------------

  // Helper for the incrementing/decrementing queries.
  _counter(column, amount) {
    amount = parseFloat(amount);

    this._method = 'update';

    this._single.counter = this._single.counter || {};

    this._single.counter[column] = amount;

    return this;
  }

  // Helper to get or set the "boolFlag" value.
  _bool(val) {
    if (arguments.length === 1) {
      this._boolFlag = val;
      return this;
    }
    const ret = this._boolFlag;
    this._boolFlag = 'and';
    return ret;
  }

  // Helper to get or set the "notFlag" value.
  _not(val) {
    if (arguments.length === 1) {
      this._notFlag = val;
      return this;
    }
    const ret = this._notFlag;
    this._notFlag = false;
    return ret;
  }

  // Helper to get or set the "joinFlag" value.
  _joinType(val) {
    if (arguments.length === 1) {
      this._joinFlag = val;
      return this;
    }
    const ret = this._joinFlag || 'inner';
    this._joinFlag = 'inner';
    return ret;
  }

  _analyticMethod(val) {
    if (arguments.length === 1) {
      this._analyticFlag = val;
      return this;
    }
    return this._analyticFlag || 'row_number';
  }

  // Helper for compiling any aggregate queries.
  _aggregate(method, column, options = {}) {
    this._statements.push({
      grouping: 'columns',
      type: column.isRawInstance ? 'aggregateRaw' : 'aggregate',
      method,
      value: column,
      aggregateDistinct: options.distinct || false,
      alias: options.as,
    });
    return this;
  }

  // Helper function for clearing or reseting a grouping type from the builder
  _clearGrouping(grouping) {
    if (grouping in this._single) {
      this._single[grouping] = undefined;
    } else {
      this._statements = reject(this._statements, { grouping });
    }
  }

  // Helper function that checks if the builder will emit a select query
  _isSelectQuery() {
    return SELECT_COMMANDS.has(this._method);
  }

  // Helper function that checks if the query has a lock mode set
  _hasLockMode() {
    return LOCK_MODES.has(this._single.lock);
  }
}

Builder.prototype.select = Builder.prototype.columns;
Builder.prototype.column = Builder.prototype.columns;
Builder.prototype.andWhereNot = Builder.prototype.whereNot;
Builder.prototype.andWhereNotColumn = Builder.prototype.whereNotColumn;
Builder.prototype.andWhere = Builder.prototype.where;
Builder.prototype.andWhereColumn = Builder.prototype.whereColumn;
Builder.prototype.andWhereRaw = Builder.prototype.whereRaw;
Builder.prototype.andWhereBetween = Builder.prototype.whereBetween;
Builder.prototype.andWhereNotBetween = Builder.prototype.whereNotBetween;
Builder.prototype.andWhereJsonObject = Builder.prototype.whereJsonObject;
Builder.prototype.andWhereNotJsonObject = Builder.prototype.whereNotJsonObject;
Builder.prototype.andWhereJsonPath = Builder.prototype.whereJsonPath;
Builder.prototype.andWhereLike = Builder.prototype.whereLike;
Builder.prototype.andWhereILike = Builder.prototype.whereILike;
Builder.prototype.andHaving = Builder.prototype.having;
Builder.prototype.andHavingIn = Builder.prototype.havingIn;
Builder.prototype.andHavingNotIn = Builder.prototype.havingNotIn;
Builder.prototype.andHavingNull = Builder.prototype.havingNull;
Builder.prototype.andHavingNotNull = Builder.prototype.havingNotNull;
Builder.prototype.andHavingExists = Builder.prototype.havingExists;
Builder.prototype.andHavingNotExists = Builder.prototype.havingNotExists;
Builder.prototype.andHavingBetween = Builder.prototype.havingBetween;
Builder.prototype.andHavingNotBetween = Builder.prototype.havingNotBetween;
Builder.prototype.from = Builder.prototype.table;
Builder.prototype.into = Builder.prototype.table;
Builder.prototype.del = Builder.prototype.delete;

// Attach all of the top level promise methods that should be chainable.
augmentWithBuilderInterface$2(Builder);
addQueryContext$2(Builder);

Builder.extend = (methodName, fn) => {
  if (Object.prototype.hasOwnProperty.call(Builder.prototype, methodName)) {
    throw new Error(
      `Can't extend QueryBuilder with existing method ('${methodName}').`
    );
  }

  assign$6(Builder.prototype, { [methodName]: fn });
};

// Sub-builder for onConflict clauses
class OnConflictBuilder {
  constructor(builder, columns) {
    this.builder = builder;
    this._columns = columns;
  }

  // Sets insert query to ignore conflicts
  ignore() {
    this.builder._single.onConflict = this._columns;
    this.builder._single.ignore = true;
    return this.builder;
  }

  // Sets insert query to update on conflict
  merge(updates) {
    this.builder._single.onConflict = this._columns;
    this.builder._single.merge = { updates };
    return this.builder;
  }

  // Prevent
  then() {
    throw new Error(
      'Incomplete onConflict clause. .onConflict() must be directly followed by either .merge() or .ignore()'
    );
  }
}

var querybuilder = Builder;

const require$$4$1 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(reduce$2);

const require$$0$a = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(transform$1);

const { isObject: isObject$2 } = is;

// Compiles a callback using the query builder.
function compileCallback$2(callback, method, client, bindingsHolder) {
  // Build the callback
  const builder = client.queryBuilder();
  callback.call(builder, builder);

  // Compile the callback, using the current formatter (to track all bindings).
  const compiler = client.queryCompiler(builder, bindingsHolder.bindings);

  // Return the compiled & parameterized sql.
  return compiler.toSQL(method || builder._method || 'select');
}

function wrapAsIdentifier$1(value, builder, client) {
  const queryContext = builder.queryContext();
  return client.wrapIdentifier((value || '').trim(), queryContext);
}

function formatDefault$1(value, type, client) {
  if (value === void 0) {
    return '';
  } else if (value === null) {
    return 'null';
  } else if (value && value.isRawInstance) {
    return value.toQuery();
  } else if (type === 'bool') {
    if (value === 'false') value = 0;
    return `'${value ? 1 : 0}'`;
  } else if ((type === 'json' || type === 'jsonb') && isObject$2(value)) {
    return `'${JSON.stringify(value)}'`;
  } else {
    return client._escapeBinding(value.toString());
  }
}

var formatterUtils = {
  compileCallback: compileCallback$2,
  wrapAsIdentifier: wrapAsIdentifier$1,
  formatDefault: formatDefault$1,
};

const transform = require$$0$a;
const QueryBuilder$3 = querybuilder;
const { compileCallback: compileCallback$1, wrapAsIdentifier } = formatterUtils;

// Valid values for the `order by` clause generation.
const orderBys = ['asc', 'desc'];

// Turn this into a lookup map
const operators = transform(
  [
    '=',
    '<',
    '>',
    '<=',
    '>=',
    '<>',
    '!=',
    'like',
    'not like',
    'between',
    'not between',
    'ilike',
    'not ilike',
    'exists',
    'not exist',
    'rlike',
    'not rlike',
    'regexp',
    'not regexp',
    'match',
    '&',
    '|',
    '^',
    '<<',
    '>>',
    '~',
    '~=',
    '~*',
    '!~',
    '!~*',
    '#',
    '&&',
    '@>',
    '<@',
    '||',
    '&<',
    '&>',
    '-|-',
    '@@',
    '!!',
    ['?', '\\?'],
    ['?|', '\\?|'],
    ['?&', '\\?&'],
  ],
  (result, key) => {
    if (Array.isArray(key)) {
      result[key[0]] = key[1];
    } else {
      result[key] = key;
    }
  },
  {}
);

// Accepts a string or array of columns to wrap as appropriate. Column can be raw
function columnize$1(target, builder, client, bindingHolder) {
  const columns = Array.isArray(target) ? target : [target];
  let str = '',
    i = -1;
  while (++i < columns.length) {
    if (i > 0) str += ', ';
    str += wrap(columns[i], undefined, builder, client, bindingHolder);
  }
  return str;
}

// Puts the appropriate wrapper around a value depending on the database
// engine, unless it's a knex.raw value, in which case it's left alone.
function wrap(value, isParameter, builder, client, bindingHolder) {
  const raw = unwrapRaw$1(value, isParameter, builder, client, bindingHolder);
  if (raw) return raw;
  switch (typeof value) {
    case 'function':
      return outputQuery$1(
        compileCallback$1(value, undefined, client, bindingHolder),
        true,
        builder,
        client
      );
    case 'object':
      return parseObject(value, builder, client, bindingHolder);
    case 'number':
      return value;
    default:
      return wrapString(value + '', builder, client);
  }
}

function unwrapRaw$1(value, isParameter, builder, client, bindingsHolder) {
  let query;
  if (value instanceof QueryBuilder$3) {
    query = client.queryCompiler(value).toSQL();
    if (query.bindings) {
      bindingsHolder.bindings.push(...query.bindings);
    }
    return outputQuery$1(query, isParameter, builder, client);
  }
  if (value && value.isRawInstance) {
    value.client = client;
    if (builder._queryContext) {
      value.queryContext = () => {
        return builder._queryContext;
      };
    }

    query = value.toSQL();
    if (query.bindings) {
      bindingsHolder.bindings.push(...query.bindings);
    }
    return query.sql;
  }
  if (isParameter) {
    bindingsHolder.bindings.push(value);
  }
}

function operator(value, builder, client, bindingsHolder) {
  const raw = unwrapRaw$1(value, undefined, builder, client, bindingsHolder);
  if (raw) return raw;
  const operator = operators[(value || '').toLowerCase()];
  if (!operator) {
    throw new TypeError(`The operator "${value}" is not permitted`);
  }
  return operator;
}

// Coerce to string to prevent strange errors when it's not a string.
function wrapString(value, builder, client) {
  const asIndex = value.toLowerCase().indexOf(' as ');
  if (asIndex !== -1) {
    const first = value.slice(0, asIndex);
    const second = value.slice(asIndex + 4);
    return client.alias(
      wrapString(first, builder, client),
      wrapAsIdentifier(second, builder, client)
    );
  }
  const wrapped = [];
  let i = -1;
  const segments = value.split('.');
  while (++i < segments.length) {
    value = segments[i];
    if (i === 0 && segments.length > 1) {
      wrapped.push(wrapString((value || '').trim(), builder, client));
    } else {
      wrapped.push(wrapAsIdentifier(value, builder, client));
    }
  }
  return wrapped.join('.');
}

// Key-value notation for alias
function parseObject(obj, builder, client, formatter) {
  const ret = [];
  for (const alias in obj) {
    const queryOrIdentifier = obj[alias];
    // Avoids double aliasing for subqueries
    if (typeof queryOrIdentifier === 'function') {
      const compiled = compileCallback$1(
        queryOrIdentifier,
        undefined,
        client,
        formatter
      );
      compiled.as = alias; // enforces the object's alias
      ret.push(outputQuery$1(compiled, true, builder, client));
    } else if (queryOrIdentifier instanceof QueryBuilder$3) {
      ret.push(
        client.alias(
          `(${wrap(queryOrIdentifier, undefined, builder, client, formatter)})`,
          wrapAsIdentifier(alias, builder, client)
        )
      );
    } else {
      ret.push(
        client.alias(
          wrap(queryOrIdentifier, undefined, builder, client, formatter),
          wrapAsIdentifier(alias, builder, client)
        )
      );
    }
  }
  return ret.join(', ');
}

// Ensures the query is aliased if necessary.
function outputQuery$1(compiled, isParameter, builder, client) {
  let sql = compiled.sql || '';
  if (sql) {
    if (
      (compiled.method === 'select' || compiled.method === 'first') &&
      (isParameter || compiled.as)
    ) {
      sql = `(${sql})`;
      if (compiled.as)
        return client.alias(sql, wrapString(compiled.as, builder, client));
    }
  }
  return sql;
}

/**
 * Creates SQL for a parameter, which might be passed to where() or .with() or
 * pretty much anywhere in API.
 *
 * @param value
 * @param method Optional at least 'select' or 'update' are valid
 * @param builder
 * @param client
 * @param bindingHolder
 */
function rawOrFn(value, method, builder, client, bindingHolder) {
  if (typeof value === 'function') {
    return outputQuery$1(
      compileCallback$1(value, method, client, bindingHolder),
      undefined,
      builder,
      client
    );
  }
  return unwrapRaw$1(value, undefined, builder, client, bindingHolder) || '';
}

// Specify the direction of the ordering.
function direction(value, builder, client, bindingsHolder) {
  const raw = unwrapRaw$1(value, undefined, builder, client, bindingsHolder);
  if (raw) return raw;
  return orderBys.indexOf((value || '').toLowerCase()) !== -1 ? value : 'asc';
}

var wrappingFormatter = {
  columnize: columnize$1,
  direction,
  operator,
  outputQuery: outputQuery$1,
  rawOrFn,
  unwrapRaw: unwrapRaw$1,
  wrap,
  wrapString,
};

const { columnize } = wrappingFormatter;

function replaceRawArrBindings$1(raw, client) {
  const bindingsHolder = {
    bindings: [],
  };
  const builder = raw;

  const expectedBindings = raw.bindings.length;
  const values = raw.bindings;
  let index = 0;

  const sql = raw.sql.replace(/\\?\?\??/g, function (match) {
    if (match === '\\?') {
      return match;
    }

    const value = values[index++];

    if (match === '??') {
      return columnize(value, builder, client, bindingsHolder);
    }
    return client.parameter(value, builder, bindingsHolder);
  });

  if (expectedBindings !== index) {
    throw new Error(`Expected ${expectedBindings} bindings, saw ${index}`);
  }

  return {
    method: 'raw',
    sql,
    bindings: bindingsHolder.bindings,
  };
}

function replaceKeyBindings$1(raw, client) {
  const bindingsHolder = {
    bindings: [],
  };
  const builder = raw;

  const values = raw.bindings;
  const regex = /\\?(:(\w+):(?=::)|:(\w+):(?!:)|:(\w+))/g;

  const sql = raw.sql.replace(regex, function (match, p1, p2, p3, p4) {
    if (match !== p1) {
      return p1;
    }

    const part = p2 || p3 || p4;
    const key = match.trim();
    const isIdentifier = key[key.length - 1] === ':';
    const value = values[part];

    if (value === undefined) {
      if (Object.prototype.hasOwnProperty.call(values, part)) {
        bindingsHolder.bindings.push(value);
      }

      return match;
    }

    if (isIdentifier) {
      return match.replace(
        p1,
        columnize(value, builder, client, bindingsHolder)
      );
    }

    return match.replace(p1, client.parameter(value, builder, bindingsHolder));
  });

  return {
    method: 'raw',
    sql,
    bindings: bindingsHolder.bindings,
  };
}

var rawFormatter = {
  replaceKeyBindings: replaceKeyBindings$1,
  replaceRawArrBindings: replaceRawArrBindings$1,
};

// This alphabet uses `A-Za-z0-9_-` symbols. The genetic algorithm helped
// optimize the gzip compression for this alphabet.
const urlAlphabet =
  'ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW';

const numberAlphabet = '0123456789';

/**
 * Generate URL-friendly unique ID. This method uses the non-secure
 * predictable random generator with bigger collision probability.
 * Based on https://github.com/ai/nanoid
 *
 * ```js
 * model.id = nanoid() //=> "Uakgb_J5m9g-0JDMbcJqL"
 * ```
 *
 * @param size Size of the ID. The default size is 21.
 * @returns A random string.
 */
function nanoid$2(size = 21) {
  let id = '';
  // A compact alternative for `for (var i = 0; i < step; i++)`.
  let i = size;
  while (i--) {
    // `| 0` is more compact and faster than `Math.floor()`.
    id += urlAlphabet[(Math.random() * 64) | 0];
  }
  return id;
}

function nanonum(size = 21) {
  let id = '';
  let i = size;
  while (i--) {
    id += numberAlphabet[(Math.random() * 10) | 0];
  }
  return id;
}

var nanoid_1 = { nanoid: nanoid$2, nanonum };

// Raw
// -------
const { EventEmitter: EventEmitter$6 } = require$$2$b;
const debug$2 = require$$2$9;
const assign$5 = require$$2$6;
const isPlainObject$1 = require$$3$3;
const reduce$1 = require$$4$1;

const {
  replaceRawArrBindings,
  replaceKeyBindings,
} = rawFormatter;
const helpers$6 = helpers$7;
const saveAsyncStack$1 = saveAsyncStack$3;
const { nanoid: nanoid$1 } = nanoid_1;
const { isNumber, isObject: isObject$1 } = is;
const {
  augmentWithBuilderInterface: augmentWithBuilderInterface$1,
} = builderInterfaceAugmenter;

const debugBindings$1 = debug$2('knex:bindings');

let Raw$3 = class Raw extends EventEmitter$6 {
  constructor(client) {
    super();

    this.client = client;

    this.sql = '';
    this.bindings = [];

    // Todo: Deprecate
    this._wrappedBefore = undefined;
    this._wrappedAfter = undefined;
    if (client && client.config) {
      this._debug = client.config.debug;
      saveAsyncStack$1(this, 4);
    }
  }
  set(sql, bindings) {
    this.sql = sql;
    this.bindings =
      (isObject$1(bindings) && !bindings.toSQL) || bindings === undefined
        ? bindings
        : [bindings];

    return this;
  }

  timeout(ms, { cancel } = {}) {
    if (isNumber(ms) && ms > 0) {
      this._timeout = ms;
      if (cancel) {
        this.client.assertCanCancelQuery();
        this._cancelOnTimeout = true;
      }
    }
    return this;
  }

  // Wraps the current sql with `before` and `after`.
  wrap(before, after) {
    this._wrappedBefore = before;
    this._wrappedAfter = after;
    return this;
  }

  // Calls `toString` on the Knex object.
  toString() {
    return this.toQuery();
  }

  // Returns the raw sql for the query.
  toSQL(method, tz) {
    let obj;
    if (Array.isArray(this.bindings)) {
      obj = replaceRawArrBindings(this, this.client);
    } else if (this.bindings && isPlainObject$1(this.bindings)) {
      obj = replaceKeyBindings(this, this.client);
    } else {
      obj = {
        method: 'raw',
        sql: this.sql,
        bindings: this.bindings === undefined ? [] : [this.bindings],
      };
    }

    if (this._wrappedBefore) {
      obj.sql = this._wrappedBefore + obj.sql;
    }
    if (this._wrappedAfter) {
      obj.sql = obj.sql + this._wrappedAfter;
    }

    obj.options = reduce$1(this._options, assign$5, {});

    if (this._timeout) {
      obj.timeout = this._timeout;
      if (this._cancelOnTimeout) {
        obj.cancelOnTimeout = this._cancelOnTimeout;
      }
    }

    obj.bindings = obj.bindings || [];
    if (helpers$6.containsUndefined(obj.bindings)) {
      const undefinedBindingIndices = helpers$6.getUndefinedIndices(
        this.bindings
      );
      debugBindings$1(obj.bindings);
      throw new Error(
        `Undefined binding(s) detected for keys [${undefinedBindingIndices}] when compiling RAW query: ${obj.sql}`
      );
    }

    obj.__knexQueryUid = nanoid$1();

    Object.defineProperties(obj, {
      toNative: {
        value: () => ({
          sql: this.client.positionBindings(obj.sql),
          bindings: this.client.prepBindings(obj.bindings),
        }),
        enumerable: false,
      },
    });

    return obj;
  }
};

// Workaround to avoid circular dependency between wrappingFormatter.unwrapRaw and rawFormatter
Raw$3.prototype.isRawInstance = true;

// Allow the `Raw` object to be utilized with full access to the relevant
// promise API.
augmentWithBuilderInterface$1(Raw$3);
helpers$6.addQueryContext(Raw$3);

var raw = Raw$3;

const require$$0$9 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(compact$1);

const require$$1$6 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(groupBy$4);

const require$$0$8 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(has$2);

const require$$1$5 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(map$1);

const require$$11 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(omitBy$1);

// Query Compiler
// -------
const helpers$5 = helpers$7;
const Raw$2 = raw;
const QueryBuilder$2 = querybuilder;
const JoinClause = joinclause;
const debug$1 = require$$2$9;

const assign$4 = require$$2$6;
const compact = require$$0$9;
const groupBy$3 = require$$1$6;
const has$1 = require$$0$8;
const isEmpty$1 = require$$2$8;
const map = require$$1$5;
const omitBy = require$$11;
const reduce = require$$4$1;
const { nanoid } = nanoid_1;
const { isString: isString$2, isUndefined } = is;
const {
  columnize: columnize_$2,
  direction: direction_,
  operator: operator_$1,
  wrap: wrap_$1,
  unwrapRaw: unwrapRaw_,
  rawOrFn: rawOrFn_,
} = wrappingFormatter;

const debugBindings = debug$1('knex:bindings');

const components = [
  'comments',
  'columns',
  'join',
  'where',
  'union',
  'group',
  'having',
  'order',
  'limit',
  'offset',
  'lock',
  'waitMode',
];

// The "QueryCompiler" takes all of the query statements which
// have been gathered in the "QueryBuilder" and turns them into a
// properly formatted / bound query string.
let QueryCompiler$1 = class QueryCompiler {
  constructor(client, builder, bindings) {
    this.client = client;
    this.method = builder._method || 'select';
    this.options = builder._options;
    this.single = builder._single;
    this.queryComments = builder._comments;
    this.timeout = builder._timeout || false;
    this.cancelOnTimeout = builder._cancelOnTimeout || false;
    this.grouped = groupBy$3(builder._statements, 'grouping');
    this.formatter = client.formatter(builder);
    // Used when the insert call is empty.
    this._emptyInsertValue = 'default values';
    this.first = this.select;

    this.bindings = bindings || [];
    this.formatter.bindings = this.bindings;
    this.bindingsHolder = this;
    this.builder = this.formatter.builder;
  }

  // Collapse the builder into a single object
  toSQL(method, tz) {
    this._undefinedInWhereClause = false;
    this.undefinedBindingsInfo = [];

    method = method || this.method;
    const val = this[method]() || '';

    const query = {
      method,
      options: reduce(this.options, assign$4, {}),
      timeout: this.timeout,
      cancelOnTimeout: this.cancelOnTimeout,
      bindings: this.bindingsHolder.bindings || [],
      __knexQueryUid: nanoid(),
    };

    Object.defineProperties(query, {
      toNative: {
        value: () => {
          return {
            sql: this.client.positionBindings(query.sql),
            bindings: this.client.prepBindings(query.bindings),
          };
        },
        enumerable: false,
      },
    });

    if (isString$2(val)) {
      query.sql = val;
    } else {
      assign$4(query, val);
    }

    if (method === 'select' || method === 'first') {
      if (this.single.as) {
        query.as = this.single.as;
      }
    }

    if (this._undefinedInWhereClause) {
      debugBindings(query.bindings);
      throw new Error(
        `Undefined binding(s) detected when compiling ` +
          `${method.toUpperCase()}. Undefined column(s): [${this.undefinedBindingsInfo.join(
            ', '
          )}] query: ${query.sql}`
      );
    }

    return query;
  }

  // Compiles the `select` statement, or nested sub-selects by calling each of
  // the component compilers, trimming out the empties, and returning a
  // generated query string.
  select() {
    let sql = this.with();

    let unionStatement = '';

    const firstStatements = [];
    const endStatements = [];

    components.forEach((component) => {
      const statement = this[component](this);
      // We store the 'union' statement to append it at the end.
      // We still need to call the component sequentially because of
      // order of bindings.
      switch (component) {
        case 'union':
          unionStatement = statement;
          break;
        case 'comments':
        case 'columns':
        case 'join':
        case 'where':
          firstStatements.push(statement);
          break;
        default:
          endStatements.push(statement);
          break;
      }
    });

    // Check if we need to wrap the main query.
    // We need to wrap main query if one of union have wrap options to true
    // to avoid error syntax (in PostgreSQL for example).
    const wrapMainQuery =
      this.grouped.union &&
      this.grouped.union.map((u) => u.wrap).some((u) => u);

    if (this.onlyUnions()) {
      const statements = compact(firstStatements.concat(endStatements)).join(
        ' '
      );
      sql += unionStatement + (statements ? ' ' + statements : '');
    } else {
      const allStatements =
        (wrapMainQuery ? '(' : '') +
        compact(firstStatements).join(' ') +
        (wrapMainQuery ? ')' : '');
      const endStat = compact(endStatements).join(' ');
      sql +=
        allStatements +
        (unionStatement ? ' ' + unionStatement : '') +
        (endStat ? ' ' + endStat : endStat);
    }
    return sql;
  }

  pluck() {
    let toPluck = this.single.pluck;
    if (toPluck.indexOf('.') !== -1) {
      toPluck = toPluck.split('.').slice(-1)[0];
    }
    return {
      sql: this.select(),
      pluck: toPluck,
    };
  }

  // Compiles an "insert" query, allowing for multiple
  // inserts using a single query statement.
  insert() {
    const insertValues = this.single.insert || [];
    const sql = this.with() + `insert into ${this.tableName} `;
    const body = this._insertBody(insertValues);
    return body === '' ? '' : sql + body;
  }

  _onConflictClause(columns) {
    return columns instanceof Raw$2
      ? this.formatter.wrap(columns)
      : `(${this.formatter.columnize(columns)})`;
  }

  _buildInsertValues(insertData) {
    let sql = '';
    let i = -1;
    while (++i < insertData.values.length) {
      if (i !== 0) sql += '), (';
      sql += this.client.parameterize(
        insertData.values[i],
        this.client.valueForUndefined,
        this.builder,
        this.bindingsHolder
      );
    }
    return sql;
  }

  _insertBody(insertValues) {
    let sql = '';
    if (Array.isArray(insertValues)) {
      if (insertValues.length === 0) {
        return '';
      }
    } else if (typeof insertValues === 'object' && isEmpty$1(insertValues)) {
      return sql + this._emptyInsertValue;
    }

    const insertData = this._prepInsert(insertValues);
    if (typeof insertData === 'string') {
      sql += insertData;
    } else {
      if (insertData.columns.length) {
        sql += `(${columnize_$2(
          insertData.columns,
          this.builder,
          this.client,
          this.bindingsHolder
        )}`;
        sql += ') values (' + this._buildInsertValues(insertData) + ')';
      } else if (insertValues.length === 1 && insertValues[0]) {
        sql += this._emptyInsertValue;
      } else {
        sql = '';
      }
    }
    return sql;
  }

  // Compiles the "update" query.
  update() {
    // Make sure tableName is processed by the formatter first.
    const withSQL = this.with();
    const { tableName } = this;
    const updateData = this._prepUpdate(this.single.update);
    const wheres = this.where();
    return (
      withSQL +
      `update ${this.single.only ? 'only ' : ''}${tableName}` +
      ' set ' +
      updateData.join(', ') +
      (wheres ? ` ${wheres}` : '')
    );
  }

  _hintComments() {
    let hints = this.grouped.hintComments || [];
    hints = hints.map((hint) => compact(hint.value).join(' '));
    hints = compact(hints).join(' ');
    return hints ? `/*+ ${hints} */ ` : '';
  }

  // Compiles the columns in the query, specifying if an item was distinct.
  columns() {
    let distinctClause = '';
    if (this.onlyUnions()) return '';
    const hints = this._hintComments();
    const columns = this.grouped.columns || [];
    let i = -1,
      sql = [];
    if (columns) {
      while (++i < columns.length) {
        const stmt = columns[i];
        if (stmt.distinct) distinctClause = 'distinct ';
        if (stmt.distinctOn) {
          distinctClause = this.distinctOn(stmt.value);
          continue;
        }
        if (stmt.type === 'aggregate') {
          sql.push(...this.aggregate(stmt));
        } else if (stmt.type === 'aggregateRaw') {
          sql.push(this.aggregateRaw(stmt));
        } else if (stmt.type === 'analytic') {
          sql.push(this.analytic(stmt));
        } else if (stmt.type === 'json') {
          sql.push(this.json(stmt));
        } else if (stmt.value && stmt.value.length > 0) {
          sql.push(
            columnize_$2(
              stmt.value,
              this.builder,
              this.client,
              this.bindingsHolder
            )
          );
        }
      }
    }
    if (sql.length === 0) sql = ['*'];
    const select = this.onlyJson() ? '' : 'select ';
    return (
      `${select}${hints}${distinctClause}` +
      sql.join(', ') +
      (this.tableName
        ? ` from ${this.single.only ? 'only ' : ''}${this.tableName}`
        : '')
    );
  }

  // Add comments to the query
  comments() {
    if (!this.queryComments.length) return '';
    return this.queryComments
      .map((comment) => `/* ${comment.comment} */`)
      .join(' ');
  }

  _aggregate(stmt, { aliasSeparator = ' as ', distinctParentheses } = {}) {
    const value = stmt.value;
    const method = stmt.method;
    const distinct = stmt.aggregateDistinct ? 'distinct ' : '';
    const wrap = (identifier) =>
      wrap_$1(
        identifier,
        undefined,
        this.builder,
        this.client,
        this.bindingsHolder
      );
    const addAlias = (value, alias) => {
      if (alias) {
        return value + aliasSeparator + wrap(alias);
      }
      return value;
    };
    const aggregateArray = (value, alias) => {
      let columns = value.map(wrap).join(', ');
      if (distinct) {
        const openParen = distinctParentheses ? '(' : ' ';
        const closeParen = distinctParentheses ? ')' : '';
        columns = distinct.trim() + openParen + columns + closeParen;
      }
      const aggregated = `${method}(${columns})`;
      return addAlias(aggregated, alias);
    };
    const aggregateString = (value, alias) => {
      const aggregated = `${method}(${distinct + wrap(value)})`;
      return addAlias(aggregated, alias);
    };

    if (Array.isArray(value)) {
      return [aggregateArray(value)];
    }

    if (typeof value === 'object') {
      if (stmt.alias) {
        throw new Error('When using an object explicit alias can not be used');
      }
      return Object.entries(value).map(([alias, column]) => {
        if (Array.isArray(column)) {
          return aggregateArray(column, alias);
        }
        return aggregateString(column, alias);
      });
    }

    // Allows us to speciy an alias for the aggregate types.
    const splitOn = value.toLowerCase().indexOf(' as ');
    let column = value;
    let { alias } = stmt;
    if (splitOn !== -1) {
      column = value.slice(0, splitOn);
      if (alias) {
        throw new Error(`Found multiple aliases for same column: ${column}`);
      }
      alias = value.slice(splitOn + 4);
    }
    return [aggregateString(column, alias)];
  }

  aggregate(stmt) {
    return this._aggregate(stmt);
  }

  aggregateRaw(stmt) {
    const distinct = stmt.aggregateDistinct ? 'distinct ' : '';
    return `${stmt.method}(${
      distinct +
      unwrapRaw_(
        stmt.value,
        undefined,
        this.builder,
        this.client,
        this.bindingsHolder
      )
    })`;
  }

  _joinTable(join) {
    return join.schema && !(join.table instanceof Raw$2)
      ? `${join.schema}.${join.table}`
      : join.table;
  }

  // Compiles all each of the `join` clauses on the query,
  // including any nested join queries.
  join() {
    let sql = '';
    let i = -1;
    const joins = this.grouped.join;
    if (!joins) return '';
    while (++i < joins.length) {
      const join = joins[i];
      const table = this._joinTable(join);
      if (i > 0) sql += ' ';
      if (join.joinType === 'raw') {
        sql += unwrapRaw_(
          join.table,
          undefined,
          this.builder,
          this.client,
          this.bindingsHolder
        );
      } else {
        sql +=
          join.joinType +
          ' join ' +
          wrap_$1(
            table,
            undefined,
            this.builder,
            this.client,
            this.bindingsHolder
          );
        let ii = -1;
        while (++ii < join.clauses.length) {
          const clause = join.clauses[ii];
          if (ii > 0) {
            sql += ` ${clause.bool} `;
          } else {
            sql += ` ${clause.type === 'onUsing' ? 'using' : 'on'} `;
          }
          const val = this[clause.type](clause);
          if (val) {
            sql += val;
          }
        }
      }
    }
    return sql;
  }

  onBetween(statement) {
    return (
      wrap_$1(
        statement.column,
        undefined,
        this.builder,
        this.client,
        this.bindingsHolder
      ) +
      ' ' +
      this._not(statement, 'between') +
      ' ' +
      statement.value
        .map((value) =>
          this.client.parameter(value, this.builder, this.bindingsHolder)
        )
        .join(' and ')
    );
  }

  onNull(statement) {
    return (
      wrap_$1(
        statement.column,
        undefined,
        this.builder,
        this.client,
        this.bindingsHolder
      ) +
      ' is ' +
      this._not(statement, 'null')
    );
  }

  onExists(statement) {
    return (
      this._not(statement, 'exists') +
      ' (' +
      rawOrFn_(
        statement.value,
        undefined,
        this.builder,
        this.client,
        this.bindingsHolder
      ) +
      ')'
    );
  }

  onIn(statement) {
    if (Array.isArray(statement.column)) return this.multiOnIn(statement);

    let values;
    if (statement.value instanceof Raw$2) {
      values = this.client.parameter(
        statement.value,
        this.builder,
        this.formatter
      );
    } else {
      values = this.client.parameterize(
        statement.value,
        undefined,
        this.builder,
        this.bindingsHolder
      );
    }

    return (
      wrap_$1(
        statement.column,
        undefined,
        this.builder,
        this.client,
        this.bindingsHolder
      ) +
      ' ' +
      this._not(statement, 'in ') +
      this.wrap(values)
    );
  }

  multiOnIn(statement) {
    let i = -1,
      sql = `(${columnize_$2(
        statement.column,
        this.builder,
        this.client,
        this.bindingsHolder
      )}) `;
    sql += this._not(statement, 'in ') + '((';
    while (++i < statement.value.length) {
      if (i !== 0) sql += '),(';
      sql += this.client.parameterize(
        statement.value[i],
        undefined,
        this.builder,
        this.bindingsHolder
      );
    }
    return sql + '))';
  }

  // Compiles all `where` statements on the query.
  where() {
    const wheres = this.grouped.where;
    if (!wheres) return;
    const sql = [];
    let i = -1;
    while (++i < wheres.length) {
      const stmt = wheres[i];
      if (
        Object.prototype.hasOwnProperty.call(stmt, 'value') &&
        helpers$5.containsUndefined(stmt.value)
      ) {
        this.undefinedBindingsInfo.push(stmt.column);
        this._undefinedInWhereClause = true;
      }
      const val = this[stmt.type](stmt);
      if (val) {
        if (sql.length === 0) {
          sql[0] = 'where';
        } else {
          sql.push(stmt.bool);
        }
        sql.push(val);
      }
    }
    return sql.length > 1 ? sql.join(' ') : '';
  }

  group() {
    return this._groupsOrders('group');
  }

  order() {
    return this._groupsOrders('order');
  }

  // Compiles the `having` statements.
  having() {
    const havings = this.grouped.having;
    if (!havings) return '';
    const sql = ['having'];
    for (let i = 0, l = havings.length; i < l; i++) {
      const s = havings[i];
      const val = this[s.type](s);
      if (val) {
        if (sql.length === 0) {
          sql[0] = 'where';
        }
        if (sql.length > 1 || (sql.length === 1 && sql[0] !== 'having')) {
          sql.push(s.bool);
        }
        sql.push(val);
      }
    }
    return sql.length > 1 ? sql.join(' ') : '';
  }

  havingRaw(statement) {
    return (
      this._not(statement, '') +
      unwrapRaw_(
        statement.value,
        undefined,
        this.builder,
        this.client,
        this.bindingsHolder
      )
    );
  }

  havingWrapped(statement) {
    const val = rawOrFn_(
      statement.value,
      'where',
      this.builder,
      this.client,
      this.bindingsHolder
    );
    return (val && this._not(statement, '') + '(' + val.slice(6) + ')') || '';
  }

  havingBasic(statement) {
    return (
      this._not(statement, '') +
      wrap_$1(
        statement.column,
        undefined,
        this.builder,
        this.client,
        this.bindingsHolder
      ) +
      ' ' +
      operator_$1(
        statement.operator,
        this.builder,
        this.client,
        this.bindingsHolder
      ) +
      ' ' +
      this.client.parameter(statement.value, this.builder, this.bindingsHolder)
    );
  }

  havingNull(statement) {
    return (
      wrap_$1(
        statement.column,
        undefined,
        this.builder,
        this.client,
        this.bindingsHolder
      ) +
      ' is ' +
      this._not(statement, 'null')
    );
  }

  havingExists(statement) {
    return (
      this._not(statement, 'exists') +
      ' (' +
      rawOrFn_(
        statement.value,
        undefined,
        this.builder,
        this.client,
        this.bindingsHolder
      ) +
      ')'
    );
  }

  havingBetween(statement) {
    return (
      wrap_$1(
        statement.column,
        undefined,
        this.builder,
        this.client,
        this.bindingsHolder
      ) +
      ' ' +
      this._not(statement, 'between') +
      ' ' +
      statement.value
        .map((value) =>
          this.client.parameter(value, this.builder, this.bindingsHolder)
        )
        .join(' and ')
    );
  }

  havingIn(statement) {
    if (Array.isArray(statement.column)) return this.multiHavingIn(statement);
    return (
      wrap_$1(
        statement.column,
        undefined,
        this.builder,
        this.client,
        this.bindingsHolder
      ) +
      ' ' +
      this._not(statement, 'in ') +
      this.wrap(
        this.client.parameterize(
          statement.value,
          undefined,
          this.builder,
          this.bindingsHolder
        )
      )
    );
  }

  multiHavingIn(statement) {
    return this.multiOnIn(statement);
  }

  // Compile the "union" queries attached to the main query.
  union() {
    const onlyUnions = this.onlyUnions();
    const unions = this.grouped.union;
    if (!unions) return '';
    let sql = '';
    for (let i = 0, l = unions.length; i < l; i++) {
      const union = unions[i];
      if (i > 0) sql += ' ';
      if (i > 0 || !onlyUnions) sql += union.clause + ' ';
      const statement = rawOrFn_(
        union.value,
        undefined,
        this.builder,
        this.client,
        this.bindingsHolder
      );
      if (statement) {
        const wrap = union.wrap;
        if (wrap) sql += '(';
        sql += statement;
        if (wrap) sql += ')';
      }
    }
    return sql;
  }

  // If we haven't specified any columns or a `tableName`, we're assuming this
  // is only being used for unions.
  onlyUnions() {
    return (
      (!this.grouped.columns || !!this.grouped.columns[0].value) &&
      this.grouped.union &&
      !this.tableName
    );
  }

  _getValueOrParameterFromAttribute(attribute, rawValue) {
    if (this.single.skipBinding[attribute] === true) {
      return rawValue !== undefined && rawValue !== null
        ? rawValue
        : this.single[attribute];
    }
    return this.client.parameter(
      this.single[attribute],
      this.builder,
      this.bindingsHolder
    );
  }

  onlyJson() {
    return (
      !this.tableName &&
      this.grouped.columns &&
      this.grouped.columns.length === 1 &&
      this.grouped.columns[0].type === 'json'
    );
  }

  limit() {
    const noLimit = !this.single.limit && this.single.limit !== 0;
    if (noLimit) return '';
    return `limit ${this._getValueOrParameterFromAttribute('limit')}`;
  }

  offset() {
    if (!this.single.offset) return '';
    return `offset ${this._getValueOrParameterFromAttribute('offset')}`;
  }

  // Compiles a `delete` query.
  del() {
    // Make sure tableName is processed by the formatter first.
    const { tableName } = this;
    const withSQL = this.with();
    const wheres = this.where();
    const joins = this.join();
    // When using joins, delete the "from" table values as a default
    const deleteSelector = joins ? tableName + ' ' : '';
    return (
      withSQL +
      `delete ${deleteSelector}from ${
        this.single.only ? 'only ' : ''
      }${tableName}` +
      (joins ? ` ${joins}` : '') +
      (wheres ? ` ${wheres}` : '')
    );
  }

  // Compiles a `truncate` query.
  truncate() {
    return `truncate ${this.tableName}`;
  }

  // Compiles the "locks".
  lock() {
    if (this.single.lock) {
      return this[this.single.lock]();
    }
  }

  // Compiles the wait mode on the locks.
  waitMode() {
    if (this.single.waitMode) {
      return this[this.single.waitMode]();
    }
  }

  // Fail on unsupported databases
  skipLocked() {
    throw new Error(
      '.skipLocked() is currently only supported on MySQL 8.0+ and PostgreSQL 9.5+'
    );
  }

  // Fail on unsupported databases
  noWait() {
    throw new Error(
      '.noWait() is currently only supported on MySQL 8.0+, MariaDB 10.3.0+ and PostgreSQL 9.5+'
    );
  }

  distinctOn(value) {
    throw new Error('.distinctOn() is currently only supported on PostgreSQL');
  }

  // On Clause
  // ------

  onWrapped(clause) {
    const self = this;

    const wrapJoin = new JoinClause();
    clause.value.call(wrapJoin, wrapJoin);

    let sql = '';

    for (let ii = 0; ii < wrapJoin.clauses.length; ii++) {
      const wrapClause = wrapJoin.clauses[ii];
      if (ii > 0) {
        sql += ` ${wrapClause.bool} `;
      }
      const val = self[wrapClause.type](wrapClause);
      if (val) {
        sql += val;
      }
    }

    if (sql.length) {
      return `(${sql})`;
    }
    return '';
  }

  onBasic(clause) {
    const toWrap = clause.value instanceof QueryBuilder$2;
    return (
      wrap_$1(
        clause.column,
        undefined,
        this.builder,
        this.client,
        this.bindingsHolder
      ) +
      ' ' +
      operator_$1(
        clause.operator,
        this.builder,
        this.client,
        this.bindingsHolder
      ) +
      ' ' +
      (toWrap ? '(' : '') +
      wrap_$1(
        clause.value,
        undefined,
        this.builder,
        this.client,
        this.bindingsHolder
      ) +
      (toWrap ? ')' : '')
    );
  }

  onVal(clause) {
    return (
      wrap_$1(
        clause.column,
        undefined,
        this.builder,
        this.client,
        this.bindingsHolder
      ) +
      ' ' +
      operator_$1(
        clause.operator,
        this.builder,
        this.client,
        this.bindingsHolder
      ) +
      ' ' +
      this.client.parameter(clause.value, this.builder, this.bindingsHolder)
    );
  }

  onRaw(clause) {
    return unwrapRaw_(
      clause.value,
      undefined,
      this.builder,
      this.client,
      this.bindingsHolder
    );
  }

  onUsing(clause) {
    return (
      '(' +
      columnize_$2(
        clause.column,
        this.builder,
        this.client,
        this.bindingsHolder
      ) +
      ')'
    );
  }

  // Where Clause
  // ------

  _valueClause(statement) {
    return statement.asColumn
      ? wrap_$1(
          statement.value,
          undefined,
          this.builder,
          this.client,
          this.bindingsHolder
        )
      : this.client.parameter(
          statement.value,
          this.builder,
          this.bindingsHolder
        );
  }

  _columnClause(statement) {
    let columns;
    if (Array.isArray(statement.column)) {
      columns = `(${columnize_$2(
        statement.column,
        this.builder,
        this.client,
        this.bindingsHolder
      )})`;
    } else {
      columns = wrap_$1(
        statement.column,
        undefined,
        this.builder,
        this.client,
        this.bindingsHolder
      );
    }
    return columns;
  }

  whereIn(statement) {
    const values = this.client.values(
      statement.value,
      this.builder,
      this.bindingsHolder
    );
    return `${this._columnClause(statement)} ${this._not(
      statement,
      'in '
    )}${values}`;
  }

  whereLike(statement) {
    return `${this._columnClause(statement)} ${this._not(
      statement,
      'like '
    )}${this._valueClause(statement)}`;
  }

  whereILike(statement) {
    return `${this._columnClause(statement)} ${this._not(
      statement,
      'ilike '
    )}${this._valueClause(statement)}`;
  }

  whereNull(statement) {
    return (
      wrap_$1(
        statement.column,
        undefined,
        this.builder,
        this.client,
        this.bindingsHolder
      ) +
      ' is ' +
      this._not(statement, 'null')
    );
  }

  // Compiles a basic "where" clause.
  whereBasic(statement) {
    return (
      this._not(statement, '') +
      wrap_$1(
        statement.column,
        undefined,
        this.builder,
        this.client,
        this.bindingsHolder
      ) +
      ' ' +
      operator_$1(
        statement.operator,
        this.builder,
        this.client,
        this.bindingsHolder
      ) +
      ' ' +
      this._valueClause(statement)
    );
  }

  whereExists(statement) {
    return (
      this._not(statement, 'exists') +
      ' (' +
      rawOrFn_(
        statement.value,
        undefined,
        this.builder,
        this.client,
        this.bindingsHolder
      ) +
      ')'
    );
  }

  whereWrapped(statement) {
    const val = rawOrFn_(
      statement.value,
      'where',
      this.builder,
      this.client,
      this.bindingsHolder
    );
    return (val && this._not(statement, '') + '(' + val.slice(6) + ')') || '';
  }

  whereBetween(statement) {
    return (
      wrap_$1(
        statement.column,
        undefined,
        this.builder,
        this.client,
        this.bindingsHolder
      ) +
      ' ' +
      this._not(statement, 'between') +
      ' ' +
      statement.value
        .map((value) =>
          this.client.parameter(value, this.builder, this.bindingsHolder)
        )
        .join(' and ')
    );
  }

  // Compiles a "whereRaw" query.
  whereRaw(statement) {
    return (
      this._not(statement, '') +
      unwrapRaw_(
        statement.value,
        undefined,
        this.builder,
        this.client,
        this.bindingsHolder
      )
    );
  }

  _jsonWrapValue(jsonValue) {
    if (!this.builder._isJsonObject(jsonValue)) {
      try {
        return JSON.stringify(JSON.parse(jsonValue.replace(/\n|\t/g, '')));
      } catch (e) {
        return jsonValue;
      }
    }
    return JSON.stringify(jsonValue);
  }

  _jsonValueClause(statement) {
    statement.value = this._jsonWrapValue(statement.value);
    return this._valueClause(statement);
  }

  whereJsonObject(statement) {
    return `${this._columnClause(statement)} ${
      statement.not ? '!=' : '='
    } ${this._jsonValueClause(statement)}`;
  }

  wrap(str) {
    if (str.charAt(0) !== '(') return `(${str})`;
    return str;
  }

  json(stmt) {
    return this[stmt.method](stmt.params);
  }

  analytic(stmt) {
    let sql = '';
    const self = this;
    sql += stmt.method + '() over (';

    if (stmt.raw) {
      sql += stmt.raw;
    } else {
      if (stmt.partitions.length) {
        sql += 'partition by ';
        sql +=
          map(stmt.partitions, function (partition) {
            if (isString$2(partition)) {
              return self.formatter.columnize(partition);
            } else return self.formatter.columnize(partition.column) + (partition.order ? ' ' + partition.order : '');
          }).join(', ') + ' ';
      }

      sql += 'order by ';
      sql += map(stmt.order, function (order) {
        if (isString$2(order)) {
          return self.formatter.columnize(order);
        } else return self.formatter.columnize(order.column) + (order.order ? ' ' + order.order : '');
      }).join(', ');
    }

    sql += ')';

    if (stmt.alias) {
      sql += ' as ' + stmt.alias;
    }

    return sql;
  }

  // Compiles all `with` statements on the query.
  with() {
    if (!this.grouped.with || !this.grouped.with.length) {
      return '';
    }
    const withs = this.grouped.with;
    if (!withs) return;
    const sql = [];
    let i = -1;
    let isRecursive = false;
    while (++i < withs.length) {
      const stmt = withs[i];
      if (stmt.recursive) {
        isRecursive = true;
      }
      const val = this[stmt.type](stmt);
      sql.push(val);
    }
    return `with ${isRecursive ? 'recursive ' : ''}${sql.join(', ')} `;
  }

  withWrapped(statement) {
    const val = rawOrFn_(
      statement.value,
      undefined,
      this.builder,
      this.client,
      this.bindingsHolder
    );
    const columnList = statement.columnList
      ? '(' +
        columnize_$2(
          statement.columnList,
          this.builder,
          this.client,
          this.bindingsHolder
        ) +
        ')'
      : '';
    const materialized =
      statement.materialized === undefined
        ? ''
        : statement.materialized
        ? 'materialized '
        : 'not materialized ';
    return (
      (val &&
        columnize_$2(
          statement.alias,
          this.builder,
          this.client,
          this.bindingsHolder
        ) +
          columnList +
          ' as ' +
          materialized +
          '(' +
          val +
          ')') ||
      ''
    );
  }

  // Determines whether to add a "not" prefix to the where clause.
  _not(statement, str) {
    if (statement.not) return `not ${str}`;
    return str;
  }

  _prepInsert(data) {
    const isRaw = rawOrFn_(
      data,
      undefined,
      this.builder,
      this.client,
      this.bindingsHolder
    );
    if (isRaw) return isRaw;
    let columns = [];
    const values = [];
    if (!Array.isArray(data)) data = data ? [data] : [];
    let i = -1;
    while (++i < data.length) {
      if (data[i] == null) break;
      if (i === 0) columns = Object.keys(data[i]).sort();
      const row = new Array(columns.length);
      const keys = Object.keys(data[i]);
      let j = -1;
      while (++j < keys.length) {
        const key = keys[j];
        let idx = columns.indexOf(key);
        if (idx === -1) {
          columns = columns.concat(key).sort();
          idx = columns.indexOf(key);
          let k = -1;
          while (++k < values.length) {
            values[k].splice(idx, 0, undefined);
          }
          row.splice(idx, 0, undefined);
        }
        row[idx] = data[i][key];
      }
      values.push(row);
    }
    return {
      columns,
      values,
    };
  }

  // "Preps" the update.
  _prepUpdate(data = {}) {
    const { counter = {} } = this.single;

    for (const column of Object.keys(counter)) {
      //Skip?
      if (has$1(data, column)) {
        //Needed?
        this.client.logger.warn(
          `increment/decrement called for a column that has already been specified in main .update() call. Ignoring increment/decrement and using value from .update() call.`
        );
        continue;
      }

      let value = counter[column];

      const symbol = value < 0 ? '-' : '+';

      if (symbol === '-') {
        value = -value;
      }

      data[column] = this.client.raw(`?? ${symbol} ?`, [column, value]);
    }

    data = omitBy(data, isUndefined);

    const vals = [];
    const columns = Object.keys(data);
    let i = -1;

    while (++i < columns.length) {
      vals.push(
        wrap_$1(
          columns[i],
          undefined,
          this.builder,
          this.client,
          this.bindingsHolder
        ) +
          ' = ' +
          this.client.parameter(
            data[columns[i]],
            this.builder,
            this.bindingsHolder
          )
      );
    }

    if (isEmpty$1(vals)) {
      throw new Error(
        [
          'Empty .update() call detected!',
          'Update data does not contain any values to update.',
          'This will result in a faulty query.',
          this.single.table ? `Table: ${this.single.table}.` : '',
          this.single.update
            ? `Columns: ${Object.keys(this.single.update)}.`
            : '',
        ].join(' ')
      );
    }

    return vals;
  }

  _formatGroupsItemValue(value, nulls) {
    const { formatter } = this;
    let nullOrder = '';
    if (nulls === 'last') {
      nullOrder = ' is null';
    } else if (nulls === 'first') {
      nullOrder = ' is not null';
    }

    let groupOrder;
    if (value instanceof Raw$2) {
      groupOrder = unwrapRaw_(
        value,
        undefined,
        this.builder,
        this.client,
        this.bindingsHolder
      );
    } else if (value instanceof QueryBuilder$2 || nulls) {
      groupOrder = '(' + formatter.columnize(value) + nullOrder + ')';
    } else {
      groupOrder = formatter.columnize(value);
    }
    return groupOrder;
  }

  _basicGroupOrder(item, type) {
    const column = this._formatGroupsItemValue(item.value, item.nulls);
    const direction =
      type === 'order' && item.type !== 'orderByRaw'
        ? ` ${direction_(
            item.direction,
            this.builder,
            this.client,
            this.bindingsHolder
          )}`
        : '';
    return column + direction;
  }

  _groupOrder(item, type) {
    return this._basicGroupOrder(item, type);
  }

  _groupOrderNulls(item, type) {
    const column = this._formatGroupsItemValue(item.value);
    const direction =
      type === 'order' && item.type !== 'orderByRaw'
        ? ` ${direction_(
            item.direction,
            this.builder,
            this.client,
            this.bindingsHolder
          )}`
        : '';
    if (item.nulls && !(item.value instanceof Raw$2)) {
      return `${column}${direction ? direction : ''} nulls ${item.nulls}`;
    }
    return column + direction;
  }

  // Compiles the `order by` statements.
  _groupsOrders(type) {
    const items = this.grouped[type];
    if (!items) return '';
    const sql = items.map((item) => {
      return this._groupOrder(item, type);
    });
    return sql.length ? type + ' by ' + sql.join(', ') : '';
  }

  // Get the table name, wrapping it if necessary.
  // Implemented as a property to prevent ordering issues as described in #704.
  get tableName() {
    if (!this._tableName) {
      // Only call this.formatter.wrap() the first time this property is accessed.
      let tableName = this.single.table;
      const schemaName = this.single.schema;

      if (tableName && schemaName) {
        const isQueryBuilder = tableName instanceof QueryBuilder$2;
        const isRawQuery = tableName instanceof Raw$2;
        const isFunction = typeof tableName === 'function';

        if (!isQueryBuilder && !isRawQuery && !isFunction) {
          tableName = `${schemaName}.${tableName}`;
        }
      }

      this._tableName = tableName
        ? // Wrap subQuery with parenthesis, #3485
          wrap_$1(
            tableName,
            tableName instanceof QueryBuilder$2,
            this.builder,
            this.client,
            this.bindingsHolder
          )
        : '';
    }
    return this._tableName;
  }

  _jsonPathWrap(extraction) {
    return this.client.parameter(
      extraction.path || extraction[1],
      this.builder,
      this.bindingsHolder
    );
  }

  // Json common functions
  _jsonExtract(nameFunction, params) {
    let extractions;
    if (Array.isArray(params.column)) {
      extractions = params.column;
    } else {
      extractions = [params];
    }
    if (!Array.isArray(nameFunction)) {
      nameFunction = [nameFunction];
    }
    return extractions
      .map((extraction) => {
        let jsonCol = `${columnize_$2(
          extraction.column || extraction[0],
          this.builder,
          this.client,
          this.bindingsHolder
        )}, ${this._jsonPathWrap(extraction)}`;
        nameFunction.forEach((f) => {
          jsonCol = f + '(' + jsonCol + ')';
        });
        const alias = extraction.alias || extraction[2];
        return alias
          ? this.client.alias(jsonCol, this.formatter.wrap(alias))
          : jsonCol;
      })
      .join(', ');
  }

  _jsonSet(nameFunction, params) {
    const jsonSet = `${nameFunction}(${columnize_$2(
      params.column,
      this.builder,
      this.client,
      this.bindingsHolder
    )}, ${this.client.parameter(
      params.path,
      this.builder,
      this.bindingsHolder
    )}, ${this.client.parameter(
      params.value,
      this.builder,
      this.bindingsHolder
    )})`;
    return params.alias
      ? this.client.alias(jsonSet, this.formatter.wrap(params.alias))
      : jsonSet;
  }

  _whereJsonPath(nameFunction, statement) {
    return `${nameFunction}(${this._columnClause(
      statement
    )}, ${this._jsonPathWrap({ path: statement.jsonPath })}) ${operator_$1(
      statement.operator,
      this.builder,
      this.client,
      this.bindingsHolder
    )} ${this._jsonValueClause(statement)}`;
  }

  _onJsonPathEquals(nameJoinFunction, clause) {
    return (
      nameJoinFunction +
      '(' +
      wrap_$1(
        clause.columnFirst,
        undefined,
        this.builder,
        this.client,
        this.bindingsHolder
      ) +
      ', ' +
      this.client.parameter(
        clause.jsonPathFirst,
        this.builder,
        this.bindingsHolder
      ) +
      ') = ' +
      nameJoinFunction +
      '(' +
      wrap_$1(
        clause.columnSecond,
        undefined,
        this.builder,
        this.client,
        this.bindingsHolder
      ) +
      ', ' +
      this.client.parameter(
        clause.jsonPathSecond,
        this.builder,
        this.bindingsHolder
      ) +
      ')'
    );
  }
};

var querycompiler = QueryCompiler$1;

const { EventEmitter: EventEmitter$5 } = require$$2$b;
const toArray$2 = require$$1$8;
const assign$3 = require$$2$6;
const { addQueryContext: addQueryContext$1 } = helpers$7;
const saveAsyncStack = saveAsyncStack$3;
const {
  augmentWithBuilderInterface,
} = builderInterfaceAugmenter;

// Constructor for the builder instance, typically called from
// `knex.builder`, accepting the current `knex` instance,
// and pulling out the `client` and `grammar` from the current
// knex instance.
let SchemaBuilder$2 = class SchemaBuilder extends EventEmitter$5 {
  constructor(client) {
    super();
    this.client = client;
    this._sequence = [];

    if (client.config) {
      this._debug = client.config.debug;
      saveAsyncStack(this, 4);
    }
  }

  withSchema(schemaName) {
    this._schema = schemaName;
    return this;
  }

  toString() {
    return this.toQuery();
  }

  toSQL() {
    return this.client.schemaCompiler(this).toSQL();
  }

  async generateDdlCommands() {
    return await this.client.schemaCompiler(this).generateDdlCommands();
  }
};

// Each of the schema builder methods just add to the
// "_sequence" array for consistency.
[
  'createTable',
  'createTableIfNotExists',
  'createTableLike',
  'createView',
  'createViewOrReplace',
  'createMaterializedView',
  'refreshMaterializedView',
  'dropView',
  'dropViewIfExists',
  'dropMaterializedView',
  'dropMaterializedViewIfExists',
  'createSchema',
  'createSchemaIfNotExists',
  'dropSchema',
  'dropSchemaIfExists',
  'createExtension',
  'createExtensionIfNotExists',
  'dropExtension',
  'dropExtensionIfExists',
  'table',
  'alterTable',
  'view',
  'alterView',
  'hasTable',
  'hasColumn',
  'dropTable',
  'renameTable',
  'renameView',
  'dropTableIfExists',
  'raw',
].forEach(function (method) {
  SchemaBuilder$2.prototype[method] = function () {
    if (method === 'createTableIfNotExists') {
      this.client.logger.warn(
        [
          'Use async .hasTable to check if table exists and then use plain .createTable. Since ',
          '.createTableIfNotExists actually just generates plain "CREATE TABLE IF NOT EXIST..." ',
          'query it will not work correctly if there are any alter table queries generated for ',
          'columns afterwards. To not break old migrations this function is left untouched for now',
          ', but it should not be used when writing new code and it is removed from documentation.',
        ].join('')
      );
    }
    if (method === 'table') method = 'alterTable';
    if (method === 'view') method = 'alterView';
    this._sequence.push({
      method,
      args: toArray$2(arguments),
    });
    return this;
  };
});

SchemaBuilder$2.extend = (methodName, fn) => {
  if (
    Object.prototype.hasOwnProperty.call(SchemaBuilder$2.prototype, methodName)
  ) {
    throw new Error(
      `Can't extend SchemaBuilder with existing method ('${methodName}').`
    );
  }

  assign$3(SchemaBuilder$2.prototype, { [methodName]: fn });
};

augmentWithBuilderInterface(SchemaBuilder$2);
addQueryContext$1(SchemaBuilder$2);

var builder = SchemaBuilder$2;

const tail$2 = require$$4$2;
const { isString: isString$1 } = is;

// Push a new query onto the compiled "sequence" stack,
// creating a new formatter, returning the compiler.
function pushQuery$3(query) {
  if (!query) return;
  if (isString$1(query)) {
    query = { sql: query };
  }
  if (!query.bindings) {
    query.bindings = this.bindingsHolder.bindings;
  }
  this.sequence.push(query);

  this.formatter = this.client.formatter(this._commonBuilder);
  this.bindings = [];
  this.formatter.bindings = this.bindings;
}

// Used in cases where we need to push some additional column specific statements.
function pushAdditional$2(fn) {
  const child = new this.constructor(
    this.client,
    this.tableCompiler,
    this.columnBuilder
  );
  fn.call(child, tail$2(arguments));
  this.sequence.additional = (this.sequence.additional || []).concat(
    child.sequence
  );
}

// Unshift a new query onto the compiled "sequence" stack,
// creating a new formatter, returning the compiler.
function unshiftQuery$2(query) {
  if (!query) return;
  if (isString$1(query)) {
    query = { sql: query };
  }
  if (!query.bindings) {
    query.bindings = this.bindingsHolder.bindings;
  }
  this.sequence.unshift(query);

  this.formatter = this.client.formatter(this._commonBuilder);
  this.bindings = [];
  this.formatter.bindings = this.bindings;
}

var helpers$4 = {
  pushAdditional: pushAdditional$2,
  pushQuery: pushQuery$3,
  unshiftQuery: unshiftQuery$2,
};

const {
  pushQuery: pushQuery$2,
  pushAdditional: pushAdditional$1,
  unshiftQuery: unshiftQuery$1,
} = helpers$4;

// The "SchemaCompiler" takes all of the query statements which have been
// gathered in the "SchemaBuilder" and turns them into an array of
// properly formatted / bound query strings.
let SchemaCompiler$1 = class SchemaCompiler {
  constructor(client, builder) {
    this.builder = builder;
    this._commonBuilder = this.builder;
    this.client = client;
    this.schema = builder._schema;

    this.bindings = [];
    this.bindingsHolder = this;
    this.formatter = client.formatter(builder);
    this.formatter.bindings = this.bindings;
    this.sequence = [];
  }

  createSchema() {
    throwOnlyPGError('createSchema');
  }

  createSchemaIfNotExists() {
    throwOnlyPGError('createSchemaIfNotExists');
  }

  dropSchema() {
    throwOnlyPGError('dropSchema');
  }

  dropSchemaIfExists() {
    throwOnlyPGError('dropSchemaIfExists');
  }

  dropTable(tableName) {
    this.pushQuery(
      this.dropTablePrefix +
        this.formatter.wrap(prefixedTableName(this.schema, tableName))
    );
  }

  dropTableIfExists(tableName) {
    this.pushQuery(
      this.dropTablePrefix +
        'if exists ' +
        this.formatter.wrap(prefixedTableName(this.schema, tableName))
    );
  }

  dropView(viewName) {
    this._dropView(viewName, false, false);
  }

  dropViewIfExists(viewName) {
    this._dropView(viewName, true, false);
  }

  dropMaterializedView(viewName) {
    throw new Error('materialized views are not supported by this dialect.');
  }

  dropMaterializedViewIfExists(viewName) {
    throw new Error('materialized views are not supported by this dialect.');
  }

  renameView(from, to) {
    throw new Error(
      'rename view is not supported by this dialect (instead drop then create another view).'
    );
  }

  refreshMaterializedView() {
    throw new Error('materialized views are not supported by this dialect.');
  }

  _dropView(viewName, ifExists, materialized) {
    this.pushQuery(
      (materialized ? this.dropMaterializedViewPrefix : this.dropViewPrefix) +
        (ifExists ? 'if exists ' : '') +
        this.formatter.wrap(prefixedTableName(this.schema, viewName))
    );
  }

  raw(sql, bindings) {
    this.sequence.push(this.client.raw(sql, bindings).toSQL());
  }

  toSQL() {
    const sequence = this.builder._sequence;
    for (let i = 0, l = sequence.length; i < l; i++) {
      const query = sequence[i];
      this[query.method].apply(this, query.args);
    }
    return this.sequence;
  }

  async generateDdlCommands() {
    const generatedCommands = this.toSQL();
    return {
      pre: [],
      sql: Array.isArray(generatedCommands)
        ? generatedCommands
        : [generatedCommands],
      check: null,
      post: [],
    };
  }
};

SchemaCompiler$1.prototype.dropTablePrefix = 'drop table ';
SchemaCompiler$1.prototype.dropViewPrefix = 'drop view ';
SchemaCompiler$1.prototype.dropMaterializedViewPrefix = 'drop materialized view ';
SchemaCompiler$1.prototype.alterViewPrefix = 'alter view ';

SchemaCompiler$1.prototype.alterTable = buildTable('alter');
SchemaCompiler$1.prototype.createTable = buildTable('create');
SchemaCompiler$1.prototype.createTableIfNotExists = buildTable('createIfNot');
SchemaCompiler$1.prototype.createTableLike = buildTable('createLike');

SchemaCompiler$1.prototype.createView = buildView('create');
SchemaCompiler$1.prototype.createViewOrReplace = buildView('createOrReplace');
SchemaCompiler$1.prototype.createMaterializedView = buildView(
  'createMaterializedView'
);
SchemaCompiler$1.prototype.alterView = buildView('alter');

SchemaCompiler$1.prototype.pushQuery = pushQuery$2;
SchemaCompiler$1.prototype.pushAdditional = pushAdditional$1;
SchemaCompiler$1.prototype.unshiftQuery = unshiftQuery$1;

function build(builder) {
  // pass queryContext down to tableBuilder but do not overwrite it if already set
  const queryContext = this.builder.queryContext();
  if (queryContext !== undefined && builder.queryContext() === undefined) {
    builder.queryContext(queryContext);
  }

  builder.setSchema(this.schema);
  const sql = builder.toSQL();

  for (let i = 0, l = sql.length; i < l; i++) {
    this.sequence.push(sql[i]);
  }
}

function buildTable(type) {
  if (type === 'createLike') {
    return function (tableName, tableNameLike, fn) {
      const builder = this.client.tableBuilder(
        type,
        tableName,
        tableNameLike,
        fn
      );
      build.call(this, builder);
    };
  } else {
    return function (tableName, fn) {
      const builder = this.client.tableBuilder(type, tableName, null, fn);
      build.call(this, builder);
    };
  }
}

function buildView(type) {
  return function (viewName, fn) {
    const builder = this.client.viewBuilder(type, viewName, fn);
    build.call(this, builder);
  };
}

function prefixedTableName(prefix, table) {
  return prefix ? `${prefix}.${table}` : table;
}

function throwOnlyPGError(operationName) {
  throw new Error(
    `${operationName} is not supported for this dialect (only PostgreSQL supports it currently).`
  );
}

var compiler$1 = SchemaCompiler$1;

const require$$0$7 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(extend$3);

// TableBuilder

// Takes the function passed to the "createTable" or "table/editTable"
// functions and calls it with the "TableBuilder" as both the context and
// the first argument. Inside this function we can specify what happens to the
// method, pushing everything we want to do onto the "allStatements" array,
// which is then compiled into sql.
// ------
const each = require$$0$b;
const extend$2 = require$$0$7;
const assign$2 = require$$2$6;
const toArray$1 = require$$1$8;
const helpers$3 = helpers$7;
const { isString, isFunction, isObject } = is;

let TableBuilder$2 = class TableBuilder {
  constructor(client, method, tableName, tableNameLike, fn) {
    this.client = client;
    this._fn = fn;
    this._method = method;
    this._schemaName = undefined;
    this._tableName = tableName;
    this._tableNameLike = tableNameLike;
    this._statements = [];
    this._single = {};

    if (!tableNameLike && !isFunction(this._fn)) {
      throw new TypeError(
        'A callback function must be supplied to calls against `.createTable` ' +
          'and `.table`'
      );
    }
  }

  setSchema(schemaName) {
    this._schemaName = schemaName;
  }

  // Convert the current tableBuilder object "toSQL"
  // giving us additional methods if we're altering
  // rather than creating the table.
  toSQL() {
    if (this._method === 'alter') {
      extend$2(this, AlterMethods$2);
    }
    // With 'create table ... like' callback function is useless.
    if (this._fn) {
      this._fn.call(this, this);
    }
    return this.client.tableCompiler(this).toSQL();
  }

  // The "timestamps" call is really just sets the `created_at` and `updated_at` columns.

  timestamps(useTimestamps, defaultToNow, useCamelCase) {
    if (isObject(useTimestamps)) {
      ({ useTimestamps, defaultToNow, useCamelCase } = useTimestamps);
    }
    const method = useTimestamps === true ? 'timestamp' : 'datetime';
    const createdAt = this[method](useCamelCase ? 'createdAt' : 'created_at');
    const updatedAt = this[method](useCamelCase ? 'updatedAt' : 'updated_at');

    if (defaultToNow === true) {
      const now = this.client.raw('CURRENT_TIMESTAMP');
      createdAt.notNullable().defaultTo(now);
      updatedAt.notNullable().defaultTo(now);
    }
  }

  // Set the comment value for a table, they're only allowed to be called
  // once per table.
  comment(value) {
    if (typeof value !== 'string') {
      throw new TypeError('Table comment must be string');
    }
    this._single.comment = value;
  }

  // Set a foreign key on the table, calling
  // `table.foreign('column_name').references('column').on('table').onDelete()...
  // Also called from the ColumnBuilder context when chaining.
  foreign(column, keyName) {
    const foreignData = { column: column, keyName: keyName };
    this._statements.push({
      grouping: 'alterTable',
      method: 'foreign',
      args: [foreignData],
    });
    let returnObj = {
      references(tableColumn) {
        let pieces;
        if (isString(tableColumn)) {
          pieces = tableColumn.split('.');
        }
        if (!pieces || pieces.length === 1) {
          foreignData.references = pieces ? pieces[0] : tableColumn;
          return {
            on(tableName) {
              if (typeof tableName !== 'string') {
                throw new TypeError(
                  `Expected tableName to be a string, got: ${typeof tableName}`
                );
              }
              foreignData.inTable = tableName;
              return returnObj;
            },
            inTable() {
              return this.on.apply(this, arguments);
            },
          };
        }
        foreignData.inTable = pieces[0];
        foreignData.references = pieces[1];
        return returnObj;
      },
      withKeyName(keyName) {
        foreignData.keyName = keyName;
        return returnObj;
      },
      onUpdate(statement) {
        foreignData.onUpdate = statement;
        return returnObj;
      },
      onDelete(statement) {
        foreignData.onDelete = statement;
        return returnObj;
      },
      deferrable: (type) => {
        const unSupported = [
          'mysql',
          'mssql',
          'redshift',
          'mysql2',
          'oracledb',
        ];
        if (unSupported.indexOf(this.client.dialect) !== -1) {
          throw new Error(`${this.client.dialect} does not support deferrable`);
        }
        foreignData.deferrable = type;
        return returnObj;
      },
      _columnBuilder(builder) {
        extend$2(builder, returnObj);
        returnObj = builder;
        return builder;
      },
    };
    return returnObj;
  }

  check(checkPredicate, bindings, constraintName) {
    this._statements.push({
      grouping: 'checks',
      args: [checkPredicate, bindings, constraintName],
    });
    return this;
  }
};

[
  // Each of the index methods can be called individually, with the
  // column name to be used, e.g. table.unique('column').
  'index',
  'primary',
  'unique',

  // Key specific
  'dropPrimary',
  'dropUnique',
  'dropIndex',
  'dropForeign',
].forEach((method) => {
  TableBuilder$2.prototype[method] = function () {
    this._statements.push({
      grouping: 'alterTable',
      method,
      args: toArray$1(arguments),
    });
    return this;
  };
});

// Warn for dialect-specific table methods, since that's the
// only time these are supported.
const specialMethods = {
  mysql: ['engine', 'charset', 'collate'],
  postgresql: ['inherits'],
};
each(specialMethods, function (methods, dialect) {
  methods.forEach(function (method) {
    TableBuilder$2.prototype[method] = function (value) {
      if (this.client.dialect !== dialect) {
        throw new Error(
          `Knex only supports ${method} statement with ${dialect}.`
        );
      }
      if (this._method === 'alter') {
        throw new Error(
          `Knex does not support altering the ${method} outside of create ` +
            `table, please use knex.raw statement.`
        );
      }
      this._single[method] = value;
    };
  });
});

helpers$3.addQueryContext(TableBuilder$2);

// Each of the column types that we can add, we create a new ColumnBuilder
// instance and push it onto the statements array.
const columnTypes = [
  // Numeric
  'tinyint',
  'smallint',
  'mediumint',
  'int',
  'bigint',
  'decimal',
  'float',
  'double',
  'real',
  'bit',
  'boolean',
  'serial',

  // Date / Time
  'date',
  'datetime',
  'timestamp',
  'time',
  'year',

  // Geometry
  'geometry',
  'geography',
  'point',

  // String
  'char',
  'varchar',
  'tinytext',
  'tinyText',
  'text',
  'mediumtext',
  'mediumText',
  'longtext',
  'longText',
  'binary',
  'varbinary',
  'tinyblob',
  'tinyBlob',
  'mediumblob',
  'mediumBlob',
  'blob',
  'longblob',
  'longBlob',
  'enum',
  'set',

  // Increments, Aliases, and Additional
  'bool',
  'dateTime',
  'increments',
  'bigincrements',
  'bigIncrements',
  'integer',
  'biginteger',
  'bigInteger',
  'string',
  'json',
  'jsonb',
  'uuid',
  'enu',
  'specificType',
];

// For each of the column methods, create a new "ColumnBuilder" interface,
// push it onto the "allStatements" stack, and then return the interface,
// with which we can add indexes, etc.
columnTypes.forEach((type) => {
  TableBuilder$2.prototype[type] = function () {
    const args = toArray$1(arguments);
    const builder = this.client.columnBuilder(this, type, args);
    this._statements.push({
      grouping: 'columns',
      builder,
    });
    return builder;
  };
});

const AlterMethods$2 = {
  // Renames the current column `from` the current
  // TODO: this.column(from).rename(to)
  renameColumn(from, to) {
    this._statements.push({
      grouping: 'alterTable',
      method: 'renameColumn',
      args: [from, to],
    });
    return this;
  },

  dropTimestamps() {
    // arguments[0] = useCamelCase
    return this.dropColumns(
      arguments[0] === true
        ? ['createdAt', 'updatedAt']
        : ['created_at', 'updated_at']
    );
  },

  setNullable(column) {
    this._statements.push({
      grouping: 'alterTable',
      method: 'setNullable',
      args: [column],
    });

    return this;
  },

  check(checkPredicate, bindings, constraintName) {
    this._statements.push({
      grouping: 'alterTable',
      method: 'check',
      args: [checkPredicate, bindings, constraintName],
    });
  },

  dropChecks() {
    this._statements.push({
      grouping: 'alterTable',
      method: 'dropChecks',
      args: toArray$1(arguments),
    });
  },

  dropNullable(column) {
    this._statements.push({
      grouping: 'alterTable',
      method: 'dropNullable',
      args: [column],
    });

    return this;
  },

  // TODO: changeType
};

// Drop a column from the current table.
// TODO: Enable this.column(columnName).drop();
AlterMethods$2.dropColumn = AlterMethods$2.dropColumns = function () {
  this._statements.push({
    grouping: 'alterTable',
    method: 'dropColumn',
    args: toArray$1(arguments),
  });
  return this;
};

TableBuilder$2.extend = (methodName, fn) => {
  if (
    Object.prototype.hasOwnProperty.call(TableBuilder$2.prototype, methodName)
  ) {
    throw new Error(
      `Can't extend TableBuilder with existing method ('${methodName}').`
    );
  }

  assign$2(TableBuilder$2.prototype, { [methodName]: fn });
};

var tablebuilder = TableBuilder$2;

const require$$3$2 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(indexOf$1);

/* eslint max-len:0 */

// Table Compiler
// -------
const {
  pushAdditional,
  pushQuery: pushQuery$1,
  unshiftQuery,
} = helpers$4;
const helpers$2 = helpers$7;
const groupBy$2 = require$$1$6;
const indexOf = require$$3$2;
const isEmpty = require$$2$8;
const tail$1 = require$$4$2;
const { normalizeArr } = helpers$7;

let TableCompiler$1 = class TableCompiler {
  constructor(client, tableBuilder) {
    this.client = client;
    this.tableBuilder = tableBuilder;
    this._commonBuilder = this.tableBuilder;
    this.method = tableBuilder._method;
    this.schemaNameRaw = tableBuilder._schemaName;
    this.tableNameRaw = tableBuilder._tableName;
    this.tableNameLikeRaw = tableBuilder._tableNameLike;
    this.single = tableBuilder._single;
    this.grouped = groupBy$2(tableBuilder._statements, 'grouping');

    this.formatter = client.formatter(tableBuilder);
    this.bindings = [];
    this.formatter.bindings = this.bindings;
    this.bindingsHolder = this;

    this.sequence = [];
    this._formatting = client.config && client.config.formatting;

    this.checksCount = 0;
  }

  // Convert the tableCompiler toSQL
  toSQL() {
    this[this.method]();
    return this.sequence;
  }

  // Column Compilation
  // -------

  // If this is a table "creation", we need to first run through all
  // of the columns to build them into a single string,
  // and then run through anything else and push it to the query sequence.
  create(ifNot, like) {
    const columnBuilders = this.getColumns();
    const columns = columnBuilders.map((col) => col.toSQL());
    const columnTypes = this.getColumnTypes(columns);
    if (this.createAlterTableMethods) {
      this.alterTableForCreate(columnTypes);
    }
    this.createQuery(columnTypes, ifNot, like);
    this.columnQueries(columns);
    delete this.single.comment;
    this.alterTable();
  }

  // Only create the table if it doesn't exist.
  createIfNot() {
    this.create(true);
  }

  createLike() {
    this.create(false, true);
  }

  createLikeIfNot() {
    this.create(true, true);
  }

  // If we're altering the table, we need to one-by-one
  // go through and handle each of the queries associated
  // with altering the table's schema.
  alter() {
    const addColBuilders = this.getColumns();
    const addColumns = addColBuilders.map((col) => col.toSQL());
    const alterColBuilders = this.getColumns('alter');
    const alterColumns = alterColBuilders.map((col) => col.toSQL());
    const addColumnTypes = this.getColumnTypes(addColumns);
    const alterColumnTypes = this.getColumnTypes(alterColumns);

    this.addColumns(addColumnTypes);
    this.alterColumns(alterColumnTypes, alterColBuilders);
    this.columnQueries(addColumns);
    this.columnQueries(alterColumns);
    this.alterTable();
  }

  foreign(foreignData) {
    if (foreignData.inTable && foreignData.references) {
      const keyName = foreignData.keyName
        ? this.formatter.wrap(foreignData.keyName)
        : this._indexCommand('foreign', this.tableNameRaw, foreignData.column);
      const column = this.formatter.columnize(foreignData.column);
      const references = this.formatter.columnize(foreignData.references);
      const inTable = this.formatter.wrap(foreignData.inTable);
      const onUpdate = foreignData.onUpdate
        ? (this.lowerCase ? ' on update ' : ' ON UPDATE ') +
          foreignData.onUpdate
        : '';
      const onDelete = foreignData.onDelete
        ? (this.lowerCase ? ' on delete ' : ' ON DELETE ') +
          foreignData.onDelete
        : '';
      const deferrable = foreignData.deferrable
        ? this.lowerCase
          ? ` deferrable initially ${foreignData.deferrable.toLowerCase()} `
          : ` DEFERRABLE INITIALLY ${foreignData.deferrable.toUpperCase()} `
        : '';
      if (this.lowerCase) {
        this.pushQuery(
          (!this.forCreate ? `alter table ${this.tableName()} add ` : '') +
            'constraint ' +
            keyName +
            ' ' +
            'foreign key (' +
            column +
            ') references ' +
            inTable +
            ' (' +
            references +
            ')' +
            onUpdate +
            onDelete +
            deferrable
        );
      } else {
        this.pushQuery(
          (!this.forCreate ? `ALTER TABLE ${this.tableName()} ADD ` : '') +
            'CONSTRAINT ' +
            keyName +
            ' ' +
            'FOREIGN KEY (' +
            column +
            ') REFERENCES ' +
            inTable +
            ' (' +
            references +
            ')' +
            onUpdate +
            onDelete +
            deferrable
        );
      }
    }
  }

  // Get all of the column sql & bindings individually for building the table queries.
  getColumnTypes(columns) {
    return columns.reduce(
      function (memo, columnSQL) {
        const column = columnSQL[0];
        memo.sql.push(column.sql);
        memo.bindings.concat(column.bindings);
        return memo;
      },
      { sql: [], bindings: [] }
    );
  }

  // Adds all of the additional queries from the "column"
  columnQueries(columns) {
    const queries = columns.reduce(function (memo, columnSQL) {
      const column = tail$1(columnSQL);
      if (!isEmpty(column)) return memo.concat(column);
      return memo;
    }, []);
    for (const q of queries) {
      this.pushQuery(q);
    }
  }

  // All of the columns to "add" for the query
  addColumns(columns, prefix) {
    prefix = prefix || this.addColumnsPrefix;

    if (columns.sql.length > 0) {
      const columnSql = columns.sql.map((column) => {
        return prefix + column;
      });
      this.pushQuery({
        sql:
          (this.lowerCase ? 'alter table ' : 'ALTER TABLE ') +
          this.tableName() +
          ' ' +
          columnSql.join(', '),
        bindings: columns.bindings,
      });
    }
  }

  alterColumns(columns, colBuilders) {
    if (columns.sql.length > 0) {
      this.addColumns(columns, this.alterColumnsPrefix, colBuilders);
    }
  }

  // Compile the columns as needed for the current create or alter table
  getColumns(method) {
    const columns = this.grouped.columns || [];
    method = method || 'add';

    const queryContext = this.tableBuilder.queryContext();

    return columns
      .filter((column) => column.builder._method === method)
      .map((column) => {
        // pass queryContext down to columnBuilder but do not overwrite it if already set
        if (
          queryContext !== undefined &&
          column.builder.queryContext() === undefined
        ) {
          column.builder.queryContext(queryContext);
        }
        return this.client.columnCompiler(this, column.builder);
      });
  }

  tableName() {
    const name = this.schemaNameRaw
      ? `${this.schemaNameRaw}.${this.tableNameRaw}`
      : this.tableNameRaw;

    return this.formatter.wrap(name);
  }

  tableNameLike() {
    const name = this.schemaNameRaw
      ? `${this.schemaNameRaw}.${this.tableNameLikeRaw}`
      : this.tableNameLikeRaw;

    return this.formatter.wrap(name);
  }

  // Generate all of the alter column statements necessary for the query.
  alterTable() {
    const alterTable = this.grouped.alterTable || [];
    for (let i = 0, l = alterTable.length; i < l; i++) {
      const statement = alterTable[i];
      if (this[statement.method]) {
        this[statement.method].apply(this, statement.args);
      } else {
        this.client.logger.error(`Debug: ${statement.method} does not exist`);
      }
    }
    for (const item in this.single) {
      if (typeof this[item] === 'function') this[item](this.single[item]);
    }
  }

  alterTableForCreate(columnTypes) {
    this.forCreate = true;
    const savedSequence = this.sequence;
    const alterTable = this.grouped.alterTable || [];
    this.grouped.alterTable = [];
    for (let i = 0, l = alterTable.length; i < l; i++) {
      const statement = alterTable[i];
      if (indexOf(this.createAlterTableMethods, statement.method) < 0) {
        this.grouped.alterTable.push(statement);
        continue;
      }
      if (this[statement.method]) {
        this.sequence = [];
        this[statement.method].apply(this, statement.args);
        columnTypes.sql.push(this.sequence[0].sql);
      } else {
        this.client.logger.error(`Debug: ${statement.method} does not exist`);
      }
    }
    this.sequence = savedSequence;
    this.forCreate = false;
  }

  // Drop the index on the current table.
  dropIndex(value) {
    this.pushQuery(`drop index${value}`);
  }

  dropUnique() {
    throw new Error('Method implemented in the dialect driver');
  }

  dropForeign() {
    throw new Error('Method implemented in the dialect driver');
  }

  dropColumn() {
    const columns = helpers$2.normalizeArr.apply(null, arguments);
    const drops = (Array.isArray(columns) ? columns : [columns]).map(
      (column) => {
        return this.dropColumnPrefix + this.formatter.wrap(column);
      }
    );
    this.pushQuery(
      (this.lowerCase ? 'alter table ' : 'ALTER TABLE ') +
        this.tableName() +
        ' ' +
        drops.join(', ')
    );
  }

  //Default implementation of setNullable. Overwrite on dialect-specific tablecompiler when needed
  //(See postgres/mssql for reference)
  _setNullableState(column, nullable) {
    const tableName = this.tableName();
    const columnName = this.formatter.columnize(column);
    const alterColumnPrefix = this.alterColumnsPrefix;
    return this.pushQuery({
      sql: 'SELECT 1',
      output: () => {
        return this.client
          .queryBuilder()
          .from(this.tableNameRaw)
          .columnInfo(column)
          .then((columnInfo) => {
            if (isEmpty(columnInfo)) {
              throw new Error(
                `.setNullable: Column ${columnName} does not exist in table ${tableName}.`
              );
            }
            const nullableType = nullable ? 'null' : 'not null';
            const columnType =
              columnInfo.type +
              (columnInfo.maxLength ? `(${columnInfo.maxLength})` : '');
            const defaultValue =
              columnInfo.defaultValue !== null &&
              columnInfo.defaultValue !== void 0
                ? `default '${columnInfo.defaultValue}'`
                : '';
            const sql = `alter table ${tableName} ${alterColumnPrefix} ${columnName} ${columnType} ${nullableType} ${defaultValue}`;
            return this.client.raw(sql);
          });
      },
    });
  }

  setNullable(column) {
    return this._setNullableState(column, true);
  }

  dropNullable(column) {
    return this._setNullableState(column, false);
  }

  dropChecks(checkConstraintNames) {
    if (checkConstraintNames === undefined) return '';
    checkConstraintNames = normalizeArr(checkConstraintNames);
    const tableName = this.tableName();
    const sql = `alter table ${tableName} ${checkConstraintNames
      .map((constraint) => `drop constraint ${constraint}`)
      .join(', ')}`;
    this.pushQuery(sql);
  }

  check(checkPredicate, bindings, constraintName) {
    const tableName = this.tableName();
    let checkConstraint = constraintName;
    if (!checkConstraint) {
      this.checksCount++;
      checkConstraint = tableName + '_' + this.checksCount;
    }
    const sql = `alter table ${tableName} add constraint ${checkConstraint} check(${checkPredicate})`;
    this.pushQuery(sql);
  }

  _addChecks() {
    if (this.grouped.checks) {
      return (
        ', ' +
        this.grouped.checks
          .map((c) => {
            return `${
              c.args[2] ? 'constraint ' + c.args[2] + ' ' : ''
            }check (${this.client.raw(c.args[0], c.args[1])})`;
          })
          .join(', ')
      );
    }
    return '';
  }

  // If no name was specified for this index, we will create one using a basic
  // convention of the table name, followed by the columns, followed by an
  // index type, such as primary or index, which makes the index unique.
  _indexCommand(type, tableName, columns) {
    if (!Array.isArray(columns)) columns = columns ? [columns] : [];
    const table = tableName.replace(/\.|-/g, '_');
    const indexName = (
      table +
      '_' +
      columns.join('_') +
      '_' +
      type
    ).toLowerCase();
    return this.formatter.wrap(indexName);
  }

  _getPrimaryKeys() {
    return (this.grouped.alterTable || [])
      .filter((a) => a.method === 'primary')
      .flatMap((a) => a.args)
      .flat();
  }

  _canBeAddPrimaryKey(options) {
    return options.primaryKey && this._getPrimaryKeys().length === 0;
  }

  _getIncrementsColumnNames() {
    return this.grouped.columns
      .filter((c) => c.builder._type === 'increments')
      .map((c) => c.builder._args[0]);
  }

  _getBigIncrementsColumnNames() {
    return this.grouped.columns
      .filter((c) => c.builder._type === 'bigincrements')
      .map((c) => c.builder._args[0]);
  }
};

TableCompiler$1.prototype.pushQuery = pushQuery$1;
TableCompiler$1.prototype.pushAdditional = pushAdditional;
TableCompiler$1.prototype.unshiftQuery = unshiftQuery;
TableCompiler$1.prototype.lowerCase = true;
TableCompiler$1.prototype.createAlterTableMethods = null;
TableCompiler$1.prototype.addColumnsPrefix = 'add column ';
TableCompiler$1.prototype.alterColumnsPrefix = 'alter column ';
TableCompiler$1.prototype.modifyColumnPrefix = 'modify column ';
TableCompiler$1.prototype.dropColumnPrefix = 'drop column ';

var tablecompiler = TableCompiler$1;

const extend$1 = require$$0$7;
const assign$1 = require$$2$6;
const toArray = require$$1$8;
const { addQueryContext } = helpers$7;

// The chainable interface off the original "column" method.
let ColumnBuilder$2 = class ColumnBuilder {
  constructor(client, tableBuilder, type, args) {
    this.client = client;
    this._method = 'add';
    this._single = {};
    this._modifiers = {};
    this._statements = [];
    this._type = columnAlias[type] || type;
    this._args = args;
    this._tableBuilder = tableBuilder;

    // If we're altering the table, extend the object
    // with the available "alter" methods.
    if (tableBuilder._method === 'alter') {
      extend$1(this, AlterMethods$1);
    }
  }

  // Specify that the current column "references" a column,
  // which may be tableName.column or just "column"
  references(value) {
    return this._tableBuilder.foreign
      .call(this._tableBuilder, this._args[0], undefined, this)
      ._columnBuilder(this)
      .references(value);
  }
};

// All of the modifier methods that can be used to modify the current query.
const modifiers = [
  'default',
  'defaultsTo',
  'defaultTo',
  'unsigned',
  'nullable',
  'first',
  'after',
  'comment',
  'collate',
  'check',
  'checkPositive',
  'checkNegative',
  'checkIn',
  'checkNotIn',
  'checkBetween',
  'checkLength',
  'checkRegex',
];

// Aliases for convenience.
const aliasMethod = {
  default: 'defaultTo',
  defaultsTo: 'defaultTo',
};

// If we call any of the modifiers (index or otherwise) on the chainable, we pretend
// as though we're calling `table.method(column)` directly.
modifiers.forEach(function (method) {
  const key = aliasMethod[method] || method;
  ColumnBuilder$2.prototype[method] = function () {
    this._modifiers[key] = toArray(arguments);
    return this;
  };
});

addQueryContext(ColumnBuilder$2);

ColumnBuilder$2.prototype.notNull = ColumnBuilder$2.prototype.notNullable =
  function notNullable() {
    return this.nullable(false);
  };

['index', 'primary', 'unique'].forEach(function (method) {
  ColumnBuilder$2.prototype[method] = function () {
    if (this._type.toLowerCase().indexOf('increments') === -1) {
      this._tableBuilder[method].apply(
        this._tableBuilder,
        [this._args[0]].concat(toArray(arguments))
      );
    }
    return this;
  };
});

ColumnBuilder$2.extend = (methodName, fn) => {
  if (
    Object.prototype.hasOwnProperty.call(ColumnBuilder$2.prototype, methodName)
  ) {
    throw new Error(
      `Can't extend ColumnBuilder with existing method ('${methodName}').`
    );
  }

  assign$1(ColumnBuilder$2.prototype, { [methodName]: fn });
};

const AlterMethods$1 = {};

// Specify that the column is to be dropped. This takes precedence
// over all other rules for the column.
AlterMethods$1.drop = function () {
  this._single.drop = true;

  return this;
};

// Specify the "type" that we're looking to set the
// Knex takes no responsibility for any data-loss that may
// occur when changing data types.
AlterMethods$1.alterType = function (type) {
  this._statements.push({
    grouping: 'alterType',
    value: type,
  });

  return this;
};

// Set column method to alter (default is add).
AlterMethods$1.alter = function ({
  alterNullable = true,
  alterType = true,
} = {}) {
  this._method = 'alter';
  this.alterNullable = alterNullable;
  this.alterType = alterType;

  return this;
};

// Alias a few methods for clarity when processing.
const columnAlias = {
  float: 'floating',
  enum: 'enu',
  boolean: 'bool',
  string: 'varchar',
  bigint: 'bigInteger',
};

var columnbuilder = ColumnBuilder$2;

const require$$2$5 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(first$1);

// Column Compiler
// Used for designating column definitions
// during the table "create" / "alter" statements.
// -------
const helpers$1 = helpers$4;
const groupBy$1 = require$$1$6;
const first = require$$2$5;
const has = require$$0$8;
const tail = require$$4$2;
const { toNumber } = helpers$7;
const { formatDefault } = formatterUtils;
const { operator: operator_ } = wrappingFormatter;

let ColumnCompiler$1 = class ColumnCompiler {
  constructor(client, tableCompiler, columnBuilder) {
    this.client = client;
    this.tableCompiler = tableCompiler;
    this.columnBuilder = columnBuilder;
    this._commonBuilder = this.columnBuilder;
    this.args = columnBuilder._args;
    this.type = columnBuilder._type.toLowerCase();
    this.grouped = groupBy$1(columnBuilder._statements, 'grouping');
    this.modified = columnBuilder._modifiers;
    this.isIncrements = this.type.indexOf('increments') !== -1;

    this.formatter = client.formatter(columnBuilder);
    this.bindings = [];
    this.formatter.bindings = this.bindings;
    this.bindingsHolder = this;

    this.sequence = [];
    this.modifiers = [];

    this.checksCount = 0;
  }

  _addCheckModifiers() {
    this.modifiers.push(
      'check',
      'checkPositive',
      'checkNegative',
      'checkIn',
      'checkNotIn',
      'checkBetween',
      'checkLength',
      'checkRegex'
    );
  }

  defaults(label) {
    if (Object.prototype.hasOwnProperty.call(this._defaultMap, label)) {
      return this._defaultMap[label].bind(this)();
    } else {
      throw new Error(
        `There is no default for the specified identifier ${label}`
      );
    }
  }

  // To convert to sql, we first go through and build the
  // column as it would be in the insert statement
  toSQL() {
    this.pushQuery(this.compileColumn());
    if (this.sequence.additional) {
      this.sequence = this.sequence.concat(this.sequence.additional);
    }
    return this.sequence;
  }

  // Compiles a column.
  compileColumn() {
    return (
      this.formatter.wrap(this.getColumnName()) +
      ' ' +
      this.getColumnType() +
      this.getModifiers()
    );
  }

  // Assumes the autoincrementing key is named `id` if not otherwise specified.
  getColumnName() {
    const value = first(this.args);
    return value || this.defaults('columnName');
  }

  getColumnType() {
    // Column type is cached so side effects (such as in pg native enums) are only run once
    if (!this._columnType) {
      const type = this[this.type];
      this._columnType =
        typeof type === 'function' ? type.apply(this, tail(this.args)) : type;
    }

    return this._columnType;
  }

  getModifiers() {
    const modifiers = [];

    for (let i = 0, l = this.modifiers.length; i < l; i++) {
      const modifier = this.modifiers[i];

      //Cannot allow 'nullable' modifiers on increments types
      if (!this.isIncrements || (this.isIncrements && modifier === 'comment')) {
        if (has(this.modified, modifier)) {
          const val = this[modifier].apply(this, this.modified[modifier]);
          if (val) modifiers.push(val);
        }
      }
    }

    return modifiers.length > 0 ? ` ${modifiers.join(' ')}` : '';
  }

  // Types
  // ------
  varchar(length) {
    return `varchar(${toNumber(length, 255)})`;
  }

  floating(precision, scale) {
    return `float(${toNumber(precision, 8)}, ${toNumber(scale, 2)})`;
  }

  decimal(precision, scale) {
    if (precision === null) {
      throw new Error(
        'Specifying no precision on decimal columns is not supported for that SQL dialect.'
      );
    }
    return `decimal(${toNumber(precision, 8)}, ${toNumber(scale, 2)})`;
  }

  // Used to support custom types
  specifictype(type) {
    return type;
  }

  // Modifiers
  // -------

  nullable(nullable) {
    return nullable === false ? 'not null' : 'null';
  }

  notNullable() {
    return this.nullable(false);
  }

  defaultTo(value) {
    return `default ${formatDefault(value, this.type, this.client)}`;
  }

  increments(options = { primaryKey: true }) {
    return (
      'integer not null' +
      (this.tableCompiler._canBeAddPrimaryKey(options) ? ' primary key' : '') +
      ' autoincrement'
    );
  }

  bigincrements(options = { primaryKey: true }) {
    return this.increments(options);
  }

  _pushAlterCheckQuery(checkPredicate, constraintName) {
    let checkName = constraintName;
    if (!checkName) {
      this.checksCount++;
      checkName =
        this.tableCompiler.tableNameRaw +
        '_' +
        this.getColumnName() +
        '_' +
        this.checksCount;
    }
    this.pushAdditional(function () {
      this.pushQuery(
        `alter table ${this.tableCompiler.tableName()} add constraint ${checkName} check(${checkPredicate})`
      );
    });
  }

  _checkConstraintName(constraintName) {
    return constraintName ? `constraint ${constraintName} ` : '';
  }

  _check(checkPredicate, constraintName) {
    if (this.columnBuilder._method === 'alter') {
      this._pushAlterCheckQuery(checkPredicate, constraintName);
      return '';
    }
    return `${this._checkConstraintName(
      constraintName
    )}check (${checkPredicate})`;
  }

  checkPositive(constraintName) {
    return this._check(
      `${this.formatter.wrap(this.getColumnName())} ${operator_(
        '>',
        this.columnBuilder,
        this.bindingsHolder
      )} 0`,
      constraintName
    );
  }

  checkNegative(constraintName) {
    return this._check(
      `${this.formatter.wrap(this.getColumnName())} ${operator_(
        '<',
        this.columnBuilder,
        this.bindingsHolder
      )} 0`,
      constraintName
    );
  }

  _checkIn(values, constraintName, not) {
    return this._check(
      `${this.formatter.wrap(this.getColumnName())} ${
        not ? 'not ' : ''
      }in (${values.map((v) => this.client._escapeBinding(v)).join(',')})`,
      constraintName
    );
  }

  checkIn(values, constraintName) {
    return this._checkIn(values, constraintName);
  }

  checkNotIn(values, constraintName) {
    return this._checkIn(values, constraintName, true);
  }

  checkBetween(intervals, constraintName) {
    if (
      intervals.length === 2 &&
      !Array.isArray(intervals[0]) &&
      !Array.isArray(intervals[1])
    ) {
      intervals = [intervals];
    }
    const intervalChecks = intervals
      .map((interval) => {
        return `${this.formatter.wrap(
          this.getColumnName()
        )} between ${this.client._escapeBinding(
          interval[0]
        )} and ${this.client._escapeBinding(interval[1])}`;
      })
      .join(' or ');
    return this._check(intervalChecks, constraintName);
  }

  checkLength(operator, length, constraintName) {
    return this._check(
      `length(${this.formatter.wrap(this.getColumnName())}) ${operator_(
        operator,
        this.columnBuilder,
        this.bindingsHolder
      )} ${toNumber(length)}`,
      constraintName
    );
  }
};

ColumnCompiler$1.prototype.binary = 'blob';
ColumnCompiler$1.prototype.bool = 'boolean';
ColumnCompiler$1.prototype.date = 'date';
ColumnCompiler$1.prototype.datetime = 'datetime';
ColumnCompiler$1.prototype.time = 'time';
ColumnCompiler$1.prototype.timestamp = 'timestamp';
ColumnCompiler$1.prototype.geometry = 'geometry';
ColumnCompiler$1.prototype.geography = 'geography';
ColumnCompiler$1.prototype.point = 'point';
ColumnCompiler$1.prototype.enu = 'varchar';
ColumnCompiler$1.prototype.bit = ColumnCompiler$1.prototype.json = 'text';
ColumnCompiler$1.prototype.uuid = ({
  useBinaryUuid = false,
  primaryKey = false,
} = {}) => (useBinaryUuid ? 'binary(16)' : 'char(36)');
ColumnCompiler$1.prototype.integer =
  ColumnCompiler$1.prototype.smallint =
  ColumnCompiler$1.prototype.mediumint =
    'integer';
ColumnCompiler$1.prototype.biginteger = 'bigint';
ColumnCompiler$1.prototype.text = 'text';
ColumnCompiler$1.prototype.tinyint = 'tinyint';

ColumnCompiler$1.prototype.pushQuery = helpers$1.pushQuery;
ColumnCompiler$1.prototype.pushAdditional = helpers$1.pushAdditional;
ColumnCompiler$1.prototype.unshiftQuery = helpers$1.unshiftQuery;

ColumnCompiler$1.prototype._defaultMap = {
  columnName: function () {
    if (!this.isIncrements) {
      throw new Error(
        `You did not specify a column name for the ${this.type} column.`
      );
    }
    return 'id';
  },
};

var columncompiler = ColumnCompiler$1;

const Raw$1 = raw;

let Ref$1 = class Ref extends Raw$1 {
  constructor(client, ref) {
    super(client);

    this.ref = ref;
    this._schema = null;
    this._alias = null;
  }

  withSchema(schema) {
    this._schema = schema;

    return this;
  }

  as(alias) {
    this._alias = alias;

    return this;
  }

  toSQL() {
    const string = this._schema ? `${this._schema}.${this.ref}` : this.ref;

    const formatter = this.client.formatter(this);

    const ref = formatter.columnize(string);

    const sql = this._alias ? `${ref} as ${formatter.wrap(this._alias)}` : ref;

    this.set(sql, []);

    return super.toSQL(...arguments);
  }
};

var ref = Ref$1;

const {
  columnize: columnize_$1,
  wrap: wrap_,
} = wrappingFormatter;

let Formatter$1 = class Formatter {
  constructor(client, builder) {
    this.client = client;
    this.builder = builder;
    this.bindings = [];
  }

  // Accepts a string or array of columns to wrap as appropriate.
  columnize(target) {
    return columnize_$1(target, this.builder, this.client, this);
  }

  // Puts the appropriate wrapper around a value depending on the database
  // engine, unless it's a knex.raw value, in which case it's left alone.
  wrap(value, isParameter) {
    return wrap_(value, isParameter, this.builder, this.client, this);
  }
};

var formatter = Formatter$1;

const helpers = helpers$7;
const extend = require$$0$7;
const assign = require$$2$6;

let ViewBuilder$2 = class ViewBuilder {
  constructor(client, method, viewName, fn) {
    this.client = client;
    this._method = method;
    this._schemaName = undefined;
    this._columns = undefined;
    this._fn = fn;
    this._viewName = viewName;
    this._statements = [];
    this._single = {};
  }

  setSchema(schemaName) {
    this._schemaName = schemaName;
  }

  columns(columns) {
    this._columns = columns;
  }

  as(selectQuery) {
    this._selectQuery = selectQuery;
  }

  checkOption() {
    throw new Error(
      'check option definition is not supported by this dialect.'
    );
  }

  localCheckOption() {
    throw new Error(
      'check option definition is not supported by this dialect.'
    );
  }

  cascadedCheckOption() {
    throw new Error(
      'check option definition is not supported by this dialect.'
    );
  }

  toSQL() {
    if (this._method === 'alter') {
      extend(this, AlterMethods);
    }
    this._fn.call(this, this);
    return this.client.viewCompiler(this).toSQL();
  }
};

const AlterMethods = {
  column(column) {
    const self = this;
    return {
      rename: function (newName) {
        self._statements.push({
          grouping: 'alterView',
          method: 'renameColumn',
          args: [column, newName],
        });
        return this;
      },
      defaultTo: function (defaultValue) {
        self._statements.push({
          grouping: 'alterView',
          method: 'defaultTo',
          args: [column, defaultValue],
        });
        return this;
      },
    };
  },
};

helpers.addQueryContext(ViewBuilder$2);

ViewBuilder$2.extend = (methodName, fn) => {
  if (Object.prototype.hasOwnProperty.call(ViewBuilder$2.prototype, methodName)) {
    throw new Error(
      `Can't extend ViewBuilder with existing method ('${methodName}').`
    );
  }

  assign(ViewBuilder$2.prototype, { [methodName]: fn });
};

var viewbuilder = ViewBuilder$2;

/* eslint max-len:0 */

// View Compiler
// -------
const { pushQuery } = helpers$4;
const groupBy = require$$1$6;
const { columnize: columnize_ } = wrappingFormatter;

let ViewCompiler$1 = class ViewCompiler {
  constructor(client, viewBuilder) {
    this.client = client;
    this.viewBuilder = viewBuilder;
    this._commonBuilder = this.viewBuilder;
    this.method = viewBuilder._method;
    this.schemaNameRaw = viewBuilder._schemaName;
    this.viewNameRaw = viewBuilder._viewName;
    this.single = viewBuilder._single;
    this.selectQuery = viewBuilder._selectQuery;
    this.columns = viewBuilder._columns;
    this.grouped = groupBy(viewBuilder._statements, 'grouping');

    this.formatter = client.formatter(viewBuilder);
    this.bindings = [];
    this.formatter.bindings = this.bindings;
    this.bindingsHolder = this;

    this.sequence = [];
  }

  // Convert the tableCompiler toSQL
  toSQL() {
    this[this.method]();
    return this.sequence;
  }

  // Column Compilation
  // -------

  create() {
    this.createQuery(this.columns, this.selectQuery);
  }

  createOrReplace() {
    throw new Error('replace views is not supported by this dialect.');
  }

  createMaterializedView() {
    throw new Error('materialized views are not supported by this dialect.');
  }

  createQuery(columns, selectQuery, materialized, replace) {
    const createStatement =
      'create ' +
      (materialized ? 'materialized ' : '') +
      (replace ? 'or replace ' : '') +
      'view ';
    const columnList = columns
      ? ' (' +
        columnize_(
          columns,
          this.viewBuilder,
          this.client,
          this.bindingsHolder
        ) +
        ')'
      : '';
    let sql = createStatement + this.viewName() + columnList;
    sql += ' as ';
    sql += selectQuery.toString();
    switch (this.single.checkOption) {
      case 'default_option':
        sql += ' with check option';
        break;
      case 'local':
        sql += ' with local check option';
        break;
      case 'cascaded':
        sql += ' with cascaded check option';
        break;
    }
    this.pushQuery({
      sql,
    });
  }

  renameView(from, to) {
    throw new Error(
      'rename view is not supported by this dialect (instead drop, then create another view).'
    );
  }

  refreshMaterializedView() {
    throw new Error('materialized views are not supported by this dialect.');
  }

  alter() {
    this.alterView();
  }

  alterView() {
    const alterView = this.grouped.alterView || [];
    for (let i = 0, l = alterView.length; i < l; i++) {
      const statement = alterView[i];
      if (this[statement.method]) {
        this[statement.method].apply(this, statement.args);
      } else {
        this.client.logger.error(`Debug: ${statement.method} does not exist`);
      }
    }
    for (const item in this.single) {
      if (typeof this[item] === 'function') this[item](this.single[item]);
    }
  }

  renameColumn(from, to) {
    throw new Error('rename column of views is not supported by this dialect.');
  }

  defaultTo(column, defaultValue) {
    throw new Error(
      'change default values of views is not supported by this dialect.'
    );
  }

  viewName() {
    const name = this.schemaNameRaw
      ? `${this.schemaNameRaw}.${this.viewNameRaw}`
      : this.viewNameRaw;

    return this.formatter.wrap(name);
  }
};

ViewCompiler$1.prototype.pushQuery = pushQuery;

var viewcompiler = ViewCompiler$1;

const { Pool: Pool$3, TimeoutError } = tarnExports;
const { EventEmitter: EventEmitter$4 } = require$$2$b;
const { promisify: promisify$1 } = require$$1$e;
const { makeEscape } = string;
const cloneDeep = require$$4$3;
const defaults$5 = require$$0$k;
const uniqueId = require$$6;

const Runner = runner;
const Transaction = transaction$5;
const {
  executeQuery,
  enrichQueryObject,
} = queryExecutioner;
const QueryBuilder$1 = querybuilder;
const QueryCompiler = querycompiler;
const SchemaBuilder$1 = builder;
const SchemaCompiler = compiler$1;
const TableBuilder$1 = tablebuilder;
const TableCompiler = tablecompiler;
const ColumnBuilder$1 = columnbuilder;
const ColumnCompiler = columncompiler;
const { KnexTimeoutError: KnexTimeoutError$1 } = timeout$3;
const { outputQuery, unwrapRaw } = wrappingFormatter;
const { compileCallback } = formatterUtils;
const Raw = raw;
const Ref = ref;
const Formatter = formatter;
const Logger = logger;
const { POOL_CONFIG_OPTIONS } = constants$1;
const ViewBuilder$1 = viewbuilder;
const ViewCompiler = viewcompiler;
const isPlainObject = require$$3$3;
const { setHiddenProperty } = security;

const debug = require$$2$9('knex:client');

// The base client provides the general structure
// for a dialect specific client object.

let Client$4 = class Client extends EventEmitter$4 {
  constructor(config = {}) {
    super();
    this.config = config;
    this.logger = new Logger(config);

    if (this.config.connection && this.config.connection.password) {
      setHiddenProperty(this.config.connection);
    }

    //Client is a required field, so throw error if it's not supplied.
    //If 'this.dialect' is set, then this is a 'super()' call, in which case
    //'client' does not have to be set as it's already assigned on the client prototype.

    if (this.dialect && !this.config.client) {
      this.logger.warn(
        `Using 'this.dialect' to identify the client is deprecated and support for it will be removed in the future. Please use configuration option 'client' instead.`
      );
    }

    const dbClient = this.config.client || this.dialect;
    if (!dbClient) {
      throw new Error(
        `knex: Required configuration option 'client' is missing.`
      );
    }

    if (config.version) {
      this.version = config.version;
    }

    if (config.connection && config.connection instanceof Function) {
      this.connectionConfigProvider = config.connection;
      this.connectionConfigExpirationChecker = () => true; // causes the provider to be called on first use
    } else {
      this.connectionSettings = cloneDeep(config.connection || {});
      if (config.connection && config.connection.password) {
        setHiddenProperty(this.connectionSettings, config.connection);
      }
      this.connectionConfigExpirationChecker = null;
    }
    if (this.driverName && config.connection) {
      this.initializeDriver();
      if (!config.pool || (config.pool && config.pool.max !== 0)) {
        this.initializePool(config);
      }
    }
    this.valueForUndefined = this.raw('DEFAULT');
    if (config.useNullAsDefault) {
      this.valueForUndefined = null;
    }
  }
  formatter(builder) {
    return new Formatter(this, builder);
  }

  queryBuilder() {
    return new QueryBuilder$1(this);
  }

  queryCompiler(builder, formatter) {
    return new QueryCompiler(this, builder, formatter);
  }

  schemaBuilder() {
    return new SchemaBuilder$1(this);
  }

  schemaCompiler(builder) {
    return new SchemaCompiler(this, builder);
  }

  tableBuilder(type, tableName, tableNameLike, fn) {
    return new TableBuilder$1(this, type, tableName, tableNameLike, fn);
  }

  viewBuilder(type, viewBuilder, fn) {
    return new ViewBuilder$1(this, type, viewBuilder, fn);
  }

  tableCompiler(tableBuilder) {
    return new TableCompiler(this, tableBuilder);
  }

  viewCompiler(viewCompiler) {
    return new ViewCompiler(this, viewCompiler);
  }

  columnBuilder(tableBuilder, type, args) {
    return new ColumnBuilder$1(this, tableBuilder, type, args);
  }

  columnCompiler(tableBuilder, columnBuilder) {
    return new ColumnCompiler(this, tableBuilder, columnBuilder);
  }

  runner(builder) {
    return new Runner(this, builder);
  }

  transaction(container, config, outerTx) {
    return new Transaction(this, container, config, outerTx);
  }

  raw() {
    return new Raw(this).set(...arguments);
  }

  ref() {
    return new Ref(this, ...arguments);
  }
  query(connection, queryParam) {
    const queryObject = enrichQueryObject(connection, queryParam, this);
    return executeQuery(connection, queryObject, this);
  }

  stream(connection, queryParam, stream, options) {
    const queryObject = enrichQueryObject(connection, queryParam, this);
    return this._stream(connection, queryObject, stream, options);
  }

  prepBindings(bindings) {
    return bindings;
  }

  positionBindings(sql) {
    return sql;
  }

  postProcessResponse(resp, queryContext) {
    if (this.config.postProcessResponse) {
      return this.config.postProcessResponse(resp, queryContext);
    }
    return resp;
  }

  wrapIdentifier(value, queryContext) {
    return this.customWrapIdentifier(
      value,
      this.wrapIdentifierImpl,
      queryContext
    );
  }

  customWrapIdentifier(value, origImpl, queryContext) {
    if (this.config.wrapIdentifier) {
      return this.config.wrapIdentifier(value, origImpl, queryContext);
    }
    return origImpl(value);
  }

  wrapIdentifierImpl(value) {
    return value !== '*' ? `"${value.replace(/"/g, '""')}"` : '*';
  }

  initializeDriver() {
    try {
      this.driver = this._driver();
    } catch (e) {
      const message = `Knex: run\n$ npm install ${this.driverName} --save`;
      this.logger.error(`${message}\n${e.message}\n${e.stack}`);
      throw new Error(`${message}\n${e.message}`);
    }
  }

  poolDefaults() {
    return { min: 2, max: 10, propagateCreateError: true };
  }

  getPoolSettings(poolConfig) {
    poolConfig = defaults$5({}, poolConfig, this.poolDefaults());

    POOL_CONFIG_OPTIONS.forEach((option) => {
      if (option in poolConfig) {
        this.logger.warn(
          [
            `Pool config option "${option}" is no longer supported.`,
            `See https://github.com/Vincit/tarn.js for possible pool config options.`,
          ].join(' ')
        );
      }
    });

    const DEFAULT_ACQUIRE_TIMEOUT = 60000;
    const timeouts = [
      this.config.acquireConnectionTimeout,
      poolConfig.acquireTimeoutMillis,
    ].filter((timeout) => timeout !== undefined);

    if (!timeouts.length) {
      timeouts.push(DEFAULT_ACQUIRE_TIMEOUT);
    }

    // acquire connection timeout can be set on config or config.pool
    // choose the smallest, positive timeout setting and set on poolConfig
    poolConfig.acquireTimeoutMillis = Math.min(...timeouts);

    const updatePoolConnectionSettingsFromProvider = async () => {
      if (!this.connectionConfigProvider) {
        return; // static configuration, nothing to update
      }
      if (
        !this.connectionConfigExpirationChecker ||
        !this.connectionConfigExpirationChecker()
      ) {
        return; // not expired, reuse existing connection
      }
      const providerResult = await this.connectionConfigProvider();
      if (providerResult.expirationChecker) {
        this.connectionConfigExpirationChecker =
          providerResult.expirationChecker;
        delete providerResult.expirationChecker; // MySQL2 driver warns on receiving extra properties
      } else {
        this.connectionConfigExpirationChecker = null;
      }
      this.connectionSettings = providerResult;
    };

    return Object.assign(poolConfig, {
      create: async () => {
        await updatePoolConnectionSettingsFromProvider();
        const connection = await this.acquireRawConnection();
        connection.__knexUid = uniqueId('__knexUid');
        if (poolConfig.afterCreate) {
          await promisify$1(poolConfig.afterCreate)(connection);
        }
        return connection;
      },

      destroy: (connection) => {
        if (connection !== void 0) {
          return this.destroyRawConnection(connection);
        }
      },

      validate: (connection) => {
        if (connection.__knex__disposed) {
          this.logger.warn(`Connection Error: ${connection.__knex__disposed}`);
          return false;
        }

        return this.validateConnection(connection);
      },
    });
  }

  initializePool(config = this.config) {
    if (this.pool) {
      this.logger.warn('The pool has already been initialized');
      return;
    }

    const tarnPoolConfig = {
      ...this.getPoolSettings(config.pool),
    };
    // afterCreate is an internal knex param, tarn.js does not support it
    if (tarnPoolConfig.afterCreate) {
      delete tarnPoolConfig.afterCreate;
    }

    this.pool = new Pool$3(tarnPoolConfig);
  }

  validateConnection(connection) {
    return true;
  }

  // Acquire a connection from the pool.
  async acquireConnection() {
    if (!this.pool) {
      throw new Error('Unable to acquire a connection');
    }
    try {
      const connection = await this.pool.acquire().promise;
      debug('acquired connection from pool: %s', connection.__knexUid);
      if (connection.config) {
        if (connection.config.password) {
          setHiddenProperty(connection.config);
        }
        if (
          connection.config.authentication &&
          connection.config.authentication.options &&
          connection.config.authentication.options.password
        ) {
          setHiddenProperty(connection.config.authentication.options);
        }
      }
      return connection;
    } catch (error) {
      let convertedError = error;
      if (error instanceof TimeoutError) {
        convertedError = new KnexTimeoutError$1(
          'Knex: Timeout acquiring a connection. The pool is probably full. ' +
            'Are you missing a .transacting(trx) call?'
        );
      }
      throw convertedError;
    }
  }

  // Releases a connection back to the connection pool,
  // returning a promise resolved when the connection is released.
  releaseConnection(connection) {
    debug('releasing connection to pool: %s', connection.__knexUid);
    const didRelease = this.pool.release(connection);

    if (!didRelease) {
      debug('pool refused connection: %s', connection.__knexUid);
    }

    return Promise.resolve();
  }

  // Destroy the current connection pool for the client.
  async destroy(callback) {
    try {
      if (this.pool && this.pool.destroy) {
        await this.pool.destroy();
      }
      this.pool = undefined;

      if (typeof callback === 'function') {
        callback();
      }
    } catch (err) {
      if (typeof callback === 'function') {
        return callback(err);
      }
      throw err;
    }
  }

  // Return the database being used by this client.
  database() {
    return this.connectionSettings.database;
  }

  toString() {
    return '[object KnexClient]';
  }

  assertCanCancelQuery() {
    if (!this.canCancelQuery) {
      throw new Error('Query cancelling not supported for this dialect');
    }
  }

  cancelQuery() {
    throw new Error('Query cancelling not supported for this dialect');
  }

  // Formatter part

  alias(first, second) {
    return first + ' as ' + second;
  }

  // Checks whether a value is a function... if it is, we compile it
  // otherwise we check whether it's a raw
  parameter(value, builder, bindingsHolder) {
    if (typeof value === 'function') {
      return outputQuery(
        compileCallback(value, undefined, this, bindingsHolder),
        true,
        builder,
        this
      );
    }
    return unwrapRaw(value, true, builder, this, bindingsHolder) || '?';
  }

  // Turns a list of values into a list of ?'s, joining them with commas unless
  // a "joining" value is specified (e.g. ' and ')
  parameterize(values, notSetValue, builder, bindingsHolder) {
    if (typeof values === 'function')
      return this.parameter(values, builder, bindingsHolder);
    values = Array.isArray(values) ? values : [values];
    let str = '',
      i = -1;
    while (++i < values.length) {
      if (i > 0) str += ', ';
      let value = values[i];
      // json columns can have object in values.
      if (isPlainObject(value)) {
        value = JSON.stringify(value);
      }
      str += this.parameter(
        value === undefined ? notSetValue : value,
        builder,
        bindingsHolder
      );
    }
    return str;
  }

  // Formats `values` into a parenthesized list of parameters for a `VALUES`
  // clause.
  //
  // [1, 2]                  -> '(?, ?)'
  // [[1, 2], [3, 4]]        -> '((?, ?), (?, ?))'
  // knex('table')           -> '(select * from "table")'
  // knex.raw('select ?', 1) -> '(select ?)'
  //
  values(values, builder, bindingsHolder) {
    if (Array.isArray(values)) {
      if (Array.isArray(values[0])) {
        return `(${values
          .map(
            (value) =>
              `(${this.parameterize(
                value,
                undefined,
                builder,
                bindingsHolder
              )})`
          )
          .join(', ')})`;
      }
      return `(${this.parameterize(
        values,
        undefined,
        builder,
        bindingsHolder
      )})`;
    }

    if (values && values.isRawInstance) {
      return `(${this.parameter(values, builder, bindingsHolder)})`;
    }

    return this.parameter(values, builder, bindingsHolder);
  }

  processPassedConnection(connection) {
    // Default implementation is noop
  }

  toPathForJson(jsonPath) {
    // By default, we want a json path, so if this function is not overriden,
    // we return the path.
    return jsonPath;
  }
};

Object.assign(Client$4.prototype, {
  _escapeBinding: makeEscape({
    escapeString(str) {
      return `'${str.replace(/'/g, "''")}'`;
    },
  }),

  canCancelQuery: false,
});

var client$2 = Client$4;

//Parse method copied from https://github.com/brianc/node-postgres
//Copyright (c) 2010-2014 Brian Carlson (brian.m.carlson@gmail.com)
//MIT License

//parses a connection string
function parse$7(str) {
  //unix socket
  if (str.charAt(0) === '/') {
    const config = str.split(' ');
    return { host: config[0], database: config[1] }
  }

  // Check for empty host in URL

  const config = {};
  let result;
  let dummyHost = false;
  if (/ |%[^a-f0-9]|%[a-f0-9][^a-f0-9]/i.test(str)) {
    // Ensure spaces are encoded as %20
    str = encodeURI(str).replace(/\%25(\d\d)/g, '%$1');
  }

  try {
    result = new URL(str, 'postgres://base');
  } catch (e) {
    // The URL is invalid so try again with a dummy host
    result = new URL(str.replace('@/', '@___DUMMY___/'), 'postgres://base');
    dummyHost = true;
  }

  // We'd like to use Object.fromEntries() here but Node.js 10 does not support it
  for (const entry of result.searchParams.entries()) {
    config[entry[0]] = entry[1];
  }

  config.user = config.user || decodeURIComponent(result.username);
  config.password = config.password || decodeURIComponent(result.password);

  if (result.protocol == 'socket:') {
    config.host = decodeURI(result.pathname);
    config.database = result.searchParams.get('db');
    config.client_encoding = result.searchParams.get('encoding');
    return config
  }
  const hostname = dummyHost ? '' : result.hostname;
  if (!config.host) {
    // Only set the host if there is no equivalent query param.
    config.host = decodeURIComponent(hostname);
  } else if (hostname && /^%2f/i.test(hostname)) {
    // Only prepend the hostname to the pathname if it is not a URL encoded Unix socket host.
    result.pathname = hostname + result.pathname;
  }
  if (!config.port) {
    // Only set the port if there is no equivalent query param.
    config.port = result.port;
  }

  const pathname = result.pathname.slice(1) || null;
  config.database = pathname ? decodeURI(pathname) : null;

  if (config.ssl === 'true' || config.ssl === '1') {
    config.ssl = true;
  }

  if (config.ssl === '0') {
    config.ssl = false;
  }

  if (config.sslcert || config.sslkey || config.sslrootcert || config.sslmode) {
    config.ssl = {};
  }

  // Only try to load fs if we expect to read from the disk
  const fs = config.sslcert || config.sslkey || config.sslrootcert ? require$$1$c : null;

  if (config.sslcert) {
    config.ssl.cert = fs.readFileSync(config.sslcert).toString();
  }

  if (config.sslkey) {
    config.ssl.key = fs.readFileSync(config.sslkey).toString();
  }

  if (config.sslrootcert) {
    config.ssl.ca = fs.readFileSync(config.sslrootcert).toString();
  }

  switch (config.sslmode) {
    case 'disable': {
      config.ssl = false;
      break
    }
    case 'prefer':
    case 'require':
    case 'verify-ca':
    case 'verify-full': {
      break
    }
    case 'no-verify': {
      config.ssl.rejectUnauthorized = false;
      break
    }
  }

  return config
}

var pgConnectionString$1 = parse$7;

parse$7.parse = parse$7;

const { parse: parse$6 } = pgConnectionString$1;
const parsePG = parse$6;
const isWindows = process && process.platform && process.platform === 'win32';

/**
 * @param str
 * @returns {URL}
 */
function tryParse(str) {
  try {
    return new URL(str);
  } catch (e) {
    return null;
  }
}

var parseConnection$1 = function parseConnectionString(str) {
  const parsed = tryParse(str);
  const isDriveLetter = isWindows && parsed && parsed.protocol.length === 2;
  if (!parsed || isDriveLetter) {
    return {
      client: 'sqlite3',
      connection: {
        filename: str,
      },
    };
  }
  let { protocol } = parsed;
  if (protocol.slice(-1) === ':') {
    protocol = protocol.slice(0, -1);
  }

  const isPG = ['postgresql', 'postgres'].includes(protocol);

  return {
    client: protocol,
    connection: isPG ? parsePG(str) : connectionObject(parsed),
  };
};

/**
 * @param {URL} parsed
 * @returns {{}}
 */
function connectionObject(parsed) {
  const connection = {};
  let db = parsed.pathname;
  if (db[0] === '/') {
    db = db.slice(1);
  }

  connection.database = db;

  if (parsed.hostname) {
    if (parsed.protocol.indexOf('mssql') === 0) {
      connection.server = parsed.hostname;
    } else {
      connection.host = parsed.hostname;
    }
  }
  if (parsed.port) {
    connection.port = parsed.port;
  }
  if (parsed.username || parsed.password) {
    connection.user = decodeURIComponent(parsed.username);
  }
  if (parsed.password) {
    connection.password = decodeURIComponent(parsed.password);
  }
  if (parsed.searchParams) {
    for (const [key, value] of parsed.searchParams.entries()) {
      const isNestedConfigSupported = ['mysql:', 'mariadb:', 'mssql:'].includes(
        parsed.protocol
      );
      if (isNestedConfigSupported) {
        try {
          connection[key] = JSON.parse(value);
        } catch (err) {
          connection[key] = value;
        }
      } else {
        connection[key] = value;
      }
    }
  }
  return connection;
}

var dialects = {};

var sqliteTransaction;
var hasRequiredSqliteTransaction;

function requireSqliteTransaction () {
	if (hasRequiredSqliteTransaction) return sqliteTransaction;
	hasRequiredSqliteTransaction = 1;
	const Transaction = transaction$5;

	class Transaction_Sqlite extends Transaction {
	  begin(conn) {
	    // SQLite doesn't really support isolation levels, it is serializable by
	    // default and so we override it to ignore isolation level.
	    // There is a `PRAGMA read_uncommitted = true;`, but that's probably not
	    // what the user wants
	    if (this.isolationLevel) {
	      this.client.logger.warn(
	        'sqlite3 only supports serializable transactions, ignoring the isolation level param'
	      );
	    }
	    // SQLite infers read vs write transactions from the statement operation
	    // https://www.sqlite.org/lang_transaction.html#read_transactions_versus_write_transactions
	    if (this.readOnly) {
	      this.client.logger.warn(
	        'sqlite3 implicitly handles read vs write transactions'
	      );
	    }
	    return this.query(conn, 'BEGIN;');
	  }
	}

	sqliteTransaction = Transaction_Sqlite;
	return sqliteTransaction;
}

const require$$0$6 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(constant);

const require$$2$4 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(identity);

var sqliteQuerycompiler;
var hasRequiredSqliteQuerycompiler;

function requireSqliteQuerycompiler () {
	if (hasRequiredSqliteQuerycompiler) return sqliteQuerycompiler;
	hasRequiredSqliteQuerycompiler = 1;
	// SQLite3 Query Builder & Compiler

	const constant = require$$0$6;
	const each = require$$0$b;
	const identity = require$$2$4;
	const isEmpty = require$$2$8;
	const reduce = require$$4$1;

	const QueryCompiler = querycompiler;
	const noop = noop$1;
	const { isString } = is;
	const {
	  wrapString,
	  columnize: columnize_,
	} = wrappingFormatter;

	const emptyStr = constant('');

	class QueryCompiler_SQLite3 extends QueryCompiler {
	  constructor(client, builder, formatter) {
	    super(client, builder, formatter);

	    // The locks are not applicable in SQLite3
	    this.forShare = emptyStr;
	    this.forKeyShare = emptyStr;
	    this.forUpdate = emptyStr;
	    this.forNoKeyUpdate = emptyStr;
	  }

	  // SQLite requires us to build the multi-row insert as a listing of select with
	  // unions joining them together. So we'll build out this list of columns and
	  // then join them all together with select unions to complete the queries.
	  insert() {
	    const insertValues = this.single.insert || [];
	    let sql = this.with() + `insert into ${this.tableName} `;

	    if (Array.isArray(insertValues)) {
	      if (insertValues.length === 0) {
	        return '';
	      } else if (
	        insertValues.length === 1 &&
	        insertValues[0] &&
	        isEmpty(insertValues[0])
	      ) {
	        return {
	          sql: sql + this._emptyInsertValue,
	        };
	      }
	    } else if (typeof insertValues === 'object' && isEmpty(insertValues)) {
	      return {
	        sql: sql + this._emptyInsertValue,
	      };
	    }

	    const insertData = this._prepInsert(insertValues);

	    if (isString(insertData)) {
	      return {
	        sql: sql + insertData,
	      };
	    }

	    if (insertData.columns.length === 0) {
	      return {
	        sql: '',
	      };
	    }

	    sql += `(${this.formatter.columnize(insertData.columns)})`;

	    // backwards compatible error
	    if (this.client.valueForUndefined !== null) {
	      insertData.values.forEach((bindings) => {
	        each(bindings, (binding) => {
	          if (binding === undefined)
	            throw new TypeError(
	              '`sqlite` does not support inserting default values. Specify ' +
	                'values explicitly or use the `useNullAsDefault` config flag. ' +
	                '(see docs https://knexjs.org/guide/query-builder.html#insert).'
	            );
	        });
	      });
	    }

	    if (insertData.values.length === 1) {
	      const parameters = this.client.parameterize(
	        insertData.values[0],
	        this.client.valueForUndefined,
	        this.builder,
	        this.bindingsHolder
	      );
	      sql += ` values (${parameters})`;

	      const { onConflict, ignore, merge } = this.single;
	      if (onConflict && ignore) sql += this._ignore(onConflict);
	      else if (onConflict && merge) {
	        sql += this._merge(merge.updates, onConflict, insertValues);
	        const wheres = this.where();
	        if (wheres) sql += ` ${wheres}`;
	      }

	      const { returning } = this.single;
	      if (returning) {
	        sql += this._returning(returning);
	      }

	      return {
	        sql,
	        returning,
	      };
	    }

	    const blocks = [];
	    let i = -1;
	    while (++i < insertData.values.length) {
	      let i2 = -1;
	      const block = (blocks[i] = []);
	      let current = insertData.values[i];
	      current = current === undefined ? this.client.valueForUndefined : current;
	      while (++i2 < insertData.columns.length) {
	        block.push(
	          this.client.alias(
	            this.client.parameter(
	              current[i2],
	              this.builder,
	              this.bindingsHolder
	            ),
	            this.formatter.wrap(insertData.columns[i2])
	          )
	        );
	      }
	      blocks[i] = block.join(', ');
	    }
	    sql += ' select ' + blocks.join(' union all select ');

	    const { onConflict, ignore, merge } = this.single;
	    if (onConflict && ignore) sql += ' where true' + this._ignore(onConflict);
	    else if (onConflict && merge) {
	      sql +=
	        ' where true' + this._merge(merge.updates, onConflict, insertValues);
	    }

	    const { returning } = this.single;
	    if (returning) sql += this._returning(returning);

	    return {
	      sql,
	      returning,
	    };
	  }

	  // Compiles an `update` query, allowing for a return value.
	  update() {
	    const withSQL = this.with();
	    const updateData = this._prepUpdate(this.single.update);
	    const wheres = this.where();
	    const { returning } = this.single;
	    return {
	      sql:
	        withSQL +
	        `update ${this.single.only ? 'only ' : ''}${this.tableName} ` +
	        `set ${updateData.join(', ')}` +
	        (wheres ? ` ${wheres}` : '') +
	        this._returning(returning),
	      returning,
	    };
	  }

	  _ignore(columns) {
	    if (columns === true) {
	      return ' on conflict do nothing';
	    }
	    return ` on conflict ${this._onConflictClause(columns)} do nothing`;
	  }

	  _merge(updates, columns, insert) {
	    let sql = ` on conflict ${this._onConflictClause(columns)} do update set `;
	    if (updates && Array.isArray(updates)) {
	      sql += updates
	        .map((column) =>
	          wrapString(
	            column.split('.').pop(),
	            this.formatter.builder,
	            this.client,
	            this.formatter
	          )
	        )
	        .map((column) => `${column} = excluded.${column}`)
	        .join(', ');

	      return sql;
	    } else if (updates && typeof updates === 'object') {
	      const updateData = this._prepUpdate(updates);
	      if (typeof updateData === 'string') {
	        sql += updateData;
	      } else {
	        sql += updateData.join(',');
	      }

	      return sql;
	    } else {
	      const insertData = this._prepInsert(insert);
	      if (typeof insertData === 'string') {
	        throw new Error(
	          'If using merge with a raw insert query, then updates must be provided'
	        );
	      }

	      sql += insertData.columns
	        .map((column) =>
	          wrapString(column.split('.').pop(), this.builder, this.client)
	        )
	        .map((column) => `${column} = excluded.${column}`)
	        .join(', ');

	      return sql;
	    }
	  }

	  _returning(value) {
	    return value ? ` returning ${this.formatter.columnize(value)}` : '';
	  }

	  // Compile a truncate table statement into SQL.
	  truncate() {
	    const { table } = this.single;
	    return {
	      sql: `delete from ${this.tableName}`,
	      output() {
	        return this.query({
	          sql: `delete from sqlite_sequence where name = '${table}'`,
	        }).catch(noop);
	      },
	    };
	  }

	  // Compiles a `columnInfo` query
	  columnInfo() {
	    const column = this.single.columnInfo;

	    // The user may have specified a custom wrapIdentifier function in the config. We
	    // need to run the identifiers through that function, but not format them as
	    // identifiers otherwise.
	    const table = this.client.customWrapIdentifier(this.single.table, identity);

	    return {
	      sql: `PRAGMA table_info(\`${table}\`)`,
	      output(resp) {
	        const maxLengthRegex = /.*\((\d+)\)/;
	        const out = reduce(
	          resp,
	          function (columns, val) {
	            let { type } = val;
	            let maxLength = type.match(maxLengthRegex);
	            if (maxLength) {
	              maxLength = maxLength[1];
	            }
	            type = maxLength ? type.split('(')[0] : type;
	            columns[val.name] = {
	              type: type.toLowerCase(),
	              maxLength,
	              nullable: !val.notnull,
	              defaultValue: val.dflt_value,
	            };
	            return columns;
	          },
	          {}
	        );
	        return (column && out[column]) || out;
	      },
	    };
	  }

	  limit() {
	    const noLimit = !this.single.limit && this.single.limit !== 0;
	    if (noLimit && !this.single.offset) return '';

	    // Workaround for offset only,
	    // see http://stackoverflow.com/questions/10491492/sqllite-with-skip-offset-only-not-limit
	    this.single.limit = noLimit ? -1 : this.single.limit;
	    return `limit ${this._getValueOrParameterFromAttribute('limit')}`;
	  }

	  // Json functions
	  jsonExtract(params) {
	    return this._jsonExtract('json_extract', params);
	  }

	  jsonSet(params) {
	    return this._jsonSet('json_set', params);
	  }

	  jsonInsert(params) {
	    return this._jsonSet('json_insert', params);
	  }

	  jsonRemove(params) {
	    const jsonCol = `json_remove(${columnize_(
	      params.column,
	      this.builder,
	      this.client,
	      this.bindingsHolder
	    )},${this.client.parameter(
	      params.path,
	      this.builder,
	      this.bindingsHolder
	    )})`;
	    return params.alias
	      ? this.client.alias(jsonCol, this.formatter.wrap(params.alias))
	      : jsonCol;
	  }

	  whereJsonPath(statement) {
	    return this._whereJsonPath('json_extract', statement);
	  }

	  whereJsonSupersetOf(statement) {
	    throw new Error(
	      'Json superset where clause not actually supported by SQLite'
	    );
	  }

	  whereJsonSubsetOf(statement) {
	    throw new Error(
	      'Json subset where clause not actually supported by SQLite'
	    );
	  }

	  onJsonPathEquals(clause) {
	    return this._onJsonPathEquals('json_extract', clause);
	  }
	}

	sqliteQuerycompiler = QueryCompiler_SQLite3;
	return sqliteQuerycompiler;
}

const require$$1$4 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(some);

var sqliteCompiler;
var hasRequiredSqliteCompiler;

function requireSqliteCompiler () {
	if (hasRequiredSqliteCompiler) return sqliteCompiler;
	hasRequiredSqliteCompiler = 1;
	// SQLite3: Column Builder & Compiler
	// -------
	const SchemaCompiler = compiler$1;

	const some = require$$1$4;

	// Schema Compiler
	// -------

	class SchemaCompiler_SQLite3 extends SchemaCompiler {
	  constructor(client, builder) {
	    super(client, builder);
	  }

	  // Compile the query to determine if a table exists.
	  hasTable(tableName) {
	    const sql =
	      `select * from sqlite_master ` +
	      `where type = 'table' and name = ${this.client.parameter(
	        this.formatter.wrap(tableName).replace(/`/g, ''),
	        this.builder,
	        this.bindingsHolder
	      )}`;
	    this.pushQuery({ sql, output: (resp) => resp.length > 0 });
	  }

	  // Compile the query to determine if a column exists.
	  hasColumn(tableName, column) {
	    this.pushQuery({
	      sql: `PRAGMA table_info(${this.formatter.wrap(tableName)})`,
	      output(resp) {
	        return some(resp, (col) => {
	          return (
	            this.client.wrapIdentifier(col.name.toLowerCase()) ===
	            this.client.wrapIdentifier(column.toLowerCase())
	          );
	        });
	      },
	    });
	  }

	  // Compile a rename table command.
	  renameTable(from, to) {
	    this.pushQuery(
	      `alter table ${this.formatter.wrap(from)} rename to ${this.formatter.wrap(
	        to
	      )}`
	    );
	  }

	  async generateDdlCommands() {
	    const sequence = this.builder._sequence;
	    for (let i = 0, l = sequence.length; i < l; i++) {
	      const query = sequence[i];
	      this[query.method].apply(this, query.args);
	    }

	    const commandSources = this.sequence;

	    if (commandSources.length === 1 && commandSources[0].statementsProducer) {
	      return commandSources[0].statementsProducer();
	    } else {
	      const result = [];

	      for (const commandSource of commandSources) {
	        const command = commandSource.sql;

	        if (Array.isArray(command)) {
	          result.push(...command);
	        } else {
	          result.push(command);
	        }
	      }

	      return { pre: [], sql: result, check: null, post: [] };
	    }
	  }
	}

	sqliteCompiler = SchemaCompiler_SQLite3;
	return sqliteCompiler;
}

var sqliteColumncompiler;
var hasRequiredSqliteColumncompiler;

function requireSqliteColumncompiler () {
	if (hasRequiredSqliteColumncompiler) return sqliteColumncompiler;
	hasRequiredSqliteColumncompiler = 1;
	const ColumnCompiler = columncompiler;

	// Column Compiler
	// -------

	class ColumnCompiler_SQLite3 extends ColumnCompiler {
	  constructor() {
	    super(...arguments);
	    this.modifiers = ['nullable', 'defaultTo'];
	    this._addCheckModifiers();
	  }

	  // Types
	  // -------

	  enu(allowed) {
	    return `text check (${this.formatter.wrap(
	      this.args[0]
	    )} in ('${allowed.join("', '")}'))`;
	  }

	  _pushAlterCheckQuery(checkPredicate, constraintName) {
	    throw new Error(
	      `Alter table with to add constraints is not permitted in SQLite`
	    );
	  }

	  checkRegex(regexes, constraintName) {
	    return this._check(
	      `${this.formatter.wrap(
	        this.getColumnName()
	      )} REGEXP ${this.client._escapeBinding(regexes)}`,
	      constraintName
	    );
	  }
	}

	ColumnCompiler_SQLite3.prototype.json = 'json';
	ColumnCompiler_SQLite3.prototype.jsonb = 'json';
	ColumnCompiler_SQLite3.prototype.double =
	  ColumnCompiler_SQLite3.prototype.decimal =
	  ColumnCompiler_SQLite3.prototype.floating =
	    'float';
	ColumnCompiler_SQLite3.prototype.timestamp = 'datetime';
	// autoincrement without primary key is a syntax error in SQLite, so it's necessary
	ColumnCompiler_SQLite3.prototype.increments =
	  ColumnCompiler_SQLite3.prototype.bigincrements =
	    'integer not null primary key autoincrement';

	sqliteColumncompiler = ColumnCompiler_SQLite3;
	return sqliteColumncompiler;
}

const require$$0$5 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(filter);

const require$$1$3 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(values);

var sqliteTablecompiler;
var hasRequiredSqliteTablecompiler;

function requireSqliteTablecompiler () {
	if (hasRequiredSqliteTablecompiler) return sqliteTablecompiler;
	hasRequiredSqliteTablecompiler = 1;
	const filter = require$$0$5;
	const values = require$$1$3;
	const identity = require$$2$4;
	const { isObject } = is;

	const TableCompiler = tablecompiler;
	const { formatDefault } = formatterUtils;

	class TableCompiler_SQLite3 extends TableCompiler {
	  constructor() {
	    super(...arguments);
	  }

	  // Create a new table.
	  createQuery(columns, ifNot, like) {
	    const createStatement = ifNot
	      ? 'create table if not exists '
	      : 'create table ';

	    let sql = createStatement + this.tableName();

	    if (like && this.tableNameLike()) {
	      sql += ' as select * from ' + this.tableNameLike() + ' where 0=1';
	    } else {
	      // so we will need to check for a primary key commands and add the columns
	      // to the table's declaration here so they can be created on the tables.
	      sql += ' (' + columns.sql.join(', ');
	      sql += this.foreignKeys() || '';
	      sql += this.primaryKeys() || '';
	      sql += this._addChecks();
	      sql += ')';
	    }
	    this.pushQuery(sql);

	    if (like) {
	      this.addColumns(columns, this.addColumnsPrefix);
	    }
	  }

	  addColumns(columns, prefix, colCompilers) {
	    if (prefix === this.alterColumnsPrefix) {
	      const compiler = this;

	      const columnsInfo = colCompilers.map((col) => {
	        const name = this.client.customWrapIdentifier(
	          col.getColumnName(),
	          identity,
	          col.columnBuilder.queryContext()
	        );

	        const type = col.getColumnType();

	        const defaultTo = col.modified['defaultTo']
	          ? formatDefault(col.modified['defaultTo'][0], col.type, this.client)
	          : null;

	        const notNull =
	          col.modified['nullable'] && col.modified['nullable'][0] === false;

	        return { name, type, defaultTo, notNull };
	      });

	      this.pushQuery({
	        sql: `PRAGMA table_info(${this.tableName()})`,
	        statementsProducer(pragma, connection) {
	          return compiler.client
	            .ddl(compiler, pragma, connection)
	            .alterColumn(columnsInfo);
	        },
	      });
	    } else {
	      for (let i = 0, l = columns.sql.length; i < l; i++) {
	        this.pushQuery({
	          sql: `alter table ${this.tableName()} add column ${columns.sql[i]}`,
	          bindings: columns.bindings[i],
	        });
	      }
	    }
	  }

	  // Compile a drop unique key command.
	  dropUnique(columns, indexName) {
	    indexName = indexName
	      ? this.formatter.wrap(indexName)
	      : this._indexCommand('unique', this.tableNameRaw, columns);
	    this.pushQuery(`drop index ${indexName}`);
	  }

	  // Compile a drop foreign key command.
	  dropForeign(columns, indexName) {
	    const compiler = this;

	    columns = Array.isArray(columns) ? columns : [columns];
	    columns = columns.map((column) =>
	      this.client.customWrapIdentifier(column, identity)
	    );
	    indexName = this.client.customWrapIdentifier(indexName, identity);

	    this.pushQuery({
	      sql: `PRAGMA table_info(${this.tableName()})`,
	      output(pragma) {
	        return compiler.client
	          .ddl(compiler, pragma, this.connection)
	          .dropForeign(columns, indexName);
	      },
	    });
	  }

	  // Compile a drop primary key command.
	  dropPrimary(constraintName) {
	    const compiler = this;

	    constraintName = this.client.customWrapIdentifier(constraintName, identity);

	    this.pushQuery({
	      sql: `PRAGMA table_info(${this.tableName()})`,
	      output(pragma) {
	        return compiler.client
	          .ddl(compiler, pragma, this.connection)
	          .dropPrimary(constraintName);
	      },
	    });
	  }

	  dropIndex(columns, indexName) {
	    indexName = indexName
	      ? this.formatter.wrap(indexName)
	      : this._indexCommand('index', this.tableNameRaw, columns);
	    this.pushQuery(`drop index ${indexName}`);
	  }

	  // Compile a unique key command.
	  unique(columns, indexName) {
	    let deferrable;
	    let predicate;
	    if (isObject(indexName)) {
	      ({ indexName, deferrable, predicate } = indexName);
	    }
	    if (deferrable && deferrable !== 'not deferrable') {
	      this.client.logger.warn(
	        `sqlite3: unique index \`${indexName}\` will not be deferrable ${deferrable} because sqlite3 does not support deferred constraints.`
	      );
	    }
	    indexName = indexName
	      ? this.formatter.wrap(indexName)
	      : this._indexCommand('unique', this.tableNameRaw, columns);
	    columns = this.formatter.columnize(columns);

	    const predicateQuery = predicate
	      ? ' ' + this.client.queryCompiler(predicate).where()
	      : '';

	    this.pushQuery(
	      `create unique index ${indexName} on ${this.tableName()} (${columns})${predicateQuery}`
	    );
	  }

	  // Compile a plain index key command.
	  index(columns, indexName, options) {
	    indexName = indexName
	      ? this.formatter.wrap(indexName)
	      : this._indexCommand('index', this.tableNameRaw, columns);
	    columns = this.formatter.columnize(columns);

	    let predicate;
	    if (isObject(options)) {
	      ({ predicate } = options);
	    }
	    const predicateQuery = predicate
	      ? ' ' + this.client.queryCompiler(predicate).where()
	      : '';
	    this.pushQuery(
	      `create index ${indexName} on ${this.tableName()} (${columns})${predicateQuery}`
	    );
	  }

	  /**
	   * Add a primary key to an existing table.
	   *
	   * @NOTE The `createQuery` method above handles table creation. Don't do anything regarding table
	   *       creation in this method
	   *
	   * @param {string | string[]} columns - Column name(s) to assign as primary keys
	   * @param {string} [constraintName] - Custom name for the PK constraint
	   */
	  primary(columns, constraintName) {
	    const compiler = this;

	    columns = Array.isArray(columns) ? columns : [columns];
	    columns = columns.map((column) =>
	      this.client.customWrapIdentifier(column, identity)
	    );

	    let deferrable;
	    if (isObject(constraintName)) {
	      ({ constraintName, deferrable } = constraintName);
	    }
	    if (deferrable && deferrable !== 'not deferrable') {
	      this.client.logger.warn(
	        `sqlite3: primary key constraint \`${constraintName}\` will not be deferrable ${deferrable} because sqlite3 does not support deferred constraints.`
	      );
	    }
	    constraintName = this.client.customWrapIdentifier(constraintName, identity);

	    if (this.method !== 'create' && this.method !== 'createIfNot') {
	      this.pushQuery({
	        sql: `PRAGMA table_info(${this.tableName()})`,
	        output(pragma) {
	          return compiler.client
	            .ddl(compiler, pragma, this.connection)
	            .primary(columns, constraintName);
	        },
	      });
	    }
	  }

	  /**
	   * Add a foreign key constraint to an existing table
	   *
	   * @NOTE The `createQuery` method above handles foreign key constraints on table creation. Don't do
	   *       anything regarding table creation in this method
	   *
	   * @param {object} foreignInfo - Information about the current column foreign setup
	   * @param {string | string[]} [foreignInfo.column] - Column in the current constraint
	   * @param {string | undefined} foreignInfo.keyName - Name of the foreign key constraint
	   * @param {string | string[]} foreignInfo.references - What column it references in the other table
	   * @param {string} foreignInfo.inTable - What table is referenced in this constraint
	   * @param {string} [foreignInfo.onUpdate] - What to do on updates
	   * @param {string} [foreignInfo.onDelete] - What to do on deletions
	   */
	  foreign(foreignInfo) {
	    const compiler = this;

	    if (this.method !== 'create' && this.method !== 'createIfNot') {
	      foreignInfo.column = Array.isArray(foreignInfo.column)
	        ? foreignInfo.column
	        : [foreignInfo.column];
	      foreignInfo.column = foreignInfo.column.map((column) =>
	        this.client.customWrapIdentifier(column, identity)
	      );
	      foreignInfo.inTable = this.client.customWrapIdentifier(
	        foreignInfo.inTable,
	        identity
	      );
	      foreignInfo.references = Array.isArray(foreignInfo.references)
	        ? foreignInfo.references
	        : [foreignInfo.references];
	      foreignInfo.references = foreignInfo.references.map((column) =>
	        this.client.customWrapIdentifier(column, identity)
	      );

	      this.pushQuery({
	        sql: `PRAGMA table_info(${this.tableName()})`,
	        statementsProducer(pragma, connection) {
	          return compiler.client
	            .ddl(compiler, pragma, connection)
	            .foreign(foreignInfo);
	        },
	      });
	    }
	  }

	  primaryKeys() {
	    const pks = filter(this.grouped.alterTable || [], { method: 'primary' });
	    if (pks.length > 0 && pks[0].args.length > 0) {
	      const columns = pks[0].args[0];
	      let constraintName = pks[0].args[1] || '';
	      if (constraintName) {
	        constraintName = ' constraint ' + this.formatter.wrap(constraintName);
	      }
	      const needUniqueCols =
	        this.grouped.columns.filter((t) => t.builder._type === 'increments')
	          .length > 0;
	      // SQLite dont support autoincrement columns and composite primary keys (autoincrement is always primary key).
	      // You need to add unique index instead when you have autoincrement columns (https://stackoverflow.com/a/6154876/1535159)
	      return `,${constraintName} ${
	        needUniqueCols ? 'unique' : 'primary key'
	      } (${this.formatter.columnize(columns)})`;
	    }
	  }

	  foreignKeys() {
	    let sql = '';
	    const foreignKeys = filter(this.grouped.alterTable || [], {
	      method: 'foreign',
	    });
	    for (let i = 0, l = foreignKeys.length; i < l; i++) {
	      const foreign = foreignKeys[i].args[0];
	      const column = this.formatter.columnize(foreign.column);
	      const references = this.formatter.columnize(foreign.references);
	      const foreignTable = this.formatter.wrap(foreign.inTable);
	      let constraintName = foreign.keyName || '';
	      if (constraintName) {
	        constraintName = ' constraint ' + this.formatter.wrap(constraintName);
	      }
	      sql += `,${constraintName} foreign key(${column}) references ${foreignTable}(${references})`;
	      if (foreign.onDelete) sql += ` on delete ${foreign.onDelete}`;
	      if (foreign.onUpdate) sql += ` on update ${foreign.onUpdate}`;
	    }
	    return sql;
	  }

	  createTableBlock() {
	    return this.getColumns().concat().join(',');
	  }

	  renameColumn(from, to) {
	    this.pushQuery({
	      sql: `alter table ${this.tableName()} rename ${this.formatter.wrap(
	        from
	      )} to ${this.formatter.wrap(to)}`,
	    });
	  }

	  _setNullableState(column, isNullable) {
	    const compiler = this;

	    this.pushQuery({
	      sql: `PRAGMA table_info(${this.tableName()})`,
	      statementsProducer(pragma, connection) {
	        return compiler.client
	          .ddl(compiler, pragma, connection)
	          .setNullable(column, isNullable);
	      },
	    });
	  }

	  dropColumn() {
	    const compiler = this;
	    const columns = values(arguments);

	    const columnsWrapped = columns.map((column) =>
	      this.client.customWrapIdentifier(column, identity)
	    );

	    this.pushQuery({
	      sql: `PRAGMA table_info(${this.tableName()})`,
	      output(pragma) {
	        return compiler.client
	          .ddl(compiler, pragma, this.connection)
	          .dropColumn(columnsWrapped);
	      },
	    });
	  }
	}

	sqliteTablecompiler = TableCompiler_SQLite3;
	return sqliteTablecompiler;
}

/* eslint max-len: 0 */

var sqliteViewcompiler;
var hasRequiredSqliteViewcompiler;

function requireSqliteViewcompiler () {
	if (hasRequiredSqliteViewcompiler) return sqliteViewcompiler;
	hasRequiredSqliteViewcompiler = 1;
	const ViewCompiler = viewcompiler;
	const {
	  columnize: columnize_,
	} = wrappingFormatter;

	class ViewCompiler_SQLite3 extends ViewCompiler {
	  constructor(client, viewCompiler) {
	    super(client, viewCompiler);
	  }
	  createOrReplace() {
	    const columns = this.columns;
	    const selectQuery = this.selectQuery.toString();
	    const viewName = this.viewName();

	    const columnList = columns
	      ? ' (' +
	        columnize_(
	          columns,
	          this.viewBuilder,
	          this.client,
	          this.bindingsHolder
	        ) +
	        ')'
	      : '';

	    const dropSql = `drop view if exists ${viewName}`;
	    const createSql = `create view ${viewName}${columnList} as ${selectQuery}`;

	    this.pushQuery({
	      sql: dropSql,
	    });
	    this.pushQuery({
	      sql: createSql,
	    });
	  }
	}

	sqliteViewcompiler = ViewCompiler_SQLite3;
	return sqliteViewcompiler;
}

var sqliteDdlOperations;
var hasRequiredSqliteDdlOperations;

function requireSqliteDdlOperations () {
	if (hasRequiredSqliteDdlOperations) return sqliteDdlOperations;
	hasRequiredSqliteDdlOperations = 1;
	function copyData(sourceTable, targetTable, columns) {
	  return `INSERT INTO "${targetTable}" SELECT ${
	    columns === undefined
	      ? '*'
	      : columns.map((column) => `"${column}"`).join(', ')
	  } FROM "${sourceTable}";`;
	}

	function dropOriginal(tableName) {
	  return `DROP TABLE "${tableName}"`;
	}

	function renameTable(tableName, alteredName) {
	  return `ALTER TABLE "${tableName}" RENAME TO "${alteredName}"`;
	}

	function getTableSql(tableName) {
	  return `SELECT type, sql FROM sqlite_master WHERE (type='table' OR (type='index' AND sql IS NOT NULL)) AND lower(tbl_name)='${tableName.toLowerCase()}'`;
	}

	function isForeignCheckEnabled() {
	  return `PRAGMA foreign_keys`;
	}

	function setForeignCheck(enable) {
	  return `PRAGMA foreign_keys = ${enable ? 'ON' : 'OFF'}`;
	}

	function executeForeignCheck() {
	  return `PRAGMA foreign_key_check`;
	}

	sqliteDdlOperations = {
	  copyData,
	  dropOriginal,
	  renameTable,
	  getTableSql,
	  isForeignCheckEnabled,
	  setForeignCheck,
	  executeForeignCheck,
	};
	return sqliteDdlOperations;
}

var tokenizer;
var hasRequiredTokenizer;

function requireTokenizer () {
	if (hasRequiredTokenizer) return tokenizer;
	hasRequiredTokenizer = 1;
	function tokenize(text, tokens) {
	  const compiledRegex = new RegExp(
	    Object.entries(tokens)
	      .map(([type, regex]) => `(?<${type}>${regex.source})`)
	      .join('|'),
	    'yi'
	  );

	  let index = 0;
	  const ast = [];

	  while (index < text.length) {
	    compiledRegex.lastIndex = index;
	    const result = text.match(compiledRegex);

	    if (result !== null) {
	      const [type, text] = Object.entries(result.groups).find(
	        ([name, group]) => group !== undefined
	      );

	      index += text.length;

	      if (!type.startsWith('_')) {
	        ast.push({ type, text });
	      }
	    } else {
	      throw new Error(
	        `No matching tokenizer rule found at: [${text.substring(index)}]`
	      );
	    }
	  }

	  return ast;
	}

	tokenizer = {
	  tokenize,
	};
	return tokenizer;
}

var parserCombinator;
var hasRequiredParserCombinator;

function requireParserCombinator () {
	if (hasRequiredParserCombinator) return parserCombinator;
	hasRequiredParserCombinator = 1;
	// Sequence parser combinator
	function s(sequence, post = (v) => v) {
	  return function ({ index = 0, input }) {
	    let position = index;
	    const ast = [];

	    for (const parser of sequence) {
	      const result = parser({ index: position, input });

	      if (result.success) {
	        position = result.index;
	        ast.push(result.ast);
	      } else {
	        return result;
	      }
	    }

	    return { success: true, ast: post(ast), index: position, input };
	  };
	}

	// Alternative parser combinator
	function a(alternative, post = (v) => v) {
	  return function ({ index = 0, input }) {
	    for (const parser of alternative) {
	      const result = parser({ index, input });

	      if (result.success) {
	        return {
	          success: true,
	          ast: post(result.ast),
	          index: result.index,
	          input,
	        };
	      }
	    }

	    return { success: false, ast: null, index, input };
	  };
	}

	// Many parser combinator
	function m(many, post = (v) => v) {
	  return function ({ index = 0, input }) {
	    let result = {};
	    let position = index;
	    const ast = [];

	    do {
	      result = many({ index: position, input });

	      if (result.success) {
	        position = result.index;
	        ast.push(result.ast);
	      }
	    } while (result.success);

	    if (ast.length > 0) {
	      return { success: true, ast: post(ast), index: position, input };
	    } else {
	      return { success: false, ast: null, index: position, input };
	    }
	  };
	}

	// Optional parser combinator
	function o(optional, post = (v) => v) {
	  return function ({ index = 0, input }) {
	    const result = optional({ index, input });

	    if (result.success) {
	      return {
	        success: true,
	        ast: post(result.ast),
	        index: result.index,
	        input,
	      };
	    } else {
	      return { success: true, ast: post(null), index, input };
	    }
	  };
	}

	// Lookahead parser combinator
	function l(lookahead, post = (v) => v) {
	  return function ({ index = 0, input }) {
	    const result = lookahead.do({ index, input });

	    if (result.success) {
	      const resultNext = lookahead.next({ index: result.index, input });

	      if (resultNext.success) {
	        return {
	          success: true,
	          ast: post(result.ast),
	          index: result.index,
	          input,
	        };
	      }
	    }

	    return { success: false, ast: null, index, input };
	  };
	}

	// Negative parser combinator
	function n(negative, post = (v) => v) {
	  return function ({ index = 0, input }) {
	    const result = negative.do({ index, input });

	    if (result.success) {
	      const resultNot = negative.not({ index, input });

	      if (!resultNot.success) {
	        return {
	          success: true,
	          ast: post(result.ast),
	          index: result.index,
	          input,
	        };
	      }
	    }

	    return { success: false, ast: null, index, input };
	  };
	}

	// Token parser combinator
	function t(token, post = (v) => v.text) {
	  return function ({ index = 0, input }) {
	    const result = input[index];

	    if (
	      result !== undefined &&
	      (token.type === undefined || token.type === result.type) &&
	      (token.text === undefined ||
	        token.text.toUpperCase() === result.text.toUpperCase())
	    ) {
	      return {
	        success: true,
	        ast: post(result),
	        index: index + 1,
	        input,
	      };
	    } else {
	      return { success: false, ast: null, index, input };
	    }
	  };
	}

	// Empty parser constant
	const e = function ({ index = 0, input }) {
	  return { success: true, ast: null, index, input };
	};

	// Finish parser constant
	const f = function ({ index = 0, input }) {
	  return { success: index === input.length, ast: null, index, input };
	};

	parserCombinator = { s, a, m, o, l, n, t, e, f };
	return parserCombinator;
}

var parser$1;
var hasRequiredParser;

function requireParser () {
	if (hasRequiredParser) return parser$1;
	hasRequiredParser = 1;
	const { tokenize } = /*@__PURE__*/ requireTokenizer();
	const { s, a, m, o, l, n, t, e, f } = /*@__PURE__*/ requireParserCombinator();

	const TOKENS = {
	  keyword:
	    /(?:ABORT|ACTION|ADD|AFTER|ALL|ALTER|ALWAYS|ANALYZE|AND|AS|ASC|ATTACH|AUTOINCREMENT|BEFORE|BEGIN|BETWEEN|BY|CASCADE|CASE|CAST|CHECK|COLLATE|COLUMN|COMMIT|CONFLICT|CONSTRAINT|CREATE|CROSS|CURRENT|CURRENT_DATE|CURRENT_TIME|CURRENT_TIMESTAMP|DATABASE|DEFAULT|DEFERRED|DEFERRABLE|DELETE|DESC|DETACH|DISTINCT|DO|DROP|END|EACH|ELSE|ESCAPE|EXCEPT|EXCLUSIVE|EXCLUDE|EXISTS|EXPLAIN|FAIL|FILTER|FIRST|FOLLOWING|FOR|FOREIGN|FROM|FULL|GENERATED|GLOB|GROUP|GROUPS|HAVING|IF|IGNORE|IMMEDIATE|IN|INDEX|INDEXED|INITIALLY|INNER|INSERT|INSTEAD|INTERSECT|INTO|IS|ISNULL|JOIN|KEY|LAST|LEFT|LIKE|LIMIT|MATCH|MATERIALIZED|NATURAL|NO|NOT|NOTHING|NOTNULL|NULL|NULLS|OF|OFFSET|ON|OR|ORDER|OTHERS|OUTER|OVER|PARTITION|PLAN|PRAGMA|PRECEDING|PRIMARY|QUERY|RAISE|RANGE|RECURSIVE|REFERENCES|REGEXP|REINDEX|RELEASE|RENAME|REPLACE|RESTRICT|RETURNING|RIGHT|ROLLBACK|ROW|ROWS|SAVEPOINT|SELECT|SET|TABLE|TEMP|TEMPORARY|THEN|TIES|TO|TRANSACTION|TRIGGER|UNBOUNDED|UNION|UNIQUE|UPDATE|USING|VACUUM|VALUES|VIEW|VIRTUAL|WHEN|WHERE|WINDOW|WITH|WITHOUT)(?=\s+|-|\(|\)|;|\+|\*|\/|%|==|=|<=|<>|<<|<|>=|>>|>|!=|,|&|~|\|\||\||\.)/,
	  id: /"[^"]*(?:""[^"]*)*"|`[^`]*(?:``[^`]*)*`|\[[^[\]]*\]|[a-z_][a-z0-9_$]*/,
	  string: /'[^']*(?:''[^']*)*'/,
	  blob: /x'(?:[0-9a-f][0-9a-f])+'/,
	  numeric: /(?:\d+(?:\.\d*)?|\.\d+)(?:e(?:\+|-)?\d+)?|0x[0-9a-f]+/,
	  variable: /\?\d*|[@$:][a-z0-9_$]+/,
	  operator: /-|\(|\)|;|\+|\*|\/|%|==|=|<=|<>|<<|<|>=|>>|>|!=|,|&|~|\|\||\||\./,
	  _ws: /\s+/,
	};

	function parseCreateTable(sql) {
	  const result = createTable({ input: tokenize(sql, TOKENS) });

	  if (!result.success) {
	    throw new Error(
	      `Parsing CREATE TABLE failed at [${result.input
	        .slice(result.index)
	        .map((t) => t.text)
	        .join(' ')}] of "${sql}"`
	    );
	  }

	  return result.ast;
	}

	function parseCreateIndex(sql) {
	  const result = createIndex({ input: tokenize(sql, TOKENS) });

	  if (!result.success) {
	    throw new Error(
	      `Parsing CREATE INDEX failed at [${result.input
	        .slice(result.index)
	        .map((t) => t.text)
	        .join(' ')}] of "${sql}"`
	    );
	  }

	  return result.ast;
	}

	function createTable(ctx) {
	  return s(
	    [
	      t({ text: 'CREATE' }, (v) => null),
	      temporary,
	      t({ text: 'TABLE' }, (v) => null),
	      exists,
	      schema,
	      table,
	      t({ text: '(' }, (v) => null),
	      columnDefinitionList,
	      tableConstraintList,
	      t({ text: ')' }, (v) => null),
	      rowid,
	      f,
	    ],
	    (v) => Object.assign({}, ...v.filter((x) => x !== null))
	  )(ctx);
	}

	function temporary(ctx) {
	  return a([t({ text: 'TEMP' }), t({ text: 'TEMPORARY' }), e], (v) => ({
	    temporary: v !== null,
	  }))(ctx);
	}

	function rowid(ctx) {
	  return o(s([t({ text: 'WITHOUT' }), t({ text: 'ROWID' })]), (v) => ({
	    rowid: v !== null,
	  }))(ctx);
	}

	function columnDefinitionList(ctx) {
	  return a([
	    s([columnDefinition, t({ text: ',' }), columnDefinitionList], (v) => ({
	      columns: [v[0]].concat(v[2].columns),
	    })),
	    s([columnDefinition], (v) => ({ columns: [v[0]] })),
	  ])(ctx);
	}

	function columnDefinition(ctx) {
	  return s(
	    [s([identifier], (v) => ({ name: v[0] })), typeName, columnConstraintList],
	    (v) => Object.assign({}, ...v)
	  )(ctx);
	}

	function typeName(ctx) {
	  return o(
	    s(
	      [
	        m(t({ type: 'id' })),
	        a([
	          s(
	            [
	              t({ text: '(' }),
	              signedNumber,
	              t({ text: ',' }),
	              signedNumber,
	              t({ text: ')' }),
	            ],
	            (v) => `(${v[1]}, ${v[3]})`
	          ),
	          s(
	            [t({ text: '(' }), signedNumber, t({ text: ')' })],
	            (v) => `(${v[1]})`
	          ),
	          e,
	        ]),
	      ],
	      (v) => `${v[0].join(' ')}${v[1] || ''}`
	    ),
	    (v) => ({ type: v })
	  )(ctx);
	}

	function columnConstraintList(ctx) {
	  return o(m(columnConstraint), (v) => ({
	    constraints: Object.assign(
	      {
	        primary: null,
	        notnull: null,
	        null: null,
	        unique: null,
	        check: null,
	        default: null,
	        collate: null,
	        references: null,
	        as: null,
	      },
	      ...(v || [])
	    ),
	  }))(ctx);
	}

	function columnConstraint(ctx) {
	  return a([
	    primaryColumnConstraint,
	    notnullColumnConstraint,
	    nullColumnConstraint,
	    uniqueColumnConstraint,
	    checkColumnConstraint,
	    defaultColumnConstraint,
	    collateColumnConstraint,
	    referencesColumnConstraint,
	    asColumnConstraint,
	  ])(ctx);
	}

	function primaryColumnConstraint(ctx) {
	  return s(
	    [
	      constraintName,
	      t({ text: 'PRIMARY' }, (v) => null),
	      t({ text: 'KEY' }, (v) => null),
	      order,
	      conflictClause,
	      autoincrement,
	    ],
	    (v) => ({ primary: Object.assign({}, ...v.filter((x) => x !== null)) })
	  )(ctx);
	}

	function autoincrement(ctx) {
	  return o(t({ text: 'AUTOINCREMENT' }), (v) => ({
	    autoincrement: v !== null,
	  }))(ctx);
	}

	function notnullColumnConstraint(ctx) {
	  return s(
	    [
	      constraintName,
	      t({ text: 'NOT' }, (v) => null),
	      t({ text: 'NULL' }, (v) => null),
	      conflictClause,
	    ],
	    (v) => ({ notnull: Object.assign({}, ...v.filter((x) => x !== null)) })
	  )(ctx);
	}

	function nullColumnConstraint(ctx) {
	  return s(
	    [constraintName, t({ text: 'NULL' }, (v) => null), conflictClause],
	    (v) => ({ null: Object.assign({}, ...v.filter((x) => x !== null)) })
	  )(ctx);
	}

	function uniqueColumnConstraint(ctx) {
	  return s(
	    [constraintName, t({ text: 'UNIQUE' }, (v) => null), conflictClause],
	    (v) => ({ unique: Object.assign({}, ...v.filter((x) => x !== null)) })
	  )(ctx);
	}

	function checkColumnConstraint(ctx) {
	  return s(
	    [
	      constraintName,
	      t({ text: 'CHECK' }, (v) => null),
	      t({ text: '(' }, (v) => null),
	      s([expression], (v) => ({ expression: v[0] })),
	      t({ text: ')' }, (v) => null),
	    ],
	    (v) => ({ check: Object.assign({}, ...v.filter((x) => x !== null)) })
	  )(ctx);
	}

	function defaultColumnConstraint(ctx) {
	  return s(
	    [
	      constraintName,
	      t({ text: 'DEFAULT' }, (v) => null),
	      a([
	        s([t({ text: '(' }), expression, t({ text: ')' })], (v) => ({
	          value: v[1],
	          expression: true,
	        })),
	        s([literalValue], (v) => ({ value: v[0], expression: false })),
	        s([signedNumber], (v) => ({ value: v[0], expression: false })),
	      ]),
	    ],
	    (v) => ({ default: Object.assign({}, ...v.filter((x) => x !== null)) })
	  )(ctx);
	}

	function collateColumnConstraint(ctx) {
	  return s(
	    [
	      constraintName,
	      t({ text: 'COLLATE' }, (v) => null),
	      t({ type: 'id' }, (v) => ({ collation: v.text })),
	    ],
	    (v) => ({ collate: Object.assign({}, ...v.filter((x) => x !== null)) })
	  )(ctx);
	}

	function referencesColumnConstraint(ctx) {
	  return s(
	    [constraintName, s([foreignKeyClause], (v) => v[0].references)],
	    (v) => ({
	      references: Object.assign({}, ...v.filter((x) => x !== null)),
	    })
	  )(ctx);
	}

	function asColumnConstraint(ctx) {
	  return s(
	    [
	      constraintName,
	      o(s([t({ text: 'GENERATED' }), t({ text: 'ALWAYS' })]), (v) => ({
	        generated: v !== null,
	      })),
	      t({ text: 'AS' }, (v) => null),
	      t({ text: '(' }, (v) => null),
	      s([expression], (v) => ({ expression: v[0] })),
	      t({ text: ')' }, (v) => null),
	      a([t({ text: 'STORED' }), t({ text: 'VIRTUAL' }), e], (v) => ({
	        mode: v ? v.toUpperCase() : null,
	      })),
	    ],
	    (v) => ({ as: Object.assign({}, ...v.filter((x) => x !== null)) })
	  )(ctx);
	}

	function tableConstraintList(ctx) {
	  return o(m(s([t({ text: ',' }), tableConstraint], (v) => v[1])), (v) => ({
	    constraints: v || [],
	  }))(ctx);
	}

	function tableConstraint(ctx) {
	  return a([
	    primaryTableConstraint,
	    uniqueTableConstraint,
	    checkTableConstraint,
	    foreignTableConstraint,
	  ])(ctx);
	}

	function primaryTableConstraint(ctx) {
	  return s(
	    [
	      constraintName,
	      t({ text: 'PRIMARY' }, (v) => null),
	      t({ text: 'KEY' }, (v) => null),
	      t({ text: '(' }, (v) => null),
	      indexedColumnList,
	      t({ text: ')' }, (v) => null),
	      conflictClause,
	    ],
	    (v) =>
	      Object.assign({ type: 'PRIMARY KEY' }, ...v.filter((x) => x !== null))
	  )(ctx);
	}

	function uniqueTableConstraint(ctx) {
	  return s(
	    [
	      constraintName,
	      t({ text: 'UNIQUE' }, (v) => null),
	      t({ text: '(' }, (v) => null),
	      indexedColumnList,
	      t({ text: ')' }, (v) => null),
	      conflictClause,
	    ],
	    (v) => Object.assign({ type: 'UNIQUE' }, ...v.filter((x) => x !== null))
	  )(ctx);
	}

	function conflictClause(ctx) {
	  return o(
	    s(
	      [
	        t({ text: 'ON' }),
	        t({ text: 'CONFLICT' }),
	        a([
	          t({ text: 'ROLLBACK' }),
	          t({ text: 'ABORT' }),
	          t({ text: 'FAIL' }),
	          t({ text: 'IGNORE' }),
	          t({ text: 'REPLACE' }),
	        ]),
	      ],
	      (v) => v[2]
	    ),
	    (v) => ({ conflict: v ? v.toUpperCase() : null })
	  )(ctx);
	}

	function checkTableConstraint(ctx) {
	  return s(
	    [
	      constraintName,
	      t({ text: 'CHECK' }, (v) => null),
	      t({ text: '(' }, (v) => null),
	      s([expression], (v) => ({ expression: v[0] })),
	      t({ text: ')' }, (v) => null),
	    ],
	    (v) => Object.assign({ type: 'CHECK' }, ...v.filter((x) => x !== null))
	  )(ctx);
	}

	function foreignTableConstraint(ctx) {
	  return s(
	    [
	      constraintName,
	      t({ text: 'FOREIGN' }, (v) => null),
	      t({ text: 'KEY' }, (v) => null),
	      t({ text: '(' }, (v) => null),
	      columnNameList,
	      t({ text: ')' }, (v) => null),
	      foreignKeyClause,
	    ],
	    (v) =>
	      Object.assign({ type: 'FOREIGN KEY' }, ...v.filter((x) => x !== null))
	  )(ctx);
	}

	function foreignKeyClause(ctx) {
	  return s(
	    [
	      t({ text: 'REFERENCES' }, (v) => null),
	      table,
	      columnNameListOptional,
	      o(m(a([deleteReference, updateReference, matchReference])), (v) =>
	        Object.assign({ delete: null, update: null, match: null }, ...(v || []))
	      ),
	      deferrable,
	    ],
	    (v) => ({ references: Object.assign({}, ...v.filter((x) => x !== null)) })
	  )(ctx);
	}

	function columnNameListOptional(ctx) {
	  return o(
	    s([t({ text: '(' }), columnNameList, t({ text: ')' })], (v) => v[1]),
	    (v) => ({ columns: v ? v.columns : [] })
	  )(ctx);
	}

	function columnNameList(ctx) {
	  return s(
	    [
	      o(m(s([identifier, t({ text: ',' })], (v) => v[0])), (v) =>
	        v !== null ? v : []
	      ),
	      identifier,
	    ],
	    (v) => ({ columns: v[0].concat([v[1]]) })
	  )(ctx);
	}

	function deleteReference(ctx) {
	  return s([t({ text: 'ON' }), t({ text: 'DELETE' }), onAction], (v) => ({
	    delete: v[2],
	  }))(ctx);
	}

	function updateReference(ctx) {
	  return s([t({ text: 'ON' }), t({ text: 'UPDATE' }), onAction], (v) => ({
	    update: v[2],
	  }))(ctx);
	}

	function matchReference(ctx) {
	  return s(
	    [t({ text: 'MATCH' }), a([t({ type: 'keyword' }), t({ type: 'id' })])],
	    (v) => ({ match: v[1] })
	  )(ctx);
	}

	function deferrable(ctx) {
	  return o(
	    s([
	      o(t({ text: 'NOT' })),
	      t({ text: 'DEFERRABLE' }),
	      o(
	        s(
	          [
	            t({ text: 'INITIALLY' }),
	            a([t({ text: 'DEFERRED' }), t({ text: 'IMMEDIATE' })]),
	          ],
	          (v) => v[1].toUpperCase()
	        )
	      ),
	    ]),
	    (v) => ({ deferrable: v ? { not: v[0] !== null, initially: v[2] } : null })
	  )(ctx);
	}

	function constraintName(ctx) {
	  return o(
	    s([t({ text: 'CONSTRAINT' }), identifier], (v) => v[1]),
	    (v) => ({ name: v })
	  )(ctx);
	}

	function createIndex(ctx) {
	  return s(
	    [
	      t({ text: 'CREATE' }, (v) => null),
	      unique,
	      t({ text: 'INDEX' }, (v) => null),
	      exists,
	      schema,
	      index,
	      t({ text: 'ON' }, (v) => null),
	      table,
	      t({ text: '(' }, (v) => null),
	      indexedColumnList,
	      t({ text: ')' }, (v) => null),
	      where,
	      f,
	    ],
	    (v) => Object.assign({}, ...v.filter((x) => x !== null))
	  )(ctx);
	}

	function unique(ctx) {
	  return o(t({ text: 'UNIQUE' }), (v) => ({ unique: v !== null }))(ctx);
	}

	function exists(ctx) {
	  return o(
	    s([t({ text: 'IF' }), t({ text: 'NOT' }), t({ text: 'EXISTS' })]),
	    (v) => ({ exists: v !== null })
	  )(ctx);
	}

	function schema(ctx) {
	  return o(
	    s([identifier, t({ text: '.' })], (v) => v[0]),
	    (v) => ({ schema: v })
	  )(ctx);
	}

	function index(ctx) {
	  return s([identifier], (v) => ({ index: v[0] }))(ctx);
	}

	function table(ctx) {
	  return s([identifier], (v) => ({ table: v[0] }))(ctx);
	}

	function where(ctx) {
	  return o(
	    s([t({ text: 'WHERE' }), expression], (v) => v[1]),
	    (v) => ({ where: v })
	  )(ctx);
	}

	function indexedColumnList(ctx) {
	  return a([
	    s([indexedColumn, t({ text: ',' }), indexedColumnList], (v) => ({
	      columns: [v[0]].concat(v[2].columns),
	    })),
	    s([indexedColumnExpression, t({ text: ',' }), indexedColumnList], (v) => ({
	      columns: [v[0]].concat(v[2].columns),
	    })),
	    l({ do: indexedColumn, next: t({ text: ')' }) }, (v) => ({
	      columns: [v],
	    })),
	    l({ do: indexedColumnExpression, next: t({ text: ')' }) }, (v) => ({
	      columns: [v],
	    })),
	  ])(ctx);
	}

	function indexedColumn(ctx) {
	  return s(
	    [
	      s([identifier], (v) => ({ name: v[0], expression: false })),
	      collation,
	      order,
	    ],
	    (v) => Object.assign({}, ...v.filter((x) => x !== null))
	  )(ctx);
	}

	function indexedColumnExpression(ctx) {
	  return s(
	    [
	      s([indexedExpression], (v) => ({ name: v[0], expression: true })),
	      collation,
	      order,
	    ],
	    (v) => Object.assign({}, ...v.filter((x) => x !== null))
	  )(ctx);
	}

	function collation(ctx) {
	  return o(
	    s([t({ text: 'COLLATE' }), t({ type: 'id' })], (v) => v[1]),
	    (v) => ({ collation: v })
	  )(ctx);
	}

	function order(ctx) {
	  return a([t({ text: 'ASC' }), t({ text: 'DESC' }), e], (v) => ({
	    order: v ? v.toUpperCase() : null,
	  }))(ctx);
	}

	function indexedExpression(ctx) {
	  return m(
	    a([
	      n({
	        do: t({ type: 'keyword' }),
	        not: a([
	          t({ text: 'COLLATE' }),
	          t({ text: 'ASC' }),
	          t({ text: 'DESC' }),
	        ]),
	      }),
	      t({ type: 'id' }),
	      t({ type: 'string' }),
	      t({ type: 'blob' }),
	      t({ type: 'numeric' }),
	      t({ type: 'variable' }),
	      n({
	        do: t({ type: 'operator' }),
	        not: a([t({ text: '(' }), t({ text: ')' }), t({ text: ',' })]),
	      }),
	      s([t({ text: '(' }), o(expression), t({ text: ')' })], (v) => v[1] || []),
	    ])
	  )(ctx);
	}

	function expression(ctx) {
	  return m(
	    a([
	      t({ type: 'keyword' }),
	      t({ type: 'id' }),
	      t({ type: 'string' }),
	      t({ type: 'blob' }),
	      t({ type: 'numeric' }),
	      t({ type: 'variable' }),
	      n({
	        do: t({ type: 'operator' }),
	        not: a([t({ text: '(' }), t({ text: ')' })]),
	      }),
	      s([t({ text: '(' }), o(expression), t({ text: ')' })], (v) => v[1] || []),
	    ])
	  )(ctx);
	}

	function identifier(ctx) {
	  return a([t({ type: 'id' }), t({ type: 'string' })], (v) =>
	    /^["`['][^]*["`\]']$/.test(v) ? v.substring(1, v.length - 1) : v
	  )(ctx);
	}

	function onAction(ctx) {
	  return a(
	    [
	      s([t({ text: 'SET' }), t({ text: 'NULL' })], (v) => `${v[0]} ${v[1]}`),
	      s([t({ text: 'SET' }), t({ text: 'DEFAULT' })], (v) => `${v[0]} ${v[1]}`),
	      t({ text: 'CASCADE' }),
	      t({ text: 'RESTRICT' }),
	      s([t({ text: 'NO' }), t({ text: 'ACTION' })], (v) => `${v[0]} ${v[1]}`),
	    ],
	    (v) => v.toUpperCase()
	  )(ctx);
	}

	function literalValue(ctx) {
	  return a([
	    t({ type: 'numeric' }),
	    t({ type: 'string' }),
	    t({ type: 'id' }),
	    t({ type: 'blob' }),
	    t({ text: 'NULL' }),
	    t({ text: 'TRUE' }),
	    t({ text: 'FALSE' }),
	    t({ text: 'CURRENT_TIME' }),
	    t({ text: 'CURRENT_DATE' }),
	    t({ text: 'CURRENT_TIMESTAMP' }),
	  ])(ctx);
	}

	function signedNumber(ctx) {
	  return s(
	    [a([t({ text: '+' }), t({ text: '-' }), e]), t({ type: 'numeric' })],
	    (v) => `${v[0] || ''}${v[1]}`
	  )(ctx);
	}

	parser$1 = {
	  parseCreateTable,
	  parseCreateIndex,
	};
	return parser$1;
}

var compiler;
var hasRequiredCompiler;

function requireCompiler () {
	if (hasRequiredCompiler) return compiler;
	hasRequiredCompiler = 1;
	function compileCreateTable(ast, wrap = (v) => v) {
	  return createTable(ast, wrap);
	}

	function compileCreateIndex(ast, wrap = (v) => v) {
	  return createIndex(ast, wrap);
	}

	function createTable(ast, wrap) {
	  return `CREATE${temporary(ast)} TABLE${exists(ast)} ${schema(
	    ast,
	    wrap
	  )}${table(ast, wrap)} (${columnDefinitionList(
	    ast,
	    wrap
	  )}${tableConstraintList(ast, wrap)})${rowid(ast)}`;
	}

	function temporary(ast, wrap) {
	  return ast.temporary ? ' TEMP' : '';
	}

	function rowid(ast, wrap) {
	  return ast.rowid ? ' WITHOUT ROWID' : '';
	}

	function columnDefinitionList(ast, wrap) {
	  return ast.columns.map((column) => columnDefinition(column, wrap)).join(', ');
	}

	function columnDefinition(ast, wrap) {
	  return `${identifier(ast.name, wrap)}${typeName(
	    ast)}${columnConstraintList(ast.constraints, wrap)}`;
	}

	function typeName(ast, wrap) {
	  return ast.type !== null ? ` ${ast.type}` : '';
	}

	function columnConstraintList(ast, wrap) {
	  return `${primaryColumnConstraint(ast, wrap)}${notnullColumnConstraint(
	    ast,
	    wrap
	  )}${nullColumnConstraint(ast, wrap)}${uniqueColumnConstraint(
	    ast,
	    wrap
	  )}${checkColumnConstraint(ast, wrap)}${defaultColumnConstraint(
	    ast,
	    wrap
	  )}${collateColumnConstraint(ast, wrap)}${referencesColumnConstraint(
	    ast,
	    wrap
	  )}${asColumnConstraint(ast, wrap)}`;
	}

	function primaryColumnConstraint(ast, wrap) {
	  return ast.primary !== null
	    ? ` ${constraintName(ast.primary, wrap)}PRIMARY KEY${order(
	        ast.primary)}${conflictClause(ast.primary)}${autoincrement(ast.primary)}`
	    : '';
	}

	function autoincrement(ast, wrap) {
	  return ast.autoincrement ? ' AUTOINCREMENT' : '';
	}

	function notnullColumnConstraint(ast, wrap) {
	  return ast.notnull !== null
	    ? ` ${constraintName(ast.notnull, wrap)}NOT NULL${conflictClause(
	        ast.notnull)}`
	    : '';
	}

	function nullColumnConstraint(ast, wrap) {
	  return ast.null !== null
	    ? ` ${constraintName(ast.null, wrap)}NULL${conflictClause(ast.null)}`
	    : '';
	}

	function uniqueColumnConstraint(ast, wrap) {
	  return ast.unique !== null
	    ? ` ${constraintName(ast.unique, wrap)}UNIQUE${conflictClause(
	        ast.unique)}`
	    : '';
	}

	function checkColumnConstraint(ast, wrap) {
	  return ast.check !== null
	    ? ` ${constraintName(ast.check, wrap)}CHECK (${expression(
	        ast.check.expression)})`
	    : '';
	}

	function defaultColumnConstraint(ast, wrap) {
	  return ast.default !== null
	    ? ` ${constraintName(ast.default, wrap)}DEFAULT ${
	        !ast.default.expression
	          ? ast.default.value
	          : `(${expression(ast.default.value)})`
	      }`
	    : '';
	}

	function collateColumnConstraint(ast, wrap) {
	  return ast.collate !== null
	    ? ` ${constraintName(ast.collate, wrap)}COLLATE ${ast.collate.collation}`
	    : '';
	}

	function referencesColumnConstraint(ast, wrap) {
	  return ast.references !== null
	    ? ` ${constraintName(ast.references, wrap)}${foreignKeyClause(
	        ast.references,
	        wrap
	      )}`
	    : '';
	}

	function asColumnConstraint(ast, wrap) {
	  return ast.as !== null
	    ? ` ${constraintName(ast.as, wrap)}${
	        ast.as.generated ? 'GENERATED ALWAYS ' : ''
	      }AS (${expression(ast.as.expression)})${
	        ast.as.mode !== null ? ` ${ast.as.mode}` : ''
	      }`
	    : '';
	}

	function tableConstraintList(ast, wrap) {
	  return ast.constraints.reduce(
	    (constraintList, constraint) =>
	      `${constraintList}, ${tableConstraint(constraint, wrap)}`,
	    ''
	  );
	}

	function tableConstraint(ast, wrap) {
	  switch (ast.type) {
	    case 'PRIMARY KEY':
	      return primaryTableConstraint(ast, wrap);
	    case 'UNIQUE':
	      return uniqueTableConstraint(ast, wrap);
	    case 'CHECK':
	      return checkTableConstraint(ast, wrap);
	    case 'FOREIGN KEY':
	      return foreignTableConstraint(ast, wrap);
	  }
	}

	function primaryTableConstraint(ast, wrap) {
	  return `${constraintName(ast, wrap)}PRIMARY KEY (${indexedColumnList(
	    ast,
	    wrap
	  )})${conflictClause(ast)}`;
	}

	function uniqueTableConstraint(ast, wrap) {
	  return `${constraintName(ast, wrap)}UNIQUE (${indexedColumnList(
	    ast,
	    wrap
	  )})${conflictClause(ast)}`;
	}

	function conflictClause(ast, wrap) {
	  return ast.conflict !== null ? ` ON CONFLICT ${ast.conflict}` : '';
	}

	function checkTableConstraint(ast, wrap) {
	  return `${constraintName(ast, wrap)}CHECK (${expression(
	    ast.expression)})`;
	}

	function foreignTableConstraint(ast, wrap) {
	  return `${constraintName(ast, wrap)}FOREIGN KEY (${columnNameList(
	    ast,
	    wrap
	  )}) ${foreignKeyClause(ast.references, wrap)}`;
	}

	function foreignKeyClause(ast, wrap) {
	  return `REFERENCES ${table(ast, wrap)}${columnNameListOptional(
	    ast,
	    wrap
	  )}${deleteUpdateMatchList(ast)}${deferrable(ast.deferrable)}`;
	}

	function columnNameListOptional(ast, wrap) {
	  return ast.columns.length > 0 ? ` (${columnNameList(ast, wrap)})` : '';
	}

	function columnNameList(ast, wrap) {
	  return ast.columns.map((column) => identifier(column, wrap)).join(', ');
	}

	function deleteUpdateMatchList(ast, wrap) {
	  return `${deleteReference(ast)}${updateReference(
	    ast)}${matchReference(ast)}`;
	}

	function deleteReference(ast, wrap) {
	  return ast.delete !== null ? ` ON DELETE ${ast.delete}` : '';
	}

	function updateReference(ast, wrap) {
	  return ast.update !== null ? ` ON UPDATE ${ast.update}` : '';
	}

	function matchReference(ast, wrap) {
	  return ast.match !== null ? ` MATCH ${ast.match}` : '';
	}

	function deferrable(ast, wrap) {
	  return ast !== null
	    ? ` ${ast.not ? 'NOT ' : ''}DEFERRABLE${
	        ast.initially !== null ? ` INITIALLY ${ast.initially}` : ''
	      }`
	    : '';
	}

	function constraintName(ast, wrap) {
	  return ast.name !== null ? `CONSTRAINT ${identifier(ast.name, wrap)} ` : '';
	}

	function createIndex(ast, wrap) {
	  return `CREATE${unique(ast)} INDEX${exists(ast)} ${schema(
	    ast,
	    wrap
	  )}${index(ast, wrap)} on ${table(ast, wrap)} (${indexedColumnList(
	    ast,
	    wrap
	  )})${where(ast)}`;
	}

	function unique(ast, wrap) {
	  return ast.unique ? ' UNIQUE' : '';
	}

	function exists(ast, wrap) {
	  return ast.exists ? ' IF NOT EXISTS' : '';
	}

	function schema(ast, wrap) {
	  return ast.schema !== null ? `${identifier(ast.schema, wrap)}.` : '';
	}

	function index(ast, wrap) {
	  return identifier(ast.index, wrap);
	}

	function table(ast, wrap) {
	  return identifier(ast.table, wrap);
	}

	function where(ast, wrap) {
	  return ast.where !== null ? ` where ${expression(ast.where)}` : '';
	}

	function indexedColumnList(ast, wrap) {
	  return ast.columns
	    .map((column) =>
	      !column.expression
	        ? indexedColumn(column, wrap)
	        : indexedColumnExpression(column)
	    )
	    .join(', ');
	}

	function indexedColumn(ast, wrap) {
	  return `${identifier(ast.name, wrap)}${collation(ast)}${order(
	    ast)}`;
	}

	function indexedColumnExpression(ast, wrap) {
	  return `${indexedExpression(ast.name)}${collation(ast)}${order(
	    ast)}`;
	}

	function collation(ast, wrap) {
	  return ast.collation !== null ? ` COLLATE ${ast.collation}` : '';
	}

	function order(ast, wrap) {
	  return ast.order !== null ? ` ${ast.order}` : '';
	}

	function indexedExpression(ast, wrap) {
	  return expression(ast);
	}

	function expression(ast, wrap) {
	  return ast.reduce(
	    (expr, e) =>
	      Array.isArray(e)
	        ? `${expr}(${expression(e)})`
	        : !expr
	        ? e
	        : `${expr} ${e}`,
	    ''
	  );
	}

	function identifier(ast, wrap) {
	  return wrap(ast);
	}

	compiler = {
	  compileCreateTable,
	  compileCreateIndex,
	};
	return compiler;
}

var utils$6;
var hasRequiredUtils$2;

function requireUtils$2 () {
	if (hasRequiredUtils$2) return utils$6;
	hasRequiredUtils$2 = 1;
	function isEqualId(first, second) {
	  return first.toLowerCase() === second.toLowerCase();
	}

	function includesId(list, id) {
	  return list.some((item) => isEqualId(item, id));
	}

	utils$6 = {
	  isEqualId,
	  includesId,
	};
	return utils$6;
}

var ddl;
var hasRequiredDdl;

function requireDdl () {
	if (hasRequiredDdl) return ddl;
	hasRequiredDdl = 1;
	// SQLite3_DDL
	//
	// All of the SQLite3 specific DDL helpers for renaming/dropping
	// columns and changing datatypes.
	// -------

	const identity = require$$2$4;
	const { nanonum } = nanoid_1;
	const {
	  copyData,
	  dropOriginal,
	  renameTable,
	  getTableSql,
	  isForeignCheckEnabled,
	  setForeignCheck,
	  executeForeignCheck,
	} = /*@__PURE__*/ requireSqliteDdlOperations();
	const { parseCreateTable, parseCreateIndex } = /*@__PURE__*/ requireParser();
	const {
	  compileCreateTable,
	  compileCreateIndex,
	} = /*@__PURE__*/ requireCompiler();
	const { isEqualId, includesId } = /*@__PURE__*/ requireUtils$2();

	// So altering the schema in SQLite3 is a major pain.
	// We have our own object to deal with the renaming and altering the types
	// for sqlite3 things.
	class SQLite3_DDL {
	  constructor(client, tableCompiler, pragma, connection) {
	    this.client = client;
	    this.tableCompiler = tableCompiler;
	    this.pragma = pragma;
	    this.tableNameRaw = this.tableCompiler.tableNameRaw;
	    this.alteredName = `_knex_temp_alter${nanonum(3)}`;
	    this.connection = connection;
	    this.formatter = (value) =>
	      this.client.customWrapIdentifier(value, identity);
	    this.wrap = (value) => this.client.wrapIdentifierImpl(value);
	  }

	  tableName() {
	    return this.formatter(this.tableNameRaw);
	  }

	  getTableSql() {
	    const tableName = this.tableName();

	    return this.client.transaction(
	      async (trx) => {
	        trx.disableProcessing();
	        const result = await trx.raw(getTableSql(tableName));
	        trx.enableProcessing();

	        return {
	          createTable: result.filter((create) => create.type === 'table')[0]
	            .sql,
	          createIndices: result
	            .filter((create) => create.type === 'index')
	            .map((create) => create.sql),
	        };
	      },
	      { connection: this.connection }
	    );
	  }

	  async isForeignCheckEnabled() {
	    const result = await this.client
	      .raw(isForeignCheckEnabled())
	      .connection(this.connection);

	    return result[0].foreign_keys === 1;
	  }

	  async setForeignCheck(enable) {
	    await this.client.raw(setForeignCheck(enable)).connection(this.connection);
	  }

	  renameTable(trx) {
	    return trx.raw(renameTable(this.alteredName, this.tableName()));
	  }

	  dropOriginal(trx) {
	    return trx.raw(dropOriginal(this.tableName()));
	  }

	  copyData(trx, columns) {
	    return trx.raw(copyData(this.tableName(), this.alteredName, columns));
	  }

	  async alterColumn(columns) {
	    const { createTable, createIndices } = await this.getTableSql();

	    const parsedTable = parseCreateTable(createTable);
	    parsedTable.table = this.alteredName;

	    parsedTable.columns = parsedTable.columns.map((column) => {
	      const newColumnInfo = columns.find((c) => isEqualId(c.name, column.name));

	      if (newColumnInfo) {
	        column.type = newColumnInfo.type;

	        column.constraints.default =
	          newColumnInfo.defaultTo !== null
	            ? {
	                name: null,
	                value: newColumnInfo.defaultTo,
	                expression: false,
	              }
	            : null;

	        column.constraints.notnull = newColumnInfo.notNull
	          ? { name: null, conflict: null }
	          : null;

	        column.constraints.null = newColumnInfo.notNull
	          ? null
	          : column.constraints.null;
	      }

	      return column;
	    });

	    const newTable = compileCreateTable(parsedTable, this.wrap);

	    return this.generateAlterCommands(newTable, createIndices);
	  }

	  async dropColumn(columns) {
	    const { createTable, createIndices } = await this.getTableSql();

	    const parsedTable = parseCreateTable(createTable);
	    parsedTable.table = this.alteredName;

	    parsedTable.columns = parsedTable.columns.filter(
	      (parsedColumn) =>
	        parsedColumn.expression || !includesId(columns, parsedColumn.name)
	    );

	    if (parsedTable.columns.length === 0) {
	      throw new Error('Unable to drop last column from table');
	    }

	    parsedTable.constraints = parsedTable.constraints.filter((constraint) => {
	      if (constraint.type === 'PRIMARY KEY' || constraint.type === 'UNIQUE') {
	        return constraint.columns.every(
	          (constraintColumn) =>
	            constraintColumn.expression ||
	            !includesId(columns, constraintColumn.name)
	        );
	      } else if (constraint.type === 'FOREIGN KEY') {
	        return (
	          constraint.columns.every(
	            (constraintColumnName) => !includesId(columns, constraintColumnName)
	          ) &&
	          (constraint.references.table !== parsedTable.table ||
	            constraint.references.columns.every(
	              (referenceColumnName) => !includesId(columns, referenceColumnName)
	            ))
	        );
	      } else {
	        return true;
	      }
	    });

	    const newColumns = parsedTable.columns.map((column) => column.name);

	    const newTable = compileCreateTable(parsedTable, this.wrap);

	    const newIndices = [];
	    for (const createIndex of createIndices) {
	      const parsedIndex = parseCreateIndex(createIndex);

	      parsedIndex.columns = parsedIndex.columns.filter(
	        (parsedColumn) =>
	          parsedColumn.expression || !includesId(columns, parsedColumn.name)
	      );

	      if (parsedIndex.columns.length > 0) {
	        newIndices.push(compileCreateIndex(parsedIndex, this.wrap));
	      }
	    }

	    return this.alter(newTable, newIndices, newColumns);
	  }

	  async dropForeign(columns, foreignKeyName) {
	    const { createTable, createIndices } = await this.getTableSql();

	    const parsedTable = parseCreateTable(createTable);
	    parsedTable.table = this.alteredName;

	    if (!foreignKeyName) {
	      parsedTable.columns = parsedTable.columns.map((column) => ({
	        ...column,
	        references: includesId(columns, column.name) ? null : column.references,
	      }));
	    }

	    parsedTable.constraints = parsedTable.constraints.filter((constraint) => {
	      if (constraint.type === 'FOREIGN KEY') {
	        if (foreignKeyName) {
	          return (
	            !constraint.name || !isEqualId(constraint.name, foreignKeyName)
	          );
	        }

	        return constraint.columns.every(
	          (constraintColumnName) => !includesId(columns, constraintColumnName)
	        );
	      } else {
	        return true;
	      }
	    });

	    const newTable = compileCreateTable(parsedTable, this.wrap);

	    return this.alter(newTable, createIndices);
	  }

	  async dropPrimary(constraintName) {
	    const { createTable, createIndices } = await this.getTableSql();

	    const parsedTable = parseCreateTable(createTable);
	    parsedTable.table = this.alteredName;

	    parsedTable.columns = parsedTable.columns.map((column) => ({
	      ...column,
	      primary: null,
	    }));

	    parsedTable.constraints = parsedTable.constraints.filter((constraint) => {
	      if (constraint.type === 'PRIMARY KEY') {
	        if (constraintName) {
	          return (
	            !constraint.name || !isEqualId(constraint.name, constraintName)
	          );
	        } else {
	          return false;
	        }
	      } else {
	        return true;
	      }
	    });

	    const newTable = compileCreateTable(parsedTable, this.wrap);

	    return this.alter(newTable, createIndices);
	  }

	  async primary(columns, constraintName) {
	    const { createTable, createIndices } = await this.getTableSql();

	    const parsedTable = parseCreateTable(createTable);
	    parsedTable.table = this.alteredName;

	    parsedTable.columns = parsedTable.columns.map((column) => ({
	      ...column,
	      primary: null,
	    }));

	    parsedTable.constraints = parsedTable.constraints.filter(
	      (constraint) => constraint.type !== 'PRIMARY KEY'
	    );

	    parsedTable.constraints.push({
	      type: 'PRIMARY KEY',
	      name: constraintName || null,
	      columns: columns.map((column) => ({
	        name: column,
	        expression: false,
	        collation: null,
	        order: null,
	      })),
	      conflict: null,
	    });

	    const newTable = compileCreateTable(parsedTable, this.wrap);

	    return this.alter(newTable, createIndices);
	  }

	  async foreign(foreignInfo) {
	    const { createTable, createIndices } = await this.getTableSql();

	    const parsedTable = parseCreateTable(createTable);
	    parsedTable.table = this.alteredName;

	    parsedTable.constraints.push({
	      type: 'FOREIGN KEY',
	      name: foreignInfo.keyName || null,
	      columns: foreignInfo.column,
	      references: {
	        table: foreignInfo.inTable,
	        columns: foreignInfo.references,
	        delete: foreignInfo.onDelete || null,
	        update: foreignInfo.onUpdate || null,
	        match: null,
	        deferrable: null,
	      },
	    });

	    const newTable = compileCreateTable(parsedTable, this.wrap);

	    return this.generateAlterCommands(newTable, createIndices);
	  }

	  async setNullable(column, isNullable) {
	    const { createTable, createIndices } = await this.getTableSql();

	    const parsedTable = parseCreateTable(createTable);
	    parsedTable.table = this.alteredName;

	    const parsedColumn = parsedTable.columns.find((c) =>
	      isEqualId(column, c.name)
	    );

	    if (!parsedColumn) {
	      throw new Error(
	        `.setNullable: Column ${column} does not exist in table ${this.tableName()}.`
	      );
	    }

	    parsedColumn.constraints.notnull = isNullable
	      ? null
	      : { name: null, conflict: null };

	    parsedColumn.constraints.null = isNullable
	      ? parsedColumn.constraints.null
	      : null;

	    const newTable = compileCreateTable(parsedTable, this.wrap);

	    return this.generateAlterCommands(newTable, createIndices);
	  }

	  async alter(newSql, createIndices, columns) {
	    const wasForeignCheckEnabled = await this.isForeignCheckEnabled();

	    if (wasForeignCheckEnabled) {
	      await this.setForeignCheck(false);
	    }

	    try {
	      await this.client.transaction(
	        async (trx) => {
	          await trx.raw(newSql);
	          await this.copyData(trx, columns);
	          await this.dropOriginal(trx);
	          await this.renameTable(trx);

	          for (const createIndex of createIndices) {
	            await trx.raw(createIndex);
	          }

	          if (wasForeignCheckEnabled) {
	            const foreignViolations = await trx.raw(executeForeignCheck());

	            if (foreignViolations.length > 0) {
	              throw new Error('FOREIGN KEY constraint failed');
	            }
	          }
	        },
	        { connection: this.connection }
	      );
	    } finally {
	      if (wasForeignCheckEnabled) {
	        await this.setForeignCheck(true);
	      }
	    }
	  }

	  async generateAlterCommands(newSql, createIndices, columns) {
	    const sql = [];
	    const pre = [];
	    const post = [];
	    let check = null;

	    sql.push(newSql);
	    sql.push(copyData(this.tableName(), this.alteredName, columns));
	    sql.push(dropOriginal(this.tableName()));
	    sql.push(renameTable(this.alteredName, this.tableName()));

	    for (const createIndex of createIndices) {
	      sql.push(createIndex);
	    }

	    const isForeignCheckEnabled = await this.isForeignCheckEnabled();

	    if (isForeignCheckEnabled) {
	      pre.push(setForeignCheck(false));
	      post.push(setForeignCheck(true));

	      check = executeForeignCheck();
	    }

	    return { pre, sql, check, post };
	  }
	}

	ddl = SQLite3_DDL;
	return ddl;
}

var sqliteQuerybuilder;
var hasRequiredSqliteQuerybuilder;

function requireSqliteQuerybuilder () {
	if (hasRequiredSqliteQuerybuilder) return sqliteQuerybuilder;
	hasRequiredSqliteQuerybuilder = 1;
	const QueryBuilder = querybuilder;

	sqliteQuerybuilder = class QueryBuilder_SQLite3 extends QueryBuilder {
	  withMaterialized(alias, statementOrColumnList, nothingOrStatement) {
	    this._validateWithArgs(
	      alias,
	      statementOrColumnList,
	      nothingOrStatement,
	      'with'
	    );
	    return this.withWrapped(
	      alias,
	      statementOrColumnList,
	      nothingOrStatement,
	      true
	    );
	  }

	  withNotMaterialized(alias, statementOrColumnList, nothingOrStatement) {
	    this._validateWithArgs(
	      alias,
	      statementOrColumnList,
	      nothingOrStatement,
	      'with'
	    );
	    return this.withWrapped(
	      alias,
	      statementOrColumnList,
	      nothingOrStatement,
	      false
	    );
	  }
	};
	return sqliteQuerybuilder;
}

const require$$14 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(sqlite3$1);

var sqlite3;
var hasRequiredSqlite3;

function requireSqlite3 () {
	if (hasRequiredSqlite3) return sqlite3;
	hasRequiredSqlite3 = 1;
	// SQLite3
	// -------
	const defaults = require$$0$k;
	const map = require$$1$5;
	const { promisify } = require$$1$e;

	const Client = client$2;

	const Raw = raw;
	const Transaction = /*@__PURE__*/ requireSqliteTransaction();
	const SqliteQueryCompiler = /*@__PURE__*/ requireSqliteQuerycompiler();
	const SchemaCompiler = /*@__PURE__*/ requireSqliteCompiler();
	const ColumnCompiler = /*@__PURE__*/ requireSqliteColumncompiler();
	const TableCompiler = /*@__PURE__*/ requireSqliteTablecompiler();
	const ViewCompiler = /*@__PURE__*/ requireSqliteViewcompiler();
	const SQLite3_DDL = /*@__PURE__*/ requireDdl();
	const Formatter = formatter;
	const QueryBuilder = /*@__PURE__*/ requireSqliteQuerybuilder();

	class Client_SQLite3 extends Client {
	  constructor(config) {
	    super(config);

	    if (config.connection && config.connection.filename === undefined) {
	      this.logger.warn(
	        'Could not find `connection.filename` in config. Please specify ' +
	          'the database path and name to avoid errors. ' +
	          '(see docs https://knexjs.org/guide/#configuration-options)'
	      );
	    }

	    if (config.useNullAsDefault === undefined) {
	      this.logger.warn(
	        'sqlite does not support inserting default values. Set the ' +
	          '`useNullAsDefault` flag to hide this warning. ' +
	          '(see docs https://knexjs.org/guide/query-builder.html#insert).'
	      );
	    }
	  }

	  _driver() {
	    return require$$14;
	  }

	  schemaCompiler() {
	    return new SchemaCompiler(this, ...arguments);
	  }

	  transaction() {
	    return new Transaction(this, ...arguments);
	  }

	  queryCompiler(builder, formatter) {
	    return new SqliteQueryCompiler(this, builder, formatter);
	  }

	  queryBuilder() {
	    return new QueryBuilder(this);
	  }

	  viewCompiler(builder, formatter) {
	    return new ViewCompiler(this, builder, formatter);
	  }

	  columnCompiler() {
	    return new ColumnCompiler(this, ...arguments);
	  }

	  tableCompiler() {
	    return new TableCompiler(this, ...arguments);
	  }

	  ddl(compiler, pragma, connection) {
	    return new SQLite3_DDL(this, compiler, pragma, connection);
	  }

	  wrapIdentifierImpl(value) {
	    return value !== '*' ? `\`${value.replace(/`/g, '``')}\`` : '*';
	  }

	  // Get a raw connection from the database, returning a promise with the connection object.
	  acquireRawConnection() {
	    return new Promise((resolve, reject) => {
	      // the default mode for sqlite3
	      let flags = this.driver.OPEN_READWRITE | this.driver.OPEN_CREATE;

	      if (this.connectionSettings.flags) {
	        if (!Array.isArray(this.connectionSettings.flags)) {
	          throw new Error(`flags must be an array of strings`);
	        }
	        this.connectionSettings.flags.forEach((_flag) => {
	          if (!_flag.startsWith('OPEN_') || !this.driver[_flag]) {
	            throw new Error(`flag ${_flag} not supported by node-sqlite3`);
	          }
	          flags = flags | this.driver[_flag];
	        });
	      }

	      const db = new this.driver.Database(
	        this.connectionSettings.filename,
	        flags,
	        (err) => {
	          if (err) {
	            return reject(err);
	          }
	          resolve(db);
	        }
	      );
	    });
	  }

	  // Used to explicitly close a connection, called internally by the pool when
	  // a connection times out or the pool is shutdown.
	  async destroyRawConnection(connection) {
	    const close = promisify((cb) => connection.close(cb));
	    return close();
	  }

	  // Runs the query on the specified connection, providing the bindings and any
	  // other necessary prep work.
	  _query(connection, obj) {
	    if (!obj.sql) throw new Error('The query is empty');

	    const { method } = obj;
	    let callMethod;
	    switch (method) {
	      case 'insert':
	      case 'update':
	        callMethod = obj.returning ? 'all' : 'run';
	        break;
	      case 'counter':
	      case 'del':
	        callMethod = 'run';
	        break;
	      default:
	        callMethod = 'all';
	    }
	    return new Promise(function (resolver, rejecter) {
	      if (!connection || !connection[callMethod]) {
	        return rejecter(
	          new Error(`Error calling ${callMethod} on connection.`)
	        );
	      }
	      connection[callMethod](obj.sql, obj.bindings, function (err, response) {
	        if (err) return rejecter(err);
	        obj.response = response;

	        // We need the context here, as it contains
	        // the "this.lastID" or "this.changes"
	        obj.context = this;

	        return resolver(obj);
	      });
	    });
	  }

	  _stream(connection, obj, stream) {
	    if (!obj.sql) throw new Error('The query is empty');

	    const client = this;
	    return new Promise(function (resolver, rejecter) {
	      stream.on('error', rejecter);
	      stream.on('end', resolver);

	      return client
	        ._query(connection, obj)
	        .then((obj) => obj.response)
	        .then((rows) => rows.forEach((row) => stream.write(row)))
	        .catch(function (err) {
	          stream.emit('error', err);
	        })
	        .then(function () {
	          stream.end();
	        });
	    });
	  }

	  // Ensures the response is returned in the same format as other clients.
	  processResponse(obj, runner) {
	    const ctx = obj.context;
	    const { response, returning } = obj;
	    if (obj.output) return obj.output.call(runner, response);
	    switch (obj.method) {
	      case 'select':
	        return response;
	      case 'first':
	        return response[0];
	      case 'pluck':
	        return map(response, obj.pluck);
	      case 'insert': {
	        if (returning) {
	          if (response) {
	            return response;
	          }
	        }
	        return [ctx.lastID];
	      }
	      case 'update': {
	        if (returning) {
	          if (response) {
	            return response;
	          }
	        }
	        return ctx.changes;
	      }
	      case 'del':
	      case 'counter':
	        return ctx.changes;
	      default: {
	        return response;
	      }
	    }
	  }

	  poolDefaults() {
	    return defaults({ min: 1, max: 1 }, super.poolDefaults());
	  }

	  formatter(builder) {
	    return new Formatter(this, builder);
	  }

	  values(values, builder, formatter) {
	    if (Array.isArray(values)) {
	      if (Array.isArray(values[0])) {
	        return `( values ${values
	          .map(
	            (value) =>
	              `(${this.parameterize(value, undefined, builder, formatter)})`
	          )
	          .join(', ')})`;
	      }
	      return `(${this.parameterize(values, undefined, builder, formatter)})`;
	    }

	    if (values instanceof Raw) {
	      return `(${this.parameter(values, builder, formatter)})`;
	    }

	    return this.parameter(values, builder, formatter);
	  }
	}

	Object.assign(Client_SQLite3.prototype, {
	  dialect: 'sqlite3',

	  driverName: 'sqlite3',
	});

	sqlite3 = Client_SQLite3;
	return sqlite3;
}

const require$$1$2 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(betterSqlite3$1);

var betterSqlite3;
var hasRequiredBetterSqlite3;

function requireBetterSqlite3 () {
	if (hasRequiredBetterSqlite3) return betterSqlite3;
	hasRequiredBetterSqlite3 = 1;
	// better-sqlite3 Client
	// -------
	const Client_SQLite3 = /*@__PURE__*/ requireSqlite3();

	class Client_BetterSQLite3 extends Client_SQLite3 {
	  _driver() {
	    return require$$1$2;
	  }

	  // Get a raw connection from the database, returning a promise with the connection object.
	  async acquireRawConnection() {
	    const options = this.connectionSettings.options || {};

	    return new this.driver(this.connectionSettings.filename, {
	      nativeBinding: options.nativeBinding,
	      readonly: !!options.readonly,
	    });
	  }

	  // Used to explicitly close a connection, called internally by the pool when
	  // a connection times out or the pool is shutdown.
	  async destroyRawConnection(connection) {
	    return connection.close();
	  }

	  // Runs the query on the specified connection, providing the bindings and any
	  // other necessary prep work.
	  async _query(connection, obj) {
	    if (!obj.sql) throw new Error('The query is empty');

	    if (!connection) {
	      throw new Error('No connection provided');
	    }

	    const statement = connection.prepare(obj.sql);
	    const bindings = this._formatBindings(obj.bindings);

	    if (statement.reader) {
	      const response = await statement.all(bindings);
	      obj.response = response;
	      return obj;
	    }

	    const response = await statement.run(bindings);
	    obj.response = response;
	    obj.context = {
	      lastID: response.lastInsertRowid,
	      changes: response.changes,
	    };

	    return obj;
	  }

	  _formatBindings(bindings) {
	    if (!bindings) {
	      return [];
	    }
	    return bindings.map((binding) => {
	      if (binding instanceof Date) {
	        return binding.valueOf();
	      }

	      if (typeof binding === 'boolean') {
	        return Number(binding);
	      }

	      return binding;
	    });
	  }
	}

	Object.assign(Client_BetterSQLite3.prototype, {
	  // The "dialect", for reference .
	  driverName: 'better-sqlite3',
	});

	betterSqlite3 = Client_BetterSQLite3;
	return betterSqlite3;
}

var pgTransaction;
var hasRequiredPgTransaction;

function requirePgTransaction () {
	if (hasRequiredPgTransaction) return pgTransaction;
	hasRequiredPgTransaction = 1;
	const Transaction = transaction$5;

	class Transaction_PG extends Transaction {
	  begin(conn) {
	    const trxMode = [
	      this.isolationLevel ? `ISOLATION LEVEL ${this.isolationLevel}` : '',
	      this.readOnly ? 'READ ONLY' : '',
	    ]
	      .join(' ')
	      .trim();

	    if (trxMode.length === 0) {
	      return this.query(conn, 'BEGIN;');
	    }
	    return this.query(conn, `BEGIN TRANSACTION ${trxMode};`);
	  }
	}

	pgTransaction = Transaction_PG;
	return pgTransaction;
}

var pgQuerycompiler;
var hasRequiredPgQuerycompiler;

function requirePgQuerycompiler () {
	if (hasRequiredPgQuerycompiler) return pgQuerycompiler;
	hasRequiredPgQuerycompiler = 1;
	// PostgreSQL Query Builder & Compiler
	// ------
	const identity = require$$2$4;
	const reduce = require$$4$1;

	const QueryCompiler = querycompiler;
	const {
	  wrapString,
	  columnize: columnize_,
	  operator: operator_,
	  wrap: wrap_,
	} = wrappingFormatter;

	class QueryCompiler_PG extends QueryCompiler {
	  constructor(client, builder, formatter) {
	    super(client, builder, formatter);
	    this._defaultInsertValue = 'default';
	  }

	  // Compiles a truncate query.
	  truncate() {
	    return `truncate ${this.tableName} restart identity`;
	  }

	  // is used if the an array with multiple empty values supplied

	  // Compiles an `insert` query, allowing for multiple
	  // inserts using a single query statement.
	  insert() {
	    let sql = super.insert();
	    if (sql === '') return sql;

	    const { returning, onConflict, ignore, merge, insert } = this.single;
	    if (onConflict && ignore) sql += this._ignore(onConflict);
	    if (onConflict && merge) {
	      sql += this._merge(merge.updates, onConflict, insert);
	      const wheres = this.where();
	      if (wheres) sql += ` ${wheres}`;
	    }
	    if (returning) sql += this._returning(returning);

	    return {
	      sql,
	      returning,
	    };
	  }

	  // Compiles an `update` query, allowing for a return value.
	  update() {
	    const withSQL = this.with();
	    const updateData = this._prepUpdate(this.single.update);
	    const wheres = this.where();
	    const { returning, updateFrom } = this.single;
	    return {
	      sql:
	        withSQL +
	        `update ${this.single.only ? 'only ' : ''}${this.tableName} ` +
	        `set ${updateData.join(', ')}` +
	        this._updateFrom(updateFrom) +
	        (wheres ? ` ${wheres}` : '') +
	        this._returning(returning),
	      returning,
	    };
	  }

	  using() {
	    const usingTables = this.single.using;
	    if (!usingTables) return;
	    let sql = 'using ';
	    if (Array.isArray(usingTables)) {
	      sql += usingTables
	        .map((table) => {
	          return this.formatter.wrap(table);
	        })
	        .join(',');
	    } else {
	      sql += this.formatter.wrap(usingTables);
	    }
	    return sql;
	  }

	  // Compiles an `delete` query, allowing for a return value.
	  del() {
	    // Make sure tableName is processed by the formatter first.
	    const { tableName } = this;
	    const withSQL = this.with();
	    let wheres = this.where() || '';
	    let using = this.using() || '';
	    const joins = this.grouped.join;

	    const tableJoins = [];
	    if (Array.isArray(joins)) {
	      for (const join of joins) {
	        tableJoins.push(
	          wrap_(
	            this._joinTable(join),
	            undefined,
	            this.builder,
	            this.client,
	            this.bindingsHolder
	          )
	        );

	        const joinWheres = [];
	        for (const clause of join.clauses) {
	          joinWheres.push(
	            this.whereBasic({
	              column: clause.column,
	              operator: '=',
	              value: clause.value,
	              asColumn: true,
	            })
	          );
	        }
	        if (joinWheres.length > 0) {
	          wheres += (wheres ? ' and ' : 'where ') + joinWheres.join(' and ');
	        }
	      }
	      if (tableJoins.length > 0) {
	        using += (using ? ',' : 'using ') + tableJoins.join(',');
	      }
	    }

	    // With 'using' syntax, no tablename between DELETE and FROM.
	    const sql =
	      withSQL +
	      `delete from ${this.single.only ? 'only ' : ''}${tableName}` +
	      (using ? ` ${using}` : '') +
	      (wheres ? ` ${wheres}` : '');
	    const { returning } = this.single;
	    return {
	      sql: sql + this._returning(returning),
	      returning,
	    };
	  }

	  aggregate(stmt) {
	    return this._aggregate(stmt, { distinctParentheses: true });
	  }

	  _returning(value) {
	    return value ? ` returning ${this.formatter.columnize(value)}` : '';
	  }

	  _updateFrom(name) {
	    return name ? ` from ${this.formatter.wrap(name)}` : '';
	  }

	  _ignore(columns) {
	    if (columns === true) {
	      return ' on conflict do nothing';
	    }
	    return ` on conflict ${this._onConflictClause(columns)} do nothing`;
	  }

	  _merge(updates, columns, insert) {
	    let sql = ` on conflict ${this._onConflictClause(columns)} do update set `;
	    if (updates && Array.isArray(updates)) {
	      sql += updates
	        .map((column) =>
	          wrapString(
	            column.split('.').pop(),
	            this.formatter.builder,
	            this.client,
	            this.formatter
	          )
	        )
	        .map((column) => `${column} = excluded.${column}`)
	        .join(', ');

	      return sql;
	    } else if (updates && typeof updates === 'object') {
	      const updateData = this._prepUpdate(updates);
	      if (typeof updateData === 'string') {
	        sql += updateData;
	      } else {
	        sql += updateData.join(',');
	      }

	      return sql;
	    } else {
	      const insertData = this._prepInsert(insert);
	      if (typeof insertData === 'string') {
	        throw new Error(
	          'If using merge with a raw insert query, then updates must be provided'
	        );
	      }

	      sql += insertData.columns
	        .map((column) =>
	          wrapString(column.split('.').pop(), this.builder, this.client)
	        )
	        .map((column) => `${column} = excluded.${column}`)
	        .join(', ');

	      return sql;
	    }
	  }

	  // Join array of table names and apply default schema.
	  _tableNames(tables) {
	    const schemaName = this.single.schema;
	    const sql = [];

	    for (let i = 0; i < tables.length; i++) {
	      let tableName = tables[i];

	      if (tableName) {
	        if (schemaName) {
	          tableName = `${schemaName}.${tableName}`;
	        }
	        sql.push(this.formatter.wrap(tableName));
	      }
	    }

	    return sql.join(', ');
	  }

	  _lockingClause(lockMode) {
	    const tables = this.single.lockTables || [];

	    return lockMode + (tables.length ? ' of ' + this._tableNames(tables) : '');
	  }

	  _groupOrder(item, type) {
	    return super._groupOrderNulls(item, type);
	  }

	  forUpdate() {
	    return this._lockingClause('for update');
	  }

	  forShare() {
	    return this._lockingClause('for share');
	  }

	  forNoKeyUpdate() {
	    return this._lockingClause('for no key update');
	  }

	  forKeyShare() {
	    return this._lockingClause('for key share');
	  }

	  skipLocked() {
	    return 'skip locked';
	  }

	  noWait() {
	    return 'nowait';
	  }

	  // Compiles a columnInfo query
	  columnInfo() {
	    const column = this.single.columnInfo;
	    let schema = this.single.schema;

	    // The user may have specified a custom wrapIdentifier function in the config. We
	    // need to run the identifiers through that function, but not format them as
	    // identifiers otherwise.
	    const table = this.client.customWrapIdentifier(this.single.table, identity);

	    if (schema) {
	      schema = this.client.customWrapIdentifier(schema, identity);
	    }

	    const sql =
	      'select * from information_schema.columns where table_name = ? and table_catalog = current_database()';
	    const bindings = [table];

	    return this._buildColumnInfoQuery(schema, sql, bindings, column);
	  }

	  _buildColumnInfoQuery(schema, sql, bindings, column) {
	    if (schema) {
	      sql += ' and table_schema = ?';
	      bindings.push(schema);
	    } else {
	      sql += ' and table_schema = current_schema()';
	    }

	    return {
	      sql,
	      bindings,
	      output(resp) {
	        const out = reduce(
	          resp.rows,
	          function (columns, val) {
	            columns[val.column_name] = {
	              type: val.data_type,
	              maxLength: val.character_maximum_length,
	              nullable: val.is_nullable === 'YES',
	              defaultValue: val.column_default,
	            };
	            return columns;
	          },
	          {}
	        );
	        return (column && out[column]) || out;
	      },
	    };
	  }

	  distinctOn(value) {
	    return 'distinct on (' + this.formatter.columnize(value) + ') ';
	  }

	  // Json functions
	  jsonExtract(params) {
	    return this._jsonExtract('jsonb_path_query', params);
	  }

	  jsonSet(params) {
	    return this._jsonSet(
	      'jsonb_set',
	      Object.assign({}, params, {
	        path: this.client.toPathForJson(params.path),
	      })
	    );
	  }

	  jsonInsert(params) {
	    return this._jsonSet(
	      'jsonb_insert',
	      Object.assign({}, params, {
	        path: this.client.toPathForJson(params.path),
	      })
	    );
	  }

	  jsonRemove(params) {
	    const jsonCol = `${columnize_(
	      params.column,
	      this.builder,
	      this.client,
	      this.bindingsHolder
	    )} #- ${this.client.parameter(
	      this.client.toPathForJson(params.path),
	      this.builder,
	      this.bindingsHolder
	    )}`;
	    return params.alias
	      ? this.client.alias(jsonCol, this.formatter.wrap(params.alias))
	      : jsonCol;
	  }

	  whereJsonPath(statement) {
	    let castValue = '';
	    if (!isNaN(statement.value) && parseInt(statement.value)) {
	      castValue = '::int';
	    } else if (!isNaN(statement.value) && parseFloat(statement.value)) {
	      castValue = '::float';
	    } else {
	      castValue = " #>> '{}'";
	    }
	    return `jsonb_path_query_first(${this._columnClause(
	      statement
	    )}, ${this.client.parameter(
	      statement.jsonPath,
	      this.builder,
	      this.bindingsHolder
	    )})${castValue} ${operator_(
	      statement.operator,
	      this.builder,
	      this.client,
	      this.bindingsHolder
	    )} ${this._jsonValueClause(statement)}`;
	  }

	  whereJsonSupersetOf(statement) {
	    return this._not(
	      statement,
	      `${wrap_(
	        statement.column,
	        undefined,
	        this.builder,
	        this.client,
	        this.bindingsHolder
	      )} @> ${this._jsonValueClause(statement)}`
	    );
	  }

	  whereJsonSubsetOf(statement) {
	    return this._not(
	      statement,
	      `${columnize_(
	        statement.column,
	        this.builder,
	        this.client,
	        this.bindingsHolder
	      )} <@ ${this._jsonValueClause(statement)}`
	    );
	  }

	  onJsonPathEquals(clause) {
	    return this._onJsonPathEquals('jsonb_path_query_first', clause);
	  }
	}

	pgQuerycompiler = QueryCompiler_PG;
	return pgQuerycompiler;
}

var pgQuerybuilder;
var hasRequiredPgQuerybuilder;

function requirePgQuerybuilder () {
	if (hasRequiredPgQuerybuilder) return pgQuerybuilder;
	hasRequiredPgQuerybuilder = 1;
	const QueryBuilder = querybuilder;

	pgQuerybuilder = class QueryBuilder_PostgreSQL extends QueryBuilder {
	  updateFrom(name) {
	    this._single.updateFrom = name;
	    return this;
	  }

	  using(tables) {
	    this._single.using = tables;
	    return this;
	  }

	  withMaterialized(alias, statementOrColumnList, nothingOrStatement) {
	    this._validateWithArgs(
	      alias,
	      statementOrColumnList,
	      nothingOrStatement,
	      'with'
	    );
	    return this.withWrapped(
	      alias,
	      statementOrColumnList,
	      nothingOrStatement,
	      true
	    );
	  }

	  withNotMaterialized(alias, statementOrColumnList, nothingOrStatement) {
	    this._validateWithArgs(
	      alias,
	      statementOrColumnList,
	      nothingOrStatement,
	      'with'
	    );
	    return this.withWrapped(
	      alias,
	      statementOrColumnList,
	      nothingOrStatement,
	      false
	    );
	  }
	};
	return pgQuerybuilder;
}

var pgColumncompiler;
var hasRequiredPgColumncompiler;

function requirePgColumncompiler () {
	if (hasRequiredPgColumncompiler) return pgColumncompiler;
	hasRequiredPgColumncompiler = 1;
	// PostgreSQL Column Compiler
	// -------

	const ColumnCompiler = columncompiler;
	const { isObject } = is;
	const { toNumber } = helpers$7;
	const commentEscapeRegex = /(?<!')'(?!')/g;

	class ColumnCompiler_PG extends ColumnCompiler {
	  constructor(client, tableCompiler, columnBuilder) {
	    super(client, tableCompiler, columnBuilder);
	    this.modifiers = ['nullable', 'defaultTo', 'comment'];
	    this._addCheckModifiers();
	  }

	  // Types
	  // ------

	  bit(column) {
	    return column.length !== false ? `bit(${column.length})` : 'bit';
	  }

	  // Create the column definition for an enum type.
	  // Using method "2" here: http://stackoverflow.com/a/10984951/525714
	  enu(allowed, options) {
	    options = options || {};

	    const values =
	      options.useNative && options.existingType
	        ? undefined
	        : allowed.join("', '");

	    if (options.useNative) {
	      let enumName = '';
	      const schemaName = options.schemaName || this.tableCompiler.schemaNameRaw;

	      if (schemaName) {
	        enumName += `"${schemaName}".`;
	      }

	      enumName += `"${options.enumName}"`;

	      if (!options.existingType) {
	        this.tableCompiler.unshiftQuery(
	          `create type ${enumName} as enum ('${values}')`
	        );
	      }

	      return enumName;
	    }
	    return `text check (${this.formatter.wrap(this.args[0])} in ('${values}'))`;
	  }

	  decimal(precision, scale) {
	    if (precision === null) return 'decimal';
	    return `decimal(${toNumber(precision, 8)}, ${toNumber(scale, 2)})`;
	  }

	  json(jsonb) {
	    if (jsonb) this.client.logger.deprecate('json(true)', 'jsonb()');
	    return jsonColumn(this.client, jsonb);
	  }

	  jsonb() {
	    return jsonColumn(this.client, true);
	  }

	  checkRegex(regex, constraintName) {
	    return this._check(
	      `${this.formatter.wrap(
	        this.getColumnName()
	      )} ~ ${this.client._escapeBinding(regex)}`,
	      constraintName
	    );
	  }

	  datetime(withoutTz = false, precision) {
	    let useTz;
	    if (isObject(withoutTz)) {
	      ({ useTz, precision } = withoutTz);
	    } else {
	      useTz = !withoutTz;
	    }
	    useTz = typeof useTz === 'boolean' ? useTz : true;
	    precision =
	      precision !== undefined && precision !== null
	        ? '(' + precision + ')'
	        : '';

	    return `${useTz ? 'timestamptz' : 'timestamp'}${precision}`;
	  }

	  timestamp(withoutTz = false, precision) {
	    return this.datetime(withoutTz, precision);
	  }

	  // Modifiers:
	  // ------
	  comment(comment) {
	    const columnName = this.args[0] || this.defaults('columnName');
	    const escapedComment = comment
	      ? `'${comment.replace(commentEscapeRegex, "''")}'`
	      : 'NULL';

	    this.pushAdditional(function () {
	      this.pushQuery(
	        `comment on column ${this.tableCompiler.tableName()}.` +
	          this.formatter.wrap(columnName) +
	          ` is ${escapedComment}`
	      );
	    }, comment);
	  }

	  increments(options = { primaryKey: true }) {
	    return (
	      'serial' +
	      (this.tableCompiler._canBeAddPrimaryKey(options) ? ' primary key' : '')
	    );
	  }

	  bigincrements(options = { primaryKey: true }) {
	    return (
	      'bigserial' +
	      (this.tableCompiler._canBeAddPrimaryKey(options) ? ' primary key' : '')
	    );
	  }

	  uuid(options = { primaryKey: false }) {
	    return (
	      'uuid' +
	      (this.tableCompiler._canBeAddPrimaryKey(options) ? ' primary key' : '')
	    );
	  }
	}

	ColumnCompiler_PG.prototype.bigint = 'bigint';
	ColumnCompiler_PG.prototype.binary = 'bytea';
	ColumnCompiler_PG.prototype.bool = 'boolean';
	ColumnCompiler_PG.prototype.double = 'double precision';
	ColumnCompiler_PG.prototype.floating = 'real';
	ColumnCompiler_PG.prototype.smallint = 'smallint';
	ColumnCompiler_PG.prototype.tinyint = 'smallint';

	function jsonColumn(client, jsonb) {
	  if (
	    !client.version ||
	    client.config.client === 'cockroachdb' ||
	    client.config.jsonbSupport === true ||
	    parseFloat(client.version) >= 9.2
	  ) {
	    return jsonb ? 'jsonb' : 'json';
	  }
	  return 'text';
	}

	pgColumncompiler = ColumnCompiler_PG;
	return pgColumncompiler;
}

/* eslint max-len: 0 */

var pgTablecompiler;
var hasRequiredPgTablecompiler;

function requirePgTablecompiler () {
	if (hasRequiredPgTablecompiler) return pgTablecompiler;
	hasRequiredPgTablecompiler = 1;
	// PostgreSQL Table Builder & Compiler
	// -------

	const has = require$$0$8;
	const TableCompiler = tablecompiler;
	const { isObject, isString } = is;

	class TableCompiler_PG extends TableCompiler {
	  constructor(client, tableBuilder) {
	    super(client, tableBuilder);
	  }

	  // Compile a rename column command.
	  renameColumn(from, to) {
	    return this.pushQuery({
	      sql: `alter table ${this.tableName()} rename ${this.formatter.wrap(
	        from
	      )} to ${this.formatter.wrap(to)}`,
	    });
	  }

	  _setNullableState(column, isNullable) {
	    const constraintAction = isNullable ? 'drop not null' : 'set not null';
	    const sql = `alter table ${this.tableName()} alter column ${this.formatter.wrap(
	      column
	    )} ${constraintAction}`;
	    return this.pushQuery({
	      sql: sql,
	    });
	  }

	  compileAdd(builder) {
	    const table = this.formatter.wrap(builder);
	    const columns = this.prefixArray('add column', this.getColumns(builder));
	    return this.pushQuery({
	      sql: `alter table ${table} ${columns.join(', ')}`,
	    });
	  }

	  // Adds the "create" query to the query sequence.
	  createQuery(columns, ifNot, like) {
	    const createStatement = ifNot
	      ? 'create table if not exists '
	      : 'create table ';
	    const columnsSql = ` (${columns.sql.join(', ')}${
	      this.primaryKeys() || ''
	    }${this._addChecks()})`;

	    let sql =
	      createStatement +
	      this.tableName() +
	      (like && this.tableNameLike()
	        ? ' (like ' +
	          this.tableNameLike() +
	          ' including all' +
	          (columns.sql.length ? ', ' + columns.sql.join(', ') : '') +
	          ')'
	        : columnsSql);
	    if (this.single.inherits)
	      sql += ` inherits (${this.formatter.wrap(this.single.inherits)})`;
	    this.pushQuery({
	      sql,
	      bindings: columns.bindings,
	    });
	    const hasComment = has(this.single, 'comment');
	    if (hasComment) this.comment(this.single.comment);
	  }

	  primaryKeys() {
	    const pks = (this.grouped.alterTable || []).filter(
	      (k) => k.method === 'primary'
	    );
	    if (pks.length > 0 && pks[0].args.length > 0) {
	      const columns = pks[0].args[0];
	      let constraintName = pks[0].args[1] || '';
	      let deferrable;
	      if (isObject(constraintName)) {
	        ({ constraintName, deferrable } = constraintName);
	      }
	      deferrable = deferrable ? ` deferrable initially ${deferrable}` : '';
	      constraintName = constraintName
	        ? this.formatter.wrap(constraintName)
	        : this.formatter.wrap(`${this.tableNameRaw}_pkey`);

	      return `, constraint ${constraintName} primary key (${this.formatter.columnize(
	        columns
	      )})${deferrable}`;
	    }
	  }

	  addColumns(columns, prefix, colCompilers) {
	    if (prefix === this.alterColumnsPrefix) {
	      // alter columns
	      for (const col of colCompilers) {
	        this._addColumn(col);
	      }
	    } else {
	      // base class implementation for normal add
	      super.addColumns(columns, prefix);
	    }
	  }

	  _addColumn(col) {
	    const quotedTableName = this.tableName();
	    const type = col.getColumnType();
	    // We'd prefer to call this.formatter.wrapAsIdentifier here instead, however the context passed to
	    // `this` instance is not that of the column, but of the table. Thus, we unfortunately have to call
	    // `wrapIdentifier` here as well (it is already called once on the initial column operation) to give
	    // our `alter` operation the correct `queryContext`. Refer to issue #2606 and PR #2612.
	    const colName = this.client.wrapIdentifier(
	      col.getColumnName(),
	      col.columnBuilder.queryContext()
	    );

	    // To alter enum columns they must be cast to text first
	    const isEnum = col.type === 'enu';
	    this.pushQuery({
	      sql: `alter table ${quotedTableName} alter column ${colName} drop default`,
	      bindings: [],
	    });

	    const alterNullable = col.columnBuilder.alterNullable;
	    if (alterNullable) {
	      this.pushQuery({
	        sql: `alter table ${quotedTableName} alter column ${colName} drop not null`,
	        bindings: [],
	      });
	    }

	    const alterType = col.columnBuilder.alterType;
	    if (alterType) {
	      this.pushQuery({
	        sql: `alter table ${quotedTableName} alter column ${colName} type ${type} using (${colName}${
	          isEnum ? '::text::' : '::'
	        }${type})`,
	        bindings: [],
	      });
	    }

	    const defaultTo = col.modified['defaultTo'];
	    if (defaultTo) {
	      const modifier = col.defaultTo.apply(col, defaultTo);
	      this.pushQuery({
	        sql: `alter table ${quotedTableName} alter column ${colName} set ${modifier}`,
	        bindings: [],
	      });
	    }

	    if (alterNullable) {
	      const nullable = col.modified['nullable'];
	      if (nullable && nullable[0] === false) {
	        this.pushQuery({
	          sql: `alter table ${quotedTableName} alter column ${colName} set not null`,
	          bindings: [],
	        });
	      }
	    }
	  }

	  // Compiles the comment on the table.
	  comment(comment) {
	    this.pushQuery(
	      `comment on table ${this.tableName()} is '${this.single.comment}'`
	    );
	  }

	  // Indexes:
	  // -------

	  primary(columns, constraintName) {
	    let deferrable;
	    if (isObject(constraintName)) {
	      ({ constraintName, deferrable } = constraintName);
	    }
	    deferrable = deferrable ? ` deferrable initially ${deferrable}` : '';
	    constraintName = constraintName
	      ? this.formatter.wrap(constraintName)
	      : this.formatter.wrap(`${this.tableNameRaw}_pkey`);
	    if (this.method !== 'create' && this.method !== 'createIfNot') {
	      this.pushQuery(
	        `alter table ${this.tableName()} add constraint ${constraintName} primary key (${this.formatter.columnize(
	          columns
	        )})${deferrable}`
	      );
	    }
	  }

	  unique(columns, indexName) {
	    let deferrable;
	    let useConstraint = true;
	    let predicate;
	    if (isObject(indexName)) {
	      ({ indexName, deferrable, useConstraint, predicate } = indexName);
	      if (useConstraint === undefined) {
	        useConstraint = !!deferrable || !predicate;
	      }
	    }
	    if (!useConstraint && deferrable && deferrable !== 'not deferrable') {
	      throw new Error('postgres cannot create deferrable index');
	    }
	    if (useConstraint && predicate) {
	      throw new Error('postgres cannot create constraint with predicate');
	    }
	    deferrable = deferrable ? ` deferrable initially ${deferrable}` : '';
	    indexName = indexName
	      ? this.formatter.wrap(indexName)
	      : this._indexCommand('unique', this.tableNameRaw, columns);

	    if (useConstraint) {
	      this.pushQuery(
	        `alter table ${this.tableName()} add constraint ${indexName}` +
	          ' unique (' +
	          this.formatter.columnize(columns) +
	          ')' +
	          deferrable
	      );
	    } else {
	      const predicateQuery = predicate
	        ? ' ' + this.client.queryCompiler(predicate).where()
	        : '';

	      this.pushQuery(
	        `create unique index ${indexName} on ${this.tableName()} (${this.formatter.columnize(
	          columns
	        )})${predicateQuery}`
	      );
	    }
	  }

	  index(columns, indexName, options) {
	    indexName = indexName
	      ? this.formatter.wrap(indexName)
	      : this._indexCommand('index', this.tableNameRaw, columns);

	    let predicate;
	    let storageEngineIndexType;
	    let indexType;

	    if (isString(options)) {
	      storageEngineIndexType = options;
	    } else if (isObject(options)) {
	      ({ indexType, storageEngineIndexType, predicate } = options);
	    }

	    const predicateQuery = predicate
	      ? ' ' + this.client.queryCompiler(predicate).where()
	      : '';

	    this.pushQuery(
	      `create${
	        typeof indexType === 'string' && indexType.toLowerCase() === 'unique'
	          ? ' unique'
	          : ''
	      } index ${indexName} on ${this.tableName()}${
	        (storageEngineIndexType && ` using ${storageEngineIndexType}`) || ''
	      }` +
	        ' (' +
	        this.formatter.columnize(columns) +
	        ')' +
	        `${predicateQuery}`
	    );
	  }

	  dropPrimary(constraintName) {
	    constraintName = constraintName
	      ? this.formatter.wrap(constraintName)
	      : this.formatter.wrap(this.tableNameRaw + '_pkey');
	    this.pushQuery(
	      `alter table ${this.tableName()} drop constraint ${constraintName}`
	    );
	  }

	  dropIndex(columns, indexName) {
	    indexName = indexName
	      ? this.formatter.wrap(indexName)
	      : this._indexCommand('index', this.tableNameRaw, columns);
	    indexName = this.schemaNameRaw
	      ? `${this.formatter.wrap(this.schemaNameRaw)}.${indexName}`
	      : indexName;
	    this.pushQuery(`drop index ${indexName}`);
	  }

	  dropUnique(columns, indexName) {
	    indexName = indexName
	      ? this.formatter.wrap(indexName)
	      : this._indexCommand('unique', this.tableNameRaw, columns);
	    this.pushQuery(
	      `alter table ${this.tableName()} drop constraint ${indexName}`
	    );
	  }

	  dropForeign(columns, indexName) {
	    indexName = indexName
	      ? this.formatter.wrap(indexName)
	      : this._indexCommand('foreign', this.tableNameRaw, columns);
	    this.pushQuery(
	      `alter table ${this.tableName()} drop constraint ${indexName}`
	    );
	  }
	}

	pgTablecompiler = TableCompiler_PG;
	return pgTablecompiler;
}

/* eslint max-len: 0 */

var pgViewcompiler;
var hasRequiredPgViewcompiler;

function requirePgViewcompiler () {
	if (hasRequiredPgViewcompiler) return pgViewcompiler;
	hasRequiredPgViewcompiler = 1;
	const ViewCompiler = viewcompiler;

	class ViewCompiler_PG extends ViewCompiler {
	  constructor(client, viewCompiler) {
	    super(client, viewCompiler);
	  }

	  renameColumn(from, to) {
	    return this.pushQuery({
	      sql: `alter view ${this.viewName()} rename ${this.formatter.wrap(
	        from
	      )} to ${this.formatter.wrap(to)}`,
	    });
	  }

	  defaultTo(column, defaultValue) {
	    return this.pushQuery({
	      sql: `alter view ${this.viewName()} alter ${this.formatter.wrap(
	        column
	      )} set default ${defaultValue}`,
	    });
	  }

	  createOrReplace() {
	    this.createQuery(this.columns, this.selectQuery, false, true);
	  }

	  createMaterializedView() {
	    this.createQuery(this.columns, this.selectQuery, true);
	  }
	}

	pgViewcompiler = ViewCompiler_PG;
	return pgViewcompiler;
}

var pgViewbuilder;
var hasRequiredPgViewbuilder;

function requirePgViewbuilder () {
	if (hasRequiredPgViewbuilder) return pgViewbuilder;
	hasRequiredPgViewbuilder = 1;
	const ViewBuilder = viewbuilder;

	class ViewBuilder_PG extends ViewBuilder {
	  constructor() {
	    super(...arguments);
	  }

	  checkOption() {
	    this._single.checkOption = 'default_option';
	  }

	  localCheckOption() {
	    this._single.checkOption = 'local';
	  }

	  cascadedCheckOption() {
	    this._single.checkOption = 'cascaded';
	  }
	}

	pgViewbuilder = ViewBuilder_PG;
	return pgViewbuilder;
}

var pgCompiler;
var hasRequiredPgCompiler;

function requirePgCompiler () {
	if (hasRequiredPgCompiler) return pgCompiler;
	hasRequiredPgCompiler = 1;
	// PostgreSQL Schema Compiler
	// -------

	const SchemaCompiler = compiler$1;

	class SchemaCompiler_PG extends SchemaCompiler {
	  constructor(client, builder) {
	    super(client, builder);
	  }

	  // Check whether the current table
	  hasTable(tableName) {
	    let sql = 'select * from information_schema.tables where table_name = ?';
	    const bindings = [tableName];

	    if (this.schema) {
	      sql += ' and table_schema = ?';
	      bindings.push(this.schema);
	    } else {
	      sql += ' and table_schema = current_schema()';
	    }

	    this.pushQuery({
	      sql,
	      bindings,
	      output(resp) {
	        return resp.rows.length > 0;
	      },
	    });
	  }

	  // Compile the query to determine if a column exists in a table.
	  hasColumn(tableName, columnName) {
	    let sql =
	      'select * from information_schema.columns where table_name = ? and column_name = ?';
	    const bindings = [tableName, columnName];

	    if (this.schema) {
	      sql += ' and table_schema = ?';
	      bindings.push(this.schema);
	    } else {
	      sql += ' and table_schema = current_schema()';
	    }

	    this.pushQuery({
	      sql,
	      bindings,
	      output(resp) {
	        return resp.rows.length > 0;
	      },
	    });
	  }

	  qualifiedTableName(tableName) {
	    const name = this.schema ? `${this.schema}.${tableName}` : tableName;
	    return this.formatter.wrap(name);
	  }

	  // Compile a rename table command.
	  renameTable(from, to) {
	    this.pushQuery(
	      `alter table ${this.qualifiedTableName(
	        from
	      )} rename to ${this.formatter.wrap(to)}`
	    );
	  }

	  createSchema(schemaName) {
	    this.pushQuery(`create schema ${this.formatter.wrap(schemaName)}`);
	  }

	  createSchemaIfNotExists(schemaName) {
	    this.pushQuery(
	      `create schema if not exists ${this.formatter.wrap(schemaName)}`
	    );
	  }

	  dropSchema(schemaName, cascade = false) {
	    this.pushQuery(
	      `drop schema ${this.formatter.wrap(schemaName)}${
	        cascade ? ' cascade' : ''
	      }`
	    );
	  }

	  dropSchemaIfExists(schemaName, cascade = false) {
	    this.pushQuery(
	      `drop schema if exists ${this.formatter.wrap(schemaName)}${
	        cascade ? ' cascade' : ''
	      }`
	    );
	  }

	  dropExtension(extensionName) {
	    this.pushQuery(`drop extension ${this.formatter.wrap(extensionName)}`);
	  }

	  dropExtensionIfExists(extensionName) {
	    this.pushQuery(
	      `drop extension if exists ${this.formatter.wrap(extensionName)}`
	    );
	  }

	  createExtension(extensionName) {
	    this.pushQuery(`create extension ${this.formatter.wrap(extensionName)}`);
	  }

	  createExtensionIfNotExists(extensionName) {
	    this.pushQuery(
	      `create extension if not exists ${this.formatter.wrap(extensionName)}`
	    );
	  }

	  renameView(from, to) {
	    this.pushQuery(
	      this.alterViewPrefix +
	        `${this.formatter.wrap(from)} rename to ${this.formatter.wrap(to)}`
	    );
	  }

	  refreshMaterializedView(viewName, concurrently = false) {
	    this.pushQuery({
	      sql: `refresh materialized view${
	        concurrently ? ' concurrently' : ''
	      } ${this.formatter.wrap(viewName)}`,
	    });
	  }

	  dropMaterializedView(viewName) {
	    this._dropView(viewName, false, true);
	  }

	  dropMaterializedViewIfExists(viewName) {
	    this._dropView(viewName, true, true);
	  }
	}

	pgCompiler = SchemaCompiler_PG;
	return pgCompiler;
}

var lib$2 = {exports: {}};

var defaults$4 = {exports: {}};

var pgTypes = {};

const require$$0$4 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(postgresArray);

var arrayParser;
var hasRequiredArrayParser;

function requireArrayParser () {
	if (hasRequiredArrayParser) return arrayParser;
	hasRequiredArrayParser = 1;
	var array = require$$0$4;

	arrayParser = {
	  create: function (source, transform) {
	    return {
	      parse: function() {
	        return array.parse(source, transform);
	      }
	    };
	  }
	};
	return arrayParser;
}

const require$$2$3 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(postgresDate);

const require$$3$1 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(postgresInterval);

const require$$4 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(postgresBytea);

var textParsers;
var hasRequiredTextParsers;

function requireTextParsers () {
	if (hasRequiredTextParsers) return textParsers;
	hasRequiredTextParsers = 1;
	var array = require$$0$4;
	var arrayParser = /*@__PURE__*/ requireArrayParser();
	var parseDate = require$$2$3;
	var parseInterval = require$$3$1;
	var parseByteA = require$$4;

	function allowNull (fn) {
	  return function nullAllowed (value) {
	    if (value === null) return value
	    return fn(value)
	  }
	}

	function parseBool (value) {
	  if (value === null) return value
	  return value === 'TRUE' ||
	    value === 't' ||
	    value === 'true' ||
	    value === 'y' ||
	    value === 'yes' ||
	    value === 'on' ||
	    value === '1';
	}

	function parseBoolArray (value) {
	  if (!value) return null
	  return array.parse(value, parseBool)
	}

	function parseBaseTenInt (string) {
	  return parseInt(string, 10)
	}

	function parseIntegerArray (value) {
	  if (!value) return null
	  return array.parse(value, allowNull(parseBaseTenInt))
	}

	function parseBigIntegerArray (value) {
	  if (!value) return null
	  return array.parse(value, allowNull(function (entry) {
	    return parseBigInteger(entry).trim()
	  }))
	}

	var parsePointArray = function(value) {
	  if(!value) { return null; }
	  var p = arrayParser.create(value, function(entry) {
	    if(entry !== null) {
	      entry = parsePoint(entry);
	    }
	    return entry;
	  });

	  return p.parse();
	};

	var parseFloatArray = function(value) {
	  if(!value) { return null; }
	  var p = arrayParser.create(value, function(entry) {
	    if(entry !== null) {
	      entry = parseFloat(entry);
	    }
	    return entry;
	  });

	  return p.parse();
	};

	var parseStringArray = function(value) {
	  if(!value) { return null; }

	  var p = arrayParser.create(value);
	  return p.parse();
	};

	var parseDateArray = function(value) {
	  if (!value) { return null; }

	  var p = arrayParser.create(value, function(entry) {
	    if (entry !== null) {
	      entry = parseDate(entry);
	    }
	    return entry;
	  });

	  return p.parse();
	};

	var parseIntervalArray = function(value) {
	  if (!value) { return null; }

	  var p = arrayParser.create(value, function(entry) {
	    if (entry !== null) {
	      entry = parseInterval(entry);
	    }
	    return entry;
	  });

	  return p.parse();
	};

	var parseByteAArray = function(value) {
	  if (!value) { return null; }

	  return array.parse(value, allowNull(parseByteA));
	};

	var parseInteger = function(value) {
	  return parseInt(value, 10);
	};

	var parseBigInteger = function(value) {
	  var valStr = String(value);
	  if (/^\d+$/.test(valStr)) { return valStr; }
	  return value;
	};

	var parseJsonArray = function(value) {
	  if (!value) { return null; }

	  return array.parse(value, allowNull(JSON.parse));
	};

	var parsePoint = function(value) {
	  if (value[0] !== '(') { return null; }

	  value = value.substring( 1, value.length - 1 ).split(',');

	  return {
	    x: parseFloat(value[0])
	  , y: parseFloat(value[1])
	  };
	};

	var parseCircle = function(value) {
	  if (value[0] !== '<' && value[1] !== '(') { return null; }

	  var point = '(';
	  var radius = '';
	  var pointParsed = false;
	  for (var i = 2; i < value.length - 1; i++){
	    if (!pointParsed) {
	      point += value[i];
	    }

	    if (value[i] === ')') {
	      pointParsed = true;
	      continue;
	    } else if (!pointParsed) {
	      continue;
	    }

	    if (value[i] === ','){
	      continue;
	    }

	    radius += value[i];
	  }
	  var result = parsePoint(point);
	  result.radius = parseFloat(radius);

	  return result;
	};

	var init = function(register) {
	  register(20, parseBigInteger); // int8
	  register(21, parseInteger); // int2
	  register(23, parseInteger); // int4
	  register(26, parseInteger); // oid
	  register(700, parseFloat); // float4/real
	  register(701, parseFloat); // float8/double
	  register(16, parseBool);
	  register(1082, parseDate); // date
	  register(1114, parseDate); // timestamp without timezone
	  register(1184, parseDate); // timestamp
	  register(600, parsePoint); // point
	  register(651, parseStringArray); // cidr[]
	  register(718, parseCircle); // circle
	  register(1000, parseBoolArray);
	  register(1001, parseByteAArray);
	  register(1005, parseIntegerArray); // _int2
	  register(1007, parseIntegerArray); // _int4
	  register(1028, parseIntegerArray); // oid[]
	  register(1016, parseBigIntegerArray); // _int8
	  register(1017, parsePointArray); // point[]
	  register(1021, parseFloatArray); // _float4
	  register(1022, parseFloatArray); // _float8
	  register(1231, parseFloatArray); // _numeric
	  register(1014, parseStringArray); //char
	  register(1015, parseStringArray); //varchar
	  register(1008, parseStringArray);
	  register(1009, parseStringArray);
	  register(1040, parseStringArray); // macaddr[]
	  register(1041, parseStringArray); // inet[]
	  register(1115, parseDateArray); // timestamp without time zone[]
	  register(1182, parseDateArray); // _date
	  register(1185, parseDateArray); // timestamp with time zone[]
	  register(1186, parseInterval);
	  register(1187, parseIntervalArray);
	  register(17, parseByteA);
	  register(114, JSON.parse.bind(JSON)); // json
	  register(3802, JSON.parse.bind(JSON)); // jsonb
	  register(199, parseJsonArray); // json[]
	  register(3807, parseJsonArray); // jsonb[]
	  register(3907, parseStringArray); // numrange[]
	  register(2951, parseStringArray); // uuid[]
	  register(791, parseStringArray); // money[]
	  register(1183, parseStringArray); // time[]
	  register(1270, parseStringArray); // timetz[]
	};

	textParsers = {
	  init: init
	};
	return textParsers;
}

var pgInt8;
var hasRequiredPgInt8;

function requirePgInt8 () {
	if (hasRequiredPgInt8) return pgInt8;
	hasRequiredPgInt8 = 1;

	// selected so (BASE - 1) * 0x100000000 + 0xffffffff is a safe integer
	var BASE = 1000000;

	function readInt8(buffer) {
		var high = buffer.readInt32BE(0);
		var low = buffer.readUInt32BE(4);
		var sign = '';

		if (high < 0) {
			high = ~high + (low === 0);
			low = (~low + 1) >>> 0;
			sign = '-';
		}

		var result = '';
		var carry;
		var t;
		var digits;
		var pad;
		var l;
		var i;

		{
			carry = high % BASE;
			high = high / BASE >>> 0;

			t = 0x100000000 * carry + low;
			low = t / BASE >>> 0;
			digits = '' + (t - BASE * low);

			if (low === 0 && high === 0) {
				return sign + digits + result;
			}

			pad = '';
			l = 6 - digits.length;

			for (i = 0; i < l; i++) {
				pad += '0';
			}

			result = pad + digits + result;
		}

		{
			carry = high % BASE;
			high = high / BASE >>> 0;

			t = 0x100000000 * carry + low;
			low = t / BASE >>> 0;
			digits = '' + (t - BASE * low);

			if (low === 0 && high === 0) {
				return sign + digits + result;
			}

			pad = '';
			l = 6 - digits.length;

			for (i = 0; i < l; i++) {
				pad += '0';
			}

			result = pad + digits + result;
		}

		{
			carry = high % BASE;
			high = high / BASE >>> 0;

			t = 0x100000000 * carry + low;
			low = t / BASE >>> 0;
			digits = '' + (t - BASE * low);

			if (low === 0 && high === 0) {
				return sign + digits + result;
			}

			pad = '';
			l = 6 - digits.length;

			for (i = 0; i < l; i++) {
				pad += '0';
			}

			result = pad + digits + result;
		}

		{
			carry = high % BASE;
			t = 0x100000000 * carry + low;
			digits = '' + t % BASE;

			return sign + digits + result;
		}
	}

	pgInt8 = readInt8;
	return pgInt8;
}

var binaryParsers;
var hasRequiredBinaryParsers;

function requireBinaryParsers () {
	if (hasRequiredBinaryParsers) return binaryParsers;
	hasRequiredBinaryParsers = 1;
	var parseInt64 = /*@__PURE__*/ requirePgInt8();

	var parseBits = function(data, bits, offset, invert, callback) {
	  offset = offset || 0;
	  invert = invert || false;
	  callback = callback || function(lastValue, newValue, bits) { return (lastValue * Math.pow(2, bits)) + newValue; };
	  var offsetBytes = offset >> 3;

	  var inv = function(value) {
	    if (invert) {
	      return ~value & 0xff;
	    }

	    return value;
	  };

	  // read first (maybe partial) byte
	  var mask = 0xff;
	  var firstBits = 8 - (offset % 8);
	  if (bits < firstBits) {
	    mask = (0xff << (8 - bits)) & 0xff;
	    firstBits = bits;
	  }

	  if (offset) {
	    mask = mask >> (offset % 8);
	  }

	  var result = 0;
	  if ((offset % 8) + bits >= 8) {
	    result = callback(0, inv(data[offsetBytes]) & mask, firstBits);
	  }

	  // read bytes
	  var bytes = (bits + offset) >> 3;
	  for (var i = offsetBytes + 1; i < bytes; i++) {
	    result = callback(result, inv(data[i]), 8);
	  }

	  // bits to read, that are not a complete byte
	  var lastBits = (bits + offset) % 8;
	  if (lastBits > 0) {
	    result = callback(result, inv(data[bytes]) >> (8 - lastBits), lastBits);
	  }

	  return result;
	};

	var parseFloatFromBits = function(data, precisionBits, exponentBits) {
	  var bias = Math.pow(2, exponentBits - 1) - 1;
	  var sign = parseBits(data, 1);
	  var exponent = parseBits(data, exponentBits, 1);

	  if (exponent === 0) {
	    return 0;
	  }

	  // parse mantissa
	  var precisionBitsCounter = 1;
	  var parsePrecisionBits = function(lastValue, newValue, bits) {
	    if (lastValue === 0) {
	      lastValue = 1;
	    }

	    for (var i = 1; i <= bits; i++) {
	      precisionBitsCounter /= 2;
	      if ((newValue & (0x1 << (bits - i))) > 0) {
	        lastValue += precisionBitsCounter;
	      }
	    }

	    return lastValue;
	  };

	  var mantissa = parseBits(data, precisionBits, exponentBits + 1, false, parsePrecisionBits);

	  // special cases
	  if (exponent == (Math.pow(2, exponentBits + 1) - 1)) {
	    if (mantissa === 0) {
	      return (sign === 0) ? Infinity : -Infinity;
	    }

	    return NaN;
	  }

	  // normale number
	  return ((sign === 0) ? 1 : -1) * Math.pow(2, exponent - bias) * mantissa;
	};

	var parseInt16 = function(value) {
	  if (parseBits(value, 1) == 1) {
	    return -1 * (parseBits(value, 15, 1, true) + 1);
	  }

	  return parseBits(value, 15, 1);
	};

	var parseInt32 = function(value) {
	  if (parseBits(value, 1) == 1) {
	    return -1 * (parseBits(value, 31, 1, true) + 1);
	  }

	  return parseBits(value, 31, 1);
	};

	var parseFloat32 = function(value) {
	  return parseFloatFromBits(value, 23, 8);
	};

	var parseFloat64 = function(value) {
	  return parseFloatFromBits(value, 52, 11);
	};

	var parseNumeric = function(value) {
	  var sign = parseBits(value, 16, 32);
	  if (sign == 0xc000) {
	    return NaN;
	  }

	  var weight = Math.pow(10000, parseBits(value, 16, 16));
	  var result = 0;
	  var ndigits = parseBits(value, 16);
	  for (var i = 0; i < ndigits; i++) {
	    result += parseBits(value, 16, 64 + (16 * i)) * weight;
	    weight /= 10000;
	  }

	  var scale = Math.pow(10, parseBits(value, 16, 48));
	  return ((sign === 0) ? 1 : -1) * Math.round(result * scale) / scale;
	};

	var parseDate = function(isUTC, value) {
	  var sign = parseBits(value, 1);
	  var rawValue = parseBits(value, 63, 1);

	  // discard usecs and shift from 2000 to 1970
	  var result = new Date((((sign === 0) ? 1 : -1) * rawValue / 1000) + 946684800000);

	  if (!isUTC) {
	    result.setTime(result.getTime() + result.getTimezoneOffset() * 60000);
	  }

	  // add microseconds to the date
	  result.usec = rawValue % 1000;
	  result.getMicroSeconds = function() {
	    return this.usec;
	  };
	  result.setMicroSeconds = function(value) {
	    this.usec = value;
	  };
	  result.getUTCMicroSeconds = function() {
	    return this.usec;
	  };

	  return result;
	};

	var parseArray = function(value) {
	  var dim = parseBits(value, 32);

	  parseBits(value, 32, 32);
	  var elementType = parseBits(value, 32, 64);

	  var offset = 96;
	  var dims = [];
	  for (var i = 0; i < dim; i++) {
	    // parse dimension
	    dims[i] = parseBits(value, 32, offset);
	    offset += 32;

	    // ignore lower bounds
	    offset += 32;
	  }

	  var parseElement = function(elementType) {
	    // parse content length
	    var length = parseBits(value, 32, offset);
	    offset += 32;

	    // parse null values
	    if (length == 0xffffffff) {
	      return null;
	    }

	    var result;
	    if ((elementType == 0x17) || (elementType == 0x14)) {
	      // int/bigint
	      result = parseBits(value, length * 8, offset);
	      offset += length * 8;
	      return result;
	    }
	    else if (elementType == 0x19) {
	      // string
	      result = value.toString(this.encoding, offset >> 3, (offset += (length << 3)) >> 3);
	      return result;
	    }
	    else {
	      console.log("ERROR: ElementType not implemented: " + elementType);
	    }
	  };

	  var parse = function(dimension, elementType) {
	    var array = [];
	    var i;

	    if (dimension.length > 1) {
	      var count = dimension.shift();
	      for (i = 0; i < count; i++) {
	        array[i] = parse(dimension, elementType);
	      }
	      dimension.unshift(count);
	    }
	    else {
	      for (i = 0; i < dimension[0]; i++) {
	        array[i] = parseElement(elementType);
	      }
	    }

	    return array;
	  };

	  return parse(dims, elementType);
	};

	var parseText = function(value) {
	  return value.toString('utf8');
	};

	var parseBool = function(value) {
	  if(value === null) return null;
	  return (parseBits(value, 8) > 0);
	};

	var init = function(register) {
	  register(20, parseInt64);
	  register(21, parseInt16);
	  register(23, parseInt32);
	  register(26, parseInt32);
	  register(1700, parseNumeric);
	  register(700, parseFloat32);
	  register(701, parseFloat64);
	  register(16, parseBool);
	  register(1114, parseDate.bind(null, false));
	  register(1184, parseDate.bind(null, true));
	  register(1000, parseArray);
	  register(1007, parseArray);
	  register(1016, parseArray);
	  register(1008, parseArray);
	  register(1009, parseArray);
	  register(25, parseText);
	};

	binaryParsers = {
	  init: init
	};
	return binaryParsers;
}

/**
 * Following query was used to generate this file:

 SELECT json_object_agg(UPPER(PT.typname), PT.oid::int4 ORDER BY pt.oid)
 FROM pg_type PT
 WHERE typnamespace = (SELECT pgn.oid FROM pg_namespace pgn WHERE nspname = 'pg_catalog') -- Take only builting Postgres types with stable OID (extension types are not guaranted to be stable)
 AND typtype = 'b' -- Only basic types
 AND typelem = 0 -- Ignore aliases
 AND typisdefined -- Ignore undefined types
 */

var builtins;
var hasRequiredBuiltins;

function requireBuiltins () {
	if (hasRequiredBuiltins) return builtins;
	hasRequiredBuiltins = 1;
	builtins = {
	    BOOL: 16,
	    BYTEA: 17,
	    CHAR: 18,
	    INT8: 20,
	    INT2: 21,
	    INT4: 23,
	    REGPROC: 24,
	    TEXT: 25,
	    OID: 26,
	    TID: 27,
	    XID: 28,
	    CID: 29,
	    JSON: 114,
	    XML: 142,
	    PG_NODE_TREE: 194,
	    SMGR: 210,
	    PATH: 602,
	    POLYGON: 604,
	    CIDR: 650,
	    FLOAT4: 700,
	    FLOAT8: 701,
	    ABSTIME: 702,
	    RELTIME: 703,
	    TINTERVAL: 704,
	    CIRCLE: 718,
	    MACADDR8: 774,
	    MONEY: 790,
	    MACADDR: 829,
	    INET: 869,
	    ACLITEM: 1033,
	    BPCHAR: 1042,
	    VARCHAR: 1043,
	    DATE: 1082,
	    TIME: 1083,
	    TIMESTAMP: 1114,
	    TIMESTAMPTZ: 1184,
	    INTERVAL: 1186,
	    TIMETZ: 1266,
	    BIT: 1560,
	    VARBIT: 1562,
	    NUMERIC: 1700,
	    REFCURSOR: 1790,
	    REGPROCEDURE: 2202,
	    REGOPER: 2203,
	    REGOPERATOR: 2204,
	    REGCLASS: 2205,
	    REGTYPE: 2206,
	    UUID: 2950,
	    TXID_SNAPSHOT: 2970,
	    PG_LSN: 3220,
	    PG_NDISTINCT: 3361,
	    PG_DEPENDENCIES: 3402,
	    TSVECTOR: 3614,
	    TSQUERY: 3615,
	    GTSVECTOR: 3642,
	    REGCONFIG: 3734,
	    REGDICTIONARY: 3769,
	    JSONB: 3802,
	    REGNAMESPACE: 4089,
	    REGROLE: 4096
	};
	return builtins;
}

var hasRequiredPgTypes;

function requirePgTypes () {
	if (hasRequiredPgTypes) return pgTypes;
	hasRequiredPgTypes = 1;
	var textParsers = /*@__PURE__*/ requireTextParsers();
	var binaryParsers = /*@__PURE__*/ requireBinaryParsers();
	var arrayParser = /*@__PURE__*/ requireArrayParser();
	var builtinTypes = /*@__PURE__*/ requireBuiltins();

	pgTypes.getTypeParser = getTypeParser;
	pgTypes.setTypeParser = setTypeParser;
	pgTypes.arrayParser = arrayParser;
	pgTypes.builtins = builtinTypes;

	var typeParsers = {
	  text: {},
	  binary: {}
	};

	//the empty parse function
	function noParse (val) {
	  return String(val);
	}
	//returns a function used to convert a specific type (specified by
	//oid) into a result javascript type
	//note: the oid can be obtained via the following sql query:
	//SELECT oid FROM pg_type WHERE typname = 'TYPE_NAME_HERE';
	function getTypeParser (oid, format) {
	  format = format || 'text';
	  if (!typeParsers[format]) {
	    return noParse;
	  }
	  return typeParsers[format][oid] || noParse;
	}
	function setTypeParser (oid, format, parseFn) {
	  if(typeof format == 'function') {
	    parseFn = format;
	    format = 'text';
	  }
	  typeParsers[format][oid] = parseFn;
	}
	textParsers.init(function(oid, converter) {
	  typeParsers.text[oid] = converter;
	});

	binaryParsers.init(function(oid, converter) {
	  typeParsers.binary[oid] = converter;
	});
	return pgTypes;
}

(function (module) {

	module.exports = {
	  // database host. defaults to localhost
	  host: 'localhost',

	  // database user's name
	  user: process.platform === 'win32' ? process.env.USERNAME : process.env.USER,

	  // name of database to connect
	  database: undefined,

	  // database user's password
	  password: null,

	  // a Postgres connection string to be used instead of setting individual connection items
	  // NOTE:  Setting this value will cause it to override any other value (such as database or user) defined
	  // in the defaults object.
	  connectionString: undefined,

	  // database port
	  port: 5432,

	  // number of rows to return at a time from a prepared statement's
	  // portal. 0 will return all rows at once
	  rows: 0,

	  // binary result mode
	  binary: false,

	  // Connection pool options - see https://github.com/brianc/node-pg-pool

	  // number of connections to use in connection pool
	  // 0 will disable connection pooling
	  max: 10,

	  // max milliseconds a client can go unused before it is removed
	  // from the pool and destroyed
	  idleTimeoutMillis: 30000,

	  client_encoding: '',

	  ssl: false,

	  application_name: undefined,

	  fallback_application_name: undefined,

	  options: undefined,

	  parseInputDatesAsUTC: false,

	  // max milliseconds any query using this connection will execute for before timing out in error.
	  // false=unlimited
	  statement_timeout: false,

	  // Abort any statement that waits longer than the specified duration in milliseconds while attempting to acquire a lock.
	  // false=unlimited
	  lock_timeout: false,

	  // Terminate any session with an open transaction that has been idle for longer than the specified duration in milliseconds
	  // false=unlimited
	  idle_in_transaction_session_timeout: false,

	  // max milliseconds to wait for query to complete (client side)
	  query_timeout: false,

	  connect_timeout: 0,

	  keepalives: 1,

	  keepalives_idle: 0,
	};

	const pgTypes = /*@__PURE__*/ requirePgTypes();
	// save default parsers
	const parseBigInteger = pgTypes.getTypeParser(20, 'text');
	const parseBigIntegerArray = pgTypes.getTypeParser(1016, 'text');

	// parse int8 so you can get your count values as actual numbers
	module.exports.__defineSetter__('parseInt8', function (val) {
	  pgTypes.setTypeParser(20, 'text', val ? pgTypes.getTypeParser(23, 'text') : parseBigInteger);
	  pgTypes.setTypeParser(1016, 'text', val ? pgTypes.getTypeParser(1007, 'text') : parseBigIntegerArray);
	}); 
} (defaults$4));

var defaultsExports = defaults$4.exports;

const defaults$3 = defaultsExports;

const util = require$$1$e;
const { isDate } = util.types || util; // Node 8 doesn't have `util.types`

function escapeElement(elementRepresentation) {
  const escaped = elementRepresentation.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

  return '"' + escaped + '"'
}

// convert a JS array to a postgres array literal
// uses comma separator so won't work for types like box that use
// a different array separator.
function arrayString(val) {
  let result = '{';
  for (let i = 0; i < val.length; i++) {
    if (i > 0) {
      result = result + ',';
    }
    if (val[i] === null || typeof val[i] === 'undefined') {
      result = result + 'NULL';
    } else if (Array.isArray(val[i])) {
      result = result + arrayString(val[i]);
    } else if (ArrayBuffer.isView(val[i])) {
      let item = val[i];
      if (!(item instanceof Buffer)) {
        const buf = Buffer.from(item.buffer, item.byteOffset, item.byteLength);
        if (buf.length === item.byteLength) {
          item = buf;
        } else {
          item = buf.slice(item.byteOffset, item.byteOffset + item.byteLength);
        }
      }
      result += '\\\\x' + item.toString('hex');
    } else {
      result += escapeElement(prepareValue(val[i]));
    }
  }
  result = result + '}';
  return result
}

// converts values from javascript types
// to their 'raw' counterparts for use as a postgres parameter
// note: you can override this function to provide your own conversion mechanism
// for complex types, etc...
const prepareValue = function (val, seen) {
  // null and undefined are both null for postgres
  if (val == null) {
    return null
  }
  if (typeof val === 'object') {
    if (val instanceof Buffer) {
      return val
    }
    if (ArrayBuffer.isView(val)) {
      const buf = Buffer.from(val.buffer, val.byteOffset, val.byteLength);
      if (buf.length === val.byteLength) {
        return buf
      }
      return buf.slice(val.byteOffset, val.byteOffset + val.byteLength) // Node.js v4 does not support those Buffer.from params
    }
    if (isDate(val)) {
      if (defaults$3.parseInputDatesAsUTC) {
        return dateToStringUTC(val)
      } else {
        return dateToString(val)
      }
    }
    if (Array.isArray(val)) {
      return arrayString(val)
    }

    return prepareObject(val, seen)
  }
  return val.toString()
};

function prepareObject(val, seen) {
  if (val && typeof val.toPostgres === 'function') {
    seen = seen || [];
    if (seen.indexOf(val) !== -1) {
      throw new Error('circular reference detected while preparing "' + val + '" for query')
    }
    seen.push(val);

    return prepareValue(val.toPostgres(prepareValue), seen)
  }
  return JSON.stringify(val)
}

function dateToString(date) {
  let offset = -date.getTimezoneOffset();

  let year = date.getFullYear();
  const isBCYear = year < 1;
  if (isBCYear) year = Math.abs(year) + 1; // negative years are 1 off their BC representation

  let ret =
    String(year).padStart(4, '0') +
    '-' +
    String(date.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(date.getDate()).padStart(2, '0') +
    'T' +
    String(date.getHours()).padStart(2, '0') +
    ':' +
    String(date.getMinutes()).padStart(2, '0') +
    ':' +
    String(date.getSeconds()).padStart(2, '0') +
    '.' +
    String(date.getMilliseconds()).padStart(3, '0');

  if (offset < 0) {
    ret += '-';
    offset *= -1;
  } else {
    ret += '+';
  }

  ret += String(Math.floor(offset / 60)).padStart(2, '0') + ':' + String(offset % 60).padStart(2, '0');
  if (isBCYear) ret += ' BC';
  return ret
}

function dateToStringUTC(date) {
  let year = date.getUTCFullYear();
  const isBCYear = year < 1;
  if (isBCYear) year = Math.abs(year) + 1; // negative years are 1 off their BC representation

  let ret =
    String(year).padStart(4, '0') +
    '-' +
    String(date.getUTCMonth() + 1).padStart(2, '0') +
    '-' +
    String(date.getUTCDate()).padStart(2, '0') +
    'T' +
    String(date.getUTCHours()).padStart(2, '0') +
    ':' +
    String(date.getUTCMinutes()).padStart(2, '0') +
    ':' +
    String(date.getUTCSeconds()).padStart(2, '0') +
    '.' +
    String(date.getUTCMilliseconds()).padStart(3, '0');

  ret += '+00:00';
  if (isBCYear) ret += ' BC';
  return ret
}

function normalizeQueryConfig(config, values, callback) {
  // can take in strings or config objects
  config = typeof config === 'string' ? { text: config } : config;
  if (values) {
    if (typeof values === 'function') {
      config.callback = values;
    } else {
      config.values = values;
    }
  }
  if (callback) {
    config.callback = callback;
  }
  return config
}

// Ported from PostgreSQL 9.2.4 source code in src/interfaces/libpq/fe-exec.c
const escapeIdentifier$1 = function (str) {
  return '"' + str.replace(/"/g, '""') + '"'
};

const escapeLiteral$1 = function (str) {
  let hasBackslash = false;
  let escaped = "'";

  if (str == null) {
    return "''"
  }

  if (typeof str !== 'string') {
    return "''"
  }

  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (c === "'") {
      escaped += c + c;
    } else if (c === '\\') {
      escaped += c + c;
      hasBackslash = true;
    } else {
      escaped += c;
    }
  }

  escaped += "'";

  if (hasBackslash === true) {
    escaped = ' E' + escaped;
  }

  return escaped
};

var utils$5 = {
  prepareValue: function prepareValueWrapper(value) {
    // this ensures that extra arguments do not get passed into prepareValue
    // by accident, eg: from calling values.map(utils.prepareValue)
    return prepareValue(value)
  },
  normalizeQueryConfig,
  escapeIdentifier: escapeIdentifier$1,
  escapeLiteral: escapeLiteral$1,
};

var utils$4 = {exports: {}};

const require$$0$3 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(crypto$2);

var utilsLegacy;
var hasRequiredUtilsLegacy;

function requireUtilsLegacy () {
	if (hasRequiredUtilsLegacy) return utilsLegacy;
	hasRequiredUtilsLegacy = 1;
	// This file contains crypto utility functions for versions of Node.js < 15.0.0,
	// which does not support the WebCrypto.subtle API.

	const nodeCrypto = require$$0$3;

	function md5(string) {
	  return nodeCrypto.createHash('md5').update(string, 'utf-8').digest('hex')
	}

	// See AuthenticationMD5Password at https://www.postgresql.org/docs/current/static/protocol-flow.html
	function postgresMd5PasswordHash(user, password, salt) {
	  const inner = md5(password + user);
	  const outer = md5(Buffer.concat([Buffer.from(inner), salt]));
	  return 'md5' + outer
	}

	function sha256(text) {
	  return nodeCrypto.createHash('sha256').update(text).digest()
	}

	function hashByName(hashName, text) {
	  hashName = hashName.replace(/(\D)-/, '$1'); // e.g. SHA-256 -> SHA256
	  return nodeCrypto.createHash(hashName).update(text).digest()
	}

	function hmacSha256(key, msg) {
	  return nodeCrypto.createHmac('sha256', key).update(msg).digest()
	}

	async function deriveKey(password, salt, iterations) {
	  return nodeCrypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256')
	}

	utilsLegacy = {
	  postgresMd5PasswordHash,
	  randomBytes: nodeCrypto.randomBytes,
	  deriveKey,
	  sha256,
	  hashByName,
	  hmacSha256,
	  md5,
	};
	return utilsLegacy;
}

var utilsWebcrypto;
var hasRequiredUtilsWebcrypto;

function requireUtilsWebcrypto () {
	if (hasRequiredUtilsWebcrypto) return utilsWebcrypto;
	hasRequiredUtilsWebcrypto = 1;
	const nodeCrypto = require$$0$3;

	utilsWebcrypto = {
	  postgresMd5PasswordHash,
	  randomBytes,
	  deriveKey,
	  sha256,
	  hashByName,
	  hmacSha256,
	  md5,
	};

	/**
	 * The Web Crypto API - grabbed from the Node.js library or the global
	 * @type Crypto
	 */
	// eslint-disable-next-line no-undef
	const webCrypto = nodeCrypto.webcrypto || globalThis.crypto;
	/**
	 * The SubtleCrypto API for low level crypto operations.
	 * @type SubtleCrypto
	 */
	const subtleCrypto = webCrypto.subtle;
	const textEncoder = new TextEncoder();

	/**
	 *
	 * @param {*} length
	 * @returns
	 */
	function randomBytes(length) {
	  return webCrypto.getRandomValues(Buffer.alloc(length))
	}

	async function md5(string) {
	  try {
	    return nodeCrypto.createHash('md5').update(string, 'utf-8').digest('hex')
	  } catch (e) {
	    // `createHash()` failed so we are probably not in Node.js, use the WebCrypto API instead.
	    // Note that the MD5 algorithm on WebCrypto is not available in Node.js.
	    // This is why we cannot just use WebCrypto in all environments.
	    const data = typeof string === 'string' ? textEncoder.encode(string) : string;
	    const hash = await subtleCrypto.digest('MD5', data);
	    return Array.from(new Uint8Array(hash))
	      .map((b) => b.toString(16).padStart(2, '0'))
	      .join('')
	  }
	}

	// See AuthenticationMD5Password at https://www.postgresql.org/docs/current/static/protocol-flow.html
	async function postgresMd5PasswordHash(user, password, salt) {
	  const inner = await md5(password + user);
	  const outer = await md5(Buffer.concat([Buffer.from(inner), salt]));
	  return 'md5' + outer
	}

	/**
	 * Create a SHA-256 digest of the given data
	 * @param {Buffer} data
	 */
	async function sha256(text) {
	  return await subtleCrypto.digest('SHA-256', text)
	}

	async function hashByName(hashName, text) {
	  return await subtleCrypto.digest(hashName, text)
	}

	/**
	 * Sign the message with the given key
	 * @param {ArrayBuffer} keyBuffer
	 * @param {string} msg
	 */
	async function hmacSha256(keyBuffer, msg) {
	  const key = await subtleCrypto.importKey('raw', keyBuffer, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
	  return await subtleCrypto.sign('HMAC', key, textEncoder.encode(msg))
	}

	/**
	 * Derive a key from the password and salt
	 * @param {string} password
	 * @param {Uint8Array} salt
	 * @param {number} iterations
	 */
	async function deriveKey(password, salt, iterations) {
	  const key = await subtleCrypto.importKey('raw', textEncoder.encode(password), 'PBKDF2', false, ['deriveBits']);
	  const params = { name: 'PBKDF2', hash: 'SHA-256', salt: salt, iterations: iterations };
	  return await subtleCrypto.deriveBits(params, key, 32 * 8, ['deriveBits'])
	}
	return utilsWebcrypto;
}

const useLegacyCrypto = parseInt(process.versions && process.versions.node && process.versions.node.split('.')[0]) < 15;
if (useLegacyCrypto) {
  // We are on an old version of Node.js that requires legacy crypto utilities.
  utils$4.exports = /*@__PURE__*/ requireUtilsLegacy();
} else {
  utils$4.exports = /*@__PURE__*/ requireUtilsWebcrypto();
}

var utilsExports = utils$4.exports;

function x509Error(msg, cert) {
  return new Error('SASL channel binding: ' + msg + ' when parsing public certificate ' + cert.toString('base64'))
}

function readASN1Length(data, index) {
  let length = data[index++];
  if (length < 0x80) return { length, index }

  const lengthBytes = length & 0x7f;
  if (lengthBytes > 4) throw x509Error('bad length', data)

  length = 0;
  for (let i = 0; i < lengthBytes; i++) {
    length = (length << 8) | data[index++];
  }

  return { length, index }
}

function readASN1OID(data, index) {
  if (data[index++] !== 0x6) throw x509Error('non-OID data', data) // 6 = OID

  const { length: OIDLength, index: indexAfterOIDLength } = readASN1Length(data, index);
  index = indexAfterOIDLength;
  const lastIndex = index + OIDLength;

  const byte1 = data[index++];
  let oid = ((byte1 / 40) >> 0) + '.' + (byte1 % 40);

  while (index < lastIndex) {
    // loop over numbers in OID
    let value = 0;
    while (index < lastIndex) {
      // loop over bytes in number
      const nextByte = data[index++];
      value = (value << 7) | (nextByte & 0x7f);
      if (nextByte < 0x80) break
    }
    oid += '.' + value;
  }

  return { oid, index }
}

function expectASN1Seq(data, index) {
  if (data[index++] !== 0x30) throw x509Error('non-sequence data', data) // 30 = Sequence
  return readASN1Length(data, index)
}

function signatureAlgorithmHashFromCertificate$1(data, index) {
  // read this thread: https://www.postgresql.org/message-id/17760-b6c61e752ec07060%40postgresql.org
  if (index === undefined) index = 0;
  index = expectASN1Seq(data, index).index;
  const { length: certInfoLength, index: indexAfterCertInfoLength } = expectASN1Seq(data, index);
  index = indexAfterCertInfoLength + certInfoLength; // skip over certificate info
  index = expectASN1Seq(data, index).index; // skip over signature length field
  const { oid, index: indexAfterOID } = readASN1OID(data, index);
  switch (oid) {
    // RSA
    case '1.2.840.113549.1.1.4':
      return 'MD5'
    case '1.2.840.113549.1.1.5':
      return 'SHA-1'
    case '1.2.840.113549.1.1.11':
      return 'SHA-256'
    case '1.2.840.113549.1.1.12':
      return 'SHA-384'
    case '1.2.840.113549.1.1.13':
      return 'SHA-512'
    case '1.2.840.113549.1.1.14':
      return 'SHA-224'
    case '1.2.840.113549.1.1.15':
      return 'SHA512-224'
    case '1.2.840.113549.1.1.16':
      return 'SHA512-256'
    // ECDSA
    case '1.2.840.10045.4.1':
      return 'SHA-1'
    case '1.2.840.10045.4.3.1':
      return 'SHA-224'
    case '1.2.840.10045.4.3.2':
      return 'SHA-256'
    case '1.2.840.10045.4.3.3':
      return 'SHA-384'
    case '1.2.840.10045.4.3.4':
      return 'SHA-512'
    // RSASSA-PSS: hash is indicated separately
    case '1.2.840.113549.1.1.10': {
      index = indexAfterOID;
      index = expectASN1Seq(data, index).index;
      if (data[index++] !== 0xa0) throw x509Error('non-tag data', data) // a0 = constructed tag 0
      index = readASN1Length(data, index).index; // skip over tag length field
      index = expectASN1Seq(data, index).index; // skip over sequence length field
      const { oid: hashOID } = readASN1OID(data, index);
      switch (hashOID) {
        // standalone hash OIDs
        case '1.2.840.113549.2.5':
          return 'MD5'
        case '1.3.14.3.2.26':
          return 'SHA-1'
        case '2.16.840.1.101.3.4.2.1':
          return 'SHA-256'
        case '2.16.840.1.101.3.4.2.2':
          return 'SHA-384'
        case '2.16.840.1.101.3.4.2.3':
          return 'SHA-512'
      }
      throw x509Error('unknown hash OID ' + hashOID, data)
    }
    // Ed25519 -- see https: return//github.com/openssl/openssl/issues/15477
    case '1.3.101.110':
    case '1.3.101.112': // ph
      return 'SHA-512'
    // Ed448 -- still not in pg 17.2 (if supported, digest would be SHAKE256 x 64 bytes)
    case '1.3.101.111':
    case '1.3.101.113': // ph
      throw x509Error('Ed448 certificate channel binding is not currently supported by Postgres')
  }
  throw x509Error('unknown OID ' + oid, data)
}

var certSignatures = { signatureAlgorithmHashFromCertificate: signatureAlgorithmHashFromCertificate$1 };

const crypto$1 = utilsExports;
const { signatureAlgorithmHashFromCertificate } = certSignatures;

function startSession(mechanisms, stream) {
  const candidates = ['SCRAM-SHA-256'];
  if (stream) candidates.unshift('SCRAM-SHA-256-PLUS'); // higher-priority, so placed first

  const mechanism = candidates.find((candidate) => mechanisms.includes(candidate));

  if (!mechanism) {
    throw new Error('SASL: Only mechanism(s) ' + candidates.join(' and ') + ' are supported')
  }

  if (mechanism === 'SCRAM-SHA-256-PLUS' && typeof stream.getPeerCertificate !== 'function') {
    // this should never happen if we are really talking to a Postgres server
    throw new Error('SASL: Mechanism SCRAM-SHA-256-PLUS requires a certificate')
  }

  const clientNonce = crypto$1.randomBytes(18).toString('base64');
  const gs2Header = mechanism === 'SCRAM-SHA-256-PLUS' ? 'p=tls-server-end-point' : stream ? 'y' : 'n';

  return {
    mechanism,
    clientNonce,
    response: gs2Header + ',,n=*,r=' + clientNonce,
    message: 'SASLInitialResponse',
  }
}

async function continueSession(session, password, serverData, stream) {
  if (session.message !== 'SASLInitialResponse') {
    throw new Error('SASL: Last message was not SASLInitialResponse')
  }
  if (typeof password !== 'string') {
    throw new Error('SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string')
  }
  if (password === '') {
    throw new Error('SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a non-empty string')
  }
  if (typeof serverData !== 'string') {
    throw new Error('SASL: SCRAM-SERVER-FIRST-MESSAGE: serverData must be a string')
  }

  const sv = parseServerFirstMessage(serverData);

  if (!sv.nonce.startsWith(session.clientNonce)) {
    throw new Error('SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce')
  } else if (sv.nonce.length === session.clientNonce.length) {
    throw new Error('SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce is too short')
  }

  const clientFirstMessageBare = 'n=*,r=' + session.clientNonce;
  const serverFirstMessage = 'r=' + sv.nonce + ',s=' + sv.salt + ',i=' + sv.iteration;

  // without channel binding:
  let channelBinding = stream ? 'eSws' : 'biws'; // 'y,,' or 'n,,', base64-encoded

  // override if channel binding is in use:
  if (session.mechanism === 'SCRAM-SHA-256-PLUS') {
    const peerCert = stream.getPeerCertificate().raw;
    let hashName = signatureAlgorithmHashFromCertificate(peerCert);
    if (hashName === 'MD5' || hashName === 'SHA-1') hashName = 'SHA-256';
    const certHash = await crypto$1.hashByName(hashName, peerCert);
    const bindingData = Buffer.concat([Buffer.from('p=tls-server-end-point,,'), Buffer.from(certHash)]);
    channelBinding = bindingData.toString('base64');
  }

  const clientFinalMessageWithoutProof = 'c=' + channelBinding + ',r=' + sv.nonce;
  const authMessage = clientFirstMessageBare + ',' + serverFirstMessage + ',' + clientFinalMessageWithoutProof;

  const saltBytes = Buffer.from(sv.salt, 'base64');
  const saltedPassword = await crypto$1.deriveKey(password, saltBytes, sv.iteration);
  const clientKey = await crypto$1.hmacSha256(saltedPassword, 'Client Key');
  const storedKey = await crypto$1.sha256(clientKey);
  const clientSignature = await crypto$1.hmacSha256(storedKey, authMessage);
  const clientProof = xorBuffers(Buffer.from(clientKey), Buffer.from(clientSignature)).toString('base64');
  const serverKey = await crypto$1.hmacSha256(saltedPassword, 'Server Key');
  const serverSignatureBytes = await crypto$1.hmacSha256(serverKey, authMessage);

  session.message = 'SASLResponse';
  session.serverSignature = Buffer.from(serverSignatureBytes).toString('base64');
  session.response = clientFinalMessageWithoutProof + ',p=' + clientProof;
}

function finalizeSession(session, serverData) {
  if (session.message !== 'SASLResponse') {
    throw new Error('SASL: Last message was not SASLResponse')
  }
  if (typeof serverData !== 'string') {
    throw new Error('SASL: SCRAM-SERVER-FINAL-MESSAGE: serverData must be a string')
  }

  const { serverSignature } = parseServerFinalMessage(serverData);

  if (serverSignature !== session.serverSignature) {
    throw new Error('SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature does not match')
  }
}

/**
 * printable       = %x21-2B / %x2D-7E
 *                   ;; Printable ASCII except ",".
 *                   ;; Note that any "printable" is also
 *                   ;; a valid "value".
 */
function isPrintableChars(text) {
  if (typeof text !== 'string') {
    throw new TypeError('SASL: text must be a string')
  }
  return text
    .split('')
    .map((_, i) => text.charCodeAt(i))
    .every((c) => (c >= 0x21 && c <= 0x2b) || (c >= 0x2d && c <= 0x7e))
}

/**
 * base64-char     = ALPHA / DIGIT / "/" / "+"
 *
 * base64-4        = 4base64-char
 *
 * base64-3        = 3base64-char "="
 *
 * base64-2        = 2base64-char "=="
 *
 * base64          = *base64-4 [base64-3 / base64-2]
 */
function isBase64(text) {
  return /^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(text)
}

function parseAttributePairs(text) {
  if (typeof text !== 'string') {
    throw new TypeError('SASL: attribute pairs text must be a string')
  }

  return new Map(
    text.split(',').map((attrValue) => {
      if (!/^.=/.test(attrValue)) {
        throw new Error('SASL: Invalid attribute pair entry')
      }
      const name = attrValue[0];
      const value = attrValue.substring(2);
      return [name, value]
    })
  )
}

function parseServerFirstMessage(data) {
  const attrPairs = parseAttributePairs(data);

  const nonce = attrPairs.get('r');
  if (!nonce) {
    throw new Error('SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing')
  } else if (!isPrintableChars(nonce)) {
    throw new Error('SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce must only contain printable characters')
  }
  const salt = attrPairs.get('s');
  if (!salt) {
    throw new Error('SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing')
  } else if (!isBase64(salt)) {
    throw new Error('SASL: SCRAM-SERVER-FIRST-MESSAGE: salt must be base64')
  }
  const iterationText = attrPairs.get('i');
  if (!iterationText) {
    throw new Error('SASL: SCRAM-SERVER-FIRST-MESSAGE: iteration missing')
  } else if (!/^[1-9][0-9]*$/.test(iterationText)) {
    throw new Error('SASL: SCRAM-SERVER-FIRST-MESSAGE: invalid iteration count')
  }
  const iteration = parseInt(iterationText, 10);

  return {
    nonce,
    salt,
    iteration,
  }
}

function parseServerFinalMessage(serverData) {
  const attrPairs = parseAttributePairs(serverData);
  const serverSignature = attrPairs.get('v');
  if (!serverSignature) {
    throw new Error('SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature is missing')
  } else if (!isBase64(serverSignature)) {
    throw new Error('SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature must be base64')
  }
  return {
    serverSignature,
  }
}

function xorBuffers(a, b) {
  if (!Buffer.isBuffer(a)) {
    throw new TypeError('first argument must be a Buffer')
  }
  if (!Buffer.isBuffer(b)) {
    throw new TypeError('second argument must be a Buffer')
  }
  if (a.length !== b.length) {
    throw new Error('Buffer lengths must match')
  }
  if (a.length === 0) {
    throw new Error('Buffers cannot be empty')
  }
  return Buffer.from(a.map((_, i) => a[i] ^ b[i]))
}

var sasl$1 = {
  startSession,
  continueSession,
  finalizeSession,
};

const types$2 = /*@__PURE__*/ requirePgTypes();

function TypeOverrides$2(userTypes) {
  this._types = userTypes || types$2;
  this.text = {};
  this.binary = {};
}

TypeOverrides$2.prototype.getOverrides = function (format) {
  switch (format) {
    case 'text':
      return this.text
    case 'binary':
      return this.binary
    default:
      return {}
  }
};

TypeOverrides$2.prototype.setTypeParser = function (oid, format, parseFn) {
  if (typeof format === 'function') {
    parseFn = format;
    format = 'text';
  }
  this.getOverrides(format)[oid] = parseFn;
};

TypeOverrides$2.prototype.getTypeParser = function (oid, format) {
  format = format || 'text';
  return this.getOverrides(format)[oid] || this._types.getTypeParser(oid, format)
};

var typeOverrides = TypeOverrides$2;

const require$$0$2 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(dns$1);

//Parse method copied from https://github.com/brianc/node-postgres
//Copyright (c) 2010-2014 Brian Carlson (brian.m.carlson@gmail.com)
//MIT License

//parses a connection string
function parse$5(str, options = {}) {
  //unix socket
  if (str.charAt(0) === '/') {
    const config = str.split(' ');
    return { host: config[0], database: config[1] }
  }

  // Check for empty host in URL

  const config = {};
  let result;
  let dummyHost = false;
  if (/ |%[^a-f0-9]|%[a-f0-9][^a-f0-9]/i.test(str)) {
    // Ensure spaces are encoded as %20
    str = encodeURI(str).replace(/%25(\d\d)/g, '%$1');
  }

  try {
    try {
      result = new URL(str, 'postgres://base');
    } catch (e) {
      // The URL is invalid so try again with a dummy host
      result = new URL(str.replace('@/', '@___DUMMY___/'), 'postgres://base');
      dummyHost = true;
    }
  } catch (err) {
    // Remove the input from the error message to avoid leaking sensitive information
    err.input && (err.input = '*****REDACTED*****');
  }

  // We'd like to use Object.fromEntries() here but Node.js 10 does not support it
  for (const entry of result.searchParams.entries()) {
    config[entry[0]] = entry[1];
  }

  config.user = config.user || decodeURIComponent(result.username);
  config.password = config.password || decodeURIComponent(result.password);

  if (result.protocol == 'socket:') {
    config.host = decodeURI(result.pathname);
    config.database = result.searchParams.get('db');
    config.client_encoding = result.searchParams.get('encoding');
    return config
  }
  const hostname = dummyHost ? '' : result.hostname;
  if (!config.host) {
    // Only set the host if there is no equivalent query param.
    config.host = decodeURIComponent(hostname);
  } else if (hostname && /^%2f/i.test(hostname)) {
    // Only prepend the hostname to the pathname if it is not a URL encoded Unix socket host.
    result.pathname = hostname + result.pathname;
  }
  if (!config.port) {
    // Only set the port if there is no equivalent query param.
    config.port = result.port;
  }

  const pathname = result.pathname.slice(1) || null;
  config.database = pathname ? decodeURI(pathname) : null;

  if (config.ssl === 'true' || config.ssl === '1') {
    config.ssl = true;
  }

  if (config.ssl === '0') {
    config.ssl = false;
  }

  if (config.sslcert || config.sslkey || config.sslrootcert || config.sslmode) {
    config.ssl = {};
  }

  // Only try to load fs if we expect to read from the disk
  const fs = config.sslcert || config.sslkey || config.sslrootcert ? require$$1$c : null;

  if (config.sslcert) {
    config.ssl.cert = fs.readFileSync(config.sslcert).toString();
  }

  if (config.sslkey) {
    config.ssl.key = fs.readFileSync(config.sslkey).toString();
  }

  if (config.sslrootcert) {
    config.ssl.ca = fs.readFileSync(config.sslrootcert).toString();
  }

  if (options.useLibpqCompat && config.uselibpqcompat) {
    throw new Error('Both useLibpqCompat and uselibpqcompat are set. Please use only one of them.')
  }

  if (config.uselibpqcompat === 'true' || options.useLibpqCompat) {
    switch (config.sslmode) {
      case 'disable': {
        config.ssl = false;
        break
      }
      case 'prefer': {
        config.ssl.rejectUnauthorized = false;
        break
      }
      case 'require': {
        if (config.sslrootcert) {
          // If a root CA is specified, behavior of `sslmode=require` will be the same as that of `verify-ca`
          config.ssl.checkServerIdentity = function () {};
        } else {
          config.ssl.rejectUnauthorized = false;
        }
        break
      }
      case 'verify-ca': {
        if (!config.ssl.ca) {
          throw new Error(
            'SECURITY WARNING: Using sslmode=verify-ca requires specifying a CA with sslrootcert. If a public CA is used, verify-ca allows connections to a server that somebody else may have registered with the CA, making you vulnerable to Man-in-the-Middle attacks. Either specify a custom CA certificate with sslrootcert parameter or use sslmode=verify-full for proper security.'
          )
        }
        config.ssl.checkServerIdentity = function () {};
        break
      }
    }
  } else {
    switch (config.sslmode) {
      case 'disable': {
        config.ssl = false;
        break
      }
      case 'prefer':
      case 'require':
      case 'verify-ca':
      case 'verify-full': {
        break
      }
      case 'no-verify': {
        config.ssl.rejectUnauthorized = false;
        break
      }
    }
  }

  return config
}

// convert pg-connection-string ssl config to a ClientConfig.ConnectionOptions
function toConnectionOptions(sslConfig) {
  const connectionOptions = Object.entries(sslConfig).reduce((c, [key, value]) => {
    // we explicitly check for undefined and null instead of `if (value)` because some
    // options accept falsy values. Example: `ssl.rejectUnauthorized = false`
    if (value !== undefined && value !== null) {
      c[key] = value;
    }

    return c
  }, {});

  return connectionOptions
}

// convert pg-connection-string config to a ClientConfig
function toClientConfig$1(config) {
  const poolConfig = Object.entries(config).reduce((c, [key, value]) => {
    if (key === 'ssl') {
      const sslConfig = value;

      if (typeof sslConfig === 'boolean') {
        c[key] = sslConfig;
      }

      if (typeof sslConfig === 'object') {
        c[key] = toConnectionOptions(sslConfig);
      }
    } else if (value !== undefined && value !== null) {
      if (key === 'port') {
        // when port is not specified, it is converted into an empty string
        // we want to avoid NaN or empty string as a values in ClientConfig
        if (value !== '') {
          const v = parseInt(value, 10);
          if (isNaN(v)) {
            throw new Error(`Invalid ${key}: ${value}`)
          }

          c[key] = v;
        }
      } else {
        c[key] = value;
      }
    }

    return c
  }, {});

  return poolConfig
}

// parses a connection string into ClientConfig
function parseIntoClientConfig$1(str) {
  return toClientConfig$1(parse$5(str))
}

var pgConnectionString = parse$5;

parse$5.parse = parse$5;
parse$5.toClientConfig = toClientConfig$1;
parse$5.parseIntoClientConfig = parseIntoClientConfig$1;

const connectionString = /*@__PURE__*/getDefaultExportFromCjs(pgConnectionString);

// ESM wrapper for pg-connection-string

// Re-export the parse function
const index$1 = connectionString.parse;
const parse$4 = connectionString.parse;
const toClientConfig = connectionString.toClientConfig;
const parseIntoClientConfig = connectionString.parseIntoClientConfig;

const esm$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index$1,
  parse: parse$4,
  parseIntoClientConfig: parseIntoClientConfig,
  toClientConfig: toClientConfig
}, Symbol.toStringTag, { value: 'Module' }));

const require$$2$2 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(esm$3);

const dns = require$$0$2;

const defaults$2 = defaultsExports;

const parse$3 = require$$2$2.parse; // parses a connection string

const val = function (key, config, envVar) {
  if (envVar === undefined) {
    envVar = process.env['PG' + key.toUpperCase()];
  } else if (envVar === false) ; else {
    envVar = process.env[envVar];
  }

  return config[key] || envVar || defaults$2[key]
};

const readSSLConfigFromEnvironment = function () {
  switch (process.env.PGSSLMODE) {
    case 'disable':
      return false
    case 'prefer':
    case 'require':
    case 'verify-ca':
    case 'verify-full':
      return true
    case 'no-verify':
      return { rejectUnauthorized: false }
  }
  return defaults$2.ssl
};

// Convert arg to a string, surround in single quotes, and escape single quotes and backslashes
const quoteParamValue = function (value) {
  return "'" + ('' + value).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'"
};

const add = function (params, config, paramName) {
  const value = config[paramName];
  if (value !== undefined && value !== null) {
    params.push(paramName + '=' + quoteParamValue(value));
  }
};

let ConnectionParameters$1 = class ConnectionParameters {
  constructor(config) {
    // if a string is passed, it is a raw connection string so we parse it into a config
    config = typeof config === 'string' ? parse$3(config) : config || {};

    // if the config has a connectionString defined, parse IT into the config we use
    // this will override other default values with what is stored in connectionString
    if (config.connectionString) {
      config = Object.assign({}, config, parse$3(config.connectionString));
    }

    this.user = val('user', config);
    this.database = val('database', config);

    if (this.database === undefined) {
      this.database = this.user;
    }

    this.port = parseInt(val('port', config), 10);
    this.host = val('host', config);

    // "hiding" the password so it doesn't show up in stack traces
    // or if the client is console.logged
    Object.defineProperty(this, 'password', {
      configurable: true,
      enumerable: false,
      writable: true,
      value: val('password', config),
    });

    this.binary = val('binary', config);
    this.options = val('options', config);

    this.ssl = typeof config.ssl === 'undefined' ? readSSLConfigFromEnvironment() : config.ssl;

    if (typeof this.ssl === 'string') {
      if (this.ssl === 'true') {
        this.ssl = true;
      }
    }
    // support passing in ssl=no-verify via connection string
    if (this.ssl === 'no-verify') {
      this.ssl = { rejectUnauthorized: false };
    }
    if (this.ssl && this.ssl.key) {
      Object.defineProperty(this.ssl, 'key', {
        enumerable: false,
      });
    }

    this.client_encoding = val('client_encoding', config);
    this.replication = val('replication', config);
    // a domain socket begins with '/'
    this.isDomainSocket = !(this.host || '').indexOf('/');

    this.application_name = val('application_name', config, 'PGAPPNAME');
    this.fallback_application_name = val('fallback_application_name', config, false);
    this.statement_timeout = val('statement_timeout', config, false);
    this.lock_timeout = val('lock_timeout', config, false);
    this.idle_in_transaction_session_timeout = val('idle_in_transaction_session_timeout', config, false);
    this.query_timeout = val('query_timeout', config, false);

    if (config.connectionTimeoutMillis === undefined) {
      this.connect_timeout = process.env.PGCONNECT_TIMEOUT || 0;
    } else {
      this.connect_timeout = Math.floor(config.connectionTimeoutMillis / 1000);
    }

    if (config.keepAlive === false) {
      this.keepalives = 0;
    } else if (config.keepAlive === true) {
      this.keepalives = 1;
    }

    if (typeof config.keepAliveInitialDelayMillis === 'number') {
      this.keepalives_idle = Math.floor(config.keepAliveInitialDelayMillis / 1000);
    }
  }

  getLibpqConnectionString(cb) {
    const params = [];
    add(params, this, 'user');
    add(params, this, 'password');
    add(params, this, 'port');
    add(params, this, 'application_name');
    add(params, this, 'fallback_application_name');
    add(params, this, 'connect_timeout');
    add(params, this, 'options');

    const ssl = typeof this.ssl === 'object' ? this.ssl : this.ssl ? { sslmode: this.ssl } : {};
    add(params, ssl, 'sslmode');
    add(params, ssl, 'sslca');
    add(params, ssl, 'sslkey');
    add(params, ssl, 'sslcert');
    add(params, ssl, 'sslrootcert');

    if (this.database) {
      params.push('dbname=' + quoteParamValue(this.database));
    }
    if (this.replication) {
      params.push('replication=' + quoteParamValue(this.replication));
    }
    if (this.host) {
      params.push('host=' + quoteParamValue(this.host));
    }
    if (this.isDomainSocket) {
      return cb(null, params.join(' '))
    }
    if (this.client_encoding) {
      params.push('client_encoding=' + quoteParamValue(this.client_encoding));
    }
    dns.lookup(this.host, function (err, address) {
      if (err) return cb(err, null)
      params.push('hostaddr=' + quoteParamValue(address));
      return cb(null, params.join(' '))
    });
  }
};

var connectionParameters = ConnectionParameters$1;

const types$1 = /*@__PURE__*/ requirePgTypes();

const matchRegexp = /^([A-Za-z]+)(?: (\d+))?(?: (\d+))?/;

// result object returned from query
// in the 'end' event and also
// passed as second argument to provided callback
let Result$2 = class Result {
  constructor(rowMode, types) {
    this.command = null;
    this.rowCount = null;
    this.oid = null;
    this.rows = [];
    this.fields = [];
    this._parsers = undefined;
    this._types = types;
    this.RowCtor = null;
    this.rowAsArray = rowMode === 'array';
    if (this.rowAsArray) {
      this.parseRow = this._parseRowAsArray;
    }
    this._prebuiltEmptyResultObject = null;
  }

  // adds a command complete message
  addCommandComplete(msg) {
    let match;
    if (msg.text) {
      // pure javascript
      match = matchRegexp.exec(msg.text);
    } else {
      // native bindings
      match = matchRegexp.exec(msg.command);
    }
    if (match) {
      this.command = match[1];
      if (match[3]) {
        // COMMAND OID ROWS
        this.oid = parseInt(match[2], 10);
        this.rowCount = parseInt(match[3], 10);
      } else if (match[2]) {
        // COMMAND ROWS
        this.rowCount = parseInt(match[2], 10);
      }
    }
  }

  _parseRowAsArray(rowData) {
    const row = new Array(rowData.length);
    for (let i = 0, len = rowData.length; i < len; i++) {
      const rawValue = rowData[i];
      if (rawValue !== null) {
        row[i] = this._parsers[i](rawValue);
      } else {
        row[i] = null;
      }
    }
    return row
  }

  parseRow(rowData) {
    const row = { ...this._prebuiltEmptyResultObject };
    for (let i = 0, len = rowData.length; i < len; i++) {
      const rawValue = rowData[i];
      const field = this.fields[i].name;
      if (rawValue !== null) {
        const v = this.fields[i].format === 'binary' ? Buffer.from(rawValue) : rawValue;
        row[field] = this._parsers[i](v);
      } else {
        row[field] = null;
      }
    }
    return row
  }

  addRow(row) {
    this.rows.push(row);
  }

  addFields(fieldDescriptions) {
    // clears field definitions
    // multiple query statements in 1 action can result in multiple sets
    // of rowDescriptions...eg: 'select NOW(); select 1::int;'
    // you need to reset the fields
    this.fields = fieldDescriptions;
    if (this.fields.length) {
      this._parsers = new Array(fieldDescriptions.length);
    }

    const row = {};

    for (let i = 0; i < fieldDescriptions.length; i++) {
      const desc = fieldDescriptions[i];
      row[desc.name] = null;

      if (this._types) {
        this._parsers[i] = this._types.getTypeParser(desc.dataTypeID, desc.format || 'text');
      } else {
        this._parsers[i] = types$1.getTypeParser(desc.dataTypeID, desc.format || 'text');
      }
    }

    this._prebuiltEmptyResultObject = { ...row };
  }
};

var result = Result$2;

const { EventEmitter: EventEmitter$3 } = require$$2$b;

const Result$1 = result;
const utils$3 = utils$5;

let Query$2 = class Query extends EventEmitter$3 {
  constructor(config, values, callback) {
    super();

    config = utils$3.normalizeQueryConfig(config, values, callback);

    this.text = config.text;
    this.values = config.values;
    this.rows = config.rows;
    this.types = config.types;
    this.name = config.name;
    this.queryMode = config.queryMode;
    this.binary = config.binary;
    // use unique portal name each time
    this.portal = config.portal || '';
    this.callback = config.callback;
    this._rowMode = config.rowMode;
    if (process.domain && config.callback) {
      this.callback = process.domain.bind(config.callback);
    }
    this._result = new Result$1(this._rowMode, this.types);

    // potential for multiple results
    this._results = this._result;
    this._canceledDueToError = false;
  }

  requiresPreparation() {
    if (this.queryMode === 'extended') {
      return true
    }

    // named queries must always be prepared
    if (this.name) {
      return true
    }
    // always prepare if there are max number of rows expected per
    // portal execution
    if (this.rows) {
      return true
    }
    // don't prepare empty text queries
    if (!this.text) {
      return false
    }
    // prepare if there are values
    if (!this.values) {
      return false
    }
    return this.values.length > 0
  }

  _checkForMultirow() {
    // if we already have a result with a command property
    // then we've already executed one query in a multi-statement simple query
    // turn our results into an array of results
    if (this._result.command) {
      if (!Array.isArray(this._results)) {
        this._results = [this._result];
      }
      this._result = new Result$1(this._rowMode, this._result._types);
      this._results.push(this._result);
    }
  }

  // associates row metadata from the supplied
  // message with this query object
  // metadata used when parsing row results
  handleRowDescription(msg) {
    this._checkForMultirow();
    this._result.addFields(msg.fields);
    this._accumulateRows = this.callback || !this.listeners('row').length;
  }

  handleDataRow(msg) {
    let row;

    if (this._canceledDueToError) {
      return
    }

    try {
      row = this._result.parseRow(msg.fields);
    } catch (err) {
      this._canceledDueToError = err;
      return
    }

    this.emit('row', row, this._result);
    if (this._accumulateRows) {
      this._result.addRow(row);
    }
  }

  handleCommandComplete(msg, connection) {
    this._checkForMultirow();
    this._result.addCommandComplete(msg);
    // need to sync after each command complete of a prepared statement
    // if we were using a row count which results in multiple calls to _getRows
    if (this.rows) {
      connection.sync();
    }
  }

  // if a named prepared statement is created with empty query text
  // the backend will send an emptyQuery message but *not* a command complete message
  // since we pipeline sync immediately after execute we don't need to do anything here
  // unless we have rows specified, in which case we did not pipeline the initial sync call
  handleEmptyQuery(connection) {
    if (this.rows) {
      connection.sync();
    }
  }

  handleError(err, connection) {
    // need to sync after error during a prepared statement
    if (this._canceledDueToError) {
      err = this._canceledDueToError;
      this._canceledDueToError = false;
    }
    // if callback supplied do not emit error event as uncaught error
    // events will bubble up to node process
    if (this.callback) {
      return this.callback(err)
    }
    this.emit('error', err);
  }

  handleReadyForQuery(con) {
    if (this._canceledDueToError) {
      return this.handleError(this._canceledDueToError, con)
    }
    if (this.callback) {
      try {
        this.callback(null, this._results);
      } catch (err) {
        process.nextTick(() => {
          throw err
        });
      }
    }
    this.emit('end', this._results);
  }

  submit(connection) {
    if (typeof this.text !== 'string' && typeof this.name !== 'string') {
      return new Error('A query must have either text or a name. Supplying neither is unsupported.')
    }
    const previous = connection.parsedStatements[this.name];
    if (this.text && previous && this.text !== previous) {
      return new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`)
    }
    if (this.values && !Array.isArray(this.values)) {
      return new Error('Query values must be an array')
    }
    if (this.requiresPreparation()) {
      // If we're using the extended query protocol we fire off several separate commands
      // to the backend. On some versions of node & some operating system versions
      // the network stack writes each message separately instead of buffering them together
      // causing the client & network to send more slowly. Corking & uncorking the stream
      // allows node to buffer up the messages internally before sending them all off at once.
      // note: we're checking for existence of cork/uncork because some versions of streams
      // might not have this (cloudflare?)
      connection.stream.cork && connection.stream.cork();
      try {
        this.prepare(connection);
      } finally {
        // while unlikely for this.prepare to throw, if it does & we don't uncork this stream
        // this client becomes unresponsive, so put in finally block "just in case"
        connection.stream.uncork && connection.stream.uncork();
      }
    } else {
      connection.query(this.text);
    }
    return null
  }

  hasBeenParsed(connection) {
    return this.name && connection.parsedStatements[this.name]
  }

  handlePortalSuspended(connection) {
    this._getRows(connection, this.rows);
  }

  _getRows(connection, rows) {
    connection.execute({
      portal: this.portal,
      rows: rows,
    });
    // if we're not reading pages of rows send the sync command
    // to indicate the pipeline is finished
    if (!rows) {
      connection.sync();
    } else {
      // otherwise flush the call out to read more rows
      connection.flush();
    }
  }

  // http://developer.postgresql.org/pgdocs/postgres/protocol-flow.html#PROTOCOL-FLOW-EXT-QUERY
  prepare(connection) {
    // TODO refactor this poor encapsulation
    if (!this.hasBeenParsed(connection)) {
      connection.parse({
        text: this.text,
        name: this.name,
        types: this.types,
      });
    }

    // because we're mapping user supplied values to
    // postgres wire protocol compatible values it could
    // throw an exception, so try/catch this section
    try {
      connection.bind({
        portal: this.portal,
        statement: this.name,
        values: this.values,
        binary: this.binary,
        valueMapper: utils$3.prepareValue,
      });
    } catch (err) {
      this.handleError(err, connection);
      return
    }

    connection.describe({
      type: 'P',
      name: this.portal || '',
    });

    this._getRows(connection, this.rows);
  }

  handleCopyInResponse(connection) {
    connection.sendCopyFail('No source stream defined');
  }

  handleCopyData(msg, connection) {
    // noop
  }
};

var query$2 = Query$2;

var dist = {};

var messages = {};

Object.defineProperty(messages, "__esModule", { value: true });
messages.NoticeMessage = messages.DataRowMessage = messages.CommandCompleteMessage = messages.ReadyForQueryMessage = messages.NotificationResponseMessage = messages.BackendKeyDataMessage = messages.AuthenticationMD5Password = messages.ParameterStatusMessage = messages.ParameterDescriptionMessage = messages.RowDescriptionMessage = messages.Field = messages.CopyResponse = messages.CopyDataMessage = messages.DatabaseError = messages.copyDone = messages.emptyQuery = messages.replicationStart = messages.portalSuspended = messages.noData = messages.closeComplete = messages.bindComplete = messages.parseComplete = void 0;
messages.parseComplete = {
    name: 'parseComplete',
    length: 5,
};
messages.bindComplete = {
    name: 'bindComplete',
    length: 5,
};
messages.closeComplete = {
    name: 'closeComplete',
    length: 5,
};
messages.noData = {
    name: 'noData',
    length: 5,
};
messages.portalSuspended = {
    name: 'portalSuspended',
    length: 5,
};
messages.replicationStart = {
    name: 'replicationStart',
    length: 4,
};
messages.emptyQuery = {
    name: 'emptyQuery',
    length: 4,
};
messages.copyDone = {
    name: 'copyDone',
    length: 4,
};
let DatabaseError$2 = class DatabaseError extends Error {
    constructor(message, length, name) {
        super(message);
        this.length = length;
        this.name = name;
    }
};
messages.DatabaseError = DatabaseError$2;
class CopyDataMessage {
    constructor(length, chunk) {
        this.length = length;
        this.chunk = chunk;
        this.name = 'copyData';
    }
}
messages.CopyDataMessage = CopyDataMessage;
class CopyResponse {
    constructor(length, name, binary, columnCount) {
        this.length = length;
        this.name = name;
        this.binary = binary;
        this.columnTypes = new Array(columnCount);
    }
}
messages.CopyResponse = CopyResponse;
class Field {
    constructor(name, tableID, columnID, dataTypeID, dataTypeSize, dataTypeModifier, format) {
        this.name = name;
        this.tableID = tableID;
        this.columnID = columnID;
        this.dataTypeID = dataTypeID;
        this.dataTypeSize = dataTypeSize;
        this.dataTypeModifier = dataTypeModifier;
        this.format = format;
    }
}
messages.Field = Field;
class RowDescriptionMessage {
    constructor(length, fieldCount) {
        this.length = length;
        this.fieldCount = fieldCount;
        this.name = 'rowDescription';
        this.fields = new Array(this.fieldCount);
    }
}
messages.RowDescriptionMessage = RowDescriptionMessage;
class ParameterDescriptionMessage {
    constructor(length, parameterCount) {
        this.length = length;
        this.parameterCount = parameterCount;
        this.name = 'parameterDescription';
        this.dataTypeIDs = new Array(this.parameterCount);
    }
}
messages.ParameterDescriptionMessage = ParameterDescriptionMessage;
class ParameterStatusMessage {
    constructor(length, parameterName, parameterValue) {
        this.length = length;
        this.parameterName = parameterName;
        this.parameterValue = parameterValue;
        this.name = 'parameterStatus';
    }
}
messages.ParameterStatusMessage = ParameterStatusMessage;
class AuthenticationMD5Password {
    constructor(length, salt) {
        this.length = length;
        this.salt = salt;
        this.name = 'authenticationMD5Password';
    }
}
messages.AuthenticationMD5Password = AuthenticationMD5Password;
class BackendKeyDataMessage {
    constructor(length, processID, secretKey) {
        this.length = length;
        this.processID = processID;
        this.secretKey = secretKey;
        this.name = 'backendKeyData';
    }
}
messages.BackendKeyDataMessage = BackendKeyDataMessage;
class NotificationResponseMessage {
    constructor(length, processId, channel, payload) {
        this.length = length;
        this.processId = processId;
        this.channel = channel;
        this.payload = payload;
        this.name = 'notification';
    }
}
messages.NotificationResponseMessage = NotificationResponseMessage;
class ReadyForQueryMessage {
    constructor(length, status) {
        this.length = length;
        this.status = status;
        this.name = 'readyForQuery';
    }
}
messages.ReadyForQueryMessage = ReadyForQueryMessage;
class CommandCompleteMessage {
    constructor(length, text) {
        this.length = length;
        this.text = text;
        this.name = 'commandComplete';
    }
}
messages.CommandCompleteMessage = CommandCompleteMessage;
class DataRowMessage {
    constructor(length, fields) {
        this.length = length;
        this.fields = fields;
        this.name = 'dataRow';
        this.fieldCount = fields.length;
    }
}
messages.DataRowMessage = DataRowMessage;
class NoticeMessage {
    constructor(length, message) {
        this.length = length;
        this.message = message;
        this.name = 'notice';
    }
}
messages.NoticeMessage = NoticeMessage;

var serializer = {};

var bufferWriter = {};

//binary data writer tuned for encoding binary specific to the postgres binary protocol
Object.defineProperty(bufferWriter, "__esModule", { value: true });
bufferWriter.Writer = void 0;
class Writer {
    constructor(size = 256) {
        this.size = size;
        this.offset = 5;
        this.headerPosition = 0;
        this.buffer = Buffer.allocUnsafe(size);
    }
    ensure(size) {
        const remaining = this.buffer.length - this.offset;
        if (remaining < size) {
            const oldBuffer = this.buffer;
            // exponential growth factor of around ~ 1.5
            // https://stackoverflow.com/questions/2269063/buffer-growth-strategy
            const newSize = oldBuffer.length + (oldBuffer.length >> 1) + size;
            this.buffer = Buffer.allocUnsafe(newSize);
            oldBuffer.copy(this.buffer);
        }
    }
    addInt32(num) {
        this.ensure(4);
        this.buffer[this.offset++] = (num >>> 24) & 0xff;
        this.buffer[this.offset++] = (num >>> 16) & 0xff;
        this.buffer[this.offset++] = (num >>> 8) & 0xff;
        this.buffer[this.offset++] = (num >>> 0) & 0xff;
        return this;
    }
    addInt16(num) {
        this.ensure(2);
        this.buffer[this.offset++] = (num >>> 8) & 0xff;
        this.buffer[this.offset++] = (num >>> 0) & 0xff;
        return this;
    }
    addCString(string) {
        if (!string) {
            this.ensure(1);
        }
        else {
            const len = Buffer.byteLength(string);
            this.ensure(len + 1); // +1 for null terminator
            this.buffer.write(string, this.offset, 'utf-8');
            this.offset += len;
        }
        this.buffer[this.offset++] = 0; // null terminator
        return this;
    }
    addString(string = '') {
        const len = Buffer.byteLength(string);
        this.ensure(len);
        this.buffer.write(string, this.offset);
        this.offset += len;
        return this;
    }
    add(otherBuffer) {
        this.ensure(otherBuffer.length);
        otherBuffer.copy(this.buffer, this.offset);
        this.offset += otherBuffer.length;
        return this;
    }
    join(code) {
        if (code) {
            this.buffer[this.headerPosition] = code;
            //length is everything in this packet minus the code
            const length = this.offset - (this.headerPosition + 1);
            this.buffer.writeInt32BE(length, this.headerPosition + 1);
        }
        return this.buffer.slice(code ? 0 : 5, this.offset);
    }
    flush(code) {
        const result = this.join(code);
        this.offset = 5;
        this.headerPosition = 0;
        this.buffer = Buffer.allocUnsafe(this.size);
        return result;
    }
}
bufferWriter.Writer = Writer;

Object.defineProperty(serializer, "__esModule", { value: true });
serializer.serialize = void 0;
const buffer_writer_1 = bufferWriter;
const writer = new buffer_writer_1.Writer();
const startup = (opts) => {
    // protocol version
    writer.addInt16(3).addInt16(0);
    for (const key of Object.keys(opts)) {
        writer.addCString(key).addCString(opts[key]);
    }
    writer.addCString('client_encoding').addCString('UTF8');
    const bodyBuffer = writer.addCString('').flush();
    // this message is sent without a code
    const length = bodyBuffer.length + 4;
    return new buffer_writer_1.Writer().addInt32(length).add(bodyBuffer).flush();
};
const requestSsl = () => {
    const response = Buffer.allocUnsafe(8);
    response.writeInt32BE(8, 0);
    response.writeInt32BE(80877103, 4);
    return response;
};
const password = (password) => {
    return writer.addCString(password).flush(112 /* code.startup */);
};
const sendSASLInitialResponseMessage = function (mechanism, initialResponse) {
    // 0x70 = 'p'
    writer.addCString(mechanism).addInt32(Buffer.byteLength(initialResponse)).addString(initialResponse);
    return writer.flush(112 /* code.startup */);
};
const sendSCRAMClientFinalMessage = function (additionalData) {
    return writer.addString(additionalData).flush(112 /* code.startup */);
};
const query$1 = (text) => {
    return writer.addCString(text).flush(81 /* code.query */);
};
const emptyArray = [];
const parse$2 = (query) => {
    // expect something like this:
    // { name: 'queryName',
    //   text: 'select * from blah',
    //   types: ['int8', 'bool'] }
    // normalize missing query names to allow for null
    const name = query.name || '';
    if (name.length > 63) {
        console.error('Warning! Postgres only supports 63 characters for query names.');
        console.error('You supplied %s (%s)', name, name.length);
        console.error('This can cause conflicts and silent errors executing queries');
    }
    const types = query.types || emptyArray;
    const len = types.length;
    const buffer = writer
        .addCString(name) // name of query
        .addCString(query.text) // actual query text
        .addInt16(len);
    for (let i = 0; i < len; i++) {
        buffer.addInt32(types[i]);
    }
    return writer.flush(80 /* code.parse */);
};
const paramWriter = new buffer_writer_1.Writer();
const writeValues = function (values, valueMapper) {
    for (let i = 0; i < values.length; i++) {
        const mappedVal = valueMapper ? valueMapper(values[i], i) : values[i];
        if (mappedVal == null) {
            // add the param type (string) to the writer
            writer.addInt16(0 /* ParamType.STRING */);
            // write -1 to the param writer to indicate null
            paramWriter.addInt32(-1);
        }
        else if (mappedVal instanceof Buffer) {
            // add the param type (binary) to the writer
            writer.addInt16(1 /* ParamType.BINARY */);
            // add the buffer to the param writer
            paramWriter.addInt32(mappedVal.length);
            paramWriter.add(mappedVal);
        }
        else {
            // add the param type (string) to the writer
            writer.addInt16(0 /* ParamType.STRING */);
            paramWriter.addInt32(Buffer.byteLength(mappedVal));
            paramWriter.addString(mappedVal);
        }
    }
};
const bind = (config = {}) => {
    // normalize config
    const portal = config.portal || '';
    const statement = config.statement || '';
    const binary = config.binary || false;
    const values = config.values || emptyArray;
    const len = values.length;
    writer.addCString(portal).addCString(statement);
    writer.addInt16(len);
    writeValues(values, config.valueMapper);
    writer.addInt16(len);
    writer.add(paramWriter.flush());
    // all results use the same format code
    writer.addInt16(1);
    // format code
    writer.addInt16(binary ? 1 /* ParamType.BINARY */ : 0 /* ParamType.STRING */);
    return writer.flush(66 /* code.bind */);
};
const emptyExecute = Buffer.from([69 /* code.execute */, 0x00, 0x00, 0x00, 0x09, 0x00, 0x00, 0x00, 0x00, 0x00]);
const execute = (config) => {
    // this is the happy path for most queries
    if (!config || (!config.portal && !config.rows)) {
        return emptyExecute;
    }
    const portal = config.portal || '';
    const rows = config.rows || 0;
    const portalLength = Buffer.byteLength(portal);
    const len = 4 + portalLength + 1 + 4;
    // one extra bit for code
    const buff = Buffer.allocUnsafe(1 + len);
    buff[0] = 69 /* code.execute */;
    buff.writeInt32BE(len, 1);
    buff.write(portal, 5, 'utf-8');
    buff[portalLength + 5] = 0; // null terminate portal cString
    buff.writeUInt32BE(rows, buff.length - 4);
    return buff;
};
const cancel = (processID, secretKey) => {
    const buffer = Buffer.allocUnsafe(16);
    buffer.writeInt32BE(16, 0);
    buffer.writeInt16BE(1234, 4);
    buffer.writeInt16BE(5678, 6);
    buffer.writeInt32BE(processID, 8);
    buffer.writeInt32BE(secretKey, 12);
    return buffer;
};
const cstringMessage = (code, string) => {
    const stringLen = Buffer.byteLength(string);
    const len = 4 + stringLen + 1;
    // one extra bit for code
    const buffer = Buffer.allocUnsafe(1 + len);
    buffer[0] = code;
    buffer.writeInt32BE(len, 1);
    buffer.write(string, 5, 'utf-8');
    buffer[len] = 0; // null terminate cString
    return buffer;
};
const emptyDescribePortal = writer.addCString('P').flush(68 /* code.describe */);
const emptyDescribeStatement = writer.addCString('S').flush(68 /* code.describe */);
const describe = (msg) => {
    return msg.name
        ? cstringMessage(68 /* code.describe */, `${msg.type}${msg.name || ''}`)
        : msg.type === 'P'
            ? emptyDescribePortal
            : emptyDescribeStatement;
};
const close = (msg) => {
    const text = `${msg.type}${msg.name || ''}`;
    return cstringMessage(67 /* code.close */, text);
};
const copyData = (chunk) => {
    return writer.add(chunk).flush(100 /* code.copyFromChunk */);
};
const copyFail = (message) => {
    return cstringMessage(102 /* code.copyFail */, message);
};
const codeOnlyBuffer = (code) => Buffer.from([code, 0x00, 0x00, 0x00, 0x04]);
const flushBuffer$1 = codeOnlyBuffer(72 /* code.flush */);
const syncBuffer$1 = codeOnlyBuffer(83 /* code.sync */);
const endBuffer$1 = codeOnlyBuffer(88 /* code.end */);
const copyDoneBuffer = codeOnlyBuffer(99 /* code.copyDone */);
const serialize$2 = {
    startup,
    password,
    requestSsl,
    sendSASLInitialResponseMessage,
    sendSCRAMClientFinalMessage,
    query: query$1,
    parse: parse$2,
    bind,
    execute,
    describe,
    close,
    flush: () => flushBuffer$1,
    sync: () => syncBuffer$1,
    end: () => endBuffer$1,
    copyData,
    copyDone: () => copyDoneBuffer,
    copyFail,
    cancel,
};
serializer.serialize = serialize$2;

var parser = {};

var bufferReader = {};

Object.defineProperty(bufferReader, "__esModule", { value: true });
bufferReader.BufferReader = void 0;
const emptyBuffer$1 = Buffer.allocUnsafe(0);
class BufferReader {
    constructor(offset = 0) {
        this.offset = offset;
        this.buffer = emptyBuffer$1;
        // TODO(bmc): support non-utf8 encoding?
        this.encoding = 'utf-8';
    }
    setBuffer(offset, buffer) {
        this.offset = offset;
        this.buffer = buffer;
    }
    int16() {
        const result = this.buffer.readInt16BE(this.offset);
        this.offset += 2;
        return result;
    }
    byte() {
        const result = this.buffer[this.offset];
        this.offset++;
        return result;
    }
    int32() {
        const result = this.buffer.readInt32BE(this.offset);
        this.offset += 4;
        return result;
    }
    uint32() {
        const result = this.buffer.readUInt32BE(this.offset);
        this.offset += 4;
        return result;
    }
    string(length) {
        const result = this.buffer.toString(this.encoding, this.offset, this.offset + length);
        this.offset += length;
        return result;
    }
    cstring() {
        const start = this.offset;
        let end = start;
        // eslint-disable-next-line no-empty
        while (this.buffer[end++] !== 0) { }
        this.offset = end;
        return this.buffer.toString(this.encoding, start, end - 1);
    }
    bytes(length) {
        const result = this.buffer.slice(this.offset, this.offset + length);
        this.offset += length;
        return result;
    }
}
bufferReader.BufferReader = BufferReader;

Object.defineProperty(parser, "__esModule", { value: true });
parser.Parser = void 0;
const messages_1 = messages;
const buffer_reader_1 = bufferReader;
// every message is prefixed with a single bye
const CODE_LENGTH = 1;
// every message has an int32 length which includes itself but does
// NOT include the code in the length
const LEN_LENGTH = 4;
const HEADER_LENGTH = CODE_LENGTH + LEN_LENGTH;
const emptyBuffer = Buffer.allocUnsafe(0);
class Parser {
    constructor(opts) {
        this.buffer = emptyBuffer;
        this.bufferLength = 0;
        this.bufferOffset = 0;
        this.reader = new buffer_reader_1.BufferReader();
        if ((opts === null || opts === void 0 ? void 0 : opts.mode) === 'binary') {
            throw new Error('Binary mode not supported yet');
        }
        this.mode = (opts === null || opts === void 0 ? void 0 : opts.mode) || 'text';
    }
    parse(buffer, callback) {
        this.mergeBuffer(buffer);
        const bufferFullLength = this.bufferOffset + this.bufferLength;
        let offset = this.bufferOffset;
        while (offset + HEADER_LENGTH <= bufferFullLength) {
            // code is 1 byte long - it identifies the message type
            const code = this.buffer[offset];
            // length is 1 Uint32BE - it is the length of the message EXCLUDING the code
            const length = this.buffer.readUInt32BE(offset + CODE_LENGTH);
            const fullMessageLength = CODE_LENGTH + length;
            if (fullMessageLength + offset <= bufferFullLength) {
                const message = this.handlePacket(offset + HEADER_LENGTH, code, length, this.buffer);
                callback(message);
                offset += fullMessageLength;
            }
            else {
                break;
            }
        }
        if (offset === bufferFullLength) {
            // No more use for the buffer
            this.buffer = emptyBuffer;
            this.bufferLength = 0;
            this.bufferOffset = 0;
        }
        else {
            // Adjust the cursors of remainingBuffer
            this.bufferLength = bufferFullLength - offset;
            this.bufferOffset = offset;
        }
    }
    mergeBuffer(buffer) {
        if (this.bufferLength > 0) {
            const newLength = this.bufferLength + buffer.byteLength;
            const newFullLength = newLength + this.bufferOffset;
            if (newFullLength > this.buffer.byteLength) {
                // We can't concat the new buffer with the remaining one
                let newBuffer;
                if (newLength <= this.buffer.byteLength && this.bufferOffset >= this.bufferLength) {
                    // We can move the relevant part to the beginning of the buffer instead of allocating a new buffer
                    newBuffer = this.buffer;
                }
                else {
                    // Allocate a new larger buffer
                    let newBufferLength = this.buffer.byteLength * 2;
                    while (newLength >= newBufferLength) {
                        newBufferLength *= 2;
                    }
                    newBuffer = Buffer.allocUnsafe(newBufferLength);
                }
                // Move the remaining buffer to the new one
                this.buffer.copy(newBuffer, 0, this.bufferOffset, this.bufferOffset + this.bufferLength);
                this.buffer = newBuffer;
                this.bufferOffset = 0;
            }
            // Concat the new buffer with the remaining one
            buffer.copy(this.buffer, this.bufferOffset + this.bufferLength);
            this.bufferLength = newLength;
        }
        else {
            this.buffer = buffer;
            this.bufferOffset = 0;
            this.bufferLength = buffer.byteLength;
        }
    }
    handlePacket(offset, code, length, bytes) {
        switch (code) {
            case 50 /* MessageCodes.BindComplete */:
                return messages_1.bindComplete;
            case 49 /* MessageCodes.ParseComplete */:
                return messages_1.parseComplete;
            case 51 /* MessageCodes.CloseComplete */:
                return messages_1.closeComplete;
            case 110 /* MessageCodes.NoData */:
                return messages_1.noData;
            case 115 /* MessageCodes.PortalSuspended */:
                return messages_1.portalSuspended;
            case 99 /* MessageCodes.CopyDone */:
                return messages_1.copyDone;
            case 87 /* MessageCodes.ReplicationStart */:
                return messages_1.replicationStart;
            case 73 /* MessageCodes.EmptyQuery */:
                return messages_1.emptyQuery;
            case 68 /* MessageCodes.DataRow */:
                return this.parseDataRowMessage(offset, length, bytes);
            case 67 /* MessageCodes.CommandComplete */:
                return this.parseCommandCompleteMessage(offset, length, bytes);
            case 90 /* MessageCodes.ReadyForQuery */:
                return this.parseReadyForQueryMessage(offset, length, bytes);
            case 65 /* MessageCodes.NotificationResponse */:
                return this.parseNotificationMessage(offset, length, bytes);
            case 82 /* MessageCodes.AuthenticationResponse */:
                return this.parseAuthenticationResponse(offset, length, bytes);
            case 83 /* MessageCodes.ParameterStatus */:
                return this.parseParameterStatusMessage(offset, length, bytes);
            case 75 /* MessageCodes.BackendKeyData */:
                return this.parseBackendKeyData(offset, length, bytes);
            case 69 /* MessageCodes.ErrorMessage */:
                return this.parseErrorMessage(offset, length, bytes, 'error');
            case 78 /* MessageCodes.NoticeMessage */:
                return this.parseErrorMessage(offset, length, bytes, 'notice');
            case 84 /* MessageCodes.RowDescriptionMessage */:
                return this.parseRowDescriptionMessage(offset, length, bytes);
            case 116 /* MessageCodes.ParameterDescriptionMessage */:
                return this.parseParameterDescriptionMessage(offset, length, bytes);
            case 71 /* MessageCodes.CopyIn */:
                return this.parseCopyInMessage(offset, length, bytes);
            case 72 /* MessageCodes.CopyOut */:
                return this.parseCopyOutMessage(offset, length, bytes);
            case 100 /* MessageCodes.CopyData */:
                return this.parseCopyData(offset, length, bytes);
            default:
                return new messages_1.DatabaseError('received invalid response: ' + code.toString(16), length, 'error');
        }
    }
    parseReadyForQueryMessage(offset, length, bytes) {
        this.reader.setBuffer(offset, bytes);
        const status = this.reader.string(1);
        return new messages_1.ReadyForQueryMessage(length, status);
    }
    parseCommandCompleteMessage(offset, length, bytes) {
        this.reader.setBuffer(offset, bytes);
        const text = this.reader.cstring();
        return new messages_1.CommandCompleteMessage(length, text);
    }
    parseCopyData(offset, length, bytes) {
        const chunk = bytes.slice(offset, offset + (length - 4));
        return new messages_1.CopyDataMessage(length, chunk);
    }
    parseCopyInMessage(offset, length, bytes) {
        return this.parseCopyMessage(offset, length, bytes, 'copyInResponse');
    }
    parseCopyOutMessage(offset, length, bytes) {
        return this.parseCopyMessage(offset, length, bytes, 'copyOutResponse');
    }
    parseCopyMessage(offset, length, bytes, messageName) {
        this.reader.setBuffer(offset, bytes);
        const isBinary = this.reader.byte() !== 0;
        const columnCount = this.reader.int16();
        const message = new messages_1.CopyResponse(length, messageName, isBinary, columnCount);
        for (let i = 0; i < columnCount; i++) {
            message.columnTypes[i] = this.reader.int16();
        }
        return message;
    }
    parseNotificationMessage(offset, length, bytes) {
        this.reader.setBuffer(offset, bytes);
        const processId = this.reader.int32();
        const channel = this.reader.cstring();
        const payload = this.reader.cstring();
        return new messages_1.NotificationResponseMessage(length, processId, channel, payload);
    }
    parseRowDescriptionMessage(offset, length, bytes) {
        this.reader.setBuffer(offset, bytes);
        const fieldCount = this.reader.int16();
        const message = new messages_1.RowDescriptionMessage(length, fieldCount);
        for (let i = 0; i < fieldCount; i++) {
            message.fields[i] = this.parseField();
        }
        return message;
    }
    parseField() {
        const name = this.reader.cstring();
        const tableID = this.reader.uint32();
        const columnID = this.reader.int16();
        const dataTypeID = this.reader.uint32();
        const dataTypeSize = this.reader.int16();
        const dataTypeModifier = this.reader.int32();
        const mode = this.reader.int16() === 0 ? 'text' : 'binary';
        return new messages_1.Field(name, tableID, columnID, dataTypeID, dataTypeSize, dataTypeModifier, mode);
    }
    parseParameterDescriptionMessage(offset, length, bytes) {
        this.reader.setBuffer(offset, bytes);
        const parameterCount = this.reader.int16();
        const message = new messages_1.ParameterDescriptionMessage(length, parameterCount);
        for (let i = 0; i < parameterCount; i++) {
            message.dataTypeIDs[i] = this.reader.int32();
        }
        return message;
    }
    parseDataRowMessage(offset, length, bytes) {
        this.reader.setBuffer(offset, bytes);
        const fieldCount = this.reader.int16();
        const fields = new Array(fieldCount);
        for (let i = 0; i < fieldCount; i++) {
            const len = this.reader.int32();
            // a -1 for length means the value of the field is null
            fields[i] = len === -1 ? null : this.reader.string(len);
        }
        return new messages_1.DataRowMessage(length, fields);
    }
    parseParameterStatusMessage(offset, length, bytes) {
        this.reader.setBuffer(offset, bytes);
        const name = this.reader.cstring();
        const value = this.reader.cstring();
        return new messages_1.ParameterStatusMessage(length, name, value);
    }
    parseBackendKeyData(offset, length, bytes) {
        this.reader.setBuffer(offset, bytes);
        const processID = this.reader.int32();
        const secretKey = this.reader.int32();
        return new messages_1.BackendKeyDataMessage(length, processID, secretKey);
    }
    parseAuthenticationResponse(offset, length, bytes) {
        this.reader.setBuffer(offset, bytes);
        const code = this.reader.int32();
        // TODO(bmc): maybe better types here
        const message = {
            name: 'authenticationOk',
            length,
        };
        switch (code) {
            case 0: // AuthenticationOk
                break;
            case 3: // AuthenticationCleartextPassword
                if (message.length === 8) {
                    message.name = 'authenticationCleartextPassword';
                }
                break;
            case 5: // AuthenticationMD5Password
                if (message.length === 12) {
                    message.name = 'authenticationMD5Password';
                    const salt = this.reader.bytes(4);
                    return new messages_1.AuthenticationMD5Password(length, salt);
                }
                break;
            case 10: // AuthenticationSASL
                {
                    message.name = 'authenticationSASL';
                    message.mechanisms = [];
                    let mechanism;
                    do {
                        mechanism = this.reader.cstring();
                        if (mechanism) {
                            message.mechanisms.push(mechanism);
                        }
                    } while (mechanism);
                }
                break;
            case 11: // AuthenticationSASLContinue
                message.name = 'authenticationSASLContinue';
                message.data = this.reader.string(length - 8);
                break;
            case 12: // AuthenticationSASLFinal
                message.name = 'authenticationSASLFinal';
                message.data = this.reader.string(length - 8);
                break;
            default:
                throw new Error('Unknown authenticationOk message type ' + code);
        }
        return message;
    }
    parseErrorMessage(offset, length, bytes, name) {
        this.reader.setBuffer(offset, bytes);
        const fields = {};
        let fieldType = this.reader.string(1);
        while (fieldType !== '\0') {
            fields[fieldType] = this.reader.cstring();
            fieldType = this.reader.string(1);
        }
        const messageValue = fields.M;
        const message = name === 'notice' ? new messages_1.NoticeMessage(length, messageValue) : new messages_1.DatabaseError(messageValue, length, name);
        message.severity = fields.S;
        message.code = fields.C;
        message.detail = fields.D;
        message.hint = fields.H;
        message.position = fields.P;
        message.internalPosition = fields.p;
        message.internalQuery = fields.q;
        message.where = fields.W;
        message.schema = fields.s;
        message.table = fields.t;
        message.column = fields.c;
        message.dataType = fields.d;
        message.constraint = fields.n;
        message.file = fields.F;
        message.line = fields.L;
        message.routine = fields.R;
        return message;
    }
}
parser.Parser = Parser;

(function (exports$1) {
	Object.defineProperty(exports$1, "__esModule", { value: true });
	exports$1.DatabaseError = exports$1.serialize = exports$1.parse = void 0;
	const messages_1 = messages;
	Object.defineProperty(exports$1, "DatabaseError", { enumerable: true, get: function () { return messages_1.DatabaseError; } });
	const serializer_1 = serializer;
	Object.defineProperty(exports$1, "serialize", { enumerable: true, get: function () { return serializer_1.serialize; } });
	const parser_1 = parser;
	function parse(stream, callback) {
	    const parser = new parser_1.Parser();
	    stream.on('data', (buffer) => parser.parse(buffer, callback));
	    return new Promise((resolve) => stream.on('end', () => resolve()));
	}
	exports$1.parse = parse;
	
} (dist));

const index = /*@__PURE__*/getDefaultExportFromCjs(dist);

const protocol = /*#__PURE__*/_mergeNamespaces({
  __proto__: null,
  default: index
}, [dist]);

// ESM wrapper for pg-protocol

// Re-export all the properties
const DatabaseError$1 = dist.DatabaseError;
const SASL = dist.SASL;
const serialize$1 = dist.serialize;
const parse$1 = dist.parse;

const esm$2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DatabaseError: DatabaseError$1,
  SASL: SASL,
  default: protocol,
  parse: parse$1,
  serialize: serialize$1
}, Symbol.toStringTag, { value: 'Module' }));

const require$$3 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(net);

const require$$1$1 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(tls);

var empty = {};

var hasRequiredEmpty;

function requireEmpty () {
	if (hasRequiredEmpty) return empty;
	hasRequiredEmpty = 1;
	Object.defineProperty(empty, "__esModule", { value: true });
	// This is an empty module that is served up when outside of a workerd environment
	// See the `exports` field in package.json
	empty.default = {};
	
	return empty;
}

const { getStream: getStream$1, getSecureStream: getSecureStream$1 } = getStreamFuncs();

var stream = {
  /**
   * Get a socket stream compatible with the current runtime environment.
   * @returns {Duplex}
   */
  getStream: getStream$1,
  /**
   * Get a TLS secured socket, compatible with the current environment,
   * using the socket and other settings given in `options`.
   * @returns {Duplex}
   */
  getSecureStream: getSecureStream$1,
};

/**
 * The stream functions that work in Node.js
 */
function getNodejsStreamFuncs() {
  function getStream(ssl) {
    const net = require$$3;
    return new net.Socket()
  }

  function getSecureStream(options) {
    const tls = require$$1$1;
    return tls.connect(options)
  }
  return {
    getStream,
    getSecureStream,
  }
}

/**
 * The stream functions that work in Cloudflare Workers
 */
function getCloudflareStreamFuncs() {
  function getStream(ssl) {
    const { CloudflareSocket } = /*@__PURE__*/ requireEmpty();
    return new CloudflareSocket(ssl)
  }

  function getSecureStream(options) {
    options.socket.startTls(options);
    return options.socket
  }
  return {
    getStream,
    getSecureStream,
  }
}

/**
 * Are we running in a Cloudflare Worker?
 *
 * @returns true if the code is currently running inside a Cloudflare Worker.
 */
function isCloudflareRuntime() {
  // Since 2022-03-21 the `global_navigator` compatibility flag is on for Cloudflare Workers
  // which means that `navigator.userAgent` will be defined.
  // eslint-disable-next-line no-undef
  if (typeof navigator === 'object' && navigator !== null && typeof navigator.userAgent === 'string') {
    // eslint-disable-next-line no-undef
    return navigator.userAgent === 'Cloudflare-Workers'
  }
  // In case `navigator` or `navigator.userAgent` is not defined then try a more sneaky approach
  if (typeof Response === 'function') {
    const resp = new Response(null, { cf: { thing: true } });
    if (typeof resp.cf === 'object' && resp.cf !== null && resp.cf.thing) {
      return true
    }
  }
  return false
}

function getStreamFuncs() {
  if (isCloudflareRuntime()) {
    return getCloudflareStreamFuncs()
  }
  return getNodejsStreamFuncs()
}

const EventEmitter$2 = require$$2$b.EventEmitter;

const { parse, serialize } = esm$2;
const { getStream, getSecureStream } = stream;

const flushBuffer = serialize.flush();
const syncBuffer = serialize.sync();
const endBuffer = serialize.end();

// TODO(bmc) support binary mode at some point
let Connection$2 = class Connection extends EventEmitter$2 {
  constructor(config) {
    super();
    config = config || {};

    this.stream = config.stream || getStream(config.ssl);
    if (typeof this.stream === 'function') {
      this.stream = this.stream(config);
    }

    this._keepAlive = config.keepAlive;
    this._keepAliveInitialDelayMillis = config.keepAliveInitialDelayMillis;
    this.lastBuffer = false;
    this.parsedStatements = {};
    this.ssl = config.ssl || false;
    this._ending = false;
    this._emitMessage = false;
    const self = this;
    this.on('newListener', function (eventName) {
      if (eventName === 'message') {
        self._emitMessage = true;
      }
    });
  }

  connect(port, host) {
    const self = this;

    this._connecting = true;
    this.stream.setNoDelay(true);
    this.stream.connect(port, host);

    this.stream.once('connect', function () {
      if (self._keepAlive) {
        self.stream.setKeepAlive(true, self._keepAliveInitialDelayMillis);
      }
      self.emit('connect');
    });

    const reportStreamError = function (error) {
      // errors about disconnections should be ignored during disconnect
      if (self._ending && (error.code === 'ECONNRESET' || error.code === 'EPIPE')) {
        return
      }
      self.emit('error', error);
    };
    this.stream.on('error', reportStreamError);

    this.stream.on('close', function () {
      self.emit('end');
    });

    if (!this.ssl) {
      return this.attachListeners(this.stream)
    }

    this.stream.once('data', function (buffer) {
      const responseCode = buffer.toString('utf8');
      switch (responseCode) {
        case 'S': // Server supports SSL connections, continue with a secure connection
          break
        case 'N': // Server does not support SSL connections
          self.stream.end();
          return self.emit('error', new Error('The server does not support SSL connections'))
        default:
          // Any other response byte, including 'E' (ErrorResponse) indicating a server error
          self.stream.end();
          return self.emit('error', new Error('There was an error establishing an SSL connection'))
      }
      const options = {
        socket: self.stream,
      };

      if (self.ssl !== true) {
        Object.assign(options, self.ssl);

        if ('key' in self.ssl) {
          options.key = self.ssl.key;
        }
      }

      const net = require$$3;
      if (net.isIP && net.isIP(host) === 0) {
        options.servername = host;
      }
      try {
        self.stream = getSecureStream(options);
      } catch (err) {
        return self.emit('error', err)
      }
      self.attachListeners(self.stream);
      self.stream.on('error', reportStreamError);

      self.emit('sslconnect');
    });
  }

  attachListeners(stream) {
    parse(stream, (msg) => {
      const eventName = msg.name === 'error' ? 'errorMessage' : msg.name;
      if (this._emitMessage) {
        this.emit('message', msg);
      }
      this.emit(eventName, msg);
    });
  }

  requestSsl() {
    this.stream.write(serialize.requestSsl());
  }

  startup(config) {
    this.stream.write(serialize.startup(config));
  }

  cancel(processID, secretKey) {
    this._send(serialize.cancel(processID, secretKey));
  }

  password(password) {
    this._send(serialize.password(password));
  }

  sendSASLInitialResponseMessage(mechanism, initialResponse) {
    this._send(serialize.sendSASLInitialResponseMessage(mechanism, initialResponse));
  }

  sendSCRAMClientFinalMessage(additionalData) {
    this._send(serialize.sendSCRAMClientFinalMessage(additionalData));
  }

  _send(buffer) {
    if (!this.stream.writable) {
      return false
    }
    return this.stream.write(buffer)
  }

  query(text) {
    this._send(serialize.query(text));
  }

  // send parse message
  parse(query) {
    this._send(serialize.parse(query));
  }

  // send bind message
  bind(config) {
    this._send(serialize.bind(config));
  }

  // send execute message
  execute(config) {
    this._send(serialize.execute(config));
  }

  flush() {
    if (this.stream.writable) {
      this.stream.write(flushBuffer);
    }
  }

  sync() {
    this._ending = true;
    this._send(syncBuffer);
  }

  ref() {
    this.stream.ref();
  }

  unref() {
    this.stream.unref();
  }

  end() {
    // 0x58 = 'X'
    this._ending = true;
    if (!this._connecting || !this.stream.writable) {
      this.stream.end();
      return
    }
    return this.stream.write(endBuffer, () => {
      this.stream.end();
    })
  }

  close(msg) {
    this._send(serialize.close(msg));
  }

  describe(msg) {
    this._send(serialize.describe(msg));
  }

  sendCopyFromChunk(chunk) {
    this._send(serialize.copyData(chunk));
  }

  endCopyFrom() {
    this._send(serialize.copyDone());
  }

  sendCopyFail(msg) {
    this._send(serialize.copyFail(msg));
  }
};

var connection = Connection$2;

var lib$1 = {exports: {}};

var helper = {exports: {}};

const require$$2$1 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(split2);

var hasRequiredHelper;

function requireHelper () {
	if (hasRequiredHelper) return helper.exports;
	hasRequiredHelper = 1;
	(function (module) {

		var path = require$$0$i
		  , Stream = require$$2$a.Stream
		  , split = require$$2$1
		  , util = require$$1$e
		  , defaultPort = 5432
		  , isWin = (process.platform === 'win32')
		  , warnStream = process.stderr
		;


		var S_IRWXG = 56     //    00070(8)
		  , S_IRWXO = 7      //    00007(8)
		  , S_IFMT  = 61440  // 00170000(8)
		  , S_IFREG = 32768  //  0100000(8)
		;
		function isRegFile(mode) {
		    return ((mode & S_IFMT) == S_IFREG);
		}

		var fieldNames = [ 'host', 'port', 'database', 'user', 'password' ];
		var nrOfFields = fieldNames.length;
		var passKey = fieldNames[ nrOfFields -1 ];


		function warn() {
		    var isWritable = (
		        warnStream instanceof Stream &&
		          true === warnStream.writable
		    );

		    if (isWritable) {
		        var args = Array.prototype.slice.call(arguments).concat("\n");
		        warnStream.write( util.format.apply(util, args) );
		    }
		}


		Object.defineProperty(module.exports, 'isWin', {
		    get : function() {
		        return isWin;
		    } ,
		    set : function(val) {
		        isWin = val;
		    }
		});


		module.exports.warnTo = function(stream) {
		    var old = warnStream;
		    warnStream = stream;
		    return old;
		};

		module.exports.getFileName = function(rawEnv){
		    var env = rawEnv || process.env;
		    var file = env.PGPASSFILE || (
		        isWin ?
		          path.join( env.APPDATA || './' , 'postgresql', 'pgpass.conf' ) :
		          path.join( env.HOME || './', '.pgpass' )
		    );
		    return file;
		};

		module.exports.usePgPass = function(stats, fname) {
		    if (Object.prototype.hasOwnProperty.call(process.env, 'PGPASSWORD')) {
		        return false;
		    }

		    if (isWin) {
		        return true;
		    }

		    fname = fname || '<unkn>';

		    if (! isRegFile(stats.mode)) {
		        warn('WARNING: password file "%s" is not a plain file', fname);
		        return false;
		    }

		    if (stats.mode & (S_IRWXG | S_IRWXO)) {
		        /* If password file is insecure, alert the user and ignore it. */
		        warn('WARNING: password file "%s" has group or world access; permissions should be u=rw (0600) or less', fname);
		        return false;
		    }

		    return true;
		};


		var matcher = module.exports.match = function(connInfo, entry) {
		    return fieldNames.slice(0, -1).reduce(function(prev, field, idx){
		        if (idx == 1) {
		            // the port
		            if ( Number( connInfo[field] || defaultPort ) === Number( entry[field] ) ) {
		                return prev && true;
		            }
		        }
		        return prev && (
		            entry[field] === '*' ||
		              entry[field] === connInfo[field]
		        );
		    }, true);
		};


		module.exports.getPassword = function(connInfo, stream, cb) {
		    var pass;
		    var lineStream = stream.pipe(split());

		    function onLine(line) {
		        var entry = parseLine(line);
		        if (entry && isValidEntry(entry) && matcher(connInfo, entry)) {
		            pass = entry[passKey];
		            lineStream.end(); // -> calls onEnd(), but pass is set now
		        }
		    }

		    var onEnd = function() {
		        stream.destroy();
		        cb(pass);
		    };

		    var onErr = function(err) {
		        stream.destroy();
		        warn('WARNING: error on reading file: %s', err);
		        cb(undefined);
		    };

		    stream.on('error', onErr);
		    lineStream
		        .on('data', onLine)
		        .on('end', onEnd)
		        .on('error', onErr)
		    ;

		};


		var parseLine = module.exports.parseLine = function(line) {
		    if (line.length < 11 || line.match(/^\s+#/)) {
		        return null;
		    }

		    var curChar = '';
		    var prevChar = '';
		    var fieldIdx = 0;
		    var startIdx = 0;
		    var obj = {};
		    var isLastField = false;
		    var addToObj = function(idx, i0, i1) {
		        var field = line.substring(i0, i1);

		        if (! Object.hasOwnProperty.call(process.env, 'PGPASS_NO_DEESCAPE')) {
		            field = field.replace(/\\([:\\])/g, '$1');
		        }

		        obj[ fieldNames[idx] ] = field;
		    };

		    for (var i = 0 ; i < line.length-1 ; i += 1) {
		        curChar = line.charAt(i+1);
		        prevChar = line.charAt(i);

		        isLastField = (fieldIdx == nrOfFields-1);

		        if (isLastField) {
		            addToObj(fieldIdx, startIdx);
		            break;
		        }

		        if (i >= 0 && curChar == ':' && prevChar !== '\\') {
		            addToObj(fieldIdx, startIdx, i+1);

		            startIdx = i+2;
		            fieldIdx += 1;
		        }
		    }

		    obj = ( Object.keys(obj).length === nrOfFields ) ? obj : null;

		    return obj;
		};


		var isValidEntry = module.exports.isValidEntry = function(entry){
		    var rules = {
		        // host
		        0 : function(x){
		            return x.length > 0;
		        } ,
		        // port
		        1 : function(x){
		            if (x === '*') {
		                return true;
		            }
		            x = Number(x);
		            return (
		                isFinite(x) &&
		                  x > 0 &&
		                  x < 9007199254740992 &&
		                  Math.floor(x) === x
		            );
		        } ,
		        // database
		        2 : function(x){
		            return x.length > 0;
		        } ,
		        // username
		        3 : function(x){
		            return x.length > 0;
		        } ,
		        // password
		        4 : function(x){
		            return x.length > 0;
		        }
		    };

		    for (var idx = 0 ; idx < fieldNames.length ; idx += 1) {
		        var rule = rules[idx];
		        var value = entry[ fieldNames[idx] ] || '';

		        var res = rule(value);
		        if (!res) {
		            return false;
		        }
		    }

		    return true;
		}; 
	} (helper));
	return helper.exports;
}

var hasRequiredLib;

function requireLib () {
	if (hasRequiredLib) return lib$1.exports;
	hasRequiredLib = 1;

	var fs = require$$1$c
	  , helper = /*@__PURE__*/ requireHelper()
	;


	lib$1.exports = function(connInfo, cb) {
	    var file = helper.getFileName();
	    
	    fs.stat(file, function(err, stat){
	        if (err || !helper.usePgPass(stat, file)) {
	            return cb(undefined);
	        }

	        var st = fs.createReadStream(file);

	        helper.getPassword(connInfo, st, cb);
	    });
	};

	lib$1.exports.warnTo = helper.warnTo;
	return lib$1.exports;
}

const EventEmitter$1 = require$$2$b.EventEmitter;
const utils$2 = utils$5;
const sasl = sasl$1;
const TypeOverrides$1 = typeOverrides;

const ConnectionParameters = connectionParameters;
const Query$1 = query$2;
const defaults$1 = defaultsExports;
const Connection$1 = connection;
const crypto = utilsExports;

let Client$3 = class Client extends EventEmitter$1 {
  constructor(config) {
    super();

    this.connectionParameters = new ConnectionParameters(config);
    this.user = this.connectionParameters.user;
    this.database = this.connectionParameters.database;
    this.port = this.connectionParameters.port;
    this.host = this.connectionParameters.host;

    // "hiding" the password so it doesn't show up in stack traces
    // or if the client is console.logged
    Object.defineProperty(this, 'password', {
      configurable: true,
      enumerable: false,
      writable: true,
      value: this.connectionParameters.password,
    });

    this.replication = this.connectionParameters.replication;

    const c = config || {};

    this._Promise = c.Promise || commonjsGlobal.Promise;
    this._types = new TypeOverrides$1(c.types);
    this._ending = false;
    this._ended = false;
    this._connecting = false;
    this._connected = false;
    this._connectionError = false;
    this._queryable = true;

    this.enableChannelBinding = Boolean(c.enableChannelBinding); // set true to use SCRAM-SHA-256-PLUS when offered
    this.connection =
      c.connection ||
      new Connection$1({
        stream: c.stream,
        ssl: this.connectionParameters.ssl,
        keepAlive: c.keepAlive || false,
        keepAliveInitialDelayMillis: c.keepAliveInitialDelayMillis || 0,
        encoding: this.connectionParameters.client_encoding || 'utf8',
      });
    this.queryQueue = [];
    this.binary = c.binary || defaults$1.binary;
    this.processID = null;
    this.secretKey = null;
    this.ssl = this.connectionParameters.ssl || false;
    // As with Password, make SSL->Key (the private key) non-enumerable.
    // It won't show up in stack traces
    // or if the client is console.logged
    if (this.ssl && this.ssl.key) {
      Object.defineProperty(this.ssl, 'key', {
        enumerable: false,
      });
    }

    this._connectionTimeoutMillis = c.connectionTimeoutMillis || 0;
  }

  _errorAllQueries(err) {
    const enqueueError = (query) => {
      process.nextTick(() => {
        query.handleError(err, this.connection);
      });
    };

    if (this.activeQuery) {
      enqueueError(this.activeQuery);
      this.activeQuery = null;
    }

    this.queryQueue.forEach(enqueueError);
    this.queryQueue.length = 0;
  }

  _connect(callback) {
    const self = this;
    const con = this.connection;
    this._connectionCallback = callback;

    if (this._connecting || this._connected) {
      const err = new Error('Client has already been connected. You cannot reuse a client.');
      process.nextTick(() => {
        callback(err);
      });
      return
    }
    this._connecting = true;

    if (this._connectionTimeoutMillis > 0) {
      this.connectionTimeoutHandle = setTimeout(() => {
        con._ending = true;
        con.stream.destroy(new Error('timeout expired'));
      }, this._connectionTimeoutMillis);

      if (this.connectionTimeoutHandle.unref) {
        this.connectionTimeoutHandle.unref();
      }
    }

    if (this.host && this.host.indexOf('/') === 0) {
      con.connect(this.host + '/.s.PGSQL.' + this.port);
    } else {
      con.connect(this.port, this.host);
    }

    // once connection is established send startup message
    con.on('connect', function () {
      if (self.ssl) {
        con.requestSsl();
      } else {
        con.startup(self.getStartupConf());
      }
    });

    con.on('sslconnect', function () {
      con.startup(self.getStartupConf());
    });

    this._attachListeners(con);

    con.once('end', () => {
      const error = this._ending ? new Error('Connection terminated') : new Error('Connection terminated unexpectedly');

      clearTimeout(this.connectionTimeoutHandle);
      this._errorAllQueries(error);
      this._ended = true;

      if (!this._ending) {
        // if the connection is ended without us calling .end()
        // on this client then we have an unexpected disconnection
        // treat this as an error unless we've already emitted an error
        // during connection.
        if (this._connecting && !this._connectionError) {
          if (this._connectionCallback) {
            this._connectionCallback(error);
          } else {
            this._handleErrorEvent(error);
          }
        } else if (!this._connectionError) {
          this._handleErrorEvent(error);
        }
      }

      process.nextTick(() => {
        this.emit('end');
      });
    });
  }

  connect(callback) {
    if (callback) {
      this._connect(callback);
      return
    }

    return new this._Promise((resolve, reject) => {
      this._connect((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    })
  }

  _attachListeners(con) {
    // password request handling
    con.on('authenticationCleartextPassword', this._handleAuthCleartextPassword.bind(this));
    // password request handling
    con.on('authenticationMD5Password', this._handleAuthMD5Password.bind(this));
    // password request handling (SASL)
    con.on('authenticationSASL', this._handleAuthSASL.bind(this));
    con.on('authenticationSASLContinue', this._handleAuthSASLContinue.bind(this));
    con.on('authenticationSASLFinal', this._handleAuthSASLFinal.bind(this));
    con.on('backendKeyData', this._handleBackendKeyData.bind(this));
    con.on('error', this._handleErrorEvent.bind(this));
    con.on('errorMessage', this._handleErrorMessage.bind(this));
    con.on('readyForQuery', this._handleReadyForQuery.bind(this));
    con.on('notice', this._handleNotice.bind(this));
    con.on('rowDescription', this._handleRowDescription.bind(this));
    con.on('dataRow', this._handleDataRow.bind(this));
    con.on('portalSuspended', this._handlePortalSuspended.bind(this));
    con.on('emptyQuery', this._handleEmptyQuery.bind(this));
    con.on('commandComplete', this._handleCommandComplete.bind(this));
    con.on('parseComplete', this._handleParseComplete.bind(this));
    con.on('copyInResponse', this._handleCopyInResponse.bind(this));
    con.on('copyData', this._handleCopyData.bind(this));
    con.on('notification', this._handleNotification.bind(this));
  }

  // TODO(bmc): deprecate pgpass "built in" integration since this.password can be a function
  // it can be supplied by the user if required - this is a breaking change!
  _checkPgPass(cb) {
    const con = this.connection;
    if (typeof this.password === 'function') {
      this._Promise
        .resolve()
        .then(() => this.password())
        .then((pass) => {
          if (pass !== undefined) {
            if (typeof pass !== 'string') {
              con.emit('error', new TypeError('Password must be a string'));
              return
            }
            this.connectionParameters.password = this.password = pass;
          } else {
            this.connectionParameters.password = this.password = null;
          }
          cb();
        })
        .catch((err) => {
          con.emit('error', err);
        });
    } else if (this.password !== null) {
      cb();
    } else {
      try {
        const pgPass = /*@__PURE__*/ requireLib();
        pgPass(this.connectionParameters, (pass) => {
          if (undefined !== pass) {
            this.connectionParameters.password = this.password = pass;
          }
          cb();
        });
      } catch (e) {
        this.emit('error', e);
      }
    }
  }

  _handleAuthCleartextPassword(msg) {
    this._checkPgPass(() => {
      this.connection.password(this.password);
    });
  }

  _handleAuthMD5Password(msg) {
    this._checkPgPass(async () => {
      try {
        const hashedPassword = await crypto.postgresMd5PasswordHash(this.user, this.password, msg.salt);
        this.connection.password(hashedPassword);
      } catch (e) {
        this.emit('error', e);
      }
    });
  }

  _handleAuthSASL(msg) {
    this._checkPgPass(() => {
      try {
        this.saslSession = sasl.startSession(msg.mechanisms, this.enableChannelBinding && this.connection.stream);
        this.connection.sendSASLInitialResponseMessage(this.saslSession.mechanism, this.saslSession.response);
      } catch (err) {
        this.connection.emit('error', err);
      }
    });
  }

  async _handleAuthSASLContinue(msg) {
    try {
      await sasl.continueSession(
        this.saslSession,
        this.password,
        msg.data,
        this.enableChannelBinding && this.connection.stream
      );
      this.connection.sendSCRAMClientFinalMessage(this.saslSession.response);
    } catch (err) {
      this.connection.emit('error', err);
    }
  }

  _handleAuthSASLFinal(msg) {
    try {
      sasl.finalizeSession(this.saslSession, msg.data);
      this.saslSession = null;
    } catch (err) {
      this.connection.emit('error', err);
    }
  }

  _handleBackendKeyData(msg) {
    this.processID = msg.processID;
    this.secretKey = msg.secretKey;
  }

  _handleReadyForQuery(msg) {
    if (this._connecting) {
      this._connecting = false;
      this._connected = true;
      clearTimeout(this.connectionTimeoutHandle);

      // process possible callback argument to Client#connect
      if (this._connectionCallback) {
        this._connectionCallback(null, this);
        // remove callback for proper error handling
        // after the connect event
        this._connectionCallback = null;
      }
      this.emit('connect');
    }
    const { activeQuery } = this;
    this.activeQuery = null;
    this.readyForQuery = true;
    if (activeQuery) {
      activeQuery.handleReadyForQuery(this.connection);
    }
    this._pulseQueryQueue();
  }

  // if we receive an error event or error message
  // during the connection process we handle it here
  _handleErrorWhileConnecting(err) {
    if (this._connectionError) {
      // TODO(bmc): this is swallowing errors - we shouldn't do this
      return
    }
    this._connectionError = true;
    clearTimeout(this.connectionTimeoutHandle);
    if (this._connectionCallback) {
      return this._connectionCallback(err)
    }
    this.emit('error', err);
  }

  // if we're connected and we receive an error event from the connection
  // this means the socket is dead - do a hard abort of all queries and emit
  // the socket error on the client as well
  _handleErrorEvent(err) {
    if (this._connecting) {
      return this._handleErrorWhileConnecting(err)
    }
    this._queryable = false;
    this._errorAllQueries(err);
    this.emit('error', err);
  }

  // handle error messages from the postgres backend
  _handleErrorMessage(msg) {
    if (this._connecting) {
      return this._handleErrorWhileConnecting(msg)
    }
    const activeQuery = this.activeQuery;

    if (!activeQuery) {
      this._handleErrorEvent(msg);
      return
    }

    this.activeQuery = null;
    activeQuery.handleError(msg, this.connection);
  }

  _handleRowDescription(msg) {
    // delegate rowDescription to active query
    this.activeQuery.handleRowDescription(msg);
  }

  _handleDataRow(msg) {
    // delegate dataRow to active query
    this.activeQuery.handleDataRow(msg);
  }

  _handlePortalSuspended(msg) {
    // delegate portalSuspended to active query
    this.activeQuery.handlePortalSuspended(this.connection);
  }

  _handleEmptyQuery(msg) {
    // delegate emptyQuery to active query
    this.activeQuery.handleEmptyQuery(this.connection);
  }

  _handleCommandComplete(msg) {
    if (this.activeQuery == null) {
      const error = new Error('Received unexpected commandComplete message from backend.');
      this._handleErrorEvent(error);
      return
    }
    // delegate commandComplete to active query
    this.activeQuery.handleCommandComplete(msg, this.connection);
  }

  _handleParseComplete() {
    if (this.activeQuery == null) {
      const error = new Error('Received unexpected parseComplete message from backend.');
      this._handleErrorEvent(error);
      return
    }
    // if a prepared statement has a name and properly parses
    // we track that its already been executed so we don't parse
    // it again on the same client
    if (this.activeQuery.name) {
      this.connection.parsedStatements[this.activeQuery.name] = this.activeQuery.text;
    }
  }

  _handleCopyInResponse(msg) {
    this.activeQuery.handleCopyInResponse(this.connection);
  }

  _handleCopyData(msg) {
    this.activeQuery.handleCopyData(msg, this.connection);
  }

  _handleNotification(msg) {
    this.emit('notification', msg);
  }

  _handleNotice(msg) {
    this.emit('notice', msg);
  }

  getStartupConf() {
    const params = this.connectionParameters;

    const data = {
      user: params.user,
      database: params.database,
    };

    const appName = params.application_name || params.fallback_application_name;
    if (appName) {
      data.application_name = appName;
    }
    if (params.replication) {
      data.replication = '' + params.replication;
    }
    if (params.statement_timeout) {
      data.statement_timeout = String(parseInt(params.statement_timeout, 10));
    }
    if (params.lock_timeout) {
      data.lock_timeout = String(parseInt(params.lock_timeout, 10));
    }
    if (params.idle_in_transaction_session_timeout) {
      data.idle_in_transaction_session_timeout = String(parseInt(params.idle_in_transaction_session_timeout, 10));
    }
    if (params.options) {
      data.options = params.options;
    }

    return data
  }

  cancel(client, query) {
    if (client.activeQuery === query) {
      const con = this.connection;

      if (this.host && this.host.indexOf('/') === 0) {
        con.connect(this.host + '/.s.PGSQL.' + this.port);
      } else {
        con.connect(this.port, this.host);
      }

      // once connection is established send cancel message
      con.on('connect', function () {
        con.cancel(client.processID, client.secretKey);
      });
    } else if (client.queryQueue.indexOf(query) !== -1) {
      client.queryQueue.splice(client.queryQueue.indexOf(query), 1);
    }
  }

  setTypeParser(oid, format, parseFn) {
    return this._types.setTypeParser(oid, format, parseFn)
  }

  getTypeParser(oid, format) {
    return this._types.getTypeParser(oid, format)
  }

  // escapeIdentifier and escapeLiteral moved to utility functions & exported
  // on PG
  // re-exported here for backwards compatibility
  escapeIdentifier(str) {
    return utils$2.escapeIdentifier(str)
  }

  escapeLiteral(str) {
    return utils$2.escapeLiteral(str)
  }

  _pulseQueryQueue() {
    if (this.readyForQuery === true) {
      this.activeQuery = this.queryQueue.shift();
      if (this.activeQuery) {
        this.readyForQuery = false;
        this.hasExecuted = true;

        const queryError = this.activeQuery.submit(this.connection);
        if (queryError) {
          process.nextTick(() => {
            this.activeQuery.handleError(queryError, this.connection);
            this.readyForQuery = true;
            this._pulseQueryQueue();
          });
        }
      } else if (this.hasExecuted) {
        this.activeQuery = null;
        this.emit('drain');
      }
    }
  }

  query(config, values, callback) {
    // can take in strings, config object or query object
    let query;
    let result;
    let readTimeout;
    let readTimeoutTimer;
    let queryCallback;

    if (config === null || config === undefined) {
      throw new TypeError('Client was passed a null or undefined query')
    } else if (typeof config.submit === 'function') {
      readTimeout = config.query_timeout || this.connectionParameters.query_timeout;
      result = query = config;
      if (typeof values === 'function') {
        query.callback = query.callback || values;
      }
    } else {
      readTimeout = config.query_timeout || this.connectionParameters.query_timeout;
      query = new Query$1(config, values, callback);
      if (!query.callback) {
        result = new this._Promise((resolve, reject) => {
          query.callback = (err, res) => (err ? reject(err) : resolve(res));
        }).catch((err) => {
          // replace the stack trace that leads to `TCP.onStreamRead` with one that leads back to the
          // application that created the query
          Error.captureStackTrace(err);
          throw err
        });
      }
    }

    if (readTimeout) {
      queryCallback = query.callback;

      readTimeoutTimer = setTimeout(() => {
        const error = new Error('Query read timeout');

        process.nextTick(() => {
          query.handleError(error, this.connection);
        });

        queryCallback(error);

        // we already returned an error,
        // just do nothing if query completes
        query.callback = () => {};

        // Remove from queue
        const index = this.queryQueue.indexOf(query);
        if (index > -1) {
          this.queryQueue.splice(index, 1);
        }

        this._pulseQueryQueue();
      }, readTimeout);

      query.callback = (err, res) => {
        clearTimeout(readTimeoutTimer);
        queryCallback(err, res);
      };
    }

    if (this.binary && !query.binary) {
      query.binary = true;
    }

    if (query._result && !query._result._types) {
      query._result._types = this._types;
    }

    if (!this._queryable) {
      process.nextTick(() => {
        query.handleError(new Error('Client has encountered a connection error and is not queryable'), this.connection);
      });
      return result
    }

    if (this._ending) {
      process.nextTick(() => {
        query.handleError(new Error('Client was closed and is not queryable'), this.connection);
      });
      return result
    }

    this.queryQueue.push(query);
    this._pulseQueryQueue();
    return result
  }

  ref() {
    this.connection.ref();
  }

  unref() {
    this.connection.unref();
  }

  end(cb) {
    this._ending = true;

    // if we have never connected, then end is a noop, callback immediately
    if (!this.connection._connecting || this._ended) {
      if (cb) {
        cb();
      } else {
        return this._Promise.resolve()
      }
    }

    if (this.activeQuery || !this._queryable) {
      // if we have an active query we need to force a disconnect
      // on the socket - otherwise a hung query could block end forever
      this.connection.stream.destroy();
    } else {
      this.connection.end();
    }

    if (cb) {
      this.connection.once('end', cb);
    } else {
      return new this._Promise((resolve) => {
        this.connection.once('end', resolve);
      })
    }
  }
};

// expose a Query constructor
Client$3.Query = Query$1;

var client$1 = Client$3;

const EventEmitter = require$$2$b.EventEmitter;

const NOOP = function () {};

const removeWhere = (list, predicate) => {
  const i = list.findIndex(predicate);

  return i === -1 ? undefined : list.splice(i, 1)[0]
};

class IdleItem {
  constructor(client, idleListener, timeoutId) {
    this.client = client;
    this.idleListener = idleListener;
    this.timeoutId = timeoutId;
  }
}

class PendingItem {
  constructor(callback) {
    this.callback = callback;
  }
}

function throwOnDoubleRelease() {
  throw new Error('Release called on client which has already been released to the pool.')
}

function promisify(Promise, callback) {
  if (callback) {
    return { callback: callback, result: undefined }
  }
  let rej;
  let res;
  const cb = function (err, client) {
    err ? rej(err) : res(client);
  };
  const result = new Promise(function (resolve, reject) {
    res = resolve;
    rej = reject;
  }).catch((err) => {
    // replace the stack trace that leads to `TCP.onStreamRead` with one that leads back to the
    // application that created the query
    Error.captureStackTrace(err);
    throw err
  });
  return { callback: cb, result: result }
}

function makeIdleListener(pool, client) {
  return function idleListener(err) {
    err.client = client;

    client.removeListener('error', idleListener);
    client.on('error', () => {
      pool.log('additional client error after disconnection due to error', err);
    });
    pool._remove(client);
    // TODO - document that once the pool emits an error
    // the client has already been closed & purged and is unusable
    pool.emit('error', err, client);
  }
}

let Pool$1 = class Pool extends EventEmitter {
  constructor(options, Client) {
    super();
    this.options = Object.assign({}, options);

    if (options != null && 'password' in options) {
      // "hiding" the password so it doesn't show up in stack traces
      // or if the client is console.logged
      Object.defineProperty(this.options, 'password', {
        configurable: true,
        enumerable: false,
        writable: true,
        value: options.password,
      });
    }
    if (options != null && options.ssl && options.ssl.key) {
      // "hiding" the ssl->key so it doesn't show up in stack traces
      // or if the client is console.logged
      Object.defineProperty(this.options.ssl, 'key', {
        enumerable: false,
      });
    }

    this.options.max = this.options.max || this.options.poolSize || 10;
    this.options.min = this.options.min || 0;
    this.options.maxUses = this.options.maxUses || Infinity;
    this.options.allowExitOnIdle = this.options.allowExitOnIdle || false;
    this.options.maxLifetimeSeconds = this.options.maxLifetimeSeconds || 0;
    this.log = this.options.log || function () {};
    this.Client = this.options.Client || Client || require$$9.Client;
    this.Promise = this.options.Promise || commonjsGlobal.Promise;

    if (typeof this.options.idleTimeoutMillis === 'undefined') {
      this.options.idleTimeoutMillis = 10000;
    }

    this._clients = [];
    this._idle = [];
    this._expired = new WeakSet();
    this._pendingQueue = [];
    this._endCallback = undefined;
    this.ending = false;
    this.ended = false;
  }

  _isFull() {
    return this._clients.length >= this.options.max
  }

  _isAboveMin() {
    return this._clients.length > this.options.min
  }

  _pulseQueue() {
    this.log('pulse queue');
    if (this.ended) {
      this.log('pulse queue ended');
      return
    }
    if (this.ending) {
      this.log('pulse queue on ending');
      if (this._idle.length) {
        this._idle.slice().map((item) => {
          this._remove(item.client);
        });
      }
      if (!this._clients.length) {
        this.ended = true;
        this._endCallback();
      }
      return
    }

    // if we don't have any waiting, do nothing
    if (!this._pendingQueue.length) {
      this.log('no queued requests');
      return
    }
    // if we don't have any idle clients and we have no more room do nothing
    if (!this._idle.length && this._isFull()) {
      return
    }
    const pendingItem = this._pendingQueue.shift();
    if (this._idle.length) {
      const idleItem = this._idle.pop();
      clearTimeout(idleItem.timeoutId);
      const client = idleItem.client;
      client.ref && client.ref();
      const idleListener = idleItem.idleListener;

      return this._acquireClient(client, pendingItem, idleListener, false)
    }
    if (!this._isFull()) {
      return this.newClient(pendingItem)
    }
    throw new Error('unexpected condition')
  }

  _remove(client, callback) {
    const removed = removeWhere(this._idle, (item) => item.client === client);

    if (removed !== undefined) {
      clearTimeout(removed.timeoutId);
    }

    this._clients = this._clients.filter((c) => c !== client);
    const context = this;
    client.end(() => {
      context.emit('remove', client);

      if (typeof callback === 'function') {
        callback();
      }
    });
  }

  connect(cb) {
    if (this.ending) {
      const err = new Error('Cannot use a pool after calling end on the pool');
      return cb ? cb(err) : this.Promise.reject(err)
    }

    const response = promisify(this.Promise, cb);
    const result = response.result;

    // if we don't have to connect a new client, don't do so
    if (this._isFull() || this._idle.length) {
      // if we have idle clients schedule a pulse immediately
      if (this._idle.length) {
        process.nextTick(() => this._pulseQueue());
      }

      if (!this.options.connectionTimeoutMillis) {
        this._pendingQueue.push(new PendingItem(response.callback));
        return result
      }

      const queueCallback = (err, res, done) => {
        clearTimeout(tid);
        response.callback(err, res, done);
      };

      const pendingItem = new PendingItem(queueCallback);

      // set connection timeout on checking out an existing client
      const tid = setTimeout(() => {
        // remove the callback from pending waiters because
        // we're going to call it with a timeout error
        removeWhere(this._pendingQueue, (i) => i.callback === queueCallback);
        pendingItem.timedOut = true;
        response.callback(new Error('timeout exceeded when trying to connect'));
      }, this.options.connectionTimeoutMillis);

      if (tid.unref) {
        tid.unref();
      }

      this._pendingQueue.push(pendingItem);
      return result
    }

    this.newClient(new PendingItem(response.callback));

    return result
  }

  newClient(pendingItem) {
    const client = new this.Client(this.options);
    this._clients.push(client);
    const idleListener = makeIdleListener(this, client);

    this.log('checking client timeout');

    // connection timeout logic
    let tid;
    let timeoutHit = false;
    if (this.options.connectionTimeoutMillis) {
      tid = setTimeout(() => {
        this.log('ending client due to timeout');
        timeoutHit = true;
        // force kill the node driver, and let libpq do its teardown
        client.connection ? client.connection.stream.destroy() : client.end();
      }, this.options.connectionTimeoutMillis);
    }

    this.log('connecting new client');
    client.connect((err) => {
      if (tid) {
        clearTimeout(tid);
      }
      client.on('error', idleListener);
      if (err) {
        this.log('client failed to connect', err);
        // remove the dead client from our list of clients
        this._clients = this._clients.filter((c) => c !== client);
        if (timeoutHit) {
          err = new Error('Connection terminated due to connection timeout', { cause: err });
        }

        // this client won’t be released, so move on immediately
        this._pulseQueue();

        if (!pendingItem.timedOut) {
          pendingItem.callback(err, undefined, NOOP);
        }
      } else {
        this.log('new client connected');

        if (this.options.maxLifetimeSeconds !== 0) {
          const maxLifetimeTimeout = setTimeout(() => {
            this.log('ending client due to expired lifetime');
            this._expired.add(client);
            const idleIndex = this._idle.findIndex((idleItem) => idleItem.client === client);
            if (idleIndex !== -1) {
              this._acquireClient(
                client,
                new PendingItem((err, client, clientRelease) => clientRelease()),
                idleListener,
                false
              );
            }
          }, this.options.maxLifetimeSeconds * 1000);

          maxLifetimeTimeout.unref();
          client.once('end', () => clearTimeout(maxLifetimeTimeout));
        }

        return this._acquireClient(client, pendingItem, idleListener, true)
      }
    });
  }

  // acquire a client for a pending work item
  _acquireClient(client, pendingItem, idleListener, isNew) {
    if (isNew) {
      this.emit('connect', client);
    }

    this.emit('acquire', client);

    client.release = this._releaseOnce(client, idleListener);

    client.removeListener('error', idleListener);

    if (!pendingItem.timedOut) {
      if (isNew && this.options.verify) {
        this.options.verify(client, (err) => {
          if (err) {
            client.release(err);
            return pendingItem.callback(err, undefined, NOOP)
          }

          pendingItem.callback(undefined, client, client.release);
        });
      } else {
        pendingItem.callback(undefined, client, client.release);
      }
    } else {
      if (isNew && this.options.verify) {
        this.options.verify(client, client.release);
      } else {
        client.release();
      }
    }
  }

  // returns a function that wraps _release and throws if called more than once
  _releaseOnce(client, idleListener) {
    let released = false;

    return (err) => {
      if (released) {
        throwOnDoubleRelease();
      }

      released = true;
      this._release(client, idleListener, err);
    }
  }

  // release a client back to the poll, include an error
  // to remove it from the pool
  _release(client, idleListener, err) {
    client.on('error', idleListener);

    client._poolUseCount = (client._poolUseCount || 0) + 1;

    this.emit('release', err, client);

    // TODO(bmc): expose a proper, public interface _queryable and _ending
    if (err || this.ending || !client._queryable || client._ending || client._poolUseCount >= this.options.maxUses) {
      if (client._poolUseCount >= this.options.maxUses) {
        this.log('remove expended client');
      }

      return this._remove(client, this._pulseQueue.bind(this))
    }

    const isExpired = this._expired.has(client);
    if (isExpired) {
      this.log('remove expired client');
      this._expired.delete(client);
      return this._remove(client, this._pulseQueue.bind(this))
    }

    // idle timeout
    let tid;
    if (this.options.idleTimeoutMillis && this._isAboveMin()) {
      tid = setTimeout(() => {
        this.log('remove idle client');
        this._remove(client, this._pulseQueue.bind(this));
      }, this.options.idleTimeoutMillis);

      if (this.options.allowExitOnIdle) {
        // allow Node to exit if this is all that's left
        tid.unref();
      }
    }

    if (this.options.allowExitOnIdle) {
      client.unref();
    }

    this._idle.push(new IdleItem(client, idleListener, tid));
    this._pulseQueue();
  }

  query(text, values, cb) {
    // guard clause against passing a function as the first parameter
    if (typeof text === 'function') {
      const response = promisify(this.Promise, text);
      setImmediate(function () {
        return response.callback(new Error('Passing a function as the first parameter to pool.query is not supported'))
      });
      return response.result
    }

    // allow plain text query without values
    if (typeof values === 'function') {
      cb = values;
      values = undefined;
    }
    const response = promisify(this.Promise, cb);
    cb = response.callback;

    this.connect((err, client) => {
      if (err) {
        return cb(err)
      }

      let clientReleased = false;
      const onError = (err) => {
        if (clientReleased) {
          return
        }
        clientReleased = true;
        client.release(err);
        cb(err);
      };

      client.once('error', onError);
      this.log('dispatching query');
      try {
        client.query(text, values, (err, res) => {
          this.log('query dispatched');
          client.removeListener('error', onError);
          if (clientReleased) {
            return
          }
          clientReleased = true;
          client.release(err);
          if (err) {
            return cb(err)
          }
          return cb(undefined, res)
        });
      } catch (err) {
        client.release(err);
        return cb(err)
      }
    });
    return response.result
  }

  end(cb) {
    this.log('ending');
    if (this.ending) {
      const err = new Error('Called end on pool more than once');
      return cb ? cb(err) : this.Promise.reject(err)
    }
    this.ending = true;
    const promised = promisify(this.Promise, cb);
    this._endCallback = promised.callback;
    this._pulseQueue();
    return promised.result
  }

  get waitingCount() {
    return this._pendingQueue.length
  }

  get idleCount() {
    return this._idle.length
  }

  get expiredCount() {
    return this._clients.reduce((acc, client) => acc + (this._expired.has(client) ? 1 : 0), 0)
  }

  get totalCount() {
    return this._clients.length
  }
};
var pgPool = Pool$1;

const Pool$2 = /*@__PURE__*/getDefaultExportFromCjs(pgPool);

// ESM wrapper for pg-pool

const esm$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: Pool$2
}, Symbol.toStringTag, { value: 'Module' }));

const require$$5 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(esm$1);

var client = {exports: {}};

var query = {exports: {}};

var hasRequiredQuery;

function requireQuery () {
	if (hasRequiredQuery) return query.exports;
	hasRequiredQuery = 1;

	const EventEmitter = require$$2$b.EventEmitter;
	const util = require$$1$e;
	const utils = utils$5;

	const NativeQuery = (query.exports = function (config, values, callback) {
	  EventEmitter.call(this);
	  config = utils.normalizeQueryConfig(config, values, callback);
	  this.text = config.text;
	  this.values = config.values;
	  this.name = config.name;
	  this.queryMode = config.queryMode;
	  this.callback = config.callback;
	  this.state = 'new';
	  this._arrayMode = config.rowMode === 'array';

	  // if the 'row' event is listened for
	  // then emit them as they come in
	  // without setting singleRowMode to true
	  // this has almost no meaning because libpq
	  // reads all rows into memory before returning any
	  this._emitRowEvents = false;
	  this.on(
	    'newListener',
	    function (event) {
	      if (event === 'row') this._emitRowEvents = true;
	    }.bind(this)
	  );
	});

	util.inherits(NativeQuery, EventEmitter);

	const errorFieldMap = {
	  sqlState: 'code',
	  statementPosition: 'position',
	  messagePrimary: 'message',
	  context: 'where',
	  schemaName: 'schema',
	  tableName: 'table',
	  columnName: 'column',
	  dataTypeName: 'dataType',
	  constraintName: 'constraint',
	  sourceFile: 'file',
	  sourceLine: 'line',
	  sourceFunction: 'routine',
	};

	NativeQuery.prototype.handleError = function (err) {
	  // copy pq error fields into the error object
	  const fields = this.native.pq.resultErrorFields();
	  if (fields) {
	    for (const key in fields) {
	      const normalizedFieldName = errorFieldMap[key] || key;
	      err[normalizedFieldName] = fields[key];
	    }
	  }
	  if (this.callback) {
	    this.callback(err);
	  } else {
	    this.emit('error', err);
	  }
	  this.state = 'error';
	};

	NativeQuery.prototype.then = function (onSuccess, onFailure) {
	  return this._getPromise().then(onSuccess, onFailure)
	};

	NativeQuery.prototype.catch = function (callback) {
	  return this._getPromise().catch(callback)
	};

	NativeQuery.prototype._getPromise = function () {
	  if (this._promise) return this._promise
	  this._promise = new Promise(
	    function (resolve, reject) {
	      this._once('end', resolve);
	      this._once('error', reject);
	    }.bind(this)
	  );
	  return this._promise
	};

	NativeQuery.prototype.submit = function (client) {
	  this.state = 'running';
	  const self = this;
	  this.native = client.native;
	  client.native.arrayMode = this._arrayMode;

	  let after = function (err, rows, results) {
	    client.native.arrayMode = false;
	    setImmediate(function () {
	      self.emit('_done');
	    });

	    // handle possible query error
	    if (err) {
	      return self.handleError(err)
	    }

	    // emit row events for each row in the result
	    if (self._emitRowEvents) {
	      if (results.length > 1) {
	        rows.forEach((rowOfRows, i) => {
	          rowOfRows.forEach((row) => {
	            self.emit('row', row, results[i]);
	          });
	        });
	      } else {
	        rows.forEach(function (row) {
	          self.emit('row', row, results);
	        });
	      }
	    }

	    // handle successful result
	    self.state = 'end';
	    self.emit('end', results);
	    if (self.callback) {
	      self.callback(null, results);
	    }
	  };

	  if (process.domain) {
	    after = process.domain.bind(after);
	  }

	  // named query
	  if (this.name) {
	    if (this.name.length > 63) {
	      console.error('Warning! Postgres only supports 63 characters for query names.');
	      console.error('You supplied %s (%s)', this.name, this.name.length);
	      console.error('This can cause conflicts and silent errors executing queries');
	    }
	    const values = (this.values || []).map(utils.prepareValue);

	    // check if the client has already executed this named query
	    // if so...just execute it again - skip the planning phase
	    if (client.namedQueries[this.name]) {
	      if (this.text && client.namedQueries[this.name] !== this.text) {
	        const err = new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`);
	        return after(err)
	      }
	      return client.native.execute(this.name, values, after)
	    }
	    // plan the named query the first time, then execute it
	    return client.native.prepare(this.name, this.text, values.length, function (err) {
	      if (err) return after(err)
	      client.namedQueries[self.name] = self.text;
	      return self.native.execute(self.name, values, after)
	    })
	  } else if (this.values) {
	    if (!Array.isArray(this.values)) {
	      const err = new Error('Query values must be an array');
	      return after(err)
	    }
	    const vals = this.values.map(utils.prepareValue);
	    client.native.query(this.text, vals, after);
	  } else if (this.queryMode === 'extended') {
	    client.native.query(this.text, [], after);
	  } else {
	    client.native.query(this.text, after);
	  }
	};
	return query.exports;
}

var hasRequiredClient;

function requireClient () {
	if (hasRequiredClient) return client.exports;
	hasRequiredClient = 1;

	// eslint-disable-next-line
	var Native;
	// eslint-disable-next-line no-useless-catch
	try {
	  // Wrap this `require()` in a try-catch to avoid upstream bundlers from complaining that this might not be available since it is an optional import
	  Native = require('pg-native');
	} catch (e) {
	  throw e
	}
	const TypeOverrides = typeOverrides;
	const EventEmitter = require$$2$b.EventEmitter;
	const util = require$$1$e;
	const ConnectionParameters = connectionParameters;

	const NativeQuery = /*@__PURE__*/ requireQuery();

	const Client = (client.exports = function (config) {
	  EventEmitter.call(this);
	  config = config || {};

	  this._Promise = config.Promise || commonjsGlobal.Promise;
	  this._types = new TypeOverrides(config.types);

	  this.native = new Native({
	    types: this._types,
	  });

	  this._queryQueue = [];
	  this._ending = false;
	  this._connecting = false;
	  this._connected = false;
	  this._queryable = true;

	  // keep these on the object for legacy reasons
	  // for the time being. TODO: deprecate all this jazz
	  const cp = (this.connectionParameters = new ConnectionParameters(config));
	  if (config.nativeConnectionString) cp.nativeConnectionString = config.nativeConnectionString;
	  this.user = cp.user;

	  // "hiding" the password so it doesn't show up in stack traces
	  // or if the client is console.logged
	  Object.defineProperty(this, 'password', {
	    configurable: true,
	    enumerable: false,
	    writable: true,
	    value: cp.password,
	  });
	  this.database = cp.database;
	  this.host = cp.host;
	  this.port = cp.port;

	  // a hash to hold named queries
	  this.namedQueries = {};
	});

	Client.Query = NativeQuery;

	util.inherits(Client, EventEmitter);

	Client.prototype._errorAllQueries = function (err) {
	  const enqueueError = (query) => {
	    process.nextTick(() => {
	      query.native = this.native;
	      query.handleError(err);
	    });
	  };

	  if (this._hasActiveQuery()) {
	    enqueueError(this._activeQuery);
	    this._activeQuery = null;
	  }

	  this._queryQueue.forEach(enqueueError);
	  this._queryQueue.length = 0;
	};

	// connect to the backend
	// pass an optional callback to be called once connected
	// or with an error if there was a connection error
	Client.prototype._connect = function (cb) {
	  const self = this;

	  if (this._connecting) {
	    process.nextTick(() => cb(new Error('Client has already been connected. You cannot reuse a client.')));
	    return
	  }

	  this._connecting = true;

	  this.connectionParameters.getLibpqConnectionString(function (err, conString) {
	    if (self.connectionParameters.nativeConnectionString) conString = self.connectionParameters.nativeConnectionString;
	    if (err) return cb(err)
	    self.native.connect(conString, function (err) {
	      if (err) {
	        self.native.end();
	        return cb(err)
	      }

	      // set internal states to connected
	      self._connected = true;

	      // handle connection errors from the native layer
	      self.native.on('error', function (err) {
	        self._queryable = false;
	        self._errorAllQueries(err);
	        self.emit('error', err);
	      });

	      self.native.on('notification', function (msg) {
	        self.emit('notification', {
	          channel: msg.relname,
	          payload: msg.extra,
	        });
	      });

	      // signal we are connected now
	      self.emit('connect');
	      self._pulseQueryQueue(true);

	      cb();
	    });
	  });
	};

	Client.prototype.connect = function (callback) {
	  if (callback) {
	    this._connect(callback);
	    return
	  }

	  return new this._Promise((resolve, reject) => {
	    this._connect((error) => {
	      if (error) {
	        reject(error);
	      } else {
	        resolve();
	      }
	    });
	  })
	};

	// send a query to the server
	// this method is highly overloaded to take
	// 1) string query, optional array of parameters, optional function callback
	// 2) object query with {
	//    string query
	//    optional array values,
	//    optional function callback instead of as a separate parameter
	//    optional string name to name & cache the query plan
	//    optional string rowMode = 'array' for an array of results
	//  }
	Client.prototype.query = function (config, values, callback) {
	  let query;
	  let result;
	  let readTimeout;
	  let readTimeoutTimer;
	  let queryCallback;

	  if (config === null || config === undefined) {
	    throw new TypeError('Client was passed a null or undefined query')
	  } else if (typeof config.submit === 'function') {
	    readTimeout = config.query_timeout || this.connectionParameters.query_timeout;
	    result = query = config;
	    // accept query(new Query(...), (err, res) => { }) style
	    if (typeof values === 'function') {
	      config.callback = values;
	    }
	  } else {
	    readTimeout = config.query_timeout || this.connectionParameters.query_timeout;
	    query = new NativeQuery(config, values, callback);
	    if (!query.callback) {
	      let resolveOut, rejectOut;
	      result = new this._Promise((resolve, reject) => {
	        resolveOut = resolve;
	        rejectOut = reject;
	      }).catch((err) => {
	        Error.captureStackTrace(err);
	        throw err
	      });
	      query.callback = (err, res) => (err ? rejectOut(err) : resolveOut(res));
	    }
	  }

	  if (readTimeout) {
	    queryCallback = query.callback;

	    readTimeoutTimer = setTimeout(() => {
	      const error = new Error('Query read timeout');

	      process.nextTick(() => {
	        query.handleError(error, this.connection);
	      });

	      queryCallback(error);

	      // we already returned an error,
	      // just do nothing if query completes
	      query.callback = () => {};

	      // Remove from queue
	      const index = this._queryQueue.indexOf(query);
	      if (index > -1) {
	        this._queryQueue.splice(index, 1);
	      }

	      this._pulseQueryQueue();
	    }, readTimeout);

	    query.callback = (err, res) => {
	      clearTimeout(readTimeoutTimer);
	      queryCallback(err, res);
	    };
	  }

	  if (!this._queryable) {
	    query.native = this.native;
	    process.nextTick(() => {
	      query.handleError(new Error('Client has encountered a connection error and is not queryable'));
	    });
	    return result
	  }

	  if (this._ending) {
	    query.native = this.native;
	    process.nextTick(() => {
	      query.handleError(new Error('Client was closed and is not queryable'));
	    });
	    return result
	  }

	  this._queryQueue.push(query);
	  this._pulseQueryQueue();
	  return result
	};

	// disconnect from the backend server
	Client.prototype.end = function (cb) {
	  const self = this;

	  this._ending = true;

	  if (!this._connected) {
	    this.once('connect', this.end.bind(this, cb));
	  }
	  let result;
	  if (!cb) {
	    result = new this._Promise(function (resolve, reject) {
	      cb = (err) => (err ? reject(err) : resolve());
	    });
	  }
	  this.native.end(function () {
	    self._errorAllQueries(new Error('Connection terminated'));

	    process.nextTick(() => {
	      self.emit('end');
	      if (cb) cb();
	    });
	  });
	  return result
	};

	Client.prototype._hasActiveQuery = function () {
	  return this._activeQuery && this._activeQuery.state !== 'error' && this._activeQuery.state !== 'end'
	};

	Client.prototype._pulseQueryQueue = function (initialConnection) {
	  if (!this._connected) {
	    return
	  }
	  if (this._hasActiveQuery()) {
	    return
	  }
	  const query = this._queryQueue.shift();
	  if (!query) {
	    if (!initialConnection) {
	      this.emit('drain');
	    }
	    return
	  }
	  this._activeQuery = query;
	  query.submit(this);
	  const self = this;
	  query.once('_done', function () {
	    self._pulseQueryQueue();
	  });
	};

	// attempt to cancel an in-progress query
	Client.prototype.cancel = function (query) {
	  if (this._activeQuery === query) {
	    this.native.cancel(function () {});
	  } else if (this._queryQueue.indexOf(query) !== -1) {
	    this._queryQueue.splice(this._queryQueue.indexOf(query), 1);
	  }
	};

	Client.prototype.ref = function () {};
	Client.prototype.unref = function () {};

	Client.prototype.setTypeParser = function (oid, format, parseFn) {
	  return this._types.setTypeParser(oid, format, parseFn)
	};

	Client.prototype.getTypeParser = function (oid, format) {
	  return this._types.getTypeParser(oid, format)
	};
	return client.exports;
}

var native;
var hasRequiredNative;

function requireNative () {
	if (hasRequiredNative) return native;
	hasRequiredNative = 1;
	native = /*@__PURE__*/ requireClient();
	return native;
}

(function (module) {

	const Client = client$1;
	const defaults = defaultsExports;
	const Connection = connection;
	const Result = result;
	const utils = utils$5;
	const Pool = require$$5;
	const TypeOverrides = typeOverrides;
	const { DatabaseError } = esm$2;
	const { escapeIdentifier, escapeLiteral } = utils$5;

	const poolFactory = (Client) => {
	  return class BoundPool extends Pool {
	    constructor(options) {
	      super(options, Client);
	    }
	  }
	};

	const PG = function (clientConstructor) {
	  this.defaults = defaults;
	  this.Client = clientConstructor;
	  this.Query = this.Client.Query;
	  this.Pool = poolFactory(this.Client);
	  this._pools = [];
	  this.Connection = Connection;
	  this.types = /*@__PURE__*/ requirePgTypes();
	  this.DatabaseError = DatabaseError;
	  this.TypeOverrides = TypeOverrides;
	  this.escapeIdentifier = escapeIdentifier;
	  this.escapeLiteral = escapeLiteral;
	  this.Result = Result;
	  this.utils = utils;
	};

	if (typeof process.env.NODE_PG_FORCE_NATIVE !== 'undefined') {
	  module.exports = new PG(/*@__PURE__*/ requireNative());
	} else {
	  module.exports = new PG(Client);

	  // lazy require native module...the native module may not have installed
	  Object.defineProperty(module.exports, 'native', {
	    configurable: true,
	    enumerable: false,
	    get() {
	      let native = null;
	      try {
	        native = new PG(/*@__PURE__*/ requireNative());
	      } catch (err) {
	        if (err.code !== 'MODULE_NOT_FOUND') {
	          throw err
	        }
	      }

	      // overwrite module.exports.native so that getter is never called again
	      Object.defineProperty(module.exports, 'native', {
	        value: native,
	      });

	      return native
	    },
	  });
	} 
} (lib$2));

var libExports = lib$2.exports;
const pg = /*@__PURE__*/getDefaultExportFromCjs(libExports);

// ESM wrapper for pg

// Re-export all the properties
const Client$2 = pg.Client;
const Pool = pg.Pool;
const Connection = pg.Connection;
const types = pg.types;
const Query = pg.Query;
const DatabaseError = pg.DatabaseError;
const escapeIdentifier = pg.escapeIdentifier;
const escapeLiteral = pg.escapeLiteral;
const Result = pg.Result;
const TypeOverrides = pg.TypeOverrides;

// Also export the defaults
const defaults = pg.defaults;

const esm = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Client: Client$2,
  Connection: Connection,
  DatabaseError: DatabaseError,
  Pool: Pool,
  Query: Query,
  Result: Result,
  TypeOverrides: TypeOverrides,
  default: pg,
  defaults: defaults,
  escapeIdentifier: escapeIdentifier,
  escapeLiteral: escapeLiteral,
  types: types
}, Symbol.toStringTag, { value: 'Module' }));

const require$$9 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(esm);

const require$$15 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(pgQueryStream);

var postgres;
var hasRequiredPostgres;

function requirePostgres () {
	if (hasRequiredPostgres) return postgres;
	hasRequiredPostgres = 1;
	// PostgreSQL
	// -------
	const extend = require$$0$7;
	const map = require$$1$5;
	const { promisify } = require$$1$e;
	const Client = client$2;

	const Transaction = /*@__PURE__*/ requirePgTransaction();
	const QueryCompiler = /*@__PURE__*/ requirePgQuerycompiler();
	const QueryBuilder = /*@__PURE__*/ requirePgQuerybuilder();
	const ColumnCompiler = /*@__PURE__*/ requirePgColumncompiler();
	const TableCompiler = /*@__PURE__*/ requirePgTablecompiler();
	const ViewCompiler = /*@__PURE__*/ requirePgViewcompiler();
	const ViewBuilder = /*@__PURE__*/ requirePgViewbuilder();
	const SchemaCompiler = /*@__PURE__*/ requirePgCompiler();
	const { makeEscape } = string;
	const { isString } = is;

	class Client_PG extends Client {
	  constructor(config) {
	    super(config);
	    if (config.returning) {
	      this.defaultReturning = config.returning;
	    }

	    if (config.searchPath) {
	      this.searchPath = config.searchPath;
	    }
	  }
	  transaction() {
	    return new Transaction(this, ...arguments);
	  }

	  queryBuilder() {
	    return new QueryBuilder(this);
	  }

	  queryCompiler(builder, formatter) {
	    return new QueryCompiler(this, builder, formatter);
	  }

	  columnCompiler() {
	    return new ColumnCompiler(this, ...arguments);
	  }

	  schemaCompiler() {
	    return new SchemaCompiler(this, ...arguments);
	  }

	  tableCompiler() {
	    return new TableCompiler(this, ...arguments);
	  }

	  viewCompiler() {
	    return new ViewCompiler(this, ...arguments);
	  }

	  viewBuilder() {
	    return new ViewBuilder(this, ...arguments);
	  }

	  _driver() {
	    return require$$9;
	  }

	  wrapIdentifierImpl(value) {
	    if (value === '*') return value;

	    let arrayAccessor = '';
	    const arrayAccessorMatch = value.match(/(.*?)(\[[0-9]+\])/);

	    if (arrayAccessorMatch) {
	      value = arrayAccessorMatch[1];
	      arrayAccessor = arrayAccessorMatch[2];
	    }

	    return `"${value.replace(/"/g, '""')}"${arrayAccessor}`;
	  }

	  _acquireOnlyConnection() {
	    const connection = new this.driver.Client(this.connectionSettings);

	    connection.on('error', (err) => {
	      connection.__knex__disposed = err;
	    });

	    connection.on('end', (err) => {
	      connection.__knex__disposed = err || 'Connection ended unexpectedly';
	    });

	    return connection.connect().then(() => connection);
	  }

	  // Get a raw connection, called by the `pool` whenever a new
	  // connection needs to be added to the pool.
	  acquireRawConnection() {
	    const client = this;

	    return this._acquireOnlyConnection()
	      .then(function (connection) {
	        if (!client.version) {
	          return client.checkVersion(connection).then(function (version) {
	            client.version = version;
	            return connection;
	          });
	        }

	        return connection;
	      })
	      .then(async function setSearchPath(connection) {
	        await client.setSchemaSearchPath(connection);
	        return connection;
	      });
	  }

	  // Used to explicitly close a connection, called internally by the pool
	  // when a connection times out or the pool is shutdown.
	  async destroyRawConnection(connection) {
	    const end = promisify((cb) => connection.end(cb));
	    return end();
	  }

	  // In PostgreSQL, we need to do a version check to do some feature
	  // checking on the database.
	  checkVersion(connection) {
	    return new Promise((resolve, reject) => {
	      connection.query('select version();', (err, resp) => {
	        if (err) return reject(err);
	        resolve(this._parseVersion(resp.rows[0].version));
	      });
	    });
	  }

	  _parseVersion(versionString) {
	    return /^PostgreSQL (.*?)( |$)/.exec(versionString)[1];
	  }

	  // Position the bindings for the query. The escape sequence for question mark
	  // is \? (e.g. knex.raw("\\?") since javascript requires '\' to be escaped too...)
	  positionBindings(sql) {
	    let questionCount = 0;
	    return sql.replace(/(\\*)(\?)/g, function (match, escapes) {
	      if (escapes.length % 2) {
	        return '?';
	      } else {
	        questionCount++;
	        return `$${questionCount}`;
	      }
	    });
	  }

	  setSchemaSearchPath(connection, searchPath) {
	    let path = searchPath || this.searchPath;

	    if (!path) return Promise.resolve(true);

	    if (!Array.isArray(path) && !isString(path)) {
	      throw new TypeError(
	        `knex: Expected searchPath to be Array/String, got: ${typeof path}`
	      );
	    }

	    if (isString(path)) {
	      if (path.includes(',')) {
	        const parts = path.split(',');
	        const arraySyntax = `[${parts
	          .map((searchPath) => `'${searchPath}'`)
	          .join(', ')}]`;
	        this.logger.warn(
	          `Detected comma in searchPath "${path}".` +
	            `If you are trying to specify multiple schemas, use Array syntax: ${arraySyntax}`
	        );
	      }
	      path = [path];
	    }

	    path = path.map((schemaName) => `"${schemaName}"`).join(',');

	    return new Promise(function (resolver, rejecter) {
	      connection.query(`set search_path to ${path}`, function (err) {
	        if (err) return rejecter(err);
	        resolver(true);
	      });
	    });
	  }

	  _stream(connection, obj, stream, options) {
	    if (!obj.sql) throw new Error('The query is empty');

	    const PGQueryStream = process.browser
	      ? undefined
	      : require$$15;
	    const sql = obj.sql;

	    return new Promise(function (resolver, rejecter) {
	      const queryStream = connection.query(
	        new PGQueryStream(sql, obj.bindings, options),
	        (err) => {
	          rejecter(err);
	        }
	      );

	      queryStream.on('error', function (error) {
	        rejecter(error);
	        stream.emit('error', error);
	      });

	      // 'end' IS propagated by .pipe, by default
	      stream.on('end', resolver);
	      queryStream.pipe(stream);
	    });
	  }

	  // Runs the query on the specified connection, providing the bindings
	  // and any other necessary prep work.
	  _query(connection, obj) {
	    if (!obj.sql) throw new Error('The query is empty');

	    let queryConfig = {
	      text: obj.sql,
	      values: obj.bindings || [],
	    };

	    if (obj.options) {
	      queryConfig = extend(queryConfig, obj.options);
	    }

	    return new Promise(function (resolver, rejecter) {
	      connection.query(queryConfig, function (err, response) {
	        if (err) return rejecter(err);
	        obj.response = response;
	        resolver(obj);
	      });
	    });
	  }

	  // Ensures the response is returned in the same format as other clients.
	  processResponse(obj, runner) {
	    const resp = obj.response;
	    if (obj.output) return obj.output.call(runner, resp);
	    if (obj.method === 'raw') return resp;
	    const { returning } = obj;
	    if (resp.command === 'SELECT') {
	      if (obj.method === 'first') return resp.rows[0];
	      if (obj.method === 'pluck') return map(resp.rows, obj.pluck);
	      return resp.rows;
	    }
	    if (returning) {
	      const returns = [];
	      for (let i = 0, l = resp.rows.length; i < l; i++) {
	        const row = resp.rows[i];
	        returns[i] = row;
	      }
	      return returns;
	    }
	    if (resp.command === 'UPDATE' || resp.command === 'DELETE') {
	      return resp.rowCount;
	    }
	    return resp;
	  }

	  async cancelQuery(connectionToKill) {
	    const conn = await this.acquireRawConnection();

	    try {
	      return await this._wrappedCancelQueryCall(conn, connectionToKill);
	    } finally {
	      await this.destroyRawConnection(conn).catch((err) => {
	        this.logger.warn(`Connection Error: ${err}`);
	      });
	    }
	  }
	  _wrappedCancelQueryCall(conn, connectionToKill) {
	    return this._query(conn, {
	      sql: 'SELECT pg_cancel_backend($1);',
	      bindings: [connectionToKill.processID],
	      options: {},
	    });
	  }

	  toPathForJson(jsonPath) {
	    const PG_PATH_REGEX = /^{.*}$/;
	    if (jsonPath.match(PG_PATH_REGEX)) {
	      return jsonPath;
	    }
	    return (
	      '{' +
	      jsonPath
	        .replace(/^(\$\.)/, '') // remove the first dollar
	        .replace('.', ',')
	        .replace(/\[([0-9]+)]/, ',$1') + // transform [number] to ,number
	      '}'
	    );
	  }
	}

	Object.assign(Client_PG.prototype, {
	  dialect: 'postgresql',

	  driverName: 'pg',
	  canCancelQuery: true,

	  _escapeBinding: makeEscape({
	    escapeArray(val, esc) {
	      return esc(arrayString(val, esc));
	    },
	    escapeString(str) {
	      let hasBackslash = false;
	      let escaped = "'";
	      for (let i = 0; i < str.length; i++) {
	        const c = str[i];
	        if (c === "'") {
	          escaped += c + c;
	        } else if (c === '\\') {
	          escaped += c + c;
	          hasBackslash = true;
	        } else {
	          escaped += c;
	        }
	      }
	      escaped += "'";
	      if (hasBackslash === true) {
	        escaped = 'E' + escaped;
	      }
	      return escaped;
	    },
	    escapeObject(val, prepareValue, timezone, seen = []) {
	      if (val && typeof val.toPostgres === 'function') {
	        seen = seen || [];
	        if (seen.indexOf(val) !== -1) {
	          throw new Error(
	            `circular reference detected while preparing "${val}" for query`
	          );
	        }
	        seen.push(val);
	        return prepareValue(val.toPostgres(prepareValue), seen);
	      }
	      return JSON.stringify(val);
	    },
	  }),
	});

	function arrayString(arr, esc) {
	  let result = '{';
	  for (let i = 0; i < arr.length; i++) {
	    if (i > 0) result += ',';
	    const val = arr[i];
	    if (val === null || typeof val === 'undefined') {
	      result += 'NULL';
	    } else if (Array.isArray(val)) {
	      result += arrayString(val, esc);
	    } else if (typeof val === 'number') {
	      result += val;
	    } else {
	      result += JSON.stringify(typeof val === 'string' ? val : esc(val));
	    }
	  }
	  return result + '}';
	}

	postgres = Client_PG;
	return postgres;
}

var crdbQuerycompiler;
var hasRequiredCrdbQuerycompiler;

function requireCrdbQuerycompiler () {
	if (hasRequiredCrdbQuerycompiler) return crdbQuerycompiler;
	hasRequiredCrdbQuerycompiler = 1;
	const QueryCompiler_PG = /*@__PURE__*/ requirePgQuerycompiler();
	const {
	  columnize: columnize_,
	  wrap: wrap_,
	  operator: operator_,
	} = wrappingFormatter;

	class QueryCompiler_CRDB extends QueryCompiler_PG {
	  truncate() {
	    return `truncate ${this.tableName}`;
	  }

	  upsert() {
	    let sql = this._upsert();
	    if (sql === '') return sql;
	    const { returning } = this.single;
	    if (returning) sql += this._returning(returning);
	    return {
	      sql: sql,
	      returning,
	    };
	  }

	  _upsert() {
	    const upsertValues = this.single.upsert || [];
	    const sql = this.with() + `upsert into ${this.tableName} `;
	    const body = this._insertBody(upsertValues);
	    return body === '' ? '' : sql + body;
	  }

	  _groupOrder(item, type) {
	    // CockroachDB don't support PostgreSQL order nulls first/last syntax, we take the generic one.
	    return this._basicGroupOrder(item, type);
	  }

	  whereJsonPath(statement) {
	    let castValue = '';
	    if (!isNaN(statement.value) && parseInt(statement.value)) {
	      castValue = '::int';
	    } else if (!isNaN(statement.value) && parseFloat(statement.value)) {
	      castValue = '::float';
	    } else {
	      castValue = " #>> '{}'";
	    }
	    return `json_extract_path(${this._columnClause(
	      statement
	    )}, ${this.client.toArrayPathFromJsonPath(
	      statement.jsonPath,
	      this.builder,
	      this.bindingsHolder
	    )})${castValue} ${operator_(
	      statement.operator,
	      this.builder,
	      this.client,
	      this.bindingsHolder
	    )} ${this._jsonValueClause(statement)}`;
	  }

	  // Json common functions
	  _jsonExtract(nameFunction, params) {
	    let extractions;
	    if (Array.isArray(params.column)) {
	      extractions = params.column;
	    } else {
	      extractions = [params];
	    }
	    return extractions
	      .map((extraction) => {
	        const jsonCol = `json_extract_path(${columnize_(
	          extraction.column || extraction[0],
	          this.builder,
	          this.client,
	          this.bindingsHolder
	        )}, ${this.client.toArrayPathFromJsonPath(
	          extraction.path || extraction[1],
	          this.builder,
	          this.bindingsHolder
	        )})`;
	        const alias = extraction.alias || extraction[2];
	        return alias
	          ? this.client.alias(jsonCol, this.formatter.wrap(alias))
	          : jsonCol;
	      })
	      .join(', ');
	  }

	  _onJsonPathEquals(nameJoinFunction, clause) {
	    return (
	      'json_extract_path(' +
	      wrap_(
	        clause.columnFirst,
	        undefined,
	        this.builder,
	        this.client,
	        this.bindingsHolder
	      ) +
	      ', ' +
	      this.client.toArrayPathFromJsonPath(
	        clause.jsonPathFirst,
	        this.builder,
	        this.bindingsHolder
	      ) +
	      ') = json_extract_path(' +
	      wrap_(
	        clause.columnSecond,
	        undefined,
	        this.builder,
	        this.client,
	        this.bindingsHolder
	      ) +
	      ', ' +
	      this.client.toArrayPathFromJsonPath(
	        clause.jsonPathSecond,
	        this.builder,
	        this.bindingsHolder
	      ) +
	      ')'
	    );
	  }
	}

	crdbQuerycompiler = QueryCompiler_CRDB;
	return crdbQuerycompiler;
}

var crdbColumncompiler;
var hasRequiredCrdbColumncompiler;

function requireCrdbColumncompiler () {
	if (hasRequiredCrdbColumncompiler) return crdbColumncompiler;
	hasRequiredCrdbColumncompiler = 1;
	const ColumnCompiler_PG = /*@__PURE__*/ requirePgColumncompiler();

	class ColumnCompiler_CRDB extends ColumnCompiler_PG {
	  uuid(options = { primaryKey: false }) {
	    return (
	      'uuid' +
	      (this.tableCompiler._canBeAddPrimaryKey(options)
	        ? ' primary key default gen_random_uuid()'
	        : '')
	    );
	  }
	}

	crdbColumncompiler = ColumnCompiler_CRDB;
	return crdbColumncompiler;
}

/* eslint max-len: 0 */

var crdbTablecompiler;
var hasRequiredCrdbTablecompiler;

function requireCrdbTablecompiler () {
	if (hasRequiredCrdbTablecompiler) return crdbTablecompiler;
	hasRequiredCrdbTablecompiler = 1;
	const TableCompiler = /*@__PURE__*/ requirePgTablecompiler();

	class TableCompiler_CRDB extends TableCompiler {
	  constructor(client, tableBuilder) {
	    super(client, tableBuilder);
	  }

	  addColumns(columns, prefix, colCompilers) {
	    if (prefix === this.alterColumnsPrefix) {
	      // alter columns
	      for (const col of colCompilers) {
	        this.client.logger.warn(
	          'Experimental alter column in use, see issue: https://github.com/cockroachdb/cockroach/issues/49329'
	        );
	        this.pushQuery({
	          sql: 'SET enable_experimental_alter_column_type_general = true',
	          bindings: [],
	        });
	        super._addColumn(col);
	      }
	    } else {
	      // base class implementation for normal add
	      super.addColumns(columns, prefix);
	    }
	  }

	  dropUnique(columns, indexName) {
	    indexName = indexName
	      ? this.formatter.wrap(indexName)
	      : this._indexCommand('unique', this.tableNameRaw, columns);
	    this.pushQuery(`drop index ${this.tableName()}@${indexName} cascade `);
	  }
	}

	crdbTablecompiler = TableCompiler_CRDB;
	return crdbTablecompiler;
}

var crdbViewcompiler;
var hasRequiredCrdbViewcompiler;

function requireCrdbViewcompiler () {
	if (hasRequiredCrdbViewcompiler) return crdbViewcompiler;
	hasRequiredCrdbViewcompiler = 1;
	const ViewCompiler_PG = /*@__PURE__*/ requirePgViewcompiler();

	class ViewCompiler_CRDB extends ViewCompiler_PG {
	  renameColumn(from, to) {
	    throw new Error('rename column of views is not supported by this dialect.');
	  }

	  defaultTo(column, defaultValue) {
	    throw new Error(
	      'change default values of views is not supported by this dialect.'
	    );
	  }
	}

	crdbViewcompiler = ViewCompiler_CRDB;
	return crdbViewcompiler;
}

var crdbQuerybuilder;
var hasRequiredCrdbQuerybuilder;

function requireCrdbQuerybuilder () {
	if (hasRequiredCrdbQuerybuilder) return crdbQuerybuilder;
	hasRequiredCrdbQuerybuilder = 1;
	const QueryBuilder = querybuilder;
	const isEmpty = require$$2$8;

	crdbQuerybuilder = class QueryBuilder_CockroachDB extends QueryBuilder {
	  upsert(values, returning, options) {
	    this._method = 'upsert';
	    if (!isEmpty(returning)) this.returning(returning, options);
	    this._single.upsert = values;
	    return this;
	  }
	};
	return crdbQuerybuilder;
}

var cockroachdb;
var hasRequiredCockroachdb;

function requireCockroachdb () {
	if (hasRequiredCockroachdb) return cockroachdb;
	hasRequiredCockroachdb = 1;
	// CockroachDB Client
	// -------
	const Client_PostgreSQL = /*@__PURE__*/ requirePostgres();
	const Transaction = /*@__PURE__*/ requirePgTransaction();
	const QueryCompiler = /*@__PURE__*/ requireCrdbQuerycompiler();
	const ColumnCompiler = /*@__PURE__*/ requireCrdbColumncompiler();
	const TableCompiler = /*@__PURE__*/ requireCrdbTablecompiler();
	const ViewCompiler = /*@__PURE__*/ requireCrdbViewcompiler();
	const QueryBuilder = /*@__PURE__*/ requireCrdbQuerybuilder();

	// Always initialize with the "QueryBuilder" and "QueryCompiler"
	// objects, which extend the base 'lib/query/builder' and
	// 'lib/query/compiler', respectively.
	class Client_CockroachDB extends Client_PostgreSQL {
	  transaction() {
	    return new Transaction(this, ...arguments);
	  }

	  queryCompiler(builder, formatter) {
	    return new QueryCompiler(this, builder, formatter);
	  }

	  columnCompiler() {
	    return new ColumnCompiler(this, ...arguments);
	  }

	  tableCompiler() {
	    return new TableCompiler(this, ...arguments);
	  }

	  viewCompiler() {
	    return new ViewCompiler(this, ...arguments);
	  }

	  queryBuilder() {
	    return new QueryBuilder(this);
	  }

	  _parseVersion(versionString) {
	    return versionString.split(' ')[2];
	  }

	  async cancelQuery(connectionToKill) {
	    try {
	      return await this._wrappedCancelQueryCall(null, connectionToKill);
	    } catch (err) {
	      this.logger.warn(`Connection Error: ${err}`);
	      throw err;
	    }
	  }

	  _wrappedCancelQueryCall(emptyConnection, connectionToKill) {
	    // FixMe https://github.com/cockroachdb/cockroach/issues/41335
	    if (
	      connectionToKill.activeQuery.processID === 0 &&
	      connectionToKill.activeQuery.secretKey === 0
	    ) {
	      return;
	    }

	    return connectionToKill.cancel(
	      connectionToKill,
	      connectionToKill.activeQuery
	    );
	  }

	  toArrayPathFromJsonPath(jsonPath, builder, bindingsHolder) {
	    return jsonPath
	      .replace(/^(\$\.)/, '') // remove the first dollar
	      .replace(/\[([0-9]+)]/, '.$1')
	      .split('.')
	      .map(
	        function (v) {
	          return this.parameter(v, builder, bindingsHolder);
	        }.bind(this)
	      )
	      .join(', ');
	  }
	}

	Object.assign(Client_CockroachDB.prototype, {
	  // The "dialect", for reference elsewhere.
	  driverName: 'cockroachdb',
	});

	cockroachdb = Client_CockroachDB;
	return cockroachdb;
}

const require$$1 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(isNil);

var mssqlFormatter;
var hasRequiredMssqlFormatter;

function requireMssqlFormatter () {
	if (hasRequiredMssqlFormatter) return mssqlFormatter;
	hasRequiredMssqlFormatter = 1;
	const Formatter = formatter;

	class MSSQL_Formatter extends Formatter {
	  // Accepts a string or array of columns to wrap as appropriate.
	  columnizeWithPrefix(prefix, target) {
	    const columns = typeof target === 'string' ? [target] : target;
	    let str = '',
	      i = -1;
	    while (++i < columns.length) {
	      if (i > 0) str += ', ';
	      str += prefix + this.wrap(columns[i]);
	    }
	    return str;
	  }

	  /**
	   * Returns its argument with single quotes escaped, so it can be included into a single-quoted string.
	   *
	   * For example, it converts "has'quote" to "has''quote".
	   *
	   * This assumes QUOTED_IDENTIFIER ON so it is only ' that need escaping,
	   * never ", because " cannot be used to quote a string when that's on;
	   * otherwise we'd need to be aware of whether the string is quoted with " or '.
	   *
	   * This assumption is consistent with the SQL Knex generates.
	   * @param {string} string
	   * @returns {string}
	   */
	  escapingStringDelimiters(string) {
	    return (string || '').replace(/'/g, "''");
	  }
	}

	mssqlFormatter = MSSQL_Formatter;
	return mssqlFormatter;
}

var transaction$4;
var hasRequiredTransaction$4;

function requireTransaction$4 () {
	if (hasRequiredTransaction$4) return transaction$4;
	hasRequiredTransaction$4 = 1;
	const Transaction = transaction$5;
	const debug = require$$2$9('knex:tx');

	class Transaction_MSSQL extends Transaction {
	  begin(/** @type {import('tedious').Connection} */ conn) {
	    debug('transaction::begin id=%s', this.txid);

	    return new Promise((resolve, reject) => {
	      conn.beginTransaction(
	        (err) => {
	          if (err) {
	            debug(
	              'transaction::begin error id=%s message=%s',
	              this.txid,
	              err.message
	            );
	            return reject(err);
	          }
	          resolve();
	        },
	        this.outerTx ? this.txid : undefined,
	        nameToIsolationLevelEnum(this.isolationLevel)
	      );
	    }).then(this._resolver, this._rejecter);
	  }

	  savepoint(conn) {
	    debug('transaction::savepoint id=%s', this.txid);

	    return new Promise((resolve, reject) => {
	      conn.saveTransaction(
	        (err) => {
	          if (err) {
	            debug(
	              'transaction::savepoint id=%s message=%s',
	              this.txid,
	              err.message
	            );
	            return reject(err);
	          }

	          this.trxClient.emit('query', {
	            __knexUid: this.trxClient.__knexUid,
	            __knexTxId: this.trxClient.__knexTxId,
	            autogenerated: true,
	            sql: this.outerTx
	              ? `SAVE TRANSACTION [${this.txid}]`
	              : `SAVE TRANSACTION`,
	          });
	          resolve();
	        },
	        this.outerTx ? this.txid : undefined
	      );
	    });
	  }

	  commit(conn, value) {
	    debug('transaction::commit id=%s', this.txid);

	    return new Promise((resolve, reject) => {
	      conn.commitTransaction(
	        (err) => {
	          if (err) {
	            debug(
	              'transaction::commit error id=%s message=%s',
	              this.txid,
	              err.message
	            );
	            return reject(err);
	          }

	          this._completed = true;
	          resolve(value);
	        },
	        this.outerTx ? this.txid : undefined
	      );
	    }).then(() => this._resolver(value), this._rejecter);
	  }

	  release(conn, value) {
	    return this._resolver(value);
	  }

	  rollback(conn, error) {
	    this._completed = true;
	    debug('transaction::rollback id=%s', this.txid);

	    return new Promise((_resolve, reject) => {
	      if (!conn.inTransaction) {
	        return reject(
	          error || new Error('Transaction rejected with non-error: undefined')
	        );
	      }

	      if (conn.state.name !== 'LoggedIn') {
	        return reject(
	          new Error(
	            "Can't rollback transaction. There is a request in progress"
	          )
	        );
	      }

	      conn.rollbackTransaction(
	        (err) => {
	          if (err) {
	            debug(
	              'transaction::rollback error id=%s message=%s',
	              this.txid,
	              err.message
	            );
	          }

	          reject(
	            err ||
	              error ||
	              new Error('Transaction rejected with non-error: undefined')
	          );
	        },
	        this.outerTx ? this.txid : undefined
	      );
	    }).catch((err) => {
	      if (!error && this.doNotRejectOnRollback) {
	        this._resolver();
	        return;
	      }
	      if (error) {
	        try {
	          err.originalError = error;
	        } catch (_err) {
	          // This is to handle https://github.com/knex/knex/issues/4128
	        }
	      }
	      this._rejecter(err);
	    });
	  }

	  rollbackTo(conn, error) {
	    return this.rollback(conn, error).then(
	      () =>
	        void this.trxClient.emit('query', {
	          __knexUid: this.trxClient.__knexUid,
	          __knexTxId: this.trxClient.__knexTxId,
	          autogenerated: true,
	          sql: `ROLLBACK TRANSACTION`,
	        })
	    );
	  }
	}

	transaction$4 = Transaction_MSSQL;

	function nameToIsolationLevelEnum(level) {
	  if (!level) return;
	  level = level.toUpperCase().replace(' ', '_');
	  const knownEnum = isolationEnum[level];
	  if (!knownEnum) {
	    throw new Error(
	      `Unknown Isolation level, was expecting one of: ${JSON.stringify(
	        humanReadableKeys
	      )}`
	    );
	  }
	  return knownEnum;
	}

	// Based on: https://github.com/tediousjs/node-mssql/blob/master/lib/isolationlevel.js
	const isolationEnum = {
	  READ_UNCOMMITTED: 0x01,
	  READ_COMMITTED: 0x02,
	  REPEATABLE_READ: 0x03,
	  SERIALIZABLE: 0x04,
	  SNAPSHOT: 0x05,
	};
	const humanReadableKeys = Object.keys(isolationEnum).map((key) =>
	  key.toLowerCase().replace('_', ' ')
	);
	return transaction$4;
}

var mssqlQuerycompiler;
var hasRequiredMssqlQuerycompiler;

function requireMssqlQuerycompiler () {
	if (hasRequiredMssqlQuerycompiler) return mssqlQuerycompiler;
	hasRequiredMssqlQuerycompiler = 1;
	// MSSQL Query Compiler
	// ------
	const QueryCompiler = querycompiler;

	const compact = require$$0$9;
	const identity = require$$2$4;
	const isEmpty = require$$2$8;
	const Raw = raw;
	const {
	  columnize: columnize_,
	} = wrappingFormatter;

	const components = [
	  'comments',
	  'columns',
	  'join',
	  'lock',
	  'where',
	  'union',
	  'group',
	  'having',
	  'order',
	  'limit',
	  'offset',
	];

	class QueryCompiler_MSSQL extends QueryCompiler {
	  constructor(client, builder, formatter) {
	    super(client, builder, formatter);

	    const { onConflict } = this.single;
	    if (onConflict) {
	      throw new Error('.onConflict() is not supported for mssql.');
	    }

	    this._emptyInsertValue = 'default values';
	  }

	  with() {
	    // WITH RECURSIVE is a syntax error:
	    // SQL Server does not syntactically distinguish recursive and non-recursive CTEs.
	    // So mark all statements as non-recursive, generate the SQL, then restore.
	    // This approach ensures any changes in base class with() get propagated here.
	    const undoList = [];
	    if (this.grouped.with) {
	      for (const stmt of this.grouped.with) {
	        if (stmt.recursive) {
	          undoList.push(stmt);
	          stmt.recursive = false;
	        }
	      }
	    }

	    const result = super.with();

	    // Restore the recursive markings, in case this same query gets cloned and passed to other drivers.
	    for (const stmt of undoList) {
	      stmt.recursive = true;
	    }
	    return result;
	  }

	  select() {
	    const sql = this.with();
	    const statements = components.map((component) => this[component](this));
	    return sql + compact(statements).join(' ');
	  }

	  //#region Insert
	  // Compiles an "insert" query, allowing for multiple
	  // inserts using a single query statement.
	  insert() {
	    if (
	      this.single.options &&
	      this.single.options.includeTriggerModifications
	    ) {
	      return this.insertWithTriggers();
	    } else {
	      return this.standardInsert();
	    }
	  }

	  insertWithTriggers() {
	    const insertValues = this.single.insert || [];
	    const { returning } = this.single;
	    let sql =
	      this.with() +
	      `${this._buildTempTable(returning)}insert into ${this.tableName} `;
	    const returningSql = returning
	      ? this._returning('insert', returning, true) + ' '
	      : '';

	    if (Array.isArray(insertValues)) {
	      if (insertValues.length === 0) {
	        return '';
	      }
	    } else if (typeof insertValues === 'object' && isEmpty(insertValues)) {
	      return {
	        sql:
	          sql +
	          returningSql +
	          this._emptyInsertValue +
	          this._buildReturningSelect(returning),
	        returning,
	      };
	    }
	    sql += this._buildInsertData(insertValues, returningSql);

	    if (returning) {
	      sql += this._buildReturningSelect(returning);
	    }

	    return {
	      sql,
	      returning,
	    };
	  }

	  _buildInsertData(insertValues, returningSql) {
	    let sql = '';
	    const insertData = this._prepInsert(insertValues);
	    if (typeof insertData === 'string') {
	      sql += insertData;
	    } else {
	      if (insertData.columns.length) {
	        sql += `(${this.formatter.columnize(insertData.columns)}`;
	        sql +=
	          `) ${returningSql}values (` +
	          this._buildInsertValues(insertData) +
	          ')';
	      } else if (insertValues.length === 1 && insertValues[0]) {
	        sql += returningSql + this._emptyInsertValue;
	      } else {
	        return '';
	      }
	    }
	    return sql;
	  }

	  standardInsert() {
	    const insertValues = this.single.insert || [];
	    let sql = this.with() + `insert into ${this.tableName} `;
	    const { returning } = this.single;
	    const returningSql = returning
	      ? this._returning('insert', returning) + ' '
	      : '';

	    if (Array.isArray(insertValues)) {
	      if (insertValues.length === 0) {
	        return '';
	      }
	    } else if (typeof insertValues === 'object' && isEmpty(insertValues)) {
	      return {
	        sql: sql + returningSql + this._emptyInsertValue,
	        returning,
	      };
	    }

	    sql += this._buildInsertData(insertValues, returningSql);

	    return {
	      sql,
	      returning,
	    };
	  }
	  //#endregion

	  //#region Update
	  // Compiles an `update` query, allowing for a return value.
	  update() {
	    if (
	      this.single.options &&
	      this.single.options.includeTriggerModifications
	    ) {
	      return this.updateWithTriggers();
	    } else {
	      return this.standardUpdate();
	    }
	  }

	  updateWithTriggers() {
	    const top = this.top();
	    const withSQL = this.with();
	    const updates = this._prepUpdate(this.single.update);
	    const join = this.join();
	    const where = this.where();
	    const order = this.order();
	    const { returning } = this.single;
	    const declaredTemp = this._buildTempTable(returning);
	    return {
	      sql:
	        withSQL +
	        declaredTemp +
	        `update ${top ? top + ' ' : ''}${this.tableName}` +
	        ' set ' +
	        updates.join(', ') +
	        (returning ? ` ${this._returning('update', returning, true)}` : '') +
	        (join ? ` from ${this.tableName} ${join}` : '') +
	        (where ? ` ${where}` : '') +
	        (order ? ` ${order}` : '') +
	        (!returning
	          ? this._returning('rowcount', '@@rowcount')
	          : this._buildReturningSelect(returning)),
	      returning: returning || '@@rowcount',
	    };
	  }

	  _formatGroupsItemValue(value, nulls) {
	    const column = super._formatGroupsItemValue(value);
	    // MSSQL dont support 'is null' syntax in order by,
	    // so we override this function and add MSSQL specific syntax.
	    if (nulls && !(value instanceof Raw)) {
	      const collNulls = `IIF(${column} is null,`;
	      if (nulls === 'first') {
	        return `${collNulls}0,1)`;
	      } else if (nulls === 'last') {
	        return `${collNulls}1,0)`;
	      }
	    }
	    return column;
	  }

	  standardUpdate() {
	    const top = this.top();
	    const withSQL = this.with();
	    const updates = this._prepUpdate(this.single.update);
	    const join = this.join();
	    const where = this.where();
	    const order = this.order();
	    const { returning } = this.single;
	    return {
	      sql:
	        withSQL +
	        `update ${top ? top + ' ' : ''}${this.tableName}` +
	        ' set ' +
	        updates.join(', ') +
	        (returning ? ` ${this._returning('update', returning)}` : '') +
	        (join ? ` from ${this.tableName} ${join}` : '') +
	        (where ? ` ${where}` : '') +
	        (order ? ` ${order}` : '') +
	        (!returning ? this._returning('rowcount', '@@rowcount') : ''),
	      returning: returning || '@@rowcount',
	    };
	  }
	  //#endregion

	  //#region Delete
	  // Compiles a `delete` query.
	  del() {
	    if (
	      this.single.options &&
	      this.single.options.includeTriggerModifications
	    ) {
	      return this.deleteWithTriggers();
	    } else {
	      return this.standardDelete();
	    }
	  }

	  deleteWithTriggers() {
	    // Make sure tableName is processed by the formatter first.
	    const withSQL = this.with();
	    const { tableName } = this;
	    const wheres = this.where();
	    const joins = this.join();
	    const { returning } = this.single;
	    const returningStr = returning
	      ? ` ${this._returning('del', returning, true)}`
	      : '';
	    const deleteSelector = joins ? `${tableName}${returningStr} ` : '';
	    return {
	      sql:
	        withSQL +
	        `${this._buildTempTable(
	          returning
	        )}delete ${deleteSelector}from ${tableName}` +
	        (!joins ? returningStr : '') +
	        (joins ? ` ${joins}` : '') +
	        (wheres ? ` ${wheres}` : '') +
	        (!returning
	          ? this._returning('rowcount', '@@rowcount')
	          : this._buildReturningSelect(returning)),
	      returning: returning || '@@rowcount',
	    };
	  }

	  standardDelete() {
	    // Make sure tableName is processed by the formatter first.
	    const withSQL = this.with();
	    const { tableName } = this;
	    const wheres = this.where();
	    const joins = this.join();
	    const { returning } = this.single;
	    const returningStr = returning
	      ? ` ${this._returning('del', returning)}`
	      : '';
	    // returning needs to be before "from" when using join
	    const deleteSelector = joins ? `${tableName}${returningStr} ` : '';
	    return {
	      sql:
	        withSQL +
	        `delete ${deleteSelector}from ${tableName}` +
	        (!joins ? returningStr : '') +
	        (joins ? ` ${joins}` : '') +
	        (wheres ? ` ${wheres}` : '') +
	        (!returning ? this._returning('rowcount', '@@rowcount') : ''),
	      returning: returning || '@@rowcount',
	    };
	  }
	  //#endregion

	  // Compiles the columns in the query, specifying if an item was distinct.
	  columns() {
	    let distinctClause = '';
	    if (this.onlyUnions()) return '';
	    const top = this.top();
	    const hints = this._hintComments();
	    const columns = this.grouped.columns || [];
	    let i = -1,
	      sql = [];
	    if (columns) {
	      while (++i < columns.length) {
	        const stmt = columns[i];
	        if (stmt.distinct) distinctClause = 'distinct ';
	        if (stmt.distinctOn) {
	          distinctClause = this.distinctOn(stmt.value);
	          continue;
	        }
	        if (stmt.type === 'aggregate') {
	          sql.push(...this.aggregate(stmt));
	        } else if (stmt.type === 'aggregateRaw') {
	          sql.push(this.aggregateRaw(stmt));
	        } else if (stmt.type === 'analytic') {
	          sql.push(this.analytic(stmt));
	        } else if (stmt.type === 'json') {
	          sql.push(this.json(stmt));
	        } else if (stmt.value && stmt.value.length > 0) {
	          sql.push(this.formatter.columnize(stmt.value));
	        }
	      }
	    }
	    if (sql.length === 0) sql = ['*'];
	    const select = this.onlyJson() ? '' : 'select ';
	    return (
	      `${select}${hints}${distinctClause}` +
	      (top ? top + ' ' : '') +
	      sql.join(', ') +
	      (this.tableName ? ` from ${this.tableName}` : '')
	    );
	  }

	  _returning(method, value, withTrigger) {
	    switch (method) {
	      case 'update':
	      case 'insert':
	        return value
	          ? `output ${this.formatter.columnizeWithPrefix('inserted.', value)}${
	              withTrigger ? ' into #out' : ''
	            }`
	          : '';
	      case 'del':
	        return value
	          ? `output ${this.formatter.columnizeWithPrefix('deleted.', value)}${
	              withTrigger ? ' into #out' : ''
	            }`
	          : '';
	      case 'rowcount':
	        return value ? ';select @@rowcount' : '';
	    }
	  }

	  _buildTempTable(values) {
	    // If value is nothing then return an empty string
	    if (values && values.length > 0) {
	      let selections = '';

	      // Build values that will be returned from this procedure
	      if (Array.isArray(values)) {
	        selections = values
	          .map((value) => `[t].${this.formatter.columnize(value)}`)
	          .join(',');
	      } else {
	        selections = `[t].${this.formatter.columnize(values)}`;
	      }

	      // Force #out to be correctly populated with the correct column structure.
	      let sql = `select top(0) ${selections} into #out `;
	      sql += `from ${this.tableName} as t `;
	      sql += `left join ${this.tableName} on 0=1;`;

	      return sql;
	    }

	    return '';
	  }

	  _buildReturningSelect(values) {
	    // If value is nothing then return an empty string
	    if (values && values.length > 0) {
	      let selections = '';

	      // Build columns to return
	      if (Array.isArray(values)) {
	        selections = values
	          .map((value) => `${this.formatter.columnize(value)}`)
	          .join(',');
	      } else {
	        selections = this.formatter.columnize(values);
	      }

	      // Get the returned values
	      let sql = `; select ${selections} from #out; `;
	      // Drop the temp table to prevent memory leaks
	      sql += `drop table #out;`;

	      return sql;
	    }

	    return '';
	  }

	  // Compiles a `truncate` query.
	  truncate() {
	    return `truncate table ${this.tableName}`;
	  }

	  forUpdate() {
	    // this doesn't work exacltly as it should, one should also mention index while locking
	    // https://stackoverflow.com/a/9818448/360060
	    return 'with (UPDLOCK)';
	  }

	  forShare() {
	    // http://www.sqlteam.com/article/introduction-to-locking-in-sql-server
	    return 'with (HOLDLOCK)';
	  }

	  // Compiles a `columnInfo` query.
	  columnInfo() {
	    const column = this.single.columnInfo;
	    let schema = this.single.schema;

	    // The user may have specified a custom wrapIdentifier function in the config. We
	    // need to run the identifiers through that function, but not format them as
	    // identifiers otherwise.
	    const table = this.client.customWrapIdentifier(this.single.table, identity);

	    if (schema) {
	      schema = this.client.customWrapIdentifier(schema, identity);
	    }

	    // GOTCHA: INFORMATION_SCHEMA.COLUMNS must be capitalized to work when the database has a case-sensitive collation. [#4573]
	    let sql = `select [COLUMN_NAME], [COLUMN_DEFAULT], [DATA_TYPE], [CHARACTER_MAXIMUM_LENGTH], [IS_NULLABLE] from INFORMATION_SCHEMA.COLUMNS where table_name = ? and table_catalog = ?`;
	    const bindings = [table, this.client.database()];

	    if (schema) {
	      sql += ' and table_schema = ?';
	      bindings.push(schema);
	    } else {
	      sql += ` and table_schema = 'dbo'`;
	    }

	    return {
	      sql,
	      bindings: bindings,
	      output(resp) {
	        const out = resp.reduce((columns, val) => {
	          columns[val[0].value] = {
	            defaultValue: val[1].value,
	            type: val[2].value,
	            maxLength: val[3].value,
	            nullable: val[4].value === 'YES',
	          };
	          return columns;
	        }, {});
	        return (column && out[column]) || out;
	      },
	    };
	  }

	  top() {
	    const noLimit = !this.single.limit && this.single.limit !== 0;
	    const noOffset = !this.single.offset;
	    if (noLimit || !noOffset) return '';
	    return `top (${this._getValueOrParameterFromAttribute('limit')})`;
	  }

	  limit() {
	    return '';
	  }

	  offset() {
	    const noLimit = !this.single.limit && this.single.limit !== 0;
	    const noOffset = !this.single.offset;
	    if (noOffset) return '';
	    let offset = `offset ${
	      noOffset ? '0' : this._getValueOrParameterFromAttribute('offset')
	    } rows`;
	    if (!noLimit) {
	      offset += ` fetch next ${this._getValueOrParameterFromAttribute(
	        'limit'
	      )} rows only`;
	    }
	    return offset;
	  }

	  whereLike(statement) {
	    return `${this._columnClause(
	      statement
	    )} collate SQL_Latin1_General_CP1_CS_AS ${this._not(
	      statement,
	      'like '
	    )}${this._valueClause(statement)}`;
	  }

	  whereILike(statement) {
	    return `${this._columnClause(
	      statement
	    )} collate SQL_Latin1_General_CP1_CI_AS ${this._not(
	      statement,
	      'like '
	    )}${this._valueClause(statement)}`;
	  }

	  jsonExtract(params) {
	    // JSON_VALUE return NULL if we query object or array
	    // JSON_QUERY return NULL if we query literal/single value
	    return this._jsonExtract(
	      params.singleValue ? 'JSON_VALUE' : 'JSON_QUERY',
	      params
	    );
	  }

	  jsonSet(params) {
	    return this._jsonSet('JSON_MODIFY', params);
	  }

	  jsonInsert(params) {
	    return this._jsonSet('JSON_MODIFY', params);
	  }

	  jsonRemove(params) {
	    const jsonCol = `JSON_MODIFY(${columnize_(
	      params.column,
	      this.builder,
	      this.client,
	      this.bindingsHolder
	    )},${this.client.parameter(
	      params.path,
	      this.builder,
	      this.bindingsHolder
	    )}, NULL)`;
	    return params.alias
	      ? this.client.alias(jsonCol, this.formatter.wrap(params.alias))
	      : jsonCol;
	  }

	  whereJsonPath(statement) {
	    return this._whereJsonPath('JSON_VALUE', statement);
	  }

	  whereJsonSupersetOf(statement) {
	    throw new Error(
	      'Json superset where clause not actually supported by MSSQL'
	    );
	  }

	  whereJsonSubsetOf(statement) {
	    throw new Error('Json subset where clause not actually supported by MSSQL');
	  }

	  _getExtracts(statement, operator) {
	    const column = columnize_(
	      statement.column,
	      this.builder,
	      this.client,
	      this.bindingsHolder
	    );
	    return (
	      Array.isArray(statement.values) ? statement.values : [statement.values]
	    )
	      .map(function (value) {
	        return (
	          'JSON_VALUE(' +
	          column +
	          ',' +
	          this.client.parameter(value, this.builder, this.bindingsHolder) +
	          ')'
	        );
	      }, this)
	      .join(operator);
	  }

	  onJsonPathEquals(clause) {
	    return this._onJsonPathEquals('JSON_VALUE', clause);
	  }
	}

	// Set the QueryBuilder & QueryCompiler on the client object,
	// in case anyone wants to modify things to suit their own purposes.
	mssqlQuerycompiler = QueryCompiler_MSSQL;
	return mssqlQuerycompiler;
}

var mssqlCompiler;
var hasRequiredMssqlCompiler;

function requireMssqlCompiler () {
	if (hasRequiredMssqlCompiler) return mssqlCompiler;
	hasRequiredMssqlCompiler = 1;
	// MySQL Schema Compiler
	// -------
	const SchemaCompiler = compiler$1;

	class SchemaCompiler_MSSQL extends SchemaCompiler {
	  constructor(client, builder) {
	    super(client, builder);
	  }

	  dropTableIfExists(tableName) {
	    const name = this.formatter.wrap(prefixedTableName(this.schema, tableName));
	    this.pushQuery(
	      `if object_id('${name}', 'U') is not null DROP TABLE ${name}`
	    );
	  }

	  dropViewIfExists(viewName) {
	    const name = this.formatter.wrap(prefixedTableName(this.schema, viewName));
	    this.pushQuery(
	      `if object_id('${name}', 'V') is not null DROP VIEW ${name}`
	    );
	  }

	  // Rename a table on the schema.
	  renameTable(tableName, to) {
	    this.pushQuery(
	      `exec sp_rename ${this.client.parameter(
	        prefixedTableName(this.schema, tableName),
	        this.builder,
	        this.bindingsHolder
	      )}, ${this.client.parameter(to, this.builder, this.bindingsHolder)}`
	    );
	  }

	  renameView(viewTable, to) {
	    this.pushQuery(
	      `exec sp_rename ${this.client.parameter(
	        prefixedTableName(this.schema, viewTable),
	        this.builder,
	        this.bindingsHolder
	      )}, ${this.client.parameter(to, this.builder, this.bindingsHolder)}`
	    );
	  }

	  // Check whether a table exists on the query.
	  hasTable(tableName) {
	    const formattedTable = this.client.parameter(
	      prefixedTableName(this.schema, tableName),
	      this.builder,
	      this.bindingsHolder
	    );
	    const bindings = [tableName];
	    let sql =
	      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES ` +
	      `WHERE TABLE_NAME = ${formattedTable}`;

	    if (this.schema) {
	      sql += ' AND TABLE_SCHEMA = ?';
	      bindings.push(this.schema);
	    }

	    this.pushQuery({ sql, bindings, output: (resp) => resp.length > 0 });
	  }

	  // Check whether a column exists on the schema.
	  hasColumn(tableName, column) {
	    const formattedColumn = this.client.parameter(
	      column,
	      this.builder,
	      this.bindingsHolder
	    );
	    const formattedTable = this.client.parameter(
	      this.formatter.wrap(prefixedTableName(this.schema, tableName)),
	      this.builder,
	      this.bindingsHolder
	    );
	    const sql =
	      `select object_id from sys.columns ` +
	      `where name = ${formattedColumn} ` +
	      `and object_id = object_id(${formattedTable})`;
	    this.pushQuery({ sql, output: (resp) => resp.length > 0 });
	  }
	}

	SchemaCompiler_MSSQL.prototype.dropTablePrefix = 'DROP TABLE ';

	function prefixedTableName(prefix, table) {
	  return prefix ? `${prefix}.${table}` : table;
	}

	mssqlCompiler = SchemaCompiler_MSSQL;
	return mssqlCompiler;
}

/* eslint max-len:0 */

var mssqlTablecompiler;
var hasRequiredMssqlTablecompiler;

function requireMssqlTablecompiler () {
	if (hasRequiredMssqlTablecompiler) return mssqlTablecompiler;
	hasRequiredMssqlTablecompiler = 1;
	// MSSQL Table Builder & Compiler
	// -------
	const TableCompiler = tablecompiler;
	const helpers = helpers$7;
	const { isObject } = is;

	// Table Compiler
	// ------

	class TableCompiler_MSSQL extends TableCompiler {
	  constructor(client, tableBuilder) {
	    super(client, tableBuilder);
	  }

	  createQuery(columns, ifNot, like) {
	    let createStatement = ifNot
	      ? `if object_id('${this.tableName()}', 'U') is null `
	      : '';

	    if (like) {
	      // This query copy only columns and not all indexes and keys like other databases.
	      createStatement += `SELECT * INTO ${this.tableName()} FROM ${this.tableNameLike()} WHERE 0=1`;
	    } else {
	      createStatement +=
	        'CREATE TABLE ' +
	        this.tableName() +
	        (this._formatting ? ' (\n    ' : ' (') +
	        columns.sql.join(this._formatting ? ',\n    ' : ', ') +
	        this._addChecks() +
	        ')';
	    }

	    this.pushQuery(createStatement);

	    if (this.single.comment) {
	      this.comment(this.single.comment);
	    }
	    if (like) {
	      this.addColumns(columns, this.addColumnsPrefix);
	    }
	  }

	  comment(/** @type {string} */ comment) {
	    if (!comment) {
	      return;
	    }

	    // XXX: This is a byte limit, not character, so we cannot definitively say they'll exceed the limit without server collation info.
	    // When I checked in SQL Server 2019, the ctext column in sys.syscomments is defined as a varbinary(8000), so it doesn't even have its own defined collation.
	    if (comment.length > 7500 / 2) {
	      this.client.logger.warn(
	        'Your comment might be longer than the max comment length for MSSQL of 7,500 bytes.'
	      );
	    }

	    // See: https://docs.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/sp-addextendedproperty-transact-sql?view=sql-server-ver15#f-adding-an-extended-property-to-a-table
	    const value = this.formatter.escapingStringDelimiters(comment);
	    const level0name = this.formatter.escapingStringDelimiters(
	      this.schemaNameRaw || 'dbo'
	    );
	    const level1name = this.formatter.escapingStringDelimiters(
	      this.tableNameRaw
	    );
	    const args = `N'MS_Description', N'${value}', N'Schema', N'${level0name}', N'Table', N'${level1name}'`;
	    const isAlreadyDefined = `EXISTS(SELECT * FROM sys.fn_listextendedproperty(N'MS_Description', N'Schema', N'${level0name}', N'Table', N'${level1name}', NULL, NULL))`;
	    this.pushQuery(
	      `IF ${isAlreadyDefined}\n  EXEC sys.sp_updateextendedproperty ${args}\nELSE\n  EXEC sys.sp_addextendedproperty ${args}`
	    );
	  }

	  // Compiles column add.  Multiple columns need only one ADD clause (not one ADD per column) so core addColumns doesn't work.  #1348
	  addColumns(columns, prefix) {
	    prefix = prefix || this.addColumnsPrefix;

	    if (columns.sql.length > 0) {
	      this.pushQuery({
	        sql:
	          (this.lowerCase ? 'alter table ' : 'ALTER TABLE ') +
	          this.tableName() +
	          ' ' +
	          prefix +
	          columns.sql.join(', '),
	        bindings: columns.bindings,
	      });
	    }
	  }

	  alterColumns(columns, colBuilder) {
	    for (let i = 0, l = colBuilder.length; i < l; i++) {
	      const builder = colBuilder[i];
	      if (builder.modified.defaultTo) {
	        const schema = this.schemaNameRaw || 'dbo';
	        const baseQuery = `
              DECLARE @constraint varchar(100) = (SELECT default_constraints.name
                                                  FROM sys.all_columns
                                                  INNER JOIN sys.tables
                                                    ON all_columns.object_id = tables.object_id
                                                  INNER JOIN sys.schemas
                                                    ON tables.schema_id = schemas.schema_id
                                                  INNER JOIN sys.default_constraints
                                                    ON all_columns.default_object_id = default_constraints.object_id
                                                  WHERE schemas.name = '${schema}'
                                                  AND tables.name = '${
	                                                    this.tableNameRaw
	                                                  }'
                                                  AND all_columns.name = '${builder.getColumnName()}')

              IF @constraint IS NOT NULL EXEC('ALTER TABLE ${
	                this.tableNameRaw
	              } DROP CONSTRAINT ' + @constraint)`;
	        this.pushQuery(baseQuery);
	      }
	    }
	    // in SQL server only one column can be altered at a time
	    columns.sql.forEach((sql) => {
	      this.pushQuery({
	        sql:
	          (this.lowerCase ? 'alter table ' : 'ALTER TABLE ') +
	          this.tableName() +
	          ' ' +
	          (this.lowerCase
	            ? this.alterColumnPrefix.toLowerCase()
	            : this.alterColumnPrefix) +
	          sql,
	        bindings: columns.bindings,
	      });
	    });
	  }

	  // Compiles column drop.  Multiple columns need only one DROP clause (not one DROP per column) so core dropColumn doesn't work.  #1348
	  dropColumn() {
	    const _this2 = this;
	    const columns = helpers.normalizeArr.apply(null, arguments);
	    const columnsArray = Array.isArray(columns) ? columns : [columns];
	    const drops = columnsArray.map((column) => _this2.formatter.wrap(column));
	    const schema = this.schemaNameRaw || 'dbo';

	    for (const column of columns) {
	      const baseQuery = `
              DECLARE @constraint varchar(100) = (SELECT default_constraints.name
                                                  FROM sys.all_columns
                                                  INNER JOIN sys.tables
                                                    ON all_columns.object_id = tables.object_id
                                                  INNER JOIN sys.schemas
                                                    ON tables.schema_id = schemas.schema_id
                                                  INNER JOIN sys.default_constraints
                                                    ON all_columns.default_object_id = default_constraints.object_id
                                                  WHERE schemas.name = '${schema}'
                                                  AND tables.name = '${this.tableNameRaw}'
                                                  AND all_columns.name = '${column}')

              IF @constraint IS NOT NULL EXEC('ALTER TABLE ${this.tableNameRaw} DROP CONSTRAINT ' + @constraint)`;
	      this.pushQuery(baseQuery);
	    }
	    this.pushQuery(
	      (this.lowerCase ? 'alter table ' : 'ALTER TABLE ') +
	        this.tableName() +
	        ' ' +
	        this.dropColumnPrefix +
	        drops.join(', ')
	    );
	  }

	  changeType() {}

	  // Renames a column on the table.
	  renameColumn(from, to) {
	    this.pushQuery(
	      `exec sp_rename ${this.client.parameter(
	        this.tableName() + '.' + from,
	        this.tableBuilder,
	        this.bindingsHolder
	      )}, ${this.client.parameter(
	        to,
	        this.tableBuilder,
	        this.bindingsHolder
	      )}, 'COLUMN'`
	    );
	  }

	  dropFKRefs(runner, refs) {
	    const formatter = this.client.formatter(this.tableBuilder);
	    return Promise.all(
	      refs.map(function (ref) {
	        const constraintName = formatter.wrap(ref.CONSTRAINT_NAME);
	        const tableName = formatter.wrap(ref.TABLE_NAME);
	        return runner.query({
	          sql: `ALTER TABLE ${tableName} DROP CONSTRAINT ${constraintName}`,
	        });
	      })
	    );
	  }

	  createFKRefs(runner, refs) {
	    const formatter = this.client.formatter(this.tableBuilder);

	    return Promise.all(
	      refs.map(function (ref) {
	        const tableName = formatter.wrap(ref.TABLE_NAME);
	        const keyName = formatter.wrap(ref.CONSTRAINT_NAME);
	        const column = formatter.columnize(ref.COLUMN_NAME);
	        const references = formatter.columnize(ref.REFERENCED_COLUMN_NAME);
	        const inTable = formatter.wrap(ref.REFERENCED_TABLE_NAME);
	        const onUpdate = ` ON UPDATE ${ref.UPDATE_RULE}`;
	        const onDelete = ` ON DELETE ${ref.DELETE_RULE}`;

	        return runner.query({
	          sql:
	            `ALTER TABLE ${tableName} ADD CONSTRAINT ${keyName}` +
	            ' FOREIGN KEY (' +
	            column +
	            ') REFERENCES ' +
	            inTable +
	            ' (' +
	            references +
	            ')' +
	            onUpdate +
	            onDelete,
	        });
	      })
	    );
	  }

	  index(columns, indexName, options) {
	    indexName = indexName
	      ? this.formatter.wrap(indexName)
	      : this._indexCommand('index', this.tableNameRaw, columns);

	    let predicate;
	    if (isObject(options)) {
	      ({ predicate } = options);
	    }
	    const predicateQuery = predicate
	      ? ' ' + this.client.queryCompiler(predicate).where()
	      : '';
	    this.pushQuery(
	      `CREATE INDEX ${indexName} ON ${this.tableName()} (${this.formatter.columnize(
	        columns
	      )})${predicateQuery}`
	    );
	  }

	  /**
	   * Create a primary key.
	   *
	   * @param {undefined | string | string[]} columns
	   * @param {string | {constraintName: string, deferrable?: 'not deferrable'|'deferred'|'immediate' }} constraintName
	   */
	  primary(columns, constraintName) {
	    let deferrable;
	    if (isObject(constraintName)) {
	      ({ constraintName, deferrable } = constraintName);
	    }
	    if (deferrable && deferrable !== 'not deferrable') {
	      this.client.logger.warn(
	        `mssql: primary key constraint [${constraintName}] will not be deferrable ${deferrable} because mssql does not support deferred constraints.`
	      );
	    }
	    constraintName = constraintName
	      ? this.formatter.wrap(constraintName)
	      : this.formatter.wrap(`${this.tableNameRaw}_pkey`);
	    if (!this.forCreate) {
	      this.pushQuery(
	        `ALTER TABLE ${this.tableName()} ADD CONSTRAINT ${constraintName} PRIMARY KEY (${this.formatter.columnize(
	          columns
	        )})`
	      );
	    } else {
	      this.pushQuery(
	        `CONSTRAINT ${constraintName} PRIMARY KEY (${this.formatter.columnize(
	          columns
	        )})`
	      );
	    }
	  }

	  /**
	   * Create a unique index.
	   *
	   * @param {string | string[]} columns
	   * @param {string | {indexName: undefined | string, deferrable?: 'not deferrable'|'deferred'|'immediate', useConstraint?: true|false, predicate?: QueryBuilder }} indexName
	   */
	  unique(columns, indexName) {
	    /** @type {string | undefined} */
	    let deferrable;
	    let useConstraint = false;
	    let predicate;
	    if (isObject(indexName)) {
	      ({ indexName, deferrable, useConstraint, predicate } = indexName);
	    }
	    if (deferrable && deferrable !== 'not deferrable') {
	      this.client.logger.warn(
	        `mssql: unique index [${indexName}] will not be deferrable ${deferrable} because mssql does not support deferred constraints.`
	      );
	    }
	    if (useConstraint && predicate) {
	      throw new Error('mssql cannot create constraint with predicate');
	    }
	    indexName = indexName
	      ? this.formatter.wrap(indexName)
	      : this._indexCommand('unique', this.tableNameRaw, columns);

	    if (!Array.isArray(columns)) {
	      columns = [columns];
	    }

	    if (useConstraint) {
	      // mssql supports unique indexes and unique constraints.
	      // unique indexes cannot be used with foreign key relationships hence unique constraints are used instead.
	      this.pushQuery(
	        `ALTER TABLE ${this.tableName()} ADD CONSTRAINT ${indexName} UNIQUE (${this.formatter.columnize(
	          columns
	        )})`
	      );
	    } else {
	      // default to making unique index that allows null https://stackoverflow.com/a/767702/360060
	      // to be more or less compatible with other DBs (if any of the columns is NULL then "duplicates" are allowed)
	      const predicateQuery = predicate
	        ? ' ' + this.client.queryCompiler(predicate).where()
	        : ' WHERE ' +
	          columns
	            .map((column) => this.formatter.columnize(column) + ' IS NOT NULL')
	            .join(' AND ');
	      this.pushQuery(
	        `CREATE UNIQUE INDEX ${indexName} ON ${this.tableName()} (${this.formatter.columnize(
	          columns
	        )})${predicateQuery}`
	      );
	    }
	  }

	  // Compile a drop index command.
	  dropIndex(columns, indexName) {
	    indexName = indexName
	      ? this.formatter.wrap(indexName)
	      : this._indexCommand('index', this.tableNameRaw, columns);
	    this.pushQuery(`DROP INDEX ${indexName} ON ${this.tableName()}`);
	  }

	  // Compile a drop foreign key command.
	  dropForeign(columns, indexName) {
	    indexName = indexName
	      ? this.formatter.wrap(indexName)
	      : this._indexCommand('foreign', this.tableNameRaw, columns);
	    this.pushQuery(
	      `ALTER TABLE ${this.tableName()} DROP CONSTRAINT ${indexName}`
	    );
	  }

	  // Compile a drop primary key command.
	  dropPrimary(constraintName) {
	    constraintName = constraintName
	      ? this.formatter.wrap(constraintName)
	      : this.formatter.wrap(`${this.tableNameRaw}_pkey`);
	    this.pushQuery(
	      `ALTER TABLE ${this.tableName()} DROP CONSTRAINT ${constraintName}`
	    );
	  }

	  // Compile a drop unique key command.
	  dropUnique(column, indexName) {
	    indexName = indexName
	      ? this.formatter.wrap(indexName)
	      : this._indexCommand('unique', this.tableNameRaw, column);
	    this.pushQuery(`DROP INDEX ${indexName} ON ${this.tableName()}`);
	  }
	}

	TableCompiler_MSSQL.prototype.createAlterTableMethods = ['foreign', 'primary'];
	TableCompiler_MSSQL.prototype.lowerCase = false;

	TableCompiler_MSSQL.prototype.addColumnsPrefix = 'ADD ';
	TableCompiler_MSSQL.prototype.dropColumnPrefix = 'DROP COLUMN ';
	TableCompiler_MSSQL.prototype.alterColumnPrefix = 'ALTER COLUMN ';

	mssqlTablecompiler = TableCompiler_MSSQL;
	return mssqlTablecompiler;
}

/* eslint max-len: 0 */

var mssqlViewcompiler;
var hasRequiredMssqlViewcompiler;

function requireMssqlViewcompiler () {
	if (hasRequiredMssqlViewcompiler) return mssqlViewcompiler;
	hasRequiredMssqlViewcompiler = 1;
	const ViewCompiler = viewcompiler;
	const {
	  columnize: columnize_,
	} = wrappingFormatter;

	class ViewCompiler_MSSQL extends ViewCompiler {
	  constructor(client, viewCompiler) {
	    super(client, viewCompiler);
	  }

	  createQuery(columns, selectQuery, materialized, replace) {
	    const createStatement = 'CREATE ' + (replace ? 'OR ALTER ' : '') + 'VIEW ';
	    let sql = createStatement + this.viewName();

	    const columnList = columns
	      ? ' (' +
	        columnize_(
	          columns,
	          this.viewBuilder,
	          this.client,
	          this.bindingsHolder
	        ) +
	        ')'
	      : '';

	    sql += columnList;
	    sql += ' AS ';
	    sql += selectQuery.toString();
	    this.pushQuery({
	      sql,
	    });
	  }

	  renameColumn(from, to) {
	    this.pushQuery(
	      `exec sp_rename ${this.client.parameter(
	        this.viewName() + '.' + from,
	        this.viewBuilder,
	        this.bindingsHolder
	      )}, ${this.client.parameter(
	        to,
	        this.viewBuilder,
	        this.bindingsHolder
	      )}, 'COLUMN'`
	    );
	  }

	  createOrReplace() {
	    this.createQuery(this.columns, this.selectQuery, false, true);
	  }
	}

	mssqlViewcompiler = ViewCompiler_MSSQL;
	return mssqlViewcompiler;
}

var mssqlColumncompiler;
var hasRequiredMssqlColumncompiler;

function requireMssqlColumncompiler () {
	if (hasRequiredMssqlColumncompiler) return mssqlColumncompiler;
	hasRequiredMssqlColumncompiler = 1;
	// MSSQL Column Compiler
	// -------
	const ColumnCompiler = columncompiler;
	const { toNumber } = helpers$7;
	const { formatDefault } = formatterUtils;
	const { operator: operator_ } = wrappingFormatter;

	class ColumnCompiler_MSSQL extends ColumnCompiler {
	  constructor(client, tableCompiler, columnBuilder) {
	    super(client, tableCompiler, columnBuilder);
	    this.modifiers = ['nullable', 'defaultTo', 'first', 'after', 'comment'];
	    this._addCheckModifiers();
	  }

	  // Types
	  // ------

	  double(precision, scale) {
	    return 'float';
	  }

	  floating(precision, scale) {
	    // ignore precicion / scale which is mysql specific stuff
	    return `float`;
	  }

	  integer() {
	    // mssql does not support length
	    return 'int';
	  }

	  tinyint() {
	    // mssql does not support length
	    return 'tinyint';
	  }

	  varchar(length) {
	    return `nvarchar(${toNumber(length, 255)})`;
	  }

	  timestamp({ useTz = false } = {}) {
	    return useTz ? 'datetimeoffset' : 'datetime2';
	  }

	  bit(length) {
	    if (length > 1) {
	      this.client.logger.warn('Bit field is exactly 1 bit length for MSSQL');
	    }
	    return 'bit';
	  }

	  binary(length) {
	    return length ? `varbinary(${toNumber(length)})` : 'varbinary(max)';
	  }

	  // Modifiers
	  // ------

	  first() {
	    this.client.logger.warn('Column first modifier not available for MSSQL');
	    return '';
	  }

	  after(column) {
	    this.client.logger.warn('Column after modifier not available for MSSQL');
	    return '';
	  }

	  defaultTo(value, { constraintName } = {}) {
	    const formattedValue = formatDefault(value, this.type, this.client);
	    constraintName =
	      typeof constraintName !== 'undefined'
	        ? constraintName
	        : `${
	            this.tableCompiler.tableNameRaw
	          }_${this.getColumnName()}_default`.toLowerCase();
	    if (this.columnBuilder._method === 'alter') {
	      this.pushAdditional(function () {
	        this.pushQuery(
	          `ALTER TABLE ${this.tableCompiler.tableName()} ADD CONSTRAINT ${this.formatter.wrap(
	            constraintName
	          )} DEFAULT ${formattedValue} FOR ${this.formatter.wrap(
	            this.getColumnName()
	          )}`
	        );
	      });
	      return '';
	    }
	    if (!constraintName) {
	      return `DEFAULT ${formattedValue}`;
	    }
	    return `CONSTRAINT ${this.formatter.wrap(
	      constraintName
	    )} DEFAULT ${formattedValue}`;
	  }

	  comment(/** @type {string} */ comment) {
	    if (!comment) {
	      return;
	    }

	    // XXX: This is a byte limit, not character, so we cannot definitively say they'll exceed the limit without database collation info.
	    // (Yes, even if the column has its own collation, the sqlvariant still uses the database collation.)
	    // I'm not sure we even need to raise a warning, as MSSQL will return an error when the limit is exceeded itself.
	    if (comment && comment.length > 7500 / 2) {
	      this.client.logger.warn(
	        'Your comment might be longer than the max comment length for MSSQL of 7,500 bytes.'
	      );
	    }

	    // See: https://docs.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/sp-addextendedproperty-transact-sql?view=sql-server-ver15#b-adding-an-extended-property-to-a-column-in-a-table
	    const value = this.formatter.escapingStringDelimiters(comment);
	    const level0name = this.tableCompiler.schemaNameRaw || 'dbo';
	    const level1name = this.formatter.escapingStringDelimiters(
	      this.tableCompiler.tableNameRaw
	    );
	    const level2name = this.formatter.escapingStringDelimiters(
	      this.args[0] || this.defaults('columnName')
	    );

	    const args = `N'MS_Description', N'${value}', N'Schema', N'${level0name}', N'Table', N'${level1name}', N'Column', N'${level2name}'`;

	    this.pushAdditional(function () {
	      const isAlreadyDefined = `EXISTS(SELECT * FROM sys.fn_listextendedproperty(N'MS_Description', N'Schema', N'${level0name}', N'Table', N'${level1name}', N'Column', N'${level2name}'))`;
	      this.pushQuery(
	        `IF ${isAlreadyDefined}\n  EXEC sys.sp_updateextendedproperty ${args}\nELSE\n  EXEC sys.sp_addextendedproperty ${args}`
	      );
	    });
	    return '';
	  }

	  checkLength(operator, length, constraintName) {
	    return this._check(
	      `LEN(${this.formatter.wrap(this.getColumnName())}) ${operator_(
	        operator,
	        this.columnBuilder,
	        this.bindingsHolder
	      )} ${toNumber(length)}`,
	      constraintName
	    );
	  }

	  checkRegex(regex, constraintName) {
	    return this._check(
	      `${this.formatter.wrap(
	        this.getColumnName()
	      )} LIKE ${this.client._escapeBinding('%' + regex + '%')}`,
	      constraintName
	    );
	  }

	  increments(options = { primaryKey: true }) {
	    return (
	      'int identity(1,1) not null' +
	      (this.tableCompiler._canBeAddPrimaryKey(options) ? ' primary key' : '')
	    );
	  }

	  bigincrements(options = { primaryKey: true }) {
	    return (
	      'bigint identity(1,1) not null' +
	      (this.tableCompiler._canBeAddPrimaryKey(options) ? ' primary key' : '')
	    );
	  }
	}

	ColumnCompiler_MSSQL.prototype.bigint = 'bigint';
	ColumnCompiler_MSSQL.prototype.mediumint = 'int';
	ColumnCompiler_MSSQL.prototype.smallint = 'smallint';
	ColumnCompiler_MSSQL.prototype.text = 'nvarchar(max)';
	ColumnCompiler_MSSQL.prototype.mediumtext = 'nvarchar(max)';
	ColumnCompiler_MSSQL.prototype.longtext = 'nvarchar(max)';
	ColumnCompiler_MSSQL.prototype.json = ColumnCompiler_MSSQL.prototype.jsonb =
	  'nvarchar(max)';

	// TODO: mssql supports check constraints as of SQL Server 2008
	// so make enu here more like postgres
	ColumnCompiler_MSSQL.prototype.enu = 'nvarchar(100)';
	ColumnCompiler_MSSQL.prototype.uuid = ({ useBinaryUuid = false } = {}) =>
	  useBinaryUuid ? 'binary(16)' : 'uniqueidentifier';

	ColumnCompiler_MSSQL.prototype.datetime = 'datetime2';
	ColumnCompiler_MSSQL.prototype.bool = 'bit';

	mssqlColumncompiler = ColumnCompiler_MSSQL;
	return mssqlColumncompiler;
}

const require$$13$1 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(tedious);

var mssql;
var hasRequiredMssql;

function requireMssql () {
	if (hasRequiredMssql) return mssql;
	hasRequiredMssql = 1;
	// MSSQL Client
	// -------
	const map = require$$1$5;
	const isNil = require$$1;

	const Client = client$2;
	const MSSQL_Formatter = /*@__PURE__*/ requireMssqlFormatter();
	const Transaction = /*@__PURE__*/ requireTransaction$4();
	const QueryCompiler = /*@__PURE__*/ requireMssqlQuerycompiler();
	const SchemaCompiler = /*@__PURE__*/ requireMssqlCompiler();
	const TableCompiler = /*@__PURE__*/ requireMssqlTablecompiler();
	const ViewCompiler = /*@__PURE__*/ requireMssqlViewcompiler();
	const ColumnCompiler = /*@__PURE__*/ requireMssqlColumncompiler();
	const QueryBuilder = querybuilder;
	const { setHiddenProperty } = security;

	const debug = require$$2$9('knex:mssql');

	const SQL_INT4 = { MIN: -2147483648, MAX: 2147483647 };
	const SQL_BIGINT_SAFE = { MIN: -9007199254740991, MAX: 9007199254740991 };

	// Always initialize with the "QueryBuilder" and "QueryCompiler" objects, which
	// extend the base 'lib/query/builder' and 'lib/query/compiler', respectively.
	class Client_MSSQL extends Client {
	  constructor(config = {}) {
	    super(config);
	  }

	  /**
	   * @param {import('knex').Config} options
	   */
	  _generateConnection() {
	    const settings = this.connectionSettings;
	    settings.options = settings.options || {};

	    /** @type {import('tedious').ConnectionConfig} */
	    const cfg = {
	      authentication: {
	        type: settings.type || 'default',
	        options: {
	          userName: settings.userName || settings.user,
	          password: settings.password,
	          domain: settings.domain,
	          token: settings.token,
	          clientId: settings.clientId,
	          clientSecret: settings.clientSecret,
	          tenantId: settings.tenantId,
	          msiEndpoint: settings.msiEndpoint,
	        },
	      },
	      server: settings.server || settings.host,
	      options: {
	        database: settings.database,
	        encrypt: settings.encrypt || false,
	        port: settings.port || 1433,
	        connectTimeout: settings.connectionTimeout || settings.timeout || 15000,
	        requestTimeout: !isNil(settings.requestTimeout)
	          ? settings.requestTimeout
	          : 15000,
	        rowCollectionOnDone: false,
	        rowCollectionOnRequestCompletion: false,
	        useColumnNames: false,
	        tdsVersion: settings.options.tdsVersion || '7_4',
	        appName: settings.options.appName || 'knex',
	        trustServerCertificate: false,
	        ...settings.options,
	      },
	    };

	    if (cfg.authentication.options.password) {
	      setHiddenProperty(cfg.authentication.options);
	    }

	    // tedious always connect via tcp when port is specified
	    if (cfg.options.instanceName) delete cfg.options.port;

	    if (isNaN(cfg.options.requestTimeout)) cfg.options.requestTimeout = 15000;
	    if (cfg.options.requestTimeout === Infinity) cfg.options.requestTimeout = 0;
	    if (cfg.options.requestTimeout < 0) cfg.options.requestTimeout = 0;

	    if (settings.debug) {
	      cfg.options.debug = {
	        packet: true,
	        token: true,
	        data: true,
	        payload: true,
	      };
	    }

	    return cfg;
	  }

	  _driver() {
	    const tds = require$$13$1;

	    return tds;
	  }

	  formatter() {
	    return new MSSQL_Formatter(this, ...arguments);
	  }

	  transaction() {
	    return new Transaction(this, ...arguments);
	  }

	  queryCompiler() {
	    return new QueryCompiler(this, ...arguments);
	  }

	  schemaCompiler() {
	    return new SchemaCompiler(this, ...arguments);
	  }

	  tableCompiler() {
	    return new TableCompiler(this, ...arguments);
	  }

	  viewCompiler() {
	    return new ViewCompiler(this, ...arguments);
	  }
	  queryBuilder() {
	    const b = new QueryBuilder(this);
	    return b;
	  }

	  columnCompiler() {
	    return new ColumnCompiler(this, ...arguments);
	  }

	  wrapIdentifierImpl(value) {
	    if (value === '*') {
	      return '*';
	    }

	    return `[${value.replace(/[[\]]+/g, '')}]`;
	  }

	  // Get a raw connection, called by the `pool` whenever a new
	  // connection needs to be added to the pool.
	  acquireRawConnection() {
	    return new Promise((resolver, rejecter) => {
	      debug('connection::connection new connection requested');
	      const Driver = this._driver();
	      const settings = Object.assign({}, this._generateConnection());

	      const connection = new Driver.Connection(settings);

	      connection.connect((err) => {
	        if (err) {
	          debug('connection::connect error: %s', err.message);
	          return rejecter(err);
	        }

	        debug('connection::connect connected to server');

	        connection.connected = true;
	        connection.on('error', (e) => {
	          debug('connection::error message=%s', e.message);
	          connection.__knex__disposed = e;
	          connection.connected = false;
	        });

	        connection.once('end', () => {
	          connection.connected = false;
	          connection.__knex__disposed = 'Connection to server was terminated.';
	          debug('connection::end connection ended.');
	        });

	        return resolver(connection);
	      });
	    });
	  }

	  validateConnection(connection) {
	    return connection && connection.connected;
	  }

	  // Used to explicitly close a connection, called internally by the pool
	  // when a connection times out or the pool is shutdown.
	  destroyRawConnection(connection) {
	    debug('connection::destroy');

	    return new Promise((resolve) => {
	      connection.once('end', () => {
	        resolve();
	      });

	      connection.close();
	    });
	  }

	  // Position the bindings for the query.
	  positionBindings(sql) {
	    let questionCount = -1;
	    return sql.replace(/\\?\?/g, (match) => {
	      if (match === '\\?') {
	        return '?';
	      }

	      questionCount += 1;
	      return `@p${questionCount}`;
	    });
	  }

	  _chomp(connection) {
	    if (connection.state.name === 'LoggedIn') {
	      const nextRequest = this.requestQueue.pop();
	      if (nextRequest) {
	        debug(
	          'connection::query executing query, %d more in queue',
	          this.requestQueue.length
	        );

	        connection.execSql(nextRequest);
	      }
	    }
	  }

	  _enqueueRequest(request, connection) {
	    this.requestQueue.push(request);
	    this._chomp(connection);
	  }

	  _makeRequest(query, callback) {
	    const Driver = this._driver();
	    const sql = typeof query === 'string' ? query : query.sql;
	    let rowCount = 0;

	    if (!sql) throw new Error('The query is empty');

	    debug('request::request sql=%s', sql);

	    const request = new Driver.Request(sql, (err, remoteRowCount) => {
	      if (err) {
	        debug('request::error message=%s', err.message);
	        return callback(err);
	      }

	      rowCount = remoteRowCount;
	      debug('request::callback rowCount=%d', rowCount);
	    });

	    request.on('prepared', () => {
	      debug('request %s::request prepared', this.id);
	    });

	    request.on('done', (rowCount, more) => {
	      debug('request::done rowCount=%d more=%s', rowCount, more);
	    });

	    request.on('doneProc', (rowCount, more) => {
	      debug(
	        'request::doneProc id=%s rowCount=%d more=%s',
	        request.id,
	        rowCount,
	        more
	      );
	    });

	    request.on('doneInProc', (rowCount, more) => {
	      debug(
	        'request::doneInProc id=%s rowCount=%d more=%s',
	        request.id,
	        rowCount,
	        more
	      );
	    });

	    request.once('requestCompleted', () => {
	      debug('request::completed id=%s', request.id);
	      return callback(null, rowCount);
	    });

	    request.on('error', (err) => {
	      debug('request::error id=%s message=%s', request.id, err.message);
	      return callback(err);
	    });

	    return request;
	  }

	  // Grab a connection, run the query via the MSSQL streaming interface,
	  // and pass that through to the stream we've sent back to the client.
	  _stream(connection, query, /** @type {NodeJS.ReadWriteStream} */ stream) {
	    return new Promise((resolve, reject) => {
	      const request = this._makeRequest(query, (err) => {
	        if (err) {
	          stream.emit('error', err);
	          return reject(err);
	        }

	        resolve();
	      });

	      request.on('row', (row) => {
	        stream.write(
	          row.reduce(
	            (prev, curr) => ({
	              ...prev,
	              [curr.metadata.colName]: curr.value,
	            }),
	            {}
	          )
	        );
	      });
	      request.on('error', (err) => {
	        stream.emit('error', err);
	        reject(err);
	      });
	      request.once('requestCompleted', () => {
	        stream.end();
	        resolve();
	      });

	      this._assignBindings(request, query.bindings);
	      this._enqueueRequest(request, connection);
	    });
	  }

	  _assignBindings(request, bindings) {
	    if (Array.isArray(bindings)) {
	      for (let i = 0; i < bindings.length; i++) {
	        const binding = bindings[i];
	        this._setReqInput(request, i, binding);
	      }
	    }
	  }

	  _scaleForBinding(binding) {
	    if (binding % 1 === 0) {
	      throw new Error(`The binding value ${binding} must be a decimal number.`);
	    }

	    return { scale: 10 };
	  }

	  _typeForBinding(binding) {
	    const Driver = this._driver();

	    if (
	      this.connectionSettings.options &&
	      this.connectionSettings.options.mapBinding
	    ) {
	      const result = this.connectionSettings.options.mapBinding(binding);
	      if (result) {
	        return [result.value, result.type];
	      }
	    }

	    switch (typeof binding) {
	      case 'string':
	        return [binding, Driver.TYPES.NVarChar];
	      case 'boolean':
	        return [binding, Driver.TYPES.Bit];
	      case 'number': {
	        if (binding % 1 !== 0) {
	          return [binding, Driver.TYPES.Float];
	        }

	        if (binding < SQL_INT4.MIN || binding > SQL_INT4.MAX) {
	          if (binding < SQL_BIGINT_SAFE.MIN || binding > SQL_BIGINT_SAFE.MAX) {
	            throw new Error(
	              `Bigint must be safe integer or must be passed as string, saw ${binding}`
	            );
	          }

	          return [binding, Driver.TYPES.BigInt];
	        }

	        return [binding, Driver.TYPES.Int];
	      }
	      default: {
	        if (binding instanceof Date) {
	          return [binding, Driver.TYPES.DateTime];
	        }

	        if (binding instanceof Buffer) {
	          return [binding, Driver.TYPES.VarBinary];
	        }

	        return [binding, Driver.TYPES.NVarChar];
	      }
	    }
	  }

	  // Runs the query on the specified connection, providing the bindings
	  // and any other necessary prep work.
	  _query(connection, query) {
	    return new Promise((resolve, reject) => {
	      const rows = [];
	      const request = this._makeRequest(query, (err, count) => {
	        if (err) {
	          return reject(err);
	        }

	        query.response = rows;

	        process.nextTick(() => this._chomp(connection));

	        resolve(query);
	      });

	      request.on('row', (row) => {
	        debug('request::row');
	        rows.push(row);
	      });

	      this._assignBindings(request, query.bindings);
	      this._enqueueRequest(request, connection);
	    });
	  }

	  // sets a request input parameter. Detects bigints and decimals and sets type appropriately.
	  _setReqInput(req, i, inputBinding) {
	    const [binding, tediousType] = this._typeForBinding(inputBinding);
	    const bindingName = 'p'.concat(i);
	    let options;

	    if (typeof binding === 'number' && binding % 1 !== 0) {
	      options = this._scaleForBinding(binding);
	    }

	    debug(
	      'request::binding pos=%d type=%s value=%s',
	      i,
	      tediousType.name,
	      binding
	    );

	    if (Buffer.isBuffer(binding)) {
	      options = {
	        length: 'max',
	      };
	    }

	    req.addParameter(bindingName, tediousType, binding, options);
	  }

	  // Process the response as returned from the query.
	  processResponse(query, runner) {
	    if (query == null) return;
	    let { response } = query;
	    const { method } = query;

	    if (query.output) {
	      return query.output.call(runner, response);
	    }

	    response = response.map((row) =>
	      row.reduce((columns, r) => {
	        const colName = r.metadata.colName;

	        if (columns[colName]) {
	          if (!Array.isArray(columns[colName])) {
	            columns[colName] = [columns[colName]];
	          }

	          columns[colName].push(r.value);
	        } else {
	          columns[colName] = r.value;
	        }

	        return columns;
	      }, {})
	    );

	    if (query.output) return query.output.call(runner, response);
	    switch (method) {
	      case 'select':
	        return response;
	      case 'first':
	        return response[0];
	      case 'pluck':
	        return map(response, query.pluck);
	      case 'insert':
	      case 'del':
	      case 'update':
	      case 'counter':
	        if (query.returning) {
	          if (query.returning === '@@rowcount') {
	            return response[0][''];
	          }
	        }
	        return response;
	      default:
	        return response;
	    }
	  }
	}

	Object.assign(Client_MSSQL.prototype, {
	  requestQueue: [],

	  dialect: 'mssql',

	  driverName: 'mssql',
	});

	mssql = Client_MSSQL;
	return mssql;
}

const require$$0$1 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(defer$2);

var transaction$3;
var hasRequiredTransaction$3;

function requireTransaction$3 () {
	if (hasRequiredTransaction$3) return transaction$3;
	hasRequiredTransaction$3 = 1;
	const Transaction = transaction$5;
	const Debug = require$$2$9;

	const debug = Debug('knex:tx');

	class Transaction_MySQL extends Transaction {
	  query(conn, sql, status, value) {
	    const t = this;
	    const q = this.trxClient
	      .query(conn, sql)
	      .catch((err) => {
	        if (err.errno === 1305) {
	          this.trxClient.logger.warn(
	            'Transaction was implicitly committed, do not mix transactions and ' +
	              'DDL with MySQL (#805)'
	          );
	          return;
	        }

	        status = 2;
	        value = err;
	        t._completed = true;
	        debug('%s error running transaction query', t.txid);
	      })
	      .then(function (res) {
	        if (status === 1) t._resolver(value);
	        if (status === 2) {
	          if (value === undefined) {
	            if (t.doNotRejectOnRollback && /^ROLLBACK\b/i.test(sql)) {
	              t._resolver();
	              return;
	            }
	            value = new Error(`Transaction rejected with non-error: ${value}`);
	          }
	          t._rejecter(value);
	        }
	        return res;
	      });
	    if (status === 1 || status === 2) {
	      t._completed = true;
	    }
	    return q;
	  }
	}

	transaction$3 = Transaction_MySQL;
	return transaction$3;
}

var mysqlQuerybuilder;
var hasRequiredMysqlQuerybuilder;

function requireMysqlQuerybuilder () {
	if (hasRequiredMysqlQuerybuilder) return mysqlQuerybuilder;
	hasRequiredMysqlQuerybuilder = 1;
	const QueryBuilder = querybuilder;
	const isEmpty = require$$2$8;

	mysqlQuerybuilder = class QueryBuilder_MySQL extends QueryBuilder {
	  upsert(values, returning, options) {
	    this._method = 'upsert';
	    if (!isEmpty(returning)) {
	      this.returning(returning, options);
	    }

	    this._single.upsert = values;
	    return this;
	  }
	};
	return mysqlQuerybuilder;
}

var mysqlQuerycompiler;
var hasRequiredMysqlQuerycompiler;

function requireMysqlQuerycompiler () {
	if (hasRequiredMysqlQuerycompiler) return mysqlQuerycompiler;
	hasRequiredMysqlQuerycompiler = 1;
	// MySQL Query Compiler
	// ------
	const assert = require$$0$d;
	const identity = require$$2$4;
	const isPlainObject = require$$3$3;
	const isEmpty = require$$2$8;
	const QueryCompiler = querycompiler;
	const { wrapAsIdentifier } = formatterUtils;
	const {
	  columnize: columnize_,
	  wrap: wrap_,
	} = wrappingFormatter;

	const isPlainObjectOrArray = (value) =>
	  isPlainObject(value) || Array.isArray(value);

	class QueryCompiler_MySQL extends QueryCompiler {
	  constructor(client, builder, formatter) {
	    super(client, builder, formatter);

	    const { returning } = this.single;
	    if (returning) {
	      this.client.logger.warn(
	        '.returning() is not supported by mysql and will not have any effect.'
	      );
	    }

	    this._emptyInsertValue = '() values ()';
	  }
	  // Compiles an `delete` allowing comments
	  del() {
	    const sql = super.del();
	    if (sql === '') return sql;
	    const comments = this.comments();
	    return (comments === '' ? '' : comments + ' ') + sql;
	  }

	  // Compiles an `insert` query, allowing for multiple
	  // inserts using a single query statement.
	  insert() {
	    let sql = super.insert();
	    if (sql === '') return sql;
	    const comments = this.comments();
	    sql = (comments === '' ? '' : comments + ' ') + sql;

	    const { ignore, merge, insert } = this.single;
	    if (ignore) sql = sql.replace('insert into', 'insert ignore into');
	    if (merge) {
	      sql += this._merge(merge.updates, insert);
	      const wheres = this.where();
	      if (wheres) {
	        throw new Error(
	          '.onConflict().merge().where() is not supported for mysql'
	        );
	      }
	    }

	    return sql;
	  }

	  upsert() {
	    const upsertValues = this.single.upsert || [];
	    const sql = this.with() + `replace into ${this.tableName} `;
	    const body = this._insertBody(upsertValues);
	    return body === '' ? '' : sql + body;
	  }

	  // Compiles merge for onConflict, allowing for different merge strategies
	  _merge(updates, insert) {
	    const sql = ' on duplicate key update ';
	    if (updates && Array.isArray(updates)) {
	      // update subset of columns
	      return (
	        sql +
	        updates
	          .map((column) =>
	            wrapAsIdentifier(column, this.formatter.builder, this.client)
	          )
	          .map((column) => `${column} = values(${column})`)
	          .join(', ')
	      );
	    } else if (updates && typeof updates === 'object') {
	      const updateData = this._prepUpdate(updates);
	      return sql + updateData.join(',');
	    } else {
	      const insertData = this._prepInsert(insert);
	      if (typeof insertData === 'string') {
	        throw new Error(
	          'If using merge with a raw insert query, then updates must be provided'
	        );
	      }

	      return (
	        sql +
	        insertData.columns
	          .map((column) => wrapAsIdentifier(column, this.builder, this.client))
	          .map((column) => `${column} = values(${column})`)
	          .join(', ')
	      );
	    }
	  }

	  // Update method, including joins, wheres, order & limits.
	  update() {
	    const comments = this.comments();
	    const withSQL = this.with();
	    const join = this.join();
	    const updates = this._prepUpdate(this.single.update);
	    const where = this.where();
	    const order = this.order();
	    const limit = this.limit();
	    return (
	      (comments === '' ? '' : comments + ' ') +
	      withSQL +
	      `update ${this.tableName}` +
	      (join ? ` ${join}` : '') +
	      ' set ' +
	      updates.join(', ') +
	      (where ? ` ${where}` : '') +
	      (order ? ` ${order}` : '') +
	      (limit ? ` ${limit}` : '')
	    );
	  }

	  forUpdate() {
	    return 'for update';
	  }

	  forShare() {
	    return 'lock in share mode';
	  }

	  // Only supported on MySQL 8.0+
	  skipLocked() {
	    return 'skip locked';
	  }

	  // Supported on MySQL 8.0+ and MariaDB 10.3.0+
	  noWait() {
	    return 'nowait';
	  }

	  // Compiles a `columnInfo` query.
	  columnInfo() {
	    const column = this.single.columnInfo;

	    // The user may have specified a custom wrapIdentifier function in the config. We
	    // need to run the identifiers through that function, but not format them as
	    // identifiers otherwise.
	    const table = this.client.customWrapIdentifier(this.single.table, identity);

	    return {
	      sql: 'select * from information_schema.columns where table_name = ? and table_schema = ?',
	      bindings: [table, this.client.database()],
	      output(resp) {
	        const out = resp.reduce(function (columns, val) {
	          columns[val.COLUMN_NAME] = {
	            defaultValue:
	              val.COLUMN_DEFAULT === 'NULL' ? null : val.COLUMN_DEFAULT,
	            type: val.DATA_TYPE,
	            maxLength: val.CHARACTER_MAXIMUM_LENGTH,
	            nullable: val.IS_NULLABLE === 'YES',
	          };
	          return columns;
	        }, {});
	        return (column && out[column]) || out;
	      },
	    };
	  }

	  limit() {
	    const noLimit = !this.single.limit && this.single.limit !== 0;
	    if (noLimit && !this.single.offset) return '';

	    // Workaround for offset only.
	    // see: http://stackoverflow.com/questions/255517/mysql-offset-infinite-rows
	    const limit =
	      this.single.offset && noLimit
	        ? '18446744073709551615'
	        : this._getValueOrParameterFromAttribute('limit');
	    return `limit ${limit}`;
	  }

	  whereBasic(statement) {
	    assert(
	      !isPlainObjectOrArray(statement.value),
	      'The values in where clause must not be object or array.'
	    );

	    return super.whereBasic(statement);
	  }

	  whereRaw(statement) {
	    assert(
	      isEmpty(statement.value.bindings) ||
	        !Object.values(statement.value.bindings).some(isPlainObjectOrArray),
	      'The values in where clause must not be object or array.'
	    );

	    return super.whereRaw(statement);
	  }

	  whereLike(statement) {
	    return `${this._columnClause(statement)} ${this._not(
	      statement,
	      'like '
	    )}${this._valueClause(statement)} COLLATE utf8_bin`;
	  }

	  whereILike(statement) {
	    return `${this._columnClause(statement)} ${this._not(
	      statement,
	      'like '
	    )}${this._valueClause(statement)}`;
	  }

	  // Json functions
	  jsonExtract(params) {
	    return this._jsonExtract(['json_extract', 'json_unquote'], params);
	  }

	  jsonSet(params) {
	    return this._jsonSet('json_set', params);
	  }

	  jsonInsert(params) {
	    return this._jsonSet('json_insert', params);
	  }

	  jsonRemove(params) {
	    const jsonCol = `json_remove(${columnize_(
	      params.column,
	      this.builder,
	      this.client,
	      this.bindingsHolder
	    )},${this.client.parameter(
	      params.path,
	      this.builder,
	      this.bindingsHolder
	    )})`;
	    return params.alias
	      ? this.client.alias(jsonCol, this.formatter.wrap(params.alias))
	      : jsonCol;
	  }

	  whereJsonObject(statement) {
	    return this._not(
	      statement,
	      `json_contains(${this._columnClause(statement)}, ${this._jsonValueClause(
	        statement
	      )})`
	    );
	  }

	  whereJsonPath(statement) {
	    return this._whereJsonPath('json_extract', statement);
	  }

	  whereJsonSupersetOf(statement) {
	    return this._not(
	      statement,
	      `json_contains(${wrap_(
	        statement.column,
	        undefined,
	        this.builder,
	        this.client,
	        this.bindingsHolder
	      )},${this._jsonValueClause(statement)})`
	    );
	  }

	  whereJsonSubsetOf(statement) {
	    return this._not(
	      statement,
	      `json_contains(${this._jsonValueClause(statement)},${wrap_(
	        statement.column,
	        undefined,
	        this.builder,
	        this.client,
	        this.bindingsHolder
	      )})`
	    );
	  }

	  onJsonPathEquals(clause) {
	    return this._onJsonPathEquals('json_extract', clause);
	  }
	}

	// Set the QueryBuilder & QueryCompiler on the client object,
	// in case anyone wants to modify things to suit their own purposes.
	mysqlQuerycompiler = QueryCompiler_MySQL;
	return mysqlQuerycompiler;
}

var mysqlCompiler;
var hasRequiredMysqlCompiler;

function requireMysqlCompiler () {
	if (hasRequiredMysqlCompiler) return mysqlCompiler;
	hasRequiredMysqlCompiler = 1;
	// MySQL Schema Compiler
	// -------
	const SchemaCompiler = compiler$1;

	class SchemaCompiler_MySQL extends SchemaCompiler {
	  constructor(client, builder) {
	    super(client, builder);
	  }

	  // Rename a table on the schema.
	  renameTable(tableName, to) {
	    this.pushQuery(
	      `rename table ${this.formatter.wrap(tableName)} to ${this.formatter.wrap(
	        to
	      )}`
	    );
	  }

	  renameView(from, to) {
	    this.renameTable(from, to);
	  }

	  // Check whether a table exists on the query.
	  hasTable(tableName) {
	    let sql = 'select * from information_schema.tables where table_name = ?';
	    const bindings = [tableName];

	    if (this.schema) {
	      sql += ' and table_schema = ?';
	      bindings.push(this.schema);
	    } else {
	      sql += ' and table_schema = database()';
	    }

	    this.pushQuery({
	      sql,
	      bindings,
	      output: function output(resp) {
	        return resp.length > 0;
	      },
	    });
	  }

	  // Check whether a column exists on the schema.
	  hasColumn(tableName, column) {
	    this.pushQuery({
	      sql: `show columns from ${this.formatter.wrap(tableName)}`,
	      output(resp) {
	        return resp.some((row) => {
	          return (
	            this.client.wrapIdentifier(row.Field.toLowerCase()) ===
	            this.client.wrapIdentifier(column.toLowerCase())
	          );
	        });
	      },
	    });
	  }
	}

	mysqlCompiler = SchemaCompiler_MySQL;
	return mysqlCompiler;
}

/* eslint max-len:0*/

var mysqlTablecompiler;
var hasRequiredMysqlTablecompiler;

function requireMysqlTablecompiler () {
	if (hasRequiredMysqlTablecompiler) return mysqlTablecompiler;
	hasRequiredMysqlTablecompiler = 1;
	// MySQL Table Builder & Compiler
	// -------
	const TableCompiler = tablecompiler;
	const { isObject, isString } = is;

	// Table Compiler
	// ------

	class TableCompiler_MySQL extends TableCompiler {
	  constructor(client, tableBuilder) {
	    super(client, tableBuilder);
	  }

	  createQuery(columns, ifNot, like) {
	    const createStatement = ifNot
	      ? 'create table if not exists '
	      : 'create table ';
	    const { client } = this;
	    let conn = {};
	    let columnsSql = ' (' + columns.sql.join(', ');

	    columnsSql += this.primaryKeys() || '';
	    columnsSql += this._addChecks();
	    columnsSql += ')';

	    let sql =
	      createStatement +
	      this.tableName() +
	      (like && this.tableNameLike()
	        ? ' like ' + this.tableNameLike()
	        : columnsSql);

	    // Check if the connection settings are set.
	    if (client.connectionSettings) {
	      conn = client.connectionSettings;
	    }

	    const charset = this.single.charset || conn.charset || '';
	    const collation = this.single.collate || conn.collate || '';
	    const engine = this.single.engine || '';

	    if (charset && !like) sql += ` default character set ${charset}`;
	    if (collation) sql += ` collate ${collation}`;
	    if (engine) sql += ` engine = ${engine}`;

	    if (this.single.comment) {
	      const comment = this.single.comment || '';
	      const MAX_COMMENT_LENGTH = 1024;
	      if (comment.length > MAX_COMMENT_LENGTH)
	        this.client.logger.warn(
	          `The max length for a table comment is ${MAX_COMMENT_LENGTH} characters`
	        );
	      sql += ` comment = '${comment}'`;
	    }

	    this.pushQuery(sql);
	    if (like) {
	      this.addColumns(columns, this.addColumnsPrefix);
	    }
	  }

	  // Compiles the comment on the table.
	  comment(comment) {
	    this.pushQuery(`alter table ${this.tableName()} comment = '${comment}'`);
	  }

	  changeType() {
	    // alter table + table + ' modify ' + wrapped + '// type';
	  }

	  // Renames a column on the table.
	  renameColumn(from, to) {
	    const compiler = this;
	    const table = this.tableName();
	    const wrapped = this.formatter.wrap(from) + ' ' + this.formatter.wrap(to);

	    this.pushQuery({
	      sql:
	        `show full fields from ${table} where field = ` +
	        this.client.parameter(from, this.tableBuilder, this.bindingsHolder),
	      output(resp) {
	        const column = resp[0];
	        const runner = this;
	        return compiler.getFKRefs(runner).then(([refs]) =>
	          new Promise((resolve, reject) => {
	            try {
	              if (!refs.length) {
	                resolve();
	              }
	              resolve(compiler.dropFKRefs(runner, refs));
	            } catch (e) {
	              reject(e);
	            }
	          })
	            .then(function () {
	              let sql = `alter table ${table} change ${wrapped} ${column.Type}`;

	              if (String(column.Null).toUpperCase() !== 'YES') {
	                sql += ` NOT NULL`;
	              } else {
	                // This doesn't matter for most cases except Timestamp, where this is important
	                sql += ` NULL`;
	              }
	              if (column.Default !== void 0 && column.Default !== null) {
	                sql += ` DEFAULT '${column.Default}'`;
	              }
	              if (column.Collation !== void 0 && column.Collation !== null) {
	                sql += ` COLLATE '${column.Collation}'`;
	              }
	              // Add back the auto increment if the column  it, fix issue #2767
	              if (column.Extra == 'auto_increment') {
	                sql += ` AUTO_INCREMENT`;
	              }

	              return runner.query({
	                sql,
	              });
	            })
	            .then(function () {
	              if (!refs.length) {
	                return;
	              }
	              return compiler.createFKRefs(
	                runner,
	                refs.map(function (ref) {
	                  if (ref.REFERENCED_COLUMN_NAME === from) {
	                    ref.REFERENCED_COLUMN_NAME = to;
	                  }
	                  if (ref.COLUMN_NAME === from) {
	                    ref.COLUMN_NAME = to;
	                  }
	                  return ref;
	                })
	              );
	            })
	        );
	      },
	    });
	  }

	  primaryKeys() {
	    const pks = (this.grouped.alterTable || []).filter(
	      (k) => k.method === 'primary'
	    );
	    if (pks.length > 0 && pks[0].args.length > 0) {
	      const columns = pks[0].args[0];
	      let constraintName = pks[0].args[1] || '';
	      if (constraintName) {
	        constraintName = ' constraint ' + this.formatter.wrap(constraintName);
	      }

	      if (this.grouped.columns) {
	        const incrementsCols = this._getIncrementsColumnNames();
	        if (incrementsCols.length) {
	          incrementsCols.forEach((c) => {
	            if (!columns.includes(c)) {
	              columns.unshift(c);
	            }
	          });
	        }
	        const bigIncrementsCols = this._getBigIncrementsColumnNames();
	        if (bigIncrementsCols.length) {
	          bigIncrementsCols.forEach((c) => {
	            if (!columns.includes(c)) {
	              columns.unshift(c);
	            }
	          });
	        }
	      }

	      return `,${constraintName} primary key (${this.formatter.columnize(
	        columns
	      )})`;
	    }
	  }

	  getFKRefs(runner) {
	    const bindingsHolder = {
	      bindings: [],
	    };

	    const sql =
	      'SELECT KCU.CONSTRAINT_NAME, KCU.TABLE_NAME, KCU.COLUMN_NAME, ' +
	      '       KCU.REFERENCED_TABLE_NAME, KCU.REFERENCED_COLUMN_NAME, ' +
	      '       RC.UPDATE_RULE, RC.DELETE_RULE ' +
	      'FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS KCU ' +
	      'JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS AS RC ' +
	      '       USING(CONSTRAINT_NAME)' +
	      'WHERE KCU.REFERENCED_TABLE_NAME = ' +
	      this.client.parameter(
	        this.tableNameRaw,
	        this.tableBuilder,
	        bindingsHolder
	      ) +
	      ' ' +
	      '  AND KCU.CONSTRAINT_SCHEMA = ' +
	      this.client.parameter(
	        this.client.database(),
	        this.tableBuilder,
	        bindingsHolder
	      ) +
	      ' ' +
	      '  AND RC.CONSTRAINT_SCHEMA = ' +
	      this.client.parameter(
	        this.client.database(),
	        this.tableBuilder,
	        bindingsHolder
	      );

	    return runner.query({
	      sql,
	      bindings: bindingsHolder.bindings,
	    });
	  }

	  dropFKRefs(runner, refs) {
	    const formatter = this.client.formatter(this.tableBuilder);

	    return Promise.all(
	      refs.map(function (ref) {
	        const constraintName = formatter.wrap(ref.CONSTRAINT_NAME);
	        const tableName = formatter.wrap(ref.TABLE_NAME);
	        return runner.query({
	          sql: `alter table ${tableName} drop foreign key ${constraintName}`,
	        });
	      })
	    );
	  }

	  createFKRefs(runner, refs) {
	    const formatter = this.client.formatter(this.tableBuilder);

	    return Promise.all(
	      refs.map(function (ref) {
	        const tableName = formatter.wrap(ref.TABLE_NAME);
	        const keyName = formatter.wrap(ref.CONSTRAINT_NAME);
	        const column = formatter.columnize(ref.COLUMN_NAME);
	        const references = formatter.columnize(ref.REFERENCED_COLUMN_NAME);
	        const inTable = formatter.wrap(ref.REFERENCED_TABLE_NAME);
	        const onUpdate = ` ON UPDATE ${ref.UPDATE_RULE}`;
	        const onDelete = ` ON DELETE ${ref.DELETE_RULE}`;

	        return runner.query({
	          sql:
	            `alter table ${tableName} add constraint ${keyName} ` +
	            'foreign key (' +
	            column +
	            ') references ' +
	            inTable +
	            ' (' +
	            references +
	            ')' +
	            onUpdate +
	            onDelete,
	        });
	      })
	    );
	  }

	  index(columns, indexName, options) {
	    let storageEngineIndexType;
	    let indexType;

	    if (isString(options)) {
	      indexType = options;
	    } else if (isObject(options)) {
	      ({ indexType, storageEngineIndexType } = options);
	    }

	    indexName = indexName
	      ? this.formatter.wrap(indexName)
	      : this._indexCommand('index', this.tableNameRaw, columns);
	    storageEngineIndexType = storageEngineIndexType
	      ? ` using ${storageEngineIndexType}`
	      : '';
	    this.pushQuery(
	      `alter table ${this.tableName()} add${
	        indexType ? ` ${indexType}` : ''
	      } index ${indexName}(${this.formatter.columnize(
	        columns
	      )})${storageEngineIndexType}`
	    );
	  }

	  primary(columns, constraintName) {
	    let deferrable;
	    if (isObject(constraintName)) {
	      ({ constraintName, deferrable } = constraintName);
	    }
	    if (deferrable && deferrable !== 'not deferrable') {
	      this.client.logger.warn(
	        `mysql: primary key constraint \`${constraintName}\` will not be deferrable ${deferrable} because mysql does not support deferred constraints.`
	      );
	    }
	    constraintName = constraintName
	      ? this.formatter.wrap(constraintName)
	      : this.formatter.wrap(`${this.tableNameRaw}_pkey`);

	    const primaryCols = columns;
	    let incrementsCols = [];
	    let bigIncrementsCols = [];
	    if (this.grouped.columns) {
	      incrementsCols = this._getIncrementsColumnNames();
	      if (incrementsCols) {
	        incrementsCols.forEach((c) => {
	          if (!primaryCols.includes(c)) {
	            primaryCols.unshift(c);
	          }
	        });
	      }
	      bigIncrementsCols = this._getBigIncrementsColumnNames();
	      if (bigIncrementsCols) {
	        bigIncrementsCols.forEach((c) => {
	          if (!primaryCols.includes(c)) {
	            primaryCols.unshift(c);
	          }
	        });
	      }
	    }
	    if (this.method !== 'create' && this.method !== 'createIfNot') {
	      this.pushQuery(
	        `alter table ${this.tableName()} add primary key ${constraintName}(${this.formatter.columnize(
	          primaryCols
	        )})`
	      );
	    }
	    if (incrementsCols.length) {
	      this.pushQuery(
	        `alter table ${this.tableName()} modify column ${this.formatter.columnize(
	          incrementsCols
	        )} int unsigned not null auto_increment`
	      );
	    }
	    if (bigIncrementsCols.length) {
	      this.pushQuery(
	        `alter table ${this.tableName()} modify column ${this.formatter.columnize(
	          bigIncrementsCols
	        )} bigint unsigned not null auto_increment`
	      );
	    }
	  }

	  unique(columns, indexName) {
	    let storageEngineIndexType;
	    let deferrable;
	    if (isObject(indexName)) {
	      ({ indexName, deferrable, storageEngineIndexType } = indexName);
	    }
	    if (deferrable && deferrable !== 'not deferrable') {
	      this.client.logger.warn(
	        `mysql: unique index \`${indexName}\` will not be deferrable ${deferrable} because mysql does not support deferred constraints.`
	      );
	    }
	    indexName = indexName
	      ? this.formatter.wrap(indexName)
	      : this._indexCommand('unique', this.tableNameRaw, columns);
	    storageEngineIndexType = storageEngineIndexType
	      ? ` using ${storageEngineIndexType}`
	      : '';
	    this.pushQuery(
	      `alter table ${this.tableName()} add unique ${indexName}(${this.formatter.columnize(
	        columns
	      )})${storageEngineIndexType}`
	    );
	  }

	  // Compile a drop index command.
	  dropIndex(columns, indexName) {
	    indexName = indexName
	      ? this.formatter.wrap(indexName)
	      : this._indexCommand('index', this.tableNameRaw, columns);
	    this.pushQuery(`alter table ${this.tableName()} drop index ${indexName}`);
	  }

	  // Compile a drop foreign key command.
	  dropForeign(columns, indexName) {
	    indexName = indexName
	      ? this.formatter.wrap(indexName)
	      : this._indexCommand('foreign', this.tableNameRaw, columns);
	    this.pushQuery(
	      `alter table ${this.tableName()} drop foreign key ${indexName}`
	    );
	  }

	  // Compile a drop primary key command.
	  dropPrimary() {
	    this.pushQuery(`alter table ${this.tableName()} drop primary key`);
	  }

	  // Compile a drop unique key command.
	  dropUnique(column, indexName) {
	    indexName = indexName
	      ? this.formatter.wrap(indexName)
	      : this._indexCommand('unique', this.tableNameRaw, column);
	    this.pushQuery(`alter table ${this.tableName()} drop index ${indexName}`);
	  }
	}

	TableCompiler_MySQL.prototype.addColumnsPrefix = 'add ';
	TableCompiler_MySQL.prototype.alterColumnsPrefix = 'modify ';
	TableCompiler_MySQL.prototype.dropColumnPrefix = 'drop ';

	mysqlTablecompiler = TableCompiler_MySQL;
	return mysqlTablecompiler;
}

var mysqlColumncompiler;
var hasRequiredMysqlColumncompiler;

function requireMysqlColumncompiler () {
	if (hasRequiredMysqlColumncompiler) return mysqlColumncompiler;
	hasRequiredMysqlColumncompiler = 1;
	// MySQL Column Compiler
	// -------
	const ColumnCompiler = columncompiler;
	const { isObject } = is;
	const { toNumber } = helpers$7;

	const commentEscapeRegex = /(?<!\\)'/g;

	class ColumnCompiler_MySQL extends ColumnCompiler {
	  constructor(client, tableCompiler, columnBuilder) {
	    super(client, tableCompiler, columnBuilder);
	    this.modifiers = [
	      'unsigned',
	      'nullable',
	      'defaultTo',
	      'comment',
	      'collate',
	      'first',
	      'after',
	    ];
	    this._addCheckModifiers();
	  }

	  // Types
	  // ------

	  double(precision, scale) {
	    if (!precision) return 'double';
	    return `double(${toNumber(precision, 8)}, ${toNumber(scale, 2)})`;
	  }

	  integer(length) {
	    length = length ? `(${toNumber(length, 11)})` : '';
	    return `int${length}`;
	  }

	  tinyint(length) {
	    length = length ? `(${toNumber(length, 1)})` : '';
	    return `tinyint${length}`;
	  }

	  text(column) {
	    switch (column) {
	      case 'medium':
	      case 'mediumtext':
	        return 'mediumtext';
	      case 'long':
	      case 'longtext':
	        return 'longtext';
	      default:
	        return 'text';
	    }
	  }

	  mediumtext() {
	    return this.text('medium');
	  }

	  longtext() {
	    return this.text('long');
	  }

	  enu(allowed) {
	    return `enum('${allowed.join("', '")}')`;
	  }

	  datetime(precision) {
	    if (isObject(precision)) {
	      ({ precision } = precision);
	    }

	    return typeof precision === 'number'
	      ? `datetime(${precision})`
	      : 'datetime';
	  }

	  timestamp(precision) {
	    if (isObject(precision)) {
	      ({ precision } = precision);
	    }

	    return typeof precision === 'number'
	      ? `timestamp(${precision})`
	      : 'timestamp';
	  }

	  time(precision) {
	    if (isObject(precision)) {
	      ({ precision } = precision);
	    }

	    return typeof precision === 'number' ? `time(${precision})` : 'time';
	  }

	  bit(length) {
	    return length ? `bit(${toNumber(length)})` : 'bit';
	  }

	  binary(length) {
	    return length ? `varbinary(${toNumber(length)})` : 'blob';
	  }

	  json() {
	    return 'json';
	  }

	  jsonb() {
	    return 'json';
	  }

	  // Modifiers
	  // ------

	  defaultTo(value) {
	    // MySQL defaults to null by default, but breaks down if you pass it explicitly
	    // Note that in MySQL versions up to 5.7, logic related to updating
	    // timestamps when no explicit value is passed is quite insane - https://dev.mysql.com/doc/refman/5.7/en/server-system-variables.html#sysvar_explicit_defaults_for_timestamp
	    if (value === null || value === undefined) {
	      return;
	    }
	    if ((this.type === 'json' || this.type === 'jsonb') && isObject(value)) {
	      // Default value for json will work only it is an expression
	      return `default ('${JSON.stringify(value)}')`;
	    }
	    const defaultVal = super.defaultTo.apply(this, arguments);
	    if (this.type !== 'blob' && this.type.indexOf('text') === -1) {
	      return defaultVal;
	    }
	    return '';
	  }

	  unsigned() {
	    return 'unsigned';
	  }

	  comment(comment) {
	    if (comment && comment.length > 255) {
	      this.client.logger.warn(
	        'Your comment is longer than the max comment length for MySQL'
	      );
	    }
	    return comment && `comment '${comment.replace(commentEscapeRegex, "\\'")}'`;
	  }

	  first() {
	    return 'first';
	  }

	  after(column) {
	    return `after ${this.formatter.wrap(column)}`;
	  }

	  collate(collation) {
	    return collation && `collate '${collation}'`;
	  }

	  checkRegex(regex, constraintName) {
	    return this._check(
	      `${this.formatter.wrap(
	        this.getColumnName()
	      )} REGEXP ${this.client._escapeBinding(regex)}`,
	      constraintName
	    );
	  }

	  increments(options = { primaryKey: true }) {
	    return (
	      'int unsigned not null' +
	      // In MySQL autoincrement are always a primary key. If you already have a primary key, we
	      // initialize this column as classic int column then modify it later in table compiler
	      (this.tableCompiler._canBeAddPrimaryKey(options)
	        ? ' auto_increment primary key'
	        : '')
	    );
	  }

	  bigincrements(options = { primaryKey: true }) {
	    return (
	      'bigint unsigned not null' +
	      // In MySQL autoincrement are always a primary key. If you already have a primary key, we
	      // initialize this column as classic int column then modify it later in table compiler
	      (this.tableCompiler._canBeAddPrimaryKey(options)
	        ? ' auto_increment primary key'
	        : '')
	    );
	  }
	}

	ColumnCompiler_MySQL.prototype.bigint = 'bigint';
	ColumnCompiler_MySQL.prototype.mediumint = 'mediumint';
	ColumnCompiler_MySQL.prototype.smallint = 'smallint';

	mysqlColumncompiler = ColumnCompiler_MySQL;
	return mysqlColumncompiler;
}

/* eslint max-len: 0 */

var mysqlViewcompiler;
var hasRequiredMysqlViewcompiler;

function requireMysqlViewcompiler () {
	if (hasRequiredMysqlViewcompiler) return mysqlViewcompiler;
	hasRequiredMysqlViewcompiler = 1;
	const ViewCompiler = viewcompiler;

	class ViewCompiler_MySQL extends ViewCompiler {
	  constructor(client, viewCompiler) {
	    super(client, viewCompiler);
	  }

	  createOrReplace() {
	    this.createQuery(this.columns, this.selectQuery, false, true);
	  }
	}

	mysqlViewcompiler = ViewCompiler_MySQL;
	return mysqlViewcompiler;
}

var mysqlViewbuilder;
var hasRequiredMysqlViewbuilder;

function requireMysqlViewbuilder () {
	if (hasRequiredMysqlViewbuilder) return mysqlViewbuilder;
	hasRequiredMysqlViewbuilder = 1;
	const ViewBuilder = viewbuilder;

	class ViewBuilder_MySQL extends ViewBuilder {
	  constructor() {
	    super(...arguments);
	  }

	  checkOption() {
	    this._single.checkOption = 'default_option';
	  }

	  localCheckOption() {
	    this._single.checkOption = 'local';
	  }

	  cascadedCheckOption() {
	    this._single.checkOption = 'cascaded';
	  }
	}

	mysqlViewbuilder = ViewBuilder_MySQL;
	return mysqlViewbuilder;
}

const require$$13 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(mysql$1);

var mysql;
var hasRequiredMysql;

function requireMysql () {
	if (hasRequiredMysql) return mysql;
	hasRequiredMysql = 1;
	// MySQL Client
	// -------
	const defer = require$$0$1;
	const map = require$$1$5;
	const { promisify } = require$$1$e;
	const Client = client$2;

	const Transaction = /*@__PURE__*/ requireTransaction$3();
	const QueryBuilder = /*@__PURE__*/ requireMysqlQuerybuilder();
	const QueryCompiler = /*@__PURE__*/ requireMysqlQuerycompiler();
	const SchemaCompiler = /*@__PURE__*/ requireMysqlCompiler();
	const TableCompiler = /*@__PURE__*/ requireMysqlTablecompiler();
	const ColumnCompiler = /*@__PURE__*/ requireMysqlColumncompiler();

	const { makeEscape } = string;
	const ViewCompiler = /*@__PURE__*/ requireMysqlViewcompiler();
	const ViewBuilder = /*@__PURE__*/ requireMysqlViewbuilder();

	// Always initialize with the "QueryBuilder" and "QueryCompiler"
	// objects, which extend the base 'lib/query/builder' and
	// 'lib/query/compiler', respectively.
	class Client_MySQL extends Client {
	  _driver() {
	    return require$$13;
	  }

	  queryBuilder() {
	    return new QueryBuilder(this);
	  }

	  queryCompiler(builder, formatter) {
	    return new QueryCompiler(this, builder, formatter);
	  }

	  schemaCompiler() {
	    return new SchemaCompiler(this, ...arguments);
	  }

	  tableCompiler() {
	    return new TableCompiler(this, ...arguments);
	  }

	  viewCompiler() {
	    return new ViewCompiler(this, ...arguments);
	  }

	  viewBuilder() {
	    return new ViewBuilder(this, ...arguments);
	  }

	  columnCompiler() {
	    return new ColumnCompiler(this, ...arguments);
	  }

	  transaction() {
	    return new Transaction(this, ...arguments);
	  }

	  wrapIdentifierImpl(value) {
	    return value !== '*' ? `\`${value.replace(/`/g, '``')}\`` : '*';
	  }

	  // Get a raw connection, called by the `pool` whenever a new
	  // connection needs to be added to the pool.
	  acquireRawConnection() {
	    return new Promise((resolver, rejecter) => {
	      const connection = this.driver.createConnection(this.connectionSettings);
	      connection.on('error', (err) => {
	        connection.__knex__disposed = err;
	      });
	      connection.connect((err) => {
	        if (err) {
	          // if connection is rejected, remove listener that was registered above...
	          connection.removeAllListeners();
	          return rejecter(err);
	        }
	        resolver(connection);
	      });
	    });
	  }

	  // Used to explicitly close a connection, called internally by the pool
	  // when a connection times out or the pool is shutdown.
	  async destroyRawConnection(connection) {
	    try {
	      const end = promisify((cb) => connection.end(cb));
	      return await end();
	    } catch (err) {
	      connection.__knex__disposed = err;
	    } finally {
	      // see discussion https://github.com/knex/knex/pull/3483
	      defer(() => connection.removeAllListeners());
	    }
	  }

	  validateConnection(connection) {
	    return (
	      connection.state === 'connected' || connection.state === 'authenticated'
	    );
	  }

	  // Grab a connection, run the query via the MySQL streaming interface,
	  // and pass that through to the stream we've sent back to the client.
	  _stream(connection, obj, stream, options) {
	    if (!obj.sql) throw new Error('The query is empty');

	    options = options || {};
	    const queryOptions = Object.assign({ sql: obj.sql }, obj.options);
	    return new Promise((resolver, rejecter) => {
	      stream.on('error', rejecter);
	      stream.on('end', resolver);
	      const queryStream = connection
	        .query(queryOptions, obj.bindings)
	        .stream(options);

	      queryStream.on('error', (err) => {
	        rejecter(err);
	        stream.emit('error', err);
	      });

	      queryStream.pipe(stream);
	    });
	  }

	  // Runs the query on the specified connection, providing the bindings
	  // and any other necessary prep work.
	  _query(connection, obj) {
	    if (!obj || typeof obj === 'string') obj = { sql: obj };
	    if (!obj.sql) throw new Error('The query is empty');

	    return new Promise(function (resolver, rejecter) {
	      if (!obj.sql) {
	        resolver();
	        return;
	      }
	      const queryOptions = Object.assign({ sql: obj.sql }, obj.options);
	      connection.query(
	        queryOptions,
	        obj.bindings,
	        function (err, rows, fields) {
	          if (err) return rejecter(err);
	          obj.response = [rows, fields];
	          resolver(obj);
	        }
	      );
	    });
	  }

	  // Process the response as returned from the query.
	  processResponse(obj, runner) {
	    if (obj == null) return;
	    const { response } = obj;
	    const { method } = obj;
	    const rows = response[0];
	    const fields = response[1];
	    if (obj.output) return obj.output.call(runner, rows, fields);
	    switch (method) {
	      case 'select':
	        return rows;
	      case 'first':
	        return rows[0];
	      case 'pluck':
	        return map(rows, obj.pluck);
	      case 'insert':
	        return [rows.insertId];
	      case 'del':
	      case 'update':
	      case 'counter':
	        return rows.affectedRows;
	      default:
	        return response;
	    }
	  }

	  async cancelQuery(connectionToKill) {
	    const conn = await this.acquireRawConnection();
	    try {
	      return await this._wrappedCancelQueryCall(conn, connectionToKill);
	    } finally {
	      await this.destroyRawConnection(conn);
	      if (conn.__knex__disposed) {
	        this.logger.warn(`Connection Error: ${conn.__knex__disposed}`);
	      }
	    }
	  }

	  _wrappedCancelQueryCall(conn, connectionToKill) {
	    return this._query(conn, {
	      sql: 'KILL QUERY ?',
	      bindings: [connectionToKill.threadId],
	      options: {},
	    });
	  }
	}

	Object.assign(Client_MySQL.prototype, {
	  dialect: 'mysql',

	  driverName: 'mysql',

	  _escapeBinding: makeEscape(),

	  canCancelQuery: true,
	});

	mysql = Client_MySQL;
	return mysql;
}

var transaction$2;
var hasRequiredTransaction$2;

function requireTransaction$2 () {
	if (hasRequiredTransaction$2) return transaction$2;
	hasRequiredTransaction$2 = 1;
	const Transaction = transaction$5;
	const debug = require$$2$9('knex:tx');

	class Transaction_MySQL2 extends Transaction {
	  query(conn, sql, status, value) {
	    const t = this;
	    const q = this.trxClient
	      .query(conn, sql)
	      .catch((err) => {
	        if (err.code === 'ER_SP_DOES_NOT_EXIST') {
	          this.trxClient.logger.warn(
	            'Transaction was implicitly committed, do not mix transactions and ' +
	              'DDL with MySQL (#805)'
	          );
	          return;
	        }

	        status = 2;
	        value = err;
	        t._completed = true;
	        debug('%s error running transaction query', t.txid);
	      })
	      .then(function (res) {
	        if (status === 1) t._resolver(value);
	        if (status === 2) {
	          if (value === undefined) {
	            if (t.doNotRejectOnRollback && /^ROLLBACK\b/i.test(sql)) {
	              t._resolver();
	              return;
	            }
	            value = new Error(`Transaction rejected with non-error: ${value}`);
	          }
	          t._rejecter(value);
	          return res;
	        }
	      });
	    if (status === 1 || status === 2) {
	      t._completed = true;
	    }
	    return q;
	  }
	}

	transaction$2 = Transaction_MySQL2;
	return transaction$2;
}

const require$$2 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(mysql2$1);

var mysql2;
var hasRequiredMysql2;

function requireMysql2 () {
	if (hasRequiredMysql2) return mysql2;
	hasRequiredMysql2 = 1;
	// MySQL2 Client
	// -------
	const Client_MySQL = /*@__PURE__*/ requireMysql();
	const Transaction = /*@__PURE__*/ requireTransaction$2();

	// Always initialize with the "QueryBuilder" and "QueryCompiler"
	// objects, which extend the base 'lib/query/builder' and
	// 'lib/query/compiler', respectively.
	class Client_MySQL2 extends Client_MySQL {
	  transaction() {
	    return new Transaction(this, ...arguments);
	  }

	  _driver() {
	    return require$$2;
	  }

	  initializeDriver() {
	    try {
	      this.driver = this._driver();
	    } catch (e) {
	      let message = `Knex: run\n$ npm install ${this.driverName}`;

	      const nodeMajorVersion = process.version.replace(/^v/, '').split('.')[0];
	      if (nodeMajorVersion <= 12) {
	        message += `@3.2.0`;
	        this.logger.error(
	          'Mysql2 version 3.2.0 is the latest version to support Node.js 12 or lower.'
	        );
	      }
	      message += ` --save`;
	      this.logger.error(`${message}\n${e.message}\n${e.stack}`);
	      throw new Error(`${message}\n${e.message}`);
	    }
	  }

	  validateConnection(connection) {
	    return (
	      connection &&
	      !connection._fatalError &&
	      !connection._protocolError &&
	      !connection._closing &&
	      !connection.stream.destroyed
	    );
	  }
	}

	Object.assign(Client_MySQL2.prototype, {
	  // The "dialect", for reference elsewhere.
	  driverName: 'mysql2',
	});

	mysql2 = Client_MySQL2;
	return mysql2;
}

var utils$1;
var hasRequiredUtils$1;

function requireUtils$1 () {
	if (hasRequiredUtils$1) return utils$1;
	hasRequiredUtils$1 = 1;
	class NameHelper {
	  constructor(oracleVersion) {
	    this.oracleVersion = oracleVersion;

	    // In oracle versions prior to 12.2, the maximum length for a database
	    // object name was 30 characters. 12.2 extended this to 128.
	    const versionParts = oracleVersion
	      .split('.')
	      .map((versionPart) => parseInt(versionPart));
	    if (
	      versionParts[0] > 12 ||
	      (versionParts[0] === 12 && versionParts[1] >= 2)
	    ) {
	      this.limit = 128;
	    } else {
	      this.limit = 30;
	    }
	  }

	  generateCombinedName(logger, postfix, name, subNames) {
	    const crypto = require$$0$3;
	    if (!Array.isArray(subNames)) subNames = subNames ? [subNames] : [];
	    const table = name.replace(/\.|-/g, '_');
	    const subNamesPart = subNames.join('_');
	    let result = `${table}_${
	      subNamesPart.length ? subNamesPart + '_' : ''
	    }${postfix}`.toLowerCase();
	    if (result.length > this.limit) {
	      logger.warn(
	        `Automatically generated name "${result}" exceeds ${this.limit} character ` +
	          `limit for Oracle Database ${this.oracleVersion}. Using base64 encoded sha1 of that name instead.`
	      );
	      // generates the sha1 of the name and encode it with base64
	      result = crypto
	        .createHash('sha1')
	        .update(result)
	        .digest('base64')
	        .replace('=', '');
	    }
	    return result;
	  }
	}

	function wrapSqlWithCatch(sql, errorNumberToCatch) {
	  return (
	    `begin execute immediate '${sql.replace(/'/g, "''")}'; ` +
	    `exception when others then if sqlcode != ${errorNumberToCatch} then raise; ` +
	    `end if; ` +
	    `end;`
	  );
	}

	function ReturningHelper(columnName) {
	  this.columnName = columnName;
	}

	ReturningHelper.prototype.toString = function () {
	  return `[object ReturningHelper:${this.columnName}]`;
	};

	// If the error is any of these, we'll assume we need to
	// mark the connection as failed
	function isConnectionError(err) {
	  return [
	    'DPI-1010', // not connected
	    'DPI-1080', // connection was closed by ORA-%d
	    'ORA-03114', // not connected to ORACLE
	    'ORA-03113', // end-of-file on communication channel
	    'ORA-03135', // connection lost contact
	    'ORA-12514', // listener does not currently know of service requested in connect descriptor
	    'ORA-00022', // invalid session ID; access denied
	    'ORA-00028', // your session has been killed
	    'ORA-00031', // your session has been marked for kill
	    'ORA-00045', // your session has been terminated with no replay
	    'ORA-00378', // buffer pools cannot be created as specified
	    'ORA-00602', // internal programming exception
	    'ORA-00603', // ORACLE server session terminated by fatal error
	    'ORA-00609', // could not attach to incoming connection
	    'ORA-01012', // not logged on
	    'ORA-01041', // internal error. hostdef extension doesn't exist
	    'ORA-01043', // user side memory corruption
	    'ORA-01089', // immediate shutdown or close in progress
	    'ORA-01092', // ORACLE instance terminated. Disconnection forced
	    'ORA-02396', // exceeded maximum idle time, please connect again
	    'ORA-03122', // attempt to close ORACLE-side window on user side
	    'ORA-12153', // TNS'not connected
	    'ORA-12537', // TNS'connection closed
	    'ORA-12547', // TNS'lost contact
	    'ORA-12570', // TNS'packet reader failure
	    'ORA-12583', // TNS'no reader
	    'ORA-27146', // post/wait initialization failed
	    'ORA-28511', // lost RPC connection
	    'ORA-56600', // an illegal OCI function call was issued
	    'NJS-024',
	    'NJS-003',
	  ].some(function (prefix) {
	    return err.message.indexOf(prefix) === 0;
	  });
	}

	utils$1 = {
	  NameHelper,
	  isConnectionError,
	  wrapSqlWithCatch,
	  ReturningHelper,
	};
	return utils$1;
}

var trigger;
var hasRequiredTrigger;

function requireTrigger () {
	if (hasRequiredTrigger) return trigger;
	hasRequiredTrigger = 1;
	const { NameHelper } = /*@__PURE__*/ requireUtils$1();

	class Trigger {
	  constructor(oracleVersion) {
	    this.nameHelper = new NameHelper(oracleVersion);
	  }

	  renameColumnTrigger(logger, tableName, columnName, to) {
	    const triggerName = this.nameHelper.generateCombinedName(
	      logger,
	      'autoinc_trg',
	      tableName
	    );
	    const sequenceName = this.nameHelper.generateCombinedName(
	      logger,
	      'seq',
	      tableName
	    );
	    return (
	      `DECLARE ` +
	      `PK_NAME VARCHAR(200); ` +
	      `IS_AUTOINC NUMBER := 0; ` +
	      `BEGIN` +
	      `  EXECUTE IMMEDIATE ('ALTER TABLE "${tableName}" RENAME COLUMN "${columnName}" TO "${to}"');` +
	      `  SELECT COUNT(*) INTO IS_AUTOINC from "USER_TRIGGERS" where trigger_name = '${triggerName}';` +
	      `  IF (IS_AUTOINC > 0) THEN` +
	      `    SELECT cols.column_name INTO PK_NAME` +
	      `    FROM all_constraints cons, all_cons_columns cols` +
	      `    WHERE cons.constraint_type = 'P'` +
	      `    AND cons.constraint_name = cols.constraint_name` +
	      `    AND cons.owner = cols.owner` +
	      `    AND cols.table_name = '${tableName}';` +
	      `    IF ('${to}' = PK_NAME) THEN` +
	      `      EXECUTE IMMEDIATE ('DROP TRIGGER "${triggerName}"');` +
	      `      EXECUTE IMMEDIATE ('create or replace trigger "${triggerName}"` +
	      `      BEFORE INSERT on "${tableName}" for each row` +
	      `        declare` +
	      `        checking number := 1;` +
	      `        begin` +
	      `          if (:new."${to}" is null) then` +
	      `            while checking >= 1 loop` +
	      `              select "${sequenceName}".nextval into :new."${to}" from dual;` +
	      `              select count("${to}") into checking from "${tableName}"` +
	      `              where "${to}" = :new."${to}";` +
	      `            end loop;` +
	      `          end if;` +
	      `        end;');` +
	      `    end if;` +
	      `  end if;` +
	      `END;`
	    );
	  }

	  createAutoIncrementTrigger(logger, tableName, schemaName) {
	    const tableQuoted = `"${tableName}"`;
	    const tableUnquoted = tableName;
	    const schemaQuoted = schemaName ? `"${schemaName}".` : '';
	    const constraintOwner = schemaName ? `'${schemaName}'` : 'cols.owner';
	    const triggerName = this.nameHelper.generateCombinedName(
	      logger,
	      'autoinc_trg',
	      tableName
	    );
	    const sequenceNameUnquoted = this.nameHelper.generateCombinedName(
	      logger,
	      'seq',
	      tableName
	    );
	    const sequenceNameQuoted = `"${sequenceNameUnquoted}"`;
	    return (
	      `DECLARE ` +
	      `PK_NAME VARCHAR(200); ` +
	      `BEGIN` +
	      `  EXECUTE IMMEDIATE ('CREATE SEQUENCE ${schemaQuoted}${sequenceNameQuoted}');` +
	      `  SELECT cols.column_name INTO PK_NAME` + // TODO : support autoincrement on table with multiple primary keys
	      `  FROM all_constraints cons, all_cons_columns cols` +
	      `  WHERE cons.constraint_type = 'P'` +
	      `  AND cons.constraint_name = cols.constraint_name` +
	      `  AND cons.owner = ${constraintOwner}` +
	      `  AND cols.table_name = '${tableUnquoted}';` +
	      `  execute immediate ('create or replace trigger ${schemaQuoted}"${triggerName}"` +
	      `  BEFORE INSERT on ${schemaQuoted}${tableQuoted}` +
	      `  for each row` +
	      `  declare` +
	      `  checking number := 1;` +
	      `  begin` +
	      `    if (:new."' || PK_NAME || '" is null) then` +
	      `      while checking >= 1 loop` +
	      `        select ${schemaQuoted}${sequenceNameQuoted}.nextval into :new."' || PK_NAME || '" from dual;` +
	      `        select count("' || PK_NAME || '") into checking from ${schemaQuoted}${tableQuoted}` +
	      `        where "' || PK_NAME || '" = :new."' || PK_NAME || '";` +
	      `      end loop;` +
	      `    end if;` +
	      `  end;'); ` +
	      `END;`
	    );
	  }

	  renameTableAndAutoIncrementTrigger(logger, tableName, to) {
	    const triggerName = this.nameHelper.generateCombinedName(
	      logger,
	      'autoinc_trg',
	      tableName
	    );
	    const sequenceName = this.nameHelper.generateCombinedName(
	      logger,
	      'seq',
	      tableName
	    );
	    const toTriggerName = this.nameHelper.generateCombinedName(
	      logger,
	      'autoinc_trg',
	      to
	    );
	    const toSequenceName = this.nameHelper.generateCombinedName(
	      logger,
	      'seq',
	      to
	    );
	    return (
	      `DECLARE ` +
	      `PK_NAME VARCHAR(200); ` +
	      `IS_AUTOINC NUMBER := 0; ` +
	      `BEGIN` +
	      `  EXECUTE IMMEDIATE ('RENAME "${tableName}" TO "${to}"');` +
	      `  SELECT COUNT(*) INTO IS_AUTOINC from "USER_TRIGGERS" where trigger_name = '${triggerName}';` +
	      `  IF (IS_AUTOINC > 0) THEN` +
	      `    EXECUTE IMMEDIATE ('DROP TRIGGER "${triggerName}"');` +
	      `    EXECUTE IMMEDIATE ('RENAME "${sequenceName}" TO "${toSequenceName}"');` +
	      `    SELECT cols.column_name INTO PK_NAME` +
	      `    FROM all_constraints cons, all_cons_columns cols` +
	      `    WHERE cons.constraint_type = 'P'` +
	      `    AND cons.constraint_name = cols.constraint_name` +
	      `    AND cons.owner = cols.owner` +
	      `    AND cols.table_name = '${to}';` +
	      `    EXECUTE IMMEDIATE ('create or replace trigger "${toTriggerName}"` +
	      `    BEFORE INSERT on "${to}" for each row` +
	      `      declare` +
	      `      checking number := 1;` +
	      `      begin` +
	      `        if (:new."' || PK_NAME || '" is null) then` +
	      `          while checking >= 1 loop` +
	      `            select "${toSequenceName}".nextval into :new."' || PK_NAME || '" from dual;` +
	      `            select count("' || PK_NAME || '") into checking from "${to}"` +
	      `            where "' || PK_NAME || '" = :new."' || PK_NAME || '";` +
	      `          end loop;` +
	      `        end if;` +
	      `      end;');` +
	      `  end if;` +
	      `END;`
	    );
	  }
	}

	trigger = Trigger;
	return trigger;
}

var oracleCompiler;
var hasRequiredOracleCompiler;

function requireOracleCompiler () {
	if (hasRequiredOracleCompiler) return oracleCompiler;
	hasRequiredOracleCompiler = 1;
	// Oracle Schema Compiler
	// -------
	const SchemaCompiler = compiler$1;
	const utils = /*@__PURE__*/ requireUtils$1();
	const Trigger = /*@__PURE__*/ requireTrigger();

	class SchemaCompiler_Oracle extends SchemaCompiler {
	  constructor() {
	    super(...arguments);
	  }

	  // Rename a table on the schema.
	  renameTable(tableName, to) {
	    const trigger = new Trigger(this.client.version);
	    const renameTable = trigger.renameTableAndAutoIncrementTrigger(
	      this.client.logger,
	      tableName,
	      to
	    );
	    this.pushQuery(renameTable);
	  }

	  // Check whether a table exists on the query.
	  hasTable(tableName) {
	    this.pushQuery({
	      sql:
	        'select TABLE_NAME from USER_TABLES where TABLE_NAME = ' +
	        this.client.parameter(tableName, this.builder, this.bindingsHolder),
	      output(resp) {
	        return resp.length > 0;
	      },
	    });
	  }

	  // Check whether a column exists on the schema.
	  hasColumn(tableName, column) {
	    const sql =
	      `select COLUMN_NAME from ALL_TAB_COLUMNS ` +
	      `where TABLE_NAME = ${this.client.parameter(
	        tableName,
	        this.builder,
	        this.bindingsHolder
	      )} ` +
	      `and COLUMN_NAME = ${this.client.parameter(
	        column,
	        this.builder,
	        this.bindingsHolder
	      )}`;
	    this.pushQuery({ sql, output: (resp) => resp.length > 0 });
	  }

	  dropSequenceIfExists(sequenceName) {
	    const prefix = this.schema ? `"${this.schema}".` : '';
	    this.pushQuery(
	      utils.wrapSqlWithCatch(
	        `drop sequence ${prefix}${this.formatter.wrap(sequenceName)}`,
	        -2289
	      )
	    );
	  }

	  _dropRelatedSequenceIfExists(tableName) {
	    // removing the sequence that was possibly generated by increments() column
	    const nameHelper = new utils.NameHelper(this.client.version);
	    const sequenceName = nameHelper.generateCombinedName(
	      this.client.logger,
	      'seq',
	      tableName
	    );
	    this.dropSequenceIfExists(sequenceName);
	  }

	  dropTable(tableName) {
	    const prefix = this.schema ? `"${this.schema}".` : '';
	    this.pushQuery(`drop table ${prefix}${this.formatter.wrap(tableName)}`);

	    // removing the sequence that was possibly generated by increments() column
	    this._dropRelatedSequenceIfExists(tableName);
	  }

	  dropTableIfExists(tableName) {
	    this.dropObject(tableName, 'table');
	  }

	  dropViewIfExists(viewName) {
	    this.dropObject(viewName, 'view');
	  }

	  dropObject(objectName, type) {
	    const prefix = this.schema ? `"${this.schema}".` : '';
	    let errorCode = -942;
	    if (type === 'materialized view') {
	      // https://stackoverflow.com/a/1801453
	      errorCode = -12003;
	    }
	    this.pushQuery(
	      utils.wrapSqlWithCatch(
	        `drop ${type} ${prefix}${this.formatter.wrap(objectName)}`,
	        errorCode
	      )
	    );

	    // removing the sequence that was possibly generated by increments() column
	    this._dropRelatedSequenceIfExists(objectName);
	  }

	  refreshMaterializedView(viewName) {
	    return this.pushQuery({
	      sql: `BEGIN DBMS_MVIEW.REFRESH('${
	        this.schemaNameRaw ? this.schemaNameRaw + '.' : ''
	      }${viewName}'); END;`,
	    });
	  }

	  dropMaterializedView(viewName) {
	    this._dropView(viewName, false, true);
	  }

	  dropMaterializedViewIfExists(viewName) {
	    this.dropObject(viewName, 'materialized view');
	  }
	}

	oracleCompiler = SchemaCompiler_Oracle;
	return oracleCompiler;
}

var oracleColumnbuilder;
var hasRequiredOracleColumnbuilder;

function requireOracleColumnbuilder () {
	if (hasRequiredOracleColumnbuilder) return oracleColumnbuilder;
	hasRequiredOracleColumnbuilder = 1;
	const ColumnBuilder = columnbuilder;
	const toArray = require$$1$8;

	class ColumnBuilder_Oracle extends ColumnBuilder {
	  constructor() {
	    super(...arguments);
	  }

	  // checkIn added to the builder to allow the column compiler to change the
	  // order via the modifiers ("check" must be after "default")
	  checkIn() {
	    this._modifiers.checkIn = toArray(arguments);
	    return this;
	  }
	}

	oracleColumnbuilder = ColumnBuilder_Oracle;
	return oracleColumnbuilder;
}

const require$$0 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(uniq);

var incrementUtils;
var hasRequiredIncrementUtils;

function requireIncrementUtils () {
	if (hasRequiredIncrementUtils) return incrementUtils;
	hasRequiredIncrementUtils = 1;
	const Trigger = /*@__PURE__*/ requireTrigger();

	// helper function for pushAdditional in increments() and bigincrements()
	function createAutoIncrementTriggerAndSequence(columnCompiler) {
	  const trigger = new Trigger(columnCompiler.client.version);

	  // TODO Add warning that sequence etc is created
	  columnCompiler.pushAdditional(function () {
	    const tableName = this.tableCompiler.tableNameRaw;
	    const schemaName = this.tableCompiler.schemaNameRaw;
	    const createTriggerSQL = trigger.createAutoIncrementTrigger(
	      this.client.logger,
	      tableName,
	      schemaName
	    );
	    this.pushQuery(createTriggerSQL);
	  });
	}

	incrementUtils = {
	  createAutoIncrementTriggerAndSequence,
	};
	return incrementUtils;
}

var oracleColumncompiler;
var hasRequiredOracleColumncompiler;

function requireOracleColumncompiler () {
	if (hasRequiredOracleColumncompiler) return oracleColumncompiler;
	hasRequiredOracleColumncompiler = 1;
	const uniq = require$$0;
	const Raw = raw;
	const ColumnCompiler = columncompiler;
	const {
	  createAutoIncrementTriggerAndSequence,
	} = /*@__PURE__*/ requireIncrementUtils();
	const { toNumber } = helpers$7;

	// Column Compiler
	// -------

	class ColumnCompiler_Oracle extends ColumnCompiler {
	  constructor() {
	    super(...arguments);
	    this.modifiers = ['defaultTo', 'checkIn', 'nullable', 'comment'];
	  }

	  increments(options = { primaryKey: true }) {
	    createAutoIncrementTriggerAndSequence(this);
	    return (
	      'integer not null' +
	      (this.tableCompiler._canBeAddPrimaryKey(options) ? ' primary key' : '')
	    );
	  }

	  bigincrements(options = { primaryKey: true }) {
	    createAutoIncrementTriggerAndSequence(this);
	    return (
	      'number(20, 0) not null' +
	      (this.tableCompiler._canBeAddPrimaryKey(options) ? ' primary key' : '')
	    );
	  }

	  floating(precision) {
	    const parsedPrecision = toNumber(precision, 0);
	    return `float${parsedPrecision ? `(${parsedPrecision})` : ''}`;
	  }

	  double(precision, scale) {
	    // if (!precision) return 'number'; // TODO: Check If default is ok
	    return `number(${toNumber(precision, 8)}, ${toNumber(scale, 2)})`;
	  }

	  decimal(precision, scale) {
	    if (precision === null) return 'decimal';
	    return `decimal(${toNumber(precision, 8)}, ${toNumber(scale, 2)})`;
	  }

	  integer(length) {
	    return length ? `number(${toNumber(length, 11)})` : 'integer';
	  }

	  enu(allowed) {
	    allowed = uniq(allowed);
	    const maxLength = (allowed || []).reduce(
	      (maxLength, name) => Math.max(maxLength, String(name).length),
	      1
	    );

	    // implicitly add the enum values as checked values
	    this.columnBuilder._modifiers.checkIn = [allowed];

	    return `varchar2(${maxLength})`;
	  }

	  datetime(without) {
	    return without ? 'timestamp' : 'timestamp with time zone';
	  }

	  timestamp(without) {
	    return without ? 'timestamp' : 'timestamp with time zone';
	  }

	  bool() {
	    // implicitly add the check for 0 and 1
	    this.columnBuilder._modifiers.checkIn = [[0, 1]];
	    return 'number(1, 0)';
	  }

	  varchar(length) {
	    return `varchar2(${toNumber(length, 255)})`;
	  }

	  // Modifiers
	  // ------

	  comment(comment) {
	    const columnName = this.args[0] || this.defaults('columnName');

	    this.pushAdditional(function () {
	      this.pushQuery(
	        `comment on column ${this.tableCompiler.tableName()}.` +
	          this.formatter.wrap(columnName) +
	          " is '" +
	          (comment || '') +
	          "'"
	      );
	    }, comment);
	  }

	  checkIn(value) {
	    // TODO: Maybe accept arguments also as array
	    // TODO: value(s) should be escaped properly
	    if (value === undefined) {
	      return '';
	    } else if (value instanceof Raw) {
	      value = value.toQuery();
	    } else if (Array.isArray(value)) {
	      value = value.map((v) => `'${v}'`).join(', ');
	    } else {
	      value = `'${value}'`;
	    }
	    return `check (${this.formatter.wrap(this.args[0])} in (${value}))`;
	  }
	}

	ColumnCompiler_Oracle.prototype.tinyint = 'smallint';
	ColumnCompiler_Oracle.prototype.smallint = 'smallint';
	ColumnCompiler_Oracle.prototype.mediumint = 'integer';
	ColumnCompiler_Oracle.prototype.biginteger = 'number(20, 0)';
	ColumnCompiler_Oracle.prototype.text = 'clob';
	ColumnCompiler_Oracle.prototype.time = 'timestamp with time zone';
	ColumnCompiler_Oracle.prototype.bit = 'clob';
	ColumnCompiler_Oracle.prototype.json = 'clob';

	oracleColumncompiler = ColumnCompiler_Oracle;
	return oracleColumncompiler;
}

/* eslint max-len:0 */

var oracleTablecompiler;
var hasRequiredOracleTablecompiler;

function requireOracleTablecompiler () {
	if (hasRequiredOracleTablecompiler) return oracleTablecompiler;
	hasRequiredOracleTablecompiler = 1;
	const utils = /*@__PURE__*/ requireUtils$1();
	const TableCompiler = tablecompiler;
	const helpers = helpers$7;
	const Trigger = /*@__PURE__*/ requireTrigger();
	const { isObject } = is;

	// Table Compiler
	// ------

	class TableCompiler_Oracle extends TableCompiler {
	  constructor() {
	    super(...arguments);
	  }

	  addColumns(columns, prefix) {
	    if (columns.sql.length > 0) {
	      prefix = prefix || this.addColumnsPrefix;

	      const columnSql = columns.sql;
	      const alter = this.lowerCase ? 'alter table ' : 'ALTER TABLE ';

	      let sql = `${alter}${this.tableName()} ${prefix}`;
	      if (columns.sql.length > 1) {
	        sql += `(${columnSql.join(', ')})`;
	      } else {
	        sql += columnSql.join(', ');
	      }

	      this.pushQuery({
	        sql,
	        bindings: columns.bindings,
	      });
	    }
	  }

	  // Compile a rename column command.
	  renameColumn(from, to) {
	    // Remove quotes around tableName
	    const tableName = this.tableName().slice(1, -1);
	    const trigger = new Trigger(this.client.version);
	    return this.pushQuery(
	      trigger.renameColumnTrigger(this.client.logger, tableName, from, to)
	    );
	  }

	  compileAdd(builder) {
	    const table = this.formatter.wrap(builder);
	    const columns = this.prefixArray('add column', this.getColumns(builder));
	    return this.pushQuery({
	      sql: `alter table ${table} ${columns.join(', ')}`,
	    });
	  }

	  // Adds the "create" query to the query sequence.
	  createQuery(columns, ifNot, like) {
	    const columnsSql =
	      like && this.tableNameLike()
	        ? ' as (select * from ' + this.tableNameLike() + ' where 0=1)'
	        : ' (' + columns.sql.join(', ') + this._addChecks() + ')';
	    const sql = `create table ${this.tableName()}${columnsSql}`;

	    this.pushQuery({
	      // catch "name is already used by an existing object" for workaround for "if not exists"
	      sql: ifNot ? utils.wrapSqlWithCatch(sql, -955) : sql,
	      bindings: columns.bindings,
	    });
	    if (this.single.comment) this.comment(this.single.comment);
	    if (like) {
	      this.addColumns(columns, this.addColumnsPrefix);
	    }
	  }

	  // Compiles the comment on the table.
	  comment(comment) {
	    this.pushQuery(`comment on table ${this.tableName()} is '${comment}'`);
	  }

	  dropColumn() {
	    const columns = helpers.normalizeArr.apply(null, arguments);
	    this.pushQuery(
	      `alter table ${this.tableName()} drop (${this.formatter.columnize(
	        columns
	      )})`
	    );
	  }

	  _indexCommand(type, tableName, columns) {
	    const nameHelper = new utils.NameHelper(this.client.version);
	    return this.formatter.wrap(
	      nameHelper.generateCombinedName(
	        this.client.logger,
	        type,
	        tableName,
	        columns
	      )
	    );
	  }

	  primary(columns, constraintName) {
	    let deferrable;
	    if (isObject(constraintName)) {
	      ({ constraintName, deferrable } = constraintName);
	    }
	    deferrable = deferrable ? ` deferrable initially ${deferrable}` : '';
	    constraintName = constraintName
	      ? this.formatter.wrap(constraintName)
	      : this.formatter.wrap(`${this.tableNameRaw}_pkey`);
	    const primaryCols = columns;
	    let incrementsCols = [];
	    if (this.grouped.columns) {
	      incrementsCols = this._getIncrementsColumnNames();
	      if (incrementsCols) {
	        incrementsCols.forEach((c) => {
	          if (!primaryCols.includes(c)) {
	            primaryCols.unshift(c);
	          }
	        });
	      }
	    }
	    this.pushQuery(
	      `alter table ${this.tableName()} add constraint ${constraintName} primary key (${this.formatter.columnize(
	        primaryCols
	      )})${deferrable}`
	    );
	  }

	  dropPrimary(constraintName) {
	    constraintName = constraintName
	      ? this.formatter.wrap(constraintName)
	      : this.formatter.wrap(this.tableNameRaw + '_pkey');
	    this.pushQuery(
	      `alter table ${this.tableName()} drop constraint ${constraintName}`
	    );
	  }

	  index(columns, indexName) {
	    indexName = indexName
	      ? this.formatter.wrap(indexName)
	      : this._indexCommand('index', this.tableNameRaw, columns);
	    this.pushQuery(
	      `create index ${indexName} on ${this.tableName()}` +
	        ' (' +
	        this.formatter.columnize(columns) +
	        ')'
	    );
	  }

	  dropIndex(columns, indexName) {
	    indexName = indexName
	      ? this.formatter.wrap(indexName)
	      : this._indexCommand('index', this.tableNameRaw, columns);
	    this.pushQuery(`drop index ${indexName}`);
	  }

	  unique(columns, indexName) {
	    let deferrable;
	    if (isObject(indexName)) {
	      ({ indexName, deferrable } = indexName);
	    }
	    deferrable = deferrable ? ` deferrable initially ${deferrable}` : '';
	    indexName = indexName
	      ? this.formatter.wrap(indexName)
	      : this._indexCommand('unique', this.tableNameRaw, columns);
	    this.pushQuery(
	      `alter table ${this.tableName()} add constraint ${indexName}` +
	        ' unique (' +
	        this.formatter.columnize(columns) +
	        ')' +
	        deferrable
	    );
	  }

	  dropUnique(columns, indexName) {
	    indexName = indexName
	      ? this.formatter.wrap(indexName)
	      : this._indexCommand('unique', this.tableNameRaw, columns);
	    this.pushQuery(
	      `alter table ${this.tableName()} drop constraint ${indexName}`
	    );
	  }

	  dropForeign(columns, indexName) {
	    indexName = indexName
	      ? this.formatter.wrap(indexName)
	      : this._indexCommand('foreign', this.tableNameRaw, columns);
	    this.pushQuery(
	      `alter table ${this.tableName()} drop constraint ${indexName}`
	    );
	  }
	}

	TableCompiler_Oracle.prototype.addColumnsPrefix = 'add ';
	TableCompiler_Oracle.prototype.alterColumnsPrefix = 'modify ';

	oracleTablecompiler = TableCompiler_Oracle;
	return oracleTablecompiler;
}

var oracle;
var hasRequiredOracle;

function requireOracle () {
	if (hasRequiredOracle) return oracle;
	hasRequiredOracle = 1;
	// Oracle Client
	// -------
	const { ReturningHelper } = /*@__PURE__*/ requireUtils$1();
	const { isConnectionError } = /*@__PURE__*/ requireUtils$1();
	const Client = client$2;
	const SchemaCompiler = /*@__PURE__*/ requireOracleCompiler();
	const ColumnBuilder = /*@__PURE__*/ requireOracleColumnbuilder();
	const ColumnCompiler = /*@__PURE__*/ requireOracleColumncompiler();
	const TableCompiler = /*@__PURE__*/ requireOracleTablecompiler();

	// Always initialize with the "QueryBuilder" and "QueryCompiler"
	// objects, which extend the base 'lib/query/builder' and
	// 'lib/query/compiler', respectively.
	class Client_Oracle extends Client {
	  schemaCompiler() {
	    return new SchemaCompiler(this, ...arguments);
	  }

	  columnBuilder() {
	    return new ColumnBuilder(this, ...arguments);
	  }

	  columnCompiler() {
	    return new ColumnCompiler(this, ...arguments);
	  }

	  tableCompiler() {
	    return new TableCompiler(this, ...arguments);
	  }

	  // Return the database for the Oracle client.
	  database() {
	    return this.connectionSettings.database;
	  }

	  // Position the bindings for the query.
	  positionBindings(sql) {
	    let questionCount = 0;
	    return sql.replace(/\?/g, function () {
	      questionCount += 1;
	      return `:${questionCount}`;
	    });
	  }

	  _stream(connection, obj, stream, options) {
	    if (!obj.sql) throw new Error('The query is empty');

	    return new Promise(function (resolver, rejecter) {
	      stream.on('error', (err) => {
	        if (isConnectionError(err)) {
	          connection.__knex__disposed = err;
	        }
	        rejecter(err);
	      });
	      stream.on('end', resolver);
	      const queryStream = connection.queryStream(
	        obj.sql,
	        obj.bindings,
	        options
	      );
	      queryStream.pipe(stream);
	      queryStream.on('error', function (error) {
	        rejecter(error);
	        stream.emit('error', error);
	      });
	    });
	  }

	  // Formatter part

	  alias(first, second) {
	    return first + ' ' + second;
	  }

	  parameter(value, builder, formatter) {
	    // Returning helper uses always ROWID as string
	    if (value instanceof ReturningHelper && this.driver) {
	      value = new this.driver.OutParam(this.driver.OCCISTRING);
	    } else if (typeof value === 'boolean') {
	      value = value ? 1 : 0;
	    }
	    return super.parameter(value, builder, formatter);
	  }
	}

	Object.assign(Client_Oracle.prototype, {
	  dialect: 'oracle',

	  driverName: 'oracle',
	});

	oracle = Client_Oracle;
	return oracle;
}

/* eslint max-len:0 */

var oracleQuerycompiler;
var hasRequiredOracleQuerycompiler;

function requireOracleQuerycompiler () {
	if (hasRequiredOracleQuerycompiler) return oracleQuerycompiler;
	hasRequiredOracleQuerycompiler = 1;
	// Oracle Query Builder & Compiler
	// ------
	const compact = require$$0$9;
	const identity = require$$2$4;
	const isEmpty = require$$2$8;
	const isPlainObject = require$$3$3;
	const reduce = require$$4$1;
	const QueryCompiler = querycompiler;
	const { ReturningHelper } = /*@__PURE__*/ requireUtils$1();
	const { isString } = is;

	const components = [
	  'comments',
	  'columns',
	  'join',
	  'where',
	  'union',
	  'group',
	  'having',
	  'order',
	  'lock',
	];

	// Query Compiler
	// -------

	// Set the "Formatter" to use for the queries,
	// ensuring that all parameterized values (even across sub-queries)
	// are properly built into the same query.
	class QueryCompiler_Oracle extends QueryCompiler {
	  constructor(client, builder, formatter) {
	    super(client, builder, formatter);

	    const { onConflict } = this.single;
	    if (onConflict) {
	      throw new Error('.onConflict() is not supported for oracledb.');
	    }

	    // Compiles the `select` statement, or nested sub-selects
	    // by calling each of the component compilers, trimming out
	    // the empties, and returning a generated query string.
	    this.first = this.select;
	  }

	  // Compiles an "insert" query, allowing for multiple
	  // inserts using a single query statement.
	  insert() {
	    let insertValues = this.single.insert || [];
	    let { returning } = this.single;

	    if (!Array.isArray(insertValues) && isPlainObject(this.single.insert)) {
	      insertValues = [this.single.insert];
	    }

	    // always wrap returning argument in array
	    if (returning && !Array.isArray(returning)) {
	      returning = [returning];
	    }

	    if (
	      Array.isArray(insertValues) &&
	      insertValues.length === 1 &&
	      isEmpty(insertValues[0])
	    ) {
	      return this._addReturningToSqlAndConvert(
	        `insert into ${this.tableName} (${this.formatter.wrap(
	          this.single.returning
	        )}) values (default)`,
	        returning,
	        this.tableName
	      );
	    }

	    if (
	      isEmpty(this.single.insert) &&
	      typeof this.single.insert !== 'function'
	    ) {
	      return '';
	    }

	    const insertData = this._prepInsert(insertValues);

	    const sql = {};

	    if (isString(insertData)) {
	      return this._addReturningToSqlAndConvert(
	        `insert into ${this.tableName} ${insertData}`,
	        returning
	      );
	    }

	    if (insertData.values.length === 1) {
	      return this._addReturningToSqlAndConvert(
	        `insert into ${this.tableName} (${this.formatter.columnize(
	          insertData.columns
	        )}) values (${this.client.parameterize(
	          insertData.values[0],
	          undefined,
	          this.builder,
	          this.bindingsHolder
	        )})`,
	        returning,
	        this.tableName
	      );
	    }

	    const insertDefaultsOnly = insertData.columns.length === 0;

	    sql.sql =
	      'begin ' +
	      insertData.values
	        .map((value) => {
	          let returningHelper;
	          const parameterizedValues = !insertDefaultsOnly
	            ? this.client.parameterize(
	                value,
	                this.client.valueForUndefined,
	                this.builder,
	                this.bindingsHolder
	              )
	            : '';
	          const returningValues = Array.isArray(returning)
	            ? returning
	            : [returning];
	          let subSql = `insert into ${this.tableName} `;

	          if (returning) {
	            returningHelper = new ReturningHelper(returningValues.join(':'));
	            sql.outParams = (sql.outParams || []).concat(returningHelper);
	          }

	          if (insertDefaultsOnly) {
	            // no columns given so only the default value
	            subSql += `(${this.formatter.wrap(
	              this.single.returning
	            )}) values (default)`;
	          } else {
	            subSql += `(${this.formatter.columnize(
	              insertData.columns
	            )}) values (${parameterizedValues})`;
	          }
	          subSql += returning
	            ? ` returning ROWID into ${this.client.parameter(
	                returningHelper,
	                this.builder,
	                this.bindingsHolder
	              )}`
	            : '';

	          // pre bind position because subSql is an execute immediate parameter
	          // later position binding will only convert the ? params

	          subSql = this.formatter.client.positionBindings(subSql);

	          const parameterizedValuesWithoutDefault = parameterizedValues
	            .replace('DEFAULT, ', '')
	            .replace(', DEFAULT', '');
	          return (
	            `execute immediate '${subSql.replace(/'/g, "''")}` +
	            (parameterizedValuesWithoutDefault || returning ? "' using " : '') +
	            parameterizedValuesWithoutDefault +
	            (parameterizedValuesWithoutDefault && returning ? ', ' : '') +
	            (returning ? 'out ?' : '') +
	            ';'
	          );
	        })
	        .join(' ') +
	      'end;';

	    if (returning) {
	      sql.returning = returning;
	      // generate select statement with special order by to keep the order because 'in (..)' may change the order
	      sql.returningSql =
	        `select ${this.formatter.columnize(returning)}` +
	        ' from ' +
	        this.tableName +
	        ' where ROWID in (' +
	        sql.outParams.map((v, i) => `:${i + 1}`).join(', ') +
	        ')' +
	        ' order by case ROWID ' +
	        sql.outParams
	          .map((v, i) => `when CHARTOROWID(:${i + 1}) then ${i}`)
	          .join(' ') +
	        ' end';
	    }

	    return sql;
	  }

	  // Update method, including joins, wheres, order & limits.
	  update() {
	    const updates = this._prepUpdate(this.single.update);
	    const where = this.where();
	    let { returning } = this.single;
	    const sql =
	      `update ${this.tableName}` +
	      ' set ' +
	      updates.join(', ') +
	      (where ? ` ${where}` : '');

	    if (!returning) {
	      return sql;
	    }

	    // always wrap returning argument in array
	    if (!Array.isArray(returning)) {
	      returning = [returning];
	    }

	    return this._addReturningToSqlAndConvert(sql, returning, this.tableName);
	  }

	  // Compiles a `truncate` query.
	  truncate() {
	    return `truncate table ${this.tableName}`;
	  }

	  forUpdate() {
	    return 'for update';
	  }

	  forShare() {
	    // lock for share is not directly supported by oracle
	    // use LOCK TABLE .. IN SHARE MODE; instead
	    this.client.logger.warn(
	      'lock for share is not supported by oracle dialect'
	    );
	    return '';
	  }

	  // Compiles a `columnInfo` query.
	  columnInfo() {
	    const column = this.single.columnInfo;

	    // The user may have specified a custom wrapIdentifier function in the config. We
	    // need to run the identifiers through that function, but not format them as
	    // identifiers otherwise.
	    const table = this.client.customWrapIdentifier(this.single.table, identity);

	    // Node oracle drivers doesn't support LONG type (which is data_default type)
	    const sql = `select * from xmltable( '/ROWSET/ROW'
      passing dbms_xmlgen.getXMLType('
      select char_col_decl_length, column_name, data_type, data_default, nullable
      from all_tab_columns where table_name = ''${table}'' ')
      columns
      CHAR_COL_DECL_LENGTH number, COLUMN_NAME varchar2(200), DATA_TYPE varchar2(106),
      DATA_DEFAULT clob, NULLABLE varchar2(1))`;

	    return {
	      sql: sql,
	      output(resp) {
	        const out = reduce(
	          resp,
	          function (columns, val) {
	            columns[val.COLUMN_NAME] = {
	              type: val.DATA_TYPE,
	              defaultValue: val.DATA_DEFAULT,
	              maxLength: val.CHAR_COL_DECL_LENGTH,
	              nullable: val.NULLABLE === 'Y',
	            };
	            return columns;
	          },
	          {}
	        );
	        return (column && out[column]) || out;
	      },
	    };
	  }

	  select() {
	    let query = this.with();
	    const statements = components.map((component) => {
	      return this[component]();
	    });
	    query += compact(statements).join(' ');
	    return this._surroundQueryWithLimitAndOffset(query);
	  }

	  aggregate(stmt) {
	    return this._aggregate(stmt, { aliasSeparator: ' ' });
	  }

	  // for single commands only
	  _addReturningToSqlAndConvert(sql, returning, tableName) {
	    const res = {
	      sql,
	    };

	    if (!returning) {
	      return res;
	    }

	    const returningValues = Array.isArray(returning) ? returning : [returning];
	    const returningHelper = new ReturningHelper(returningValues.join(':'));
	    res.sql =
	      sql +
	      ' returning ROWID into ' +
	      this.client.parameter(returningHelper, this.builder, this.bindingsHolder);
	    res.returningSql = `select ${this.formatter.columnize(
	      returning
	    )} from ${tableName} where ROWID = :1`;
	    res.outParams = [returningHelper];
	    res.returning = returning;
	    return res;
	  }

	  _surroundQueryWithLimitAndOffset(query) {
	    let { limit } = this.single;
	    const { offset } = this.single;
	    const hasLimit = limit || limit === 0 || limit === '0';
	    limit = +limit;

	    if (!hasLimit && !offset) return query;
	    query = query || '';

	    if (hasLimit && !offset) {
	      return `select * from (${query}) where rownum <= ${this._getValueOrParameterFromAttribute(
	        'limit',
	        limit
	      )}`;
	    }

	    const endRow = +offset + (hasLimit ? limit : 10000000000000);

	    return (
	      'select * from ' +
	      '(select row_.*, ROWNUM rownum_ from (' +
	      query +
	      ') row_ ' +
	      'where rownum <= ' +
	      (this.single.skipBinding['offset']
	        ? endRow
	        : this.client.parameter(endRow, this.builder, this.bindingsHolder)) +
	      ') ' +
	      'where rownum_ > ' +
	      this._getValueOrParameterFromAttribute('offset', offset)
	    );
	  }
	}

	oracleQuerycompiler = QueryCompiler_Oracle;
	return oracleQuerycompiler;
}

const require$$16 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(oracledb$1);

var utils;
var hasRequiredUtils;

function requireUtils () {
	if (hasRequiredUtils) return utils;
	hasRequiredUtils = 1;
	const Utils = /*@__PURE__*/ requireUtils$1();
	const { promisify } = require$$1$e;
	const stream = require$$2$a;

	function BlobHelper(columnName, value) {
	  this.columnName = columnName;
	  this.value = value;
	  this.returning = false;
	}

	BlobHelper.prototype.toString = function () {
	  return '[object BlobHelper:' + this.columnName + ']';
	};

	/**
	 * @param stream
	 * @param {'string' | 'buffer'} type
	 */
	function readStream(stream, type) {
	  return new Promise((resolve, reject) => {
	    let data = type === 'string' ? '' : Buffer.alloc(0);

	    stream.on('error', function (err) {
	      reject(err);
	    });
	    stream.on('data', function (chunk) {
	      if (type === 'string') {
	        data += chunk;
	      } else {
	        data = Buffer.concat([data, chunk]);
	      }
	    });
	    stream.on('end', function () {
	      resolve(data);
	    });
	  });
	}

	const lobProcessing = function (stream) {
	  const oracledb = require$$16;

	  /**
	   * @type 'string' | 'buffer'
	   */
	  let type;

	  if (stream.type) {
	    // v1.2-v4
	    if (stream.type === oracledb.BLOB) {
	      type = 'buffer';
	    } else if (stream.type === oracledb.CLOB) {
	      type = 'string';
	    }
	  } else if (stream.iLob) {
	    // v1
	    if (stream.iLob.type === oracledb.CLOB) {
	      type = 'string';
	    } else if (stream.iLob.type === oracledb.BLOB) {
	      type = 'buffer';
	    }
	  } else {
	    throw new Error('Unrecognized oracledb lob stream type');
	  }
	  if (type === 'string') {
	    stream.setEncoding('utf-8');
	  }
	  return readStream(stream, type);
	};

	function monkeyPatchConnection(connection, client) {
	  // Connection is already monkey-patched
	  if (connection.executeAsync) {
	    return;
	  }

	  connection.commitAsync = function () {
	    return new Promise((commitResolve, commitReject) => {
	      this.commit(function (err) {
	        if (err) {
	          return commitReject(err);
	        }
	        commitResolve();
	      });
	    });
	  };
	  connection.rollbackAsync = function () {
	    return new Promise((rollbackResolve, rollbackReject) => {
	      this.rollback(function (err) {
	        if (err) {
	          return rollbackReject(err);
	        }
	        rollbackResolve();
	      });
	    });
	  };
	  const fetchAsync = promisify(function (sql, bindParams, options, cb) {
	    options = options || {};
	    options.outFormat = client.driver.OUT_FORMAT_OBJECT || client.driver.OBJECT;
	    if (!options.outFormat) {
	      throw new Error('not found oracledb.outFormat constants');
	    }
	    if (options.resultSet) {
	      connection.execute(
	        sql,
	        bindParams || [],
	        options,
	        function (err, result) {
	          if (err) {
	            if (Utils.isConnectionError(err)) {
	              connection.close().catch(function (err) {});
	              connection.__knex__disposed = err;
	            }
	            return cb(err);
	          }
	          const fetchResult = { rows: [], resultSet: result.resultSet };
	          const numRows = 100;
	          const fetchRowsFromRS = function (connection, resultSet, numRows) {
	            resultSet.getRows(numRows, function (err, rows) {
	              if (err) {
	                if (Utils.isConnectionError(err)) {
	                  connection.close().catch(function (err) {});
	                  connection.__knex__disposed = err;
	                }
	                resultSet.close(function () {
	                  return cb(err);
	                });
	              } else if (rows.length === 0) {
	                return cb(null, fetchResult);
	              } else if (rows.length > 0) {
	                if (rows.length === numRows) {
	                  fetchResult.rows = fetchResult.rows.concat(rows);
	                  fetchRowsFromRS(connection, resultSet, numRows);
	                } else {
	                  fetchResult.rows = fetchResult.rows.concat(rows);
	                  return cb(null, fetchResult);
	                }
	              }
	            });
	          };
	          fetchRowsFromRS(connection, result.resultSet, numRows);
	        }
	      );
	    } else {
	      connection.execute(
	        sql,
	        bindParams || [],
	        options,
	        function (err, result) {
	          if (err) {
	            // dispose the connection on connection error
	            if (Utils.isConnectionError(err)) {
	              connection.close().catch(function (err) {});
	              connection.__knex__disposed = err;
	            }
	            return cb(err);
	          }

	          return cb(null, result);
	        }
	      );
	    }
	  });
	  connection.executeAsync = function (sql, bindParams, options) {
	    // Read all lob
	    return fetchAsync(sql, bindParams, options).then(async (results) => {
	      const closeResultSet = () => {
	        return results.resultSet
	          ? promisify(results.resultSet.close).call(results.resultSet)
	          : Promise.resolve();
	      };

	      // Collect LOBs to read
	      const lobs = [];
	      if (results.rows) {
	        if (Array.isArray(results.rows)) {
	          for (let i = 0; i < results.rows.length; i++) {
	            // Iterate through the rows
	            const row = results.rows[i];
	            for (const column in row) {
	              if (row[column] instanceof stream.Readable) {
	                lobs.push({ index: i, key: column, stream: row[column] });
	              }
	            }
	          }
	        }
	      }

	      try {
	        for (const lob of lobs) {
	          // todo should be fetchAsString/fetchAsBuffer polyfill only
	          results.rows[lob.index][lob.key] = await lobProcessing(lob.stream);
	        }
	      } catch (e) {
	        await closeResultSet().catch(() => {});

	        throw e;
	      }

	      await closeResultSet();

	      return results;
	    });
	  };
	}

	Utils.BlobHelper = BlobHelper;
	Utils.monkeyPatchConnection = monkeyPatchConnection;
	utils = Utils;
	return utils;
}

var oracledbQuerycompiler;
var hasRequiredOracledbQuerycompiler;

function requireOracledbQuerycompiler () {
	if (hasRequiredOracledbQuerycompiler) return oracledbQuerycompiler;
	hasRequiredOracledbQuerycompiler = 1;
	const clone = require$$0$c;
	const each = require$$0$b;
	const isEmpty = require$$2$8;
	const isPlainObject = require$$3$3;
	const Oracle_Compiler = /*@__PURE__*/ requireOracleQuerycompiler();
	const ReturningHelper = /*@__PURE__*/ requireUtils().ReturningHelper;
	const BlobHelper = /*@__PURE__*/ requireUtils().BlobHelper;
	const { isString } = is;
	const {
	  columnize: columnize_,
	} = wrappingFormatter;

	class Oracledb_Compiler extends Oracle_Compiler {
	  // Compiles an "insert" query, allowing for multiple
	  // inserts using a single query statement.
	  insert() {
	    const self = this;
	    const outBindPrep = this._prepOutbindings(
	      this.single.insert,
	      this.single.returning
	    );
	    const outBinding = outBindPrep.outBinding;
	    const returning = outBindPrep.returning;
	    const insertValues = outBindPrep.values;

	    if (
	      Array.isArray(insertValues) &&
	      insertValues.length === 1 &&
	      isEmpty(insertValues[0])
	    ) {
	      const returningFragment = this.single.returning
	        ? ' (' + this.formatter.wrap(this.single.returning) + ')'
	        : '';

	      return this._addReturningToSqlAndConvert(
	        'insert into ' +
	          this.tableName +
	          returningFragment +
	          ' values (default)',
	        outBinding[0],
	        this.tableName,
	        returning
	      );
	    }

	    if (
	      isEmpty(this.single.insert) &&
	      typeof this.single.insert !== 'function'
	    ) {
	      return '';
	    }

	    const insertData = this._prepInsert(insertValues);

	    const sql = {};

	    if (isString(insertData)) {
	      return this._addReturningToSqlAndConvert(
	        'insert into ' + this.tableName + ' ' + insertData,
	        outBinding[0],
	        this.tableName,
	        returning
	      );
	    }

	    if (insertData.values.length === 1) {
	      return this._addReturningToSqlAndConvert(
	        'insert into ' +
	          this.tableName +
	          ' (' +
	          this.formatter.columnize(insertData.columns) +
	          ') values (' +
	          this.client.parameterize(
	            insertData.values[0],
	            undefined,
	            this.builder,
	            this.bindingsHolder
	          ) +
	          ')',
	        outBinding[0],
	        this.tableName,
	        returning
	      );
	    }

	    const insertDefaultsOnly = insertData.columns.length === 0;
	    sql.returning = returning;
	    sql.sql =
	      'begin ' +
	      insertData.values
	        .map(function (value, index) {
	          const parameterizedValues = !insertDefaultsOnly
	            ? self.client.parameterize(
	                value,
	                self.client.valueForUndefined,
	                self.builder,
	                self.bindingsHolder
	              )
	            : '';
	          let subSql = 'insert into ' + self.tableName;

	          if (insertDefaultsOnly) {
	            // No columns given so only the default value
	            subSql +=
	              ' (' +
	              self.formatter.wrap(self.single.returning) +
	              ') values (default)';
	          } else {
	            subSql +=
	              ' (' +
	              self.formatter.columnize(insertData.columns) +
	              ') values (' +
	              parameterizedValues +
	              ')';
	          }

	          let returningClause = '';
	          let intoClause = '';
	          // ToDo review if this code is still needed or could be dropped
	          // eslint-disable-next-line no-unused-vars
	          let usingClause = '';
	          let outClause = '';

	          each(value, function (val) {
	            if (!(val instanceof BlobHelper)) {
	              usingClause += ' ?,';
	            }
	          });
	          // eslint-disable-next-line no-unused-vars
	          usingClause = usingClause.slice(0, -1);

	          // Build returning and into clauses
	          outBinding[index].forEach(function (ret) {
	            const columnName = ret.columnName || ret;
	            returningClause += self.formatter.wrap(columnName) + ',';
	            intoClause += ' ?,';
	            outClause += ' out ?,';

	            // Add Helpers to bindings
	            if (ret instanceof BlobHelper) {
	              return self.formatter.bindings.push(ret);
	            }
	            self.formatter.bindings.push(new ReturningHelper(columnName));
	          });

	          // Strip last comma
	          returningClause = returningClause.slice(0, -1);
	          intoClause = intoClause.slice(0, -1);
	          outClause = outClause.slice(0, -1);

	          if (returningClause && intoClause) {
	            subSql += ' returning ' + returningClause + ' into' + intoClause;
	          }

	          // Pre bind position because subSql is an execute immediate parameter
	          // later position binding will only convert the ? params
	          subSql = self.formatter.client.positionBindings(subSql);
	          const parameterizedValuesWithoutDefaultAndBlob = parameterizedValues
	            .replace(/DEFAULT, /g, '')
	            .replace(/, DEFAULT/g, '')
	            .replace('EMPTY_BLOB(), ', '')
	            .replace(', EMPTY_BLOB()', '');
	          return (
	            "execute immediate '" +
	            subSql.replace(/'/g, "''") +
	            (parameterizedValuesWithoutDefaultAndBlob || value
	              ? "' using "
	              : '') +
	            parameterizedValuesWithoutDefaultAndBlob +
	            (parameterizedValuesWithoutDefaultAndBlob && outClause ? ',' : '') +
	            outClause +
	            ';'
	          );
	        })
	        .join(' ') +
	      'end;';

	    sql.outBinding = outBinding;
	    if (returning[0] === '*') {
	      // Generate select statement with special order by
	      // to keep the order because 'in (..)' may change the order
	      sql.returningSql = function () {
	        return (
	          'select * from ' +
	          self.tableName +
	          ' where ROWID in (' +
	          this.outBinding
	            .map(function (v, i) {
	              return ':' + (i + 1);
	            })
	            .join(', ') +
	          ')' +
	          ' order by case ROWID ' +
	          this.outBinding
	            .map(function (v, i) {
	              return 'when CHARTOROWID(:' + (i + 1) + ') then ' + i;
	            })
	            .join(' ') +
	          ' end'
	        );
	      };
	    }

	    return sql;
	  }

	  with() {
	    // WITH RECURSIVE is a syntax error in Oracle SQL.
	    // So mark all statements as non-recursive, generate the SQL, then restore.
	    // This approach ensures any changes in base class with() get propagated here.
	    const undoList = [];
	    if (this.grouped.with) {
	      for (const stmt of this.grouped.with) {
	        if (stmt.recursive) {
	          undoList.push(stmt);
	          stmt.recursive = false;
	        }
	      }
	    }

	    const result = super.with();

	    // Restore the recursive markings, in case this same query gets cloned and passed to other drivers.
	    for (const stmt of undoList) {
	      stmt.recursive = true;
	    }
	    return result;
	  }

	  _addReturningToSqlAndConvert(sql, outBinding, tableName, returning) {
	    const self = this;
	    const res = {
	      sql: sql,
	    };

	    if (!outBinding) {
	      return res;
	    }
	    const returningValues = Array.isArray(outBinding)
	      ? outBinding
	      : [outBinding];
	    let returningClause = '';
	    let intoClause = '';
	    // Build returning and into clauses
	    returningValues.forEach(function (ret) {
	      const columnName = ret.columnName || ret;
	      returningClause += self.formatter.wrap(columnName) + ',';
	      intoClause += '?,';

	      // Add Helpers to bindings
	      if (ret instanceof BlobHelper) {
	        return self.formatter.bindings.push(ret);
	      }
	      self.formatter.bindings.push(new ReturningHelper(columnName));
	    });
	    res.sql = sql;

	    // Strip last comma
	    returningClause = returningClause.slice(0, -1);
	    intoClause = intoClause.slice(0, -1);
	    if (returningClause && intoClause) {
	      res.sql += ' returning ' + returningClause + ' into ' + intoClause;
	    }
	    res.outBinding = [outBinding];
	    if (returning[0] === '*') {
	      res.returningSql = function () {
	        return 'select * from ' + self.tableName + ' where ROWID = :1';
	      };
	    }
	    res.returning = returning;

	    return res;
	  }

	  _prepOutbindings(paramValues, paramReturning) {
	    const result = {};
	    let params = paramValues || [];
	    let returning = paramReturning || [];
	    if (!Array.isArray(params) && isPlainObject(paramValues)) {
	      params = [params];
	    }
	    // Always wrap returning argument in array
	    if (returning && !Array.isArray(returning)) {
	      returning = [returning];
	    }

	    const outBinding = [];
	    // Handle Buffer value as Blob
	    each(params, function (values, index) {
	      if (returning[0] === '*') {
	        outBinding[index] = ['ROWID'];
	      } else {
	        outBinding[index] = clone(returning);
	      }
	      each(values, function (value, key) {
	        if (value instanceof Buffer) {
	          values[key] = new BlobHelper(key, value);

	          // Delete blob duplicate in returning
	          const blobIndex = outBinding[index].indexOf(key);
	          if (blobIndex >= 0) {
	            outBinding[index].splice(blobIndex, 1);
	            values[key].returning = true;
	          }
	          outBinding[index].push(values[key]);
	        }
	        if (value === undefined) {
	          delete params[index][key];
	        }
	      });
	    });
	    result.returning = returning;
	    result.outBinding = outBinding;
	    result.values = params;
	    return result;
	  }

	  _groupOrder(item, type) {
	    return super._groupOrderNulls(item, type);
	  }

	  update() {
	    const self = this;
	    const sql = {};
	    const outBindPrep = this._prepOutbindings(
	      this.single.update || this.single.counter,
	      this.single.returning
	    );
	    const outBinding = outBindPrep.outBinding;
	    const returning = outBindPrep.returning;

	    const updates = this._prepUpdate(this.single.update);
	    const where = this.where();

	    let returningClause = '';
	    let intoClause = '';

	    if (isEmpty(updates) && typeof this.single.update !== 'function') {
	      return '';
	    }

	    // Build returning and into clauses
	    outBinding.forEach(function (out) {
	      out.forEach(function (ret) {
	        const columnName = ret.columnName || ret;
	        returningClause += self.formatter.wrap(columnName) + ',';
	        intoClause += ' ?,';

	        // Add Helpers to bindings
	        if (ret instanceof BlobHelper) {
	          return self.formatter.bindings.push(ret);
	        }
	        self.formatter.bindings.push(new ReturningHelper(columnName));
	      });
	    });
	    // Strip last comma
	    returningClause = returningClause.slice(0, -1);
	    intoClause = intoClause.slice(0, -1);

	    sql.outBinding = outBinding;
	    sql.returning = returning;
	    sql.sql =
	      'update ' +
	      this.tableName +
	      ' set ' +
	      updates.join(', ') +
	      (where ? ' ' + where : '');
	    if (outBinding.length && !isEmpty(outBinding[0])) {
	      sql.sql += ' returning ' + returningClause + ' into' + intoClause;
	    }
	    if (returning[0] === '*') {
	      sql.returningSql = function () {
	        let sql = 'select * from ' + self.tableName;
	        const modifiedRowsCount = this.rowsAffected.length || this.rowsAffected;
	        let returningSqlIn = ' where ROWID in (';
	        let returningSqlOrderBy = ') order by case ROWID ';

	        // Needs special order by because in(...) change result order
	        for (let i = 0; i < modifiedRowsCount; i++) {
	          if (this.returning[0] === '*') {
	            returningSqlIn += ':' + (i + 1) + ', ';
	            returningSqlOrderBy +=
	              'when CHARTOROWID(:' + (i + 1) + ') then ' + i + ' ';
	          }
	        }
	        if (this.returning[0] === '*') {
	          this.returning = this.returning.slice(0, -1);
	          returningSqlIn = returningSqlIn.slice(0, -2);
	          returningSqlOrderBy = returningSqlOrderBy.slice(0, -1);
	        }
	        return (sql += returningSqlIn + returningSqlOrderBy + ' end');
	      };
	    }

	    return sql;
	  }

	  _jsonPathWrap(extraction) {
	    return `'${extraction.path || extraction[1]}'`;
	  }

	  // Json functions
	  jsonExtract(params) {
	    return this._jsonExtract(
	      params.singleValue ? 'json_value' : 'json_query',
	      params
	    );
	  }

	  jsonSet(params) {
	    return `json_transform(${columnize_(
	      params.column,
	      this.builder,
	      this.client,
	      this.bindingsHolder
	    )}, set ${this.client.parameter(
	      params.path,
	      this.builder,
	      this.bindingsHolder
	    )} = ${this.client.parameter(
	      params.value,
	      this.builder,
	      this.bindingsHolder
	    )})`;
	  }

	  jsonInsert(params) {
	    return `json_transform(${columnize_(
	      params.column,
	      this.builder,
	      this.client,
	      this.bindingsHolder
	    )}, insert ${this.client.parameter(
	      params.path,
	      this.builder,
	      this.bindingsHolder
	    )} = ${this.client.parameter(
	      params.value,
	      this.builder,
	      this.bindingsHolder
	    )})`;
	  }

	  jsonRemove(params) {
	    const jsonCol = `json_transform(${columnize_(
	      params.column,
	      this.builder,
	      this.client,
	      this.bindingsHolder
	    )}, remove ${this.client.parameter(
	      params.path,
	      this.builder,
	      this.bindingsHolder
	    )})`;
	    return params.alias
	      ? this.client.alias(jsonCol, this.formatter.wrap(params.alias))
	      : jsonCol;
	  }

	  whereJsonPath(statement) {
	    return this._whereJsonPath('json_value', statement);
	  }

	  whereJsonSupersetOf(statement) {
	    throw new Error(
	      'Json superset where clause not actually supported by Oracle'
	    );
	  }

	  whereJsonSubsetOf(statement) {
	    throw new Error(
	      'Json subset where clause not actually supported by Oracle'
	    );
	  }

	  onJsonPathEquals(clause) {
	    return this._onJsonPathEquals('json_value', clause);
	  }
	}

	oracledbQuerycompiler = Oracledb_Compiler;
	return oracledbQuerycompiler;
}

var oracledbTablecompiler;
var hasRequiredOracledbTablecompiler;

function requireOracledbTablecompiler () {
	if (hasRequiredOracledbTablecompiler) return oracledbTablecompiler;
	hasRequiredOracledbTablecompiler = 1;
	const TableCompiler_Oracle = /*@__PURE__*/ requireOracleTablecompiler();

	class TableCompiler_Oracledb extends TableCompiler_Oracle {
	  constructor(client, tableBuilder) {
	    super(client, tableBuilder);
	  }

	  _setNullableState(column, isNullable) {
	    const nullability = isNullable ? 'NULL' : 'NOT NULL';
	    const sql = `alter table ${this.tableName()} modify (${this.formatter.wrap(
	      column
	    )} ${nullability})`;
	    return this.pushQuery({
	      sql: sql,
	    });
	  }
	}

	oracledbTablecompiler = TableCompiler_Oracledb;
	return oracledbTablecompiler;
}

var oracledbColumncompiler;
var hasRequiredOracledbColumncompiler;

function requireOracledbColumncompiler () {
	if (hasRequiredOracledbColumncompiler) return oracledbColumncompiler;
	hasRequiredOracledbColumncompiler = 1;
	const ColumnCompiler_Oracle = /*@__PURE__*/ requireOracleColumncompiler();
	const { isObject } = is;

	class ColumnCompiler_Oracledb extends ColumnCompiler_Oracle {
	  constructor() {
	    super(...arguments);
	    this.modifiers = ['defaultTo', 'nullable', 'comment', 'checkJson'];
	    this._addCheckModifiers();
	  }

	  datetime(withoutTz) {
	    let useTz;
	    if (isObject(withoutTz)) {
	      ({ useTz } = withoutTz);
	    } else {
	      useTz = !withoutTz;
	    }
	    return useTz ? 'timestamp with local time zone' : 'timestamp';
	  }

	  timestamp(withoutTz) {
	    let useTz;
	    if (isObject(withoutTz)) {
	      ({ useTz } = withoutTz);
	    } else {
	      useTz = !withoutTz;
	    }
	    return useTz ? 'timestamp with local time zone' : 'timestamp';
	  }

	  checkRegex(regex, constraintName) {
	    return this._check(
	      `REGEXP_LIKE(${this.formatter.wrap(
	        this.getColumnName()
	      )},${this.client._escapeBinding(regex)})`,
	      constraintName
	    );
	  }

	  json() {
	    // implicitly add the check for json
	    this.columnBuilder._modifiers.checkJson = [
	      this.formatter.columnize(this.getColumnName()),
	    ];
	    return 'varchar2(4000)';
	  }

	  jsonb() {
	    return this.json();
	  }

	  checkJson(column) {
	    return `check (${column} is json)`;
	  }
	}

	ColumnCompiler_Oracledb.prototype.time = 'timestamp with local time zone';
	ColumnCompiler_Oracledb.prototype.uuid = ({ useBinaryUuid = false } = {}) =>
	  useBinaryUuid ? 'raw(16)' : 'char(36)';

	oracledbColumncompiler = ColumnCompiler_Oracledb;
	return oracledbColumncompiler;
}

/* eslint max-len: 0 */

var oracledbViewcompiler;
var hasRequiredOracledbViewcompiler;

function requireOracledbViewcompiler () {
	if (hasRequiredOracledbViewcompiler) return oracledbViewcompiler;
	hasRequiredOracledbViewcompiler = 1;
	const ViewCompiler = viewcompiler;

	class ViewCompiler_Oracledb extends ViewCompiler {
	  constructor(client, viewCompiler) {
	    super(client, viewCompiler);
	  }

	  createOrReplace() {
	    this.createQuery(this.columns, this.selectQuery, false, true);
	  }

	  createMaterializedView() {
	    this.createQuery(this.columns, this.selectQuery, true);
	  }
	}

	oracledbViewcompiler = ViewCompiler_Oracledb;
	return oracledbViewcompiler;
}

var oracledbViewbuilder;
var hasRequiredOracledbViewbuilder;

function requireOracledbViewbuilder () {
	if (hasRequiredOracledbViewbuilder) return oracledbViewbuilder;
	hasRequiredOracledbViewbuilder = 1;
	const ViewBuilder = viewbuilder;

	class ViewBuilder_Oracledb extends ViewBuilder {
	  constructor() {
	    super(...arguments);
	  }

	  checkOption() {
	    this._single.checkOption = 'default_option';
	  }
	}

	oracledbViewbuilder = ViewBuilder_Oracledb;
	return oracledbViewbuilder;
}

var transaction$1;
var hasRequiredTransaction$1;

function requireTransaction$1 () {
	if (hasRequiredTransaction$1) return transaction$1;
	hasRequiredTransaction$1 = 1;
	const Transaction = transaction$5;
	const { timeout, KnexTimeoutError } = timeout$3;
	const debugTx = require$$2$9('knex:tx');

	transaction$1 = class Oracle_Transaction extends Transaction {
	  // disable autocommit to allow correct behavior (default is true)
	  begin(conn) {
	    if (this.isolationLevel) {
	      {
	        this.client.logger.warn(
	          'Transaction isolation is not currently supported for Oracle'
	        );
	      }
	    }
	    return Promise.resolve();
	  }

	  async commit(conn, value) {
	    this._completed = true;
	    try {
	      await conn.commitAsync();
	      this._resolver(value);
	    } catch (err) {
	      this._rejecter(err);
	    }
	  }

	  release(conn, value) {
	    return this._resolver(value);
	  }

	  rollback(conn, err) {
	    this._completed = true;
	    debugTx('%s: rolling back', this.txid);
	    return timeout(conn.rollbackAsync(), 5000)
	      .catch((e) => {
	        if (!(e instanceof KnexTimeoutError)) {
	          return Promise.reject(e);
	        }
	        this._rejecter(e);
	      })
	      .then(() => {
	        if (err === undefined) {
	          if (this.doNotRejectOnRollback) {
	            this._resolver();
	            return;
	          }
	          err = new Error(`Transaction rejected with non-error: ${err}`);
	        }
	        this._rejecter(err);
	      });
	  }

	  savepoint(conn) {
	    return this.query(conn, `SAVEPOINT ${this.txid}`);
	  }

	  async acquireConnection(config, cb) {
	    const configConnection = config && config.connection;

	    const connection =
	      configConnection || (await this.client.acquireConnection());
	    try {
	      connection.__knexTxId = this.txid;
	      connection.isTransaction = true;
	      return await cb(connection);
	    } finally {
	      debugTx('%s: releasing connection', this.txid);
	      connection.isTransaction = false;
	      try {
	        await connection.commitAsync();
	      } catch (err) {
	        this._rejecter(err);
	      } finally {
	        if (!configConnection) {
	          await this.client.releaseConnection(connection);
	        } else {
	          debugTx('%s: not releasing external connection', this.txid);
	        }
	      }
	    }
	  }
	};
	return transaction$1;
}

var oracledb;
var hasRequiredOracledb;

function requireOracledb () {
	if (hasRequiredOracledb) return oracledb;
	hasRequiredOracledb = 1;
	// Oracledb Client
	// -------
	const each = require$$0$b;
	const flatten = require$$1$b;
	const isEmpty = require$$2$8;
	const map = require$$1$5;

	const Formatter = formatter;
	const QueryCompiler = /*@__PURE__*/ requireOracledbQuerycompiler();
	const TableCompiler = /*@__PURE__*/ requireOracledbTablecompiler();
	const ColumnCompiler = /*@__PURE__*/ requireOracledbColumncompiler();
	const {
	  BlobHelper,
	  ReturningHelper,
	  monkeyPatchConnection,
	} = /*@__PURE__*/ requireUtils();
	const ViewCompiler = /*@__PURE__*/ requireOracledbViewcompiler();
	const ViewBuilder = /*@__PURE__*/ requireOracledbViewbuilder();
	const Transaction = /*@__PURE__*/ requireTransaction$1();
	const Client_Oracle = /*@__PURE__*/ requireOracle();
	const { isString } = is;
	const { outputQuery, unwrapRaw } = wrappingFormatter;
	const { compileCallback } = formatterUtils;

	class Client_Oracledb extends Client_Oracle {
	  constructor(config) {
	    super(config);

	    if (this.version) {
	      // Normalize version format; null bad format
	      // to trigger fallback to auto-detect.
	      this.version = parseVersion(this.version);
	    }

	    if (this.driver) {
	      process.env.UV_THREADPOOL_SIZE = process.env.UV_THREADPOOL_SIZE || 1;
	      process.env.UV_THREADPOOL_SIZE =
	        parseInt(process.env.UV_THREADPOOL_SIZE) + this.driver.poolMax;
	    }
	  }

	  _driver() {
	    const client = this;
	    const oracledb = require$$16;
	    client.fetchAsString = [];
	    if (this.config.fetchAsString && Array.isArray(this.config.fetchAsString)) {
	      this.config.fetchAsString.forEach(function (type) {
	        if (!isString(type)) return;
	        type = type.toUpperCase();
	        if (oracledb[type]) {
	          if (
	            type !== 'NUMBER' &&
	            type !== 'DATE' &&
	            type !== 'CLOB' &&
	            type !== 'BUFFER'
	          ) {
	            this.logger.warn(
	              'Only "date", "number", "clob" and "buffer" are supported for fetchAsString'
	            );
	          }
	          client.fetchAsString.push(oracledb[type]);
	        }
	      });
	    }
	    return oracledb;
	  }

	  queryCompiler(builder, formatter) {
	    return new QueryCompiler(this, builder, formatter);
	  }

	  tableCompiler() {
	    return new TableCompiler(this, ...arguments);
	  }

	  columnCompiler() {
	    return new ColumnCompiler(this, ...arguments);
	  }

	  viewBuilder() {
	    return new ViewBuilder(this, ...arguments);
	  }

	  viewCompiler() {
	    return new ViewCompiler(this, ...arguments);
	  }

	  formatter(builder) {
	    return new Formatter(this, builder);
	  }

	  transaction() {
	    return new Transaction(this, ...arguments);
	  }

	  prepBindings(bindings) {
	    return map(bindings, (value) => {
	      if (value instanceof BlobHelper && this.driver) {
	        return { type: this.driver.BLOB, dir: this.driver.BIND_OUT };
	        // Returning helper always use ROWID as string
	      } else if (value instanceof ReturningHelper && this.driver) {
	        return { type: this.driver.STRING, dir: this.driver.BIND_OUT };
	      } else if (typeof value === 'boolean') {
	        return value ? 1 : 0;
	      }
	      return value;
	    });
	  }

	  // Checks whether a value is a function... if it is, we compile it
	  // otherwise we check whether it's a raw
	  parameter(value, builder, formatter) {
	    if (typeof value === 'function') {
	      return outputQuery(
	        compileCallback(value, undefined, this, formatter),
	        true,
	        builder,
	        this
	      );
	    } else if (value instanceof BlobHelper) {
	      formatter.bindings.push(value.value);
	      return '?';
	    }
	    return unwrapRaw(value, true, builder, this, formatter) || '?';
	  }

	  // Get a raw connection, called by the `pool` whenever a new
	  // connection needs to be added to the pool.
	  acquireRawConnection() {
	    return new Promise((resolver, rejecter) => {
	      // If external authentication don't have to worry about username/password and
	      // if not need to set the username and password
	      const oracleDbConfig = this.connectionSettings.externalAuth
	        ? { externalAuth: this.connectionSettings.externalAuth }
	        : {
	            user: this.connectionSettings.user,
	            password: this.connectionSettings.password,
	          };

	      // In the case of external authentication connection string will be given
	      oracleDbConfig.connectString = resolveConnectString(
	        this.connectionSettings
	      );

	      if (this.connectionSettings.prefetchRowCount) {
	        oracleDbConfig.prefetchRows = this.connectionSettings.prefetchRowCount;
	      }

	      if (this.connectionSettings.stmtCacheSize !== undefined) {
	        oracleDbConfig.stmtCacheSize = this.connectionSettings.stmtCacheSize;
	      }

	      this.driver.fetchAsString = this.fetchAsString;

	      this.driver.getConnection(oracleDbConfig, (err, connection) => {
	        if (err) {
	          return rejecter(err);
	        }
	        monkeyPatchConnection(connection, this);

	        resolver(connection);
	      });
	    });
	  }

	  // Used to explicitly close a connection, called internally by the pool
	  // when a connection times out or the pool is shutdown.
	  destroyRawConnection(connection) {
	    return connection.release();
	  }

	  // Handle oracle version resolution on acquiring connection from pool instead of connection creation.
	  // Must do this here since only the client used to create a connection would be updated with version
	  // information on creation. Poses a problem when knex instance is cloned since instances share the
	  // connection pool while having their own client instances.
	  async acquireConnection() {
	    const connection = await super.acquireConnection();
	    this.checkVersion(connection);
	    return connection;
	  }

	  // In Oracle, we need to check the version to dynamically determine
	  // certain limits. If user did not specify a version, get it from the connection.
	  checkVersion(connection) {
	    // Already determined version before?
	    if (this.version) {
	      return this.version;
	    }

	    const detectedVersion = parseVersion(connection.oracleServerVersionString);
	    if (!detectedVersion) {
	      // When original version is set to null, user-provided version was invalid and we fell-back to auto-detect.
	      // Otherwise, we couldn't auto-detect at all. Set error message accordingly.
	      throw new Error(
	        this.version === null
	          ? 'Invalid Oracledb version number format passed to knex. Unable to successfully auto-detect as fallback. Please specify a valid oracledb version.'
	          : 'Unable to detect Oracledb version number automatically. Please specify the version in knex configuration.'
	      );
	    }

	    this.version = detectedVersion;
	    return detectedVersion;
	  }

	  // Runs the query on the specified connection, providing the bindings
	  // and any other necessary prep work.
	  _query(connection, obj) {
	    if (!obj.sql) throw new Error('The query is empty');

	    const options = Object.assign({}, obj.options, { autoCommit: false });
	    if (obj.method === 'select') {
	      options.resultSet = true;
	    }
	    return connection
	      .executeAsync(obj.sql, obj.bindings, options)
	      .then(async function (response) {
	        // Flatten outBinds
	        let outBinds = flatten(response.outBinds);
	        obj.response = response.rows || [];
	        obj.rowsAffected = response.rows
	          ? response.rows.rowsAffected
	          : response.rowsAffected;

	        //added for outBind parameter
	        if (obj.method === 'raw' && outBinds.length > 0) {
	          return {
	            response: outBinds,
	          };
	        }

	        if (obj.method === 'update') {
	          const modifiedRowsCount = obj.rowsAffected.length || obj.rowsAffected;
	          const updatedObjOutBinding = [];
	          const updatedOutBinds = [];
	          const updateOutBinds = (i) =>
	            function (value, index) {
	              const OutBindsOffset = index * modifiedRowsCount;
	              updatedOutBinds.push(outBinds[i + OutBindsOffset]);
	            };

	          for (let i = 0; i < modifiedRowsCount; i++) {
	            updatedObjOutBinding.push(obj.outBinding[0]);
	            each(obj.outBinding[0], updateOutBinds(i));
	          }
	          outBinds = updatedOutBinds;
	          obj.outBinding = updatedObjOutBinding;
	        }

	        if (!obj.returning && outBinds.length === 0) {
	          if (!connection.isTransaction) {
	            await connection.commitAsync();
	          }
	          return obj;
	        }
	        const rowIds = [];
	        let offset = 0;

	        for (let line = 0; line < obj.outBinding.length; line++) {
	          const ret = obj.outBinding[line];

	          offset =
	            offset +
	            (obj.outBinding[line - 1] ? obj.outBinding[line - 1].length : 0);

	          for (let index = 0; index < ret.length; index++) {
	            const out = ret[index];

	            await new Promise(function (bindResolver, bindRejecter) {
	              if (out instanceof BlobHelper) {
	                const blob = outBinds[index + offset];
	                if (out.returning) {
	                  obj.response[line] = obj.response[line] || {};
	                  obj.response[line][out.columnName] = out.value;
	                }
	                blob.on('error', function (err) {
	                  bindRejecter(err);
	                });
	                blob.on('finish', function () {
	                  bindResolver();
	                });
	                blob.write(out.value);
	                blob.end();
	              } else if (obj.outBinding[line][index] === 'ROWID') {
	                rowIds.push(outBinds[index + offset]);
	                bindResolver();
	              } else {
	                obj.response[line] = obj.response[line] || {};
	                obj.response[line][out] = outBinds[index + offset];
	                bindResolver();
	              }
	            });
	          }
	        }
	        if (obj.returningSql) {
	          const response = await connection.executeAsync(
	            obj.returningSql(),
	            rowIds,
	            { resultSet: true }
	          );
	          obj.response = response.rows;
	        }
	        if (connection.isTransaction) {
	          return obj;
	        }
	        await connection.commitAsync();
	        return obj;
	      });
	  }

	  // Process the response as returned from the query.
	  processResponse(obj, runner) {
	    const { response } = obj;
	    if (obj.output) {
	      return obj.output.call(runner, response);
	    }
	    switch (obj.method) {
	      case 'select':
	        return response;
	      case 'first':
	        return response[0];
	      case 'pluck':
	        return map(response, obj.pluck);
	      case 'insert':
	      case 'del':
	      case 'update':
	      case 'counter':
	        if ((obj.returning && !isEmpty(obj.returning)) || obj.returningSql) {
	          return response;
	        } else if (obj.rowsAffected !== undefined) {
	          return obj.rowsAffected;
	        } else {
	          return 1;
	        }
	      default:
	        return response;
	    }
	  }

	  processPassedConnection(connection) {
	    this.checkVersion(connection);
	    monkeyPatchConnection(connection, this);
	  }
	}

	Client_Oracledb.prototype.driverName = 'oracledb';

	function parseVersion(versionString) {
	  try {
	    // We only care about first two version components at most
	    const versionParts = versionString.split('.').slice(0, 2);
	    // Strip off any character suffixes in version number (ex. 12c => 12, 12.2c => 12.2)
	    versionParts.forEach((versionPart, idx) => {
	      versionParts[idx] = versionPart.replace(/\D$/, '');
	    });
	    const version = versionParts.join('.');
	    return version.match(/^\d+\.?\d*$/) ? version : null;
	  } catch (err) {
	    // Non-string versionString passed in.
	    return null;
	  }
	}

	function resolveConnectString(connectionSettings) {
	  if (connectionSettings.connectString) {
	    return connectionSettings.connectString;
	  }

	  if (!connectionSettings.port) {
	    return connectionSettings.host + '/' + connectionSettings.database;
	  }

	  return (
	    connectionSettings.host +
	    ':' +
	    connectionSettings.port +
	    '/' +
	    connectionSettings.database
	  );
	}

	oracledb = Client_Oracledb;
	return oracledb;
}

var pgnative;
var hasRequiredPgnative;

function requirePgnative () {
	if (hasRequiredPgnative) return pgnative;
	hasRequiredPgnative = 1;
	// PostgreSQL Native Driver (pg-native)
	// -------
	const Client_PG = /*@__PURE__*/ requirePostgres();

	class Client_PgNative extends Client_PG {
	  constructor(...args) {
	    super(...args);
	    this.driverName = 'pgnative';
	    this.canCancelQuery = true;
	  }

	  _driver() {
	    return require$$9.native;
	  }

	  _stream(connection, obj, stream, options) {
	    if (!obj.sql) throw new Error('The query is empty');

	    const client = this;
	    return new Promise((resolver, rejecter) => {
	      stream.on('error', rejecter);
	      stream.on('end', resolver);

	      return client
	        ._query(connection, obj)
	        .then((obj) => obj.response)
	        .then(({ rows }) => rows.forEach((row) => stream.write(row)))
	        .catch(function (err) {
	          stream.emit('error', err);
	        })
	        .then(function () {
	          stream.end();
	        });
	    });
	  }

	  async cancelQuery(connectionToKill) {
	    try {
	      return await this._wrappedCancelQueryCall(null, connectionToKill);
	    } catch (err) {
	      this.logger.warn(`Connection Error: ${err}`);
	      throw err;
	    }
	  }

	  _wrappedCancelQueryCall(emptyConnection, connectionToKill) {
	    return new Promise(function (resolve, reject) {
	      connectionToKill.native.cancel(function (err) {
	        if (err) {
	          reject(err);
	          return;
	        }

	        resolve(true);
	      });
	    });
	  }
	}

	pgnative = Client_PgNative;
	return pgnative;
}

var transaction;
var hasRequiredTransaction;

function requireTransaction () {
	if (hasRequiredTransaction) return transaction;
	hasRequiredTransaction = 1;
	const Transaction = transaction$5;

	transaction = class Redshift_Transaction extends Transaction {
	  begin(conn) {
	    const trxMode = [
	      this.isolationLevel ? `ISOLATION LEVEL ${this.isolationLevel}` : '',
	      this.readOnly ? 'READ ONLY' : '',
	    ]
	      .join(' ')
	      .trim();

	    if (trxMode.length === 0) {
	      return this.query(conn, 'BEGIN;');
	    }
	    return this.query(conn, `BEGIN ${trxMode};`);
	  }

	  savepoint(conn) {
	    this.trxClient.logger('Redshift does not support savepoints.');
	    return Promise.resolve();
	  }

	  release(conn, value) {
	    this.trxClient.logger('Redshift does not support savepoints.');
	    return Promise.resolve();
	  }

	  rollbackTo(conn, error) {
	    this.trxClient.logger('Redshift does not support savepoints.');
	    return Promise.resolve();
	  }
	};
	return transaction;
}

var redshiftQuerycompiler;
var hasRequiredRedshiftQuerycompiler;

function requireRedshiftQuerycompiler () {
	if (hasRequiredRedshiftQuerycompiler) return redshiftQuerycompiler;
	hasRequiredRedshiftQuerycompiler = 1;
	// Redshift Query Builder & Compiler
	// ------
	const QueryCompiler = querycompiler;
	const QueryCompiler_PG = /*@__PURE__*/ requirePgQuerycompiler();

	const identity = require$$2$4;
	const {
	  columnize: columnize_,
	} = wrappingFormatter;

	class QueryCompiler_Redshift extends QueryCompiler_PG {
	  truncate() {
	    return `truncate ${this.tableName.toLowerCase()}`;
	  }

	  // Compiles an `insert` query, allowing for multiple
	  // inserts using a single query statement.
	  insert() {
	    const sql = QueryCompiler.prototype.insert.apply(this, arguments);
	    if (sql === '') return sql;
	    this._slightReturn();
	    return {
	      sql,
	    };
	  }

	  // Compiles an `update` query, warning on unsupported returning
	  update() {
	    const sql = QueryCompiler.prototype.update.apply(this, arguments);
	    this._slightReturn();
	    return {
	      sql,
	    };
	  }

	  // Compiles an `delete` query, warning on unsupported returning
	  del() {
	    const sql = QueryCompiler.prototype.del.apply(this, arguments);
	    this._slightReturn();
	    return {
	      sql,
	    };
	  }

	  // simple: if trying to return, warn
	  _slightReturn() {
	    if (this.single.isReturning) {
	      this.client.logger.warn(
	        'insert/update/delete returning is not supported by redshift dialect'
	      );
	    }
	  }

	  forUpdate() {
	    this.client.logger.warn('table lock is not supported by redshift dialect');
	    return '';
	  }

	  forShare() {
	    this.client.logger.warn(
	      'lock for share is not supported by redshift dialect'
	    );
	    return '';
	  }

	  forNoKeyUpdate() {
	    this.client.logger.warn('table lock is not supported by redshift dialect');
	    return '';
	  }

	  forKeyShare() {
	    this.client.logger.warn(
	      'lock for share is not supported by redshift dialect'
	    );
	    return '';
	  }

	  // Compiles a columnInfo query
	  columnInfo() {
	    const column = this.single.columnInfo;
	    let schema = this.single.schema;

	    // The user may have specified a custom wrapIdentifier function in the config. We
	    // need to run the identifiers through that function, but not format them as
	    // identifiers otherwise.
	    const table = this.client.customWrapIdentifier(this.single.table, identity);

	    if (schema) {
	      schema = this.client.customWrapIdentifier(schema, identity);
	    }

	    const sql =
	      'select * from information_schema.columns where table_name = ? and table_catalog = ?';
	    const bindings = [
	      table.toLowerCase(),
	      this.client.database().toLowerCase(),
	    ];

	    return this._buildColumnInfoQuery(schema, sql, bindings, column);
	  }

	  jsonExtract(params) {
	    let extractions;
	    if (Array.isArray(params.column)) {
	      extractions = params.column;
	    } else {
	      extractions = [params];
	    }
	    return extractions
	      .map((extraction) => {
	        const jsonCol = `json_extract_path_text(${columnize_(
	          extraction.column || extraction[0],
	          this.builder,
	          this.client,
	          this.bindingsHolder
	        )}, ${this.client.toPathForJson(
	          params.path || extraction[1],
	          this.builder,
	          this.bindingsHolder
	        )})`;
	        const alias = extraction.alias || extraction[2];
	        return alias
	          ? this.client.alias(jsonCol, this.formatter.wrap(alias))
	          : jsonCol;
	      })
	      .join(', ');
	  }

	  jsonSet(params) {
	    throw new Error('Json set is not supported by Redshift');
	  }

	  jsonInsert(params) {
	    throw new Error('Json insert is not supported by Redshift');
	  }

	  jsonRemove(params) {
	    throw new Error('Json remove is not supported by Redshift');
	  }

	  whereJsonPath(statement) {
	    return this._whereJsonPath(
	      'json_extract_path_text',
	      Object.assign({}, statement, {
	        path: this.client.toPathForJson(statement.path),
	      })
	    );
	  }

	  whereJsonSupersetOf(statement) {
	    throw new Error('Json superset is not supported by Redshift');
	  }

	  whereJsonSubsetOf(statement) {
	    throw new Error('Json subset is not supported by Redshift');
	  }

	  onJsonPathEquals(clause) {
	    return this._onJsonPathEquals('json_extract_path_text', clause);
	  }
	}

	redshiftQuerycompiler = QueryCompiler_Redshift;
	return redshiftQuerycompiler;
}

var redshiftColumnbuilder;
var hasRequiredRedshiftColumnbuilder;

function requireRedshiftColumnbuilder () {
	if (hasRequiredRedshiftColumnbuilder) return redshiftColumnbuilder;
	hasRequiredRedshiftColumnbuilder = 1;
	const ColumnBuilder = columnbuilder;

	class ColumnBuilder_Redshift extends ColumnBuilder {
	  constructor() {
	    super(...arguments);
	  }

	  // primary needs to set not null on non-preexisting columns, or fail
	  primary() {
	    this.notNullable();
	    return super.primary(...arguments);
	  }

	  index() {
	    this.client.logger.warn(
	      'Redshift does not support the creation of indexes.'
	    );
	    return this;
	  }
	}

	redshiftColumnbuilder = ColumnBuilder_Redshift;
	return redshiftColumnbuilder;
}

var redshiftColumncompiler;
var hasRequiredRedshiftColumncompiler;

function requireRedshiftColumncompiler () {
	if (hasRequiredRedshiftColumncompiler) return redshiftColumncompiler;
	hasRequiredRedshiftColumncompiler = 1;
	// Redshift Column Compiler
	// -------

	const ColumnCompiler_PG = /*@__PURE__*/ requirePgColumncompiler();
	const ColumnCompiler = columncompiler;

	class ColumnCompiler_Redshift extends ColumnCompiler_PG {
	  constructor() {
	    super(...arguments);
	  }

	  // Types:
	  // ------

	  bit(column) {
	    return column.length !== false ? `char(${column.length})` : 'char(1)';
	  }

	  datetime(without) {
	    return without ? 'timestamp' : 'timestamptz';
	  }

	  timestamp(without) {
	    return without ? 'timestamp' : 'timestamptz';
	  }

	  // Modifiers:
	  // ------
	  comment(comment) {
	    this.pushAdditional(function () {
	      this.pushQuery(
	        `comment on column ${this.tableCompiler.tableName()}.` +
	          this.formatter.wrap(this.args[0]) +
	          ' is ' +
	          (comment ? `'${comment}'` : 'NULL')
	      );
	    }, comment);
	  }
	}

	ColumnCompiler_Redshift.prototype.increments = ({ primaryKey = true } = {}) =>
	  'integer identity(1,1)' + (primaryKey ? ' primary key' : '') + ' not null';
	ColumnCompiler_Redshift.prototype.bigincrements = ({
	  primaryKey = true,
	} = {}) =>
	  'bigint identity(1,1)' + (primaryKey ? ' primary key' : '') + ' not null';
	ColumnCompiler_Redshift.prototype.binary = 'varchar(max)';
	ColumnCompiler_Redshift.prototype.blob = 'varchar(max)';
	ColumnCompiler_Redshift.prototype.enu = 'varchar(255)';
	ColumnCompiler_Redshift.prototype.enum = 'varchar(255)';
	ColumnCompiler_Redshift.prototype.json = 'varchar(max)';
	ColumnCompiler_Redshift.prototype.jsonb = 'varchar(max)';
	ColumnCompiler_Redshift.prototype.longblob = 'varchar(max)';
	ColumnCompiler_Redshift.prototype.mediumblob = 'varchar(16777218)';
	ColumnCompiler_Redshift.prototype.set = 'text';
	ColumnCompiler_Redshift.prototype.text = 'varchar(max)';
	ColumnCompiler_Redshift.prototype.tinyblob = 'varchar(256)';
	ColumnCompiler_Redshift.prototype.uuid = ColumnCompiler.prototype.uuid;
	ColumnCompiler_Redshift.prototype.varbinary = 'varchar(max)';
	ColumnCompiler_Redshift.prototype.bigint = 'bigint';
	ColumnCompiler_Redshift.prototype.bool = 'boolean';
	ColumnCompiler_Redshift.prototype.double = 'double precision';
	ColumnCompiler_Redshift.prototype.floating = 'real';
	ColumnCompiler_Redshift.prototype.smallint = 'smallint';
	ColumnCompiler_Redshift.prototype.tinyint = 'smallint';

	redshiftColumncompiler = ColumnCompiler_Redshift;
	return redshiftColumncompiler;
}

/* eslint max-len: 0 */

var redshiftTablecompiler;
var hasRequiredRedshiftTablecompiler;

function requireRedshiftTablecompiler () {
	if (hasRequiredRedshiftTablecompiler) return redshiftTablecompiler;
	hasRequiredRedshiftTablecompiler = 1;
	// Redshift Table Builder & Compiler
	// -------

	const has = require$$0$8;
	const TableCompiler_PG = /*@__PURE__*/ requirePgTablecompiler();

	class TableCompiler_Redshift extends TableCompiler_PG {
	  constructor() {
	    super(...arguments);
	  }

	  index(columns, indexName, options) {
	    this.client.logger.warn(
	      'Redshift does not support the creation of indexes.'
	    );
	  }

	  dropIndex(columns, indexName) {
	    this.client.logger.warn(
	      'Redshift does not support the deletion of indexes.'
	    );
	  }

	  // TODO: have to disable setting not null on columns that already exist...

	  // Adds the "create" query to the query sequence.
	  createQuery(columns, ifNot, like) {
	    const createStatement = ifNot
	      ? 'create table if not exists '
	      : 'create table ';
	    const columnsSql = ' (' + columns.sql.join(', ') + this._addChecks() + ')';
	    let sql =
	      createStatement +
	      this.tableName() +
	      (like && this.tableNameLike()
	        ? ' (like ' + this.tableNameLike() + ')'
	        : columnsSql);
	    if (this.single.inherits)
	      sql += ` like (${this.formatter.wrap(this.single.inherits)})`;
	    this.pushQuery({
	      sql,
	      bindings: columns.bindings,
	    });
	    const hasComment = has(this.single, 'comment');
	    if (hasComment) this.comment(this.single.comment);
	    if (like) {
	      this.addColumns(columns, this.addColumnsPrefix);
	    }
	  }

	  primary(columns, constraintName) {
	    const self = this;
	    constraintName = constraintName
	      ? self.formatter.wrap(constraintName)
	      : self.formatter.wrap(`${this.tableNameRaw}_pkey`);
	    if (columns.constructor !== Array) {
	      columns = [columns];
	    }
	    const thiscolumns = self.grouped.columns;

	    if (thiscolumns) {
	      for (let i = 0; i < columns.length; i++) {
	        let exists = thiscolumns.find(
	          (tcb) =>
	            tcb.grouping === 'columns' &&
	            tcb.builder &&
	            tcb.builder._method === 'add' &&
	            tcb.builder._args &&
	            tcb.builder._args.indexOf(columns[i]) > -1
	        );
	        if (exists) {
	          exists = exists.builder;
	        }
	        const nullable = !(
	          exists &&
	          exists._modifiers &&
	          exists._modifiers['nullable'] &&
	          exists._modifiers['nullable'][0] === false
	        );
	        if (nullable) {
	          if (exists) {
	            return this.client.logger.warn(
	              'Redshift does not allow primary keys to contain nullable columns.'
	            );
	          } else {
	            return this.client.logger.warn(
	              'Redshift does not allow primary keys to contain nonexistent columns.'
	            );
	          }
	        }
	      }
	    }
	    return self.pushQuery(
	      `alter table ${self.tableName()} add constraint ${constraintName} primary key (${self.formatter.columnize(
	        columns
	      )})`
	    );
	  }

	  // Compiles column add. Redshift can only add one column per ALTER TABLE, so core addColumns doesn't work.  #2545
	  addColumns(columns, prefix, colCompilers) {
	    if (prefix === this.alterColumnsPrefix) {
	      super.addColumns(columns, prefix, colCompilers);
	    } else {
	      prefix = prefix || this.addColumnsPrefix;
	      colCompilers = colCompilers || this.getColumns();
	      for (const col of colCompilers) {
	        const quotedTableName = this.tableName();
	        const colCompiled = col.compileColumn();

	        this.pushQuery({
	          sql: `alter table ${quotedTableName} ${prefix}${colCompiled}`,
	          bindings: [],
	        });
	      }
	    }
	  }
	}

	redshiftTablecompiler = TableCompiler_Redshift;
	return redshiftTablecompiler;
}

/* eslint max-len: 0 */

var redshiftCompiler;
var hasRequiredRedshiftCompiler;

function requireRedshiftCompiler () {
	if (hasRequiredRedshiftCompiler) return redshiftCompiler;
	hasRequiredRedshiftCompiler = 1;
	// Redshift Table Builder & Compiler
	// -------

	const SchemaCompiler_PG = /*@__PURE__*/ requirePgCompiler();

	class SchemaCompiler_Redshift extends SchemaCompiler_PG {
	  constructor() {
	    super(...arguments);
	  }
	}

	redshiftCompiler = SchemaCompiler_Redshift;
	return redshiftCompiler;
}

/* eslint max-len: 0 */

var redshiftViewcompiler;
var hasRequiredRedshiftViewcompiler;

function requireRedshiftViewcompiler () {
	if (hasRequiredRedshiftViewcompiler) return redshiftViewcompiler;
	hasRequiredRedshiftViewcompiler = 1;
	const ViewCompiler_PG = /*@__PURE__*/ requirePgViewcompiler();

	class ViewCompiler_Redshift extends ViewCompiler_PG {
	  constructor(client, viewCompiler) {
	    super(client, viewCompiler);
	  }
	}

	redshiftViewcompiler = ViewCompiler_Redshift;
	return redshiftViewcompiler;
}

var redshift;
var hasRequiredRedshift;

function requireRedshift () {
	if (hasRequiredRedshift) return redshift;
	hasRequiredRedshift = 1;
	// Redshift
	// -------
	const Client_PG = /*@__PURE__*/ requirePostgres();
	const map = require$$1$5;

	const Transaction = /*@__PURE__*/ requireTransaction();
	const QueryCompiler = /*@__PURE__*/ requireRedshiftQuerycompiler();
	const ColumnBuilder = /*@__PURE__*/ requireRedshiftColumnbuilder();
	const ColumnCompiler = /*@__PURE__*/ requireRedshiftColumncompiler();
	const TableCompiler = /*@__PURE__*/ requireRedshiftTablecompiler();
	const SchemaCompiler = /*@__PURE__*/ requireRedshiftCompiler();
	const ViewCompiler = /*@__PURE__*/ requireRedshiftViewcompiler();

	class Client_Redshift extends Client_PG {
	  transaction() {
	    return new Transaction(this, ...arguments);
	  }

	  queryCompiler(builder, formatter) {
	    return new QueryCompiler(this, builder, formatter);
	  }

	  columnBuilder() {
	    return new ColumnBuilder(this, ...arguments);
	  }

	  columnCompiler() {
	    return new ColumnCompiler(this, ...arguments);
	  }

	  tableCompiler() {
	    return new TableCompiler(this, ...arguments);
	  }

	  schemaCompiler() {
	    return new SchemaCompiler(this, ...arguments);
	  }

	  viewCompiler() {
	    return new ViewCompiler(this, ...arguments);
	  }

	  _driver() {
	    return require$$9;
	  }

	  // Ensures the response is returned in the same format as other clients.
	  processResponse(obj, runner) {
	    const resp = obj.response;
	    if (obj.output) return obj.output.call(runner, resp);
	    if (obj.method === 'raw') return resp;
	    if (resp.command === 'SELECT') {
	      if (obj.method === 'first') return resp.rows[0];
	      if (obj.method === 'pluck') return map(resp.rows, obj.pluck);
	      return resp.rows;
	    }
	    if (
	      resp.command === 'INSERT' ||
	      resp.command === 'UPDATE' ||
	      resp.command === 'DELETE'
	    ) {
	      return resp.rowCount;
	    }
	    return resp;
	  }

	  toPathForJson(jsonPath, builder, bindingsHolder) {
	    return jsonPath
	      .replace(/^(\$\.)/, '') // remove the first dollar
	      .split('.')
	      .map(
	        function (v) {
	          return this.parameter(v, builder, bindingsHolder);
	        }.bind(this)
	      )
	      .join(', ');
	  }
	}

	Object.assign(Client_Redshift.prototype, {
	  dialect: 'redshift',

	  driverName: 'pg-redshift',
	});

	redshift = Client_Redshift;
	return redshift;
}

Object.defineProperty(dialects, '__esModule', { value: true });
dialects.getDialectByNameOrAlias = void 0;
const { resolveClientNameWithAliases } = helpers$7;
const dbNameToDialectLoader = Object.freeze({
  'better-sqlite3': () => /*@__PURE__*/ requireBetterSqlite3(),
  cockroachdb: () => /*@__PURE__*/ requireCockroachdb(),
  mssql: () => /*@__PURE__*/ requireMssql(),
  mysql: () => /*@__PURE__*/ requireMysql(),
  mysql2: () => /*@__PURE__*/ requireMysql2(),
  oracle: () => /*@__PURE__*/ requireOracle(),
  oracledb: () => /*@__PURE__*/ requireOracledb(),
  pgnative: () => /*@__PURE__*/ requirePgnative(),
  postgres: () => /*@__PURE__*/ requirePostgres(),
  redshift: () => /*@__PURE__*/ requireRedshift(),
  sqlite3: () => /*@__PURE__*/ requireSqlite3(),
});
/**
 * Gets the Dialect object with the given client name or throw an
 * error if not found.
 *
 * NOTE: This is a replacement for prior practice of doing dynamic
 * string construction for imports of Dialect objects.
 */
function getDialectByNameOrAlias$1(clientName) {
  const resolvedClientName = resolveClientNameWithAliases(clientName);
  const dialectLoader = dbNameToDialectLoader[resolvedClientName];
  if (!dialectLoader) {
    throw new Error(`Invalid clientName given: ${clientName}`);
  }
  return dialectLoader();
}
dialects.getDialectByNameOrAlias = getDialectByNameOrAlias$1;

const Client$1 = client$2;
const { SUPPORTED_CLIENTS } = constants$1;

const parseConnection = parseConnection$1;
const { getDialectByNameOrAlias } = dialects;

function resolveConfig$1(config) {
  let Dialect;
  let resolvedConfig;

  // If config is a string, try to parse it
  const parsedConfig =
    typeof config === 'string'
      ? Object.assign(parseConnection(config), arguments[2])
      : config;

  // If user provided no relevant parameters, use generic client
  if (
    arguments.length === 0 ||
    (!parsedConfig.client && !parsedConfig.dialect)
  ) {
    Dialect = Client$1;
  }
  // If user provided Client constructor as a parameter, use it
  else if (typeof parsedConfig.client === 'function') {
    Dialect = parsedConfig.client;
  }
  // If neither applies, let's assume user specified name of a client or dialect as a string
  else {
    const clientName = parsedConfig.client || parsedConfig.dialect;
    if (!SUPPORTED_CLIENTS.includes(clientName)) {
      throw new Error(
        `knex: Unknown configuration option 'client' value ${clientName}. Note that it is case-sensitive, check documentation for supported values.`
      );
    }

    Dialect = getDialectByNameOrAlias(clientName);
  }

  // If config connection parameter is passed as string, try to parse it
  if (typeof parsedConfig.connection === 'string') {
    resolvedConfig = Object.assign({}, parsedConfig, {
      connection: parseConnection(parsedConfig.connection).connection,
    });
  } else {
    resolvedConfig = Object.assign({}, parsedConfig);
  }

  return {
    resolvedConfig,
    Dialect,
  };
}

var configResolver = {
  resolveConfig: resolveConfig$1,
};

const Client = client$2;
const QueryBuilder = querybuilder;
const QueryInterface = methodConstants;

const makeKnex = makeKnex_1;
const { KnexTimeoutError } = timeout$3;
const { resolveConfig } = configResolver;
const SchemaBuilder = builder;
const ViewBuilder = viewbuilder;
const ColumnBuilder = columnbuilder;
const TableBuilder = tablebuilder;

function knex$1(config) {
  const { resolvedConfig, Dialect } = resolveConfig(...arguments);

  const newKnex = makeKnex(new Dialect(resolvedConfig));
  if (resolvedConfig.userParams) {
    newKnex.userParams = resolvedConfig.userParams;
  }
  return newKnex;
}

// Expose Client on the main Knex namespace.
knex$1.Client = Client;

knex$1.KnexTimeoutError = KnexTimeoutError;

knex$1.QueryBuilder = {
  extend: function (methodName, fn) {
    QueryBuilder.extend(methodName, fn);
    QueryInterface.push(methodName);
  },
};

knex$1.SchemaBuilder = {
  extend: function (methodName, fn) {
    SchemaBuilder.extend(methodName, fn);
  },
};

knex$1.ViewBuilder = {
  extend: function (methodName, fn) {
    ViewBuilder.extend(methodName, fn);
  },
};

knex$1.ColumnBuilder = {
  extend: function (methodName, fn) {
    ColumnBuilder.extend(methodName, fn);
  },
};

knex$1.TableBuilder = {
  extend: function (methodName, fn) {
    TableBuilder.extend(methodName, fn);
  },
};

var Knex$1 = knex$1;

const Knex = Knex$1;

var lib = Knex;

const knex = /*@__PURE__*/getDefaultExportFromCjs(lib);

// Knex.js
// --------------
//     (c) 2013-present Tim Griesser
//     Knex may be freely distributed under the MIT license.
//     For details and documentation:
//     http://knexjs.org

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
const getDatabase = () => {
  const runtimeConfig = useRuntimeConfig();
  const connectionString = runtimeConfig.databaseUrl;
  const cleanConnectionString = (connectionString == null ? void 0 : connectionString.replace(/[?&]sslmode=[^&]*/g, "")) || "";
  return knex({
    client: "pg",
    connection: {
      connectionString: cleanConnectionString,
      ssl: {
        rejectUnauthorized: false
      }
    },
    pool: {
      min: 2,
      max: 10
    }
  });
};
class DatabaseHelper {
  constructor(database) {
    __publicField(this, "db");
    this.db = database || getDatabase();
  }
  // Generic CRUD operations
  async findById(table, id) {
    return await this.db(table).where("id", id).first();
  }
  async findByField(table, field, value) {
    return await this.db(table).where(field, value).first();
  }
  async findAll(table, where) {
    let query = this.db(table);
    if (where) {
      query = query.where(where);
    }
    return await query.select("*");
  }
  async create(table, data) {
    const now = /* @__PURE__ */ new Date();
    const dataWithTimestamps = {
      ...data,
      createdAt: now,
      updatedAt: now
    };
    const [result] = await this.db(table).insert(dataWithTimestamps).returning("*");
    return result;
  }
  async update(table, id, data) {
    const [result] = await this.db(table).where("id", id).update({ ...data, updatedAt: /* @__PURE__ */ new Date() }).returning("*");
    return result;
  }
  async delete(table, id) {
    return await this.db(table).where("id", id).del();
  }
  // Company-specific helpers
  async findCompanyBySlug(slug) {
    return await this.db("companies").where("slug", slug).first();
  }
  async findUserByEmail(email) {
    return await this.db("users").where("email", email).first();
  }
  async findUserByPhone(phone) {
    return await this.db("users").where("phone", phone).first();
  }
  // Professional helpers
  async findCompanyProfessionals(companyId) {
    return await this.db("company_professionals").join("users", "company_professionals.user_id", "users.id").where("company_professionals.company_id", companyId).where("company_professionals.status", "active").select("company_professionals.*", "users.name", "users.email", "users.phone");
  }
  // Client helpers
  async findCompanyClients(companyId) {
    return await this.db("company_users").join("users", "company_users.user_id", "users.id").where("company_users.company_id", companyId).select("company_users.*", "users.name", "users.email", "users.phone");
  }
  // Service helpers
  async findCompanyServices(companyId) {
    return await this.db("services").where("company_id", companyId);
  }
  // Product helpers
  async findCompanyProducts(companyId) {
    return await this.db("products").where("company_id", companyId);
  }
  // Appointment helpers
  async findAppointmentsByDate(companyId, date, professionalId) {
    let query = this.db("appointments").where("company_id", companyId).whereRaw("DATE(start_date) = ?", [date]).where("status", "active");
    if (professionalId) {
      query = query.where("company_professional_id", professionalId);
    }
    return await query.select("*");
  }
  // Order helpers
  async findCompanyOrders(companyId, status) {
    let query = this.db("orders").join("company_users", "orders.company_user_id", "company_users.id").join("users", "company_users.user_id", "users.id").where("orders.company_id", companyId);
    if (status) {
      query = query.where("orders.status", status);
    }
    return await query.select(
      "orders.*",
      "users.name as client_name",
      "users.email as client_email",
      "users.phone as client_phone"
    );
  }
  // Movement helpers
  async findCompanyMovements(companyId, category) {
    let query = this.db("movements").where("company_id", companyId);
    if (category) {
      query = query.where("category", category);
    }
    return await query.select("*").orderBy("created_at", "desc");
  }
  // Close connection
  async close() {
    await this.db.destroy();
  }
}

function createSupabaseClient() {
  const config = useRuntimeConfig();
  const key = config.supabaseServiceRoleKey || config.supabaseAnonKey;
  if (!config.supabaseUrl || !key) {
    throw new Error("Supabase environment variables are not configured");
  }
  return createClient(config.supabaseUrl, key);
}
const supabase = createSupabaseClient();

const collections = {
};

const DEFAULT_ENDPOINT = "https://api.iconify.design";
const _2ViXYw = defineCachedEventHandler(async (event) => {
  const url = getRequestURL(event);
  if (!url)
    return createError$1({ status: 400, message: "Invalid icon request" });
  const options = useAppConfig().icon;
  const collectionName = event.context.params?.collection?.replace(/\.json$/, "");
  const collection = collectionName ? await collections[collectionName]?.() : null;
  const apiEndPoint = options.iconifyApiEndpoint || DEFAULT_ENDPOINT;
  const icons = url.searchParams.get("icons")?.split(",");
  if (collection) {
    if (icons?.length) {
      const data = getIcons(
        collection,
        icons
      );
      consola.debug(`[Icon] serving ${(icons || []).map((i) => "`" + collectionName + ":" + i + "`").join(",")} from bundled collection`);
      return data;
    }
  }
  if (options.fallbackToApi === true || options.fallbackToApi === "server-only") {
    const apiUrl = new URL("./" + basename(url.pathname) + url.search, apiEndPoint);
    consola.debug(`[Icon] fetching ${(icons || []).map((i) => "`" + collectionName + ":" + i + "`").join(",")} from iconify api`);
    if (apiUrl.host !== new URL(apiEndPoint).host) {
      return createError$1({ status: 400, message: "Invalid icon request" });
    }
    try {
      const data = await $fetch(apiUrl.href);
      return data;
    } catch (e) {
      consola.error(e);
      if (e.status === 404)
        return createError$1({ status: 404 });
      else
        return createError$1({ status: 500, message: "Failed to fetch fallback icon" });
    }
  }
  return createError$1({ status: 404 });
}, {
  group: "nuxt",
  name: "icon",
  getKey(event) {
    const collection = event.context.params?.collection?.replace(/\.json$/, "") || "unknown";
    const icons = String(getQuery(event).icons || "");
    return `${collection}_${icons.split(",")[0]}_${icons.length}_${hash$1(icons)}`;
  },
  swr: true,
  maxAge: 60 * 60 * 24 * 7
  // 1 week
});

const _lYDCHL = lazyEventHandler(() => {
  const opts = useRuntimeConfig().ipx || {};
  const fsDir = opts?.fs?.dir ? (Array.isArray(opts.fs.dir) ? opts.fs.dir : [opts.fs.dir]).map((dir) => isAbsolute(dir) ? dir : fileURLToPath(new URL(dir, globalThis._importMeta_.url))) : void 0;
  const fsStorage = opts.fs?.dir ? ipxFSStorage({ ...opts.fs, dir: fsDir }) : void 0;
  const httpStorage = opts.http?.domains ? ipxHttpStorage({ ...opts.http }) : void 0;
  if (!fsStorage && !httpStorage) {
    throw new Error("IPX storage is not configured!");
  }
  const ipxOptions = {
    ...opts,
    storage: fsStorage || httpStorage,
    httpStorage
  };
  const ipx = createIPX(ipxOptions);
  const ipxHandler = createIPXH3Handler(ipx);
  return useBase(opts.baseURL, ipxHandler);
});

const _lazy_xB1JUy = () => import('../routes/api/admins/_id_.delete.mjs');
const _lazy_2UBc0s = () => import('../routes/api/admins/_id_.get.mjs');
const _lazy_j9lD0f = () => import('../routes/api/admins/_id_.put.mjs');
const _lazy_ZAFkGU = () => import('../routes/api/index.get.mjs');
const _lazy_acGGQ4 = () => import('../routes/api/index.post.mjs');
const _lazy_CScgmk = () => import('../routes/api/auth/login.post.mjs');
const _lazy_IEuH69 = () => import('../routes/api/auth/logout.post.mjs');
const _lazy_4hw3NM = () => import('../routes/api/auth/me.get.mjs');
const _lazy_ygRBte = () => import('../routes/api/categories/_id_.delete.mjs');
const _lazy_rreLHw = () => import('../routes/api/categories/_id_.get.mjs');
const _lazy_ZpmgCw = () => import('../routes/api/categories/_id_.put.mjs');
const _lazy_kNkInf = () => import('../routes/api/index.get2.mjs');
const _lazy_uIk8pt = () => import('../routes/api/index.post2.mjs');
const _lazy_uPQLe3 = () => import('../routes/api/companies/_id_.delete.mjs');
const _lazy_Ni4Z64 = () => import('../routes/api/companies/_id_.get.mjs');
const _lazy_H8MekX = () => import('../routes/api/companies/_id_.put.mjs');
const _lazy_z1QMgE = () => import('../routes/api/index.get3.mjs');
const _lazy_gDw53a = () => import('../routes/api/index.post3.mjs');
const _lazy_r9dOdu = () => import('../routes/api/dishes/_id_.delete.mjs');
const _lazy_oYyogB = () => import('../routes/api/dishes/_id_.get.mjs');
const _lazy_dnn_q6 = () => import('../routes/api/dishes/_id_.put.mjs');
const _lazy_P2nwDz = () => import('../routes/api/index.get4.mjs');
const _lazy_N3fvei = () => import('../routes/api/index.post4.mjs');
const _lazy_Te_R4O = () => import('../routes/api/side-categories/_id_.delete.mjs');
const _lazy_Pg4DMt = () => import('../routes/api/side-categories/_id_.get.mjs');
const _lazy_6xkLll = () => import('../routes/api/side-categories/_id_.put.mjs');
const _lazy_6kRDc_ = () => import('../routes/api/index.get5.mjs');
const _lazy_8JYe7e = () => import('../routes/api/index.post5.mjs');
const _lazy_qKGXIG = () => import('../routes/api/test-supabase.get.mjs');
const _lazy_e2mOS2 = () => import('../routes/api/uploads/dish-image.post.mjs');
const _lazy_Vpjd14 = () => import('../routes/renderer.mjs');

const handlers = [
  { route: '/api/admins/:id', handler: _lazy_xB1JUy, lazy: true, middleware: false, method: "delete" },
  { route: '/api/admins/:id', handler: _lazy_2UBc0s, lazy: true, middleware: false, method: "get" },
  { route: '/api/admins/:id', handler: _lazy_j9lD0f, lazy: true, middleware: false, method: "put" },
  { route: '/api/admins', handler: _lazy_ZAFkGU, lazy: true, middleware: false, method: "get" },
  { route: '/api/admins', handler: _lazy_acGGQ4, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/login', handler: _lazy_CScgmk, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/logout', handler: _lazy_IEuH69, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/me', handler: _lazy_4hw3NM, lazy: true, middleware: false, method: "get" },
  { route: '/api/categories/:id', handler: _lazy_ygRBte, lazy: true, middleware: false, method: "delete" },
  { route: '/api/categories/:id', handler: _lazy_rreLHw, lazy: true, middleware: false, method: "get" },
  { route: '/api/categories/:id', handler: _lazy_ZpmgCw, lazy: true, middleware: false, method: "put" },
  { route: '/api/categories', handler: _lazy_kNkInf, lazy: true, middleware: false, method: "get" },
  { route: '/api/categories', handler: _lazy_uIk8pt, lazy: true, middleware: false, method: "post" },
  { route: '/api/companies/:id', handler: _lazy_uPQLe3, lazy: true, middleware: false, method: "delete" },
  { route: '/api/companies/:id', handler: _lazy_Ni4Z64, lazy: true, middleware: false, method: "get" },
  { route: '/api/companies/:id', handler: _lazy_H8MekX, lazy: true, middleware: false, method: "put" },
  { route: '/api/companies', handler: _lazy_z1QMgE, lazy: true, middleware: false, method: "get" },
  { route: '/api/companies', handler: _lazy_gDw53a, lazy: true, middleware: false, method: "post" },
  { route: '/api/dishes/:id', handler: _lazy_r9dOdu, lazy: true, middleware: false, method: "delete" },
  { route: '/api/dishes/:id', handler: _lazy_oYyogB, lazy: true, middleware: false, method: "get" },
  { route: '/api/dishes/:id', handler: _lazy_dnn_q6, lazy: true, middleware: false, method: "put" },
  { route: '/api/dishes', handler: _lazy_P2nwDz, lazy: true, middleware: false, method: "get" },
  { route: '/api/dishes', handler: _lazy_N3fvei, lazy: true, middleware: false, method: "post" },
  { route: '/api/side-categories/:id', handler: _lazy_Te_R4O, lazy: true, middleware: false, method: "delete" },
  { route: '/api/side-categories/:id', handler: _lazy_Pg4DMt, lazy: true, middleware: false, method: "get" },
  { route: '/api/side-categories/:id', handler: _lazy_6xkLll, lazy: true, middleware: false, method: "put" },
  { route: '/api/side-categories', handler: _lazy_6kRDc_, lazy: true, middleware: false, method: "get" },
  { route: '/api/side-categories', handler: _lazy_8JYe7e, lazy: true, middleware: false, method: "post" },
  { route: '/api/test-supabase', handler: _lazy_qKGXIG, lazy: true, middleware: false, method: "get" },
  { route: '/api/uploads/dish-image', handler: _lazy_e2mOS2, lazy: true, middleware: false, method: "post" },
  { route: '/__nuxt_error', handler: _lazy_Vpjd14, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_island/**', handler: _SxA8c9, lazy: false, middleware: false, method: undefined },
  { route: '/api/_nuxt_icon/:collection', handler: _2ViXYw, lazy: false, middleware: false, method: undefined },
  { route: '/_ipx/**', handler: _lYDCHL, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_Vpjd14, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(false),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => b(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return C(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

const nitroApp = useNitroApp();
const handler = toNodeListener(nitroApp.h3App);
const listener = function(req, res) {
  const query = req.headers["x-now-route-matches"];
  if (query) {
    const { url } = parseQuery(query);
    if (url) {
      req.url = url;
    }
  }
  return handler(req, res);
};

export { DatabaseHelper as D, H3Error as H, getQuery as a, deleteCookie as b, createError$1 as c, defineEventHandler as d, getCookie as e, sendError as f, getRouterParam as g, sendSuccess as h, handleServerError as i, supabase as j, knex as k, readMultipartFormData as l, buildAssetsURL as m, getResponseStatusText as n, getResponseStatus as o, defineRenderHandler as p, publicAssetsURL as q, readBody as r, setCookie as s, getRouteRules as t, useRuntimeConfig as u, useNitroApp as v, listener as w };
//# sourceMappingURL=nitro.mjs.map
