
import './style.css';

async function fetchCards() {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/cards");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const cards = await response.json();
        displayCards(cards);
    } catch (error) {
        console.error("Failed to fetch cards:", error);
    }
}

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

// Fetch cards on page load
fetchCards();
