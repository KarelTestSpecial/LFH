document.addEventListener('DOMContentLoaded', () => {
    // Get handles to the placeholder elements
    const breadcrumbContainer = document.getElementById('breadcrumb-container');
    const topicTitleElement = document.getElementById('topic-title');
    const topicContentElement = document.getElementById('topic-content');

    // Get the URL parameters
    const params = new URLSearchParams(window.location.search);
    const pathString = params.get('path');

    if (pathString) {
        // Decode the path string and extract the title
        const decodedPath = decodeURIComponent(pathString);
        const pathSegments = decodedPath.split(' > ');
        const topicTitle = pathSegments[pathSegments.length - 1];

        // Populate the page with the info from the URL
        document.title = topicTitle;
        topicTitleElement.textContent = topicTitle;
        breadcrumbContainer.textContent = `Path: ${decodedPath}`;
        topicContentElement.innerHTML = `
            <p>The content for this specific topic will be added soon.</p>
            <p>In a future version, AI-generated information about <strong>${topicTitle}</strong> will appear here.</p>
        `;
    } else {
        // Handle cases where no path is provided
        document.title = 'Error: Topic not found';
        topicTitleElement.textContent = 'Topic not found';
        topicContentElement.textContent = 'No topic path was provided in the URL.';
    }
});
