(function(){
  var KEY = "cohoc_app_version";
  var busy = false;
  var OLD_PHONG_THUY = "/nguthuat/son/phongthu";
  var CANONICAL_PHONG_THUY = "/nguthuat/son/phongthuy";
  var PHONG_THUY_ENTRY = "/nguthuat/son/phongthuy/index.html";

  function normalizePhongThuyHref(href){
    return href === OLD_PHONG_THUY || href === OLD_PHONG_THUY + "/" || href === CANONICAL_PHONG_THUY || href === CANONICAL_PHONG_THUY + "/";
  }

  function normalizePhongThuyLinks(){
    document.querySelectorAll("a[href]").forEach(function(link){
      if (normalizePhongThuyHref(link.getAttribute("href"))) {
        link.setAttribute("href", PHONG_THUY_ENTRY);
      }
    });
  }

  function installPhongThuyRouteGuard(){
    if (normalizePhongThuyHref(window.location.pathname)) {
      window.location.replace(PHONG_THUY_ENTRY + window.location.search + window.location.hash);
      return;
    }

    document.addEventListener("click", function(event){
      var target = event.target && event.target.closest ? event.target.closest("a[href]") : null;
      if (!target || !normalizePhongThuyHref(target.getAttribute("href"))) return;
      event.preventDefault();
      window.location.assign(PHONG_THUY_ENTRY);
    }, true);

    normalizePhongThuyLinks();
    try {
      new MutationObserver(normalizePhongThuyLinks).observe(document.documentElement, { childList: true, subtree: true });
    } catch {}
  }

  function swUpdate(){
    if (!("serviceWorker" in navigator)) return Promise.resolve();
    return navigator.serviceWorker.getRegistration("/").then(function(reg){
      if (reg && reg.update) return reg.update();
    }).catch(function(){});
  }

  function check(){
    if (busy) return;
    busy = true;
    fetch("/app-version.json?t=" + Date.now(), { cache: "no-store", headers: { Accept: "application/json" } })
      .then(function(res){ return res.ok ? res.json() : null; })
      .then(function(data){
        var next = data && String(data.version || data.builtAt || "");
        if (!next) return;
        var current = localStorage.getItem(KEY);
        if (!current) {
          localStorage.setItem(KEY, next);
          return;
        }
        if (current !== next) {
          localStorage.setItem(KEY, next);
          return swUpdate().then(function(){ window.location.reload(); });
        }
      })
      .catch(function(){})
      .finally(function(){ busy = false; });
  }

  function checkVisible(){
    if (document.visibilityState === "visible") check();
  }

  installPhongThuyRouteGuard();
  window.addEventListener("pageshow", check);
  window.addEventListener("focus", check);
  document.addEventListener("visibilitychange", checkVisible);
  setInterval(checkVisible, 60000);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function(){ normalizePhongThuyLinks(); check(); }, { once: true });
  } else {
    normalizePhongThuyLinks();
    check();
  }
})();
