document.addEventListener('DOMContentLoaded', () => {
    // This is the main function that runs when the page loads
    const handleTopicPage = async () => {
        // Get handles to the placeholder elements
        const breadcrumbContainer = document.getElementById('breadcrumb-container');
        const topicTitleElement = document.getElementById('topic-title');
        const topicContentElement = document.getElementById('topic-content');

        // Get the URL parameters
        const params = new URLSearchParams(window.location.search);
        const pathString = params.get('path');

        if (!pathString) {
            // Handle cases where no path is provided
            document.title = 'Fout: Onderwerp niet gevonden';
            topicTitleElement.textContent = 'Onderwerp niet gevonden';
            topicContentElement.textContent = 'Er is geen onderwerp-pad meegestuurd in de URL.';
            return;
        }

        const decodedPath = decodeURIComponent(pathString);
        const pathSegments = decodedPath.split(' > ');
        const topicTitle = pathSegments[pathSegments.length - 1];

        try {
            // Fetch the list of topics that have dedicated content
            const response = await fetch('content-manifest.json');
            if (!response.ok) {
                throw new Error('Kon content-manifest niet laden.');
            }
            const manifest = await response.json();

            // Check if the current topic's path exists in the manifest
            if (manifest.includes(decodedPath)) {
                // --- SCENARIO 1: Content page exists ---
                // Populate the page as before
                document.title = topicTitle;
                topicTitleElement.textContent = topicTitle;
                breadcrumbContainer.textContent = `Pad: ${decodedPath}`;
                topicContentElement.innerHTML = `
                    <p>De content voor dit specifieke onderwerp wordt binnenkort toegevoegd.</p>
                    <p>In een toekomstige versie zal hier door AI-gegenereerde informatie verschijnen over <strong>${topicTitle}</strong>.</p>
                `;
            } else {
                // --- SCENARIO 2: No content page, redirect to Google Search ---
                console.log(`Geen specifieke content voor '${topicTitle}'. Gebruiker wordt doorgestuurd naar Google.`);
                const searchQuery = encodeURIComponent(topicTitle);
                const searchUrl = `https://duckduckgo.com/?q=${searchQuery}`;

                // Show a friendly message before redirecting
                topicTitleElement.textContent = `Zoeken naar: ${topicTitle}`;
                breadcrumbContainer.textContent = `Pad: ${decodedPath}`;
                topicContentElement.innerHTML = `<p>Geen specifieke pagina gevonden. U wordt nu doorgestuurd naar een zoekmachine voor de meest recente informatie...</p>`;

                // Open the search in a new tab
                window.open(searchUrl, '_blank');
                // Go back to the main page so the user isn't left on a blank "redirecting" page
                window.history.back();
            }
        } catch (error) {
            console.error("Fout bij het verwerken van de topic pagina:", error);
            topicTitleElement.textContent = 'Fout';
            topicContentElement.textContent = 'Er is een fout opgetreden bij het laden van de pagina-informatie.';
        }
    };

    handleTopicPage();
});
