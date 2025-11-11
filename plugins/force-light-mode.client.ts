export default defineNuxtPlugin(() => {
  // Force light mode on client side
  if (process.client) {
    // Remove dark class from html element
    const html = document.documentElement
    html.classList.remove('dark')
    
    // Create a MutationObserver to watch for dark class being added
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const target = mutation.target as HTMLElement
          if (target.classList.contains('dark')) {
            target.classList.remove('dark')
          }
        }
      })
    })
    
    // Start observing the html element for class changes
    observer.observe(html, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    // Also set color-scheme to light
    html.style.colorScheme = 'light'
    
    // Override any color mode detection
    if (window.localStorage) {
      window.localStorage.setItem('nuxt-color-mode', 'light')
      window.localStorage.setItem('vueuse-color-scheme', 'light')
    }
  }
})
