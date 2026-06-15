import WPApp from './App.jsx'
import { IOSDevice } from './ios-frame.jsx'

function boot() {
  if (!window.WhoPaidDesignSystem_ce3383 || !window.lucide) {
    setTimeout(boot, 40)
    return
  }

  // Mobile: full-screen native feel. Desktop: iOS device frame centered on gradient.
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 500

  let Frame, padTop, padBottom

  if (isMobile) {
    document.documentElement.style.cssText = 'height:100%;'
    document.body.style.cssText = 'margin:0;padding:0;height:100dvh;overflow:hidden;background:var(--surface-app);'
    Frame = ({ children }) => (
      <div style={{ width: '100%', height: '100dvh', overflow: 'hidden', position: 'relative' }}>
        {children}
      </div>
    )
    padTop = 'env(safe-area-inset-top, 44px)'
    padBottom = 'env(safe-area-inset-bottom, 34px)'
  } else {
    document.body.style.cssText = 'margin:0;background:radial-gradient(120% 90% at 50% 0%,#FCEFE0 0%,#F3E7DA 60%,#EADCCB 100%);display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px;box-sizing:border-box;'

    const stage = document.getElementById('stage')
    stage.style.transformOrigin = 'center'

    function fit() {
      const s = Math.min(1, (window.innerHeight - 48) / 874, (window.innerWidth - 48) / 402)
      stage.style.transform = `scale(${s})`
    }
    window.addEventListener('resize', fit)
    fit()

    Frame = ({ children }) => <IOSDevice>{children}</IOSDevice>
    padTop = '54px'
    padBottom = '18px'
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <WPApp Frame={Frame} padTop={padTop} padBottom={padBottom} />
  )
}

boot()
