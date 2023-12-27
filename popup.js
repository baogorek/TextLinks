// Duplicated functionality
function formatUrl(url) {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'https://' + url; // Default to https if no protocol is specified
  }
  return url;
}

function saveLink(e) {
  e.preventDefault();

  var key = document.getElementById('key').value;
  var url = document.getElementById('url').value;

  if (!key || !url) {
    alert('Both fields are required.');
    return;
  }

  chrome.storage.sync.set({[key]: url}, function() {
    document.getElementById('key').value = '';
    document.getElementById('url').value = '';
    loadLinks();
  });
}

function loadLinks() {
  chrome.storage.sync.get(null, function(items) {
    var linksList = document.getElementById('linksList');
    linksList.innerHTML = '';

    for (var key in items) {
      var div = document.createElement('div');

      var link = document.createElement('a');
      link.textContent = key;
      link.href = formatUrl(items[key]);
      link.className = 'key'; // Reuse the same class for styling
      link.target = '_blank'; // Open in a new tab

      var textNode = document.createTextNode(` ${items[key]}`);
      
      div.appendChild(link);
      div.appendChild(textNode);

      var deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      (function(key) {
        deleteBtn.addEventListener('click', function() {
          deleteLink(key);
        });
      })(key);

      div.appendChild(deleteBtn);
      linksList.appendChild(div);
    }
  });
}

function deleteLink(key) {
  chrome.storage.sync.remove(key, function() {
    loadLinks();
  });
}

document.getElementById('linkForm').addEventListener('submit', saveLink);
document.addEventListener('DOMContentLoaded', function() {
  loadLinks();
});
