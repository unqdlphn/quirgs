/**
 * Google Analytics Tracking Script
 * Include this file and use initializeAnalytics() to set up tracking on any page
 */

class QuirgsAnalytics {
    constructor(trackingId) {
        this.trackingId = trackingId || 'G-3V21VKRR7E'; // Default tracking ID
    }

    initialize() {
        // Add Google Analytics script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`;
        document.head.appendChild(script);
        
        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', this.trackingId);
        
        // Save gtag to window for future use
        window.gtag = gtag;
    }
}

// Function to initialize analytics with optional custom tracking ID
function initializeAnalytics(trackingId) {
    const analytics = new QuirgsAnalytics(trackingId);
    analytics.initialize();
}

// Auto-initialize with default tracking ID when script is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeAnalytics();
});
