function handleInstalled(details) {
  if (details.reason == "install") {
    browser.tabs.create({
      url: chrome.runtime.getURL("static/setup.html")
    });
  }
}

browser.runtime.onInstalled.addListener(handleInstalled);


// Set active icon
function SetIcon(active){
  if (active) {
    chrome.browserAction.setIcon({ path: "icons/launch_96.png" });
  } else {
    chrome.browserAction.setIcon({ path: "icons/launch_96_deactivate.png" });
  }
}

chrome.browserAction.onClicked.addListener(async function() {
var storeData = await browser.storage.sync.get([
  "active",
]);
if (storeData.active == undefined){
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
function setInitIcon(storeData){
  SetIcon(storeData.active);
}
browser.storage.sync.get("active").then(setInitIcon, onError);
