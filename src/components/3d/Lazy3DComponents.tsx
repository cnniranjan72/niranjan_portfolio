import { lazy, Suspense } from 'react'

// Lazy load the 3D scene to prevent initial conflicts
const LazyVerySimpleNeonScene = lazy(() => 
  import('./VerySimpleNeonScene')
)

const LazySimpleFloatingTechLogos = lazy(() => 
  import('./SimpleFloatingTechLogos')
)

export const Lazy3DComponents = () => {
  return (
    <Suspense fallback={null}>
      <LazyVerySimpleNeonScene />
      <LazySimpleFloatingTechLogos />
    </Suspense>
  )
}
