import { SpokeFrame } from '../../components/layout/SpokeLayout'

export default function Vertaling() {
  return (
    <SpokeFrame
      preview={
        <div className="grid aspect-video w-full place-items-center rounded-md bg-gray-6 text-body-sm text-gray-3">
          Preview
        </div>
      }
    >
      <h1 className="text-h2 text-gray-1">Vertaling controleren</h1>
      <p className="text-body text-gray-3">Deze stap wordt gebouwd in checkpoint 6.</p>
    </SpokeFrame>
  )
}
