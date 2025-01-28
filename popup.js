// When popup loads, check for stored details
chrome.runtime.sendMessage({ action: "getElementDetails" }, (response) => {
    if (response.details) {
        displayElementDetails(response.details);
    }
});

document.getElementById("selectElement").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "selectElement" }, () => {
            // After enabling selection mode, close the popup
            // window.close();
        });
    });
});

// Function to display element details
function displayElementDetails(details) {
    document.getElementById("details").textContent = JSON.stringify(details, null, 2);
}