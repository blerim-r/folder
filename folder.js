

const DEFAULT_PARAMS = {
    closeButton: null,
    minButton: null,
    maxButton: null,
    resizeButton: null
};


function folder(selector, config) {

    if (typeof config === "undefined") {
        config = DEFAULT_PARAMS;
    }
    var closeButton = "<span class='closeBtn'>x</span>";
    var minButton = "<span class='minBtn'>_</span>";
    var maxButton = "<span class='maxBtn'>&#9634;</span>";
    var resizeButton = "<span class='resizeBtn' style='display: none'>&#9713;</span>";

    if (config.closeButton) {
        closeButton = config.closeButton;
    }
    if (config.minButton){
        minButton = config.minButton;
    }
    if (config.maxButton) {
        maxButton = config.maxButton;
    }
    if (config.resizeButton){
        resizeButton = config.resizeButton;
    }


    var closeButtonObj = getJSElement(closeButton);
    var minButtonObj = getJSElement(minButton);
    var maxButtonObj = getJSElement(maxButton);
    var resizeButtonObj = getJSElement(resizeButton);



    const target = document.getElementById(selector);
    var clonedTarget = target.cloneNode(true);

    var mainDiv = document.createElement("div");
    var navDiv = document.createElement("div");
    navDiv.append(minButtonObj);
    navDiv.append(maxButtonObj);
    navDiv.append(resizeButtonObj);
    navDiv.append(closeButtonObj);



    mainDiv.appendChild(navDiv);
    mainDiv.appendChild(clonedTarget);
    mainDiv.classList.add("mainCss");
    navDiv.classList.add("navCss");




    replaceWith(target, mainDiv)


}







function replaceWith(main, replace) {
    main.parentNode.replaceChild(replace, main);
}


function getJSElement(str) {
    var tmp = document.createElement("div");
    tmp.innerHTML = str;
    return tmp.childNodes[0];
}