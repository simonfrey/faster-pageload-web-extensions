function handleInstalled(details) {
  if (details.reason == "install") {
    browser.tabs.create({
      url: chrome.runtime.getURL("static/setup.html")
    });
  }
}

browser.runtime.onInstalled.addListener(handleInstalled);


// Set active icon
function SetIcon(active) {
  if (active) {
    chrome.browserAction.setIcon({ path: "icons/rocket.svg" });
  } else {
    chrome.browserAction.setIcon({ path: "icons/rocket_da.svg" });
  }
}

chrome.browserAction.onClicked.addListener(async function () {
  var storeData = await browser.storage.sync.get([
    "active",
  ]);
  if (storeData.active == undefined) {
    storeData.active = true;
  }
  await browser.storage.sync.set({
    active: !storeData.active,
  });
  SetIcon(!storeData.active);
});

function onError(error) {
  console.log(`faster pageload plugin: local storage error: ${error}`);
}
function setInitIcon(storeData) {
  SetIcon(storeData.active);
}
browser.storage.sync.get("active").then(setInitIcon, onError);





//
// Real lazy loading


function onError(error) {
  alert(`faster pageload plugin: local storage error: ${error}`);
}

function setImgLazyLoad(result) {
  if (result.active == false) {
    console.log("[faster pageload plugin] Inactive: Do not lazy load images")
    return
  }

  if (result.imgLazyLoad == undefined || result.imgLazyLoad == true) {
    var lazyDone = false;
    var ourLazyLoad = false;
    function cancel(requestDetails) {
      console.log("LAZ: ", lazyDone)
      if (!lazyDone) {
        return new Promise((resolve, reject) => {
          window.setTimeout(() => {
            if (ourLazyLoad) {
              resolve({ cancel: true });
              console.log("CANCEL: " + requestDetails.url)
            };
            resolve()
          }, 1000);
        })
      }
    }
    browser.webRequest.onBeforeRequest.addListener(
      cancel,
      { urls: ["<all_urls>"], types: ["image"] },
      ["blocking"]
    );
    browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log("REQUE: ",request)
      if (request.lazyDone != undefined) lazyDone = true;
      if (request.ourLazyLoad != undefined) ourLazyLoad = request.ourLazyLoad;
      console.log("LAZY DONE:", lazyDone)
      console.log("Out lazy:", ourLazyLoad)
    });
    function handleUpdated(tabId, changeInfo, tabInfo) {
      console.log("Changed status: ", changeInfo.status);
      if (changeInfo.status == "loading") {
        lazyDone = false;
        ourLazyLoad = false;
      }
    }
    browser.tabs.onUpdated.addListener(handleUpdated);
  }
}
browser.storage.sync.get(["imgLazyLoad", "active"]).then(setImgLazyLoad, onError);
