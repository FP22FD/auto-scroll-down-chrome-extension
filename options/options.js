const defaults = {
  step: 10,
  slow: 100,
  medium: 200,
  fast: 500,
};

// Saves options to chrome.storage
const saveOptions = () => {
  const step = document.getElementById("step").value || defaults.step;
  const slow = document.getElementById("slow").value || defaults.slow;
  const medium = document.getElementById("medium").value || defaults.medium;
  const fast = document.getElementById("fast").value || defaults.fast;

  chrome.storage.sync.set(
    {
      step: step,
      slow: slow,
      medium: medium,
      fast: fast,
    },
    () => {
      // Update status to let user know options were saved.
      const status = document.getElementById("status");
      status.textContent = "Options saved.";
      setTimeout(() => {
        status.textContent = "";
      }, 750);
    }
  );
};

// Restores the input state using the preferences stored in chrome.storage.
const restoreOptions = () => {
  chrome.storage.sync.get(defaults, (items) => {
    document.getElementById("step").value = items.step || defaults.step;
    document.getElementById("slow").value = items.slow || defaults.slow;
    document.getElementById("medium").value = items.medium || defaults.medium;
    document.getElementById("fast").value = items.fast || defaults.fast;
  });
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
