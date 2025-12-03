"use strict";
var baseToolsWeb = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/web/index.ts
  var web_exports = {};
  __export(web_exports, {
    copyBlob: () => copyBlob,
    copyHtml: () => copyHtml,
    copyImage: () => copyImage,
    copyNode: () => copyNode,
    copyRtf: () => copyRtf,
    copyTable: () => copyTable,
    copyText: () => copyText,
    copyUrl: () => copyUrl,
    download: () => download,
    getBrowserName: () => getBrowserName,
    getBrowserVersion: () => getBrowserVersion,
    getCookie: () => getCookie,
    getDevicePixelRatio: () => getDevicePixelRatio,
    getDispositionFileName: () => getDispositionFileName,
    getLocalStorage: () => getLocalStorage,
    getOS: () => getOS,
    getUA: () => getUA,
    getWindowHeight: () => getWindowHeight,
    getWindowScrollLeft: () => getWindowScrollLeft,
    getWindowScrollTop: () => getWindowScrollTop,
    getWindowWidth: () => getWindowWidth,
    hasCss: () => hasCss,
    hasJs: () => hasJs,
    isAndroid: () => isAndroid,
    isChrome: () => isChrome,
    isIOS: () => isIOS,
    isInViewport: () => isInViewport,
    isMobile: () => isMobile,
    isPC: () => isPC,
    isTablet: () => isTablet,
    isTouchSupported: () => isTouchSupported,
    isWeChat: () => isWeChat,
    loadCss: () => loadCss,
    loadJs: () => loadJs,
    lockBodyScroll: () => lockBodyScroll,
    parseAxiosBlob: () => parseAxiosBlob,
    preloadImage: () => preloadImage,
    removeCookie: () => removeCookie,
    removeLocalStorage: () => removeLocalStorage,
    setCookie: () => setCookie,
    setLocalStorage: () => setLocalStorage,
    unlockBodyScroll: () => unlockBodyScroll,
    windowScrollTo: () => windowScrollTo
  });

  // src/web/clipboard/index.ts
  async function copyText(text) {
    if (typeof text !== "string") text = String(text ?? "");
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch (e) {
      }
    }
    return new Promise((resolve, reject) => {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.top = "0";
        textarea.style.right = "-9999px";
        textarea.style.opacity = "0";
        textarea.style.pointerEvents = "none";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);
        const ok = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (ok) {
          resolve();
        } else {
          reject(new Error("Copy failed: clipboard unavailable"));
        }
      } catch (e) {
        reject(e);
      }
    });
  }
  async function copyHtml(html) {
    const s = String(html ?? "");
    if (canWriteClipboard()) {
      const plain = htmlToText(s);
      await writeClipboard({
        "text/html": new Blob([s], { type: "text/html" }),
        "text/plain": new Blob([plain], { type: "text/plain" })
      });
      return;
    }
    return execCopyFromHtml(s);
  }
  async function copyNode(node) {
    if (canWriteClipboard()) {
      const { html: html2, text } = nodeToHtmlText(node);
      await writeClipboard({
        "text/html": new Blob([html2], { type: "text/html" }),
        "text/plain": new Blob([text], { type: "text/plain" })
      });
      return;
    }
    const { html } = nodeToHtmlText(node);
    return execCopyFromHtml(html);
  }
  async function copyImage(image) {
    const blob = await toImageBlob(image);
    if (!blob) throw new Error("Unsupported image source");
    if (canWriteClipboard()) {
      const type = blob.type || "image/png";
      await writeClipboard({ [type]: blob });
      return;
    }
    throw new Error("Clipboard image write not supported");
  }
  async function copyUrl(url) {
    const s = String(url ?? "");
    if (canWriteClipboard()) {
      await writeClipboard({
        "text/uri-list": new Blob([s], { type: "text/uri-list" }),
        "text/plain": new Blob([s], { type: "text/plain" })
      });
      return;
    }
    await copyText(s);
  }
  async function copyBlob(blob) {
    if (canWriteClipboard()) {
      const type = blob.type || "application/octet-stream";
      await writeClipboard({ [type]: blob });
      return;
    }
    throw new Error("Clipboard blob write not supported");
  }
  async function copyRtf(rtf) {
    const s = String(rtf ?? "");
    if (canWriteClipboard()) {
      const plain = s.replace(/\\par[\s]?/g, "\n").replace(/\{[^}]*\}/g, "").replace(/\\[a-zA-Z]+[0-9'-]*/g, "").replace(/\r?\n/g, "\n").trim();
      await writeClipboard({
        "text/rtf": new Blob([s], { type: "text/rtf" }),
        "text/plain": new Blob([plain], { type: "text/plain" })
      });
      return;
    }
    await copyText(s);
  }
  async function copyTable(rows) {
    const data = Array.isArray(rows) ? rows : [];
    const escapeHtml = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    const html = (() => {
      const trs = data.map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(String(c))}</td>`).join("")}</tr>`).join("");
      return `<table>${trs}</table>`;
    })();
    const tsv = data.map((r) => r.map((c) => String(c)).join("	")).join("\n");
    const csv = data.map(
      (r) => r.map((c) => {
        const s = String(c);
        const needQuote = /[",\n]/.test(s);
        const escaped = s.replace(/"/g, '""');
        return needQuote ? `"${escaped}"` : escaped;
      }).join(",")
    ).join("\n");
    if (canWriteClipboard()) {
      await writeClipboard({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/tab-separated-values": new Blob([tsv], { type: "text/tab-separated-values" }),
        "text/csv": new Blob([csv], { type: "text/csv" }),
        "text/plain": new Blob([tsv], { type: "text/plain" })
      });
      return;
    }
    await copyText(tsv);
  }
  async function toImageBlob(image) {
    if (image instanceof Blob) return image;
    if (image instanceof HTMLCanvasElement)
      return await new Promise((resolve, reject) => {
        image.toBlob(
          (b) => b ? resolve(b) : reject(new Error("Canvas toBlob failed")),
          "image/png"
        );
      });
    const isBitmap = typeof ImageBitmap !== "undefined" && image instanceof ImageBitmap;
    if (isBitmap) {
      const cnv = document.createElement("canvas");
      cnv.width = image.width;
      cnv.height = image.height;
      const ctx = cnv.getContext("2d");
      ctx?.drawImage(image, 0, 0);
      return await new Promise((resolve, reject) => {
        cnv.toBlob((b) => b ? resolve(b) : reject(new Error("Canvas toBlob failed")), "image/png");
      });
    }
    return null;
  }
  function canWriteClipboard() {
    return !!(navigator.clipboard && typeof navigator.clipboard.write === "function" && typeof ClipboardItem !== "undefined");
  }
  async function writeClipboard(items) {
    await navigator.clipboard.write([new ClipboardItem(items)]);
  }
  function htmlToText(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || "";
  }
  function nodeToHtmlText(node) {
    const container = document.createElement("div");
    container.appendChild(node.cloneNode(true));
    const html = node instanceof Element ? node.outerHTML ?? container.innerHTML : container.innerHTML;
    const text = container.textContent || "";
    return { html, text };
  }
  function execCopyFromHtml(html) {
    return new Promise((resolve, reject) => {
      try {
        const div = document.createElement("div");
        div.contentEditable = "true";
        div.style.position = "fixed";
        div.style.top = "0";
        div.style.right = "-9999px";
        div.style.opacity = "0";
        div.style.pointerEvents = "none";
        div.innerHTML = html;
        document.body.appendChild(div);
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(div);
        selection?.removeAllRanges();
        selection?.addRange(range);
        const ok = document.execCommand("copy");
        document.body.removeChild(div);
        selection?.removeAllRanges();
        if (ok) {
          resolve();
        } else {
          reject(new Error("Copy failed: clipboard unavailable"));
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  // src/web/cookie/index.ts
  function setCookie(name, value, days) {
    const date = /* @__PURE__ */ new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1e3);
    const expires = `expires=${date.toUTCString()}; path=/`;
    document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}`;
  }
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const v = parts.pop()?.split(";").shift();
      return v ? decodeURIComponent(v) : null;
    }
    return null;
  }
  function removeCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }

  // src/web/load/index.ts
  async function download(url, fileName = "") {
    if (!url) return;
    let blobUrl = "";
    let needRevoke = false;
    try {
      if (url instanceof Blob) {
        blobUrl = URL.createObjectURL(url);
        needRevoke = true;
      } else if (url.includes(";base64,")) {
        blobUrl = url;
      } else {
        if (fileName) {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`fetch error ${res.status}\uFF1A${url}`);
          const blob = await res.blob();
          blobUrl = URL.createObjectURL(blob);
          needRevoke = true;
        } else {
          blobUrl = url;
        }
      }
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      if (needRevoke) {
        setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
      }
    }
  }
  async function parseAxiosBlob(res) {
    const { data, headers, status, statusText, config } = res;
    if (status < 200 || status >= 300) throw new Error(`${status}\uFF0C${statusText}\uFF1A${config.url}`);
    if (data.type.includes("application/json")) {
      const txt = await data.text();
      throw JSON.parse(txt);
    }
    const fileName = getDispositionFileName(headers["content-disposition"]);
    return { blob: data, fileName };
  }
  function getDispositionFileName(disposition) {
    if (!disposition) return "";
    const rfc5987 = /filename\*\s*=\s*([^']*)''([^;]*)/i.exec(disposition);
    if (rfc5987?.[2]) {
      try {
        return decodeURIComponent(rfc5987[2].trim()).replace(/[\r\n]+/g, "");
      } catch {
        return rfc5987[2].trim().replace(/[\r\n]+/g, "");
      }
    }
    const old = /filename\s*=\s*(?:"([^"]*)"|([^";]*))(?=;|$)/i.exec(disposition);
    if (old) return (old[1] ?? old[2]).trim().replace(/[\r\n]+/g, "");
    return "";
  }
  async function loadJs(src, attrs) {
    return new Promise((resolve, reject) => {
      if (hasJs(src)) return resolve();
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = src;
      if (attrs) {
        const keys = Object.keys(attrs);
        keys.forEach((key) => {
          const v = attrs[key];
          if (v === null || v === void 0 || v === false) return;
          script.setAttribute(key, typeof v === "boolean" ? "" : v);
        });
      }
      script.onload = () => resolve();
      script.onerror = (e) => reject(e);
      document.head.appendChild(script);
    });
  }
  function hasJs(src) {
    const target = new URL(src, document.baseURI).href;
    const jsList = Array.from(document.querySelectorAll("script[src]"));
    return jsList.some((e) => {
      const src2 = e.getAttribute("src");
      return src2 && new URL(src2, document.baseURI).href === target;
    });
  }
  async function loadCss(href, attrs) {
    return new Promise((resolve, reject) => {
      if (hasCss(href)) return resolve();
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      if (attrs) {
        const keys = Object.keys(attrs);
        keys.forEach((key) => {
          const v = attrs[key];
          if (v === null || v === void 0) return;
          link.setAttribute(key, String(v));
        });
      }
      link.onload = () => resolve();
      link.onerror = (e) => reject(e);
      document.head.appendChild(link);
    });
  }
  function hasCss(href) {
    const target = new URL(href, document.baseURI).href;
    const list = Array.from(document.querySelectorAll('link[rel="stylesheet"][href]'));
    return list.some((e) => {
      const h = e.getAttribute("href");
      return h && new URL(h, document.baseURI).href === target;
    });
  }
  function preloadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = src;
    });
  }

  // src/web/storage/index.ts
  var WK = {
    val: "__l_val",
    exp: "__l_exp",
    wrap: "__l_wrap"
  };
  function setLocalStorage(key, value, days) {
    if (value === void 0 || value === null) {
      removeLocalStorage(key);
      return;
    }
    let toStore = value;
    if (typeof days === "number" && days > 0) {
      const ms = days * 24 * 60 * 60 * 1e3;
      toStore = {
        [WK.wrap]: true,
        [WK.val]: value,
        [WK.exp]: Date.now() + ms
      };
    }
    localStorage.setItem(key, JSON.stringify(toStore));
  }
  function getLocalStorage(key) {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && WK.wrap in parsed && WK.exp in parsed) {
        if (Date.now() > parsed[WK.exp]) {
          removeLocalStorage(key);
          return null;
        }
        return parsed[WK.val];
      }
      return parsed;
    } catch {
      return raw;
    }
  }
  function removeLocalStorage(key) {
    localStorage.removeItem(key);
  }

  // src/web/dom/index.ts
  function getWindowWidth() {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  }
  function getWindowHeight() {
    return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  }
  function getWindowScrollTop() {
    const doc = document.documentElement;
    const body = document.body;
    return window.pageYOffset || doc.scrollTop || body.scrollTop || 0;
  }
  function getWindowScrollLeft() {
    const doc = document.documentElement;
    const body = document.body;
    return window.pageXOffset || doc.scrollLeft || body.scrollLeft || 0;
  }
  function windowScrollTo(top, behavior = "smooth") {
    if ("scrollBehavior" in document.documentElement.style) {
      window.scrollTo({ top, behavior });
    } else {
      window.scrollTo(0, top);
    }
  }
  function isInViewport(el, offset = 0) {
    const rect = el.getBoundingClientRect();
    const width = getWindowWidth();
    const height = getWindowHeight();
    return rect.bottom >= -offset && rect.right >= -offset && rect.top <= height + offset && rect.left <= width + offset;
  }
  function lockBodyScroll() {
    const body = document.body;
    if (body.dataset.scrollLock === "true") return;
    const y = Math.round(window.scrollY || window.pageYOffset || 0);
    body.dataset.scrollLock = "true";
    body.dataset.scrollLockY = String(y);
    body.style.position = "fixed";
    body.style.top = `-${y}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
  }
  function unlockBodyScroll() {
    const body = document.body;
    if (body.dataset.scrollLock !== "true") return;
    const y = Number(body.dataset.scrollLockY || 0);
    body.style.position = "";
    body.style.top = "";
    body.style.left = "";
    body.style.right = "";
    body.style.width = "";
    delete body.dataset.scrollLock;
    delete body.dataset.scrollLockY;
    window.scrollTo(0, y);
  }

  // src/web/device/index.ts
  function getUA() {
    if (typeof navigator === "undefined") return "";
    return (navigator.userAgent || "").toLowerCase();
  }
  function isMobile() {
    const ua = getUA();
    return /android|webos|iphone|ipod|blackberry|iemobile|opera mini|mobile/i.test(ua);
  }
  function isTablet() {
    const ua = getUA();
    return /ipad|android(?!.*mobile)|tablet/i.test(ua) && !/mobile/i.test(ua);
  }
  function isPC() {
    return !isMobile() && !isTablet();
  }
  function isIOS() {
    const ua = getUA();
    return /iphone|ipad|ipod/i.test(ua);
  }
  function isAndroid() {
    const ua = getUA();
    return /android/i.test(ua);
  }
  function isWeChat() {
    const ua = getUA();
    return /micromessenger/i.test(ua);
  }
  function isChrome() {
    const ua = getUA();
    return /chrome\//i.test(ua) && !/edg\//i.test(ua) && !/opr\//i.test(ua) && !/whale\//i.test(ua);
  }
  function isTouchSupported() {
    if (typeof window === "undefined") return false;
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }
  function getDevicePixelRatio() {
    if (typeof window === "undefined") return 1;
    return window.devicePixelRatio || 1;
  }
  function getBrowserName() {
    const ua = getUA();
    if (/chrome\//i.test(ua)) return "chrome";
    if (/safari\//i.test(ua)) return "safari";
    if (/firefox\//i.test(ua)) return "firefox";
    if (/opr\//i.test(ua)) return "opera";
    if (/edg\//i.test(ua)) return "edge";
    if (/msie|trident/i.test(ua)) return "ie";
    return null;
  }
  function getBrowserVersion() {
    const ua = getUA();
    const versionPatterns = [
      /(?:edg|edge)\/([0-9.]+)/i,
      /(?:opr|opera)\/([0-9.]+)/i,
      /chrome\/([0-9.]+)/i,
      /firefox\/([0-9.]+)/i,
      /version\/([0-9.]+).*safari/i,
      /(?:msie |rv:)([0-9.]+)/i
    ];
    for (const pattern of versionPatterns) {
      const matches = ua.match(pattern);
      if (matches && matches[1]) {
        return matches[1];
      }
    }
    return null;
  }
  function getOS() {
    const ua = getUA();
    if (/windows/i.test(ua)) return "windows";
    if (/mac os/i.test(ua)) return "macos";
    if (/linux/i.test(ua)) return "linux";
    if (/iphone|ipad|ipod/i.test(ua)) return "ios";
    if (/android/i.test(ua)) return "android";
    return "unknown";
  }
  return __toCommonJS(web_exports);
})();
