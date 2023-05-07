let state = "off";
let scrollStep = 10;
let intervalId;
let tabId;

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

function getNextState(current) {
  if (current === "off") {
    return "slow";
  }
  if (current === "slow") {
    return "medium";
  }
  if (current === "medium") {
    return "fast";
  }
  if (current === "fast") {
    return "off";
  }
}

function startScrolling() {
  chrome.scripting
    .executeScript({
      target: { tabId: tabId },
      func: doScroll,
      args: [scrollStep],
    })
    .then(() => {
      /* NOP */
    })
    .catch((e) => console.error(e));
}

function stopScrolling() {
  if (intervalId) {
    clearInterval(intervalId);
  }
}

function doScroll(scrollStep) {
  if (
    document.documentElement.scrollTop <
    document.documentElement.scrollHeight + scrollStep
  ) {
    document.documentElement.scrollTop += +scrollStep;
  }
}

chrome.action.onClicked.addListener(async (tab) => {
  const nextState = getNextState(state);
  state = nextState;

  // Set the action badge to the next state
  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: state,
  });

  tabId = tab.id;
  stopScrolling();

  if (state !== "off") {
    const settings = await Promise.all([
      chrome.storage.sync.get(["step"]),
      chrome.storage.sync.get([state]),
    ]);

    /*
    settings = [
      { "step": "10" },
      { "fast": "200" }
    ];
    */

    scrollStep = settings[0]["step"] || 10;
    let interval = settings[1][state] || 100;

    if (!interval || interval < 100) {
      // make sure it doesn't run too fast!
      interval = 100;
    }

    intervalId = setInterval(startScrolling, interval);
  }
});
