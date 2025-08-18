document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('accordion-container');

    async function initAccordion() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`HTTP-fout! Status: ${response.status}`);
            }
            const data = await response.json();

            if (data.length > 0) {
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

    function buildAccordion(items, parentElement) {
        if (!items || items.length === 0) {
            return;
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

            // De recursieve aanroep bouwt de volgende laag direct BINNEN het paneel.
            if (item.children && item.children.length > 0) {
                buildAccordion(item.children, panel);
            } else {
                button.classList.add('no-children');
            }
        });
    }

    function attachEventListeners() {
        container.addEventListener('click', function(event) {
            const button = event.target.closest('.accordion-button');

            if (!button || button.classList.contains('no-children')) {
                return;
            }

            // Stop het event van opbubbelen om te voorkomen dat bovenliggende
            // accordeons ook reageren op de klik.
            event.stopPropagation();

            button.classList.toggle('active');
            const panel = button.nextElementSibling;
            panel.classList.toggle('is-open');
        });
    }

    const style = document.createElement('style');
    style.textContent = '.accordion-button.no-children::after { content: ""; }';
    document.head.appendChild(style);

    initAccordion();
});
