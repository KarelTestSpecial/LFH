document.addEventListener('DOMContentLoaded', () => {
    // Get handles to the placeholder elements
    const breadcrumbContainer = document.getElementById('breadcrumb-container');
    const topicTitleElement = document.getElementById('topic-title');
    const topicContentElement = document.getElementById('topic-content');

    // Get the URL parameters
    const params = new URLSearchParams(window.location.search);
    const pathString = params.get('path');

    if (pathString) {
        // Decode the path string (e.g., from %20 to space)
        const decodedPath = decodeURIComponent(pathString);

        // Split the path into segments
        const pathSegments = decodedPath.split(' > ');

        // The last segment is the main title of the topic
        const topicTitle = pathSegments[pathSegments.length - 1];

        // Set the document and page titles
        document.title = topicTitle;
        topicTitleElement.textContent = topicTitle;

        // Set the breadcrumb text
        breadcrumbContainer.textContent = `Pad: ${decodedPath}`;

        // Set the placeholder content
        topicContentElement.innerHTML = `
            <p>De content voor dit specifieke onderwerp wordt binnenkort toegevoegd.</p>
            <p>In een toekomstige versie zal hier door AI-gegenereerde informatie verschijnen over <strong>${topicTitle}</strong>.</p>
        `;

    } else {
        // Handle cases where no path is provided
        document.title = 'Fout: Onderwerp niet gevonden';
        topicTitleElement.textContent = 'Onderwerp niet gevonden';
        topicContentElement.textContent = 'Er is geen onderwerp-pad meegestuurd in de URL.';
    }
});
