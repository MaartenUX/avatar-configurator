import { Avatar } from '../../components'
import { avatarById } from '../../data/avatars'
import { sceneLabel } from '../../data/copy'
import { backgroundImage } from '../../lib/assets'
import { useNow } from '../../state/TickProvider'
import type { Config } from '../../state/types'
import { cn } from '../../lib/cn'

/** Zes scènes: intro, vier keer inhoud, outro (CHANGES-03 A4). */
const SCENES = 6
/** Hoe lang een scène in de preview duurt. Alleen hier; de echte video duurt 2:00. */
const SCENE_MS = 2500
/** De logoflits tussen twee scènes. */
const FLITS_MS = 600

/**
 * De preview bij sectie 3: het staande videoframe dat de gekozen overgang
 * voordoet, met daaronder de tijdlijn van zes scènes (CHANGES-03 C12).
 *
 * Hij loopt vanzelf rond — er is niets af te spelen, je kijkt naar wat de
 * keuze rechts doet. De tijd komt uit de enige ticker in de app, dus een
 * reload zet de animatie niet terug naar scène 1.
 */
export function OvergangPreview({ config }: { config: Config }) {
  const now = useNow()
  const scene = Math.floor(now / SCENE_MS) % SCENES
  const sinds = now % SCENE_MS
  const logo = config.transition === 'logo'

  // Camerawissel: dichtbij en verder weg wisselen elkaar per scène af.
  const ingezoomd = !logo && scene % 2 === 1
  // Logo: een kort vlak in de huisstijlkleur op elke scènewissel.
  const flits = logo && sinds < FLITS_MS

  const slug = config.backgrounds[scene] ?? (scene % 2 === 0 ? 'kantoor-1' : 'kantoor-3')
  const bg = backgroundImage(slug)
  const avatar = avatarById(config.avatars[config.languages[0] ?? 'nl'])

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative aspect-[9/16] w-[62%] overflow-hidden rounded-md bg-gray-1 shadow-card">
        <div
          className={cn(
            'absolute inset-0 blur-[7px] transition-transform duration-[400ms] ease-[cubic-bezier(.22,1,.36,1)]',
            ingezoomd ? 'scale-[1.35]' : 'scale-105',
          )}
          style={
            bg
              ? { backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : { background: 'linear-gradient(160deg, #CDEFEC 0%, #E6FAFF 60%, #FFD9C8 100%)' }
          }
        />

        <span
          className={cn(
            'absolute inset-x-0 bottom-0 flex justify-center transition-transform duration-[400ms] ease-[cubic-bezier(.22,1,.36,1)]',
            ingezoomd && 'scale-[1.35]',
          )}
        >
          <Avatar face={avatar?.face} name={avatar?.name} speaking className="h-[72%] w-3/4" />
        </span>

        {flits && (
          <span
            className="absolute inset-0 grid place-items-center"
            style={{ background: config.primary ?? '#828282' }}
          >
            <span className="text-h3 font-semibold text-white">Bergrode</span>
          </span>
        )}
      </div>

      {/* De tijdlijn: zes blokjes, het lopende blokje licht op. */}
      <div className="flex w-full max-w-[280px] flex-col gap-1.5">
        <div className="flex gap-1">
          {Array.from({ length: SCENES }, (_, i) => (
            <span
              key={i}
              className={cn(
                'h-2 flex-1 rounded-pill transition-colors duration-300',
                i === scene ? 'bg-blue' : 'bg-gray-5',
              )}
            />
          ))}
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="type-label text-gray-3">{sceneLabel(scene, SCENES)}</span>
          <span className="text-body-sm text-gray-3">max 2:00</span>
        </div>
      </div>
    </div>
  )
}
