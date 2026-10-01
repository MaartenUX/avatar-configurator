import type { Lang, SubtitleLine } from '../state/types'

/**
 * De demovideo is kort: hij laat de instellingen zien, niet een hele pagina.
 * Daarom veertig seconden en niet de volle twee minuten van een echte video.
 */
export const DEMO_DUUR = 40

/**
 * De voorbeeldtekst van de demo. Hij noemt de gemeente niet (CHANGES-03 E20):
 * je kijkt naar je avatars, achtergronden en overgang, niet naar een pagina.
 *
 * Zes scènes, twee regels per scène. Talen zonder eigen tekst vallen terug op
 * het Nederlands; de demoset is NL, EN, TR en AR.
 */
const NL: SubtitleLine[] = [
  { t: '0:00', text: 'Dit is een voorbeeld van een uitlegvideo.' },
  { t: '0:03', text: 'Zo ziet uw bezoeker het straks.' },
  { t: '0:07', text: 'De tekst komt van de pagina zelf.' },
  { t: '0:10', text: 'Wij maken er een korte samenvatting van.' },
  { t: '0:14', text: 'Een video duurt maximaal twee minuten.' },
  { t: '0:17', text: 'Hij bestaat uit vier tot zes korte scènes.' },
  { t: '0:21', text: 'De avatar spreekt de taal van de bezoeker.' },
  { t: '0:24', text: 'Onderin loopt de ondertiteling mee.' },
  { t: '0:28', text: 'Achter de avatar staat uw eigen beeld.' },
  { t: '0:31', text: 'Tussen de scènes zit uw eigen overgang.' },
  { t: '0:35', text: 'Dit was de voorbeeldvideo.' },
  { t: '0:37', text: 'Dank u wel voor het kijken.' },
]

const EN: SubtitleLine[] = [
  { t: '0:00', text: 'This is an example of an explainer video.' },
  { t: '0:03', text: 'This is what your visitor will see.' },
  { t: '0:07', text: 'The text comes from the page itself.' },
  { t: '0:10', text: 'We turn it into a short summary.' },
  { t: '0:14', text: 'A video lasts two minutes at most.' },
  { t: '0:17', text: 'It has four to six short scenes.' },
  { t: '0:21', text: 'The avatar speaks the visitor’s language.' },
  { t: '0:24', text: 'Subtitles run along at the bottom.' },
  { t: '0:28', text: 'Behind the avatar is your own image.' },
  { t: '0:31', text: 'Between the scenes is your transition.' },
  { t: '0:35', text: 'That was the example video.' },
  { t: '0:37', text: 'Thank you for watching.' },
]

const TR: SubtitleLine[] = [
  { t: '0:00', text: 'Bu, bir bilgilendirme videosu örneğidir.' },
  { t: '0:03', text: 'Ziyaretçiniz bunu böyle görecek.' },
  { t: '0:07', text: 'Metin, sayfanın kendisinden gelir.' },
  { t: '0:10', text: 'Biz bundan kısa bir özet yapıyoruz.' },
  { t: '0:14', text: 'Bir video en fazla iki dakika sürer.' },
  { t: '0:17', text: 'Dört ila altı kısa sahneden oluşur.' },
  { t: '0:21', text: 'Avatar, ziyaretçinin dilinde konuşur.' },
  { t: '0:24', text: 'Altyazılar altta birlikte akar.' },
  { t: '0:28', text: 'Avatarın arkasında kendi görseliniz var.' },
  { t: '0:31', text: 'Sahneler arasında seçtiğiniz geçiş var.' },
  { t: '0:35', text: 'Bu, örnek videoydu.' },
  { t: '0:37', text: 'İzlediğiniz için teşekkürler.' },
]

const AR: SubtitleLine[] = [
  { t: '0:00', text: 'هذا مثال على فيديو توضيحي.' },
  { t: '0:03', text: 'هكذا سيراه زائر موقعكم.' },
  { t: '0:07', text: 'النص مأخوذ من الصفحة نفسها.' },
  { t: '0:10', text: 'ونحوّله إلى ملخص قصير.' },
  { t: '0:14', text: 'يستغرق الفيديو دقيقتين كحد أقصى.' },
  { t: '0:17', text: 'ويتكون من أربع إلى ست مشاهد قصيرة.' },
  { t: '0:21', text: 'يتحدث الأفاتار بلغة الزائر.' },
  { t: '0:24', text: 'وتظهر الترجمة في الأسفل.' },
  { t: '0:28', text: 'وخلف الأفاتار صورتكم الخاصة.' },
  { t: '0:31', text: 'وبين المشاهد الانتقال الذي اخترتموه.' },
  { t: '0:35', text: 'كان هذا هو الفيديو التجريبي.' },
  { t: '0:37', text: 'شكرًا لمشاهدتكم.' },
]

const DEMO: Partial<Record<Lang, SubtitleLine[]>> = { nl: NL, en: EN, tr: TR, ar: AR }

export const demoSubtitles = (lang: Lang) => DEMO[lang] ?? NL
