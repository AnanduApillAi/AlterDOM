// When the results page loads, get the details from storage and display them
chrome.storage.local.get(['elementDetails'], function(result) {
    if (result.elementDetails) {
      document.getElementById('details').textContent = 
        JSON.stringify(result.elementDetails, null, 2);
    }
  });