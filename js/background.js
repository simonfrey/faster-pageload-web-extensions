function handleInstalled(details) {
  console.log(details.reason);
  browser.tabs.create({
    url: chrome.runtime.getURL("static/setup.html")
  });
}

browser.runtime.onInstalled.addListener(handleInstalled);
