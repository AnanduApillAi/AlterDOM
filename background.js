// Store selected element details
let selectedElementDetails = null;

// Listen for messages from the content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "storeElementDetails") {
        selectedElementDetails = request.details;
        sendResponse({ success: true });

        // Send details to the active tab (content script)
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: "displayElementDetails",
                details: selectedElementDetails,
            });
        });
    } else if (request.action === "getElementDetails") {
        sendResponse({ details: selectedElementDetails });
    }
});
