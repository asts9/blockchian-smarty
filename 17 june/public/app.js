const form = document.querySelector("#record-form");
const list = document.querySelector("#record-list");
const status = document.querySelector("#status");

function render(records) {
  if (!records.length) {
    list.innerHTML = '<p class="muted">No entries yet. Be the first to publish.</p>';
    return;
  }
  list.innerHTML = records.slice().reverse().map((record) => `
    <article class="record">
      <div class="record-meta"><strong>${escapeHtml(record.name)}</strong><span>#${record.id} · ${new Date(record.createdAt).toLocaleString()}</span></div>
      <p>${escapeHtml(record.content)}</p>
      <code>${record.owner.slice(0, 8)}…${record.owner.slice(-6)}</code>
    </article>
  `).join("");
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character]));
}

async function loadRecords() {
  const response = await fetch("/api/records");
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Unable to load records.");
  render(data);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  status.textContent = "Waiting for the transaction to be mined…";
  status.className = "";
  try {
    const response = await fetch("/api/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name.value, content: form.content.value }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Transaction failed.");
    status.textContent = `Published in transaction ${data.transactionHash.slice(0, 12)}…`;
    status.className = "success";
    form.reset();
    await loadRecords();
  } catch (error) {
    status.textContent = error.message;
    status.className = "error";
  }
});

document.querySelector("#refresh").addEventListener("click", () => loadRecords().catch((error) => {
  list.innerHTML = `<p class="error">${escapeHtml(error.message)}</p>`;
}));
loadRecords().catch((error) => {
  list.innerHTML = `<p class="error">${escapeHtml(error.message)}</p>`;
});
