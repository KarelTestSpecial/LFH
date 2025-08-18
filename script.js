document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('accordion-container');

    // Initial call to fetch data and start the process
    async function initAccordion() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`HTTP-fout! Status: ${response.status}`);
            }
            const data = await response.json();

            if (data.length > 0) {
                // Start the recursive build from the top level
                buildAccordion(data, container);
                attachEventListeners();
            } else {
                container.innerHTML = '<p>Geen data gevonden.</p>';
            }
        } catch (error) {
            container.innerHTML = '<p>Er is een fout opgetreden bij het laden van de content.</p>';
            console.error('Fout bij het ophalen of parsen van data.json:', error);
        }
    }

    // --- START VAN DE WIJZIGING ---

    // 2. Recursieve functie om de HTML-structuur op te bouwen, nu met pad-informatie.
    function buildAccordion(items, parentElement, currentPath = []) {
        if (!items || items.length === 0) {
            return;
        }

        items.forEach(item => {
            const accordionItem = document.createElement('div');
            accordionItem.className = 'accordion-item';

            const button = document.createElement('button');
            button.className = 'accordion-button';

            // Creëer het nieuwe pad en de URL
            const newPath = [...currentPath, item.title];
            const pathString = newPath.join(' > ');
            const urlEncodedPath = encodeURIComponent(pathString);

            // Creëer de hyperlink
            const link = document.createElement('a');
            link.textContent = item.title;
            link.href = `topic.html?path=${urlEncodedPath}`;

            // Voeg de link toe aan de knop
            button.appendChild(link);

            const panel = document.createElement('div');
            panel.className = 'accordion-panel';

            accordionItem.appendChild(button);
            accordionItem.appendChild(panel);
            parentElement.appendChild(accordionItem);

            // De recursieve aanroep met het bijgewerkte pad.
            if (item.children && item.children.length > 0) {
                buildAccordion(item.children, panel, newPath);
            } else {
                button.classList.add('no-children');
            }
        });
    }

    // 3. Aangepaste event listener om onderscheid te maken tussen klikken.
    function attachEventListeners() {
        container.addEventListener('click', function(event) {
            // Als de gebruiker direct op de link klikt, doe dan niets.
            // De browser zal de navigatie zelf afhandelen.
            if (event.target.tagName === 'A') {
                // We hoeven de accordion niet te togglen.
                return;
            }

            const button = event.target.closest('.accordion-button');

            // Als er op de knop (maar niet op de link) is geklikt, toggle de accordeon.
            if (button && !button.classList.contains('no-children')) {
                event.preventDefault(); // Voorkom onverwacht gedrag
                button.classList.toggle('active');
                const panel = button.nextElementSibling;
                panel.classList.toggle('is-open');
            }
        });
    }

    // --- EINDE VAN DE WIJZIGING ---

    const style = document.createElement('style');
    // Voeg stijl toe zodat de link de hele knop vult, maar de plus/min knop apart blijft
    style.textContent = `
        .accordion-button a {
            text-decoration: none;
            color: inherit;
            display: block;
            flex-grow: 1;
        }
        .accordion-button.no-children::after {
            content: "";
        }
    `;
    document.head.appendChild(style);

    initAccordion();
});
