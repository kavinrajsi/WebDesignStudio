import HyperDX from '@hyperdx/browser'

type HyperDXInstance = ReturnType<typeof HyperDX.init>

let hyperdx: HyperDXInstance | null = null

// Export a function to initialize HyperDX in the browser
export function initHyperDX() {
  if (typeof window !== 'undefined' && !hyperdx) {
    hyperdx = HyperDX.init({
      apiKey: process.env.NEXT_PUBLIC_HYPERDX_API_KEY || '',
      service: 'seoauditsolutions',
      consoleCapture: true, // Capture console logs
      advancedNetworkCapture: true, // Capture full HTTP request/response headers and bodies (default false)
    })
  }
  return hyperdx
} 