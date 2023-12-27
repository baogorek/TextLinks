// Duplicated functionality
function formatUrl(url) {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'https://' + url; // Default to https if no protocol is specified
  }
  return url;
}

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  chrome.storage.sync.get(null, function(items) {
    const keys = Object.keys(items);
    const filteredKeys = keys.filter(key => key.includes(text));
    const suggestions = filteredKeys.map(key => ({ content: key, description: key }));
    suggest(suggestions);
  });
});


chrome.omnibox.onInputEntered.addListener((text, disposition) => {
  chrome.storage.sync.get(text, (result) => {
    let url = result[text];

    if (url) {
      url = formatUrl(url);
      switch (disposition) {
        case 'currentTab':
          chrome.tabs.update({ url: url });
          break;
        case 'newForegroundTab':
          chrome.tabs.create({ url: url });
          break;
        case 'newBackgroundTab':
          chrome.tabs.create({ url: url, active: false });
          break;
      }
    }
  });
});
