
import './style.css';

// async function fetchCards() {
//     try {
//         const response = await fetch("http://127.0.0.1:8000/api/cards");
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//
//         const cards = await response.json();
//         displayCards(cards);
//     } catch (error) {
//         console.error("Failed to fetch cards:", error);
//     }
// }

function displayCards(cards: any[]) {
    const container = document.querySelector<HTMLDivElement>('#app');
    if (container) {
        container.innerHTML = `
            <h1>TCG Marketplace</h1>
            <div id="cards-container"></div>
        `;
        const cardsContainer = document.querySelector<HTMLDivElement>('#cards-container');

        if (cardsContainer) {
            cardsContainer.innerHTML = cards.map(card => `
                <div class="card">
                    <h3>${card.name}</h3>
                    <p><strong>Rarity:</strong> ${card.rarity}</p>
                    <p><strong>Price:</strong> $${card.price.toFixed(2)}</p>
                </div>
            `).join("");
        }
    }
}

async function fetchCards() {
    try {
        const response = await fetch("http://127.0.0.1:8080/cards");
        const cards = await response.json();

        const appDiv = document.querySelector<HTMLDivElement>('#app');
        if (!appDiv) return;

        appDiv.innerHTML = `
            <h1>TCG Card Collection</h1>
            <div class="card-container">
                ${cards.map((card: any) => `
                    <div class="card">
                        <img src="${card.image_url || 'default-placeholder.png'}" alt="${card.name}">
                        <h2>${card.name}</h2>
                        <p><strong>Rarity:</strong> ${card.rarity}</p>
                        <p><strong>Price:</strong> $${card.price.toFixed(2)}</p>
                        <p><strong>Set:</strong> ${card.set || 'Unknown'}</p>
                        <p><strong>Year:</strong> ${card.year || 'N/A'}</p>
                        <p><strong>Condition:</strong> ${card.condition || 'N/A'}</p>
                        <p><strong>Language:</strong> ${card.language || 'N/A'}</p>
                        <p><strong>Type:</strong> ${card.card_type || 'N/A'}</p>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (error) {
        console.error("Failed to fetch cards:", error);
    }
}


// Fetch cards on page load
fetchCards();
