function IsImageOk(img) {
  // During the onload event, IE correctly identifies any images that
  // weren't downloaded as not complete. Others should too. Gecko-based
  // browsers act like NS4 in that they report this incorrectly.
  if (!img.complete) {
      return false;
  }

  // However, they do have two very useful properties: naturalWidth and
  // naturalHeight. These give the true size of the image. If it failed
  // to load, either of these should be zero.
  if (typeof img.naturalWidth != "undefined" && img.naturalWidth == 0) {
      return false;
  }

  // No other way of checking: assume it's ok.
  return true;
}



function setImgLazyLoad(result) {
  if (result.active == false){
    console.log("[faster pageload plugin] Inactive: Do not lazy load images")
    return
  }


  if (result.imgLazyLoad == undefined || result.imgLazyLoad == true) {
    const config = {
      root: null, // avoiding 'root' or setting it to 'null' sets it to default value: viewport
      rootMargin: "0px",
      threshold: 0.5
    };

    // register the config object with an instance
    // of intersectionObserver
    var obst = new IntersectionObserver(function(entries, self) {
      // iterate over each entry
      entries.forEach(entry => {
        // process just the images that are intersecting.
        // isIntersecting is a property exposed by the interface
        if (entry.isIntersecting) {
          // custom function that copies the path to the img
          // from data-src to src
          entry.target.src = entry.target.getAttribute(
            "data-src-fasterpageload"
          );
          entry.target.removeAttribute("data-src-fasterpageload");
          console.log(
            "[faster pageload plugin] Lazy loaded image: ",
            entry.target.src
          );
          // the image is now in place, stop watching
          self.unobserve(entry.target);
        }
      });
    }, config);

    var imgElements = document.querySelectorAll("img");
    console.log("[faster pageload plugin] Lazyload " + imgElements.length + " images");

    var foundSrc = ""
    var foundTimes = 0

    for (var i = imgElements.length - 1; i >= 0; i--) {
      var imgElem = imgElements[i];
      if (IsImageOk(imgElem)){
        continue
      }

      if (
        imgElem.src != undefined &&
        imgElem.src != "" &&
        Object.keys(imgElem.dataset).length == 0 &&
        imgElem.src.includes("data:") == false
      ) {

        if (foundSrc != imgElem.src){
          foundSrc = imgElem.src;
          foundTimes = 1;
        }else{
          foundTimes++
        }

       
        if (foundTimes >= 5){
          console.log("[faster pageload plugin] Unknown lazy load plugin found. Remove lazy load elements: ", imgElements.length - 1-i)
          // we have apparently an unknown lazy load plugin on the site. Reset all images
          for (var j = imgElements.length - 1; j >= i; j--) {
            var remElem = imgElements[j];
            remElem.src = remElem.getAttribute(
              "data-src-fasterpageload"
            );
            remElem.removeAttribute("data-src-fasterpageload");
            obst.unobserve(remElem);
          }
          break

        }else{
      
        imgElem.setAttribute("data-src-fasterpageload", imgElem.src);
        imgElem.src = chrome.runtime.getURL("static/icon.png");
        obst.observe(imgElem);
        }
      }
    }
  }
}

function onError(error) {
  alert(`faster pageload plugin: local storage error: ${error}`);
}

browser.storage.sync.get(["imgLazyLoad","active"]).then(setImgLazyLoad, onError);
