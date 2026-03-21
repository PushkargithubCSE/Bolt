let collapsed = false;

function getMessages() {
    return document.querySelectorAll('[data-message-author-role]');
}

function collapseMessages() {

    const messages = getMessages();

    if (messages.length < 60) return;

    const keep = 40;

    for (let i = 0; i < messages.length - keep; i++) {
        messages[i].classList.add("chatgpt-collapsed");
    }

    collapsed = true;

    updateCounter();
}

function expandMessages() {

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

function observeChat() {

    const target = document.body;

    const observer = new MutationObserver(() => {

        updateCounter();

        if (!collapsed) {
            collapseMessages();
        }

    });

    observer.observe(target, {
        childList: true,
        subtree: true
    });
}

function init() {

    createPanel();

    observeChat();

    updateCounter();
}

setTimeout(init, 3000);