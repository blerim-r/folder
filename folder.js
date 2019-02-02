const DEFAULT_PARAMS = {
  title: "Folder Title",
  template: "linux"
};

var templates = {
  windows: {
    closeButton: "<span class='folder-closeBtnW'>x</span>",
    minButton: "<span class='folder-minBtnW'>_</span>",
    maxButton: "<span class='folder-maxBtnW'>&#9634;</span>",
    resizeButton: "<span class='folder-resizeBtnW' style='display: none'>&#9713;</span>",
  },
  linux: {
    closeButton: "<span class='folder-closeBtn'>x</span>",
    minButton: "<span class='folder-minBtn'>_</span>",
    maxButton: "<span class='folder-maxBtn'>&#9634;</span>",
    resizeButton: "<span class='folder-resizeBtn' style='display: none'>&#9713;</span>",
  },
  mac: {
    closeButton: "<span class='folder-closeBtnM'>x</span>",
    minButton: "<span class='folder-minBtnM'>_</span>",
    maxButton: "<span class='folder-maxBtnM'>&#9634;</span>",
    resizeButton: "<span class='folder-resizeBtnM' style='display: none'>&#9713;</span>",
  }
};

/**
 * main function to make a div like folder
 * @param selector
 * @param config
 */
function folder(selector, config) {
  const target = typeof selector === "string" ? document.querySelector(selector) : selector;
  var clonedTarget = target.cloneNode(true);

  if (target.classList.contains("folder-content")) {
    return;
  }
  if (typeof config === "undefined") {
    config = DEFAULT_PARAMS;
  }

  // If user has specified unknown template throw error, if not get default

  if (!config.template) {
    config.template = DEFAULT_PARAMS.template;
  } else if (!templates.hasOwnProperty(config.template)) {
    throw new Error("Error, template unknown");
  }

  // Get templates from config if its defined or from default Config
  var closeButton = templates[config.template].closeButton;
  var minButton = templates[config.template].minButton;
  var maxButton = templates[config.template].maxButton;
  var resizeButton = templates[config.template].resizeButton;
  // Create Node element based on string template
  var closeButtonObj = getJSElement(closeButton);
  var minButtonObj = getJSElement(minButton);
  var maxButtonObj = getJSElement(maxButton);
  var resizeButtonObj = getJSElement(resizeButton);

  // Create main div that contains the folder
  var mainDiv = document.createElement("div");
  // Create navigation div and div of title + buttons
  var navDiv = document.createElement("div");
  var holdBtn = document.createElement("div");
  var holdTitle = document.createElement("div");
  if (isMac(config)) {
    holdBtn.append(maxButtonObj);
    holdBtn.append(minButtonObj);
    holdBtn.append(resizeButtonObj);
    holdBtn.append(closeButtonObj);
  } else {
    // Add to button container buttons
    holdBtn.append(minButtonObj);
    holdBtn.append(maxButtonObj);
    holdBtn.append(resizeButtonObj);
    holdBtn.append(closeButtonObj);
  }

  // add css to navigation bar
  if (isLinux(config)) {
    holdBtn.classList.add("LinuxClass");
    holdBtn.classList.add("folder-holdBtn");
  } else if (isMac(config)) {
    holdBtn.classList.add("MacClass");
    holdBtn.classList.add("folder-holdBtnM");
  } else if (isWin(config)) {
    holdBtn.classList.add("WindowClass");
    holdBtn.classList.add("folder-holdBtnW");
  }

  // Set title
  holdTitle.innerHTML = config.title ;
  // Add tittle div and buttons div to navigation div
  navDiv.append(holdTitle);
  navDiv.append(holdBtn);
  // add css to navigation bar
  if (isLinux(config)) {
    navDiv.classList.add("folder-navCss");
  } else if (isMac(config)) {
    navDiv.classList.add("folder-navCssM");
  } else if (isWin(config)) {
    navDiv.classList.add("folder-navCssW");
  }

  mainDiv.appendChild(navDiv);
  mainDiv.appendChild(clonedTarget);
  mainDiv.classList.add("folder-mainCss");

  // get cordinates position element
  var initPos = targetCoords(target);
  mainDiv.style.width = initPos.width + "px";
  mainDiv.style.height = initPos.height + "px";
  if (isMac(config)) {
    clonedTarget.style.height = (initPos.height - 30) + "px";
  } else {
    clonedTarget.style.height = (initPos.height - 37) + "px";
  }

  mainDiv.style.position = getComputedStyle(target).position;
  var cssPos = getComputedStyle(target).position;

  clonedTarget.classList.add("folder-reset-pos");
  clonedTarget.classList.add("folder-content");
  replaceWith(target, mainDiv);

  clonedTarget.style.width = "100%";
  clonedTarget.style.height = "100%";
  var willMax = false;
  // track element position on resize
  resizeEvent(mainDiv, function (entries) {
    if (willMax) {
      return;
    }
    for (let entry of entries) {
      if (!isNaN(entry.contentRect.height)) {
        initPos.height = entry.contentRect.height;
      }
      if (!isNaN(entry.contentRect.width)) {
        initPos.width = entry.contentRect.width;
      }
    }
  });
  // Navigation Events

  // delete element on x
  closeButtonObj.addEventListener("click", function () {
    this.parentNode.parentNode.parentNode.remove();
  });


  // make div full size related width parent container
  maxButtonObj.addEventListener("click", function () {
    willMax = true;
    this.style.display = "none";
    resizeButtonObj.style.display = "flex";
    mainDiv.style.top = 0;
    mainDiv.style.right = 0;
    mainDiv.style.left = 0;
    mainDiv.style.bottom = 0;
    mainDiv.style.position = "absolute";
    mainDiv.style.width = "auto";
    mainDiv.style.height = "auto";
    mainDiv.style.zIndex = 99999;
    clonedTarget.style.width = "100%";
    clonedTarget.style.height = "CALC(100% - 37px)";
  });
  // resize element back to last position
  resizeButtonObj.addEventListener("click",function () {
    willMax = false;
    maxButtonObj.style.display = "flex";
    this.style.display = "none";
    mainDiv.style.zIndex = 9999;
    mainDiv.style.width = initPos.width + "px";
    mainDiv.style.height = initPos.height + "px";
    mainDiv.style.position = cssPos;
  });

  // minimaize folder and add it to the bottom list
  minButtonObj.addEventListener("click", function () {
    willMax = true;
    // Create bottom container if it doesn't exist
    var folderDivStatic = document.querySelector(".folder-static");
    if (!folderDivStatic) {
      folderDivStatic = document.createElement("div");
      folderDivStatic.classList.add("folder-static");
      mainDiv.parentNode.append(folderDivStatic);

      // added event on bottom folder to apdate height based on its width
      resizeEvent(folderDivStatic, updateBottomContainer);
    }
    // Make main div display none
    this.style.display = "none";
    mainDiv.style.display = "none";
    // Show resize
    resizeButtonObj.style.display = "flex";
    // Show Maximize
    maxButtonObj.style.display = "flex";
    // Clone Nav buttons

    var singleNavBottom = this.parentNode.parentNode.cloneNode(true);
    singleNavBottom.classList.add('folder-navCssBottom');
    folderDivStatic.append(singleNavBottom);

    // update font size based on element number
    if (folderDivStatic.children.length >= 1) {
      var counter = folderDivStatic.children.length;
      if (folderDivStatic.lastChild.offsetWidth < 161) {
        for (var i = 0; i < counter; i++){
          folderDivStatic.children[i].children[0].style.fontSize = "11px";
        }
      } else {
        for (var j = 0; j < counter; j++) {
          folderDivStatic.children[j].children[0].style.fontSize = "15px";
        }
      }
    }


    updateBottomContainer();

    var navX = singleNavBottom.lastChild.lastChild;
    var navResize = singleNavBottom.lastChild.childNodes[2];
    var navMax = singleNavBottom.lastChild.childNodes[1];
    navX.addEventListener('click', function () {

      this.parentNode.parentNode.remove();
      closeButtonObj.click();

      if (folderDivStatic.children.length === 0) {
        folderDivStatic.remove();
        return;
      }
      updateBottomContainer();
      updateFontSize();

    });
    navMax.addEventListener("click" , function () {
      this.parentNode.parentNode.remove();
      mainDiv.style.display = "block";
      minButtonObj.style.display = "flex";
      maxButtonObj.click();

      if (folderDivStatic.children.length === 0) {
        folderDivStatic.remove();
        return;
      }
      updateBottomContainer();
      updateFontSize()

    });
    navResize.addEventListener("click", function () {
      willMax = false;
      this.parentNode.parentNode.remove();
      mainDiv.style.display = "block";
      minButtonObj.style.display = "flex";
      resizeButtonObj.click();

      if (folderDivStatic.children.length === 0) {
        folderDivStatic.remove();
        return;
      }
      updateBottomContainer();

      updateFontSize();

    });
  });
}
function replaceWith(main, replace) {
  main.parentNode.replaceChild(replace, main);
}
function getJSElement(str) {
  var tmp = document.createElement("div");
  tmp.innerHTML = str;
  return tmp.childNodes[0];
}
/**
 * Get coordinates of the target element
 * @param target
 * @returns {Array}
 */
function targetCoords(target) {
  return target.getBoundingClientRect();
}
function isLinux(config) {
  return config.template === "linux";
}
function isWin(config) {
  return config.template === "windows";
}
function isMac(config) {
  return config.template === "mac";
}
function resizeEvent(element, cb) {
  var ro = new ResizeObserver(cb);
  // Observe one or multiple elements
  ro.observe(element);
}

function updateBottomContainer() {
  var folderDivStatic = document.querySelector(".folder-static");
  if (folderDivStatic.lastChild.offsetWidth > 136) {
    folderDivStatic.style.height = "36px";
    folderDivStatic.style.paddingBottom = "0px";
  } else {
    folderDivStatic.style.height = "50px";
    folderDivStatic.style.paddingBottom = "15px";
  }
  var counter = folderDivStatic.children.length;
  if (folderDivStatic.lastChild.offsetWidth < 161) {
    for (var i = 0; i < counter; i++) {
      folderDivStatic.children[i].children[0].style.fontSize = "11px";
    }
  }
}

function updateFontSize() {
  var folderDivStatic = document.querySelector(".folder-static");
  if (folderDivStatic.children.length >= 1) {
    var counter = folderDivStatic.children.length;
    if (folderDivStatic.lastChild.offsetWidth < 161) {
      for (var i = 0; i < counter; i++){
        folderDivStatic.children[i].children[0].style.fontSize = "11px";
      }
    } else {
      for (var j = 0; j < counter; j++) {
        folderDivStatic.children[j].children[0].style.fontSize = "15px";
      }
    }
  }
}