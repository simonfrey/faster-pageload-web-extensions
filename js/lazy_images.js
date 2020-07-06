
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

function arrayContains(needle, arrhaystack)
{
    return (arrhaystack.indexOf(needle) > -1);
}


function setImgLazyLoad(result) {
  if (result.active == false) {
    console.log("[faster pageload plugin] Inactive: Do not lazy load images")
    return
  }


  if (/*result.imgLazyLoad == undefined ||*/ result.imgLazyLoad == true) {
	  if (!(arrayContains(window.location.host, result.blacklistSites.split(", ")))) {
		const config = {
		  root: null, // avoiding 'root' or setting it to 'null' sets it to default value: viewport
		  rootMargin: "0px",
		  threshold: 0.5
		};

		// register the config object with an instance
		// of intersectionObserver
		var obst = new IntersectionObserver(function (entries, self) {
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

		var foundSrcs = {}
		var foundTimes = 0
		var ourLazy = true;

		for (var i = imgElements.length - 1; i >= 0; i--) {
		  var imgElem = imgElements[i];
		

		  // if (
		  //   imgElem.src != undefined &&
		  //   imgElem.src != "" &&
		  //   Object.keys(imgElem.dataset).length == 0 &&
		  //   imgElem.src.includes("data:") == false
		  // ) {

			if(foundSrcs[imgElem.src]== undefined){
			  foundSrcs[imgElem.src] = 1;
			}
			foundSrcs[imgElem.src]++;

			console.log("FOUND: ",foundSrcs[imgElem.src], imgElem.src)

			if (foundSrcs[imgElem.src] >= 5) {
			  console.log("[faster pageload plugin] Unknown lazy load plugin found. Remove lazy load elements: ", imgElements.length - 1 - i)
			  // we have apparently an unknown lazy load plugin on the site. Reset all images
			  for (var j = imgElements.length - 1; j >= i; j--) {
				var remElem = imgElements[j];
				remElem.src = remElem.getAttribute(
				  "data-src-fasterpageload"
				);
				remElem.removeAttribute("data-src-fasterpageload");
				obst.unobserve(remElem);
			  }
			  ourLazy = false;
			  break

			} else {

			


			  if (imgElem.loading != undefined) {
				imgElem.loading = "lazy"
			  } else {
				imgElem.setAttribute("data-src-fasterpageload", imgElem.src);
				imgElem.src = chrome.runtime.getURL("static/rocket.svg");
				obst.observe(imgElem);
			  }
			}
		 // }

		}



		browser.runtime.sendMessage({
		  lazyDone: true,
		  ourLazyLoad:   ourLazy
		});
	}
  }

}

function onError(error) {
  alert(`faster pageload plugin: local storage error: ${error}`);
}

browser.storage.sync.get(["blacklistSites", "imgLazyLoad", "active"]).then(setImgLazyLoad, onError);
