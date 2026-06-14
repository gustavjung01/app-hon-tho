(function () {
  var ACCOUNT_PATH = "/account";
  var PATCH_FLAG = "__honthoClerkPatched";
  var SYNC_FLAG = "__honthoSyncRunning";
  var CARD_ID = "hontho-account-system-card";
  var STYLE_ID = "hontho-account-stabilizer-style";

  function isSafePath(value) {
    return typeof value === "string" && value.indexOf("/") === 0 && value.indexOf("//") !== 0;
  }

  function readNextPath() {
    var params = new URLSearchParams(window.location.search);
    var next = params.get("next");
    return isSafePath(next) ? next : ACCOUNT_PATH;
  }

  function sameOriginUrl(path) {
    return window.location.origin + (isSafePath(path) ? path : ACCOUNT_PATH);
  }

  function accountUrl() {
    return sameOriginUrl(ACCOUNT_PATH);
  }

  function returnUrl() {
    return sameOriginUrl(readNextPath());
  }

  function normalizeAuthOptions(options) {
    var normalized = Object.assign({}, options || {});
    var target = returnUrl();
    normalized.afterSignInUrl = target;
    normalized.afterSignUpUrl = target;
    normalized.afterSignOutUrl = accountUrl();
    normalized.signInFallbackRedirectUrl = target;
    normalized.signUpFallbackRedirectUrl = target;
    normalized.signInForceRedirectUrl = target;
    normalized.signUpForceRedirectUrl = target;
    return normalized;
  }

  function normalizeUserButtonOptions(options) {
    return Object.assign({}, options || {}, { afterSignOutUrl: accountUrl() });
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = [
      ".account-system-card{margin-top:18px;border:1px solid var(--gold-soft);border-radius:16px;background:rgba(18,12,6,.64);padding:16px;text-align:left}",
      ".account-system-card h3{margin:0 0 10px;color:var(--gold);font-size:16px}",
      ".account-system-grid{display:grid;gap:8px;color:var(--muted);font-size:13px;line-height:1.5}",
      ".account-system-grid strong{color:var(--text);font-weight:700}",
      ".account-system-card .account-system-ok{color:var(--gold-bright)}",
      ".account-system-card .account-system-warn{color:#ffcf9d}",
      "@media (max-width:560px){.account-system-card{padding:14px}}"
    ].join("");
    document.head.appendChild(style);
  }

  function renderSystemCard(state) {
    if (window.location.pathname.replace(/\/$/, "") !== ACCOUNT_PATH) return;
    injectStyle();
    var panel = document.querySelector(".account-panel") || document.querySelector(".account-card");
    if (!panel) return;

    var card = document.getElementById(CARD_ID);
    if (!card) {
      card = document.createElement("div");
      card.id = CARD_ID;
      card.className = "account-system-card";
      panel.appendChild(card);
    }

    var user = state && state.user ? state.user : {};
    var balance = state && typeof state.balance === "number" ? state.balance : null;
    var ok = state && state.ok;
    var role = user.role || "user";
    var email = user.email || "Chưa có email trong DB";
    var clerkId = user.clerk_user_id || user.clerkUserId || "Đã có phiên Clerk";
    var balanceText = balance === null ? "Chưa tải" : String(balance);

    card.innerHTML = "" +
      "<h3>Đồng bộ tài khoản hệ thống</h3>" +
      "<div class=\"account-system-grid\">" +
      "<div><strong>Trạng thái:</strong> <span class=\"" + (ok ? "account-system-ok" : "account-system-warn") + "\">" + (ok ? "Đã nối Clerk với API" : "Đang kiểm tra API") + "</span></div>" +
      "<div><strong>Email DB:</strong> " + escapeHtml(email) + "</div>" +
      "<div><strong>Vai trò:</strong> " + escapeHtml(role) + "</div>" +
      "<div><strong>Tín dụng:</strong> " + escapeHtml(balanceText) + "</div>" +
      "<div><strong>Clerk ID:</strong> " + escapeHtml(String(clerkId)) + "</div>" +
      "</div>";
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, function (char) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;" })[char];
    });
  }

  async function fetchJson(url, token, init) {
    var response = await fetch(url, Object.assign({
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token
      }
    }, init || {}));
    if (!response.ok) throw new Error(url + " " + response.status);
    return response.json();
  }

  async function syncAccount(instance) {
    if (!instance || !instance.session || instance[SYNC_FLAG]) return;
    instance[SYNC_FLAG] = true;
    try {
      var token = await instance.session.getToken().catch(function () { return ""; });
      if (!token) return;

      await fetchJson("/api/auth/sync", token, { method: "POST" }).catch(function () { return null; });
      var me = await fetchJson("/api/auth/me", token).catch(function () { return null; });
      var credits = await fetchJson("/credits/balance", token).catch(function () { return null; });
      renderSystemCard({
        ok: Boolean(me && me.user),
        user: me && me.user ? me.user : {},
        balance: credits && typeof credits.balance === "number" ? credits.balance : null
      });
    } catch (error) {
      renderSystemCard({ ok: false, user: {}, balance: null });
      console.warn("Không đồng bộ được tài khoản Cổ Học", error);
    } finally {
      instance[SYNC_FLAG] = false;
    }
  }

  function patchInstance(instance) {
    if (!instance || instance[PATCH_FLAG]) return instance;
    Object.defineProperty(instance, PATCH_FLAG, { value: true, configurable: true });

    if (typeof instance.mountSignIn === "function") {
      var originalMountSignIn = instance.mountSignIn.bind(instance);
      instance.mountSignIn = function (element, options) {
        return originalMountSignIn(element, normalizeAuthOptions(options));
      };
    }

    if (typeof instance.mountSignUp === "function") {
      var originalMountSignUp = instance.mountSignUp.bind(instance);
      instance.mountSignUp = function (element, options) {
        return originalMountSignUp(element, normalizeAuthOptions(options));
      };
    }

    if (typeof instance.mountUserButton === "function") {
      var originalMountUserButton = instance.mountUserButton.bind(instance);
      instance.mountUserButton = function (element, options) {
        setTimeout(function () { syncAccount(instance); }, 80);
        return originalMountUserButton(element, normalizeUserButtonOptions(options));
      };
    }

    if (typeof instance.openSignIn === "function") {
      var originalOpenSignIn = instance.openSignIn.bind(instance);
      instance.openSignIn = function (options) {
        return originalOpenSignIn(normalizeAuthOptions(options));
      };
    }

    if (typeof instance.openSignUp === "function") {
      var originalOpenSignUp = instance.openSignUp.bind(instance);
      instance.openSignUp = function (options) {
        return originalOpenSignUp(normalizeAuthOptions(options));
      };
    }

    if (typeof instance.addListener === "function") {
      try {
        instance.addListener(function () {
          setTimeout(function () { syncAccount(instance); }, 80);
        });
      } catch (error) {
        console.warn("Không gắn được listener Clerk Cổ Học", error);
      }
    }

    setTimeout(function () { syncAccount(instance); }, 120);
    return instance;
  }

  function wrapClerkValue(value) {
    if (!value) return value;
    if (typeof value === "function") {
      var OriginalClerk = value;
      if (OriginalClerk[PATCH_FLAG]) return OriginalClerk;
      var WrappedClerk = function () {
        var instance = new (Function.prototype.bind.apply(OriginalClerk, [null].concat(Array.prototype.slice.call(arguments))))();
        return patchInstance(instance);
      };
      try { Object.setPrototypeOf(WrappedClerk, OriginalClerk); } catch (error) { /* noop */ }
      try { Object.assign(WrappedClerk, OriginalClerk); } catch (error) { /* noop */ }
      Object.defineProperty(WrappedClerk, PATCH_FLAG, { value: true, configurable: true });
      return WrappedClerk;
    }
    return patchInstance(value);
  }

  var storedClerk = window.Clerk ? wrapClerkValue(window.Clerk) : undefined;
  try {
    Object.defineProperty(window, "Clerk", {
      configurable: true,
      get: function () { return storedClerk; },
      set: function (value) { storedClerk = wrapClerkValue(value); }
    });
  } catch (error) {
    window.Clerk = storedClerk;
  }
})();
