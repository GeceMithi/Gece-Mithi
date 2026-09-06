const DOWNLOAD_URL_CATEGORIES = new Set([
    'study-materials',
    'notes',
    'past-papers',
    'portfolios',
    'tools'
]);

export const convertShareUrlToDownloadUrl = (rawUrl) => {
    if (!rawUrl || typeof rawUrl !== 'string') return '';

    const trimmedUrl = rawUrl.trim();
    if (!trimmedUrl) return '';

    try {
        const url = new URL(trimmedUrl);
        const driveId = url.searchParams.get('id');
        if (driveId && url.hostname.includes('google.com')) {
            return `https://drive.google.com/uc?export=download&id=${driveId}`;
        }
    } catch (error) {
        // Fall back to the supported share-link formats below.
    }

    const match = trimmedUrl.match(/(?:drive\.google\.com\/(?:file\/d|d)\/|drive\.google\.com\/open\?id=)([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
        return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }

    return trimmedUrl;
};

export const convertResourceUrl = (category, rawUrl) => (
    DOWNLOAD_URL_CATEGORIES.has(category)
        ? convertShareUrlToDownloadUrl(rawUrl)
        : (typeof rawUrl === 'string' ? rawUrl.trim() : '')
);