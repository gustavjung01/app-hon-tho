(function () {
  var ACCOUNT_PATH = "/account";
  var PATCH_FLAG = "__honthoClerkPatched";
  var SYNC_FLAG = "__honthoSyncRunning";
  var CARD_ID = "hontho-account-system-card";
  var STYLE_ID = "hontho-auth-bridge-style";
  var TOKEN_KEY = "hontho_user_token";
  var API_BASE_KEY = "hontho_api_base";
  var PROFILE_KEY = "hontho_user_profile";
  var CLERK_ID_KEY = "hontho_user_clerk_id";
  var LEGACY_CLERK_ID_KEY = "user-clerk-id";

  var storedClerk = window.Clerk;
  var clerkPromise = null;
  var cfgPromise = null;
  var syncState = { ok: false, status: "idle", user: null, balance: null, token: "" };
  var listeners = [];

  function isSafePath(value) {
    return typeof value === "string" && value.indexOf("/") === 0 && value.indexOf("//") !== 0;
  }

  function readNextPath(fallback) {
    var params = new URLSearchParams(window.location.search);
    var next = params.get("next");
    return isSafePath(next) ? next : (fallback || ACCOUNT_PATH);
  }

  function sameOriginUrl(path) {
    return window.location.origin + (isSafePath(path) ? path : ACCOUNT_PATH);
  }

  function accountUrl(next) {
    return sameOriginUrl(ACCOUNT_PATH + (next && isSafePath(next) && next !== ACCOUNT_PATH ? "?next=" + encodeURIComponent(next) : ""));
  }

  function currentReturnUrl(options) {
    var next = options && options.nextPath ? options.nextPath : readNextPath(ACCOUNT_PATH);
    return sameOriginUrl(next);
  }

  function normalizeAuthOptions(options) {
    var normalized = Object.assign({}, options || {});
    var target = currentReturnUrl(normalized);
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

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>'"]/g, function (char) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;" })[char];
    });
  }

  function setState(next) {
    syncState = Object.assign({}, syncState, next || {});
    listeners.slice().forEach(function (listener) {
      try { listener(Object.assign({}, syncState)); } catch (error) { console.warn("HonThoAuth listener error", error); }
    });
    renderSystemCard(syncState);
  }

  function persistToken(token) {
    if (!token) return;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(API_BASE_KEY, "/api");
    setState({ token: token });
  }

  function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    setState({ token: "" });
  }

  function persistUser(user, clerkUser) {
    var clerkId = user && (user.clerk_user_id || user.clerkUserId) || clerkUser && clerkUser.id || "";
    if (clerkId) {
      localStorage.setItem(CLERK_ID_KEY, String(clerkId));
      localStorage.setItem(LEGACY_CLERK_ID_KEY, String(clerkId));
    }
    var profile = {
      clerkUserId: clerkId,
      name: user && user.name || readClerkName(clerkUser),
      email: user && user.email || readClerkEmail(clerkUser),
      imageUrl: clerkUser && clerkUser.imageUrl || undefined
    };
    if (profile.clerkUserId || profile.email) localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }

  function readClerkEmail(user) {
    var primaryId = user && user.primaryEmailAddressId;
    var emails = Array.isArray(user && user.emailAddresses) ? user.emailAddresses : [];
    var primary = emails.find(function (item) { return item && item.id === primaryId; }) || emails[0];
    return String(primary && primary.emailAddress || user && user.primaryEmailAddress && user.primaryEmailAddress.emailAddress || "");
  }

  function readClerkName(user) {
    var firstName = String(user && user.firstName || "").trim();
    var lastName = String(user && user.lastName || "").trim();
    var fullName = String(user && user.fullName || "").trim();
    return fullName || [firstName, lastName].filter(Boolean).join(" ") || "Tài khoản Cổ Học";
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
    var ok = Boolean(state && state.ok);
    var role = user.role || "user";
    var email = user.email || readClerkEmail(storedClerk && storedClerk.user) || "Chưa có email trong DB";
    var clerkId = user.clerk_user_id || user.clerkUserId || storedClerk && storedClerk.user && storedClerk.user.id || "Chưa rõ";
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

  function loadScript(src, attrs) {
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[src="' + src + '"]');
      if (existing) {
        if (existing.dataset.loaded === "true") return resolve();
        existing.addEventListener("load", function () { resolve(); }, { once: true });
        existing.addEventListener("error", function () { reject(new Error("Không tải được " + src)); }, { once: true });
        return;
      }
      var script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.crossOrigin = "anonymous";
      Object.entries(attrs || {}).forEach(function (entry) { script.setAttribute(entry[0], entry[1]); });
      script.onload = function () { script.dataset.loaded = "true"; resolve(); };
      script.onerror = function () { reject(new Error("Không tải được " + src)); };
      document.head.appendChild(script);
    });
  }

  function decodePublishableKeyDomain(key) {
    var encoded = String(key || "").replace(/^pk_(test|live)_/, "").trim();
    if (!encoded) throw new Error("Thiếu Clerk publishable key.");
    var base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    var padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    return atob(padded).replace(/\$$/, "");
  }

  async function readPublicConfig() {
    if (!cfgPromise) {
      cfgPromise = fetch("/api/admin/public-config").then(function (res) { return res.json(); });
    }
    return cfgPromise;
  }

  async function ensureClerk() {
    if (storedClerk && (storedClerk.session || storedClerk.user || storedClerk.openSignIn)) return patchInstance(storedClerk);
    if (clerkPromise) return clerkPromise;

    clerkPromise = (async function () {
      var cfg = await readPublicConfig();
      var publishableKey = String(cfg && cfg.clerkPublishableKey || "");
      if (!publishableKey) throw new Error("Chưa có cấu hình đăng nhập Clerk.");
      var domain = decodePublishableKeyDomain(publishableKey);

      await loadScript("https://" + domain + "/npm/@clerk/ui@1/dist/ui.browser.js");
      await loadScript("https://" + domain + "/npm/@clerk/clerk-js@6/dist/clerk.browser.js", {
        "data-clerk-publishable-key": publishableKey
      });

      var globalClerk = storedClerk || window.Clerk;
      var instance = globalClerk;
      if (typeof globalClerk === "function") {
        instance = new globalClerk(publishableKey);
        await instance.load();
      } else if (globalClerk && typeof globalClerk.load === "function") {
        await globalClerk.load({ publishableKey: publishableKey, ui: { ClerkUI: window.__internal_ClerkUICtor } });
      } else {
        throw new Error("Clerk script đã tải nhưng không khởi tạo được.");
      }
      storedClerk = patchInstance(instance);
      setTimeout(function () { syncAccount(storedClerk); }, 60);
      return storedClerk;
    })();

    return clerkPromise;
  }

  async function fetchJson(url, token, init) {
    var baseHeaders = {
      Accept: "application/json",
      Authorization: "Bearer " + token
    };
    if (init && init.method && init.method !== "GET") baseHeaders["Content-Type"] = "application/json";
    var response = await fetch(url, Object.assign({}, init || {}, { headers: Object.assign(baseHeaders, init && init.headers || {}) }));
    if (!response.ok) throw new Error(url + " " + response.status);
    return response.json();
  }

  async function getToken(options) {
    var opts = options || {};
    try {
      var clerk = await ensureClerk();
      var token = await (clerk && clerk.session && clerk.session.getToken ? clerk.session.getToken({ skipCache: Boolean(opts.force) }) : Promise.resolve(""));
      if (token) {
        persistToken(token);
        return token;
      }
    } catch (error) {
      if (!opts.allowCached) throw error;
    }
    var cached = localStorage.getItem(TOKEN_KEY) || "";
    return opts.allowCached ? cached.trim() : "";
  }

  async function requireToken(options) {
    var token = await getToken(Object.assign({ force: true, allowCached: true }, options || {}));
    if (!token) throw new Error("Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại.");
    return token;
  }

  async function syncAccount(instance) {
    var clerk = instance || storedClerk;
    if (!clerk || !clerk.session || clerk[SYNC_FLAG]) return syncState;
    clerk[SYNC_FLAG] = true;
    setState({ status: "syncing" });
    try {
      var token = await getToken({ force: false, allowCached: false });
      if (!token) return syncState;
      await fetchJson("/api/auth/sync", token, { method: "POST" }).catch(function () { return null; });
      var me = await fetchJson("/api/auth/me", token).catch(function () { return null; });
      var credits = await fetchJson("/credits/balance", token).catch(function () { return null; });
      var user = me && me.user ? me.user : null;
      persistUser(user || {}, clerk.user);
      setState({
        ok: Boolean(user),
        status: user ? "ready" : "partial",
        user: user,
        balance: credits && typeof credits.balance === "number" ? credits.balance : null,
        token: token
      });
    } catch (error) {
      setState({ ok: false, status: "error" });
      console.warn("Không đồng bộ được tài khoản Cổ Học", error);
    } finally {
      clerk[SYNC_FLAG] = false;
    }
    return syncState;
  }

  async function signIn(options) {
    var opts = normalizeAuthOptions(options || {});
    try {
      var clerk = await ensureClerk();
      if (clerk && typeof clerk.openSignIn === "function") return clerk.openSignIn(opts);
    } catch (error) {
      console.warn("Không mở được Clerk SignIn", error);
    }
    window.location.href = accountUrl(options && options.nextPath ? options.nextPath : window.location.pathname);
  }

  async function signOut() {
    try {
      var clerk = await ensureClerk();
      if (clerk && typeof clerk.signOut === "function") await clerk.signOut();
    } finally {
      clearToken();
      localStorage.removeItem(PROFILE_KEY);
      localStorage.removeItem(CLERK_ID_KEY);
      localStorage.removeItem(LEGACY_CLERK_ID_KEY);
      window.location.href = accountUrl();
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

  try {
    Object.defineProperty(window, "Clerk", {
      configurable: true,
      get: function () { return storedClerk; },
      set: function (value) { storedClerk = wrapClerkValue(value); }
    });
  } catch (error) {
    window.Clerk = wrapClerkValue(storedClerk);
  }

  storedClerk = wrapClerkValue(storedClerk);

  window.HonThoAuth = {
    ensureClerk: ensureClerk,
    getToken: getToken,
    requireToken: requireToken,
    sync: function () { return ensureClerk().then(function (clerk) { return syncAccount(clerk); }); },
    signIn: signIn,
    signOut: signOut,
    clearToken: clearToken,
    getState: function () { return Object.assign({}, syncState); },
    subscribe: function (listener) {
      if (typeof listener !== "function") return function () {};
      listeners.push(listener);
      return function () { listeners = listeners.filter(function (item) { return item !== listener; }); };
    }
  };

  setTimeout(function () {
    if (storedClerk && (storedClerk.session || storedClerk.user)) syncAccount(storedClerk);
  }, 100);
})();
