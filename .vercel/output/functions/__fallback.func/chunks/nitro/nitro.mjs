import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import knex from 'knex';
import * as process$2 from 'node:process';
import process__default from 'node:process';
import * as M from 'node:path';
import M__default, { resolve, dirname, join } from 'node:path';
import * as __banner_node_url from 'node:url';
import { fileURLToPath } from 'node:url';
import * as __banner_node_module from 'node:module';
import Ci, { promises, existsSync } from 'node:fs';
import ku from 'node:child_process';
import Bo from 'node:fs/promises';
import ni from 'node:os';
import { promisify } from 'node:util';
import { AsyncResource } from 'node:async_hooks';
import { EventEmitter } from 'node:events';
import { createClient } from '@supabase/supabase-js';
import http from 'node:http';
import https from 'node:https';
import { Buffer as Buffer$1 } from 'node:buffer';
import { createHash } from 'node:crypto';
import { getIcons } from '@iconify/utils';
import { consola } from 'consola';
import { ipxFSStorage, ipxHttpStorage, createIPX, createIPXH3Handler } from 'ipx';

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

function parse$1(str, options) {
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
function serialize$2(name, value, options) {
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
    if (!isDate(opt.expires) || Number.isNaN(opt.expires.valueOf())) {
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
function isDate(val) {
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
    remove: (path) => remove(ctx, normalizeTrailingSlash(path))
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
function remove(ctx, path) {
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

function isPlainObject(value) {
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
  if (!isPlainObject(defaults)) {
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
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
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

function o(n){throw new Error(`${n} is not implemented yet!`)}let i$1 = class i extends EventEmitter{__unenv__={};readableEncoding=null;readableEnded=true;readableFlowing=false;readableHighWaterMark=0;readableLength=0;readableObjectMode=false;readableAborted=false;readableDidRead=false;closed=false;errored=null;readable=false;destroyed=false;static from(e,t){return new i(t)}constructor(e){super();}_read(e){}read(e){}setEncoding(e){return this}pause(){return this}resume(){return this}isPaused(){return  true}unpipe(e){return this}unshift(e,t){}wrap(e){return this}push(e,t){return  false}_destroy(e,t){this.removeAllListeners();}destroy(e){return this.destroyed=true,this._destroy(e),this}pipe(e,t){return {}}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return this.destroy(),Promise.resolve()}async*[Symbol.asyncIterator](){throw o("Readable.asyncIterator")}iterator(e){throw o("Readable.iterator")}map(e,t){throw o("Readable.map")}filter(e,t){throw o("Readable.filter")}forEach(e,t){throw o("Readable.forEach")}reduce(e,t,r){throw o("Readable.reduce")}find(e,t){throw o("Readable.find")}findIndex(e,t){throw o("Readable.findIndex")}some(e,t){throw o("Readable.some")}toArray(e){throw o("Readable.toArray")}every(e,t){throw o("Readable.every")}flatMap(e,t){throw o("Readable.flatMap")}drop(e,t){throw o("Readable.drop")}take(e,t){throw o("Readable.take")}asIndexedPairs(e){throw o("Readable.asIndexedPairs")}};let l$1 = class l extends EventEmitter{__unenv__={};writable=true;writableEnded=false;writableFinished=false;writableHighWaterMark=0;writableLength=0;writableObjectMode=false;writableCorked=0;closed=false;errored=null;writableNeedDrain=false;writableAborted=false;destroyed=false;_data;_encoding="utf8";constructor(e){super();}pipe(e,t){return {}}_write(e,t,r){if(this.writableEnded){r&&r();return}if(this._data===void 0)this._data=e;else {const s=typeof this._data=="string"?Buffer$1.from(this._data,this._encoding||t||"utf8"):this._data,a=typeof e=="string"?Buffer$1.from(e,t||this._encoding||"utf8"):e;this._data=Buffer$1.concat([s,a]);}this._encoding=t,r&&r();}_writev(e,t){}_destroy(e,t){}_final(e){}write(e,t,r){const s=typeof t=="string"?this._encoding:"utf8",a=typeof t=="function"?t:typeof r=="function"?r:void 0;return this._write(e,s,a),true}setDefaultEncoding(e){return this}end(e,t,r){const s=typeof e=="function"?e:typeof t=="function"?t:typeof r=="function"?r:void 0;if(this.writableEnded)return s&&s(),this;const a=e===s?void 0:e;if(a){const u=t===s?void 0:t;this.write(a,u,s);}return this.writableEnded=true,this.writableFinished=true,this.emit("close"),this.emit("finish"),this}cork(){}uncork(){}destroy(e){return this.destroyed=true,delete this._data,this.removeAllListeners(),this}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return Promise.resolve()}};const c$1=class c{allowHalfOpen=true;_destroy;constructor(e=new i$1,t=new l$1){Object.assign(this,e),Object.assign(this,t),this._destroy=m$1(e._destroy,t._destroy);}};function _$1(){return Object.assign(c$1.prototype,i$1.prototype),Object.assign(c$1.prototype,l$1.prototype),c$1}function m$1(...n){return function(...e){for(const t of n)t(...e);}}const g=_$1();let A$1 = class A extends g{__unenv__={};bufferSize=0;bytesRead=0;bytesWritten=0;connecting=false;destroyed=false;pending=false;localAddress="";localPort=0;remoteAddress="";remoteFamily="";remotePort=0;autoSelectFamilyAttemptedAddresses=[];readyState="readOnly";constructor(e){super();}write(e,t,r){return  false}connect(e,t,r){return this}end(e,t,r){return this}setEncoding(e){return this}pause(){return this}resume(){return this}setTimeout(e,t){return this}setNoDelay(e){return this}setKeepAlive(e,t){return this}address(){return {}}unref(){return this}ref(){return this}destroySoon(){this.destroy();}resetAndDestroy(){const e=new Error("ERR_SOCKET_CLOSED");return e.code="ERR_SOCKET_CLOSED",this.destroy(e),this}};let y$1 = class y extends i$1{aborted=false;httpVersion="1.1";httpVersionMajor=1;httpVersionMinor=1;complete=true;connection;socket;headers={};trailers={};method="GET";url="/";statusCode=200;statusMessage="";closed=false;errored=null;readable=false;constructor(e){super(),this.socket=this.connection=e||new A$1;}get rawHeaders(){const e=this.headers,t=[];for(const r in e)if(Array.isArray(e[r]))for(const s of e[r])t.push(r,s);else t.push(r,e[r]);return t}get rawTrailers(){return []}setTimeout(e,t){return this}get headersDistinct(){return p(this.headers)}get trailersDistinct(){return p(this.trailers)}};function p(n){const e={};for(const[t,r]of Object.entries(n))t&&(e[t]=(Array.isArray(r)?r:[r]).filter(Boolean));return e}let w$1 = class w extends l$1{statusCode=200;statusMessage="";upgrading=false;chunkedEncoding=false;shouldKeepAlive=false;useChunkedEncodingByDefault=false;sendDate=false;finished=false;headersSent=false;strictContentLength=false;connection=null;socket=null;req;_headers={};constructor(e){super(),this.req=e;}assignSocket(e){e._httpMessage=this,this.socket=e,this.connection=e,this.emit("socket",e),this._flush();}_flush(){this.flushHeaders();}detachSocket(e){}writeContinue(e){}writeHead(e,t,r){e&&(this.statusCode=e),typeof t=="string"&&(this.statusMessage=t,t=void 0);const s=r||t;if(s&&!Array.isArray(s))for(const a in s)this.setHeader(a,s[a]);return this.headersSent=true,this}writeProcessing(){}setTimeout(e,t){return this}appendHeader(e,t){e=e.toLowerCase();const r=this._headers[e],s=[...Array.isArray(r)?r:[r],...Array.isArray(t)?t:[t]].filter(Boolean);return this._headers[e]=s.length>1?s:s[0],this}setHeader(e,t){return this._headers[e.toLowerCase()]=t,this}setHeaders(e){for(const[t,r]of Object.entries(e))this.setHeader(t,r);return this}getHeader(e){return this._headers[e.toLowerCase()]}getHeaders(){return this._headers}getHeaderNames(){return Object.keys(this._headers)}hasHeader(e){return e.toLowerCase()in this._headers}removeHeader(e){delete this._headers[e.toLowerCase()];}addTrailers(e){}flushHeaders(){}writeEarlyHints(e,t){typeof t=="function"&&t();}};const E$1=(()=>{const n=function(){};return n.prototype=Object.create(null),n})();function R$1(n={}){const e=new E$1,t=Array.isArray(n)||H$1(n)?n:Object.entries(n);for(const[r,s]of t)if(s){if(e[r]===void 0){e[r]=s;continue}e[r]=[...Array.isArray(e[r])?e[r]:[e[r]],...Array.isArray(s)?s:[s]];}return e}function H$1(n){return typeof n?.entries=="function"}function v$1(n={}){if(n instanceof Headers)return n;const e=new Headers;for(const[t,r]of Object.entries(n))if(r!==void 0){if(Array.isArray(r)){for(const s of r)e.append(t,String(s));continue}e.set(t,String(r));}return e}const S=new Set([101,204,205,304]);async function b(n,e){const t=new y$1,r=new w$1(t);t.url=e.url?.toString()||"/";let s;if(!t.url.startsWith("/")){const d=new URL(t.url);s=d.host,t.url=d.pathname+d.search+d.hash;}t.method=e.method||"GET",t.headers=R$1(e.headers||{}),t.headers.host||(t.headers.host=e.host||s||"localhost"),t.connection.encrypted=t.connection.encrypted||e.protocol==="https",t.body=e.body||null,t.__unenv__=e.context,await n(t,r);let a=r._data;(S.has(r.statusCode)||t.method.toUpperCase()==="HEAD")&&(a=null,delete r._headers["content-length"]);const u={status:r.statusCode,statusText:r.statusMessage,headers:r._headers,body:a};return t.destroy(),r.destroy(),u}async function C$1(n,e,t={}){try{const r=await b(n,{url:e,...t});return new Response(r.body,{status:r.status,statusText:r.statusText,headers:v$1(r.headers)})}catch(r){return new Response(r.toString(),{status:Number.parseInt(r.statusCode||r.code)||500,statusText:r.statusText})}}

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

function parse(multipartBodyBuffer, boundary) {
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
  return parse(body, boundary);
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
  return parse$1(event.node.req.headers.cookie || "");
}
function getCookie(event, name) {
  return parseCookies(event)[name];
}
function setCookie(event, name, value, serializeOptions = {}) {
  if (!serializeOptions.path) {
    serializeOptions = { path: "/", ...serializeOptions };
  }
  const newCookie = serialize$2(name, value, serializeOptions);
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

const defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
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
const fetch$1 = globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch();
const Headers$1 = globalThis.Headers || s$1;
const AbortController = globalThis.AbortController || i;
createFetch({ fetch: fetch$1, Headers: Headers$1, AbortController });

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
async function writeFile(path, data, encoding) {
  await ensuredir(dirname(path));
  return promises.writeFile(path, data, encoding);
}
function readFile(path, encoding) {
  return promises.readFile(path, encoding).catch(ignoreNotfound);
}
function unlink(path) {
  return promises.unlink(path).catch(ignoreNotfound);
}
function readdir(dir) {
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
  const entries = await readdir(dir);
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
  const entries = await readdir(dir);
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
      return readFile(r(key), "utf8");
    },
    getItemRaw(key) {
      return readFile(r(key));
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await promises.stat(r(key)).catch(() => ({}));
      return { atime, mtime, size, birthtime, ctime };
    },
    setItem(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value, "utf8");
    },
    setItemRaw(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value);
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

function serialize$1(o){return typeof o=="string"?`'${o}'`:new c().serialize(o)}const c=/*@__PURE__*/function(){class o{#t=new Map;compare(t,r){const e=typeof t,n=typeof r;return e==="string"&&n==="string"?t.localeCompare(r):e==="number"&&n==="number"?t-r:String.prototype.localeCompare.call(this.serialize(t,true),this.serialize(r,true))}serialize(t,r){if(t===null)return "null";switch(typeof t){case "string":return r?t:`'${t}'`;case "bigint":return `${t}n`;case "object":return this.$object(t);case "function":return this.$function(t)}return String(t)}serializeObject(t){const r=Object.prototype.toString.call(t);if(r!=="[object Object]")return this.serializeBuiltInType(r.length<10?`unknown:${r}`:r.slice(8,-1),t);const e=t.constructor,n=e===Object||e===void 0?"":e.name;if(n!==""&&globalThis[n]===e)return this.serializeBuiltInType(n,t);if(typeof t.toJSON=="function"){const i=t.toJSON();return n+(i!==null&&typeof i=="object"?this.$object(i):`(${this.serialize(i)})`)}return this.serializeObjectEntries(n,Object.entries(t))}serializeBuiltInType(t,r){const e=this["$"+t];if(e)return e.call(this,r);if(typeof r?.entries=="function")return this.serializeObjectEntries(t,r.entries());throw new Error(`Cannot serialize ${t}`)}serializeObjectEntries(t,r){const e=Array.from(r).sort((i,a)=>this.compare(i[0],a[0]));let n=`${t}{`;for(let i=0;i<e.length;i++){const[a,l]=e[i];n+=`${this.serialize(a,true)}:${this.serialize(l)}`,i<e.length-1&&(n+=",");}return n+"}"}$object(t){let r=this.#t.get(t);return r===void 0&&(this.#t.set(t,`#${this.#t.size}`),r=this.serializeObject(t),this.#t.set(t,r)),r}$function(t){const r=Function.prototype.toString.call(t);return r.slice(-15)==="[native code] }"?`${t.name||""}()[native]`:`${t.name}(${t.length})${r.replace(/\s*\n\s*/g,"")}`}$Array(t){let r="[";for(let e=0;e<t.length;e++)r+=this.serialize(t[e]),e<t.length-1&&(r+=",");return r+"]"}$Date(t){try{return `Date(${t.toISOString()})`}catch{return "Date(null)"}}$ArrayBuffer(t){return `ArrayBuffer[${new Uint8Array(t).join(",")}]`}$Set(t){return `Set${this.$Array(Array.from(t).sort((r,e)=>this.compare(r,e)))}`}$Map(t){return this.serializeObjectEntries("Map",t.entries())}}for(const s of ["Error","RegExp","URL"])o.prototype["$"+s]=function(t){return `${s}(${t})`};for(const s of ["Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Uint16Array","Int32Array","Uint32Array","Float32Array","Float64Array"])o.prototype["$"+s]=function(t){return `${s}[${t.join(",")}]`};for(const s of ["BigInt64Array","BigUint64Array"])o.prototype["$"+s]=function(t){return `${s}[${t.join("n,")}${t.length>0?"n":""}]`};return o}();

const e=globalThis.process?.getBuiltinModule?.("crypto")?.hash,r="sha256",s="base64url";function digest(t){if(e)return e(r,t,s);const o=createHash(r).update(t);return globalThis.process?.versions?.webcontainer?o.digest().toString(s):o.digest(s)}

function hash$1(input) {
  return digest(serialize$1(input));
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
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
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
    "buildId": "21d4ac46-c334-453d-8da0-c9b76ef3fa12",
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

const config$1 = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter$1({ routes: config$1.nitro.routeRules })
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

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
const getDatabase = () => {
  const runtimeConfig = useRuntimeConfig();
  return knex({
    client: "postgresql",
    connection: {
      connectionString: runtimeConfig.databaseUrl,
      ssl: { rejectUnauthorized: false } 
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
    const [result] = await this.db(table).insert(data).returning("*");
    return result;
  }
  async update(table, id, data) {
    const [result] = await this.db(table).where("id", id).update({ ...data, updated_at: /* @__PURE__ */ new Date() }).returning("*");
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

const __filename$1 = __banner_node_url.fileURLToPath(globalThis._importMeta_.url);
globalThis['__dirname'] = M.dirname(__filename$1);
const require$1 = __banner_node_module.createRequire(globalThis._importMeta_.url);
var Xl=Object.create;var Kn=Object.defineProperty;var eu=Object.getOwnPropertyDescriptor;var ru=Object.getOwnPropertyNames;var tu=Object.getPrototypeOf,nu=Object.prototype.hasOwnProperty;var fr=(e=>typeof require$1<"u"?require$1:typeof Proxy<"u"?new Proxy(e,{get:(r,t)=>(typeof require$1<"u"?require$1:r)[t]}):e)(function(e){if(typeof require$1<"u")return require$1.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')});var To=(e,r)=>()=>(e&&(r=e(e=0)),r);var ae=(e,r)=>()=>(r||e((r={exports:{}}).exports,r),r.exports),gr=(e,r)=>{for(var t in r)Kn(e,t,{get:r[t],enumerable:true});},iu=(e,r,t,n)=>{if(r&&typeof r=="object"||typeof r=="function")for(let i of ru(r))!nu.call(e,i)&&i!==t&&Kn(e,i,{get:()=>r[i],enumerable:!(n=eu(r,i))||n.enumerable});return e};var le=(e,r,t)=>(t=e!=null?Xl(tu(e)):{},iu(r||!e||!e.__esModule?Kn(t,"default",{value:e,enumerable:true}):t,e));var ai=ae(($g,zo)=>{zo.exports=(e,r=process$2.argv)=>{let t=e.startsWith("-")?"":e.length===1?"-":"--",n=r.indexOf(t+e),i=r.indexOf("--");return n!==-1&&(i===-1||n<i)};});var es=ae((qg,Xo)=>{var xc=fr("node:os"),Zo=fr("node:tty"),pe=ai(),{env:U}=process$2,Ge;pe("no-color")||pe("no-colors")||pe("color=false")||pe("color=never")?Ge=0:(pe("color")||pe("colors")||pe("color=true")||pe("color=always"))&&(Ge=1);"FORCE_COLOR"in U&&(U.FORCE_COLOR==="true"?Ge=1:U.FORCE_COLOR==="false"?Ge=0:Ge=U.FORCE_COLOR.length===0?1:Math.min(parseInt(U.FORCE_COLOR,10),3));function li(e){return e===0?false:{level:e,hasBasic:true,has256:e>=2,has16m:e>=3}}function ui(e,r){if(Ge===0)return 0;if(pe("color=16m")||pe("color=full")||pe("color=truecolor"))return 3;if(pe("color=256"))return 2;if(e&&!r&&Ge===void 0)return 0;let t=Ge||0;if(U.TERM==="dumb")return t;if(process$2.platform==="win32"){let n=xc.release().split(".");return Number(n[0])>=10&&Number(n[2])>=10586?Number(n[2])>=14931?3:2:1}if("CI"in U)return ["TRAVIS","CIRCLECI","APPVEYOR","GITLAB_CI","GITHUB_ACTIONS","BUILDKITE"].some(n=>n in U)||U.CI_NAME==="codeship"?1:t;if("TEAMCITY_VERSION"in U)return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(U.TEAMCITY_VERSION)?1:0;if(U.COLORTERM==="truecolor")return 3;if("TERM_PROGRAM"in U){let n=parseInt((U.TERM_PROGRAM_VERSION||"").split(".")[0],10);switch(U.TERM_PROGRAM){case "iTerm.app":return n>=3?3:2;case "Apple_Terminal":return 2}}return /-256(color)?$/i.test(U.TERM)?2:/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(U.TERM)||"COLORTERM"in U?1:t}function vc(e){let r=ui(e,e&&e.isTTY);return li(r)}Xo.exports={supportsColor:vc,stdout:li(ui(true,Zo.isatty(1))),stderr:li(ui(true,Zo.isatty(2)))};});var ns=ae((Vg,ts)=>{var Pc=es(),Er=ai();function rs(e){if(/^\d{3,4}$/.test(e)){let t=/(\d{1,2})(\d{2})/.exec(e)||[];return {major:0,minor:parseInt(t[1],10),patch:parseInt(t[2],10)}}let r=(e||"").split(".").map(t=>parseInt(t,10));return {major:r[0],minor:r[1],patch:r[2]}}function ci(e){let{CI:r,FORCE_HYPERLINK:t,NETLIFY:n,TEAMCITY_VERSION:i,TERM_PROGRAM:o,TERM_PROGRAM_VERSION:s,VTE_VERSION:a,TERM:l}=process$2.env;if(t)return !(t.length>0&&parseInt(t,10)===0);if(Er("no-hyperlink")||Er("no-hyperlinks")||Er("hyperlink=false")||Er("hyperlink=never"))return  false;if(Er("hyperlink=true")||Er("hyperlink=always")||n)return  true;if(!Pc.supportsColor(e)||e&&!e.isTTY)return  false;if("WT_SESSION"in process$2.env)return  true;if(process$2.platform==="win32"||r||i)return  false;if(o){let u=rs(s||"");switch(o){case "iTerm.app":return u.major===3?u.minor>=1:u.major>3;case "WezTerm":return u.major>=20200620;case "vscode":return u.major>1||u.major===1&&u.minor>=72;case "ghostty":return  true}}if(a){if(a==="0.50.0")return  false;let u=rs(a);return u.major>0||u.minor>=50}switch(l){case "alacritty":return  true}return  false}ts.exports={supportsHyperlink:ci,stdout:ci(process$2.stdout),stderr:ci(process$2.stderr)};});var is=ae((Xg,Tc)=>{Tc.exports={name:"@prisma/internals",version:"6.19.0",description:"This package is intended for Prisma's internal use",main:"dist/index.js",types:"dist/index.d.ts",repository:{type:"git",url:"https://github.com/prisma/prisma.git",directory:"packages/internals"},homepage:"https://www.prisma.io",author:"Tim Suchanek <suchanek@prisma.io>",bugs:"https://github.com/prisma/prisma/issues",license:"Apache-2.0",scripts:{dev:"DEV=true tsx helpers/build.ts",build:"tsx helpers/build.ts",test:"dotenv -e ../../.db.env -- jest --silent",prepublishOnly:"pnpm run build"},files:["README.md","dist","!**/libquery_engine*","!dist/get-generators/engines/*","scripts"],devDependencies:{"@babel/helper-validator-identifier":"7.25.9","@opentelemetry/api":"1.9.0","@swc/core":"1.11.5","@swc/jest":"0.2.37","@types/babel__helper-validator-identifier":"7.15.2","@types/jest":"29.5.14","@types/node":"18.19.76","@types/resolve":"1.20.6",archiver:"6.0.2","checkpoint-client":"1.1.33","cli-truncate":"4.0.0",dotenv:"16.5.0",empathic:"2.0.0","escape-string-regexp":"5.0.0",execa:"8.0.1","fast-glob":"3.3.3","find-up":"7.0.0","fp-ts":"2.16.9","fs-extra":"11.3.0","global-directory":"4.0.0",globby:"11.1.0","identifier-regex":"1.0.0","indent-string":"4.0.0","is-windows":"1.0.2","is-wsl":"3.1.0",jest:"29.7.0","jest-junit":"16.0.0",kleur:"4.1.5","mock-stdin":"1.0.0","new-github-issue-url":"0.2.1","node-fetch":"3.3.2","npm-packlist":"5.1.3",open:"7.4.2","p-map":"4.0.0",resolve:"1.22.10","string-width":"7.2.0","strip-indent":"4.0.0","temp-dir":"2.0.0",tempy:"1.0.1","terminal-link":"4.0.0",tmp:"0.2.3","ts-pattern":"5.6.2","ts-toolbelt":"9.6.0",typescript:"5.4.5",yarn:"1.22.22"},dependencies:{"@prisma/config":"workspace:*","@prisma/debug":"workspace:*","@prisma/dmmf":"workspace:*","@prisma/driver-adapter-utils":"workspace:*","@prisma/engines":"workspace:*","@prisma/fetch-engine":"workspace:*","@prisma/generator":"workspace:*","@prisma/generator-helper":"workspace:*","@prisma/get-platform":"workspace:*","@prisma/prisma-schema-wasm":"6.19.0-26.2ba551f319ab1df4bc874a89965d8b3641056773","@prisma/schema-engine-wasm":"6.19.0-26.2ba551f319ab1df4bc874a89965d8b3641056773","@prisma/schema-files-loader":"workspace:*",arg:"5.0.2",prompts:"2.4.2"},peerDependencies:{typescript:">=5.1.0"},peerDependenciesMeta:{typescript:{optional:true}},sideEffects:false};});var gi=ae((wh,Dc)=>{Dc.exports={name:"@prisma/engines-version",version:"6.19.0-26.2ba551f319ab1df4bc874a89965d8b3641056773",main:"index.js",types:"index.d.ts",license:"Apache-2.0",author:"Tim Suchanek <suchanek@prisma.io>",prisma:{enginesVersion:"2ba551f319ab1df4bc874a89965d8b3641056773"},repository:{type:"git",url:"https://github.com/prisma/engines-wrapper.git",directory:"packages/engines-version"},devDependencies:{"@types/node":"18.19.76",typescript:"4.9.5"},files:["index.js","index.d.ts"],scripts:{build:"tsc -d"}};});var Zt=ae(zt=>{Object.defineProperty(zt,"__esModule",{value:true});zt.enginesVersion=void 0;zt.enginesVersion=gi().prisma.enginesVersion;});var cs=ae((Fh,us)=>{us.exports=e=>{let r=e.match(/^[ \t]*(?=\S)/gm);return r?r.reduce((t,n)=>Math.min(t,n.length),1/0):0};});var wi=ae((qh,ms)=>{ms.exports=(e,r=1,t)=>{if(t={indent:" ",includeEmptyLines:false,...t},typeof e!="string")throw new TypeError(`Expected \`input\` to be a \`string\`, got \`${typeof e}\``);if(typeof r!="number")throw new TypeError(`Expected \`count\` to be a \`number\`, got \`${typeof r}\``);if(typeof t.indent!="string")throw new TypeError(`Expected \`options.indent\` to be a \`string\`, got \`${typeof t.indent}\``);if(r===0)return e;let n=t.includeEmptyLines?/^/gm:/^(?!\s*$)/gm;return e.replace(n,t.indent.repeat(r))};});var hs=ae((Hh,jc)=>{jc.exports={name:"dotenv",version:"16.5.0",description:"Loads environment variables from .env file",main:"lib/main.js",types:"lib/main.d.ts",exports:{".":{types:"./lib/main.d.ts",require:"./lib/main.js",default:"./lib/main.js"},"./config":"./config.js","./config.js":"./config.js","./lib/env-options":"./lib/env-options.js","./lib/env-options.js":"./lib/env-options.js","./lib/cli-options":"./lib/cli-options.js","./lib/cli-options.js":"./lib/cli-options.js","./package.json":"./package.json"},scripts:{"dts-check":"tsc --project tests/types/tsconfig.json",lint:"standard",pretest:"npm run lint && npm run dts-check",test:"tap run --allow-empty-coverage --disable-coverage --timeout=60000","test:coverage":"tap run --show-full-coverage --timeout=60000 --coverage-report=lcov",prerelease:"npm test",release:"standard-version"},repository:{type:"git",url:"git://github.com/motdotla/dotenv.git"},homepage:"https://github.com/motdotla/dotenv#readme",funding:"https://dotenvx.com",keywords:["dotenv","env",".env","environment","variables","config","settings"],readmeFilename:"README.md",license:"BSD-2-Clause",devDependencies:{"@types/node":"^18.11.3",decache:"^4.6.2",sinon:"^14.0.1",standard:"^17.0.0","standard-version":"^9.5.0",tap:"^19.2.0",typescript:"^4.8.4"},engines:{node:">=12"},browser:{fs:false}};});var xs=ae((Yh,_e)=>{var Ri=fr("node:fs"),Ai=fr("node:path"),Bc=fr("node:os"),Uc=fr("node:crypto"),Gc=hs(),bs=Gc.version,Qc=/(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;function Wc(e){let r={},t=e.toString();t=t.replace(/\r\n?/mg,`
`);let n;for(;(n=Qc.exec(t))!=null;){let i=n[1],o=n[2]||"";o=o.trim();let s=o[0];o=o.replace(/^(['"`])([\s\S]*)\1$/mg,"$2"),s==='"'&&(o=o.replace(/\\n/g,`
`),o=o.replace(/\\r/g,"\r")),r[i]=o;}return r}function Jc(e){let r=ws(e),t=j.configDotenv({path:r});if(!t.parsed){let s=new Error(`MISSING_DATA: Cannot parse ${r} for an unknown reason`);throw s.code="MISSING_DATA",s}let n=Es(e).split(","),i=n.length,o;for(let s=0;s<i;s++)try{let a=n[s].trim(),l=Hc(t,a);o=j.decrypt(l.ciphertext,l.key);break}catch(a){if(s+1>=i)throw a}return j.parse(o)}function Kc(e){console.log(`[dotenv@${bs}][WARN] ${e}`);}function tt(e){console.log(`[dotenv@${bs}][DEBUG] ${e}`);}function Es(e){return e&&e.DOTENV_KEY&&e.DOTENV_KEY.length>0?e.DOTENV_KEY:process$2.env.DOTENV_KEY&&process$2.env.DOTENV_KEY.length>0?process$2.env.DOTENV_KEY:""}function Hc(e,r){let t;try{t=new URL(r);}catch(a){if(a.code==="ERR_INVALID_URL"){let l=new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");throw l.code="INVALID_DOTENV_KEY",l}throw a}let n=t.password;if(!n){let a=new Error("INVALID_DOTENV_KEY: Missing key part");throw a.code="INVALID_DOTENV_KEY",a}let i=t.searchParams.get("environment");if(!i){let a=new Error("INVALID_DOTENV_KEY: Missing environment part");throw a.code="INVALID_DOTENV_KEY",a}let o=`DOTENV_VAULT_${i.toUpperCase()}`,s=e.parsed[o];if(!s){let a=new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${o} in your .env.vault file.`);throw a.code="NOT_FOUND_DOTENV_ENVIRONMENT",a}return {ciphertext:s,key:n}}function ws(e){let r=null;if(e&&e.path&&e.path.length>0)if(Array.isArray(e.path))for(let t of e.path)Ri.existsSync(t)&&(r=t.endsWith(".vault")?t:`${t}.vault`);else r=e.path.endsWith(".vault")?e.path:`${e.path}.vault`;else r=Ai.resolve(process$2.cwd(),".env.vault");return Ri.existsSync(r)?r:null}function ys(e){return e[0]==="~"?Ai.join(Bc.homedir(),e.slice(1)):e}function Yc(e){!!(e&&e.debug)&&tt("Loading env from encrypted .env.vault");let t=j._parseVault(e),n=process$2.env;return e&&e.processEnv!=null&&(n=e.processEnv),j.populate(n,t,e),{parsed:t}}function zc(e){let r=Ai.resolve(process$2.cwd(),".env"),t="utf8",n=!!(e&&e.debug);e&&e.encoding?t=e.encoding:n&&tt("No encoding is specified. UTF-8 is used by default");let i=[r];if(e&&e.path)if(!Array.isArray(e.path))i=[ys(e.path)];else {i=[];for(let l of e.path)i.push(ys(l));}let o,s={};for(let l of i)try{let u=j.parse(Ri.readFileSync(l,{encoding:t}));j.populate(s,u,e);}catch(u){n&&tt(`Failed to load ${l} ${u.message}`),o=u;}let a=process$2.env;return e&&e.processEnv!=null&&(a=e.processEnv),j.populate(a,s,e),o?{parsed:s,error:o}:{parsed:s}}function Zc(e){if(Es(e).length===0)return j.configDotenv(e);let r=ws(e);return r?j._configVault(e):(Kc(`You set DOTENV_KEY but you are missing a .env.vault file at ${r}. Did you forget to build it?`),j.configDotenv(e))}function Xc(e,r){let t=Buffer.from(r.slice(-64),"hex"),n=Buffer.from(e,"base64"),i=n.subarray(0,12),o=n.subarray(-16);n=n.subarray(12,-16);try{let s=Uc.createDecipheriv("aes-256-gcm",t,i);return s.setAuthTag(o),`${s.update(n)}${s.final()}`}catch(s){let a=s instanceof RangeError,l=s.message==="Invalid key length",u=s.message==="Unsupported state or unable to authenticate data";if(a||l){let c=new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");throw c.code="INVALID_DOTENV_KEY",c}else if(u){let c=new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");throw c.code="DECRYPTION_FAILED",c}else throw s}}function ep(e,r,t={}){let n=!!(t&&t.debug),i=!!(t&&t.override);if(typeof r!="object"){let o=new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");throw o.code="OBJECT_REQUIRED",o}for(let o of Object.keys(r))Object.prototype.hasOwnProperty.call(e,o)?(i===true&&(e[o]=r[o]),n&&tt(i===true?`"${o}" is already defined and WAS overwritten`:`"${o}" is already defined and was NOT overwritten`)):e[o]=r[o];}var j={configDotenv:zc,_configVault:Yc,_parseVault:Jc,config:Zc,decrypt:Xc,parse:Wc,populate:ep};_e.exports.configDotenv=j.configDotenv;_e.exports._configVault=j._configVault;_e.exports._parseVault=j._parseVault;_e.exports.config=j.config;_e.exports.decrypt=j.decrypt;_e.exports.parse=j.parse;_e.exports.populate=j.populate;_e.exports=j;});var Ss=ae((iy,nn)=>{nn.exports=(e={})=>{let r;if(e.repoUrl)r=e.repoUrl;else if(e.user&&e.repo)r=`https://github.com/${e.user}/${e.repo}`;else throw new Error("You need to specify either the `repoUrl` option or both the `user` and `repo` options");let t=new URL(`${r}/issues/new`),n=["body","title","labels","template","milestone","assignee","projects"];for(let i of n){let o=e[i];if(o!==void 0){if(i==="labels"||i==="projects"){if(!Array.isArray(o))throw new TypeError(`The \`${i}\` option should be an array`);o=o.join(",");}t.searchParams.set(i,o);}}return t.toString()};nn.exports.default=nn.exports;});var qi=ae((_b,Ws)=>{Ws.exports=function(){function e(r,t,n,i,o){return r<t||n<t?r>n?n+1:r+1:i===o?t:t+1}return function(r,t){if(r===t)return 0;if(r.length>t.length){var n=r;r=t,t=n;}for(var i=r.length,o=t.length;i>0&&r.charCodeAt(i-1)===t.charCodeAt(o-1);)i--,o--;for(var s=0;s<i&&r.charCodeAt(s)===t.charCodeAt(s);)s++;if(i-=s,o-=s,i===0||o<3)return o;var a=0,l,u,c,p,d,f,h,g,I,T,S,b,D=[];for(l=0;l<i;l++)D.push(l+1),D.push(r.charCodeAt(s+l));for(var me=D.length-1;a<o-3;)for(I=t.charCodeAt(s+(u=a)),T=t.charCodeAt(s+(c=a+1)),S=t.charCodeAt(s+(p=a+2)),b=t.charCodeAt(s+(d=a+3)),f=a+=4,l=0;l<me;l+=2)h=D[l],g=D[l+1],u=e(h,u,c,I,g),c=e(u,c,p,T,g),p=e(c,p,d,S,g),f=e(p,d,f,b,g),D[l]=f,d=p,p=c,c=u,u=h;for(;a<o;)for(I=t.charCodeAt(s+(u=a)),f=++a,l=0;l<me;l+=2)h=D[l],D[l]=f=e(h,u,f,I,D[l+1]),u=h;return f}}();});var zs=To(()=>{});var Zs=To(()=>{});var Ao={};gr(Ao,{defineExtension:()=>So,getExtensionContext:()=>Ro});function So(e){return typeof e=="function"?e:r=>r.$extends(e)}function Ro(e){return e}var Io={};gr(Io,{validator:()=>Co});function Co(...e){return r=>r}var $t={};gr($t,{$:()=>No,bgBlack:()=>fu,bgBlue:()=>bu,bgCyan:()=>wu,bgGreen:()=>hu,bgMagenta:()=>Eu,bgRed:()=>gu,bgWhite:()=>xu,bgYellow:()=>yu,black:()=>cu,blue:()=>tr,bold:()=>Q,cyan:()=>De,dim:()=>Ce,gray:()=>Jr,green:()=>$e,grey:()=>mu,hidden:()=>lu,inverse:()=>au,italic:()=>su,magenta:()=>pu,red:()=>ue,reset:()=>ou,strikethrough:()=>uu,underline:()=>H,white:()=>du,yellow:()=>Ie});var Hn,Do,Oo,ko,_o=true;typeof process$2<"u"&&({FORCE_COLOR:Hn,NODE_DISABLE_COLORS:Do,NO_COLOR:Oo,TERM:ko}=process$2.env||{},_o=process$2.stdout&&process$2.stdout.isTTY);var No={enabled:!Do&&Oo==null&&ko!=="dumb"&&(Hn!=null&&Hn!=="0"||_o)};function N(e,r){let t=new RegExp(`\\x1b\\[${r}m`,"g"),n=`\x1B[${e}m`,i=`\x1B[${r}m`;return function(o){return !No.enabled||o==null?o:n+(~(""+o).indexOf(i)?o.replace(t,i+n):o)+i}}var ou=N(0,0),Q=N(1,22),Ce=N(2,22),su=N(3,23),H=N(4,24),au=N(7,27),lu=N(8,28),uu=N(9,29),cu=N(30,39),ue=N(31,39),$e=N(32,39),Ie=N(33,39),tr=N(34,39),pu=N(35,39),De=N(36,39),du=N(37,39),Jr=N(90,39),mu=N(90,39),fu=N(40,49),gu=N(41,49),hu=N(42,49),yu=N(43,49),bu=N(44,49),Eu=N(45,49),wu=N(46,49),xu=N(47,49);var vu=100,Lo=["green","yellow","blue","magenta","cyan","red"],Kr=[],Fo=Date.now(),Pu=0,Yn=typeof process$2<"u"?process$2.env:{};globalThis.DEBUG??=Yn.DEBUG??"";globalThis.DEBUG_COLORS??=Yn.DEBUG_COLORS?Yn.DEBUG_COLORS==="true":true;var Hr={enable(e){typeof e=="string"&&(globalThis.DEBUG=e);},disable(){let e=globalThis.DEBUG;return globalThis.DEBUG="",e},enabled(e){let r=globalThis.DEBUG.split(",").map(i=>i.replace(/[.+?^${}()|[\]\\]/g,"\\$&")),t=r.some(i=>i===""||i[0]==="-"?false:e.match(RegExp(i.split("*").join(".*")+"$"))),n=r.some(i=>i===""||i[0]!=="-"?false:e.match(RegExp(i.slice(1).split("*").join(".*")+"$")));return t&&!n},log:(...e)=>{let[r,t,...n]=e;(console.warn??console.log)(`${r} ${t}`,...n);},formatters:{}};function Tu(e){let r={color:Lo[Pu++%Lo.length],enabled:Hr.enabled(e),namespace:e,log:Hr.log,extend:()=>{}},t=(...n)=>{let{enabled:i,namespace:o,color:s,log:a}=r;if(n.length!==0&&Kr.push([o,...n]),Kr.length>vu&&Kr.shift(),Hr.enabled(o)||i){let l=n.map(c=>typeof c=="string"?c:Su(c)),u=`+${Date.now()-Fo}ms`;Fo=Date.now(),globalThis.DEBUG_COLORS?a($t[s](Q(o)),...l,$t[s](u)):a(o,...l,u);}};return new Proxy(t,{get:(n,i)=>r[i],set:(n,i,o)=>r[i]=o})}var L=new Proxy(Tu,{get:(e,r)=>Hr[r],set:(e,r,t)=>Hr[r]=t});function Su(e,r=2){let t=new Set;return JSON.stringify(e,(n,i)=>{if(typeof i=="object"&&i!==null){if(t.has(i))return "[Circular *]";t.add(i);}else if(typeof i=="bigint")return i.toString();return i},r)}function Mo(e=7500){let r=Kr.map(([t,...n])=>`${t} ${n.map(i=>typeof i=="string"?i:JSON.stringify(i)).join(" ")}`).join(`
`);return r.length<e?r:r.slice(-e)}function $o(){Kr.length=0;}var hr=L;function zn(){let e=process$2.env.PRISMA_QUERY_ENGINE_LIBRARY;if(!(e&&Ci.existsSync(e))&&process$2.arch==="ia32")throw new Error('The default query engine type (Node-API, "library") is currently not supported for 32bit Node. Please set `engineType = "binary"` in the "generator" block of your "schema.prisma" file (or use the environment variables "PRISMA_CLIENT_ENGINE_TYPE=binary" and/or "PRISMA_CLI_QUERY_ENGINE_TYPE=binary".)')}var Zn=["darwin","darwin-arm64","debian-openssl-1.0.x","debian-openssl-1.1.x","debian-openssl-3.0.x","rhel-openssl-1.0.x","rhel-openssl-1.1.x","rhel-openssl-3.0.x","linux-arm64-openssl-1.1.x","linux-arm64-openssl-1.0.x","linux-arm64-openssl-3.0.x","linux-arm-openssl-1.1.x","linux-arm-openssl-1.0.x","linux-arm-openssl-3.0.x","linux-musl","linux-musl-openssl-3.0.x","linux-musl-arm64-openssl-1.1.x","linux-musl-arm64-openssl-3.0.x","linux-nixos","linux-static-x64","linux-static-arm64","windows","freebsd11","freebsd12","freebsd13","freebsd14","freebsd15","openbsd","netbsd","arm"];var qt="libquery_engine";function Vt(e,r){return e.includes("windows")?`query_engine-${e}.dll.node`:e.includes("darwin")?`${qt}-${e}.dylib.node`:`${qt}-${e}.so.node`}var Oe=Symbol.for("@ts-pattern/matcher"),Au=Symbol.for("@ts-pattern/isVariadic"),Bt="@ts-pattern/anonymous-select-key",Xn=e=>!!(e&&typeof e=="object"),jt=e=>e&&!!e[Oe],Ee=(e,r,t)=>{if(jt(e)){let n=e[Oe](),{matched:i,selections:o}=n.match(r);return i&&o&&Object.keys(o).forEach(s=>t(s,o[s])),i}if(Xn(e)){if(!Xn(r))return  false;if(Array.isArray(e)){if(!Array.isArray(r))return  false;let n=[],i=[],o=[];for(let s of e.keys()){let a=e[s];jt(a)&&a[Au]?o.push(a):o.length?i.push(a):n.push(a);}if(o.length){if(o.length>1)throw new Error("Pattern error: Using `...P.array(...)` several times in a single pattern is not allowed.");if(r.length<n.length+i.length)return  false;let s=r.slice(0,n.length),a=i.length===0?[]:r.slice(-i.length),l=r.slice(n.length,i.length===0?1/0:-i.length);return n.every((u,c)=>Ee(u,s[c],t))&&i.every((u,c)=>Ee(u,a[c],t))&&(o.length===0||Ee(o[0],l,t))}return e.length===r.length&&e.every((s,a)=>Ee(s,r[a],t))}return Reflect.ownKeys(e).every(n=>{let i=e[n];return (n in r||jt(o=i)&&o[Oe]().matcherType==="optional")&&Ee(i,r[n],t);var o;})}return Object.is(r,e)},Ue=e=>{var r,t,n;return Xn(e)?jt(e)?(r=(t=(n=e[Oe]()).getSelectionKeys)==null?void 0:t.call(n))!=null?r:[]:Array.isArray(e)?Yr(e,Ue):Yr(Object.values(e),Ue):[]},Yr=(e,r)=>e.reduce((t,n)=>t.concat(r(n)),[]);function ce(e){return Object.assign(e,{optional:()=>Cu(e),and:r=>$(e,r),or:r=>Iu(e,r),select:r=>r===void 0?qo(e):qo(r,e)})}function Cu(e){return ce({[Oe]:()=>({match:r=>{let t={},n=(i,o)=>{t[i]=o;};return r===void 0?(Ue(e).forEach(i=>n(i,void 0)),{matched:true,selections:t}):{matched:Ee(e,r,n),selections:t}},getSelectionKeys:()=>Ue(e),matcherType:"optional"})})}function $(...e){return ce({[Oe]:()=>({match:r=>{let t={},n=(i,o)=>{t[i]=o;};return {matched:e.every(i=>Ee(i,r,n)),selections:t}},getSelectionKeys:()=>Yr(e,Ue),matcherType:"and"})})}function Iu(...e){return ce({[Oe]:()=>({match:r=>{let t={},n=(i,o)=>{t[i]=o;};return Yr(e,Ue).forEach(i=>n(i,void 0)),{matched:e.some(i=>Ee(i,r,n)),selections:t}},getSelectionKeys:()=>Yr(e,Ue),matcherType:"or"})})}function A(e){return {[Oe]:()=>({match:r=>({matched:!!e(r)})})}}function qo(...e){let r=typeof e[0]=="string"?e[0]:void 0,t=e.length===2?e[1]:typeof e[0]=="string"?void 0:e[0];return ce({[Oe]:()=>({match:n=>{let i={[r??Bt]:n};return {matched:t===void 0||Ee(t,n,(o,s)=>{i[o]=s;}),selections:i}},getSelectionKeys:()=>[r??Bt].concat(t===void 0?[]:Ue(t))})})}function ye(e){return typeof e=="number"}function qe(e){return typeof e=="string"}function Ve(e){return typeof e=="bigint"}ce(A(function(e){return  true}));var je=e=>Object.assign(ce(e),{startsWith:r=>{return je($(e,(t=r,A(n=>qe(n)&&n.startsWith(t)))));var t;},endsWith:r=>{return je($(e,(t=r,A(n=>qe(n)&&n.endsWith(t)))));var t;},minLength:r=>je($(e,(t=>A(n=>qe(n)&&n.length>=t))(r))),length:r=>je($(e,(t=>A(n=>qe(n)&&n.length===t))(r))),maxLength:r=>je($(e,(t=>A(n=>qe(n)&&n.length<=t))(r))),includes:r=>{return je($(e,(t=r,A(n=>qe(n)&&n.includes(t)))));var t;},regex:r=>{return je($(e,(t=r,A(n=>qe(n)&&!!n.match(t)))));var t;}});je(A(qe));var be=e=>Object.assign(ce(e),{between:(r,t)=>be($(e,((n,i)=>A(o=>ye(o)&&n<=o&&i>=o))(r,t))),lt:r=>be($(e,(t=>A(n=>ye(n)&&n<t))(r))),gt:r=>be($(e,(t=>A(n=>ye(n)&&n>t))(r))),lte:r=>be($(e,(t=>A(n=>ye(n)&&n<=t))(r))),gte:r=>be($(e,(t=>A(n=>ye(n)&&n>=t))(r))),int:()=>be($(e,A(r=>ye(r)&&Number.isInteger(r)))),finite:()=>be($(e,A(r=>ye(r)&&Number.isFinite(r)))),positive:()=>be($(e,A(r=>ye(r)&&r>0))),negative:()=>be($(e,A(r=>ye(r)&&r<0)))});be(A(ye));var Be=e=>Object.assign(ce(e),{between:(r,t)=>Be($(e,((n,i)=>A(o=>Ve(o)&&n<=o&&i>=o))(r,t))),lt:r=>Be($(e,(t=>A(n=>Ve(n)&&n<t))(r))),gt:r=>Be($(e,(t=>A(n=>Ve(n)&&n>t))(r))),lte:r=>Be($(e,(t=>A(n=>Ve(n)&&n<=t))(r))),gte:r=>Be($(e,(t=>A(n=>Ve(n)&&n>=t))(r))),positive:()=>Be($(e,A(r=>Ve(r)&&r>0))),negative:()=>Be($(e,A(r=>Ve(r)&&r<0)))});Be(A(Ve));ce(A(function(e){return typeof e=="boolean"}));ce(A(function(e){return typeof e=="symbol"}));ce(A(function(e){return e==null}));ce(A(function(e){return e!=null}));var ei=class extends Error{constructor(r){let t;try{t=JSON.stringify(r);}catch{t=r;}super(`Pattern matching error: no pattern matches value ${t}`),this.input=void 0,this.input=r;}},ri={matched:false,value:void 0};function yr(e){return new ti(e,ri)}var ti=class e{constructor(r,t){this.input=void 0,this.state=void 0,this.input=r,this.state=t;}with(...r){if(this.state.matched)return this;let t=r[r.length-1],n=[r[0]],i;r.length===3&&typeof r[1]=="function"?i=r[1]:r.length>2&&n.push(...r.slice(1,r.length-1));let o=false,s={},a=(u,c)=>{o=true,s[u]=c;},l=!n.some(u=>Ee(u,this.input,a))||i&&!i(this.input)?ri:{matched:true,value:t(o?Bt in s?s[Bt]:s:this.input,this.input)};return new e(this.input,l)}when(r,t){if(this.state.matched)return this;let n=!!r(this.input);return new e(this.input,n?{matched:true,value:t(this.input,this.input)}:ri)}otherwise(r){return this.state.matched?this.state.value:r(this.input)}exhaustive(){if(this.state.matched)return this.state.value;throw new ei(this.input)}run(){return this.exhaustive()}returnType(){return this}};var Du={warn:Ie("prisma:warn")},Ou={warn:()=>!process$2.env.PRISMA_DISABLE_WARNINGS};function Ut(e,...r){Ou.warn()&&console.warn(`${Du.warn} ${e}`,...r);}var Nu=promisify(ku.exec),z=hr("prisma:get-platform"),Lu=["1.0.x","1.1.x","3.0.x"];async function Uo(){let e=ni.platform(),r=process$2.arch;if(e==="freebsd"){let s=await Qt("freebsd-version");if(s&&s.trim().length>0){let l=/^(\d+)\.?/.exec(s);if(l)return {platform:"freebsd",targetDistro:`freebsd${l[1]}`,arch:r}}}if(e!=="linux")return {platform:e,arch:r};let t=await Mu(),n=await Qu(),i=qu({arch:r,archFromUname:n,familyDistro:t.familyDistro}),{libssl:o}=await Vu(i);return {platform:"linux",libssl:o,arch:r,archFromUname:n,...t}}function Fu(e){let r=/^ID="?([^"\n]*)"?$/im,t=/^ID_LIKE="?([^"\n]*)"?$/im,n=r.exec(e),i=n&&n[1]&&n[1].toLowerCase()||"",o=t.exec(e),s=o&&o[1]&&o[1].toLowerCase()||"",a=yr({id:i,idLike:s}).with({id:"alpine"},({id:l})=>({targetDistro:"musl",familyDistro:l,originalDistro:l})).with({id:"raspbian"},({id:l})=>({targetDistro:"arm",familyDistro:"debian",originalDistro:l})).with({id:"nixos"},({id:l})=>({targetDistro:"nixos",originalDistro:l,familyDistro:"nixos"})).with({id:"debian"},{id:"ubuntu"},({id:l})=>({targetDistro:"debian",familyDistro:"debian",originalDistro:l})).with({id:"rhel"},{id:"centos"},{id:"fedora"},({id:l})=>({targetDistro:"rhel",familyDistro:"rhel",originalDistro:l})).when(({idLike:l})=>l.includes("debian")||l.includes("ubuntu"),({id:l})=>({targetDistro:"debian",familyDistro:"debian",originalDistro:l})).when(({idLike:l})=>i==="arch"||l.includes("arch"),({id:l})=>({targetDistro:"debian",familyDistro:"arch",originalDistro:l})).when(({idLike:l})=>l.includes("centos")||l.includes("fedora")||l.includes("rhel")||l.includes("suse"),({id:l})=>({targetDistro:"rhel",familyDistro:"rhel",originalDistro:l})).otherwise(({id:l})=>({targetDistro:void 0,familyDistro:void 0,originalDistro:l}));return z(`Found distro info:
${JSON.stringify(a,null,2)}`),a}async function Mu(){let e="/etc/os-release";try{let r=await Bo.readFile(e,{encoding:"utf-8"});return Fu(r)}catch{return {targetDistro:void 0,familyDistro:void 0,originalDistro:void 0}}}function $u(e){let r=/^OpenSSL\s(\d+\.\d+)\.\d+/.exec(e);if(r){let t=`${r[1]}.x`;return Go(t)}}function Vo(e){let r=/libssl\.so\.(\d)(\.\d)?/.exec(e);if(r){let t=`${r[1]}${r[2]??".0"}.x`;return Go(t)}}function Go(e){let r=(()=>{if(Wo(e))return e;let t=e.split(".");return t[1]="0",t.join(".")})();if(Lu.includes(r))return r}function qu(e){return yr(e).with({familyDistro:"musl"},()=>(z('Trying platform-specific paths for "alpine"'),["/lib","/usr/lib"])).with({familyDistro:"debian"},({archFromUname:r})=>(z('Trying platform-specific paths for "debian" (and "ubuntu")'),[`/usr/lib/${r}-linux-gnu`,`/lib/${r}-linux-gnu`])).with({familyDistro:"rhel"},()=>(z('Trying platform-specific paths for "rhel"'),["/lib64","/usr/lib64"])).otherwise(({familyDistro:r,arch:t,archFromUname:n})=>(z(`Don't know any platform-specific paths for "${r}" on ${t} (${n})`),[]))}async function Vu(e){let r='grep -v "libssl.so.0"',t=await jo(e);if(t){z(`Found libssl.so file using platform-specific paths: ${t}`);let o=Vo(t);if(z(`The parsed libssl version is: ${o}`),o)return {libssl:o,strategy:"libssl-specific-path"}}z('Falling back to "ldconfig" and other generic paths');let n=await Qt(`ldconfig -p | sed "s/.*=>s*//" | sed "s|.*/||" | grep libssl | sort | ${r}`);if(n||(n=await jo(["/lib64","/usr/lib64","/lib","/usr/lib"])),n){z(`Found libssl.so file using "ldconfig" or other generic paths: ${n}`);let o=Vo(n);if(z(`The parsed libssl version is: ${o}`),o)return {libssl:o,strategy:"ldconfig"}}let i=await Qt("openssl version -v");if(i){z(`Found openssl binary with version: ${i}`);let o=$u(i);if(z(`The parsed openssl version is: ${o}`),o)return {libssl:o,strategy:"openssl-binary"}}return z("Couldn't find any version of libssl or OpenSSL in the system"),{}}async function jo(e){for(let r of e){let t=await ju(r);if(t)return t}}async function ju(e){try{return (await Bo.readdir(e)).find(t=>t.startsWith("libssl.so.")&&!t.startsWith("libssl.so.0"))}catch(r){if(r.code==="ENOENT")return;throw r}}async function nr(){let{binaryTarget:e}=await Qo();return e}function Bu(e){return e.binaryTarget!==void 0}async function ii(){let{memoized:e,...r}=await Qo();return r}var Gt={};async function Qo(){if(Bu(Gt))return Promise.resolve({...Gt,memoized:true});let e=await Uo(),r=Uu(e);return Gt={...e,binaryTarget:r},{...Gt,memoized:false}}function Uu(e){let{platform:r,arch:t,archFromUname:n,libssl:i,targetDistro:o,familyDistro:s,originalDistro:a}=e;r==="linux"&&!["x64","arm64"].includes(t)&&Ut(`Prisma only officially supports Linux on amd64 (x86_64) and arm64 (aarch64) system architectures (detected "${t}" instead). If you are using your own custom Prisma engines, you can ignore this warning, as long as you've compiled the engines for your system architecture "${n}".`);let l="1.1.x";if(r==="linux"&&i===void 0){let c=yr({familyDistro:s}).with({familyDistro:"debian"},()=>"Please manually install OpenSSL via `apt-get update -y && apt-get install -y openssl` and try installing Prisma again. If you're running Prisma on Docker, add this command to your Dockerfile, or switch to an image that already has OpenSSL installed.").otherwise(()=>"Please manually install OpenSSL and try installing Prisma again.");Ut(`Prisma failed to detect the libssl/openssl version to use, and may not work as expected. Defaulting to "openssl-${l}".
${c}`);}let u="debian";if(r==="linux"&&o===void 0&&z(`Distro is "${a}". Falling back to Prisma engines built for "${u}".`),r==="darwin"&&t==="arm64")return "darwin-arm64";if(r==="darwin")return "darwin";if(r==="win32")return "windows";if(r==="freebsd")return o;if(r==="openbsd")return "openbsd";if(r==="netbsd")return "netbsd";if(r==="linux"&&o==="nixos")return "linux-nixos";if(r==="linux"&&t==="arm64")return `${o==="musl"?"linux-musl-arm64":"linux-arm64"}-openssl-${i||l}`;if(r==="linux"&&t==="arm")return `linux-arm-openssl-${i||l}`;if(r==="linux"&&o==="musl"){let c="linux-musl";return !i||Wo(i)?c:`${c}-openssl-${i}`}return r==="linux"&&o&&i?`${o}-openssl-${i}`:(r!=="linux"&&Ut(`Prisma detected unknown OS "${r}" and may not work as expected. Defaulting to "linux".`),i?`${u}-openssl-${i}`:o?`${o}-openssl-${l}`:`${u}-openssl-${l}`)}async function Gu(e){try{return await e()}catch{return}}function Qt(e){return Gu(async()=>{let r=await Nu(e);return z(`Command "${e}" successfully returned "${r.stdout}"`),r.stdout})}async function Qu(){return typeof ni.machine=="function"?ni.machine():(await Qt("uname -m"))?.trim()}function Wo(e){return e.startsWith("1.")}var Jt={};gr(Jt,{beep:()=>yc,clearScreen:()=>mc,clearTerminal:()=>fc,cursorBackward:()=>Zu,cursorDown:()=>Yu,cursorForward:()=>zu,cursorGetPosition:()=>rc,cursorHide:()=>ic,cursorLeft:()=>Ho,cursorMove:()=>Hu,cursorNextLine:()=>tc,cursorPrevLine:()=>nc,cursorRestorePosition:()=>ec,cursorSavePosition:()=>Xu,cursorShow:()=>oc,cursorTo:()=>Ku,cursorUp:()=>Ko,enterAlternativeScreen:()=>gc,eraseDown:()=>uc,eraseEndLine:()=>ac,eraseLine:()=>Yo,eraseLines:()=>sc,eraseScreen:()=>oi,eraseStartLine:()=>lc,eraseUp:()=>cc,exitAlternativeScreen:()=>hc,iTerm:()=>wc,image:()=>Ec,link:()=>bc,scrollDown:()=>dc,scrollUp:()=>pc});var Wt=globalThis.window?.document!==void 0;globalThis.process?.versions?.node!==void 0;globalThis.process?.versions?.bun!==void 0;globalThis.Deno?.version?.deno!==void 0;globalThis.process?.versions?.electron!==void 0;globalThis.navigator?.userAgent?.includes("jsdom")===true;typeof WorkerGlobalScope<"u"&&globalThis instanceof WorkerGlobalScope;typeof DedicatedWorkerGlobalScope<"u"&&globalThis instanceof DedicatedWorkerGlobalScope;typeof SharedWorkerGlobalScope<"u"&&globalThis instanceof SharedWorkerGlobalScope;typeof ServiceWorkerGlobalScope<"u"&&globalThis instanceof ServiceWorkerGlobalScope;var zr=globalThis.navigator?.userAgentData?.platform;zr==="macOS"||globalThis.navigator?.platform==="MacIntel"||globalThis.navigator?.userAgent?.includes(" Mac ")===true||globalThis.process?.platform==="darwin";zr==="Windows"||globalThis.navigator?.platform==="Win32"||globalThis.process?.platform==="win32";zr==="Linux"||globalThis.navigator?.platform?.startsWith("Linux")===true||globalThis.navigator?.userAgent?.includes(" Linux ")===true||globalThis.process?.platform==="linux";zr==="Android"||globalThis.navigator?.platform==="Android"||globalThis.navigator?.userAgent?.includes(" Android ")===true||globalThis.process?.platform==="android";var C="\x1B[",Xr="\x1B]",br="\x07",Zr=";",Jo=!Wt&&process__default.env.TERM_PROGRAM==="Apple_Terminal",Wu=!Wt&&process__default.platform==="win32",Ju=Wt?()=>{throw new Error("`process.cwd()` only works in Node.js, not the browser.")}:process__default.cwd,Ku=(e,r)=>{if(typeof e!="number")throw new TypeError("The `x` argument is required");return typeof r!="number"?C+(e+1)+"G":C+(r+1)+Zr+(e+1)+"H"},Hu=(e,r)=>{if(typeof e!="number")throw new TypeError("The `x` argument is required");let t="";return e<0?t+=C+-e+"D":e>0&&(t+=C+e+"C"),r<0?t+=C+-r+"A":r>0&&(t+=C+r+"B"),t},Ko=(e=1)=>C+e+"A",Yu=(e=1)=>C+e+"B",zu=(e=1)=>C+e+"C",Zu=(e=1)=>C+e+"D",Ho=C+"G",Xu=Jo?"\x1B7":C+"s",ec=Jo?"\x1B8":C+"u",rc=C+"6n",tc=C+"E",nc=C+"F",ic=C+"?25l",oc=C+"?25h",sc=e=>{let r="";for(let t=0;t<e;t++)r+=Yo+(t<e-1?Ko():"");return e&&(r+=Ho),r},ac=C+"K",lc=C+"1K",Yo=C+"2K",uc=C+"J",cc=C+"1J",oi=C+"2J",pc=C+"S",dc=C+"T",mc="\x1Bc",fc=Wu?`${oi}${C}0f`:`${oi}${C}3J${C}H`,gc=C+"?1049h",hc=C+"?1049l",yc=br,bc=(e,r)=>[Xr,"8",Zr,Zr,r,br,e,Xr,"8",Zr,Zr,br].join(""),Ec=(e,r={})=>{let t=`${Xr}1337;File=inline=1`;return r.width&&(t+=`;width=${r.width}`),r.height&&(t+=`;height=${r.height}`),r.preserveAspectRatio===false&&(t+=";preserveAspectRatio=0"),t+":"+Buffer.from(e).toString("base64")+br},wc={setCwd:(e=Ju())=>`${Xr}50;CurrentDir=${e}${br}`,annotation(e,r={}){let t=`${Xr}1337;`,n=r.x!==void 0,i=r.y!==void 0;if((n||i)&&!(n&&i&&r.length!==void 0))throw new Error("`x`, `y` and `length` must be defined when `x` or `y` is defined");return e=e.replaceAll("|",""),t+=r.isHidden?"AddHiddenAnnotation=":"AddAnnotation=",r.length>0?t+=(n?[e,r.length,r.x,r.y]:[r.length,e]).join("|"):t+=e,t+br}};var Kt=le(ns(),1);function ir(e,r,{target:t="stdout",...n}={}){return Kt.default[t]?Jt.link(e,r):n.fallback===false?e:typeof n.fallback=="function"?n.fallback(e,r):`${e} (\u200B${r}\u200B)`}ir.isSupported=Kt.default.stdout;ir.stderr=(e,r,t={})=>ir(e,r,{target:"stderr",...t});ir.stderr.isSupported=Kt.default.stderr;function pi(e){return ir(e,e,{fallback:H})}var Sc=is(),di=Sc.version;function wr(e){let r=Rc();return r||(e?.config.engineType==="library"?"library":e?.config.engineType==="binary"?"binary":e?.config.engineType==="client"?"client":Ac())}function Rc(){let e=process$2.env.PRISMA_CLIENT_ENGINE_TYPE;return e==="library"?"library":e==="binary"?"binary":e==="client"?"client":void 0}function Ac(){return "library"}function mi(e){return e.name==="DriverAdapterError"&&typeof e.cause=="object"}function Ht(e){return {ok:true,value:e,map(r){return Ht(r(e))},flatMap(r){return r(e)}}}function or(e){return {ok:false,error:e,map(){return or(e)},flatMap(){return or(e)}}}var os=L("driver-adapter-utils"),fi=class{registeredErrors=[];consumeError(r){return this.registeredErrors[r]}registerNewError(r){let t=0;for(;this.registeredErrors[t]!==void 0;)t++;return this.registeredErrors[t]={error:r},t}};var Yt=(e,r=new fi)=>{let t={adapterName:e.adapterName,errorRegistry:r,queryRaw:ke(r,e.queryRaw.bind(e)),executeRaw:ke(r,e.executeRaw.bind(e)),executeScript:ke(r,e.executeScript.bind(e)),dispose:ke(r,e.dispose.bind(e)),provider:e.provider,startTransaction:async(...n)=>(await ke(r,e.startTransaction.bind(e))(...n)).map(o=>Cc(r,o))};return e.getConnectionInfo&&(t.getConnectionInfo=Ic(r,e.getConnectionInfo.bind(e))),t},Cc=(e,r)=>({adapterName:r.adapterName,provider:r.provider,options:r.options,queryRaw:ke(e,r.queryRaw.bind(r)),executeRaw:ke(e,r.executeRaw.bind(r)),commit:ke(e,r.commit.bind(r)),rollback:ke(e,r.rollback.bind(r))});function ke(e,r){return async(...t)=>{try{return Ht(await r(...t))}catch(n){if(os("[error@wrapAsync]",n),mi(n))return or(n.cause);let i=e.registerNewError(n);return or({kind:"GenericJs",id:i})}}}function Ic(e,r){return (...t)=>{try{return Ht(r(...t))}catch(n){if(os("[error@wrapSync]",n),mi(n))return or(n.cause);let i=e.registerNewError(n);return or({kind:"GenericJs",id:i})}}}le(Zt());le(Zt());L("prisma:engines");function ss(){return M__default.join(__dirname,"../")}M__default.join(__dirname,"../query-engine-darwin");M__default.join(__dirname,"../query-engine-darwin-arm64");M__default.join(__dirname,"../query-engine-debian-openssl-1.0.x");M__default.join(__dirname,"../query-engine-debian-openssl-1.1.x");M__default.join(__dirname,"../query-engine-debian-openssl-3.0.x");M__default.join(__dirname,"../query-engine-linux-static-x64");M__default.join(__dirname,"../query-engine-linux-static-arm64");M__default.join(__dirname,"../query-engine-rhel-openssl-1.0.x");M__default.join(__dirname,"../query-engine-rhel-openssl-1.1.x");M__default.join(__dirname,"../query-engine-rhel-openssl-3.0.x");M__default.join(__dirname,"../libquery_engine-darwin.dylib.node");M__default.join(__dirname,"../libquery_engine-darwin-arm64.dylib.node");M__default.join(__dirname,"../libquery_engine-debian-openssl-1.0.x.so.node");M__default.join(__dirname,"../libquery_engine-debian-openssl-1.1.x.so.node");M__default.join(__dirname,"../libquery_engine-debian-openssl-3.0.x.so.node");M__default.join(__dirname,"../libquery_engine-linux-arm64-openssl-1.0.x.so.node");M__default.join(__dirname,"../libquery_engine-linux-arm64-openssl-1.1.x.so.node");M__default.join(__dirname,"../libquery_engine-linux-arm64-openssl-3.0.x.so.node");M__default.join(__dirname,"../libquery_engine-linux-musl.so.node");M__default.join(__dirname,"../libquery_engine-linux-musl-openssl-3.0.x.so.node");M__default.join(__dirname,"../libquery_engine-rhel-openssl-1.0.x.so.node");M__default.join(__dirname,"../libquery_engine-rhel-openssl-1.1.x.so.node");M__default.join(__dirname,"../libquery_engine-rhel-openssl-3.0.x.so.node");M__default.join(__dirname,"../query_engine-windows.dll.node");hr("chmodPlusX");function yi(e){let r=e.e,t=a=>`Prisma cannot find the required \`${a}\` system library in your system`,n=r.message.includes("cannot open shared object file"),i=`Please refer to the documentation about Prisma's system requirements: ${pi("https://pris.ly/d/system-requirements")}`,o=`Unable to require(\`${Ce(e.id)}\`).`,s=yr({message:r.message,code:r.code}).with({code:"ENOENT"},()=>"File does not exist.").when(({message:a})=>n&&a.includes("libz"),()=>`${t("libz")}. Please install it and try again.`).when(({message:a})=>n&&a.includes("libgcc_s"),()=>`${t("libgcc_s")}. Please install it and try again.`).when(({message:a})=>n&&a.includes("libssl"),()=>{let a=e.platformInfo.libssl?`openssl-${e.platformInfo.libssl}`:"openssl";return `${t("libssl")}. Please install ${a} and try again.`}).when(({message:a})=>a.includes("GLIBC"),()=>`Prisma has detected an incompatible version of the \`glibc\` C standard library installed in your system. This probably means your system may be too old to run Prisma. ${i}`).when(({message:a})=>e.platformInfo.platform==="linux"&&a.includes("symbol not found"),()=>`The Prisma engines are not compatible with your system ${e.platformInfo.originalDistro} on (${e.platformInfo.archFromUname}) which uses the \`${e.platformInfo.binaryTarget}\` binaryTarget by default. ${i}`).otherwise(()=>`The Prisma engines do not seem to be compatible with your system. ${i}`);return `${o}
${s}

Details: ${r.message}`}le(cs(),1);var ds="prisma+postgres",Xt=`${ds}:`;function en(e){return e?.toString().startsWith(`${Xt}//`)??false}function Ei(e){if(!en(e))return  false;let{host:r}=new URL(e);return r.includes("localhost")||r.includes("127.0.0.1")||r.includes("[::1]")}var fs=le(wi());function vi(e){return String(new xi(e))}var xi=class{constructor(r){this.config=r;}toString(){let{config:r}=this,t=r.provider.fromEnvVar?`env("${r.provider.fromEnvVar}")`:r.provider.value,n=JSON.parse(JSON.stringify({provider:t,binaryTargets:_c(r.binaryTargets)}));return `generator ${r.name} {
${(0, fs.default)(Nc(n),2)}
}`}};function _c(e){let r;if(e.length>0){let t=e.find(n=>n.fromEnvVar!==null);t?r=`env("${t.fromEnvVar}")`:r=e.map(n=>n.native?"native":n.value);}else r=void 0;return r}function Nc(e){let r=Object.keys(e).reduce((t,n)=>Math.max(t,n.length),0);return Object.entries(e).map(([t,n])=>`${t.padEnd(r)} = ${Lc(n)}`).join(`
`)}function Lc(e){return JSON.parse(JSON.stringify(e,(r,t)=>Array.isArray(t)?`[${t.map(n=>JSON.stringify(n)).join(", ")}]`:JSON.stringify(t)))}var rt={};gr(rt,{error:()=>$c,info:()=>Mc,log:()=>Fc,query:()=>qc,should:()=>gs,tags:()=>et,warn:()=>Pi});var et={error:ue("prisma:error"),warn:Ie("prisma:warn"),info:De("prisma:info"),query:tr("prisma:query")},gs={warn:()=>!process$2.env.PRISMA_DISABLE_WARNINGS};function Fc(...e){console.log(...e);}function Pi(e,...r){gs.warn()&&console.warn(`${et.warn} ${e}`,...r);}function Mc(e,...r){console.info(`${et.info} ${e}`,...r);}function $c(e,...r){console.error(`${et.error} ${e}`,...r);}function qc(e,...r){console.log(`${et.query} ${e}`,...r);}function rn(e,r){if(!e)throw new Error(`${r}. This should never happen. If you see this error, please, open an issue at https://pris.ly/prisma-prisma-bug-report`)}function sr(e,r){throw new Error(r)}function Ti({onlyFirst:e=false}={}){let t=["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?(?:\\u0007|\\u001B\\u005C|\\u009C))","(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))"].join("|");return new RegExp(t,e?void 0:"g")}var Vc=Ti();function xr(e){if(typeof e!="string")throw new TypeError(`Expected a \`string\`, got \`${typeof e}\``);return e.replace(Vc,"")}function Si(e){return M__default.sep===M__default.posix.sep?e:e.split(M__default.sep).join(M__default.posix.sep)}var Di=le(xs());function vs(e){let r=e.ignoreProcessEnv?{}:process$2.env,t=n=>n.match(/(.?\${(?:[a-zA-Z0-9_]+)?})/g)?.reduce(function(o,s){let a=/(.?)\${([a-zA-Z0-9_]+)?}/g.exec(s);if(!a)return o;let l=a[1],u,c;if(l==="\\")c=a[0],u=c.replace("\\$","$");else {let p=a[2];c=a[0].substring(l.length),u=Object.hasOwnProperty.call(r,p)?r[p]:e.parsed[p]||"",u=t(u);}return o.replace(c,u)},n)??n;for(let n in e.parsed){let i=Object.hasOwnProperty.call(r,n)?r[n]:e.parsed[n];e.parsed[n]=t(i);}for(let n in e.parsed)r[n]=e.parsed[n];return e}var Ii=hr("prisma:tryLoadEnv");function it({rootEnvPath:e,schemaEnvPath:r},t={conflictCheck:"none"}){let n=Ps(e);t.conflictCheck!=="none"&&rp(n,r,t.conflictCheck);let i=null;return Ts(n?.path,r)||(i=Ps(r)),!n&&!i&&Ii("No Environment variables loaded"),i?.dotenvResult.error?console.error(ue(Q("Schema Env Error: "))+i.dotenvResult.error):{message:[n?.message,i?.message].filter(Boolean).join(`
`),parsed:{...n?.dotenvResult?.parsed,...i?.dotenvResult?.parsed}}}function rp(e,r,t){let n=e?.dotenvResult.parsed,i=!Ts(e?.path,r);if(n&&r&&i&&Ci.existsSync(r)){let o=Di.default.parse(Ci.readFileSync(r)),s=[];for(let a in o)n[a]===o[a]&&s.push(a);if(s.length>0){let a=M__default.relative(process$2.cwd(),e.path),l=M__default.relative(process$2.cwd(),r);if(t==="error"){let u=`There is a conflict between env var${s.length>1?"s":""} in ${H(a)} and ${H(l)}
Conflicting env vars:
${s.map(c=>`  ${Q(c)}`).join(`
`)}

We suggest to move the contents of ${H(l)} to ${H(a)} to consolidate your env vars.
`;throw new Error(u)}else if(t==="warn"){let u=`Conflict for env var${s.length>1?"s":""} ${s.map(c=>Q(c)).join(", ")} in ${H(a)} and ${H(l)}
Env vars from ${H(l)} overwrite the ones from ${H(a)}
      `;console.warn(`${Ie("warn(prisma)")} ${u}`);}}}}function Ps(e){if(tp(e)){Ii(`Environment variables loaded from ${e}`);let r=Di.default.config({path:e,debug:process$2.env.DOTENV_CONFIG_DEBUG?true:void 0});return {dotenvResult:vs(r),message:Ce(`Environment variables loaded from ${M__default.relative(process$2.cwd(),e)}`),path:e}}else Ii(`Environment variables not found at ${e}`);return null}function Ts(e,r){return e&&r&&M__default.resolve(e)===M__default.resolve(r)}function tp(e){return !!(e&&Ci.existsSync(e))}function Oi(e,r){return Object.prototype.hasOwnProperty.call(e,r)}function on(e,r){let t={};for(let n of Object.keys(e))t[n]=r(e[n],n);return t}function ki(e,r){if(e.length===0)return;let t=e[0];for(let n=1;n<e.length;n++)r(t,e[n])<0&&(t=e[n]);return t}function x(e,r){Object.defineProperty(e,"name",{value:r,configurable:true});}var Rs=new Set,sn=(e,r,...t)=>{Rs.has(e)||(Rs.add(e),Pi(r,...t));};var P=class e extends Error{clientVersion;errorCode;retryable;constructor(r,t,n){super(r),this.name="PrismaClientInitializationError",this.clientVersion=t,this.errorCode=n,Error.captureStackTrace(e);}get[Symbol.toStringTag](){return "PrismaClientInitializationError"}};x(P,"PrismaClientInitializationError");var Z=class extends Error{code;meta;clientVersion;batchRequestIdx;constructor(r,{code:t,clientVersion:n,meta:i,batchRequestIdx:o}){super(r),this.name="PrismaClientKnownRequestError",this.code=t,this.clientVersion=n,this.meta=i,Object.defineProperty(this,"batchRequestIdx",{value:o,enumerable:false,writable:true});}get[Symbol.toStringTag](){return "PrismaClientKnownRequestError"}};x(Z,"PrismaClientKnownRequestError");var de=class extends Error{clientVersion;constructor(r,t){super(r),this.name="PrismaClientRustPanicError",this.clientVersion=t;}get[Symbol.toStringTag](){return "PrismaClientRustPanicError"}};x(de,"PrismaClientRustPanicError");var q=class extends Error{clientVersion;batchRequestIdx;constructor(r,{clientVersion:t,batchRequestIdx:n}){super(r),this.name="PrismaClientUnknownRequestError",this.clientVersion=t,Object.defineProperty(this,"batchRequestIdx",{value:n,writable:true,enumerable:false});}get[Symbol.toStringTag](){return "PrismaClientUnknownRequestError"}};x(q,"PrismaClientUnknownRequestError");var X=class extends Error{name="PrismaClientValidationError";clientVersion;constructor(r,{clientVersion:t}){super(r),this.clientVersion=t;}get[Symbol.toStringTag](){return "PrismaClientValidationError"}};x(X,"PrismaClientValidationError");var we=class{_map=new Map;get(r){return this._map.get(r)?.value}set(r,t){this._map.set(r,{value:t});}getOrCreate(r,t){let n=this._map.get(r);if(n)return n.value;let i=t();return this.set(r,i),i}};function Qe(e){return e.substring(0,1).toLowerCase()+e.substring(1)}function As(e,r){let t={};for(let n of e){let i=n[r];t[i]=n;}return t}function ot(e){let r;return {get(){return r||(r={value:e()}),r.value}}}function vr(e){return e instanceof Date||Object.prototype.toString.call(e)==="[object Date]"}function ln(e){return e.toString()!=="Invalid Date"}var Pr=9e15,He=1e9,Ni="0123456789abcdef",pn="2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058",dn="3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789",Li={precision:20,rounding:4,modulo:1,toExpNeg:-7,toExpPos:21,minE:-Pr,maxE:Pr,crypto:false},Os,Ne,w=true,fn="[DecimalError] ",Ke=fn+"Invalid argument: ",ks=fn+"Precision limit exceeded",_s=fn+"crypto unavailable",Ns="[object Decimal]",Y=Math.floor,B=Math.pow,ip=/^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i,op=/^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i,sp=/^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i,Ls=/^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,fe=1e7,E=7,ap=9007199254740991,lp=pn.length-1,Fi=dn.length-1,m={toStringTag:Ns};m.absoluteValue=m.abs=function(){var e=new this.constructor(this);return e.s<0&&(e.s=1),y(e)};m.ceil=function(){return y(new this.constructor(this),this.e+1,2)};m.clampedTo=m.clamp=function(e,r){var t,n=this,i=n.constructor;if(e=new i(e),r=new i(r),!e.s||!r.s)return new i(NaN);if(e.gt(r))throw Error(Ke+r);return t=n.cmp(e),t<0?e:n.cmp(r)>0?r:new i(n)};m.comparedTo=m.cmp=function(e){var r,t,n,i,o=this,s=o.d,a=(e=new o.constructor(e)).d,l=o.s,u=e.s;if(!s||!a)return !l||!u?NaN:l!==u?l:s===a?0:!s^l<0?1:-1;if(!s[0]||!a[0])return s[0]?l:a[0]?-u:0;if(l!==u)return l;if(o.e!==e.e)return o.e>e.e^l<0?1:-1;for(n=s.length,i=a.length,r=0,t=n<i?n:i;r<t;++r)if(s[r]!==a[r])return s[r]>a[r]^l<0?1:-1;return n===i?0:n>i^l<0?1:-1};m.cosine=m.cos=function(){var e,r,t=this,n=t.constructor;return t.d?t.d[0]?(e=n.precision,r=n.rounding,n.precision=e+Math.max(t.e,t.sd())+E,n.rounding=1,t=up(n,Vs(n,t)),n.precision=e,n.rounding=r,y(Ne==2||Ne==3?t.neg():t,e,r,true)):new n(1):new n(NaN)};m.cubeRoot=m.cbrt=function(){var e,r,t,n,i,o,s,a,l,u,c=this,p=c.constructor;if(!c.isFinite()||c.isZero())return new p(c);for(w=false,o=c.s*B(c.s*c,1/3),!o||Math.abs(o)==1/0?(t=W(c.d),e=c.e,(o=(e-t.length+1)%3)&&(t+=o==1||o==-2?"0":"00"),o=B(t,1/3),e=Y((e+1)/3)-(e%3==(e<0?-1:2)),o==1/0?t="5e"+e:(t=o.toExponential(),t=t.slice(0,t.indexOf("e")+1)+e),n=new p(t),n.s=c.s):n=new p(o.toString()),s=(e=p.precision)+3;;)if(a=n,l=a.times(a).times(a),u=l.plus(c),n=_(u.plus(c).times(a),u.plus(l),s+2,1),W(a.d).slice(0,s)===(t=W(n.d)).slice(0,s))if(t=t.slice(s-3,s+1),t=="9999"||!i&&t=="4999"){if(!i&&(y(a,e+1,0),a.times(a).times(a).eq(c))){n=a;break}s+=4,i=1;}else {(!+t||!+t.slice(1)&&t.charAt(0)=="5")&&(y(n,e+1,1),r=!n.times(n).times(n).eq(c));break}return w=true,y(n,e,p.rounding,r)};m.decimalPlaces=m.dp=function(){var e,r=this.d,t=NaN;if(r){if(e=r.length-1,t=(e-Y(this.e/E))*E,e=r[e],e)for(;e%10==0;e/=10)t--;t<0&&(t=0);}return t};m.dividedBy=m.div=function(e){return _(this,new this.constructor(e))};m.dividedToIntegerBy=m.divToInt=function(e){var r=this,t=r.constructor;return y(_(r,new t(e),0,1,1),t.precision,t.rounding)};m.equals=m.eq=function(e){return this.cmp(e)===0};m.floor=function(){return y(new this.constructor(this),this.e+1,3)};m.greaterThan=m.gt=function(e){return this.cmp(e)>0};m.greaterThanOrEqualTo=m.gte=function(e){var r=this.cmp(e);return r==1||r===0};m.hyperbolicCosine=m.cosh=function(){var e,r,t,n,i,o=this,s=o.constructor,a=new s(1);if(!o.isFinite())return new s(o.s?1/0:NaN);if(o.isZero())return a;t=s.precision,n=s.rounding,s.precision=t+Math.max(o.e,o.sd())+4,s.rounding=1,i=o.d.length,i<32?(e=Math.ceil(i/3),r=(1/hn(4,e)).toString()):(e=16,r="2.3283064365386962890625e-10"),o=Tr(s,1,o.times(r),new s(1),true);for(var l,u=e,c=new s(8);u--;)l=o.times(o),o=a.minus(l.times(c.minus(l.times(c))));return y(o,s.precision=t,s.rounding=n,true)};m.hyperbolicSine=m.sinh=function(){var e,r,t,n,i=this,o=i.constructor;if(!i.isFinite()||i.isZero())return new o(i);if(r=o.precision,t=o.rounding,o.precision=r+Math.max(i.e,i.sd())+4,o.rounding=1,n=i.d.length,n<3)i=Tr(o,2,i,i,true);else {e=1.4*Math.sqrt(n),e=e>16?16:e|0,i=i.times(1/hn(5,e)),i=Tr(o,2,i,i,true);for(var s,a=new o(5),l=new o(16),u=new o(20);e--;)s=i.times(i),i=i.times(a.plus(s.times(l.times(s).plus(u))));}return o.precision=r,o.rounding=t,y(i,r,t,true)};m.hyperbolicTangent=m.tanh=function(){var e,r,t=this,n=t.constructor;return t.isFinite()?t.isZero()?new n(t):(e=n.precision,r=n.rounding,n.precision=e+7,n.rounding=1,_(t.sinh(),t.cosh(),n.precision=e,n.rounding=r)):new n(t.s)};m.inverseCosine=m.acos=function(){var e=this,r=e.constructor,t=e.abs().cmp(1),n=r.precision,i=r.rounding;return t!==-1?t===0?e.isNeg()?xe(r,n,i):new r(0):new r(NaN):e.isZero()?xe(r,n+4,i).times(.5):(r.precision=n+6,r.rounding=1,e=new r(1).minus(e).div(e.plus(1)).sqrt().atan(),r.precision=n,r.rounding=i,e.times(2))};m.inverseHyperbolicCosine=m.acosh=function(){var e,r,t=this,n=t.constructor;return t.lte(1)?new n(t.eq(1)?0:NaN):t.isFinite()?(e=n.precision,r=n.rounding,n.precision=e+Math.max(Math.abs(t.e),t.sd())+4,n.rounding=1,w=false,t=t.times(t).minus(1).sqrt().plus(t),w=true,n.precision=e,n.rounding=r,t.ln()):new n(t)};m.inverseHyperbolicSine=m.asinh=function(){var e,r,t=this,n=t.constructor;return !t.isFinite()||t.isZero()?new n(t):(e=n.precision,r=n.rounding,n.precision=e+2*Math.max(Math.abs(t.e),t.sd())+6,n.rounding=1,w=false,t=t.times(t).plus(1).sqrt().plus(t),w=true,n.precision=e,n.rounding=r,t.ln())};m.inverseHyperbolicTangent=m.atanh=function(){var e,r,t,n,i=this,o=i.constructor;return i.isFinite()?i.e>=0?new o(i.abs().eq(1)?i.s/0:i.isZero()?i:NaN):(e=o.precision,r=o.rounding,n=i.sd(),Math.max(n,e)<2*-i.e-1?y(new o(i),e,r,true):(o.precision=t=n-i.e,i=_(i.plus(1),new o(1).minus(i),t+e,1),o.precision=e+4,o.rounding=1,i=i.ln(),o.precision=e,o.rounding=r,i.times(.5))):new o(NaN)};m.inverseSine=m.asin=function(){var e,r,t,n,i=this,o=i.constructor;return i.isZero()?new o(i):(r=i.abs().cmp(1),t=o.precision,n=o.rounding,r!==-1?r===0?(e=xe(o,t+4,n).times(.5),e.s=i.s,e):new o(NaN):(o.precision=t+6,o.rounding=1,i=i.div(new o(1).minus(i.times(i)).sqrt().plus(1)).atan(),o.precision=t,o.rounding=n,i.times(2)))};m.inverseTangent=m.atan=function(){var e,r,t,n,i,o,s,a,l,u=this,c=u.constructor,p=c.precision,d=c.rounding;if(u.isFinite()){if(u.isZero())return new c(u);if(u.abs().eq(1)&&p+4<=Fi)return s=xe(c,p+4,d).times(.25),s.s=u.s,s}else {if(!u.s)return new c(NaN);if(p+4<=Fi)return s=xe(c,p+4,d).times(.5),s.s=u.s,s}for(c.precision=a=p+10,c.rounding=1,t=Math.min(28,a/E+2|0),e=t;e;--e)u=u.div(u.times(u).plus(1).sqrt().plus(1));for(w=false,r=Math.ceil(a/E),n=1,l=u.times(u),s=new c(u),i=u;e!==-1;)if(i=i.times(l),o=s.minus(i.div(n+=2)),i=i.times(l),s=o.plus(i.div(n+=2)),s.d[r]!==void 0)for(e=r;s.d[e]===o.d[e]&&e--;);return t&&(s=s.times(2<<t-1)),w=true,y(s,c.precision=p,c.rounding=d,true)};m.isFinite=function(){return !!this.d};m.isInteger=m.isInt=function(){return !!this.d&&Y(this.e/E)>this.d.length-2};m.isNaN=function(){return !this.s};m.isNegative=m.isNeg=function(){return this.s<0};m.isPositive=m.isPos=function(){return this.s>0};m.isZero=function(){return !!this.d&&this.d[0]===0};m.lessThan=m.lt=function(e){return this.cmp(e)<0};m.lessThanOrEqualTo=m.lte=function(e){return this.cmp(e)<1};m.logarithm=m.log=function(e){var r,t,n,i,o,s,a,l,u=this,c=u.constructor,p=c.precision,d=c.rounding,f=5;if(e==null)e=new c(10),r=true;else {if(e=new c(e),t=e.d,e.s<0||!t||!t[0]||e.eq(1))return new c(NaN);r=e.eq(10);}if(t=u.d,u.s<0||!t||!t[0]||u.eq(1))return new c(t&&!t[0]?-1/0:u.s!=1?NaN:t?0:1/0);if(r)if(t.length>1)o=true;else {for(i=t[0];i%10===0;)i/=10;o=i!==1;}if(w=false,a=p+f,s=Je(u,a),n=r?mn(c,a+10):Je(e,a),l=_(s,n,a,1),st(l.d,i=p,d))do if(a+=10,s=Je(u,a),n=r?mn(c,a+10):Je(e,a),l=_(s,n,a,1),!o){+W(l.d).slice(i+1,i+15)+1==1e14&&(l=y(l,p+1,0));break}while(st(l.d,i+=10,d));return w=true,y(l,p,d)};m.minus=m.sub=function(e){var r,t,n,i,o,s,a,l,u,c,p,d,f=this,h=f.constructor;if(e=new h(e),!f.d||!e.d)return !f.s||!e.s?e=new h(NaN):f.d?e.s=-e.s:e=new h(e.d||f.s!==e.s?f:NaN),e;if(f.s!=e.s)return e.s=-e.s,f.plus(e);if(u=f.d,d=e.d,a=h.precision,l=h.rounding,!u[0]||!d[0]){if(d[0])e.s=-e.s;else if(u[0])e=new h(f);else return new h(l===3?-0:0);return w?y(e,a,l):e}if(t=Y(e.e/E),c=Y(f.e/E),u=u.slice(),o=c-t,o){for(p=o<0,p?(r=u,o=-o,s=d.length):(r=d,t=c,s=u.length),n=Math.max(Math.ceil(a/E),s)+2,o>n&&(o=n,r.length=1),r.reverse(),n=o;n--;)r.push(0);r.reverse();}else {for(n=u.length,s=d.length,p=n<s,p&&(s=n),n=0;n<s;n++)if(u[n]!=d[n]){p=u[n]<d[n];break}o=0;}for(p&&(r=u,u=d,d=r,e.s=-e.s),s=u.length,n=d.length-s;n>0;--n)u[s++]=0;for(n=d.length;n>o;){if(u[--n]<d[n]){for(i=n;i&&u[--i]===0;)u[i]=fe-1;--u[i],u[n]+=fe;}u[n]-=d[n];}for(;u[--s]===0;)u.pop();for(;u[0]===0;u.shift())--t;return u[0]?(e.d=u,e.e=gn(u,t),w?y(e,a,l):e):new h(l===3?-0:0)};m.modulo=m.mod=function(e){var r,t=this,n=t.constructor;return e=new n(e),!t.d||!e.s||e.d&&!e.d[0]?new n(NaN):!e.d||t.d&&!t.d[0]?y(new n(t),n.precision,n.rounding):(w=false,n.modulo==9?(r=_(t,e.abs(),0,3,1),r.s*=e.s):r=_(t,e,0,n.modulo,1),r=r.times(e),w=true,t.minus(r))};m.naturalExponential=m.exp=function(){return Mi(this)};m.naturalLogarithm=m.ln=function(){return Je(this)};m.negated=m.neg=function(){var e=new this.constructor(this);return e.s=-e.s,y(e)};m.plus=m.add=function(e){var r,t,n,i,o,s,a,l,u,c,p=this,d=p.constructor;if(e=new d(e),!p.d||!e.d)return !p.s||!e.s?e=new d(NaN):p.d||(e=new d(e.d||p.s===e.s?p:NaN)),e;if(p.s!=e.s)return e.s=-e.s,p.minus(e);if(u=p.d,c=e.d,a=d.precision,l=d.rounding,!u[0]||!c[0])return c[0]||(e=new d(p)),w?y(e,a,l):e;if(o=Y(p.e/E),n=Y(e.e/E),u=u.slice(),i=o-n,i){for(i<0?(t=u,i=-i,s=c.length):(t=c,n=o,s=u.length),o=Math.ceil(a/E),s=o>s?o+1:s+1,i>s&&(i=s,t.length=1),t.reverse();i--;)t.push(0);t.reverse();}for(s=u.length,i=c.length,s-i<0&&(i=s,t=c,c=u,u=t),r=0;i;)r=(u[--i]=u[i]+c[i]+r)/fe|0,u[i]%=fe;for(r&&(u.unshift(r),++n),s=u.length;u[--s]==0;)u.pop();return e.d=u,e.e=gn(u,n),w?y(e,a,l):e};m.precision=m.sd=function(e){var r,t=this;if(e!==void 0&&e!==!!e&&e!==1&&e!==0)throw Error(Ke+e);return t.d?(r=Fs(t.d),e&&t.e+1>r&&(r=t.e+1)):r=NaN,r};m.round=function(){var e=this,r=e.constructor;return y(new r(e),e.e+1,r.rounding)};m.sine=m.sin=function(){var e,r,t=this,n=t.constructor;return t.isFinite()?t.isZero()?new n(t):(e=n.precision,r=n.rounding,n.precision=e+Math.max(t.e,t.sd())+E,n.rounding=1,t=pp(n,Vs(n,t)),n.precision=e,n.rounding=r,y(Ne>2?t.neg():t,e,r,true)):new n(NaN)};m.squareRoot=m.sqrt=function(){var e,r,t,n,i,o,s=this,a=s.d,l=s.e,u=s.s,c=s.constructor;if(u!==1||!a||!a[0])return new c(!u||u<0&&(!a||a[0])?NaN:a?s:1/0);for(w=false,u=Math.sqrt(+s),u==0||u==1/0?(r=W(a),(r.length+l)%2==0&&(r+="0"),u=Math.sqrt(r),l=Y((l+1)/2)-(l<0||l%2),u==1/0?r="5e"+l:(r=u.toExponential(),r=r.slice(0,r.indexOf("e")+1)+l),n=new c(r)):n=new c(u.toString()),t=(l=c.precision)+3;;)if(o=n,n=o.plus(_(s,o,t+2,1)).times(.5),W(o.d).slice(0,t)===(r=W(n.d)).slice(0,t))if(r=r.slice(t-3,t+1),r=="9999"||!i&&r=="4999"){if(!i&&(y(o,l+1,0),o.times(o).eq(s))){n=o;break}t+=4,i=1;}else {(!+r||!+r.slice(1)&&r.charAt(0)=="5")&&(y(n,l+1,1),e=!n.times(n).eq(s));break}return w=true,y(n,l,c.rounding,e)};m.tangent=m.tan=function(){var e,r,t=this,n=t.constructor;return t.isFinite()?t.isZero()?new n(t):(e=n.precision,r=n.rounding,n.precision=e+10,n.rounding=1,t=t.sin(),t.s=1,t=_(t,new n(1).minus(t.times(t)).sqrt(),e+10,0),n.precision=e,n.rounding=r,y(Ne==2||Ne==4?t.neg():t,e,r,true)):new n(NaN)};m.times=m.mul=function(e){var r,t,n,i,o,s,a,l,u,c=this,p=c.constructor,d=c.d,f=(e=new p(e)).d;if(e.s*=c.s,!d||!d[0]||!f||!f[0])return new p(!e.s||d&&!d[0]&&!f||f&&!f[0]&&!d?NaN:!d||!f?e.s/0:e.s*0);for(t=Y(c.e/E)+Y(e.e/E),l=d.length,u=f.length,l<u&&(o=d,d=f,f=o,s=l,l=u,u=s),o=[],s=l+u,n=s;n--;)o.push(0);for(n=u;--n>=0;){for(r=0,i=l+n;i>n;)a=o[i]+f[n]*d[i-n-1]+r,o[i--]=a%fe|0,r=a/fe|0;o[i]=(o[i]+r)%fe|0;}for(;!o[--s];)o.pop();return r?++t:o.shift(),e.d=o,e.e=gn(o,t),w?y(e,p.precision,p.rounding):e};m.toBinary=function(e,r){return $i(this,2,e,r)};m.toDecimalPlaces=m.toDP=function(e,r){var t=this,n=t.constructor;return t=new n(t),e===void 0?t:(te(e,0,He),r===void 0?r=n.rounding:te(r,0,8),y(t,e+t.e+1,r))};m.toExponential=function(e,r){var t,n=this,i=n.constructor;return e===void 0?t=ve(n,true):(te(e,0,He),r===void 0?r=i.rounding:te(r,0,8),n=y(new i(n),e+1,r),t=ve(n,true,e+1)),n.isNeg()&&!n.isZero()?"-"+t:t};m.toFixed=function(e,r){var t,n,i=this,o=i.constructor;return e===void 0?t=ve(i):(te(e,0,He),r===void 0?r=o.rounding:te(r,0,8),n=y(new o(i),e+i.e+1,r),t=ve(n,false,e+n.e+1)),i.isNeg()&&!i.isZero()?"-"+t:t};m.toFraction=function(e){var r,t,n,i,o,s,a,l,u,c,p,d,f=this,h=f.d,g=f.constructor;if(!h)return new g(f);if(u=t=new g(1),n=l=new g(0),r=new g(n),o=r.e=Fs(h)-f.e-1,s=o%E,r.d[0]=B(10,s<0?E+s:s),e==null)e=o>0?r:u;else {if(a=new g(e),!a.isInt()||a.lt(u))throw Error(Ke+a);e=a.gt(r)?o>0?r:u:a;}for(w=false,a=new g(W(h)),c=g.precision,g.precision=o=h.length*E*2;p=_(a,r,0,1,1),i=t.plus(p.times(n)),i.cmp(e)!=1;)t=n,n=i,i=u,u=l.plus(p.times(i)),l=i,i=r,r=a.minus(p.times(i)),a=i;return i=_(e.minus(t),n,0,1,1),l=l.plus(i.times(u)),t=t.plus(i.times(n)),l.s=u.s=f.s,d=_(u,n,o,1).minus(f).abs().cmp(_(l,t,o,1).minus(f).abs())<1?[u,n]:[l,t],g.precision=c,w=true,d};m.toHexadecimal=m.toHex=function(e,r){return $i(this,16,e,r)};m.toNearest=function(e,r){var t=this,n=t.constructor;if(t=new n(t),e==null){if(!t.d)return t;e=new n(1),r=n.rounding;}else {if(e=new n(e),r===void 0?r=n.rounding:te(r,0,8),!t.d)return e.s?t:e;if(!e.d)return e.s&&(e.s=t.s),e}return e.d[0]?(w=false,t=_(t,e,0,r,1).times(e),w=true,y(t)):(e.s=t.s,t=e),t};m.toNumber=function(){return +this};m.toOctal=function(e,r){return $i(this,8,e,r)};m.toPower=m.pow=function(e){var r,t,n,i,o,s,a=this,l=a.constructor,u=+(e=new l(e));if(!a.d||!e.d||!a.d[0]||!e.d[0])return new l(B(+a,u));if(a=new l(a),a.eq(1))return a;if(n=l.precision,o=l.rounding,e.eq(1))return y(a,n,o);if(r=Y(e.e/E),r>=e.d.length-1&&(t=u<0?-u:u)<=ap)return i=Ms(l,a,t,n),e.s<0?new l(1).div(i):y(i,n,o);if(s=a.s,s<0){if(r<e.d.length-1)return new l(NaN);if((e.d[r]&1)==0&&(s=1),a.e==0&&a.d[0]==1&&a.d.length==1)return a.s=s,a}return t=B(+a,u),r=t==0||!isFinite(t)?Y(u*(Math.log("0."+W(a.d))/Math.LN10+a.e+1)):new l(t+"").e,r>l.maxE+1||r<l.minE-1?new l(r>0?s/0:0):(w=false,l.rounding=a.s=1,t=Math.min(12,(r+"").length),i=Mi(e.times(Je(a,n+t)),n),i.d&&(i=y(i,n+5,1),st(i.d,n,o)&&(r=n+10,i=y(Mi(e.times(Je(a,r+t)),r),r+5,1),+W(i.d).slice(n+1,n+15)+1==1e14&&(i=y(i,n+1,0)))),i.s=s,w=true,l.rounding=o,y(i,n,o))};m.toPrecision=function(e,r){var t,n=this,i=n.constructor;return e===void 0?t=ve(n,n.e<=i.toExpNeg||n.e>=i.toExpPos):(te(e,1,He),r===void 0?r=i.rounding:te(r,0,8),n=y(new i(n),e,r),t=ve(n,e<=n.e||n.e<=i.toExpNeg,e)),n.isNeg()&&!n.isZero()?"-"+t:t};m.toSignificantDigits=m.toSD=function(e,r){var t=this,n=t.constructor;return e===void 0?(e=n.precision,r=n.rounding):(te(e,1,He),r===void 0?r=n.rounding:te(r,0,8)),y(new n(t),e,r)};m.toString=function(){var e=this,r=e.constructor,t=ve(e,e.e<=r.toExpNeg||e.e>=r.toExpPos);return e.isNeg()&&!e.isZero()?"-"+t:t};m.truncated=m.trunc=function(){return y(new this.constructor(this),this.e+1,1)};m.valueOf=m.toJSON=function(){var e=this,r=e.constructor,t=ve(e,e.e<=r.toExpNeg||e.e>=r.toExpPos);return e.isNeg()?"-"+t:t};function W(e){var r,t,n,i=e.length-1,o="",s=e[0];if(i>0){for(o+=s,r=1;r<i;r++)n=e[r]+"",t=E-n.length,t&&(o+=We(t)),o+=n;s=e[r],n=s+"",t=E-n.length,t&&(o+=We(t));}else if(s===0)return "0";for(;s%10===0;)s/=10;return o+s}function te(e,r,t){if(e!==~~e||e<r||e>t)throw Error(Ke+e)}function st(e,r,t,n){var i,o,s,a;for(o=e[0];o>=10;o/=10)--r;return --r<0?(r+=E,i=0):(i=Math.ceil((r+1)/E),r%=E),o=B(10,E-r),a=e[i]%o|0,n==null?r<3?(r==0?a=a/100|0:r==1&&(a=a/10|0),s=t<4&&a==99999||t>3&&a==49999||a==5e4||a==0):s=(t<4&&a+1==o||t>3&&a+1==o/2)&&(e[i+1]/o/100|0)==B(10,r-2)-1||(a==o/2||a==0)&&(e[i+1]/o/100|0)==0:r<4?(r==0?a=a/1e3|0:r==1?a=a/100|0:r==2&&(a=a/10|0),s=(n||t<4)&&a==9999||!n&&t>3&&a==4999):s=((n||t<4)&&a+1==o||!n&&t>3&&a+1==o/2)&&(e[i+1]/o/1e3|0)==B(10,r-3)-1,s}function un(e,r,t){for(var n,i=[0],o,s=0,a=e.length;s<a;){for(o=i.length;o--;)i[o]*=r;for(i[0]+=Ni.indexOf(e.charAt(s++)),n=0;n<i.length;n++)i[n]>t-1&&(i[n+1]===void 0&&(i[n+1]=0),i[n+1]+=i[n]/t|0,i[n]%=t);}return i.reverse()}function up(e,r){var t,n,i;if(r.isZero())return r;n=r.d.length,n<32?(t=Math.ceil(n/3),i=(1/hn(4,t)).toString()):(t=16,i="2.3283064365386962890625e-10"),e.precision+=t,r=Tr(e,1,r.times(i),new e(1));for(var o=t;o--;){var s=r.times(r);r=s.times(s).minus(s).times(8).plus(1);}return e.precision-=t,r}var _=function(){function e(n,i,o){var s,a=0,l=n.length;for(n=n.slice();l--;)s=n[l]*i+a,n[l]=s%o|0,a=s/o|0;return a&&n.unshift(a),n}function r(n,i,o,s){var a,l;if(o!=s)l=o>s?1:-1;else for(a=l=0;a<o;a++)if(n[a]!=i[a]){l=n[a]>i[a]?1:-1;break}return l}function t(n,i,o,s){for(var a=0;o--;)n[o]-=a,a=n[o]<i[o]?1:0,n[o]=a*s+n[o]-i[o];for(;!n[0]&&n.length>1;)n.shift();}return function(n,i,o,s,a,l){var u,c,p,d,f,h,g,I,T,S,b,D,me,ie,Wr,V,re,Ae,J,mr,Mt=n.constructor,Jn=n.s==i.s?1:-1,K=n.d,O=i.d;if(!K||!K[0]||!O||!O[0])return new Mt(!n.s||!i.s||(K?O&&K[0]==O[0]:!O)?NaN:K&&K[0]==0||!O?Jn*0:Jn/0);for(l?(f=1,c=n.e-i.e):(l=fe,f=E,c=Y(n.e/f)-Y(i.e/f)),J=O.length,re=K.length,T=new Mt(Jn),S=T.d=[],p=0;O[p]==(K[p]||0);p++);if(O[p]>(K[p]||0)&&c--,o==null?(ie=o=Mt.precision,s=Mt.rounding):a?ie=o+(n.e-i.e)+1:ie=o,ie<0)S.push(1),h=true;else {if(ie=ie/f+2|0,p=0,J==1){for(d=0,O=O[0],ie++;(p<re||d)&&ie--;p++)Wr=d*l+(K[p]||0),S[p]=Wr/O|0,d=Wr%O|0;h=d||p<re;}else {for(d=l/(O[0]+1)|0,d>1&&(O=e(O,d,l),K=e(K,d,l),J=O.length,re=K.length),V=J,b=K.slice(0,J),D=b.length;D<J;)b[D++]=0;mr=O.slice(),mr.unshift(0),Ae=O[0],O[1]>=l/2&&++Ae;do d=0,u=r(O,b,J,D),u<0?(me=b[0],J!=D&&(me=me*l+(b[1]||0)),d=me/Ae|0,d>1?(d>=l&&(d=l-1),g=e(O,d,l),I=g.length,D=b.length,u=r(g,b,I,D),u==1&&(d--,t(g,J<I?mr:O,I,l))):(d==0&&(u=d=1),g=O.slice()),I=g.length,I<D&&g.unshift(0),t(b,g,D,l),u==-1&&(D=b.length,u=r(O,b,J,D),u<1&&(d++,t(b,J<D?mr:O,D,l))),D=b.length):u===0&&(d++,b=[0]),S[p++]=d,u&&b[0]?b[D++]=K[V]||0:(b=[K[V]],D=1);while((V++<re||b[0]!==void 0)&&ie--);h=b[0]!==void 0;}S[0]||S.shift();}if(f==1)T.e=c,Os=h;else {for(p=1,d=S[0];d>=10;d/=10)p++;T.e=p+c*f-1,y(T,a?o+T.e+1:o,s,h);}return T}}();function y(e,r,t,n){var i,o,s,a,l,u,c,p,d,f=e.constructor;e:if(r!=null){if(p=e.d,!p)return e;for(i=1,a=p[0];a>=10;a/=10)i++;if(o=r-i,o<0)o+=E,s=r,c=p[d=0],l=c/B(10,i-s-1)%10|0;else if(d=Math.ceil((o+1)/E),a=p.length,d>=a)if(n){for(;a++<=d;)p.push(0);c=l=0,i=1,o%=E,s=o-E+1;}else break e;else {for(c=a=p[d],i=1;a>=10;a/=10)i++;o%=E,s=o-E+i,l=s<0?0:c/B(10,i-s-1)%10|0;}if(n=n||r<0||p[d+1]!==void 0||(s<0?c:c%B(10,i-s-1)),u=t<4?(l||n)&&(t==0||t==(e.s<0?3:2)):l>5||l==5&&(t==4||n||t==6&&(o>0?s>0?c/B(10,i-s):0:p[d-1])%10&1||t==(e.s<0?8:7)),r<1||!p[0])return p.length=0,u?(r-=e.e+1,p[0]=B(10,(E-r%E)%E),e.e=-r||0):p[0]=e.e=0,e;if(o==0?(p.length=d,a=1,d--):(p.length=d+1,a=B(10,E-o),p[d]=s>0?(c/B(10,i-s)%B(10,s)|0)*a:0),u)for(;;)if(d==0){for(o=1,s=p[0];s>=10;s/=10)o++;for(s=p[0]+=a,a=1;s>=10;s/=10)a++;o!=a&&(e.e++,p[0]==fe&&(p[0]=1));break}else {if(p[d]+=a,p[d]!=fe)break;p[d--]=0,a=1;}for(o=p.length;p[--o]===0;)p.pop();}return w&&(e.e>f.maxE?(e.d=null,e.e=NaN):e.e<f.minE&&(e.e=0,e.d=[0])),e}function ve(e,r,t){if(!e.isFinite())return qs(e);var n,i=e.e,o=W(e.d),s=o.length;return r?(t&&(n=t-s)>0?o=o.charAt(0)+"."+o.slice(1)+We(n):s>1&&(o=o.charAt(0)+"."+o.slice(1)),o=o+(e.e<0?"e":"e+")+e.e):i<0?(o="0."+We(-i-1)+o,t&&(n=t-s)>0&&(o+=We(n))):i>=s?(o+=We(i+1-s),t&&(n=t-i-1)>0&&(o=o+"."+We(n))):((n=i+1)<s&&(o=o.slice(0,n)+"."+o.slice(n)),t&&(n=t-s)>0&&(i+1===s&&(o+="."),o+=We(n))),o}function gn(e,r){var t=e[0];for(r*=E;t>=10;t/=10)r++;return r}function mn(e,r,t){if(r>lp)throw w=true,t&&(e.precision=t),Error(ks);return y(new e(pn),r,1,true)}function xe(e,r,t){if(r>Fi)throw Error(ks);return y(new e(dn),r,t,true)}function Fs(e){var r=e.length-1,t=r*E+1;if(r=e[r],r){for(;r%10==0;r/=10)t--;for(r=e[0];r>=10;r/=10)t++;}return t}function We(e){for(var r="";e--;)r+="0";return r}function Ms(e,r,t,n){var i,o=new e(1),s=Math.ceil(n/E+4);for(w=false;;){if(t%2&&(o=o.times(r),Is(o.d,s)&&(i=true)),t=Y(t/2),t===0){t=o.d.length-1,i&&o.d[t]===0&&++o.d[t];break}r=r.times(r),Is(r.d,s);}return w=true,o}function Cs(e){return e.d[e.d.length-1]&1}function $s(e,r,t){for(var n,i,o=new e(r[0]),s=0;++s<r.length;){if(i=new e(r[s]),!i.s){o=i;break}n=o.cmp(i),(n===t||n===0&&o.s===t)&&(o=i);}return o}function Mi(e,r){var t,n,i,o,s,a,l,u=0,c=0,p=0,d=e.constructor,f=d.rounding,h=d.precision;if(!e.d||!e.d[0]||e.e>17)return new d(e.d?e.d[0]?e.s<0?0:1/0:1:e.s?e.s<0?0:e:NaN);for(r==null?(w=false,l=h):l=r,a=new d(.03125);e.e>-2;)e=e.times(a),p+=5;for(n=Math.log(B(2,p))/Math.LN10*2+5|0,l+=n,t=o=s=new d(1),d.precision=l;;){if(o=y(o.times(e),l,1),t=t.times(++c),a=s.plus(_(o,t,l,1)),W(a.d).slice(0,l)===W(s.d).slice(0,l)){for(i=p;i--;)s=y(s.times(s),l,1);if(r==null)if(u<3&&st(s.d,l-n,f,u))d.precision=l+=10,t=o=a=new d(1),c=0,u++;else return y(s,d.precision=h,f,w=true);else return d.precision=h,s}s=a;}}function Je(e,r){var t,n,i,o,s,a,l,u,c,p,d,f=1,h=10,g=e,I=g.d,T=g.constructor,S=T.rounding,b=T.precision;if(g.s<0||!I||!I[0]||!g.e&&I[0]==1&&I.length==1)return new T(I&&!I[0]?-1/0:g.s!=1?NaN:I?0:g);if(r==null?(w=false,c=b):c=r,T.precision=c+=h,t=W(I),n=t.charAt(0),Math.abs(o=g.e)<15e14){for(;n<7&&n!=1||n==1&&t.charAt(1)>3;)g=g.times(e),t=W(g.d),n=t.charAt(0),f++;o=g.e,n>1?(g=new T("0."+t),o++):g=new T(n+"."+t.slice(1));}else return u=mn(T,c+2,b).times(o+""),g=Je(new T(n+"."+t.slice(1)),c-h).plus(u),T.precision=b,r==null?y(g,b,S,w=true):g;for(p=g,l=s=g=_(g.minus(1),g.plus(1),c,1),d=y(g.times(g),c,1),i=3;;){if(s=y(s.times(d),c,1),u=l.plus(_(s,new T(i),c,1)),W(u.d).slice(0,c)===W(l.d).slice(0,c))if(l=l.times(2),o!==0&&(l=l.plus(mn(T,c+2,b).times(o+""))),l=_(l,new T(f),c,1),r==null)if(st(l.d,c-h,S,a))T.precision=c+=h,u=s=g=_(p.minus(1),p.plus(1),c,1),d=y(g.times(g),c,1),i=a=1;else return y(l,T.precision=b,S,w=true);else return T.precision=b,l;l=u,i+=2;}}function qs(e){return String(e.s*e.s/0)}function cn(e,r){var t,n,i;for((t=r.indexOf("."))>-1&&(r=r.replace(".","")),(n=r.search(/e/i))>0?(t<0&&(t=n),t+=+r.slice(n+1),r=r.substring(0,n)):t<0&&(t=r.length),n=0;r.charCodeAt(n)===48;n++);for(i=r.length;r.charCodeAt(i-1)===48;--i);if(r=r.slice(n,i),r){if(i-=n,e.e=t=t-n-1,e.d=[],n=(t+1)%E,t<0&&(n+=E),n<i){for(n&&e.d.push(+r.slice(0,n)),i-=E;n<i;)e.d.push(+r.slice(n,n+=E));r=r.slice(n),n=E-r.length;}else n-=i;for(;n--;)r+="0";e.d.push(+r),w&&(e.e>e.constructor.maxE?(e.d=null,e.e=NaN):e.e<e.constructor.minE&&(e.e=0,e.d=[0]));}else e.e=0,e.d=[0];return e}function cp(e,r){var t,n,i,o,s,a,l,u,c;if(r.indexOf("_")>-1){if(r=r.replace(/(\d)_(?=\d)/g,"$1"),Ls.test(r))return cn(e,r)}else if(r==="Infinity"||r==="NaN")return +r||(e.s=NaN),e.e=NaN,e.d=null,e;if(op.test(r))t=16,r=r.toLowerCase();else if(ip.test(r))t=2;else if(sp.test(r))t=8;else throw Error(Ke+r);for(o=r.search(/p/i),o>0?(l=+r.slice(o+1),r=r.substring(2,o)):r=r.slice(2),o=r.indexOf("."),s=o>=0,n=e.constructor,s&&(r=r.replace(".",""),a=r.length,o=a-o,i=Ms(n,new n(t),o,o*2)),u=un(r,t,fe),c=u.length-1,o=c;u[o]===0;--o)u.pop();return o<0?new n(e.s*0):(e.e=gn(u,c),e.d=u,w=false,s&&(e=_(e,i,a*4)),l&&(e=e.times(Math.abs(l)<54?B(2,l):Le.pow(2,l))),w=true,e)}function pp(e,r){var t,n=r.d.length;if(n<3)return r.isZero()?r:Tr(e,2,r,r);t=1.4*Math.sqrt(n),t=t>16?16:t|0,r=r.times(1/hn(5,t)),r=Tr(e,2,r,r);for(var i,o=new e(5),s=new e(16),a=new e(20);t--;)i=r.times(r),r=r.times(o.plus(i.times(s.times(i).minus(a))));return r}function Tr(e,r,t,n,i){var o,s,a,l,c=e.precision,p=Math.ceil(c/E);for(w=false,l=t.times(t),a=new e(n);;){if(s=_(a.times(l),new e(r++*r++),c,1),a=i?n.plus(s):n.minus(s),n=_(s.times(l),new e(r++*r++),c,1),s=a.plus(n),s.d[p]!==void 0){for(o=p;s.d[o]===a.d[o]&&o--;);if(o==-1)break}o=a,a=n,n=s,s=o;}return w=true,s.d.length=p+1,s}function hn(e,r){for(var t=e;--r;)t*=e;return t}function Vs(e,r){var t,n=r.s<0,i=xe(e,e.precision,1),o=i.times(.5);if(r=r.abs(),r.lte(o))return Ne=n?4:1,r;if(t=r.divToInt(i),t.isZero())Ne=n?3:2;else {if(r=r.minus(t.times(i)),r.lte(o))return Ne=Cs(t)?n?2:3:n?4:1,r;Ne=Cs(t)?n?1:4:n?3:2;}return r.minus(i).abs()}function $i(e,r,t,n){var i,o,s,a,l,u,c,p,d,f=e.constructor,h=t!==void 0;if(h?(te(t,1,He),n===void 0?n=f.rounding:te(n,0,8)):(t=f.precision,n=f.rounding),!e.isFinite())c=qs(e);else {for(c=ve(e),s=c.indexOf("."),h?(i=2,r==16?t=t*4-3:r==8&&(t=t*3-2)):i=r,s>=0&&(c=c.replace(".",""),d=new f(1),d.e=c.length-s,d.d=un(ve(d),10,i),d.e=d.d.length),p=un(c,10,i),o=l=p.length;p[--l]==0;)p.pop();if(!p[0])c=h?"0p+0":"0";else {if(s<0?o--:(e=new f(e),e.d=p,e.e=o,e=_(e,d,t,n,0,i),p=e.d,o=e.e,u=Os),s=p[t],a=i/2,u=u||p[t+1]!==void 0,u=n<4?(s!==void 0||u)&&(n===0||n===(e.s<0?3:2)):s>a||s===a&&(n===4||u||n===6&&p[t-1]&1||n===(e.s<0?8:7)),p.length=t,u)for(;++p[--t]>i-1;)p[t]=0,t||(++o,p.unshift(1));for(l=p.length;!p[l-1];--l);for(s=0,c="";s<l;s++)c+=Ni.charAt(p[s]);if(h){if(l>1)if(r==16||r==8){for(s=r==16?4:3,--l;l%s;l++)c+="0";for(p=un(c,i,r),l=p.length;!p[l-1];--l);for(s=1,c="1.";s<l;s++)c+=Ni.charAt(p[s]);}else c=c.charAt(0)+"."+c.slice(1);c=c+(o<0?"p":"p+")+o;}else if(o<0){for(;++o;)c="0"+c;c="0."+c;}else if(++o>l)for(o-=l;o--;)c+="0";else o<l&&(c=c.slice(0,o)+"."+c.slice(o));}c=(r==16?"0x":r==2?"0b":r==8?"0o":"")+c;}return e.s<0?"-"+c:c}function Is(e,r){if(e.length>r)return e.length=r,true}function dp(e){return new this(e).abs()}function mp(e){return new this(e).acos()}function fp(e){return new this(e).acosh()}function gp(e,r){return new this(e).plus(r)}function hp(e){return new this(e).asin()}function yp(e){return new this(e).asinh()}function bp(e){return new this(e).atan()}function Ep(e){return new this(e).atanh()}function wp(e,r){e=new this(e),r=new this(r);var t,n=this.precision,i=this.rounding,o=n+4;return !e.s||!r.s?t=new this(NaN):!e.d&&!r.d?(t=xe(this,o,1).times(r.s>0?.25:.75),t.s=e.s):!r.d||e.isZero()?(t=r.s<0?xe(this,n,i):new this(0),t.s=e.s):!e.d||r.isZero()?(t=xe(this,o,1).times(.5),t.s=e.s):r.s<0?(this.precision=o,this.rounding=1,t=this.atan(_(e,r,o,1)),r=xe(this,o,1),this.precision=n,this.rounding=i,t=e.s<0?t.minus(r):t.plus(r)):t=this.atan(_(e,r,o,1)),t}function xp(e){return new this(e).cbrt()}function vp(e){return y(e=new this(e),e.e+1,2)}function Pp(e,r,t){return new this(e).clamp(r,t)}function Tp(e){if(!e||typeof e!="object")throw Error(fn+"Object expected");var r,t,n,i=e.defaults===true,o=["precision",1,He,"rounding",0,8,"toExpNeg",-Pr,0,"toExpPos",0,Pr,"maxE",0,Pr,"minE",-Pr,0,"modulo",0,9];for(r=0;r<o.length;r+=3)if(t=o[r],i&&(this[t]=Li[t]),(n=e[t])!==void 0)if(Y(n)===n&&n>=o[r+1]&&n<=o[r+2])this[t]=n;else throw Error(Ke+t+": "+n);if(t="crypto",i&&(this[t]=Li[t]),(n=e[t])!==void 0)if(n===true||n===false||n===0||n===1)if(n)if(typeof crypto<"u"&&crypto&&(crypto.getRandomValues||crypto.randomBytes))this[t]=true;else throw Error(_s);else this[t]=false;else throw Error(Ke+t+": "+n);return this}function Sp(e){return new this(e).cos()}function Rp(e){return new this(e).cosh()}function js(e){var r,t,n;function i(o){var s,a,l,u=this;if(!(u instanceof i))return new i(o);if(u.constructor=i,Ds(o)){u.s=o.s,w?!o.d||o.e>i.maxE?(u.e=NaN,u.d=null):o.e<i.minE?(u.e=0,u.d=[0]):(u.e=o.e,u.d=o.d.slice()):(u.e=o.e,u.d=o.d?o.d.slice():o.d);return}if(l=typeof o,l==="number"){if(o===0){u.s=1/o<0?-1:1,u.e=0,u.d=[0];return}if(o<0?(o=-o,u.s=-1):u.s=1,o===~~o&&o<1e7){for(s=0,a=o;a>=10;a/=10)s++;w?s>i.maxE?(u.e=NaN,u.d=null):s<i.minE?(u.e=0,u.d=[0]):(u.e=s,u.d=[o]):(u.e=s,u.d=[o]);return}if(o*0!==0){o||(u.s=NaN),u.e=NaN,u.d=null;return}return cn(u,o.toString())}if(l==="string")return (a=o.charCodeAt(0))===45?(o=o.slice(1),u.s=-1):(a===43&&(o=o.slice(1)),u.s=1),Ls.test(o)?cn(u,o):cp(u,o);if(l==="bigint")return o<0?(o=-o,u.s=-1):u.s=1,cn(u,o.toString());throw Error(Ke+o)}if(i.prototype=m,i.ROUND_UP=0,i.ROUND_DOWN=1,i.ROUND_CEIL=2,i.ROUND_FLOOR=3,i.ROUND_HALF_UP=4,i.ROUND_HALF_DOWN=5,i.ROUND_HALF_EVEN=6,i.ROUND_HALF_CEIL=7,i.ROUND_HALF_FLOOR=8,i.EUCLID=9,i.config=i.set=Tp,i.clone=js,i.isDecimal=Ds,i.abs=dp,i.acos=mp,i.acosh=fp,i.add=gp,i.asin=hp,i.asinh=yp,i.atan=bp,i.atanh=Ep,i.atan2=wp,i.cbrt=xp,i.ceil=vp,i.clamp=Pp,i.cos=Sp,i.cosh=Rp,i.div=Ap,i.exp=Cp,i.floor=Ip,i.hypot=Dp,i.ln=Op,i.log=kp,i.log10=Np,i.log2=_p,i.max=Lp,i.min=Fp,i.mod=Mp,i.mul=$p,i.pow=qp,i.random=Vp,i.round=jp,i.sign=Bp,i.sin=Up,i.sinh=Gp,i.sqrt=Qp,i.sub=Wp,i.sum=Jp,i.tan=Kp,i.tanh=Hp,i.trunc=Yp,e===void 0&&(e={}),e&&e.defaults!==true)for(n=["precision","rounding","toExpNeg","toExpPos","maxE","minE","modulo","crypto"],r=0;r<n.length;)e.hasOwnProperty(t=n[r++])||(e[t]=this[t]);return i.config(e),i}function Ap(e,r){return new this(e).div(r)}function Cp(e){return new this(e).exp()}function Ip(e){return y(e=new this(e),e.e+1,3)}function Dp(){var e,r,t=new this(0);for(w=false,e=0;e<arguments.length;)if(r=new this(arguments[e++]),r.d)t.d&&(t=t.plus(r.times(r)));else {if(r.s)return w=true,new this(1/0);t=r;}return w=true,t.sqrt()}function Ds(e){return e instanceof Le||e&&e.toStringTag===Ns||false}function Op(e){return new this(e).ln()}function kp(e,r){return new this(e).log(r)}function _p(e){return new this(e).log(2)}function Np(e){return new this(e).log(10)}function Lp(){return $s(this,arguments,-1)}function Fp(){return $s(this,arguments,1)}function Mp(e,r){return new this(e).mod(r)}function $p(e,r){return new this(e).mul(r)}function qp(e,r){return new this(e).pow(r)}function Vp(e){var r,t,n,i,o=0,s=new this(1),a=[];if(e===void 0?e=this.precision:te(e,1,He),n=Math.ceil(e/E),this.crypto)if(crypto.getRandomValues)for(r=crypto.getRandomValues(new Uint32Array(n));o<n;)i=r[o],i>=429e7?r[o]=crypto.getRandomValues(new Uint32Array(1))[0]:a[o++]=i%1e7;else if(crypto.randomBytes){for(r=crypto.randomBytes(n*=4);o<n;)i=r[o]+(r[o+1]<<8)+(r[o+2]<<16)+((r[o+3]&127)<<24),i>=214e7?crypto.randomBytes(4).copy(r,o):(a.push(i%1e7),o+=4);o=n/4;}else throw Error(_s);else for(;o<n;)a[o++]=Math.random()*1e7|0;for(n=a[--o],e%=E,n&&e&&(i=B(10,E-e),a[o]=(n/i|0)*i);a[o]===0;o--)a.pop();if(o<0)t=0,a=[0];else {for(t=-1;a[0]===0;t-=E)a.shift();for(n=1,i=a[0];i>=10;i/=10)n++;n<E&&(t-=E-n);}return s.e=t,s.d=a,s}function jp(e){return y(e=new this(e),e.e+1,this.rounding)}function Bp(e){return e=new this(e),e.d?e.d[0]?e.s:0*e.s:e.s||NaN}function Up(e){return new this(e).sin()}function Gp(e){return new this(e).sinh()}function Qp(e){return new this(e).sqrt()}function Wp(e,r){return new this(e).sub(r)}function Jp(){var e=0,r=arguments,t=new this(r[e]);for(w=false;t.s&&++e<r.length;)t=t.plus(r[e]);return w=true,y(t,this.precision,this.rounding)}function Kp(e){return new this(e).tan()}function Hp(e){return new this(e).tanh()}function Yp(e){return y(e=new this(e),e.e+1,1)}m[Symbol.for("nodejs.util.inspect.custom")]=m.toString;m[Symbol.toStringTag]="Decimal";var Le=m.constructor=js(Li);pn=new Le(pn);dn=new Le(dn);var Ye=Le;function Sr(e){return Le.isDecimal(e)?true:e!==null&&typeof e=="object"&&typeof e.s=="number"&&typeof e.e=="number"&&typeof e.toFixed=="function"&&Array.isArray(e.d)}var yn={};gr(yn,{ModelAction:()=>Rr,datamodelEnumToSchemaEnum:()=>zp});function zp(e){return {name:e.name,values:e.values.map(r=>r.name)}}var Rr=(b=>(b.findUnique="findUnique",b.findUniqueOrThrow="findUniqueOrThrow",b.findFirst="findFirst",b.findFirstOrThrow="findFirstOrThrow",b.findMany="findMany",b.create="create",b.createMany="createMany",b.createManyAndReturn="createManyAndReturn",b.update="update",b.updateMany="updateMany",b.updateManyAndReturn="updateManyAndReturn",b.upsert="upsert",b.delete="delete",b.deleteMany="deleteMany",b.groupBy="groupBy",b.count="count",b.aggregate="aggregate",b.findRaw="findRaw",b.aggregateRaw="aggregateRaw",b))(Rr||{});le(wi());var Bs={keyword:De,entity:De,value:e=>Q(tr(e)),punctuation:tr,directive:De,function:De,variable:e=>Q(tr(e)),string:e=>Q($e(e)),boolean:Ie,number:De,comment:Jr};var Zp=e=>e,bn={},Xp=0,v={manual:bn.Prism&&bn.Prism.manual,disableWorkerMessageHandler:bn.Prism&&bn.Prism.disableWorkerMessageHandler,util:{encode:function(e){if(e instanceof ge){let r=e;return new ge(r.type,v.util.encode(r.content),r.alias)}else return Array.isArray(e)?e.map(v.util.encode):e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(e){return Object.prototype.toString.call(e).slice(8,-1)},objId:function(e){return e.__id||Object.defineProperty(e,"__id",{value:++Xp}),e.__id},clone:function e(r,t){let n,i,o=v.util.type(r);switch(t=t||{},o){case "Object":if(i=v.util.objId(r),t[i])return t[i];n={},t[i]=n;for(let s in r)r.hasOwnProperty(s)&&(n[s]=e(r[s],t));return n;case "Array":return i=v.util.objId(r),t[i]?t[i]:(n=[],t[i]=n,r.forEach(function(s,a){n[a]=e(s,t);}),n);default:return r}}},languages:{extend:function(e,r){let t=v.util.clone(v.languages[e]);for(let n in r)t[n]=r[n];return t},insertBefore:function(e,r,t,n){n=n||v.languages;let i=n[e],o={};for(let a in i)if(i.hasOwnProperty(a)){if(a==r)for(let l in t)t.hasOwnProperty(l)&&(o[l]=t[l]);t.hasOwnProperty(a)||(o[a]=i[a]);}let s=n[e];return n[e]=o,v.languages.DFS(v.languages,function(a,l){l===s&&a!=e&&(this[a]=o);}),o},DFS:function e(r,t,n,i){i=i||{};let o=v.util.objId;for(let s in r)if(r.hasOwnProperty(s)){t.call(r,s,r[s],n||s);let a=r[s],l=v.util.type(a);l==="Object"&&!i[o(a)]?(i[o(a)]=true,e(a,t,null,i)):l==="Array"&&!i[o(a)]&&(i[o(a)]=true,e(a,t,s,i));}}}};v.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:true},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:true,greedy:true}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:true},"class-name":{pattern:/((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,lookbehind:true,inside:{punctuation:/[.\\]/}},keyword:/\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,boolean:/\b(?:true|false)\b/,function:/\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,punctuation:/[{}[\];(),.:]/};v.languages.javascript=v.languages.extend("clike",{"class-name":[v.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,lookbehind:true}],keyword:[{pattern:/((?:^|})\s*)(?:catch|finally)\b/,lookbehind:true},{pattern:/(^|[^.])\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:true}],number:/\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,function:/[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,operator:/-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/});v.languages.javascript["class-name"][0].pattern=/(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/;v.languages.insertBefore("javascript","keyword",{regex:{pattern:/((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=\s*($|[\r\n,.;})\]]))/,lookbehind:true,greedy:true},"function-variable":{pattern:/[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,lookbehind:true,inside:v.languages.javascript},{pattern:/[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,inside:v.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,lookbehind:true,inside:v.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,lookbehind:true,inside:v.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/});v.languages.markup&&v.languages.markup.tag.addInlined("script","javascript");v.languages.js=v.languages.javascript;v.languages.typescript=v.languages.extend("javascript",{keyword:/\b(?:abstract|as|async|await|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|is|keyof|let|module|namespace|new|null|of|package|private|protected|public|readonly|return|require|set|static|super|switch|this|throw|try|type|typeof|var|void|while|with|yield)\b/,builtin:/\b(?:string|Function|any|number|boolean|Array|symbol|console|Promise|unknown|never)\b/});v.languages.ts=v.languages.typescript;function ge(e,r,t,n,i){this.type=e,this.content=r,this.alias=t,this.length=(n||"").length|0,this.greedy=!!i;}ge.stringify=function(e,r){return typeof e=="string"?e:Array.isArray(e)?e.map(function(t){return ge.stringify(t,r)}).join(""):ed(e.type)(e.content)};function ed(e){return Bs[e]||Zp}var nd={red:ue,gray:Jr,dim:Ce,bold:Q,underline:H,highlightSource:e=>e.highlight()},id={red:e=>e,gray:e=>e,dim:e=>e,bold:e=>e,underline:e=>e,highlightSource:e=>e};function od({message:e,originalMethod:r,isPanic:t,callArguments:n}){return {functionName:`prisma.${r}()`,message:e,isPanic:t??false,callArguments:n}}function sd({callsite:e,message:r,originalMethod:t,isPanic:n,callArguments:i},o){let s=od({message:r,originalMethod:t,isPanic:n,callArguments:i});return s;}function ud({functionName:e,location:r,message:t,isPanic:n,contextLines:i,callArguments:o},s){let a=[""],l=r?" in":":";if(n?(a.push(s.red(`Oops, an unknown error occurred! This is ${s.bold("on us")}, you did nothing wrong.`)),a.push(s.red(`It occurred in the ${s.bold(`\`${e}\``)} invocation${l}`))):a.push(s.red(`Invalid ${s.bold(`\`${e}\``)} invocation${l}`)),r&&a.push(s.underline(cd(r))),i){a.push("");let u=[i.toString()];o&&(u.push(o),u.push(s.dim(")"))),a.push(u.join("")),o&&a.push("");}else a.push(""),o&&a.push(o),a.push("");return a.push(t),a.join(`
`)}function cd(e){let r=[e.fileName];return e.lineNumber&&r.push(String(e.lineNumber)),e.columnNumber&&r.push(String(e.columnNumber)),r.join(":")}function wn(e){let r=e.showColors?nd:id,t;return t=sd(e),ud(t,r)}var ea=le(qi());function Hs(e,r,t){let n=Ys(e),i=pd(n),o=md(i);o?xn(o,r,t):r.addErrorMessage(()=>"Unknown error");}function Ys(e){return e.errors.flatMap(r=>r.kind==="Union"?Ys(r):[r])}function pd(e){let r=new Map,t=[];for(let n of e){if(n.kind!=="InvalidArgumentType"){t.push(n);continue}let i=`${n.selectionPath.join(".")}:${n.argumentPath.join(".")}`,o=r.get(i);o?r.set(i,{...n,argument:{...n.argument,typeNames:dd(o.argument.typeNames,n.argument.typeNames)}}):r.set(i,n);}return t.push(...r.values()),t}function dd(e,r){return [...new Set(e.concat(r))]}function md(e){return ki(e,(r,t)=>{let n=Js(r),i=Js(t);return n!==i?n-i:Ks(r)-Ks(t)})}function Js(e){let r=0;return Array.isArray(e.selectionPath)&&(r+=e.selectionPath.length),Array.isArray(e.argumentPath)&&(r+=e.argumentPath.length),r}function Ks(e){switch(e.kind){case "InvalidArgumentValue":case "ValueTooLarge":return 20;case "InvalidArgumentType":return 10;case "RequiredArgumentMissing":return  -10;default:return 0}}var oe=class{constructor(r,t){this.name=r;this.value=t;}isRequired=false;makeRequired(){return this.isRequired=true,this}write(r){let{colors:{green:t}}=r.context;r.addMarginSymbol(t(this.isRequired?"+":"?")),r.write(t(this.name)),this.isRequired||r.write(t("?")),r.write(t(": ")),typeof this.value=="string"?r.write(t(this.value)):r.write(this.value);}};Zs();var Ar=class{constructor(r=0,t){this.context=t;this.currentIndent=r;}lines=[];currentLine="";currentIndent=0;marginSymbol;afterNextNewLineCallback;write(r){return typeof r=="string"?this.currentLine+=r:r.write(this),this}writeJoined(r,t,n=(i,o)=>o.write(i)){let i=t.length-1;for(let o=0;o<t.length;o++)n(t[o],this),o!==i&&this.write(r);return this}writeLine(r){return this.write(r).newLine()}newLine(){this.lines.push(this.indentedCurrentLine()),this.currentLine="",this.marginSymbol=void 0;let r=this.afterNextNewLineCallback;return this.afterNextNewLineCallback=void 0,r?.(),this}withIndent(r){return this.indent(),r(this),this.unindent(),this}afterNextNewline(r){return this.afterNextNewLineCallback=r,this}indent(){return this.currentIndent++,this}unindent(){return this.currentIndent>0&&this.currentIndent--,this}addMarginSymbol(r){return this.marginSymbol=r,this}toString(){return this.lines.concat(this.indentedCurrentLine()).join(`
`)}getCurrentLineLength(){return this.currentLine.length}indentedCurrentLine(){let r=this.currentLine.padStart(this.currentLine.length+2*this.currentIndent);return this.marginSymbol?this.marginSymbol+r.slice(1):r}};zs();var vn=class{constructor(r){this.value=r;}write(r){r.write(this.value);}markAsError(){this.value.markAsError();}};var Pn=e=>e,Tn={bold:Pn,red:Pn,green:Pn,dim:Pn,enabled:false},Xs={bold:Q,red:ue,green:$e,dim:Ce,enabled:true},Cr={write(e){e.writeLine(",");}};var Pe=class{constructor(r){this.contents=r;}isUnderlined=false;color=r=>r;underline(){return this.isUnderlined=true,this}setColor(r){return this.color=r,this}write(r){let t=r.getCurrentLineLength();r.write(this.color(this.contents)),this.isUnderlined&&r.afterNextNewline(()=>{r.write(" ".repeat(t)).writeLine(this.color("~".repeat(this.contents.length)));});}};var ze=class{hasError=false;markAsError(){return this.hasError=true,this}};var Ir=class extends ze{items=[];addItem(r){return this.items.push(new vn(r)),this}getField(r){return this.items[r]}getPrintWidth(){return this.items.length===0?2:Math.max(...this.items.map(t=>t.value.getPrintWidth()))+2}write(r){if(this.items.length===0){this.writeEmpty(r);return}this.writeWithItems(r);}writeEmpty(r){let t=new Pe("[]");this.hasError&&t.setColor(r.context.colors.red).underline(),r.write(t);}writeWithItems(r){let{colors:t}=r.context;r.writeLine("[").withIndent(()=>r.writeJoined(Cr,this.items).newLine()).write("]"),this.hasError&&r.afterNextNewline(()=>{r.writeLine(t.red("~".repeat(this.getPrintWidth())));});}asObject(){}};var Dr=class e extends ze{fields={};suggestions=[];addField(r){this.fields[r.name]=r;}addSuggestion(r){this.suggestions.push(r);}getField(r){return this.fields[r]}getDeepField(r){let[t,...n]=r,i=this.getField(t);if(!i)return;let o=i;for(let s of n){let a;if(o.value instanceof e?a=o.value.getField(s):o.value instanceof Ir&&(a=o.value.getField(Number(s))),!a)return;o=a;}return o}getDeepFieldValue(r){return r.length===0?this:this.getDeepField(r)?.value}hasField(r){return !!this.getField(r)}removeAllFields(){this.fields={};}removeField(r){delete this.fields[r];}getFields(){return this.fields}isEmpty(){return Object.keys(this.fields).length===0}getFieldValue(r){return this.getField(r)?.value}getDeepSubSelectionValue(r){let t=this;for(let n of r){if(!(t instanceof e))return;let i=t.getSubSelectionValue(n);if(!i)return;t=i;}return t}getDeepSelectionParent(r){let t=this.getSelectionParent();if(!t)return;let n=t;for(let i of r){let o=n.value.getFieldValue(i);if(!o||!(o instanceof e))return;let s=o.getSelectionParent();if(!s)return;n=s;}return n}getSelectionParent(){let r=this.getField("select")?.value.asObject();if(r)return {kind:"select",value:r};let t=this.getField("include")?.value.asObject();if(t)return {kind:"include",value:t}}getSubSelectionValue(r){return this.getSelectionParent()?.value.fields[r].value}getPrintWidth(){let r=Object.values(this.fields);return r.length==0?2:Math.max(...r.map(n=>n.getPrintWidth()))+2}write(r){let t=Object.values(this.fields);if(t.length===0&&this.suggestions.length===0){this.writeEmpty(r);return}this.writeWithContents(r,t);}asObject(){return this}writeEmpty(r){let t=new Pe("{}");this.hasError&&t.setColor(r.context.colors.red).underline(),r.write(t);}writeWithContents(r,t){r.writeLine("{").withIndent(()=>{r.writeJoined(Cr,[...t,...this.suggestions]).newLine();}),r.write("}"),this.hasError&&r.afterNextNewline(()=>{r.writeLine(r.context.colors.red("~".repeat(this.getPrintWidth())));});}};var G=class extends ze{constructor(t){super();this.text=t;}getPrintWidth(){return this.text.length}write(t){let n=new Pe(this.text);this.hasError&&n.underline().setColor(t.context.colors.red),t.write(n);}asObject(){}};var at=class{fields=[];addField(r,t){return this.fields.push({write(n){let{green:i,dim:o}=n.context.colors;n.write(i(o(`${r}: ${t}`))).addMarginSymbol(i(o("+")));}}),this}write(r){let{colors:{green:t}}=r.context;r.writeLine(t("{")).withIndent(()=>{r.writeJoined(Cr,this.fields).newLine();}).write(t("}")).addMarginSymbol(t("+"));}};function xn(e,r,t){switch(e.kind){case "MutuallyExclusiveFields":fd(e,r);break;case "IncludeOnScalar":gd(e,r);break;case "EmptySelection":hd(e,r,t);break;case "UnknownSelectionField":wd(e,r);break;case "InvalidSelectionValue":xd(e,r);break;case "UnknownArgument":vd(e,r);break;case "UnknownInputField":Pd(e,r);break;case "RequiredArgumentMissing":Td(e,r);break;case "InvalidArgumentType":Sd(e,r);break;case "InvalidArgumentValue":Rd(e,r);break;case "ValueTooLarge":Ad(e,r);break;case "SomeFieldsMissing":Cd(e,r);break;case "TooManyFieldsGiven":Id(e,r);break;case "Union":Hs(e,r,t);break;default:throw new Error("not implemented: "+e.kind)}}function fd(e,r){let t=r.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();t&&(t.getField(e.firstField)?.markAsError(),t.getField(e.secondField)?.markAsError()),r.addErrorMessage(n=>`Please ${n.bold("either")} use ${n.green(`\`${e.firstField}\``)} or ${n.green(`\`${e.secondField}\``)}, but ${n.red("not both")} at the same time.`);}function gd(e,r){let[t,n]=Or(e.selectionPath),i=e.outputType,o=r.arguments.getDeepSelectionParent(t)?.value;if(o&&(o.getField(n)?.markAsError(),i))for(let s of i.fields)s.isRelation&&o.addSuggestion(new oe(s.name,"true"));r.addErrorMessage(s=>{let a=`Invalid scalar field ${s.red(`\`${n}\``)} for ${s.bold("include")} statement`;return i?a+=` on model ${s.bold(i.name)}. ${lt(s)}`:a+=".",a+=`
Note that ${s.bold("include")} statements only accept relation fields.`,a});}function hd(e,r,t){let n=r.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();if(n){let i=n.getField("omit")?.value.asObject();if(i){yd(e,r,i);return}if(n.hasField("select")){bd(e,r);return}}if(t?.[Qe(e.outputType.name)]){Ed(e,r);return}r.addErrorMessage(()=>`Unknown field at "${e.selectionPath.join(".")} selection"`);}function yd(e,r,t){t.removeAllFields();for(let n of e.outputType.fields)t.addSuggestion(new oe(n.name,"false"));r.addErrorMessage(n=>`The ${n.red("omit")} statement includes every field of the model ${n.bold(e.outputType.name)}. At least one field must be included in the result`);}function bd(e,r){let t=e.outputType,n=r.arguments.getDeepSelectionParent(e.selectionPath)?.value,i=n?.isEmpty()??false;n&&(n.removeAllFields(),na(n,t)),r.addErrorMessage(o=>i?`The ${o.red("`select`")} statement for type ${o.bold(t.name)} must not be empty. ${lt(o)}`:`The ${o.red("`select`")} statement for type ${o.bold(t.name)} needs ${o.bold("at least one truthy value")}.`);}function Ed(e,r){let t=new at;for(let i of e.outputType.fields)i.isRelation||t.addField(i.name,"false");let n=new oe("omit",t).makeRequired();if(e.selectionPath.length===0)r.arguments.addSuggestion(n);else {let[i,o]=Or(e.selectionPath),a=r.arguments.getDeepSelectionParent(i)?.value.asObject()?.getField(o);if(a){let l=a?.value.asObject()??new Dr;l.addSuggestion(n),a.value=l;}}r.addErrorMessage(i=>`The global ${i.red("omit")} configuration excludes every field of the model ${i.bold(e.outputType.name)}. At least one field must be included in the result`);}function wd(e,r){let t=ia(e.selectionPath,r);if(t.parentKind!=="unknown"){t.field.markAsError();let n=t.parent;switch(t.parentKind){case "select":na(n,e.outputType);break;case "include":Dd(n,e.outputType);break;case "omit":Od(n,e.outputType);break}}r.addErrorMessage(n=>{let i=[`Unknown field ${n.red(`\`${t.fieldName}\``)}`];return t.parentKind!=="unknown"&&i.push(`for ${n.bold(t.parentKind)} statement`),i.push(`on model ${n.bold(`\`${e.outputType.name}\``)}.`),i.push(lt(n)),i.join(" ")});}function xd(e,r){let t=ia(e.selectionPath,r);t.parentKind!=="unknown"&&t.field.value.markAsError(),r.addErrorMessage(n=>`Invalid value for selection field \`${n.red(t.fieldName)}\`: ${e.underlyingError}`);}function vd(e,r){let t=e.argumentPath[0],n=r.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();n&&(n.getField(t)?.markAsError(),kd(n,e.arguments)),r.addErrorMessage(i=>ra(i,t,e.arguments.map(o=>o.name)));}function Pd(e,r){let[t,n]=Or(e.argumentPath),i=r.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();if(i){i.getDeepField(e.argumentPath)?.markAsError();let o=i.getDeepFieldValue(t)?.asObject();o&&oa(o,e.inputType);}r.addErrorMessage(o=>ra(o,n,e.inputType.fields.map(s=>s.name)));}function ra(e,r,t){let n=[`Unknown argument \`${e.red(r)}\`.`],i=Nd(r,t);return i&&n.push(`Did you mean \`${e.green(i)}\`?`),t.length>0&&n.push(lt(e)),n.join(" ")}function Td(e,r){let t;r.addErrorMessage(l=>t?.value instanceof G&&t.value.text==="null"?`Argument \`${l.green(o)}\` must not be ${l.red("null")}.`:`Argument \`${l.green(o)}\` is missing.`);let n=r.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();if(!n)return;let[i,o]=Or(e.argumentPath),s=new at,a=n.getDeepFieldValue(i)?.asObject();if(a){if(t=a.getField(o),t&&a.removeField(o),e.inputTypes.length===1&&e.inputTypes[0].kind==="object"){for(let l of e.inputTypes[0].fields)s.addField(l.name,l.typeNames.join(" | "));a.addSuggestion(new oe(o,s).makeRequired());}else {let l=e.inputTypes.map(ta).join(" | ");a.addSuggestion(new oe(o,l).makeRequired());}if(e.dependentArgumentPath){n.getDeepField(e.dependentArgumentPath)?.markAsError();let[,l]=Or(e.dependentArgumentPath);r.addErrorMessage(u=>`Argument \`${u.green(o)}\` is required because argument \`${u.green(l)}\` was provided.`);}}}function ta(e){return e.kind==="list"?`${ta(e.elementType)}[]`:e.name}function Sd(e,r){let t=e.argument.name,n=r.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();n&&n.getDeepFieldValue(e.argumentPath)?.markAsError(),r.addErrorMessage(i=>{let o=Sn("or",e.argument.typeNames.map(s=>i.green(s)));return `Argument \`${i.bold(t)}\`: Invalid value provided. Expected ${o}, provided ${i.red(e.inferredType)}.`});}function Rd(e,r){let t=e.argument.name,n=r.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();n&&n.getDeepFieldValue(e.argumentPath)?.markAsError(),r.addErrorMessage(i=>{let o=[`Invalid value for argument \`${i.bold(t)}\``];if(e.underlyingError&&o.push(`: ${e.underlyingError}`),o.push("."),e.argument.typeNames.length>0){let s=Sn("or",e.argument.typeNames.map(a=>i.green(a)));o.push(` Expected ${s}.`);}return o.join("")});}function Ad(e,r){let t=e.argument.name,n=r.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject(),i;if(n){let s=n.getDeepField(e.argumentPath)?.value;s?.markAsError(),s instanceof G&&(i=s.text);}r.addErrorMessage(o=>{let s=["Unable to fit value"];return i&&s.push(o.red(i)),s.push(`into a 64-bit signed integer for field \`${o.bold(t)}\``),s.join(" ")});}function Cd(e,r){let t=e.argumentPath[e.argumentPath.length-1],n=r.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();if(n){let i=n.getDeepFieldValue(e.argumentPath)?.asObject();i&&oa(i,e.inputType);}r.addErrorMessage(i=>{let o=[`Argument \`${i.bold(t)}\` of type ${i.bold(e.inputType.name)} needs`];return e.constraints.minFieldCount===1?e.constraints.requiredFields?o.push(`${i.green("at least one of")} ${Sn("or",e.constraints.requiredFields.map(s=>`\`${i.bold(s)}\``))} arguments.`):o.push(`${i.green("at least one")} argument.`):o.push(`${i.green(`at least ${e.constraints.minFieldCount}`)} arguments.`),o.push(lt(i)),o.join(" ")});}function Id(e,r){let t=e.argumentPath[e.argumentPath.length-1],n=r.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject(),i=[];if(n){let o=n.getDeepFieldValue(e.argumentPath)?.asObject();o&&(o.markAsError(),i=Object.keys(o.getFields()));}r.addErrorMessage(o=>{let s=[`Argument \`${o.bold(t)}\` of type ${o.bold(e.inputType.name)} needs`];return e.constraints.minFieldCount===1&&e.constraints.maxFieldCount==1?s.push(`${o.green("exactly one")} argument,`):e.constraints.maxFieldCount==1?s.push(`${o.green("at most one")} argument,`):s.push(`${o.green(`at most ${e.constraints.maxFieldCount}`)} arguments,`),s.push(`but you provided ${Sn("and",i.map(a=>o.red(a)))}. Please choose`),e.constraints.maxFieldCount===1?s.push("one."):s.push(`${e.constraints.maxFieldCount}.`),s.join(" ")});}function na(e,r){for(let t of r.fields)e.hasField(t.name)||e.addSuggestion(new oe(t.name,"true"));}function Dd(e,r){for(let t of r.fields)t.isRelation&&!e.hasField(t.name)&&e.addSuggestion(new oe(t.name,"true"));}function Od(e,r){for(let t of r.fields)!e.hasField(t.name)&&!t.isRelation&&e.addSuggestion(new oe(t.name,"true"));}function kd(e,r){for(let t of r)e.hasField(t.name)||e.addSuggestion(new oe(t.name,t.typeNames.join(" | ")));}function ia(e,r){let[t,n]=Or(e),i=r.arguments.getDeepSubSelectionValue(t)?.asObject();if(!i)return {parentKind:"unknown",fieldName:n};let o=i.getFieldValue("select")?.asObject(),s=i.getFieldValue("include")?.asObject(),a=i.getFieldValue("omit")?.asObject(),l=o?.getField(n);return o&&l?{parentKind:"select",parent:o,field:l,fieldName:n}:(l=s?.getField(n),s&&l?{parentKind:"include",field:l,parent:s,fieldName:n}:(l=a?.getField(n),a&&l?{parentKind:"omit",field:l,parent:a,fieldName:n}:{parentKind:"unknown",fieldName:n}))}function oa(e,r){if(r.kind==="object")for(let t of r.fields)e.hasField(t.name)||e.addSuggestion(new oe(t.name,t.typeNames.join(" | ")));}function Or(e){let r=[...e],t=r.pop();if(!t)throw new Error("unexpected empty path");return [r,t]}function lt({green:e,enabled:r}){return "Available options are "+(r?`listed in ${e("green")}`:"marked with ?")+"."}function Sn(e,r){if(r.length===1)return r[0];let t=[...r],n=t.pop();return `${t.join(", ")} ${e} ${n}`}var _d=3;function Nd(e,r){let t=1/0,n;for(let i of r){let o=(0, ea.default)(e,i);o>_d||o<t&&(t=o,n=i);}return n}var ut=class{modelName;name;typeName;isList;isEnum;constructor(r,t,n,i,o){this.modelName=r,this.name=t,this.typeName=n,this.isList=i,this.isEnum=o;}_toGraphQLInputType(){let r=this.isList?"List":"",t=this.isEnum?"Enum":"";return `${r}${t}${this.typeName}FieldRefInput<${this.modelName}>`}};function kr(e){return e instanceof ut}var Rn=Symbol(),ji=new WeakMap,Fe=class{constructor(r){r===Rn?ji.set(this,`Prisma.${this._getName()}`):ji.set(this,`new Prisma.${this._getNamespace()}.${this._getName()}()`);}_getName(){return this.constructor.name}toString(){return ji.get(this)}},ct=class extends Fe{_getNamespace(){return "NullTypes"}},pt=class extends ct{#e};Ui(pt,"DbNull");var dt=class extends ct{#e};Ui(dt,"JsonNull");var mt=class extends ct{#e};Ui(mt,"AnyNull");var Bi={instances:{DbNull:new pt(Rn),JsonNull:new dt(Rn),AnyNull:new mt(Rn)}};function Ui(e,r){Object.defineProperty(e,"name",{value:r,configurable:true});}var sa=": ",An=class{constructor(r,t){this.name=r;this.value=t;}hasError=false;markAsError(){this.hasError=true;}getPrintWidth(){return this.name.length+this.value.getPrintWidth()+sa.length}write(r){let t=new Pe(this.name);this.hasError&&t.underline().setColor(r.context.colors.red),r.write(t).write(sa).write(this.value);}};var Gi=class{arguments;errorMessages=[];constructor(r){this.arguments=r;}write(r){r.write(this.arguments);}addErrorMessage(r){this.errorMessages.push(r);}renderAllMessages(r){return this.errorMessages.map(t=>t(r)).join(`
`)}};function _r(e){return new Gi(aa(e))}function aa(e){let r=new Dr;for(let[t,n]of Object.entries(e)){let i=new An(t,la(n));r.addField(i);}return r}function la(e){if(typeof e=="string")return new G(JSON.stringify(e));if(typeof e=="number"||typeof e=="boolean")return new G(String(e));if(typeof e=="bigint")return new G(`${e}n`);if(e===null)return new G("null");if(e===void 0)return new G("undefined");if(Sr(e))return new G(`new Prisma.Decimal("${e.toFixed()}")`);if(e instanceof Uint8Array)return Buffer.isBuffer(e)?new G(`Buffer.alloc(${e.byteLength})`):new G(`new Uint8Array(${e.byteLength})`);if(e instanceof Date){let r=ln(e)?e.toISOString():"Invalid Date";return new G(`new Date("${r}")`)}return e instanceof Fe?new G(`Prisma.${e._getName()}`):kr(e)?new G(`prisma.${Qe(e.modelName)}.$fields.${e.name}`):Array.isArray(e)?Ld(e):typeof e=="object"?aa(e):new G(Object.prototype.toString.call(e))}function Ld(e){let r=new Ir;for(let t of e)r.addItem(la(t));return r}function Cn(e,r){let t=r==="pretty"?Xs:Tn,n=e.renderAllMessages(t),i=new Ar(0,{colors:t}).write(e).toString();return {message:n,args:i}}function In({args:e,errors:r,errorFormat:t,callsite:n,originalMethod:i,clientVersion:o,globalOmit:s}){let a=_r(e);for(let p of r)xn(p,a,s);let{message:l,args:u}=Cn(a,t),c=wn({message:l,callsite:n,originalMethod:i,showColors:t==="pretty",callArguments:u});throw new X(c,{clientVersion:o})}function Te(e){return e.replace(/^./,r=>r.toLowerCase())}function ca(e,r,t){let n=Te(t);return !r.result||!(r.result.$allModels||r.result[n])?e:Fd({...e,...ua(r.name,e,r.result.$allModels),...ua(r.name,e,r.result[n])})}function Fd(e){let r=new we,t=(n,i)=>r.getOrCreate(n,()=>i.has(n)?[n]:(i.add(n),e[n]?e[n].needs.flatMap(o=>t(o,i)):[n]));return on(e,n=>({...n,needs:t(n.name,new Set)}))}function ua(e,r,t){return t?on(t,({needs:n,compute:i},o)=>({name:o,needs:n?Object.keys(n).filter(s=>n[s]):[],compute:Md(r,o,i)})):{}}function Md(e,r,t){let n=e?.[r]?.compute;return n?i=>t({...i,[r]:n(i)}):t}function pa(e,r){if(!r)return e;let t={...e};for(let n of Object.values(r))if(e[n.name])for(let i of n.needs)t[i]=true;return t}function da(e,r){if(!r)return e;let t={...e};for(let n of Object.values(r))if(!e[n.name])for(let i of n.needs)delete t[i];return t}var Dn=class{constructor(r,t){this.extension=r;this.previous=t;}computedFieldsCache=new we;modelExtensionsCache=new we;queryCallbacksCache=new we;clientExtensions=ot(()=>this.extension.client?{...this.previous?.getAllClientExtensions(),...this.extension.client}:this.previous?.getAllClientExtensions());batchCallbacks=ot(()=>{let r=this.previous?.getAllBatchQueryCallbacks()??[],t=this.extension.query?.$__internalBatch;return t?r.concat(t):r});getAllComputedFields(r){return this.computedFieldsCache.getOrCreate(r,()=>ca(this.previous?.getAllComputedFields(r),this.extension,r))}getAllClientExtensions(){return this.clientExtensions.get()}getAllModelExtensions(r){return this.modelExtensionsCache.getOrCreate(r,()=>{let t=Te(r);return !this.extension.model||!(this.extension.model[t]||this.extension.model.$allModels)?this.previous?.getAllModelExtensions(r):{...this.previous?.getAllModelExtensions(r),...this.extension.model.$allModels,...this.extension.model[t]}})}getAllQueryCallbacks(r,t){return this.queryCallbacksCache.getOrCreate(`${r}:${t}`,()=>{let n=this.previous?.getAllQueryCallbacks(r,t)??[],i=[],o=this.extension.query;return !o||!(o[r]||o.$allModels||o[t]||o.$allOperations)?n:(o[r]!==void 0&&(o[r][t]!==void 0&&i.push(o[r][t]),o[r].$allOperations!==void 0&&i.push(o[r].$allOperations)),r!=="$none"&&o.$allModels!==void 0&&(o.$allModels[t]!==void 0&&i.push(o.$allModels[t]),o.$allModels.$allOperations!==void 0&&i.push(o.$allModels.$allOperations)),o[t]!==void 0&&i.push(o[t]),o.$allOperations!==void 0&&i.push(o.$allOperations),n.concat(i))})}getAllBatchQueryCallbacks(){return this.batchCallbacks.get()}},Nr=class e{constructor(r){this.head=r;}static empty(){return new e}static single(r){return new e(new Dn(r))}isEmpty(){return this.head===void 0}append(r){return new e(new Dn(r,this.head))}getAllComputedFields(r){return this.head?.getAllComputedFields(r)}getAllClientExtensions(){return this.head?.getAllClientExtensions()}getAllModelExtensions(r){return this.head?.getAllModelExtensions(r)}getAllQueryCallbacks(r,t){return this.head?.getAllQueryCallbacks(r,t)??[]}getAllBatchQueryCallbacks(){return this.head?.getAllBatchQueryCallbacks()??[]}};var On=class{constructor(r){this.name=r;}};function ma(e){return e instanceof On}var fa=Symbol(),ft=class{constructor(r){if(r!==fa)throw new Error("Skip instance can not be constructed directly")}ifUndefined(r){return r===void 0?Qi:r}},Qi=new ft(fa);function Se(e){return e instanceof ft}var qd={findUnique:"findUnique",findUniqueOrThrow:"findUniqueOrThrow",findFirst:"findFirst",findFirstOrThrow:"findFirstOrThrow",findMany:"findMany",count:"aggregate",create:"createOne",createMany:"createMany",createManyAndReturn:"createManyAndReturn",update:"updateOne",updateMany:"updateMany",updateManyAndReturn:"updateManyAndReturn",upsert:"upsertOne",delete:"deleteOne",deleteMany:"deleteMany",executeRaw:"executeRaw",queryRaw:"queryRaw",aggregate:"aggregate",groupBy:"groupBy",runCommandRaw:"runCommandRaw",findRaw:"findRaw",aggregateRaw:"aggregateRaw"},ga="explicitly `undefined` values are not allowed";function Ji({modelName:e,action:r,args:t,runtimeDataModel:n,extensions:i=Nr.empty(),callsite:o,clientMethod:s,errorFormat:a,clientVersion:l,previewFeatures:u,globalOmit:c}){let p=new Wi({runtimeDataModel:n,modelName:e,action:r,rootArgs:t,callsite:o,extensions:i,selectionPath:[],argumentPath:[],originalMethod:s,errorFormat:a,clientVersion:l,previewFeatures:u,globalOmit:c});return {modelName:e,action:qd[r],query:gt(t,p)}}function gt({select:e,include:r,...t}={},n){let i=t.omit;return delete t.omit,{arguments:ya(t,n),selection:Vd(e,r,i,n)}}function Vd(e,r,t,n){return e?(r?n.throwValidationError({kind:"MutuallyExclusiveFields",firstField:"include",secondField:"select",selectionPath:n.getSelectionPath()}):t&&n.throwValidationError({kind:"MutuallyExclusiveFields",firstField:"omit",secondField:"select",selectionPath:n.getSelectionPath()}),Gd(e,n)):jd(n,r,t)}function jd(e,r,t){let n={};return e.modelOrType&&!e.isRawAction()&&(n.$composites=true,n.$scalars=true),r&&Bd(n,r,e),Ud(n,t,e),n}function Bd(e,r,t){for(let[n,i]of Object.entries(r)){if(Se(i))continue;let o=t.nestSelection(n);if(Ki(i,o),i===false||i===void 0){e[n]=false;continue}let s=t.findField(n);if(s&&s.kind!=="object"&&t.throwValidationError({kind:"IncludeOnScalar",selectionPath:t.getSelectionPath().concat(n),outputType:t.getOutputTypeDescription()}),s){e[n]=gt(i===true?{}:i,o);continue}if(i===true){e[n]=true;continue}e[n]=gt(i,o);}}function Ud(e,r,t){let n=t.getComputedFields(),i={...t.getGlobalOmit(),...r},o=da(i,n);for(let[s,a]of Object.entries(o)){if(Se(a))continue;Ki(a,t.nestSelection(s));let l=t.findField(s);n?.[s]&&!l||(e[s]=!a);}}function Gd(e,r){let t={},n=r.getComputedFields(),i=pa(e,n);for(let[o,s]of Object.entries(i)){if(Se(s))continue;let a=r.nestSelection(o);Ki(s,a);let l=r.findField(o);if(!(n?.[o]&&!l)){if(s===false||s===void 0||Se(s)){t[o]=false;continue}if(s===true){l?.kind==="object"?t[o]=gt({},a):t[o]=true;continue}t[o]=gt(s,a);}}return t}function ha(e,r){if(e===null)return null;if(typeof e=="string"||typeof e=="number"||typeof e=="boolean")return e;if(typeof e=="bigint")return {$type:"BigInt",value:String(e)};if(vr(e)){if(ln(e))return {$type:"DateTime",value:e.toISOString()};r.throwValidationError({kind:"InvalidArgumentValue",selectionPath:r.getSelectionPath(),argumentPath:r.getArgumentPath(),argument:{name:r.getArgumentName(),typeNames:["Date"]},underlyingError:"Provided Date object is invalid"});}if(ma(e))return {$type:"Param",value:e.name};if(kr(e))return {$type:"FieldRef",value:{_ref:e.name,_container:e.modelName}};if(Array.isArray(e))return Qd(e,r);if(ArrayBuffer.isView(e)){let{buffer:t,byteOffset:n,byteLength:i}=e;return {$type:"Bytes",value:Buffer.from(t,n,i).toString("base64")}}if(Wd(e))return e.values;if(Sr(e))return {$type:"Decimal",value:e.toFixed()};if(e instanceof Fe){if(e!==Bi.instances[e._getName()])throw new Error("Invalid ObjectEnumValue");return {$type:"Enum",value:e._getName()}}if(Jd(e))return e.toJSON();if(typeof e=="object")return ya(e,r);r.throwValidationError({kind:"InvalidArgumentValue",selectionPath:r.getSelectionPath(),argumentPath:r.getArgumentPath(),argument:{name:r.getArgumentName(),typeNames:[]},underlyingError:`We could not serialize ${Object.prototype.toString.call(e)} value. Serialize the object to JSON or implement a ".toJSON()" method on it`});}function ya(e,r){if(e.$type)return {$type:"Raw",value:e};let t={};for(let n in e){let i=e[n],o=r.nestArgument(n);Se(i)||(i!==void 0?t[n]=ha(i,o):r.isPreviewFeatureOn("strictUndefinedChecks")&&r.throwValidationError({kind:"InvalidArgumentValue",argumentPath:o.getArgumentPath(),selectionPath:r.getSelectionPath(),argument:{name:r.getArgumentName(),typeNames:[]},underlyingError:ga}));}return t}function Qd(e,r){let t=[];for(let n=0;n<e.length;n++){let i=r.nestArgument(String(n)),o=e[n];if(o===void 0||Se(o)){let s=o===void 0?"undefined":"Prisma.skip";r.throwValidationError({kind:"InvalidArgumentValue",selectionPath:i.getSelectionPath(),argumentPath:i.getArgumentPath(),argument:{name:`${r.getArgumentName()}[${n}]`,typeNames:[]},underlyingError:`Can not use \`${s}\` value within array. Use \`null\` or filter out \`${s}\` values`});}t.push(ha(o,i));}return t}function Wd(e){return typeof e=="object"&&e!==null&&e.__prismaRawParameters__===true}function Jd(e){return typeof e=="object"&&e!==null&&typeof e.toJSON=="function"}function Ki(e,r){e===void 0&&r.isPreviewFeatureOn("strictUndefinedChecks")&&r.throwValidationError({kind:"InvalidSelectionValue",selectionPath:r.getSelectionPath(),underlyingError:ga});}var Wi=class e{constructor(r){this.params=r;this.params.modelName&&(this.modelOrType=this.params.runtimeDataModel.models[this.params.modelName]??this.params.runtimeDataModel.types[this.params.modelName]);}modelOrType;throwValidationError(r){In({errors:[r],originalMethod:this.params.originalMethod,args:this.params.rootArgs??{},callsite:this.params.callsite,errorFormat:this.params.errorFormat,clientVersion:this.params.clientVersion,globalOmit:this.params.globalOmit});}getSelectionPath(){return this.params.selectionPath}getArgumentPath(){return this.params.argumentPath}getArgumentName(){return this.params.argumentPath[this.params.argumentPath.length-1]}getOutputTypeDescription(){if(!(!this.params.modelName||!this.modelOrType))return {name:this.params.modelName,fields:this.modelOrType.fields.map(r=>({name:r.name,typeName:"boolean",isRelation:r.kind==="object"}))}}isRawAction(){return ["executeRaw","queryRaw","runCommandRaw","findRaw","aggregateRaw"].includes(this.params.action)}isPreviewFeatureOn(r){return this.params.previewFeatures.includes(r)}getComputedFields(){if(this.params.modelName)return this.params.extensions.getAllComputedFields(this.params.modelName)}findField(r){return this.modelOrType?.fields.find(t=>t.name===r)}nestSelection(r){let t=this.findField(r),n=t?.kind==="object"?t.type:void 0;return new e({...this.params,modelName:n,selectionPath:this.params.selectionPath.concat(r)})}getGlobalOmit(){return this.params.modelName&&this.shouldApplyGlobalOmit()?this.params.globalOmit?.[Qe(this.params.modelName)]??{}:{}}shouldApplyGlobalOmit(){switch(this.params.action){case "findFirst":case "findFirstOrThrow":case "findUniqueOrThrow":case "findMany":case "upsert":case "findUnique":case "createManyAndReturn":case "create":case "update":case "updateManyAndReturn":case "delete":return  true;case "executeRaw":case "aggregateRaw":case "runCommandRaw":case "findRaw":case "createMany":case "deleteMany":case "groupBy":case "updateMany":case "count":case "aggregate":case "queryRaw":return  false;default:sr(this.params.action,"Unknown action");}}nestArgument(r){return new e({...this.params,argumentPath:this.params.argumentPath.concat(r)})}};function ba(e){if(!e._hasPreviewFlag("metrics"))throw new X("`metrics` preview feature must be enabled in order to access metrics API",{clientVersion:e._clientVersion})}var ht=class{_client;constructor(r){this._client=r;}prometheus(r){return ba(this._client),this._client._engine.metrics({format:"prometheus",...r})}json(r){return ba(this._client),this._client._engine.metrics({format:"json",...r})}};var Yi=new WeakMap,kn="$$PrismaTypedSql",yt=class{constructor(r,t){Yi.set(this,{sql:r,values:t}),Object.defineProperty(this,kn,{value:kn});}get sql(){return Yi.get(this).sql}get values(){return Yi.get(this).values}};function _n(e){return e!=null&&e[kn]===kn}var Zl=le(gi());var se=class e{constructor(r,t){if(r.length-1!==t.length)throw r.length===0?new TypeError("Expected at least 1 string"):new TypeError(`Expected ${r.length} strings to have ${r.length-1} values`);let n=t.reduce((s,a)=>s+(a instanceof e?a.values.length:1),0);this.values=new Array(n),this.strings=new Array(n+1),this.strings[0]=r[0];let i=0,o=0;for(;i<t.length;){let s=t[i++],a=r[i];if(s instanceof e){this.strings[o]+=s.strings[0];let l=0;for(;l<s.values.length;)this.values[o++]=s.values[l++],this.strings[o]=s.strings[l];this.strings[o]+=a;}else this.values[o++]=s,this.strings[o]=a;}}get sql(){let r=this.strings.length,t=1,n=this.strings[0];for(;t<r;)n+=`?${this.strings[t++]}`;return n}get statement(){let r=this.strings.length,t=1,n=this.strings[0];for(;t<r;)n+=`:${t}${this.strings[t++]}`;return n}get text(){let r=this.strings.length,t=1,n=this.strings[0];for(;t<r;)n+=`$${t}${this.strings[t++]}`;return n}inspect(){return {sql:this.sql,statement:this.statement,text:this.text,values:this.values}}};function Ea(e){return new se([e],[])}Ea("");function bt(e){return {getKeys(){return Object.keys(e)},getPropertyValue(r){return e[r]}}}function ee(e,r){return {getKeys(){return [e]},getPropertyValue(){return r()}}}function ar(e){let r=new we;return {getKeys(){return e.getKeys()},getPropertyValue(t){return r.getOrCreate(t,()=>e.getPropertyValue(t))},getPropertyDescriptor(t){return e.getPropertyDescriptor?.(t)}}}var Nn={enumerable:true,configurable:true,writable:true};function Ln(e){let r=new Set(e);return {getPrototypeOf:()=>Object.prototype,getOwnPropertyDescriptor:()=>Nn,has:(t,n)=>r.has(n),set:(t,n,i)=>r.add(n)&&Reflect.set(t,n,i),ownKeys:()=>[...r]}}var xa=Symbol.for("nodejs.util.inspect.custom");function he(e,r){let t=Xd(r),n=new Set,i=new Proxy(e,{get(o,s){if(n.has(s))return o[s];let a=t.get(s);return a?a.getPropertyValue(s):o[s]},has(o,s){if(n.has(s))return  true;let a=t.get(s);return a?a.has?.(s)??true:Reflect.has(o,s)},ownKeys(o){let s=va(Reflect.ownKeys(o),t),a=va(Array.from(t.keys()),t);return [...new Set([...s,...a,...n])]},set(o,s,a){return t.get(s)?.getPropertyDescriptor?.(s)?.writable===false?false:(n.add(s),Reflect.set(o,s,a))},getOwnPropertyDescriptor(o,s){let a=Reflect.getOwnPropertyDescriptor(o,s);if(a&&!a.configurable)return a;let l=t.get(s);return l?l.getPropertyDescriptor?{...Nn,...l?.getPropertyDescriptor(s)}:Nn:a},defineProperty(o,s,a){return n.add(s),Reflect.defineProperty(o,s,a)},getPrototypeOf:()=>Object.prototype});return i[xa]=function(){let o={...this};return delete o[xa],o},i}function Xd(e){let r=new Map;for(let t of e){let n=t.getKeys();for(let i of n)r.set(i,t);}return r}function va(e,r){return e.filter(t=>r.get(t)?.has?.(t)??true)}function Lr(e){return {getKeys(){return e},has(){return  false},getPropertyValue(){}}}function Fr(e,r){return {batch:e,transaction:r?.kind==="batch"?{isolationLevel:r.options.isolationLevel}:void 0}}function Pa(e){if(e===void 0)return "";let r=_r(e);return new Ar(0,{colors:Tn}).write(r).toString()}var em="P2037";function Mr({error:e,user_facing_error:r},t,n){return r.error_code?new Z(rm(r,n),{code:r.error_code,clientVersion:t,meta:r.meta,batchRequestIdx:r.batch_request_idx}):new q(e,{clientVersion:t,batchRequestIdx:r.batch_request_idx})}function rm(e,r){let t=e.message;return (r==="postgresql"||r==="postgres"||r==="mysql")&&e.error_code===em&&(t+=`
Prisma Accelerate has built-in connection pooling to prevent such errors: https://pris.ly/client/error-accelerate`),t}var Et="<unknown>";function Ta(e){var r=e.split(`
`);return r.reduce(function(t,n){var i=im(n)||sm(n)||um(n)||mm(n)||pm(n);return i&&t.push(i),t},[])}var tm=/^\s*at (.*?) ?\(((?:file|https?|blob|chrome-extension|native|eval|webpack|rsc|<anonymous>|\/|[a-z]:\\|\\\\).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i,nm=/\((\S*)(?::(\d+))(?::(\d+))\)/;function im(e){var r=tm.exec(e);if(!r)return null;var t=r[2]&&r[2].indexOf("native")===0,n=r[2]&&r[2].indexOf("eval")===0,i=nm.exec(r[2]);return n&&i!=null&&(r[2]=i[1],r[3]=i[2],r[4]=i[3]),{file:t?null:r[2],methodName:r[1]||Et,arguments:t?[r[2]]:[],lineNumber:r[3]?+r[3]:null,column:r[4]?+r[4]:null}}var om=/^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|rsc|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i;function sm(e){var r=om.exec(e);return r?{file:r[2],methodName:r[1]||Et,arguments:[],lineNumber:+r[3],column:r[4]?+r[4]:null}:null}var am=/^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|rsc|resource|\[native).*?|[^@]*bundle)(?::(\d+))?(?::(\d+))?\s*$/i,lm=/(\S+) line (\d+)(?: > eval line \d+)* > eval/i;function um(e){var r=am.exec(e);if(!r)return null;var t=r[3]&&r[3].indexOf(" > eval")>-1,n=lm.exec(r[3]);return t&&n!=null&&(r[3]=n[1],r[4]=n[2],r[5]=null),{file:r[3],methodName:r[1]||Et,arguments:r[2]?r[2].split(","):[],lineNumber:r[4]?+r[4]:null,column:r[5]?+r[5]:null}}var cm=/^\s*(?:([^@]*)(?:\((.*?)\))?@)?(\S.*?):(\d+)(?::(\d+))?\s*$/i;function pm(e){var r=cm.exec(e);return r?{file:r[3],methodName:r[1]||Et,arguments:[],lineNumber:+r[4],column:r[5]?+r[5]:null}:null}var dm=/^\s*at (?:((?:\[object object\])?[^\\/]+(?: \[as \S+\])?) )?\(?(.*?):(\d+)(?::(\d+))?\)?\s*$/i;function mm(e){var r=dm.exec(e);return r?{file:r[2],methodName:r[1]||Et,arguments:[],lineNumber:+r[3],column:r[4]?+r[4]:null}:null}var zi=class{getLocation(){return null}},Zi=class{_error;constructor(){this._error=new Error;}getLocation(){let r=this._error.stack;if(!r)return null;let n=Ta(r).find(i=>{if(!i.file)return  false;let o=Si(i.file);return o!=="<anonymous>"&&!o.includes("@prisma")&&!o.includes("/packages/client/src/runtime/")&&!o.endsWith("/runtime/binary.js")&&!o.endsWith("/runtime/library.js")&&!o.endsWith("/runtime/edge.js")&&!o.endsWith("/runtime/edge-esm.js")&&!o.startsWith("internal/")&&!i.methodName.includes("new ")&&!i.methodName.includes("getCallSite")&&!i.methodName.includes("Proxy.")&&i.methodName.split(".").length<4});return !n||!n.file?null:{fileName:n.file,lineNumber:n.lineNumber,columnNumber:n.column}}};function Ze(e){return e==="minimal"?typeof $EnabledCallSite=="function"&&e!=="minimal"?new $EnabledCallSite:new zi:new Zi}var Sa={_avg:true,_count:true,_sum:true,_min:true,_max:true};function $r(e={}){let r=gm(e);return Object.entries(r).reduce((n,[i,o])=>(Sa[i]!==void 0?n.select[i]={select:o}:n[i]=o,n),{select:{}})}function gm(e={}){return typeof e._count=="boolean"?{...e,_count:{_all:e._count}}:e}function Fn(e={}){return r=>(typeof e._count=="boolean"&&(r._count=r._count._all),r)}function Ra(e,r){let t=Fn(e);return r({action:"aggregate",unpacker:t,argsMapper:$r})(e)}function hm(e={}){let{select:r,...t}=e;return typeof r=="object"?$r({...t,_count:r}):$r({...t,_count:{_all:true}})}function ym(e={}){return typeof e.select=="object"?r=>Fn(e)(r)._count:r=>Fn(e)(r)._count._all}function Aa(e,r){return r({action:"count",unpacker:ym(e),argsMapper:hm})(e)}function bm(e={}){let r=$r(e);if(Array.isArray(r.by))for(let t of r.by)typeof t=="string"&&(r.select[t]=true);else typeof r.by=="string"&&(r.select[r.by]=true);return r}function Em(e={}){return r=>(typeof e?._count=="boolean"&&r.forEach(t=>{t._count=t._count._all;}),r)}function Ca(e,r){return r({action:"groupBy",unpacker:Em(e),argsMapper:bm})(e)}function Ia(e,r,t){if(r==="aggregate")return n=>Ra(n,t);if(r==="count")return n=>Aa(n,t);if(r==="groupBy")return n=>Ca(n,t)}function Da(e,r){let t=r.fields.filter(i=>!i.relationName),n=As(t,"name");return new Proxy({},{get(i,o){if(o in i||typeof o=="symbol")return i[o];let s=n[o];if(s)return new ut(e,o,s.type,s.isList,s.kind==="enum")},...Ln(Object.keys(n))})}var Oa=e=>Array.isArray(e)?e:e.split("."),Xi=(e,r)=>Oa(r).reduce((t,n)=>t&&t[n],e),ka=(e,r,t)=>Oa(r).reduceRight((n,i,o,s)=>Object.assign({},Xi(e,s.slice(0,o)),{[i]:n}),t);function wm(e,r){return e===void 0||r===void 0?[]:[...r,"select",e]}function xm(e,r,t){return r===void 0?e??{}:ka(r,t,e||true)}function eo(e,r,t,n,i,o){let a=e._runtimeDataModel.models[r].fields.reduce((l,u)=>({...l,[u.name]:u}),{});return l=>{let u=Ze(e._errorFormat),c=wm(n,i),p=xm(l,o,c),d=t({dataPath:c,callsite:u})(p),f=vm(e,r);return new Proxy(d,{get(h,g){if(!f.includes(g))return h[g];let T=[a[g].type,t,g],S=[c,p];return eo(e,...T,...S)},...Ln([...f,...Object.getOwnPropertyNames(d)])})}}function vm(e,r){return e._runtimeDataModel.models[r].fields.filter(t=>t.kind==="object").map(t=>t.name)}var Pm=["findUnique","findUniqueOrThrow","findFirst","findFirstOrThrow","create","update","upsert","delete"],Tm=["aggregate","count","groupBy"];function ro(e,r){let t=e._extensions.getAllModelExtensions(r)??{},n=[Sm(e,r),Am(e,r),bt(t),ee("name",()=>r),ee("$name",()=>r),ee("$parent",()=>e._appliedParent)];return he({},n)}function Sm(e,r){let t=Te(r),n=Object.keys(Rr).concat("count");return {getKeys(){return n},getPropertyValue(i){let o=i,s=a=>l=>{let u=Ze(e._errorFormat);return e._createPrismaPromise(c=>{let p={args:l,dataPath:[],action:o,model:r,clientMethod:`${t}.${i}`,jsModelName:t,transaction:c,callsite:u};return e._request({...p,...a})},{action:o,args:l,model:r})};return Pm.includes(o)?eo(e,r,s):Rm(i)?Ia(e,i,s):s({})}}}function Rm(e){return Tm.includes(e)}function Am(e,r){return ar(ee("fields",()=>{let t=e._runtimeDataModel.models[r];return Da(r,t)}))}function _a(e){return e.replace(/^./,r=>r.toUpperCase())}var to=Symbol();function wt(e){let r=[Cm(e),Im(e),ee(to,()=>e),ee("$parent",()=>e._appliedParent)],t=e._extensions.getAllClientExtensions();return t&&r.push(bt(t)),he(e,r)}function Cm(e){let r=Object.getPrototypeOf(e._originalClient),t=[...new Set(Object.getOwnPropertyNames(r))];return {getKeys(){return t},getPropertyValue(n){return e[n]}}}function Im(e){let r=Object.keys(e._runtimeDataModel.models),t=r.map(Te),n=[...new Set(r.concat(t))];return ar({getKeys(){return n},getPropertyValue(i){let o=_a(i);if(e._runtimeDataModel.models[o]!==void 0)return ro(e,o);if(e._runtimeDataModel.models[i]!==void 0)return ro(e,i)},getPropertyDescriptor(i){if(!t.includes(i))return {enumerable:false}}})}function Na(e){return e[to]?e[to]:e}function La(e){if(typeof e=="function")return e(this);if(e.client?.__AccelerateEngine){let t=e.client.__AccelerateEngine;this._originalClient._engine=new t(this._originalClient._accelerateEngineConfig);}let r=Object.create(this._originalClient,{_extensions:{value:this._extensions.append(e)},_appliedParent:{value:this,configurable:true},$on:{value:void 0}});return wt(r)}function Fa({result:e,modelName:r,select:t,omit:n,extensions:i}){let o=i.getAllComputedFields(r);if(!o)return e;let s=[],a=[];for(let l of Object.values(o)){if(n){if(n[l.name])continue;let u=l.needs.filter(c=>n[c]);u.length>0&&a.push(Lr(u));}else if(t){if(!t[l.name])continue;let u=l.needs.filter(c=>!t[c]);u.length>0&&a.push(Lr(u));}Dm(e,l.needs)&&s.push(Om(l,he(e,s)));}return s.length>0||a.length>0?he(e,[...s,...a]):e}function Dm(e,r){return r.every(t=>Oi(e,t))}function Om(e,r){return ar(ee(e.name,()=>e.compute(r)))}function Mn({visitor:e,result:r,args:t,runtimeDataModel:n,modelName:i}){if(Array.isArray(r)){for(let s=0;s<r.length;s++)r[s]=Mn({result:r[s],args:t,modelName:i,runtimeDataModel:n,visitor:e});return r}let o=e(r,i,t)??r;return t.include&&Ma({includeOrSelect:t.include,result:o,parentModelName:i,runtimeDataModel:n,visitor:e}),t.select&&Ma({includeOrSelect:t.select,result:o,parentModelName:i,runtimeDataModel:n,visitor:e}),o}function Ma({includeOrSelect:e,result:r,parentModelName:t,runtimeDataModel:n,visitor:i}){for(let[o,s]of Object.entries(e)){if(!s||r[o]==null||Se(s))continue;let l=n.models[t].fields.find(c=>c.name===o);if(!l||l.kind!=="object"||!l.relationName)continue;let u=typeof s=="object"?s:{};r[o]=Mn({visitor:i,result:r[o],args:u,modelName:l.type,runtimeDataModel:n});}}function $a({result:e,modelName:r,args:t,extensions:n,runtimeDataModel:i,globalOmit:o}){return n.isEmpty()||e==null||typeof e!="object"||!i.models[r]?e:Mn({result:e,args:t??{},modelName:r,runtimeDataModel:i,visitor:(a,l,u)=>{let c=Te(l);return Fa({result:a,modelName:c,select:u.select,omit:u.select?void 0:{...o?.[c],...u.omit},extensions:n})}})}var km=["$connect","$disconnect","$on","$transaction","$extends"],qa=km;function Va(e){if(e instanceof se)return _m(e);if(_n(e))return Nm(e);if(Array.isArray(e)){let t=[e[0]];for(let n=1;n<e.length;n++)t[n]=xt(e[n]);return t}let r={};for(let t in e)r[t]=xt(e[t]);return r}function _m(e){return new se(e.strings,e.values)}function Nm(e){return new yt(e.sql,e.values)}function xt(e){if(typeof e!="object"||e==null||e instanceof Fe||kr(e))return e;if(Sr(e))return new Ye(e.toFixed());if(vr(e))return new Date(+e);if(ArrayBuffer.isView(e))return e.slice(0);if(Array.isArray(e)){let r=e.length,t;for(t=Array(r);r--;)t[r]=xt(e[r]);return t}if(typeof e=="object"){let r={};for(let t in e)t==="__proto__"?Object.defineProperty(r,t,{value:xt(e[t]),configurable:true,enumerable:true,writable:true}):r[t]=xt(e[t]);return r}sr(e,"Unknown value");}function Ba(e,r,t,n=0){return e._createPrismaPromise(i=>{let o=r.customDataProxyFetch;return "transaction"in r&&i!==void 0&&(r.transaction?.kind==="batch"&&r.transaction.lock.then(),r.transaction=i),n===t.length?e._executeRequest(r):t[n]({model:r.model,operation:r.model?r.action:r.clientMethod,args:Va(r.args??{}),__internalParams:r,query:(s,a=r)=>{let l=a.customDataProxyFetch;return a.customDataProxyFetch=Wa(o,l),a.args=s,Ba(e,a,t,n+1)}})})}function Ua(e,r){let{jsModelName:t,action:n,clientMethod:i}=r,o=t?n:i;if(e._extensions.isEmpty())return e._executeRequest(r);let s=e._extensions.getAllQueryCallbacks(t??"$none",o);return Ba(e,r,s)}function Ga(e){return r=>{let t={requests:r},n=r[0].extensions.getAllBatchQueryCallbacks();return n.length?Qa(t,n,0,e):e(t)}}function Qa(e,r,t,n){if(t===r.length)return n(e);let i=e.customDataProxyFetch,o=e.requests[0].transaction;return r[t]({args:{queries:e.requests.map(s=>({model:s.modelName,operation:s.action,args:s.args})),transaction:o?{isolationLevel:o.kind==="batch"?o.isolationLevel:void 0}:void 0},__internalParams:e,query(s,a=e){let l=a.customDataProxyFetch;return a.customDataProxyFetch=Wa(i,l),Qa(a,r,t+1,n)}})}var ja=e=>e;function Wa(e=ja,r=ja){return t=>e(r(t))}var Ja=L("prisma:client"),Ka={Vercel:"vercel","Netlify CI":"netlify"};function Ha({postinstall:e,ciName:r,clientVersion:t,generator:n}){if(Ja("checkPlatformCaching:postinstall",e),Ja("checkPlatformCaching:ciName",r),e===true&&!(n?.output&&typeof(n.output.fromEnvVar??n.output.value)=="string")&&r&&r in Ka){let i=`Prisma has detected that this project was built on ${r}, which caches dependencies. This leads to an outdated Prisma Client because Prisma's auto-generation isn't triggered. To fix this, make sure to run the \`prisma generate\` command during the build process.

Learn how: https://pris.ly/d/${Ka[r]}-build`;throw console.error(i),new P(i,t)}}function Ya(e,r){return e?e.datasources?e.datasources:e.datasourceUrl?{[r[0]]:{url:e.datasourceUrl}}:{}:{}}function $n(e){let{runtimeBinaryTarget:r}=e;return `Add "${r}" to \`binaryTargets\` in the "schema.prisma" file and run \`prisma generate\` after saving it:

${Lm(e)}`}function Lm(e){let{generator:r,generatorBinaryTargets:t,runtimeBinaryTarget:n}=e,i={fromEnvVar:null,value:n},o=[...t,i];return vi({...r,binaryTargets:o})}function Xe(e){let{runtimeBinaryTarget:r}=e;return `Prisma Client could not locate the Query Engine for runtime "${r}".`}function er(e){let{searchedLocations:r}=e;return `The following locations have been searched:
${[...new Set(r)].map(i=>`  ${i}`).join(`
`)}`}function za(e){let{runtimeBinaryTarget:r}=e;return `${Xe(e)}

This happened because \`binaryTargets\` have been pinned, but the actual deployment also required "${r}".
${$n(e)}

${er(e)}`}function qn(e){return `We would appreciate if you could take the time to share some information with us.
Please help us by answering a few questions: https://pris.ly/${e}`}function Vn(e){let{errorStack:r}=e;return r?.match(/\/\.next|\/next@|\/next\//)?`

We detected that you are using Next.js, learn how to fix this: https://pris.ly/d/engine-not-found-nextjs.`:""}function Za(e){let{queryEngineName:r}=e;return `${Xe(e)}${Vn(e)}

This is likely caused by a bundler that has not copied "${r}" next to the resulting bundle.
Ensure that "${r}" has been copied next to the bundle or in "${e.expectedLocation}".

${qn("engine-not-found-bundler-investigation")}

${er(e)}`}function Xa(e){let{runtimeBinaryTarget:r,generatorBinaryTargets:t}=e,n=t.find(i=>i.native);return `${Xe(e)}

This happened because Prisma Client was generated for "${n?.value??"unknown"}", but the actual deployment required "${r}".
${$n(e)}

${er(e)}`}function el(e){let{queryEngineName:r}=e;return `${Xe(e)}${Vn(e)}

This is likely caused by tooling that has not copied "${r}" to the deployment folder.
Ensure that you ran \`prisma generate\` and that "${r}" has been copied to "${e.expectedLocation}".

${qn("engine-not-found-tooling-investigation")}

${er(e)}`}var Mm=L("prisma:client:engines:resolveEnginePath"),$m=()=>new RegExp("runtime[\\\\/]library\\.m?js$");async function rl(e,r){let t={binary:process$2.env.PRISMA_QUERY_ENGINE_BINARY,library:process$2.env.PRISMA_QUERY_ENGINE_LIBRARY}[e]??r.prismaPath;if(t!==void 0)return t;let{enginePath:n,searchedLocations:i}=await qm(e,r);if(Mm("enginePath",n),n!==void 0)return r.prismaPath=n;let o=await nr(),s=r.generator?.binaryTargets??[],a=s.some(d=>d.native),l=!s.some(d=>d.value===o),u=__filename$1.match($m())===null,c={searchedLocations:i,generatorBinaryTargets:s,generator:r.generator,runtimeBinaryTarget:o,queryEngineName:tl(e,o),expectedLocation:M__default.relative(process$2.cwd(),r.dirname),errorStack:new Error().stack},p;throw a&&l?p=Xa(c):l?p=za(c):u?p=Za(c):p=el(c),new P(p,r.clientVersion)}async function qm(e,r){let t=await nr(),n=[],i=[r.dirname,M__default.resolve(__dirname,".."),r.generator?.output?.value??__dirname,M__default.resolve(__dirname,"../../../.prisma/client"),"/tmp/prisma-engines",r.cwd];__filename$1.includes("resolveEnginePath")&&i.push(ss());for(let o of i){let s=tl(e,t),a=M__default.join(o,s);if(n.push(o),Ci.existsSync(a))return {enginePath:a,searchedLocations:n}}return {enginePath:void 0,searchedLocations:n}}function tl(e,r){return Vt(r)}function nl(e){return e?e.replace(/".*"/g,'"X"').replace(/[\s:\[]([+-]?([0-9]*[.])?[0-9]+)/g,r=>`${r[0]}5`):""}function il(e){return e.split(`
`).map(r=>r.replace(/^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)\s*/,"").replace(/\+\d+\s*ms$/,"")).join(`
`)}var ol=le(Ss());function sl({title:e,user:r="prisma",repo:t="prisma",template:n="bug_report.yml",body:i}){return (0, ol.default)({user:r,repo:t,template:n,title:e,body:i})}function al({version:e,binaryTarget:r,title:t,description:n,engineVersion:i,database:o,query:s}){let a=Mo(6e3-(s?.length??0)),l=il(xr(a)),u=n?`# Description
\`\`\`
${n}
\`\`\``:"",c=xr(`Hi Prisma Team! My Prisma Client just crashed. This is the report:
## Versions

| Name            | Version            |
|-----------------|--------------------|
| Node            | ${process$2.version?.padEnd(19)}| 
| OS              | ${r?.padEnd(19)}|
| Prisma Client   | ${e?.padEnd(19)}|
| Query Engine    | ${i?.padEnd(19)}|
| Database        | ${o?.padEnd(19)}|

${u}

## Logs
\`\`\`
${l}
\`\`\`

## Client Snippet
\`\`\`ts
// PLEASE FILL YOUR CODE SNIPPET HERE
\`\`\`

## Schema
\`\`\`prisma
// PLEASE ADD YOUR SCHEMA HERE IF POSSIBLE
\`\`\`

## Prisma Engine Query
\`\`\`
${s?nl(s):""}
\`\`\`
`),p=sl({title:t,body:c});return `${t}

This is a non-recoverable error which probably happens when the Prisma Query Engine has a panic.

${H(p)}

If you want the Prisma team to look into it, please open the link above \u{1F64F}
To increase the chance of success, please post your schema and a snippet of
how you used Prisma Client in the issue. 
`}function ll(e,r){throw new Error(r)}function Vm(e){return e!==null&&typeof e=="object"&&typeof e.$type=="string"}function jm(e,r){let t={};for(let n of Object.keys(e))t[n]=r(e[n],n);return t}function vt(e){return e===null?e:Array.isArray(e)?e.map(vt):typeof e=="object"?Vm(e)?Bm(e):e.constructor!==null&&e.constructor.name!=="Object"?e:jm(e,vt):e}function Bm({$type:e,value:r}){switch(e){case "BigInt":return BigInt(r);case "Bytes":{let{buffer:t,byteOffset:n,byteLength:i}=Buffer.from(r,"base64");return new Uint8Array(t,n,i)}case "DateTime":return new Date(r);case "Decimal":return new Le(r);case "Json":return JSON.parse(r);default:ll(r,"Unknown tagged value");}}var ul="6.19.0";var Gm=()=>globalThis.process?.release?.name==="node",Qm=()=>!!globalThis.Bun||!!globalThis.process?.versions?.bun,Wm=()=>!!globalThis.Deno,Jm=()=>typeof globalThis.Netlify=="object",Km=()=>typeof globalThis.EdgeRuntime=="object",Hm=()=>globalThis.navigator?.userAgent==="Cloudflare-Workers";function Ym(){return [[Jm,"netlify"],[Km,"edge-light"],[Hm,"workerd"],[Wm,"deno"],[Qm,"bun"],[Gm,"node"]].flatMap(t=>t[0]()?[t[1]]:[]).at(0)??""}var zm={node:"Node.js",workerd:"Cloudflare Workers",deno:"Deno and Deno Deploy",netlify:"Netlify Edge Functions","edge-light":"Edge Runtime (Vercel Edge Functions, Vercel Edge Middleware, Next.js (Pages Router) Edge API Routes, Next.js (App Router) Edge Route Handlers or Next.js Middleware)"};function no(){let e=Ym();return {id:e,prettyName:zm[e]||e,isEdge:["workerd","deno","netlify","edge-light"].includes(e)}}function qr({inlineDatasources:e,overrideDatasources:r,env:t,clientVersion:n}){let i,o=Object.keys(e)[0],s=e[o]?.url,a=r[o]?.url;if(o===void 0?i=void 0:a?i=a:s?.value?i=s.value:s?.fromEnvVar&&(i=t[s.fromEnvVar]),s?.fromEnvVar!==void 0&&i===void 0)throw new P(`error: Environment variable not found: ${s.fromEnvVar}.`,n);if(i===void 0)throw new P("error: Missing URL environment variable, value, or override.",n);return i}var Bn=class extends Error{clientVersion;cause;constructor(r,t){super(r),this.clientVersion=t.clientVersion,this.cause=t.cause;}get[Symbol.toStringTag](){return this.name}};var ne=class extends Bn{isRetryable;constructor(r,t){super(r,t),this.isRetryable=t.isRetryable??true;}};function R(e,r){return {...e,isRetryable:r}}var lr=class extends ne{name="InvalidDatasourceError";code="P6001";constructor(r,t){super(r,R(t,false));}};x(lr,"InvalidDatasourceError");function cl(e){let r={clientVersion:e.clientVersion},t=Object.keys(e.inlineDatasources)[0],n=qr({inlineDatasources:e.inlineDatasources,overrideDatasources:e.overrideDatasources,clientVersion:e.clientVersion,env:{...e.env,...typeof process$2<"u"?process$2.env:{}}}),i;try{i=new URL(n);}catch{throw new lr(`Error validating datasource \`${t}\`: the URL must start with the protocol \`prisma://\``,r)}let{protocol:o,searchParams:s}=i;if(o!=="prisma:"&&o!==Xt)throw new lr(`Error validating datasource \`${t}\`: the URL must start with the protocol \`prisma://\` or \`prisma+postgres://\``,r);let a=s.get("api_key");if(a===null||a.length<1)throw new lr(`Error validating datasource \`${t}\`: the URL must contain a valid API key`,r);let l=Ei(i)?"http:":"https:";process$2.env.TEST_CLIENT_ENGINE_REMOTE_EXECUTOR&&i.searchParams.has("use_http")&&(l="http:");let u=new URL(i.href.replace(o,l));return {apiKey:a,url:u}}var pl=le(Zt()),Un=class{apiKey;tracingHelper;logLevel;logQueries;engineHash;constructor({apiKey:r,tracingHelper:t,logLevel:n,logQueries:i,engineHash:o}){this.apiKey=r,this.tracingHelper=t,this.logLevel=n,this.logQueries=i,this.engineHash=o;}build({traceparent:r,transactionId:t}={}){let n={Accept:"application/json",Authorization:`Bearer ${this.apiKey}`,"Content-Type":"application/json","Prisma-Engine-Hash":this.engineHash,"Prisma-Engine-Version":pl.enginesVersion};this.tracingHelper.isEnabled()&&(n.traceparent=r??this.tracingHelper.getTraceParent()),t&&(n["X-Transaction-Id"]=t);let i=this.#e();return i.length>0&&(n["X-Capture-Telemetry"]=i.join(", ")),n}#e(){let r=[];return this.tracingHelper.isEnabled()&&r.push("tracing"),this.logLevel&&r.push(this.logLevel),this.logQueries&&r.push("query"),r}};function Zm(e){return e[0]*1e3+e[1]/1e6}function io(e){return new Date(Zm(e))}var Vr=class extends ne{name="ForcedRetryError";code="P5001";constructor(r){super("This request must be retried",R(r,true));}};x(Vr,"ForcedRetryError");var ur=class extends ne{name="NotImplementedYetError";code="P5004";constructor(r,t){super(r,R(t,false));}};x(ur,"NotImplementedYetError");var F=class extends ne{response;constructor(r,t){super(r,t),this.response=t.response;let n=this.response.headers.get("prisma-request-id");if(n){let i=`(The request id was: ${n})`;this.message=this.message+" "+i;}}};var cr=class extends F{name="SchemaMissingError";code="P5005";constructor(r){super("Schema needs to be uploaded",R(r,true));}};x(cr,"SchemaMissingError");var oo="This request could not be understood by the server",Pt=class extends F{name="BadRequestError";code="P5000";constructor(r,t,n){super(t||oo,R(r,false)),n&&(this.code=n);}};x(Pt,"BadRequestError");var Tt=class extends F{name="HealthcheckTimeoutError";code="P5013";logs;constructor(r,t){super("Engine not started: healthcheck timeout",R(r,true)),this.logs=t;}};x(Tt,"HealthcheckTimeoutError");var St=class extends F{name="EngineStartupError";code="P5014";logs;constructor(r,t,n){super(t,R(r,true)),this.logs=n;}};x(St,"EngineStartupError");var Rt=class extends F{name="EngineVersionNotSupportedError";code="P5012";constructor(r){super("Engine version is not supported",R(r,false));}};x(Rt,"EngineVersionNotSupportedError");var so="Request timed out",At=class extends F{name="GatewayTimeoutError";code="P5009";constructor(r,t=so){super(t,R(r,false));}};x(At,"GatewayTimeoutError");var Xm="Interactive transaction error",Ct=class extends F{name="InteractiveTransactionError";code="P5015";constructor(r,t=Xm){super(t,R(r,false));}};x(Ct,"InteractiveTransactionError");var ef="Request parameters are invalid",It=class extends F{name="InvalidRequestError";code="P5011";constructor(r,t=ef){super(t,R(r,false));}};x(It,"InvalidRequestError");var ao="Requested resource does not exist",Dt=class extends F{name="NotFoundError";code="P5003";constructor(r,t=ao){super(t,R(r,false));}};x(Dt,"NotFoundError");var lo="Unknown server error",jr=class extends F{name="ServerError";code="P5006";logs;constructor(r,t,n){super(t||lo,R(r,true)),this.logs=n;}};x(jr,"ServerError");var uo="Unauthorized, check your connection string",Ot=class extends F{name="UnauthorizedError";code="P5007";constructor(r,t=uo){super(t,R(r,false));}};x(Ot,"UnauthorizedError");var co="Usage exceeded, retry again later",kt=class extends F{name="UsageExceededError";code="P5008";constructor(r,t=co){super(t,R(r,true));}};x(kt,"UsageExceededError");async function rf(e){let r;try{r=await e.text();}catch{return {type:"EmptyError"}}try{let t=JSON.parse(r);if(typeof t=="string")switch(t){case "InternalDataProxyError":return {type:"DataProxyError",body:t};default:return {type:"UnknownTextError",body:t}}if(typeof t=="object"&&t!==null){if("is_panic"in t&&"message"in t&&"error_code"in t)return {type:"QueryEngineError",body:t};if("EngineNotStarted"in t||"InteractiveTransactionMisrouted"in t||"InvalidRequestError"in t){let n=Object.values(t)[0].reason;return typeof n=="string"&&!["SchemaMissing","EngineVersionNotSupported"].includes(n)?{type:"UnknownJsonError",body:t}:{type:"DataProxyError",body:t}}}return {type:"UnknownJsonError",body:t}}catch{return r===""?{type:"EmptyError"}:{type:"UnknownTextError",body:r}}}async function _t(e,r){if(e.ok)return;let t={clientVersion:r,response:e},n=await rf(e);if(n.type==="QueryEngineError")throw new Z(n.body.message,{code:n.body.error_code,clientVersion:r});if(n.type==="DataProxyError"){if(n.body==="InternalDataProxyError")throw new jr(t,"Internal Data Proxy error");if("EngineNotStarted"in n.body){if(n.body.EngineNotStarted.reason==="SchemaMissing")return new cr(t);if(n.body.EngineNotStarted.reason==="EngineVersionNotSupported")throw new Rt(t);if("EngineStartupError"in n.body.EngineNotStarted.reason){let{msg:i,logs:o}=n.body.EngineNotStarted.reason.EngineStartupError;throw new St(t,i,o)}if("KnownEngineStartupError"in n.body.EngineNotStarted.reason){let{msg:i,error_code:o}=n.body.EngineNotStarted.reason.KnownEngineStartupError;throw new P(i,r,o)}if("HealthcheckTimeout"in n.body.EngineNotStarted.reason){let{logs:i}=n.body.EngineNotStarted.reason.HealthcheckTimeout;throw new Tt(t,i)}}if("InteractiveTransactionMisrouted"in n.body){let i={IDParseError:"Could not parse interactive transaction ID",NoQueryEngineFoundError:"Could not find Query Engine for the specified host and transaction ID",TransactionStartError:"Could not start interactive transaction"};throw new Ct(t,i[n.body.InteractiveTransactionMisrouted.reason])}if("InvalidRequestError"in n.body)throw new It(t,n.body.InvalidRequestError.reason)}if(e.status===401||e.status===403)throw new Ot(t,Br(uo,n));if(e.status===404)return new Dt(t,Br(ao,n));if(e.status===429)throw new kt(t,Br(co,n));if(e.status===504)throw new At(t,Br(so,n));if(e.status>=500)throw new jr(t,Br(lo,n));if(e.status>=400)throw new Pt(t,Br(oo,n))}function Br(e,r){return r.type==="EmptyError"?e:`${e}: ${JSON.stringify(r)}`}function dl(e){let r=Math.pow(2,e)*50,t=Math.ceil(Math.random()*r)-Math.ceil(r/2),n=r+t;return new Promise(i=>setTimeout(()=>i(n),n))}var Me="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";function ml(e){let r=new TextEncoder().encode(e),t="",n=r.byteLength,i=n%3,o=n-i,s,a,l,u,c;for(let p=0;p<o;p=p+3)c=r[p]<<16|r[p+1]<<8|r[p+2],s=(c&16515072)>>18,a=(c&258048)>>12,l=(c&4032)>>6,u=c&63,t+=Me[s]+Me[a]+Me[l]+Me[u];return i==1?(c=r[o],s=(c&252)>>2,a=(c&3)<<4,t+=Me[s]+Me[a]+"=="):i==2&&(c=r[o]<<8|r[o+1],s=(c&64512)>>10,a=(c&1008)>>4,l=(c&15)<<2,t+=Me[s]+Me[a]+Me[l]+"="),t}function fl(e){if(!!e.generator?.previewFeatures.some(t=>t.toLowerCase().includes("metrics")))throw new P("The `metrics` preview feature is not yet available with Accelerate.\nPlease remove `metrics` from the `previewFeatures` in your schema.\n\nMore information about Accelerate: https://pris.ly/d/accelerate",e.clientVersion)}var gl={"@prisma/engines-version":"6.19.0-26.2ba551f319ab1df4bc874a89965d8b3641056773"};var Nt=class extends ne{name="RequestError";code="P5010";constructor(r,t){super(`Cannot fetch data from service:
${r}`,R(t,true));}};x(Nt,"RequestError");async function pr(e,r,t=n=>n){let{clientVersion:n,...i}=r,o=t(fetch);try{return await o(e,i)}catch(s){let a=s.message??"Unknown error";throw new Nt(a,{clientVersion:n,cause:s})}}var nf=/^[1-9][0-9]*\.[0-9]+\.[0-9]+$/,hl=L("prisma:client:dataproxyEngine");async function of(e,r){let t=gl["@prisma/engines-version"],n=r.clientVersion??"unknown";if(process$2.env.PRISMA_CLIENT_DATA_PROXY_CLIENT_VERSION||globalThis.PRISMA_CLIENT_DATA_PROXY_CLIENT_VERSION)return process$2.env.PRISMA_CLIENT_DATA_PROXY_CLIENT_VERSION||globalThis.PRISMA_CLIENT_DATA_PROXY_CLIENT_VERSION;if(e.includes("accelerate")&&n!=="0.0.0"&&n!=="in-memory")return n;let[i,o]=n?.split("-")??[];if(o===void 0&&nf.test(i))return i;if(o!==void 0||n==="0.0.0"||n==="in-memory"){let[s]=t.split("-")??[],[a,l,u]=s.split("."),c=sf(`<=${a}.${l}.${u}`),p=await pr(c,{clientVersion:n});if(!p.ok)throw new Error(`Failed to fetch stable Prisma version, unpkg.com status ${p.status} ${p.statusText}, response body: ${await p.text()||"<empty body>"}`);let d=await p.text();hl("length of body fetched from unpkg.com",d.length);let f;try{f=JSON.parse(d);}catch(h){throw console.error("JSON.parse error: body fetched from unpkg.com: ",d),h}return f.version}throw new ur("Only `major.minor.patch` versions are supported by Accelerate.",{clientVersion:n})}async function yl(e,r){let t=await of(e,r);return hl("version",t),t}function sf(e){return encodeURI(`https://unpkg.com/prisma@${e}/package.json`)}var bl=3,Lt=L("prisma:client:dataproxyEngine"),Ft=class{name="DataProxyEngine";inlineSchema;inlineSchemaHash;inlineDatasources;config;logEmitter;env;clientVersion;engineHash;tracingHelper;remoteClientVersion;host;headerBuilder;startPromise;protocol;constructor(r){fl(r),this.config=r,this.env=r.env,this.inlineSchema=ml(r.inlineSchema),this.inlineDatasources=r.inlineDatasources,this.inlineSchemaHash=r.inlineSchemaHash,this.clientVersion=r.clientVersion,this.engineHash=r.engineVersion,this.logEmitter=r.logEmitter,this.tracingHelper=r.tracingHelper;}apiKey(){return this.headerBuilder.apiKey}version(){return this.engineHash}async start(){this.startPromise!==void 0&&await this.startPromise,this.startPromise=(async()=>{let{apiKey:r,url:t}=this.getURLAndAPIKey();this.host=t.host,this.protocol=t.protocol,this.headerBuilder=new Un({apiKey:r,tracingHelper:this.tracingHelper,logLevel:this.config.logLevel??"error",logQueries:this.config.logQueries,engineHash:this.engineHash}),this.remoteClientVersion=await yl(this.host,this.config),Lt("host",this.host),Lt("protocol",this.protocol);})(),await this.startPromise;}async stop(){}propagateResponseExtensions(r){r?.logs?.length&&r.logs.forEach(t=>{switch(t.level){case "debug":case "trace":Lt(t);break;case "error":case "warn":case "info":{this.logEmitter.emit(t.level,{timestamp:io(t.timestamp),message:t.attributes.message??"",target:t.target??"BinaryEngine"});break}case "query":{this.logEmitter.emit("query",{query:t.attributes.query??"",timestamp:io(t.timestamp),duration:t.attributes.duration_ms??0,params:t.attributes.params??"",target:t.target??"BinaryEngine"});break}default:t.level;}}),r?.traces?.length&&this.tracingHelper.dispatchEngineSpans(r.traces);}onBeforeExit(){throw new Error('"beforeExit" hook is not applicable to the remote query engine')}async url(r){return await this.start(),`${this.protocol}//${this.host}/${this.remoteClientVersion}/${this.inlineSchemaHash}/${r}`}async uploadSchema(){let r={name:"schemaUpload",internal:true};return this.tracingHelper.runInChildSpan(r,async()=>{let t=await pr(await this.url("schema"),{method:"PUT",headers:this.headerBuilder.build(),body:this.inlineSchema,clientVersion:this.clientVersion});t.ok||Lt("schema response status",t.status);let n=await _t(t,this.clientVersion);if(n)throw this.logEmitter.emit("warn",{message:`Error while uploading schema: ${n.message}`,timestamp:new Date,target:""}),n;this.logEmitter.emit("info",{message:`Schema (re)uploaded (hash: ${this.inlineSchemaHash})`,timestamp:new Date,target:""});})}request(r,{traceparent:t,interactiveTransaction:n,customDataProxyFetch:i}){return this.requestInternal({body:r,traceparent:t,interactiveTransaction:n,customDataProxyFetch:i})}async requestBatch(r,{traceparent:t,transaction:n,customDataProxyFetch:i}){let o=n?.kind==="itx"?n.options:void 0,s=Fr(r,n);return (await this.requestInternal({body:s,customDataProxyFetch:i,interactiveTransaction:o,traceparent:t})).map(l=>(l.extensions&&this.propagateResponseExtensions(l.extensions),"errors"in l?this.convertProtocolErrorsToClientError(l.errors):l))}requestInternal({body:r,traceparent:t,customDataProxyFetch:n,interactiveTransaction:i}){return this.withRetry({actionGerund:"querying",callback:async({logHttpCall:o})=>{let s=i?`${i.payload.endpoint}/graphql`:await this.url("graphql");o(s);let a=await pr(s,{method:"POST",headers:this.headerBuilder.build({traceparent:t,transactionId:i?.id}),body:JSON.stringify(r),clientVersion:this.clientVersion},n);a.ok||Lt("graphql response status",a.status),await this.handleError(await _t(a,this.clientVersion));let l=await a.json();if(l.extensions&&this.propagateResponseExtensions(l.extensions),"errors"in l)throw this.convertProtocolErrorsToClientError(l.errors);return "batchResult"in l?l.batchResult:l}})}async transaction(r,t,n){let i={start:"starting",commit:"committing",rollback:"rolling back"};return this.withRetry({actionGerund:`${i[r]} transaction`,callback:async({logHttpCall:o})=>{if(r==="start"){let s=JSON.stringify({max_wait:n.maxWait,timeout:n.timeout,isolation_level:n.isolationLevel}),a=await this.url("transaction/start");o(a);let l=await pr(a,{method:"POST",headers:this.headerBuilder.build({traceparent:t.traceparent}),body:s,clientVersion:this.clientVersion});await this.handleError(await _t(l,this.clientVersion));let u=await l.json(),{extensions:c}=u;c&&this.propagateResponseExtensions(c);let p=u.id,d=u["data-proxy"].endpoint;return {id:p,payload:{endpoint:d}}}else {let s=`${n.payload.endpoint}/${r}`;o(s);let a=await pr(s,{method:"POST",headers:this.headerBuilder.build({traceparent:t.traceparent}),clientVersion:this.clientVersion});await this.handleError(await _t(a,this.clientVersion));let l=await a.json(),{extensions:u}=l;u&&this.propagateResponseExtensions(u);return}}})}getURLAndAPIKey(){return cl({clientVersion:this.clientVersion,env:this.env,inlineDatasources:this.inlineDatasources,overrideDatasources:this.config.overrideDatasources})}metrics(){throw new ur("Metrics are not yet supported for Accelerate",{clientVersion:this.clientVersion})}async withRetry(r){for(let t=0;;t++){let n=i=>{this.logEmitter.emit("info",{message:`Calling ${i} (n=${t})`,timestamp:new Date,target:""});};try{return await r.callback({logHttpCall:n})}catch(i){if(!(i instanceof ne)||!i.isRetryable)throw i;if(t>=bl)throw i instanceof Vr?i.cause:i;this.logEmitter.emit("warn",{message:`Attempt ${t+1}/${bl} failed for ${r.actionGerund}: ${i.message??"(unknown)"}`,timestamp:new Date,target:""});let o=await dl(t);this.logEmitter.emit("warn",{message:`Retrying after ${o}ms`,timestamp:new Date,target:""});}}}async handleError(r){if(r instanceof cr)throw await this.uploadSchema(),new Vr({clientVersion:this.clientVersion,cause:r});if(r)throw r}convertProtocolErrorsToClientError(r){return r.length===1?Mr(r[0],this.config.clientVersion,this.config.activeProvider):new q(JSON.stringify(r),{clientVersion:this.config.clientVersion})}applyPendingMigrations(){throw new Error("Method not implemented.")}};function El(e){if(e?.kind==="itx")return e.options.id}var po=Symbol("PrismaLibraryEngineCache");function lf(){let e=globalThis;return e[po]===void 0&&(e[po]={}),e[po]}function uf(e){let r=lf();if(r[e]!==void 0)return r[e];let t=M__default.toNamespacedPath(e),n={exports:{}},i=0;return process$2.platform!=="win32"&&(i=ni.constants.dlopen.RTLD_LAZY|ni.constants.dlopen.RTLD_DEEPBIND),process$2.dlopen(n,t,i),r[e]=n.exports,n.exports}var xl={async loadLibrary(e){let r=await ii(),t=await rl("library",e);try{return e.tracingHelper.runInChildSpan({name:"loadLibrary",internal:!0},()=>uf(t))}catch(n){let i=yi({e:n,platformInfo:r,id:t});throw new P(i,e.clientVersion)}}};var mo,vl={async loadLibrary(e){let{clientVersion:r,adapter:t,engineWasm:n}=e;if(t===void 0)throw new P(`The \`adapter\` option for \`PrismaClient\` is required in this context (${no().prettyName})`,r);if(n===void 0)throw new P("WASM engine was unexpectedly `undefined`",r);mo===void 0&&(mo=(async()=>{let o=await n.getRuntime(),s=await n.getQueryEngineWasmModule();if(s==null)throw new P("The loaded wasm module was unexpectedly `undefined` or `null` once loaded",r);let a={"./query_engine_bg.js":o},l=new WebAssembly.Instance(s,a),u=l.exports.__wbindgen_start;return o.__wbg_set_wasm(l.exports),u(),o.QueryEngine})());let i=await mo;return {debugPanic(){return Promise.reject("{}")},dmmf(){return Promise.resolve("{}")},version(){return {commit:"unknown",version:"unknown"}},QueryEngine:i}}};var cf="P2036",Re=L("prisma:client:libraryEngine");function pf(e){return e.item_type==="query"&&"query"in e}function df(e){return "level"in e?e.level==="error"&&e.message==="PANIC":false}var Pl=[...Zn,"native"],mf=0xffffffffffffffffn,fo=1n;function ff(){let e=fo++;return fo>mf&&(fo=1n),e}var Ur=class{name="LibraryEngine";engine;libraryInstantiationPromise;libraryStartingPromise;libraryStoppingPromise;libraryStarted;executingQueryPromise;config;QueryEngineConstructor;libraryLoader;library;logEmitter;libQueryEnginePath;binaryTarget;datasourceOverrides;datamodel;logQueries;logLevel;lastQuery;loggerRustPanic;tracingHelper;adapterPromise;versionInfo;constructor(r,t){this.libraryLoader=t??xl,r.engineWasm!==void 0&&(this.libraryLoader=t??vl),this.config=r,this.libraryStarted=false,this.logQueries=r.logQueries??false,this.logLevel=r.logLevel??"error",this.logEmitter=r.logEmitter,this.datamodel=r.inlineSchema,this.tracingHelper=r.tracingHelper,r.enableDebugLogs&&(this.logLevel="debug");let n=Object.keys(r.overrideDatasources)[0],i=r.overrideDatasources[n]?.url;n!==void 0&&i!==void 0&&(this.datasourceOverrides={[n]:i}),this.libraryInstantiationPromise=this.instantiateLibrary();}wrapEngine(r){return {applyPendingMigrations:r.applyPendingMigrations?.bind(r),commitTransaction:this.withRequestId(r.commitTransaction.bind(r)),connect:this.withRequestId(r.connect.bind(r)),disconnect:this.withRequestId(r.disconnect.bind(r)),metrics:r.metrics?.bind(r),query:this.withRequestId(r.query.bind(r)),rollbackTransaction:this.withRequestId(r.rollbackTransaction.bind(r)),sdlSchema:r.sdlSchema?.bind(r),startTransaction:this.withRequestId(r.startTransaction.bind(r)),trace:r.trace.bind(r),free:r.free?.bind(r)}}withRequestId(r){return async(...t)=>{let n=ff().toString();try{return await r(...t,n)}finally{if(this.tracingHelper.isEnabled()){let i=await this.engine?.trace(n);if(i){let o=JSON.parse(i);this.tracingHelper.dispatchEngineSpans(o.spans);}}}}}async applyPendingMigrations(){throw new Error("Cannot call this method from this type of engine instance")}async transaction(r,t,n){await this.start();let i=await this.adapterPromise,o=JSON.stringify(t),s;if(r==="start"){let l=JSON.stringify({max_wait:n.maxWait,timeout:n.timeout,isolation_level:n.isolationLevel});s=await this.engine?.startTransaction(l,o);}else r==="commit"?s=await this.engine?.commitTransaction(n.id,o):r==="rollback"&&(s=await this.engine?.rollbackTransaction(n.id,o));let a=this.parseEngineResponse(s);if(gf(a)){let l=this.getExternalAdapterError(a,i?.errorRegistry);throw l?l.error:new Z(a.message,{code:a.error_code,clientVersion:this.config.clientVersion,meta:a.meta})}else if(typeof a.message=="string")throw new q(a.message,{clientVersion:this.config.clientVersion});return a}async instantiateLibrary(){if(Re("internalSetup"),this.libraryInstantiationPromise)return this.libraryInstantiationPromise;zn(),this.binaryTarget=await this.getCurrentBinaryTarget(),await this.tracingHelper.runInChildSpan("load_engine",()=>this.loadEngine()),this.version();}async getCurrentBinaryTarget(){{if(this.binaryTarget)return this.binaryTarget;let r=await this.tracingHelper.runInChildSpan("detect_platform",()=>nr());if(!Pl.includes(r))throw new P(`Unknown ${ue("PRISMA_QUERY_ENGINE_LIBRARY")} ${ue(Q(r))}. Possible binaryTargets: ${$e(Pl.join(", "))} or a path to the query engine library.
You may have to run ${$e("prisma generate")} for your changes to take effect.`,this.config.clientVersion);return r}}parseEngineResponse(r){if(!r)throw new q("Response from the Engine was empty",{clientVersion:this.config.clientVersion});try{return JSON.parse(r)}catch{throw new q("Unable to JSON.parse response from engine",{clientVersion:this.config.clientVersion})}}async loadEngine(){if(!this.engine){this.QueryEngineConstructor||(this.library=await this.libraryLoader.loadLibrary(this.config),this.QueryEngineConstructor=this.library.QueryEngine);try{let r=new WeakRef(this);this.adapterPromise||(this.adapterPromise=this.config.adapter?.connect()?.then(Yt));let t=await this.adapterPromise;t&&Re("Using driver adapter: %O",t),this.engine=this.wrapEngine(new this.QueryEngineConstructor({datamodel:this.datamodel,env:process$2.env,logQueries:this.config.logQueries??!1,ignoreEnvVarErrors:!0,datasourceOverrides:this.datasourceOverrides??{},logLevel:this.logLevel,configDir:this.config.cwd,engineProtocol:"json",enableTracing:this.tracingHelper.isEnabled()},n=>{r.deref()?.logger(n);},t));}catch(r){let t=r,n=this.parseInitError(t.message);throw typeof n=="string"?t:new P(n.message,this.config.clientVersion,n.error_code)}}}logger(r){let t=this.parseEngineResponse(r);t&&(t.level=t?.level.toLowerCase()??"unknown",pf(t)?this.logEmitter.emit("query",{timestamp:new Date,query:t.query,params:t.params,duration:Number(t.duration_ms),target:t.module_path}):df(t)?this.loggerRustPanic=new de(go(this,`${t.message}: ${t.reason} in ${t.file}:${t.line}:${t.column}`),this.config.clientVersion):this.logEmitter.emit(t.level,{timestamp:new Date,message:t.message,target:t.module_path}));}parseInitError(r){try{return JSON.parse(r)}catch{}return r}parseRequestError(r){try{return JSON.parse(r)}catch{}return r}onBeforeExit(){throw new Error('"beforeExit" hook is not applicable to the library engine since Prisma 5.0.0, it is only relevant and implemented for the binary engine. Please add your event listener to the `process` object directly instead.')}async start(){if(this.libraryInstantiationPromise||(this.libraryInstantiationPromise=this.instantiateLibrary()),await this.libraryInstantiationPromise,await this.libraryStoppingPromise,this.libraryStartingPromise)return Re(`library already starting, this.libraryStarted: ${this.libraryStarted}`),this.libraryStartingPromise;if(this.libraryStarted)return;let r=async()=>{Re("library starting");try{let t={traceparent:this.tracingHelper.getTraceParent()};await this.engine?.connect(JSON.stringify(t)),this.libraryStarted=!0,this.adapterPromise||(this.adapterPromise=this.config.adapter?.connect()?.then(Yt)),await this.adapterPromise,Re("library started");}catch(t){let n=this.parseInitError(t.message);throw typeof n=="string"?t:new P(n.message,this.config.clientVersion,n.error_code)}finally{this.libraryStartingPromise=void 0;}};return this.libraryStartingPromise=this.tracingHelper.runInChildSpan("connect",r),this.libraryStartingPromise}async stop(){if(await this.libraryInstantiationPromise,await this.libraryStartingPromise,await this.executingQueryPromise,this.libraryStoppingPromise)return Re("library is already stopping"),this.libraryStoppingPromise;if(!this.libraryStarted){await(await this.adapterPromise)?.dispose(),this.adapterPromise=void 0;return}let r=async()=>{await new Promise(n=>setImmediate(n)),Re("library stopping");let t={traceparent:this.tracingHelper.getTraceParent()};await this.engine?.disconnect(JSON.stringify(t)),this.engine?.free&&this.engine.free(),this.engine=void 0,this.libraryStarted=false,this.libraryStoppingPromise=void 0,this.libraryInstantiationPromise=void 0,await(await this.adapterPromise)?.dispose(),this.adapterPromise=void 0,Re("library stopped");};return this.libraryStoppingPromise=this.tracingHelper.runInChildSpan("disconnect",r),this.libraryStoppingPromise}version(){return this.versionInfo=this.library?.version(),this.versionInfo?.version??"unknown"}debugPanic(r){return this.library?.debugPanic(r)}async request(r,{traceparent:t,interactiveTransaction:n}){Re(`sending request, this.libraryStarted: ${this.libraryStarted}`);let i=JSON.stringify({traceparent:t}),o=JSON.stringify(r);try{await this.start();let s=await this.adapterPromise;this.executingQueryPromise=this.engine?.query(o,i,n?.id),this.lastQuery=o;let a=this.parseEngineResponse(await this.executingQueryPromise);if(a.errors)throw a.errors.length===1?this.buildQueryError(a.errors[0],s?.errorRegistry):new q(JSON.stringify(a.errors),{clientVersion:this.config.clientVersion});if(this.loggerRustPanic)throw this.loggerRustPanic;return {data:a}}catch(s){if(s instanceof P)throw s;if(s.code==="GenericFailure"&&s.message?.startsWith("PANIC:"))throw new de(go(this,s.message),this.config.clientVersion);let a=this.parseRequestError(s.message);throw typeof a=="string"?s:new q(`${a.message}
${a.backtrace}`,{clientVersion:this.config.clientVersion})}}async requestBatch(r,{transaction:t,traceparent:n}){Re("requestBatch");let i=Fr(r,t);await this.start();let o=await this.adapterPromise;this.lastQuery=JSON.stringify(i),this.executingQueryPromise=this.engine?.query(this.lastQuery,JSON.stringify({traceparent:n}),El(t));let s=await this.executingQueryPromise,a=this.parseEngineResponse(s);if(a.errors)throw a.errors.length===1?this.buildQueryError(a.errors[0],o?.errorRegistry):new q(JSON.stringify(a.errors),{clientVersion:this.config.clientVersion});let{batchResult:l,errors:u}=a;if(Array.isArray(l))return l.map(c=>c.errors&&c.errors.length>0?this.loggerRustPanic??this.buildQueryError(c.errors[0],o?.errorRegistry):{data:c});throw u&&u.length===1?new Error(u[0].error):new Error(JSON.stringify(a))}buildQueryError(r,t){if(r.user_facing_error.is_panic)return new de(go(this,r.user_facing_error.message),this.config.clientVersion);let n=this.getExternalAdapterError(r.user_facing_error,t);return n?n.error:Mr(r,this.config.clientVersion,this.config.activeProvider)}getExternalAdapterError(r,t){if(r.error_code===cf&&t){let n=r.meta?.id;rn(typeof n=="number","Malformed external JS error received from the engine");let i=t.consumeError(n);return rn(i,"External error with reported id was not registered"),i}}async metrics(r){await this.start();let t=await this.engine.metrics(JSON.stringify(r));return r.format==="prometheus"?t:this.parseEngineResponse(t)}};function gf(e){return typeof e=="object"&&e!==null&&e.error_code!==void 0}function go(e,r){return al({binaryTarget:e.binaryTarget,title:r,version:e.config.clientVersion,engineVersion:e.versionInfo?.commit,database:e.config.activeProvider,query:e.lastQuery})}function Tl({url:e,adapter:r,copyEngine:t,targetBuildType:n}){let i=[],o=[],s=g=>{i.push({_tag:"warning",value:g});},a=g=>{let I=g.join(`
`);o.push({_tag:"error",value:I});},l=!!e?.startsWith("prisma://"),u=en(e),c=!!r,p=l||u;!c&&t&&p&&n!=="client"&&n!=="wasm-compiler-edge"&&s(["recommend--no-engine","In production, we recommend using `prisma generate --no-engine` (See: `prisma generate --help`)"]);let d=p||!t;c&&(d||n==="edge")&&(p?a(["You've provided both a driver adapter and an Accelerate database URL. Driver adapters currently cannot connect to Accelerate.","Please provide either a driver adapter with a direct database URL or an Accelerate URL and no driver adapter."]):t||a(["Prisma Client was configured to use the `adapter` option but `prisma generate` was run with `--no-engine`.","Please run `prisma generate` without `--no-engine` to be able to use Prisma Client with the adapter."]));let f={accelerate:d,ppg:u,driverAdapters:c};function h(g){return g.length>0}return h(o)?{ok:false,diagnostics:{warnings:i,errors:o},isUsing:f}:{ok:true,diagnostics:{warnings:i},isUsing:f}}function Sl({copyEngine:e=true},r){let t;try{t=qr({inlineDatasources:r.inlineDatasources,overrideDatasources:r.overrideDatasources,env:{...r.env,...process$2.env},clientVersion:r.clientVersion});}catch{}let{ok:n,isUsing:i,diagnostics:o}=Tl({url:t,adapter:r.adapter,copyEngine:e,targetBuildType:"library"});for(let p of o.warnings)sn(...p.value);if(!n){let p=o.errors[0];throw new X(p.value,{clientVersion:r.clientVersion})}let s=wr(r.generator),a=s==="library";return i.accelerate?new Ft(r):(a?new Ur(r):(new Ur(r)))}function Rl({generator:e}){return e?.previewFeatures??[]}var Al=e=>({command:e});var Cl=e=>e.strings.reduce((r,t,n)=>`${r}@P${n}${t}`);function Gr(e){try{return Il(e,"fast")}catch{return Il(e,"slow")}}function Il(e,r){return JSON.stringify(e.map(t=>Ol(t,r)))}function Ol(e,r){if(Array.isArray(e))return e.map(t=>Ol(t,r));if(typeof e=="bigint")return {prisma__type:"bigint",prisma__value:e.toString()};if(vr(e))return {prisma__type:"date",prisma__value:e.toJSON()};if(Ye.isDecimal(e))return {prisma__type:"decimal",prisma__value:e.toJSON()};if(Buffer.isBuffer(e))return {prisma__type:"bytes",prisma__value:e.toString("base64")};if(hf(e))return {prisma__type:"bytes",prisma__value:Buffer.from(e).toString("base64")};if(ArrayBuffer.isView(e)){let{buffer:t,byteOffset:n,byteLength:i}=e;return {prisma__type:"bytes",prisma__value:Buffer.from(t,n,i).toString("base64")}}return typeof e=="object"&&r==="slow"?kl(e):e}function hf(e){return e instanceof ArrayBuffer||e instanceof SharedArrayBuffer?true:typeof e=="object"&&e!==null?e[Symbol.toStringTag]==="ArrayBuffer"||e[Symbol.toStringTag]==="SharedArrayBuffer":false}function kl(e){if(typeof e!="object"||e===null)return e;if(typeof e.toJSON=="function")return e.toJSON();if(Array.isArray(e))return e.map(Dl);let r={};for(let t of Object.keys(e))r[t]=Dl(e[t]);return r}function Dl(e){return typeof e=="bigint"?e.toString():kl(e)}var yf=/^(\s*alter\s)/i,_l=L("prisma:client");function ho(e,r,t,n){if(!(e!=="postgresql"&&e!=="cockroachdb")&&t.length>0&&yf.exec(r))throw new Error(`Running ALTER using ${n} is not supported
Using the example below you can still execute your query with Prisma, but please note that it is vulnerable to SQL injection attacks and requires you to take care of input sanitization.

Example:
  await prisma.$executeRawUnsafe(\`ALTER USER prisma WITH PASSWORD '\${password}'\`)

More Information: https://pris.ly/d/execute-raw
`)}var yo=({clientMethod:e,activeProvider:r})=>t=>{let n="",i;if(_n(t))n=t.sql,i={values:Gr(t.values),__prismaRawParameters__:true};else if(Array.isArray(t)){let[o,...s]=t;n=o,i={values:Gr(s||[]),__prismaRawParameters__:true};}else switch(r){case "sqlite":case "mysql":{n=t.sql,i={values:Gr(t.values),__prismaRawParameters__:true};break}case "cockroachdb":case "postgresql":case "postgres":{n=t.text,i={values:Gr(t.values),__prismaRawParameters__:true};break}case "sqlserver":{n=Cl(t),i={values:Gr(t.values),__prismaRawParameters__:true};break}default:throw new Error(`The ${r} provider does not support ${e}`)}return i?.values?_l(`prisma.${e}(${n}, ${i.values})`):_l(`prisma.${e}(${n})`),{query:n,parameters:i}},Nl={requestArgsToMiddlewareArgs(e){return [e.strings,...e.values]},middlewareArgsToRequestArgs(e){let[r,...t]=e;return new se(r,t)}},Ll={requestArgsToMiddlewareArgs(e){return [e]},middlewareArgsToRequestArgs(e){return e[0]}};function bo(e){return function(t,n){let i,o=(s=e)=>{try{return s===void 0||s?.kind==="itx"?i??=Fl(t(s)):Fl(t(s))}catch(a){return Promise.reject(a)}};return {get spec(){return n},then(s,a){return o().then(s,a)},catch(s){return o().catch(s)},finally(s){return o().finally(s)},requestTransaction(s){let a=o(s);return a.requestTransaction?a.requestTransaction(s):a},[Symbol.toStringTag]:"PrismaPromise"}}}function Fl(e){return typeof e.then=="function"?e:Promise.resolve(e)}var bf=di.split(".")[0],Ef={isEnabled(){return  false},getTraceParent(){return "00-10-10-00"},dispatchEngineSpans(){},getActiveContext(){},runInChildSpan(e,r){return r()}},Eo=class{isEnabled(){return this.getGlobalTracingHelper().isEnabled()}getTraceParent(r){return this.getGlobalTracingHelper().getTraceParent(r)}dispatchEngineSpans(r){return this.getGlobalTracingHelper().dispatchEngineSpans(r)}getActiveContext(){return this.getGlobalTracingHelper().getActiveContext()}runInChildSpan(r,t){return this.getGlobalTracingHelper().runInChildSpan(r,t)}getGlobalTracingHelper(){let r=globalThis[`V${bf}_PRISMA_INSTRUMENTATION`],t=globalThis.PRISMA_INSTRUMENTATION;return r?.helper??t?.helper??Ef}};function Ml(){return new Eo}function $l(e,r=()=>{}){let t,n=new Promise(i=>t=i);return {then(i){return --e===0&&t(r()),i?.(n)}}}function ql(e){return typeof e=="string"?e:e.reduce((r,t)=>{let n=typeof t=="string"?t:t.level;return n==="query"?r:r&&(t==="info"||r==="info")?"info":n},void 0)}function Gn(e){return typeof e.batchRequestIdx=="number"}function Vl(e){if(e.action!=="findUnique"&&e.action!=="findUniqueOrThrow")return;let r=[];return e.modelName&&r.push(e.modelName),e.query.arguments&&r.push(wo(e.query.arguments)),r.push(wo(e.query.selection)),r.join("")}function wo(e){return `(${Object.keys(e).sort().map(t=>{let n=e[t];return typeof n=="object"&&n!==null?`(${t} ${wo(n)})`:t}).join(" ")})`}var wf={aggregate:false,aggregateRaw:false,createMany:true,createManyAndReturn:true,createOne:true,deleteMany:true,deleteOne:true,executeRaw:true,findFirst:false,findFirstOrThrow:false,findMany:false,findRaw:false,findUnique:false,findUniqueOrThrow:false,groupBy:false,queryRaw:false,runCommandRaw:true,updateMany:true,updateManyAndReturn:true,updateOne:true,upsertOne:true};function xo(e){return wf[e]}var Qn=class{constructor(r){this.options=r;this.batches={};}batches;tickActive=false;request(r){let t=this.options.batchBy(r);return t?(this.batches[t]||(this.batches[t]=[],this.tickActive||(this.tickActive=true,process$2.nextTick(()=>{this.dispatchBatches(),this.tickActive=false;}))),new Promise((n,i)=>{this.batches[t].push({request:r,resolve:n,reject:i});})):this.options.singleLoader(r)}dispatchBatches(){for(let r in this.batches){let t=this.batches[r];delete this.batches[r],t.length===1?this.options.singleLoader(t[0].request).then(n=>{n instanceof Error?t[0].reject(n):t[0].resolve(n);}).catch(n=>{t[0].reject(n);}):(t.sort((n,i)=>this.options.batchOrder(n.request,i.request)),this.options.batchLoader(t.map(n=>n.request)).then(n=>{if(n instanceof Error)for(let i=0;i<t.length;i++)t[i].reject(n);else for(let i=0;i<t.length;i++){let o=n[i];o instanceof Error?t[i].reject(o):t[i].resolve(o);}}).catch(n=>{for(let i=0;i<t.length;i++)t[i].reject(n);}));}}get[Symbol.toStringTag](){return "DataLoader"}};function dr(e,r){if(r===null)return r;switch(e){case "bigint":return BigInt(r);case "bytes":{let{buffer:t,byteOffset:n,byteLength:i}=Buffer.from(r,"base64");return new Uint8Array(t,n,i)}case "decimal":return new Ye(r);case "datetime":case "date":return new Date(r);case "time":return new Date(`1970-01-01T${r}Z`);case "bigint-array":return r.map(t=>dr("bigint",t));case "bytes-array":return r.map(t=>dr("bytes",t));case "decimal-array":return r.map(t=>dr("decimal",t));case "datetime-array":return r.map(t=>dr("datetime",t));case "date-array":return r.map(t=>dr("date",t));case "time-array":return r.map(t=>dr("time",t));default:return r}}function vo(e){let r=[],t=xf(e);for(let n=0;n<e.rows.length;n++){let i=e.rows[n],o={...t};for(let s=0;s<i.length;s++)o[e.columns[s]]=dr(e.types[s],i[s]);r.push(o);}return r}function xf(e){let r={};for(let t=0;t<e.columns.length;t++)r[e.columns[t]]=null;return r}var vf=L("prisma:client:request_handler"),Wn=class{client;dataloader;logEmitter;constructor(r,t){this.logEmitter=t,this.client=r,this.dataloader=new Qn({batchLoader:Ga(async({requests:n,customDataProxyFetch:i})=>{let{transaction:o,otelParentCtx:s}=n[0],a=n.map(p=>p.protocolQuery),l=this.client._tracingHelper.getTraceParent(s),u=n.some(p=>xo(p.protocolQuery.action));return (await this.client._engine.requestBatch(a,{traceparent:l,transaction:Pf(o),containsWrite:u,customDataProxyFetch:i})).map((p,d)=>{if(p instanceof Error)return p;try{return this.mapQueryEngineResult(n[d],p)}catch(f){return f}})}),singleLoader:async n=>{let i=n.transaction?.kind==="itx"?jl(n.transaction):void 0,o=await this.client._engine.request(n.protocolQuery,{traceparent:this.client._tracingHelper.getTraceParent(),interactiveTransaction:i,isWrite:xo(n.protocolQuery.action),customDataProxyFetch:n.customDataProxyFetch});return this.mapQueryEngineResult(n,o)},batchBy:n=>n.transaction?.id?`transaction-${n.transaction.id}`:Vl(n.protocolQuery),batchOrder(n,i){return n.transaction?.kind==="batch"&&i.transaction?.kind==="batch"?n.transaction.index-i.transaction.index:0}});}async request(r){try{return await this.dataloader.request(r)}catch(t){let{clientMethod:n,callsite:i,transaction:o,args:s,modelName:a}=r;this.handleAndLogRequestError({error:t,clientMethod:n,callsite:i,transaction:o,args:s,modelName:a,globalOmit:r.globalOmit});}}mapQueryEngineResult({dataPath:r,unpacker:t},n){let i=n?.data,o=this.unpack(i,r,t);return process$2.env.PRISMA_CLIENT_GET_TIME?{data:o}:o}handleAndLogRequestError(r){try{this.handleRequestError(r);}catch(t){throw this.logEmitter&&this.logEmitter.emit("error",{message:t.message,target:r.clientMethod,timestamp:new Date}),t}}handleRequestError({error:r,clientMethod:t,callsite:n,transaction:i,args:o,modelName:s,globalOmit:a}){if(vf(r),Tf(r,i))throw r;if(r instanceof Z&&Sf(r)){let u=Bl(r.meta);In({args:o,errors:[u],callsite:n,errorFormat:this.client._errorFormat,originalMethod:t,clientVersion:this.client._clientVersion,globalOmit:a});}let l=r.message;if(n&&(l=wn({callsite:n,originalMethod:t,isPanic:r.isPanic,showColors:this.client._errorFormat==="pretty",message:l})),l=this.sanitizeMessage(l),r.code){let u=s?{modelName:s,...r.meta}:r.meta;throw new Z(l,{code:r.code,clientVersion:this.client._clientVersion,meta:u,batchRequestIdx:r.batchRequestIdx})}else {if(r.isPanic)throw new de(l,this.client._clientVersion);if(r instanceof q)throw new q(l,{clientVersion:this.client._clientVersion,batchRequestIdx:r.batchRequestIdx});if(r instanceof P)throw new P(l,this.client._clientVersion);if(r instanceof de)throw new de(l,this.client._clientVersion)}throw r.clientVersion=this.client._clientVersion,r}sanitizeMessage(r){return this.client._errorFormat&&this.client._errorFormat!=="pretty"?xr(r):r}unpack(r,t,n){if(!r||(r.data&&(r=r.data),!r))return r;let i=Object.keys(r)[0],o=Object.values(r)[0],s=t.filter(u=>u!=="select"&&u!=="include"),a=Xi(o,s),l=i==="queryRaw"?vo(a):vt(a);return n?n(l):l}get[Symbol.toStringTag](){return "RequestHandler"}};function Pf(e){if(e){if(e.kind==="batch")return {kind:"batch",options:{isolationLevel:e.isolationLevel}};if(e.kind==="itx")return {kind:"itx",options:jl(e)};sr(e,"Unknown transaction kind");}}function jl(e){return {id:e.id,payload:e.payload}}function Tf(e,r){return Gn(e)&&r?.kind==="batch"&&e.batchRequestIdx!==r.index}function Sf(e){return e.code==="P2009"||e.code==="P2012"}function Bl(e){if(e.kind==="Union")return {kind:"Union",errors:e.errors.map(Bl)};if(Array.isArray(e.selectionPath)){let[,...r]=e.selectionPath;return {...e,selectionPath:r}}return e}var Ul=ul;var Kl=le(qi());var k=class extends Error{constructor(r){super(r+`
Read more at https://pris.ly/d/client-constructor`),this.name="PrismaClientConstructorValidationError";}get[Symbol.toStringTag](){return "PrismaClientConstructorValidationError"}};x(k,"PrismaClientConstructorValidationError");var Gl=["datasources","datasourceUrl","errorFormat","adapter","log","transactionOptions","omit","__internal"],Ql=["pretty","colorless","minimal"],Wl=["info","query","warn","error"],Rf={datasources:(e,{datasourceNames:r})=>{if(e){if(typeof e!="object"||Array.isArray(e))throw new k(`Invalid value ${JSON.stringify(e)} for "datasources" provided to PrismaClient constructor`);for(let[t,n]of Object.entries(e)){if(!r.includes(t)){let i=Qr(t,r)||` Available datasources: ${r.join(", ")}`;throw new k(`Unknown datasource ${t} provided to PrismaClient constructor.${i}`)}if(typeof n!="object"||Array.isArray(n))throw new k(`Invalid value ${JSON.stringify(e)} for datasource "${t}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);if(n&&typeof n=="object")for(let[i,o]of Object.entries(n)){if(i!=="url")throw new k(`Invalid value ${JSON.stringify(e)} for datasource "${t}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);if(typeof o!="string")throw new k(`Invalid value ${JSON.stringify(o)} for datasource "${t}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`)}}}},adapter:(e,r)=>{if(!e&&wr(r.generator)==="client")throw new k('Using engine type "client" requires a driver adapter to be provided to PrismaClient constructor.');if(e!==null){if(e===void 0)throw new k('"adapter" property must not be undefined, use null to conditionally disable driver adapters.');if(wr(r.generator)==="binary")throw new k('Cannot use a driver adapter with the "binary" Query Engine. Please use the "library" Query Engine.')}},datasourceUrl:e=>{if(typeof e<"u"&&typeof e!="string")throw new k(`Invalid value ${JSON.stringify(e)} for "datasourceUrl" provided to PrismaClient constructor.
Expected string or undefined.`)},errorFormat:e=>{if(e){if(typeof e!="string")throw new k(`Invalid value ${JSON.stringify(e)} for "errorFormat" provided to PrismaClient constructor.`);if(!Ql.includes(e)){let r=Qr(e,Ql);throw new k(`Invalid errorFormat ${e} provided to PrismaClient constructor.${r}`)}}},log:e=>{if(!e)return;if(!Array.isArray(e))throw new k(`Invalid value ${JSON.stringify(e)} for "log" provided to PrismaClient constructor.`);function r(t){if(typeof t=="string"&&!Wl.includes(t)){let n=Qr(t,Wl);throw new k(`Invalid log level "${t}" provided to PrismaClient constructor.${n}`)}}for(let t of e){r(t);let n={level:r,emit:i=>{let o=["stdout","event"];if(!o.includes(i)){let s=Qr(i,o);throw new k(`Invalid value ${JSON.stringify(i)} for "emit" in logLevel provided to PrismaClient constructor.${s}`)}}};if(t&&typeof t=="object")for(let[i,o]of Object.entries(t))if(n[i])n[i](o);else throw new k(`Invalid property ${i} for "log" provided to PrismaClient constructor`)}},transactionOptions:e=>{if(!e)return;let r=e.maxWait;if(r!=null&&r<=0)throw new k(`Invalid value ${r} for maxWait in "transactionOptions" provided to PrismaClient constructor. maxWait needs to be greater than 0`);let t=e.timeout;if(t!=null&&t<=0)throw new k(`Invalid value ${t} for timeout in "transactionOptions" provided to PrismaClient constructor. timeout needs to be greater than 0`)},omit:(e,r)=>{if(typeof e!="object")throw new k('"omit" option is expected to be an object.');if(e===null)throw new k('"omit" option can not be `null`');let t=[];for(let[n,i]of Object.entries(e)){let o=Cf(n,r.runtimeDataModel);if(!o){t.push({kind:"UnknownModel",modelKey:n});continue}for(let[s,a]of Object.entries(i)){let l=o.fields.find(u=>u.name===s);if(!l){t.push({kind:"UnknownField",modelKey:n,fieldName:s});continue}if(l.relationName){t.push({kind:"RelationInOmit",modelKey:n,fieldName:s});continue}typeof a!="boolean"&&t.push({kind:"InvalidFieldValue",modelKey:n,fieldName:s});}}if(t.length>0)throw new k(If(e,t))},__internal:e=>{if(!e)return;let r=["debug","engine","configOverride"];if(typeof e!="object")throw new k(`Invalid value ${JSON.stringify(e)} for "__internal" to PrismaClient constructor`);for(let[t]of Object.entries(e))if(!r.includes(t)){let n=Qr(t,r);throw new k(`Invalid property ${JSON.stringify(t)} for "__internal" provided to PrismaClient constructor.${n}`)}}};function Hl(e,r){for(let[t,n]of Object.entries(e)){if(!Gl.includes(t)){let i=Qr(t,Gl);throw new k(`Unknown property ${t} provided to PrismaClient constructor.${i}`)}Rf[t](n,r);}if(e.datasourceUrl&&e.datasources)throw new k('Can not use "datasourceUrl" and "datasources" options at the same time. Pick one of them')}function Qr(e,r){if(r.length===0||typeof e!="string")return "";let t=Af(e,r);return t?` Did you mean "${t}"?`:""}function Af(e,r){if(r.length===0)return null;let t=r.map(i=>({value:i,distance:(0, Kl.default)(e,i)}));t.sort((i,o)=>i.distance<o.distance?-1:1);let n=t[0];return n.distance<3?n.value:null}function Cf(e,r){return Jl(r.models,e)??Jl(r.types,e)}function Jl(e,r){let t=Object.keys(e).find(n=>Qe(n)===r);if(t)return e[t]}function If(e,r){let t=_r(e);for(let o of r)switch(o.kind){case "UnknownModel":t.arguments.getField(o.modelKey)?.markAsError(),t.addErrorMessage(()=>`Unknown model name: ${o.modelKey}.`);break;case "UnknownField":t.arguments.getDeepField([o.modelKey,o.fieldName])?.markAsError(),t.addErrorMessage(()=>`Model "${o.modelKey}" does not have a field named "${o.fieldName}".`);break;case "RelationInOmit":t.arguments.getDeepField([o.modelKey,o.fieldName])?.markAsError(),t.addErrorMessage(()=>'Relations are already excluded by default and can not be specified in "omit".');break;case "InvalidFieldValue":t.arguments.getDeepFieldValue([o.modelKey,o.fieldName])?.markAsError(),t.addErrorMessage(()=>"Omit field option value must be a boolean.");break}let{message:n,args:i}=Cn(t,"colorless");return `Error validating "omit" option:

${i}

${n}`}function Yl(e){return e.length===0?Promise.resolve([]):new Promise((r,t)=>{let n=new Array(e.length),i=null,o=false,s=0,a=()=>{o||(s++,s===e.length&&(o=true,i?t(i):r(n)));},l=u=>{o||(o=true,t(u));};for(let u=0;u<e.length;u++)e[u].then(c=>{n[u]=c,a();},c=>{if(!Gn(c)){l(c);return}c.batchRequestIdx===u?l(c):(i||(i=c),a());});})}var rr=L("prisma:client");typeof globalThis=="object"&&(globalThis.NODE_CLIENT=true);var _f={requestArgsToMiddlewareArgs:e=>e,middlewareArgsToRequestArgs:e=>e},Nf=Symbol.for("prisma.client.transaction.id"),Lf={id:0,nextId(){return ++this.id}};function Ff(e){class r{_originalClient=this;_runtimeDataModel;_requestHandler;_connectionPromise;_disconnectionPromise;_engineConfig;_accelerateEngineConfig;_clientVersion;_errorFormat;_tracingHelper;_previewFeatures;_activeProvider;_globalOmit;_extensions;_engine;_appliedParent;_createPrismaPromise=bo();constructor(n){e=n?.__internal?.configOverride?.(e)??e,Ha(e),n&&Hl(n,e);let i=new EventEmitter().on("error",()=>{});this._extensions=Nr.empty(),this._previewFeatures=Rl(e),this._clientVersion=e.clientVersion??Ul,this._activeProvider=e.activeProvider,this._globalOmit=n?.omit,this._tracingHelper=Ml();let o=e.relativeEnvPaths&&{rootEnvPath:e.relativeEnvPaths.rootEnvPath&&M__default.resolve(e.dirname,e.relativeEnvPaths.rootEnvPath),schemaEnvPath:e.relativeEnvPaths.schemaEnvPath&&M__default.resolve(e.dirname,e.relativeEnvPaths.schemaEnvPath)},s;if(n?.adapter){s=n.adapter;let l=e.activeProvider==="postgresql"||e.activeProvider==="cockroachdb"?"postgres":e.activeProvider;if(s.provider!==l)throw new P(`The Driver Adapter \`${s.adapterName}\`, based on \`${s.provider}\`, is not compatible with the provider \`${l}\` specified in the Prisma schema.`,this._clientVersion);if(n.datasources||n.datasourceUrl!==void 0)throw new P("Custom datasource configuration is not compatible with Prisma Driver Adapters. Please define the database connection string directly in the Driver Adapter configuration.",this._clientVersion)}let a=!s&&o&&it(o,{conflictCheck:"none"})||e.injectableEdgeEnv?.();try{let l=n??{},u=l.__internal??{},c=u.debug===!0;c&&L.enable("prisma:client");let p=M__default.resolve(e.dirname,e.relativePath);Ci.existsSync(p)||(p=e.dirname),rr("dirname",e.dirname),rr("relativePath",e.relativePath),rr("cwd",p);let d=u.engine||{};if(l.errorFormat?this._errorFormat=l.errorFormat:"production"==="production"?this._errorFormat="minimal":process$2.env.NO_COLOR?this._errorFormat="colorless":this._errorFormat="colorless",this._runtimeDataModel=e.runtimeDataModel,this._engineConfig={cwd:p,dirname:e.dirname,enableDebugLogs:c,allowTriggerPanic:d.allowTriggerPanic,prismaPath:d.binaryPath??void 0,engineEndpoint:d.endpoint,generator:e.generator,showColors:this._errorFormat==="pretty",logLevel:l.log&&ql(l.log),logQueries:l.log&&!!(typeof l.log=="string"?l.log==="query":l.log.find(f=>typeof f=="string"?f==="query":f.level==="query")),env:a?.parsed??{},flags:[],engineWasm:e.engineWasm,compilerWasm:e.compilerWasm,clientVersion:e.clientVersion,engineVersion:e.engineVersion,previewFeatures:this._previewFeatures,activeProvider:e.activeProvider,inlineSchema:e.inlineSchema,overrideDatasources:Ya(l,e.datasourceNames),inlineDatasources:e.inlineDatasources,inlineSchemaHash:e.inlineSchemaHash,tracingHelper:this._tracingHelper,transactionOptions:{maxWait:l.transactionOptions?.maxWait??2e3,timeout:l.transactionOptions?.timeout??5e3,isolationLevel:l.transactionOptions?.isolationLevel},logEmitter:i,isBundled:e.isBundled,adapter:s},this._accelerateEngineConfig={...this._engineConfig,accelerateUtils:{resolveDatasourceUrl:qr,getBatchRequestPayload:Fr,prismaGraphQLToJSError:Mr,PrismaClientUnknownRequestError:q,PrismaClientInitializationError:P,PrismaClientKnownRequestError:Z,debug:L("prisma:client:accelerateEngine"),engineVersion:Zl.version,clientVersion:e.clientVersion}},rr("clientVersion",e.clientVersion),this._engine=Sl(e,this._engineConfig),this._requestHandler=new Wn(this,i),l.log)for(let f of l.log){let h=typeof f=="string"?f:f.emit==="stdout"?f.level:null;h&&this.$on(h,g=>{rt.log(`${rt.tags[h]??""}`,g.message||g.query);});}}catch(l){throw l.clientVersion=this._clientVersion,l}return this._appliedParent=wt(this)}get[Symbol.toStringTag](){return "PrismaClient"}$on(n,i){return n==="beforeExit"?this._engine.onBeforeExit(i):n&&this._engineConfig.logEmitter.on(n,i),this}$connect(){try{return this._engine.start()}catch(n){throw n.clientVersion=this._clientVersion,n}}async $disconnect(){try{await this._engine.stop();}catch(n){throw n.clientVersion=this._clientVersion,n}finally{$o();}}$executeRawInternal(n,i,o,s){let a=this._activeProvider;return this._request({action:"executeRaw",args:o,transaction:n,clientMethod:i,argsMapper:yo({clientMethod:i,activeProvider:a}),callsite:Ze(this._errorFormat),dataPath:[],middlewareArgsMapper:s})}$executeRaw(n,...i){return this._createPrismaPromise(o=>{if(n.raw!==void 0||n.sql!==void 0){let[s,a]=zl(n,i);return ho(this._activeProvider,s.text,s.values,Array.isArray(n)?"prisma.$executeRaw`<SQL>`":"prisma.$executeRaw(sql`<SQL>`)"),this.$executeRawInternal(o,"$executeRaw",s,a)}throw new X("`$executeRaw` is a tag function, please use it like the following:\n```\nconst result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`\n```\n\nOr read our docs at https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#executeraw\n",{clientVersion:this._clientVersion})})}$executeRawUnsafe(n,...i){return this._createPrismaPromise(o=>(ho(this._activeProvider,n,i,"prisma.$executeRawUnsafe(<SQL>, [...values])"),this.$executeRawInternal(o,"$executeRawUnsafe",[n,...i])))}$runCommandRaw(n){if(e.activeProvider!=="mongodb")throw new X(`The ${e.activeProvider} provider does not support $runCommandRaw. Use the mongodb provider.`,{clientVersion:this._clientVersion});return this._createPrismaPromise(i=>this._request({args:n,clientMethod:"$runCommandRaw",dataPath:[],action:"runCommandRaw",argsMapper:Al,callsite:Ze(this._errorFormat),transaction:i}))}async $queryRawInternal(n,i,o,s){let a=this._activeProvider;return this._request({action:"queryRaw",args:o,transaction:n,clientMethod:i,argsMapper:yo({clientMethod:i,activeProvider:a}),callsite:Ze(this._errorFormat),dataPath:[],middlewareArgsMapper:s})}$queryRaw(n,...i){return this._createPrismaPromise(o=>{if(n.raw!==void 0||n.sql!==void 0)return this.$queryRawInternal(o,"$queryRaw",...zl(n,i));throw new X("`$queryRaw` is a tag function, please use it like the following:\n```\nconst result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`\n```\n\nOr read our docs at https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#queryraw\n",{clientVersion:this._clientVersion})})}$queryRawTyped(n){return this._createPrismaPromise(i=>{if(!this._hasPreviewFlag("typedSql"))throw new X("`typedSql` preview feature must be enabled in order to access $queryRawTyped API",{clientVersion:this._clientVersion});return this.$queryRawInternal(i,"$queryRawTyped",n)})}$queryRawUnsafe(n,...i){return this._createPrismaPromise(o=>this.$queryRawInternal(o,"$queryRawUnsafe",[n,...i]))}_transactionWithArray({promises:n,options:i}){let o=Lf.nextId(),s=$l(n.length),a=n.map((l,u)=>{if(l?.[Symbol.toStringTag]!=="PrismaPromise")throw new Error("All elements of the array need to be Prisma Client promises. Hint: Please make sure you are not awaiting the Prisma client calls you intended to pass in the $transaction function.");let c=i?.isolationLevel??this._engineConfig.transactionOptions.isolationLevel,p={kind:"batch",id:o,index:u,isolationLevel:c,lock:s};return l.requestTransaction?.(p)??l});return Yl(a)}async _transactionWithCallback({callback:n,options:i}){let o={traceparent:this._tracingHelper.getTraceParent()},s={maxWait:i?.maxWait??this._engineConfig.transactionOptions.maxWait,timeout:i?.timeout??this._engineConfig.transactionOptions.timeout,isolationLevel:i?.isolationLevel??this._engineConfig.transactionOptions.isolationLevel},a=await this._engine.transaction("start",o,s),l;try{let u={kind:"itx",...a};l=await n(this._createItxClient(u)),await this._engine.transaction("commit",o,a);}catch(u){throw await this._engine.transaction("rollback",o,a).catch(()=>{}),u}return l}_createItxClient(n){return he(wt(he(Na(this),[ee("_appliedParent",()=>this._appliedParent._createItxClient(n)),ee("_createPrismaPromise",()=>bo(n)),ee(Nf,()=>n.id)])),[Lr(qa)])}$transaction(n,i){let o;typeof n=="function"?this._engineConfig.adapter?.adapterName==="@prisma/adapter-d1"?o=()=>{throw new Error("Cloudflare D1 does not support interactive transactions. We recommend you to refactor your queries with that limitation in mind, and use batch transactions with `prisma.$transactions([])` where applicable.")}:o=()=>this._transactionWithCallback({callback:n,options:i}):o=()=>this._transactionWithArray({promises:n,options:i});let s={name:"transaction",attributes:{method:"$transaction"}};return this._tracingHelper.runInChildSpan(s,o)}_request(n){n.otelParentCtx=this._tracingHelper.getActiveContext();let i=n.middlewareArgsMapper??_f,o={args:i.requestArgsToMiddlewareArgs(n.args),dataPath:n.dataPath,runInTransaction:!!n.transaction,action:n.action,model:n.model},s={operation:{name:"operation",attributes:{method:o.action,model:o.model,name:o.model?`${o.model}.${o.action}`:o.action}}},a=async l=>{let{runInTransaction:u,args:c,...p}=l,d={...n,...p};c&&(d.args=i.middlewareArgsToRequestArgs(c)),n.transaction!==void 0&&u===false&&delete d.transaction;let f=await Ua(this,d);return d.model?$a({result:f,modelName:d.model,args:d.args,extensions:this._extensions,runtimeDataModel:this._runtimeDataModel,globalOmit:this._globalOmit}):f};return this._tracingHelper.runInChildSpan(s.operation,()=>new AsyncResource("prisma-client-request").runInAsyncScope(()=>a(o)))}async _executeRequest({args:n,clientMethod:i,dataPath:o,callsite:s,action:a,model:l,argsMapper:u,transaction:c,unpacker:p,otelParentCtx:d,customDataProxyFetch:f}){try{n=u?u(n):n;let h={name:"serialize"},g=this._tracingHelper.runInChildSpan(h,()=>Ji({modelName:l,runtimeDataModel:this._runtimeDataModel,action:a,args:n,clientMethod:i,callsite:s,extensions:this._extensions,errorFormat:this._errorFormat,clientVersion:this._clientVersion,previewFeatures:this._previewFeatures,globalOmit:this._globalOmit}));return L.enabled("prisma:client")&&(rr("Prisma Client call:"),rr(`prisma.${i}(${Pa(n)})`),rr("Generated request:"),rr(JSON.stringify(g,null,2)+`
`)),c?.kind==="batch"&&await c.lock,this._requestHandler.request({protocolQuery:g,modelName:l,action:a,clientMethod:i,dataPath:o,callsite:s,args:n,extensions:this._extensions,transaction:c,unpacker:p,otelParentCtx:d,otelChildCtx:this._tracingHelper.getActiveContext(),globalOmit:this._globalOmit,customDataProxyFetch:f})}catch(h){throw h.clientVersion=this._clientVersion,h}}$metrics=new ht(this);_hasPreviewFlag(n){return !!this._engineConfig.previewFeatures?.includes(n)}$applyPendingMigrations(){return this._engine.applyPendingMigrations()}$extends=La}return r}function zl(e,r){return Mf(e)?[new se(e,r),Nl]:[e,Ll]}function Mf(e){return Array.isArray(e)&&Array.isArray(e.raw)}/*! Bundled license information:

decimal.js/decimal.mjs:
  (*!
   *  decimal.js v10.5.0
   *  An arbitrary-precision Decimal type for JavaScript.
   *  https://github.com/MikeMcl/decimal.js
   *  Copyright (c) 2025 Michael Mclaughlin <M8ch88l@gmail.com>
   *  MIT Licence
   *)
*/

const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client"
    },
    "output": {
      "value": "/home/perry/projetos/nuxt-app/generated/prisma",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "debian-openssl-3.0.x",
        "native": true
      },
      {
        "fromEnvVar": null,
        "value": "rhel-openssl-3.0.x"
      }
    ],
    "previewFeatures": [],
    "sourceFilePath": "/home/perry/projetos/nuxt-app/prisma/schema.prisma",
    "isCustomOutput": true
  },
  "relativePath": "../../prisma",
  "clientVersion": "6.19.0",
  "engineVersion": "2ba551f319ab1df4bc874a89965d8b3641056773",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": 'generator client {\n  provider      = "prisma-client"\n  binaryTargets = ["native", "rhel-openssl-3.0.x"]\n  output        = "../generated/prisma"\n}\n\ndatasource db {\n  provider  = "postgresql"\n  url       = env("DATABASE_URL")\n  directUrl = env("DIRECT_URL")\n}\n\nmodel Company {\n  id        String   @id @default(cuid())\n  name      String\n  email     String   @unique\n  phone     String?\n  address   String?\n  city      String?\n  state     String?\n  zipCode   String?\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  admins         Admins[]\n  dishes         Dish[]\n  sideCategories SideCategory[]\n  categories     Category[]\n}\n\nmodel Admins {\n  id        String   @id @default(cuid())\n  email     String   @unique\n  name      String\n  password  String\n  phone     String?\n  isActive  Boolean  @default(true)\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  companyId String\n  company   Company @relation(fields: [companyId], references: [id], onDelete: Cascade)\n\n  @@index([companyId])\n}\n\nmodel Dish {\n  id          String   @id @default(cuid())\n  name        String\n  description String?\n  price       Float\n  category    String\n  image       String?\n  isAvailable Boolean  @default(true)\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  companyId      String\n  company        Company            @relation(fields: [companyId], references: [id], onDelete: Cascade)\n  sideCategories DishSideCategory[]\n  categories     DishCategory[]\n\n  @@index([companyId])\n}\n\nmodel Category {\n  id          String   @id @default(cuid())\n  name        String\n  slug        String\n  description String?\n  order       Int      @default(0)\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  companyId String\n  company   Company @relation(fields: [companyId], references: [id], onDelete: Cascade)\n\n  dishes DishCategory[]\n\n  @@unique([companyId, slug])\n  @@index([companyId])\n}\n\nmodel DishCategory {\n  dishId     String\n  categoryId String\n  createdAt  DateTime @default(now())\n\n  dish     Dish     @relation(fields: [dishId], references: [id], onDelete: Cascade)\n  category Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n\n  @@id([dishId, categoryId])\n  @@index([categoryId])\n}\n\nmodel SideCategory {\n  id            String   @id @default(cuid())\n  name          String\n  description   String?\n  isRequired    Boolean  @default(false)\n  maxSelections Int?\n  order         Int      @default(0)\n  createdAt     DateTime @default(now())\n  updatedAt     DateTime @updatedAt\n\n  companyId String\n  company   Company @relation(fields: [companyId], references: [id], onDelete: Cascade)\n\n  sides  SideOption[]\n  dishes DishSideCategory[]\n\n  @@index([companyId])\n}\n\nmodel SideOption {\n  id             String   @id @default(cuid())\n  name           String\n  description    String?\n  priceIncrement Float    @default(0)\n  image          String?\n  isAvailable    Boolean  @default(true)\n  createdAt      DateTime @default(now())\n  updatedAt      DateTime @updatedAt\n\n  categoryId String\n  category   SideCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n\n  @@index([categoryId])\n}\n\nmodel DishSideCategory {\n  dishId         String\n  sideCategoryId String\n  order          Int    @default(0)\n\n  dish         Dish         @relation(fields: [dishId], references: [id], onDelete: Cascade)\n  sideCategory SideCategory @relation(fields: [sideCategoryId], references: [id], onDelete: Cascade)\n\n  @@id([dishId, sideCategoryId])\n  @@index([sideCategoryId])\n}\n',
  "inlineSchemaHash": "44614b3dabebe1c04cf736e3ab91bd101d9d24c757257a1d4872dc14c1628a69",
  "copyEngine": true,
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "dirname": ""
};
config.runtimeDataModel = JSON.parse('{"models":{"Company":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"email","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"phone","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"address","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"city","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"state","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"zipCode","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true},{"name":"admins","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Admins","nativeType":null,"relationName":"AdminsToCompany","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"dishes","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Dish","nativeType":null,"relationName":"CompanyToDish","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"sideCategories","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"SideCategory","nativeType":null,"relationName":"CompanyToSideCategory","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"categories","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Category","nativeType":null,"relationName":"CategoryToCompany","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Admins":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"email","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"password","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"phone","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"isActive","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":true,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true},{"name":"companyId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"company","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Company","nativeType":null,"relationName":"AdminsToCompany","relationFromFields":["companyId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Dish":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"price","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Float","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"category","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"image","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"isAvailable","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":true,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true},{"name":"companyId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"company","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Company","nativeType":null,"relationName":"CompanyToDish","relationFromFields":["companyId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"sideCategories","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DishSideCategory","nativeType":null,"relationName":"DishToDishSideCategory","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"categories","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DishCategory","nativeType":null,"relationName":"DishToDishCategory","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Category":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"slug","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"order","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":0,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true},{"name":"companyId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"company","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Company","nativeType":null,"relationName":"CategoryToCompany","relationFromFields":["companyId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"dishes","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DishCategory","nativeType":null,"relationName":"CategoryToDishCategory","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["companyId","slug"]],"uniqueIndexes":[{"name":null,"fields":["companyId","slug"]}],"isGenerated":false},"DishCategory":{"dbName":null,"schema":null,"fields":[{"name":"dishId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"categoryId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"dish","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Dish","nativeType":null,"relationName":"DishToDishCategory","relationFromFields":["dishId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"category","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Category","nativeType":null,"relationName":"CategoryToDishCategory","relationFromFields":["categoryId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":{"name":null,"fields":["dishId","categoryId"]},"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"SideCategory":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"isRequired","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":false,"isGenerated":false,"isUpdatedAt":false},{"name":"maxSelections","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"order","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":0,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true},{"name":"companyId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"company","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Company","nativeType":null,"relationName":"CompanyToSideCategory","relationFromFields":["companyId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"sides","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"SideOption","nativeType":null,"relationName":"SideCategoryToSideOption","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"dishes","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DishSideCategory","nativeType":null,"relationName":"DishSideCategoryToSideCategory","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"SideOption":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"priceIncrement","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Float","nativeType":null,"default":0,"isGenerated":false,"isUpdatedAt":false},{"name":"image","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"isAvailable","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":true,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true},{"name":"categoryId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"category","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"SideCategory","nativeType":null,"relationName":"SideCategoryToSideOption","relationFromFields":["categoryId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"DishSideCategory":{"dbName":null,"schema":null,"fields":[{"name":"dishId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"sideCategoryId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"order","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":0,"isGenerated":false,"isUpdatedAt":false},{"name":"dish","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Dish","nativeType":null,"relationName":"DishToDishSideCategory","relationFromFields":["dishId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"sideCategory","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"SideCategory","nativeType":null,"relationName":"DishSideCategoryToSideCategory","relationFromFields":["sideCategoryId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":{"name":null,"fields":["dishId","sideCategoryId"]},"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false}},"enums":{},"types":{}}');
config.engineWasm = void 0;
config.compilerWasm = void 0;
function getPrismaClientClass(dirname) {
  config.dirname = dirname;
  return Ff(config);
}

globalThis["__dirname"] = M.dirname(fileURLToPath(globalThis._importMeta_.url));
const PrismaClient = getPrismaClientClass(__dirname);
M.join(__dirname, "libquery_engine-debian-openssl-3.0.x.so.node");
M.join(process$2.cwd(), "generated/prisma/libquery_engine-debian-openssl-3.0.x.so.node");
M.join(__dirname, "libquery_engine-rhel-openssl-3.0.x.so.node");
M.join(process$2.cwd(), "generated/prisma/libquery_engine-rhel-openssl-3.0.x.so.node");

let prisma;
{
  prisma = new PrismaClient();
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
    return C$1(
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

export { DatabaseHelper as D, H3Error as H, getQuery as a, deleteCookie as b, createError$1 as c, defineEventHandler as d, getCookie as e, sendError as f, getRouterParam as g, sendSuccess as h, handleServerError as i, supabase as j, readMultipartFormData as k, buildAssetsURL as l, getResponseStatusText as m, getResponseStatus as n, defineRenderHandler as o, prisma as p, publicAssetsURL as q, readBody as r, setCookie as s, getRouteRules as t, useRuntimeConfig as u, useNitroApp as v, listener as w };
//# sourceMappingURL=nitro.mjs.map
