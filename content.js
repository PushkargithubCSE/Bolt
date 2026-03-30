let collapsed = false;
let observer = null;
let debounceTimer = null;

function getMessages() {
    return document.querySelectorAll('[data-message-author-role], article');  // searching article tags also 
}

function collapseMessages() {
    console.log("Collapse Clicked");
    
    const messages = getMessages();

    console.log("Total messages:",messages.length); //added logs for debugging

    if (messages.length < 60) {
        console.log("Not enough messages to collapse");
        return;
    };

    const keep = 40;

    for (let i = 0; i < messages.length - keep; i++) {
        messages[i].classList.add("chatgpt-collapsed");
    }

    collapsed = true;
    updateCounter();
}

function expandMessages() {
    console.log("Expand clicked");
    const messages = getMessages();

    messages.forEach(m => {
        m.classList.remove("chatgpt-collapsed");
    });

    collapsed = false;
    updateCounter();
}

function updateCounter() {
    const counter = document.getElementById("chat-counter");
    if (!counter) return;

    const messages = getMessages();
    counter.innerText = `Messages: ${messages.length}`;
}

function createPanel() {

    if (document.getElementById("chat-optimizer-panel")) return;

    const panel = document.createElement("div");
    panel.id = "chat-optimizer-panel";

    panel.innerHTML = `
        <div class="optimizer-title">⚡ Chat Optimizer</div>
        <div id="chat-counter">Messages: 0</div>
        <button id="collapse-btn">Collapse Old</button>
        <button id="expand-btn">Expand All</button>
    `;

    document.body.appendChild(panel);

    document
        .getElementById("collapse-btn")
        .addEventListener("click", collapseMessages);

    document
        .getElementById("expand-btn")
        .addEventListener("click", expandMessages);

    updateCounter();
}

function debounceOptimize() {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
        updateCounter();
        collapseMessages();
    }, 500); // wait 500ms after changes
}

function observeChat() {

    if (observer) return;

    // Try to find chat container (more stable than body)
    const chatContainer = document.querySelector("main");

    if (!chatContainer) {
        console.log("Chat container not found, retrying...");
        setTimeout(observeChat, 2000);
        return;
    }

    observer = new MutationObserver(() => {
        debounceOptimize();
    });

    observer.observe(chatContainer, {
        childList: true,
        subtree: true
    });

    console.log("Observer attached safely");
}

function init() {
    createPanel();
    observeChat();
    updateCounter();
}

// Delay init so page fully loads
setTimeout(init, 4000);