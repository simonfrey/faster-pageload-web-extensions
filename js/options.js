var preloadViewportElement = document.getElementById("preloadViewport");
var imgLazyLoadElement = document.getElementById("imgLazyLoad");
var blacklistSitesElement = document.getElementById("blacklistSites");

function saveOptions(e) {
    e.preventDefault();
    browser.storage.sync.set({
        preloadViewport: preloadViewportElement.checked,
        imgLazyLoad: imgLazyLoadElement.checked,
        blacklistSites: blacklistSitesElement.value.replace(/\s+/g, '').toLowerCase(),
    });

    browser.runtime.reload();
}

function restoreOptions() {
    function setPreloadViewport(result) {
        preloadViewportElement.checked = result.preloadViewport || false;     
    }
    function setImgLazyLoad(result) {
        imgLazyLoadElement.checked = result.imgLazyLoad || false;
    }
    function setBlacklistSites(result) {
        blacklistSitesElement.value = result.blacklistSites || "";
    }

    function onError(error) {
        alert(`[faster pageload plugin] local storage error: ${error}`);
    }
    

    browser.storage.sync.get("preloadViewport").then(setPreloadViewport, onError);
    browser.storage.sync.get("imgLazyLoad").then(setImgLazyLoad, onError);
    browser.storage.sync.get("blacklistSites").then(setBlacklistSites, onError);
    
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
