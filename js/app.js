
/**
 * Main application entry point
 */

// Initialize authentication and router after DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize auth first
  await Auth.init();
  
  // Then initialize router
  Router.init();
});
