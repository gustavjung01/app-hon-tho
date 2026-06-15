(function(){
  var ACCOUNT_RE = /^\/account\/?(?:[?#].*)?$/;
  var BUSY_ATTR = "data-hontho-auth-busy";

  function isModifiedClick(event){
    return event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  }

  function isAccountHref(href){
    if (!href) return false;
    try {
      var url = new URL(href, window.location.origin);
      return url.origin === window.location.origin && ACCOUNT_RE.test(url.pathname + url.search + url.hash);
    } catch (_) {
      return href === "/account" || href === "/account/";
    }
  }

  function nextPathFromHref(href){
    try {
      var url = new URL(href, window.location.origin);
      var next = url.searchParams.get("next");
      if (next && next.indexOf("/") === 0 && next.indexOf("//") !== 0) return next;
    } catch (_) {}
    var current = window.location.pathname + window.location.search + window.location.hash;
    return current && current !== "/account" && current !== "/account/" ? current : "/";
  }

  function hasSessionSignal(){
    try {
      if (window.Clerk && (window.Clerk.session || window.Clerk.user)) return true;
      if (window.HonThoAuth && window.HonThoAuth.getState) {
        var state = window.HonThoAuth.getState();
        if (state && (state.ok || state.token || state.user)) return true;
      }
      if (localStorage.getItem("hontho_user_profile") || localStorage.getItem("hontho_user_clerk_id") || localStorage.getItem("user-clerk-id")) return true;
    } catch (_) {}
    return false;
  }

  async function openLogin(nextPath, source){
    if (document.documentElement.getAttribute(BUSY_ATTR) === "1") return;
    document.documentElement.setAttribute(BUSY_ATTR, "1");
    try {
      if (window.HonThoAuth && typeof window.HonThoAuth.signIn === "function") {
        await window.HonThoAuth.signIn({ nextPath: nextPath });
        return;
      }
    } catch (error) {
      console.warn("Không mở được đăng nhập tại chỗ", error);
    } finally {
      setTimeout(function(){ document.documentElement.removeAttribute(BUSY_ATTR); }, 1200);
    }
    window.location.href = "/account?next=" + encodeURIComponent(nextPath || "/");
  }

  function installAccountLinkHandler(){
    document.addEventListener("click", function(event){
      if (isModifiedClick(event)) return;
      var target = event.target && event.target.closest ? event.target.closest("a[href]") : null;
      if (!target || !isAccountHref(target.getAttribute("href"))) return;
      if (window.location.pathname.replace(/\/$/, "") === "/account") return;
      if (hasSessionSignal()) return;
      event.preventDefault();
      openLogin(nextPathFromHref(target.getAttribute("href")), "account-link");
    }, true);
  }

  function installExplicitLoginHandler(){
    document.addEventListener("click", function(event){
      var target = event.target && event.target.closest ? event.target.closest("[data-hontho-login]") : null;
      if (!target) return;
      event.preventDefault();
      openLogin(target.getAttribute("data-next") || window.location.pathname || "/", "explicit");
    }, true);
  }

  installAccountLinkHandler();
  installExplicitLoginHandler();
  window.HonThoLogin = { open: openLogin };
})();
