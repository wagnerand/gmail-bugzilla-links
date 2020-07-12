browser.runtime.onMessage.addListener(function (req) {
  if (req.command) {
    if (req.command === "open-bugzilla-link") {
      document.querySelector(".bugzilla_link").click();
    }
  }
});

function removeAllBugzillaLinks() {
  const bugzillaLinks = document.querySelectorAll(".bugzilla_link");
  if (bugzillaLinks && bugzillaLinks.length > 0) {
    for (let link of bugzillaLinks) {
      link.remove();
    }
  }
}

function addBugzillaLink(url) {
  removeAllBugzillaLinks();

  const link = document.createElement("a");
  link.href = url;
  link.className = "bugzilla_link T-I-ax7";
  //   link.className = "bugzilla_link T-I J-J5-Ji lS T-I-ax7 ar7";
  link.target = "_blank";
  link.rel = "noopener";
  link.innerText = "View on Bugzilla";

  document.querySelector(".iH > div").appendChild(link);
}

function getBugzillaUrl(target) {
  const bugzillaInfo = target.querySelector(
    ".nH.if .ii.gt > div > div > pre:last-of-type"
  );
  if (bugzillaInfo && bugzillaInfo.textContent) {
    const data = bugzillaInfo.textContent;
    const bugzillaUrl = data.match(/X-Bugzilla-URL: (https?:\/\/.*?)$/)[1];
    const bugzillaId = data.match(/X-Bugzilla-ID: (\d+)/)[1];
    if (bugzillaUrl && bugzillaId) {
      return `${bugzillaUrl}show_bug.cgi?id=${bugzillaId}`;
    }
  }

  const emailBody = target.querySelector(".nH.if .ii.gt > div");
  if (emailBody && emailBody.textContent) {
    return emailBody.textContent.match(/https?:\/\/.*?\/show_bug\.cgi\?id=\d+/);
  }
}

function checkDOMAndAddLink(target) {
  const url = getBugzillaUrl(target);
  if (url) {
    addBugzillaLink(url);
    return true;
  }
  return false;
}

function addMainPaneObserver() {
  const mainPane = document.querySelector("div.AO");
  if (mainPane) {
    const observerConfig = {
      attributes: false,
      childList: true,
      subtree: true,
    };

    const observerCallback = function (mutationsList, observer) {
      for (let mutation of mutationsList) {
        const target = mutation.target;
        const linkAdded = checkDOMAndAddLink(target);
        if (linkAdded) {
          break;
        }
      }
    };

    const mainPaneObserver = new MutationObserver(observerCallback);
    mainPaneObserver.observe(mainPane, observerConfig);
  }
}

checkDOMAndAddLink(document);
addMainPaneObserver();
