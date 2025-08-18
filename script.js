document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('accordion-container');

    // 1. Functie om de data op te halen en de accordeon te initialiseren
    async function initAccordion() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`HTTP-fout! Status: ${response.status}`);
            }
            const data = await response.json();

            if (data.length > 0) {
                // We roepen de recursieve functie aan voor de top-level items
                buildAccordion(data, container);
                // Nadat de HTML is gebouwd, voegen we de event listeners toe
                attachEventListeners();
            } else {
                container.innerHTML = '<p>Geen data gevonden.</p>';
            }
        } catch (error) {
            container.innerHTML = '<p>Er is een fout opgetreden bij het laden van de content.</p>';
            console.error('Fout bij het ophalen of parsen van data.json:', error);
        }
    }

    // 2. Recursieve functie om de HTML-structuur op te bouwen
    function buildAccordion(items, parentElement) {
        if (!items || items.length === 0) {
            return; // Stop als er geen (sub)items zijn
        }

        items.forEach(item => {
            const accordionItem = document.createElement('div');
            accordionItem.className = 'accordion-item';

            const button = document.createElement('button');
            button.className = 'accordion-button';
            button.textContent = item.title;

            const panel = document.createElement('div');
            panel.className = 'accordion-panel';

            accordionItem.appendChild(button);
            accordionItem.appendChild(panel);
            parentElement.appendChild(accordionItem);

            // Als er kinderen zijn, roep de functie opnieuw aan voor de sub-items
            if (item.children && item.children.length > 0) {
                buildAccordion(item.children, panel);
            } else {
                // Als er geen kinderen zijn, voegen we een class toe om het icoon te verbergen
                button.classList.add('no-children');
            }
        });
    }

    // 3. Functie om event listeners toe te voegen aan alle knoppen
    function attachEventListeners() {
        // We gebruiken event delegation voor betere performance
        container.addEventListener('click', function(event) {
            const button = event.target.closest('.accordion-button');

            // Check of er wel op een knop is geklikt en of deze niet de 'no-children' class heeft
            if (button && !button.classList.contains('no-children')) {
                button.classList.toggle('active');
                const panel = button.nextElementSibling;

                // De CSS regelt de animatie via de 'max-height' transitie
                if (panel.style.maxHeight) {
                    // Als het paneel open is, sluit het
                    panel.style.maxHeight = null;
                    panel.classList.remove('show');
                } else {
                    // Als het paneel gesloten is, open het
                    panel.classList.add('show');
                    // Zet max-height op de daadwerkelijke hoogte van de content voor de animatie
                    panel.style.maxHeight = panel.scrollHeight + 'px';
                }
            }
        });
    }

    // Voeg een kleine CSS-regel toe via JavaScript om het plus-icoon te verbergen
    // bij items zonder kinderen. Dit is schoner dan een extra class in de HTML.
    const style = document.createElement('style');
    style.textContent = '.accordion-button.no-children::after { content: ""; }';
    document.head.appendChild(style);

    // Start het hele proces
    initAccordion();
});
