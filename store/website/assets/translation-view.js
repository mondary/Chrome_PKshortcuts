window.PK_TRANSLATION_TEMPLATE = function(isDark) {
  const bg = isDark ? "#1c1c1c" : "#ffffff";
  const text = isDark ? "#f4f4f5" : "#18181b";
  const border = isDark ? "#333" : "#e4e4e7";
  const mute = isDark ? "#a1a1aa" : "#71717a";
  const accent = isDark ? "#f5a623" : "#d97706";
  const accentSoft = isDark ? "rgba(245,166,35,0.15)" : "rgba(217,119,6,0.12)";
  const dangerSoft = isDark ? "rgba(239,68,68,0.18)" : "rgba(220,38,38,0.12)";
  const danger = "#ef4444";
  return `
    <style>
      * { box-sizing: border-box; }
      .pk-popup {
        position: fixed;
        background: ${bg};
        color: ${text};
        border: 1px solid ${border};
        border-radius: 10px;
        padding: 10px 12px;
        max-width: 340px;
        min-width: 180px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 13px;
        line-height: 1.45;
        box-shadow: 0 8px 28px rgba(0,0,0,0.32);
        pointer-events: auto;
        opacity: 0;
        transform: translateY(4px);
        transition: opacity 0.15s ease, transform 0.15s ease;
      }
      .pk-popup.visible { opacity: 1; transform: translateY(0); }
      .pk-head {
        display: flex; align-items: center; justify-content: space-between;
        gap: 8px; margin-bottom: 6px;
      }
      .pk-lang {
        font-size: 10px; font-weight: 600; letter-spacing: 0.04em;
        color: ${accent}; background: ${accentSoft};
        padding: 2px 8px; border-radius: 10px; text-transform: uppercase;
      }
      .pk-close {
        background: transparent; border: 0; color: ${mute};
        cursor: pointer; font-size: 16px; line-height: 1; padding: 0 4px;
        border-radius: 4px;
      }
      .pk-close:hover { color: ${text}; background: ${border}; }
      .pk-text { white-space: pre-wrap; word-wrap: break-word; }
      .pk-loading { color: ${mute}; font-style: italic; }
      .pk-error { color: ${danger}; background: ${dangerSoft}; padding: 8px 10px; border-radius: 6px; }
      .pk-footer {
        font-size: 10px; color: ${mute}; margin-top: 6px;
        display: flex; justify-content: space-between; gap: 6px;
      }
      .pk-truncated { color: ${danger}; font-weight: 600; }
    </style>
    <div class="pk-popup" hidden>
      <div class="pk-head">
        <span class="pk-lang">…</span>
        <button class="pk-close" aria-label="Close">×</button>
      </div>
      <div class="pk-text pk-loading">Traduction…</div>
      <div class="pk-footer"><span class="pk-source"></span><span class="pk-truncated" hidden>tronqué</span></div>
    </div>
  `;
};
