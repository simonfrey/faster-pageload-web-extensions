var preloadViewportElement = document.getElementById("preloadViewport");
var imgLazyLoadElement = document.getElementById("imgLazyLoad");

function saveOptions(e) {
    e.preventDefault();
    browser.storage.sync.set({
        preloadViewport: preloadViewportElement.checked,
        imgLazyLoad: imgLazyLoadElement.checked,
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

    function onError(error) {
        alert(`faster pageload plugin: local storage error: ${error}`);
    }
    

    browser.storage.sync.get("preloadViewport").then(setPreloadViewport, onError);
    browser.storage.sync.get("imgLazyLoad").then(setImgLazyLoad, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);