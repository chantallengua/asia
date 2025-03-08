const API_URL = "https://script.google.com/macros/s/AKfycbxHgipwsNYzVLJNvaOUytgpZb4LzwfRVQsIqDYdg95fiCL6ogleMvEegvb1ZZ-IHCKOoA/exec";  // Sostituisci con il tuo URL Apps Script

// Funzione per ottenere i dati dell'asta
async function getAstaItems() {
    try {
        const response = await fetch(API_URL);
        const items = await response.json();
        displayItems(items);
    } catch (error) {
        console.error("Errore nel caricamento dei dati dell'asta:", error);
    }
}

// Funzione per mostrare gli oggetti in asta nella pagina
function displayItems(items) {
    const container = document.getElementById("auction-items");
    container.innerHTML = ""; 

    items.forEach(item => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("auction-item");
        itemElement.innerHTML = `
            <img src="${item.immagine}" alt="${item.titolo}" class="item-image">
            <h3>${item.titolo}</h3>
            <p>${item.descrizione}</p>
            <p>Prezzo attuale: <strong>${item.prezzo}€</strong></p>
            <p>Ultimo offerente: ${item.migliorOfferente}</p>
            <input type="number" id="bid-${item.id}" placeholder="Fai un'offerta">
            <button onclick="sendBid(${item.id})">Invia offerta</button>
        `;
        container.appendChild(itemElement);
    });
}

// Funzione per inviare un'offerta
async function sendBid(id) {
    const bidInput = document.getElementById(`bid-${id}`);
    const offerta = parseFloat(bidInput.value);
    const email = prompt("Inserisci la tua email per confermare l'offerta:");

    if (!offerta || offerta <= 0 || !email) {
        alert("Inserisci un'offerta valida e un'email.");
        return;
    }

    try {
        // Prima eseguiamo una richiesta OPTIONS per abilitare CORS
        await fetch(API_URL, { method: "OPTIONS" });

        // Ora inviamo l'offerta
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id, offerta, email })
        });

        const text = await response.text();
        if (text === "Success") {
            alert(`Offerta inviata con successo: ${offerta}€ per l'oggetto ${id}`);
            getAstaItems(); // Aggiorna i dati
        } else {
            alert("Errore: " + text);
        }
    } catch (error) {
        console.error("Errore nell'invio dell'offerta:", error);
        alert("Errore nell'invio dell'offerta. Riprova.");
    }
}

// Carica gli oggetti dell'asta al caricamento della pagina
window.onload = getAstaItems;

