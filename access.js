(() => {
  "use strict";

  const mappingSetter = (value) => () => {
    window.name = value;
    history.go(0);
  };

  const startBtn = document.querySelector(".start-mapping");
  const stopBtn = document.querySelector(".stop-mapping");

  startBtn.addEventListener("click", mappingSetter(), false);
  stopBtn.addEventListener("click", mappingSetter("notmappinged"), false);

  if (name === "notmappinged") {
    stopBtn.disabled = true;
    return;
  }

  startBtn.disabled = true;

  // Store old reference
  const appendChild = Element.prototype.appendChild;

  // All services to catch
  const urlCatchers = [
    "/AuthenticationService.Authenticate?",
    "/QuotaService.RecordEvent?",
  ];

  // Google Map is using JSONP.
  // So we only need to detect the services removing access and disabling them by not
  // inserting them inside the DOM
  Element.prototype.appendChild = function (element) {
    const isGMapScript =
      element.tagName === "SCRIPT" &&
      /maps\.googleapis\.com/i.test(element.src);
    const isGMapAccessScript =
      isGMapScript && urlCatchers.some((url) => element.src.includes(url));

    if (!isGMapAccessScript) {
      return appendChild.call(this, element);
    }

    // Extract the callback to call it with success data
    // (actually this part is not needed at all but maybe in the future ?)
    //const callback = element.src.split(/.*callback=([^\&]+)/, 2).pop();
    //const [a, b] = callback.split('.');
    //window[a][b]([1, null, 0, null, null, [1]]);

    // Returns the element to be compliant with the appendChild API
    return element;
  };
})();
