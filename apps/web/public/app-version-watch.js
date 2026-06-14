(function(){
  var KEY = "cohoc_app_version";
  var busy = false;

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

  window.addEventListener("pageshow", check);
  window.addEventListener("focus", check);
  document.addEventListener("visibilitychange", checkVisible);
  setInterval(checkVisible, 60000);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", check, { once: true });
  } else {
    check();
  }
})();
