
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create("../index.html", {
    "outerBounds": {
      "width": 1,
      "height": 1, //todo. check if chrome App using initial window size
    }
  });
});

