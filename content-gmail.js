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
  link.target = "_blank";
  link.rel = "noopener";
  link.innerText = "View on Bugzilla";

  document.querySelector(".iH > div").appendChild(link);
}

function getBugzillaUrl(target) {
  const emailBody = target.querySelector(".nH.if .ii.gt > div");
  if (emailBody) {
    const content = emailBody.textContent;
    if (content) {
      const matchUrl = content.match(/X-Bugzilla-URL: (https?:\/\/.*?\/)/);
      const matchId = content.match(/X-Bugzilla-ID: (\d+)/);
      if (matchUrl && matchId) {
        return `${matchUrl[1]}show_bug.cgi?id=${matchId[1]}`;
      }
      return content.match(/https?:\/\/.*?\/show_bug\.cgi\?id=\d+/);
    }
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
