async function loadItems() {
    const response = await fetch("https://script.google.com/macros/s/AKfycbydcH6IJ3_ZP0SPXPSRiKBJ8XsftT9R2rKoNUyFnuDbYDAb2MDlecWA2ifOQXzf6iog2A/exec");
    const items = await response.json();

    let html = "";
    items.forEach(item => {
        html += `<div class="item">
            <h2>${item.titolo}</h2>
            <img src="${item.immagine}" width="100">
            <p>${item.descrizione}</p>
            <p>Prezzo attuale: <span class="price">${item.prezzo}</span>€</p>
            <p><strong>${item.aperta ? "🟢 Asta Aperta" : "🔴 Asta Chiusa"}</strong></p>
            ${item.aperta ? `<button onclick="placeBid(${item.id})">Fai un'offerta</button>` : ""}
        </div>`;
    });

    document.getElementById("items").innerHTML = html;
}

async function placeBid(itemId) {
    let offerta = prompt("Inserisci la tua offerta:");
    let email = prompt("Inserisci la tua email:");

    if (!offerta || !email) return alert("Inserisci tutti i dati!");

    let response = await fetch("https://script.google.com/macros/s/XXXXX/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itemId, offerta: Number(offerta), email })
    });

    let result = await response.text();
    if (result === "Success") alert("Offerta registrata con successo!");
    else alert(result);
}

loadItems();

