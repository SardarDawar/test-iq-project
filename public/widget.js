/**
 * ICEAS Widget - Embeddable Assessment Integration
 *
 * Usage:
 * <div id="iceas-widget"></div>
 * <script src="https://your-domain.com/widget.js"
 *         data-client="tenant-id"
 *         data-mode="default|custom|leadership">
 * </script>
 */

(function() {
  'use strict';

  // Get script element and extract configuration
  const currentScript = document.currentScript || document.querySelector('script[src*="widget.js"]');
  const config = {
    clientId: currentScript?.getAttribute('data-client') || 'default',
    mode: currentScript?.getAttribute('data-mode') || 'default',
    baseUrl: currentScript?.getAttribute('data-url') || window.location.origin,
  };

  // Create widget container
  function initWidget() {
    const container = document.getElementById('iceas-widget');

    if (!container) {
      console.error('ICEAS Widget: Container element #iceas-widget not found');
      return;
    }

    // Create iframe for isolated widget
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '600px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '12px';
    iframe.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';

    // Build widget URL with parameters
    const widgetUrl = `${config.baseUrl}/widget?client=${config.clientId}&mode=${config.mode}`;
    iframe.src = widgetUrl;

    container.appendChild(iframe);

    // Listen for messages from widget
    window.addEventListener('message', handleWidgetMessage);
  }

  // Handle messages from widget iframe
  function handleWidgetMessage(event) {
    // Verify origin
    if (event.origin !== config.baseUrl) {
      return;
    }

    const { type, data } = event.data;

    switch (type) {
      case 'ASSESSMENT_COMPLETE':
        // Notify parent site that assessment is complete
        console.log('ICEAS: Assessment completed', data);
        // Trigger custom event
        window.dispatchEvent(new CustomEvent('iceas:complete', { detail: data }));
        break;

      case 'RESIZE':
        // Adjust iframe height
        const iframe = document.querySelector('#iceas-widget iframe');
        if (iframe && data.height) {
          iframe.style.height = data.height + 'px';
        }
        break;

      default:
        console.log('ICEAS: Unknown message type', type);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }

})();
