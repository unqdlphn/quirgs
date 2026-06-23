document.addEventListener("DOMContentLoaded", () => {
  const tokenInput = document.getElementById("token-input");
  const setTokenBtn = document.getElementById("set-token-btn");
  const tokenStatusLine = document.getElementById("token-status-line");
  const queueContainer = document.getElementById("queue-container");
  
  // Resolved at build time from HITL_GATE_URL and passed in via data-gate-url
  // on #queue-container (see review.astro). Fallback keeps the script working
  // if the attribute is ever missing.
  const workerUrl =
    queueContainer.dataset.gateUrl ||
    "https://quirgs-hitl-gate.elbrigante9.workers.dev";
  
  // 1. Initialize token state
  let currentToken = sessionStorage.getItem("hitl_write_token") || "";
  if (currentToken) {
    tokenInput.value = currentToken;
  }
  updateTokenState(currentToken);
  
  // 2. Fetch and render queue
  loadQueue();
  
  // 3. Event listeners
  setTokenBtn.addEventListener("click", () => {
    const token = tokenInput.value.trim();
    updateTokenState(token);
  });
  
  // Also handle Enter key in token input
  tokenInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const token = tokenInput.value.trim();
      updateTokenState(token);
    }
  });

  function updateTokenState(token) {
    currentToken = token;
    if (token) {
      sessionStorage.setItem("hitl_write_token", token);
      tokenStatusLine.innerHTML = 'Status: <span class="text-green">✓ Token set — write operations enabled</span>';
    } else {
      sessionStorage.removeItem("hitl_write_token");
      tokenStatusLine.innerHTML = 'Status: <span class="text-yellow">○ No token set</span>';
    }
    // Update disabled state of all action buttons on the page
    document.querySelectorAll(".action-btn").forEach(btn => {
      btn.disabled = !token;
    });
  }
  
  function formatCreatedDate(timestampSeconds) {
    if (!timestampSeconds) return '—';
    const date = new Date(timestampSeconds * 1000);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    let hour = date.getHours();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month} ${day}, ${year} at ${hour}:${minutes} ${ampm}`;
  }
  
  async function loadQueue() {
    queueContainer.innerHTML = '<div class="line">Fetching queue...</div>';
    
    try {
      const response = await fetch(`${workerUrl}/events`);
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }
      
      const events = await response.json();
      // Filter client-side to status === 'pending'
      const pendingEvents = events.filter(e => e.status === 'pending');
      
      if (pendingEvents.length === 0) {
        queueContainer.innerHTML = '<div class="line"><span class="text-green">[OK]</span> Queue is clear — no pending events.</div>';
        return;
      }
      
      queueContainer.innerHTML = "";
      pendingEvents.forEach(event => {
        const card = document.createElement("div");
        card.className = "event-card";
        card.id = `card-${event.id}`;
        
        const payload = event.payload || {};
        const item = payload.item || '—';
        const stage = payload.stage || '—';
        const frameworks = (payload.frameworks && payload.frameworks.length) ? payload.frameworks.join(', ') : '—';
        const receivedStr = formatCreatedDate(event.created_at);
        
        card.innerHTML = `
          <div class="line divider">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
          <div class="line event-title-row">
            <span>EVENT  <span class="text-bright">${event.id.slice(0, 8)}...</span></span>
            <span class="status-label status-pending text-yellow">pending</span>
          </div>
          <div class="line">Type:  <span class="text-bright">${event.type || '—'}</span></div>
          <div class="line">Item:  <span class="text-bright">${item}</span></div>
          <div class="line">Stage: <span class="text-bright">${stage}</span></div>
          <div class="line">Frameworks: <span class="text-bright">${frameworks}</span></div>
          <div class="line">Received: <span class="text-bright">${receivedStr}</span></div>
          <div class="line divider">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
          
          <div class="card-actions" id="actions-${event.id}">
            <button class="action-btn approve-btn" data-id="${event.id}">[ Approve ]</button>
            <button class="action-btn reject-btn" data-id="${event.id}">[ Reject ]</button>
          </div>
          <div class="error-line text-red" id="error-${event.id}" style="display: none; margin-top: 8px;"></div>
        `;
        
        queueContainer.appendChild(card);
      });
      
      // Re-apply disabled state to new buttons based on current token
      document.querySelectorAll(".action-btn").forEach(btn => {
        btn.disabled = !currentToken;
      });
      
      // Wire up actions
      queueContainer.querySelectorAll(".approve-btn").forEach(btn => {
        btn.addEventListener("click", () => handleAction(btn.dataset.id, "approved"));
      });
      
      queueContainer.querySelectorAll(".reject-btn").forEach(btn => {
        btn.addEventListener("click", () => handleAction(btn.dataset.id, "rejected"));
      });
      
    } catch (err) {
      queueContainer.innerHTML = `<div class="line text-red">[ERR] Failed to load queue: ${err.message}</div>`;
    }
  }
  
  async function handleAction(id, status) {
    const cardActions = document.getElementById(`actions-${id}`);
    const errorLine = document.getElementById(`error-${id}`);
    const approveBtn = cardActions.querySelector(".approve-btn");
    const rejectBtn = cardActions.querySelector(".reject-btn");
    
    // Clear previous errors
    errorLine.style.display = "none";
    errorLine.textContent = "";
    
    // Disable buttons and show loading status
    approveBtn.disabled = true;
    rejectBtn.disabled = true;
    
    if (status === "approved") {
      approveBtn.textContent = "Approving...";
    } else {
      rejectBtn.textContent = "Rejecting...";
    }
    
    try {
      const response = await fetch(`${workerUrl}/events/${id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${currentToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        let errMsg = response.statusText;
        try {
          const errJson = await response.json();
          if (errJson && errJson.message) {
            errMsg = errJson.message;
          }
        } catch (_) {}
        throw new Error(errMsg || `HTTP error ${response.status}`);
      }
      
      // Update UI inline on success
      if (status === "approved") {
        cardActions.innerHTML = '<span class="text-green">✓ Approved</span>';
        const card = document.getElementById(`card-${id}`);
        if (card) {
          const statusLabel = card.querySelector(".status-label");
          if (statusLabel) {
            statusLabel.textContent = "approved";
            statusLabel.className = "status-label status-approved text-green";
          }
        }
      } else {
        cardActions.innerHTML = '<span class="text-red">✗ Rejected</span>';
        const card = document.getElementById(`card-${id}`);
        if (card) {
          const statusLabel = card.querySelector(".status-label");
          if (statusLabel) {
            statusLabel.textContent = "rejected";
            statusLabel.className = "status-label status-rejected text-red";
          }
        }
      }
    } catch (err) {
      errorLine.textContent = `[ERR] ${err.message}`;
      errorLine.style.display = "block";
      
      // Reset buttons
      approveBtn.disabled = false;
      rejectBtn.disabled = false;
      approveBtn.textContent = "[ Approve ]";
      rejectBtn.textContent = "[ Reject ]";
    }
  }
});
