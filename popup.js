// Duplicated functionality
function formatUrl(url) {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'https://' + url; // Default to https if no protocol is specified
  }
  return url;
}

function truncateUrl(url, maxLength) {
  if (url.length <= maxLength) {
    return url;
  }

  // Calculate the number of characters to show from the start and end of the URL
  const startChars = Math.ceil(maxLength / 2);
  const endChars = maxLength - startChars - 1; // -1 for the ellipsis

  // Extract the beginning and end parts of the URL
  const start = url.substring(0, startChars);
  const end = url.substring(url.length - endChars);

  return `${start}\u2026${end}`;
}

function saveLink(e) {
  e.preventDefault();

  var key = document.getElementById('key').value;
  var url = document.getElementById('url').value;

  if (!key || !url) {
    alert('Both fields are required.');
    return;
  }

  if (key.length > 15) {
    alert('The key must be 15 characters or less.');
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

      var textNode = document.createTextNode(`${truncateUrl(items[key], 40)}`);
      
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

document.getElementById('downloadButton').addEventListener('click', function() {
  chrome.storage.sync.get(null, function(items) {
    // Convert the items to a JSON string
    const jsonData = JSON.stringify(items, null, 2);

    // Create a blob with the JSON data
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create a link element and download the JSON file
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'TextLinks_backup.json';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  });
});

document.addEventListener('DOMContentLoaded', function() {
  loadLinks();
});
