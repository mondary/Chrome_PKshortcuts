// Shared translation logic for PK Chrome Shortcuts.
// Loaded by background.js via importScripts.

const TRANSLATE_MAX_CHARS = 1500;

const LANG_DISPLAY = {
  auto: "Auto",
  fr: "Français",
  en: "English",
  es: "Español",
  de: "Deutsch",
  it: "Italiano",
  pt: "Português",
  nl: "Nederlands",
  pl: "Polski",
  ru: "Русский",
  "zh-CN": "中文",
  ja: "日本語",
  ar: "العربية",
  ko: "한국어"
};

const Translator = {
  maxChars: TRANSLATE_MAX_CHARS,
  langDisplay: LANG_DISPLAY,

  resolveTarget(code) {
    if (!code || code === "auto") {
      const browser = (typeof navigator !== "undefined" && navigator.language) || "en";
      return browser.split("-")[0] || "en";
    }
    return code;
  },

  normalizeLang(code) {
    return String(code || "").trim().toLowerCase().replace(/_/g, "-");
  },

  sameLanguage(a, b) {
    const left = this.normalizeLang(a);
    const right = this.normalizeLang(b);
    if (!left || !right) return false;
    if (left === right) return true;
    const [baseLeft, regionLeft] = left.split("-");
    const [baseRight, regionRight] = right.split("-");
    if (baseLeft !== baseRight) return false;
    // Same base: only skip when regions don't conflict (zh-CN vs zh-TW must translate).
    if (regionLeft && regionRight) return regionLeft === regionRight;
    return true;
  },

  async detect(text) {
    const sample = String(text || "").trim().slice(0, 600);
    if (!sample) return null;
    const api = globalThis.chrome?.i18n?.detectLanguage;
    if (typeof api !== "function") return null;
    const result = await new Promise((resolve) => {
      let settled = false;
      const done = (value) => {
        if (settled) return;
        settled = true;
        resolve(value || null);
      };
      try {
        const maybePromise = api.call(chrome.i18n, sample, done);
        if (maybePromise && typeof maybePromise.then === "function") {
          maybePromise.then(done, () => done(null));
        }
      } catch {
        done(null);
      }
    });
    const top = result?.languages?.[0];
    if (!top?.language) return null;
    return {
      language: top.language,
      reliable: !!result.isReliable,
      percentage: Number(top.percentage) || 0
    };
  },

  async translate(text, targetCode, apiMode) {
    const target = this.resolveTarget(targetCode);
    const trimmed = String(text || "").trim();
    if (!trimmed) {
      return { text: "", detected: "", source: "none" };
    }
    const detection = await this.detect(trimmed);
    if (
      detection &&
      this.sameLanguage(detection.language, target) &&
      (detection.reliable || detection.percentage >= 60)
    ) {
      return {
        text: "",
        detected: detection.language,
        source: "none",
        sameLanguage: true
      };
    }
    if (trimmed.length > TRANSLATE_MAX_CHARS) {
      const truncated = trimmed.slice(0, TRANSLATE_MAX_CHARS);
      const result = await this._callApi(truncated, target, apiMode);
      return { ...result, truncated: true };
    }
    return this._callApi(trimmed, target, apiMode);
  },

  async _callApi(text, target, apiMode) {
    if (apiMode === "mymemory_only") {
      return this._mymemory(text, target);
    }
    try {
      return await this._google(text, target);
    } catch (err) {
      console.warn("[Translator] Google failed, falling back to MyMemory:", err);
      return this._mymemory(text, target);
    }
  },

  async _google(text, target) {
    const url =
      "https://translate.google.com/translate_a/single?client=gtx" +
      `&sl=auto&tl=${encodeURIComponent(target)}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) throw new Error(`Google HTTP ${res.status}`);
    const data = await res.json();
    const chunks = Array.isArray(data?.[0]) ? data[0] : [];
    const translated = chunks.map((chunk) => (typeof chunk?.[0] === "string" ? chunk[0] : "")).join("");
    if (!translated) throw new Error("Empty Google response");
    const detected = data?.[2] || "unknown";
    return { text: translated, detected, source: "Google" };
  },

  async _mymemory(text, target) {
    const source = "Autodetect";
    const url =
      "https://api.mymemory.translated.net/get?q=" +
      encodeURIComponent(text) +
      `&langpair=${encodeURIComponent(source)}|${encodeURIComponent(target)}`;
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) throw new Error(`MyMemory HTTP ${res.status}`);
    const data = await res.json();
    const translated = data?.responseData?.translatedText;
    if (!translated) throw new Error("Empty MyMemory response");
    const detected = data?.responseData?.detectedLanguage || "unknown";
    return { text: translated, detected, source: "MyMemory" };
  }
};

if (typeof globalThis !== "undefined") {
  globalThis.Translator = Translator;
  globalThis.LANG_DISPLAY = LANG_DISPLAY;
}
