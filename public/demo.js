// public/demo.js
// Client-side renderer for the fully static /demo/ queue. Zero network calls —
// the events are hardcoded here, and Approve/Reject only swap in a demo-mode
// message. This is loaded as an external 'self' script so it does not require a
// CSP hash entry in public/_headers.

const DEMO_EVENTS = [
  {
    id: "d3e9f1a2-0001-0000-0000-000000000001",
    type: "ai-transparency-notice",
    payload: {
      item: "Customer-facing chatbot disclosure",
      stage: "pre-publish",
      frameworks: ["EU AI Act Art. 13", "NIST AI RMF Govern"]
    },
    status: "pending",
    created_at: 1750845722 // Jun 25, 2026 10:02 AM
  },
  {
    id: "d3e9f1a2-0001-0000-0000-000000000002",
    type: "pii-exposure-check",
    payload: {
      item: "Onboarding dataset — Q2 2026 intake batch",
      stage: "data-review",
      frameworks: ["GDPR", "EU AI Act Art. 10"]
    },
    status: "pending",
    created_at: 1750775494 // Jun 24, 2026 2:31 PM
  },
  {
    id: "d3e9f1a2-0001-0000-0000-000000000003",
    type: "eu-ai-act-classification",
    payload: {
      item: "Customer sentiment analyzer — SaaS B2B",
      stage: "pre-deployment",
      frameworks: ["EU AI Act", "NIST AI RMF"]
    },
    status: "pending",
    created_at: 1750676054 // Jun 23, 2026 9:14 AM
  }
];

const DEMO_MESSAGE =
  '[INFO] Demo mode — actions are not saved. Connect your own gate to enable live reviews. → <a href="/hitl/">/hitl/</a>';

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("demo-queue-container");
  if (!container) return;

  function formatCreatedDate(timestampSeconds) {
    if (!timestampSeconds) return "—";
    const date = new Date(timestampSeconds * 1000);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    let hour = date.getHours();
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    hour = hour ? hour : 12;
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${month} ${day}, ${year} at ${hour}:${minutes} ${ampm}`;
  }

  // Render newest-first (DEMO_EVENTS already ordered newest → oldest).
  container.innerHTML = "";
  DEMO_EVENTS.forEach((event) => {
    const card = document.createElement("div");
    card.className = "event-card";
    card.id = `card-${event.id}`;

    const payload = event.payload || {};
    const item = payload.item || "—";
    const stage = payload.stage || "—";
    const frameworks =
      payload.frameworks && payload.frameworks.length ? payload.frameworks.join(", ") : "—";
    const receivedStr = formatCreatedDate(event.created_at);

    card.innerHTML = `
      <div class="line divider">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
      <div class="line event-title-row">
        <span>EVENT  <span class="text-bright">${event.id.slice(0, 8)}...</span></span>
        <span class="status-label status-pending text-yellow">pending</span>
      </div>
      <div class="line">Type:  <span class="text-bright">${event.type || "—"}</span></div>
      <div class="line">Item:  <span class="text-bright">${item}</span></div>
      <div class="line">Stage: <span class="text-bright">${stage}</span></div>
      <div class="line">Frameworks: <span class="text-bright">${frameworks}</span></div>
      <div class="line">Received: <span class="text-bright">${receivedStr}</span></div>
      <div class="line divider">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>

      <div class="card-actions" id="actions-${event.id}">
        <button class="action-btn approve-btn" data-id="${event.id}">[ Approve ]</button>
        <button class="action-btn reject-btn" data-id="${event.id}">[ Reject ]</button>
      </div>
    `;

    container.appendChild(card);
  });

  // Clicking Approve or Reject is a client-side DOM swap only — no fetch.
  container.querySelectorAll(".action-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const actions = document.getElementById(`actions-${btn.dataset.id}`);
      if (actions) {
        actions.innerHTML = `<div class="line text-yellow">${DEMO_MESSAGE}</div>`;
      }
    });
  });
});
