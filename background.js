browser.commands.onCommand.addListener(function (command) {
  browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    browser.tabs.sendMessage(tabs[0].id, { command });
  });
});
