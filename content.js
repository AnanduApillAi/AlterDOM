let isSelectionMode = false;
let lastHighlightedElement = null;

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "selectElement") {
        enableElementSelection();
        sendResponse({ success: true });
    }
});

function onMouseOver(event) {
    if (!isSelectionMode) return;
    // alert('heyyy')
    
    // Remove previous highlight
    if (lastHighlightedElement && lastHighlightedElement !== event.target) {
        lastHighlightedElement.style.outline = "";
    }
    
    // Add new highlight
    event.target.style.outline = "2px solid red";
    lastHighlightedElement = event.target;
}

function onMouseOut(event) {
    if (!isSelectionMode) return;
    
    if (lastHighlightedElement === event.target) {
        event.target.style.outline = "";
        lastHighlightedElement = null;
    }
}

function onClick(event) {
    if (!isSelectionMode) return;

    event.target.style.outline = "2px solid red";
    lastHighlightedElement = event.target;
    
    // Prevent default behavior
    event.preventDefault();
    event.stopPropagation();

    // Get element details
    const elementDetails = {
        tagName: event.target.tagName,
        attributes: getAttributes(event.target),
        styles: getComputedStylesObject(event.target)
    };

    // Remove highlight
    if (lastHighlightedElement) {
        lastHighlightedElement.style.outline = "";
    }

    // Disable selection mode
    disableElementSelection();

    // Send details to background script
    chrome.runtime.sendMessage({
        action: "storeElementDetails",
        details: elementDetails
    });
}

function enableElementSelection() {
    isSelectionMode = true;
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    document.addEventListener("click", onClick, true);
}

function disableElementSelection() {
    isSelectionMode = false;
    document.removeEventListener("mouseover", onMouseOver);
    document.removeEventListener("mouseout", onMouseOut);
    document.removeEventListener("click", onClick, true);
}

function getAttributes(element) {
    const attributes = {};
    for (const attr of element.attributes) {
        attributes[attr.name] = attr.value;
    }
    return attributes;
}

function getComputedStylesObject(element) {
    const styles = window.getComputedStyle(element);
    const computedStyles = {};
    for (const style of styles) {
        computedStyles[style] = styles.getPropertyValue(style);
    }
    return computedStyles;
}

// Function to create the floating UI
function createFloatingUI() {
    if (document.getElementById("floating-ui")) return; // Avoid duplicates

    // Create the container
    const container = document.createElement("div");
    container.id = "floating-ui";
    container.style.position = "fixed";
    container.style.top = "20px";
    container.style.right = "20px";
    container.style.width = "300px";
    container.style.padding = "10px";
    container.style.backgroundColor = "white";
    container.style.border = "1px solid #ccc";
    container.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
    container.style.zIndex = "10000";
    container.style.fontFamily = "Arial, sans-serif";
    container.style.color = "#333";
    container.style.borderRadius = "5px";

    // Add a close button
    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.style.marginBottom = "10px";
    closeButton.style.float = "right";
    closeButton.style.backgroundColor = "#f44336";
    closeButton.style.color = "white";
    closeButton.style.border = "none";
    closeButton.style.padding = "5px 10px";
    closeButton.style.cursor = "pointer";
    closeButton.style.borderRadius = "3px";
    closeButton.addEventListener("click", () => {
        container.remove(); // Remove the floating UI
    });

    // Add a content area
    const content = document.createElement("pre");
    content.id = "floating-ui-content";
    content.style.overflow = "auto";
    content.style.height = "200px";
    content.style.marginTop = "10px";
    content.style.whiteSpace = "pre-wrap";

    container.appendChild(closeButton);
    container.appendChild(content);
    document.body.appendChild(container);
}

// Function to update the floating UI with details
function updateFloatingUI(details) {
    createFloatingUI(); // Ensure the UI exists
    const content = document.getElementById("floating-ui-content");
    content.textContent = JSON.stringify(details, null, 2); // Display formatted details
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "displayElementDetails") {
        updateFloatingUI(request.details); // Update the UI with the received details
    }
});
