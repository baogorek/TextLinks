# TextLinks
A Chrome extension for text links, triggered by "go" 


## Technical notes

To see the data in storage:
```
chrome.storage.sync.get(null, function(data) { console.log(data); });
```

To see just keysCache:
```
chrome.storage.sync.get('keysCache', function(data) { console.log(data); });
```


To clear all storage:
```
chrome.storage.sync.clear(function() {
    console.log('All data cleared.');
});
```
