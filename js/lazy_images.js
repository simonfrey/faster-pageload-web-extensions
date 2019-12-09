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
          entry.target.src = entry.target.getAttribute("data-src-fasterpageload");
          entry.target.removeAttribute("data-src-fasterpageload");
          console.log("faster pageload plugin: Lazy loaded image: ",entry.target.src);
          // the image is now in place, stop watching
          self.unobserve(entry.target);
        }
      });
    }, config);

    var imgElements = document.querySelectorAll("img");
    console.log("faster pageload: Lazyload "+imgElements.length+" images")

    for (const imgElem of imgElements) {
      imgElem.setAttribute("data-src-fasterpageload", imgElem.src);
      imgElem.src = "";
      obst.observe(imgElem);
    }
  }
}

function onError(error) {
  alert(`faster pageload plugin: local storage error: ${error}`);
}

browser.storage.sync.get("imgLazyLoad").then(setImgLazyLoad, onError);
