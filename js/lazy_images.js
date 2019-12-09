function setImgLazyLoad(result) {
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
          var src = entry.target.getAttribute("data-src-fasterpageload");
          entry.target.src = src;
          // the image is now in place, stop watching
          self.unobserve(entry.target);
        }
      });
    }, config);

    var imgElements = document.querySelectorAll("img");
    for (const imgElem of imgElements) {
      let src = imgElem.src;
      imgElem.src = "";
      imgElem.setAttribute("data-src-fasterpageload", src);
      obst.observe(imgElem);
    }
  }
}

function onError(error) {
  alert(`faster pageload plugin: local storage error: ${error}`);
}

browser.storage.sync.get("imgLazyLoad").then(setImgLazyLoad, onError);
