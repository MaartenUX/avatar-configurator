import type { Lang, SubtitleLine } from '../state/types'

/** Zo lang duurt de aangeleverde demovideo. */
export const DEMO_DUUR = 52

/**
 * De voorbeeldtekst van de demo. Hij noemt de gemeente niet (CHANGES-03 E20):
 * je kijkt naar je avatars, achtergronden en overgang, niet naar een pagina.
 *
 * Zes scènes, twee regels per scène. Talen zonder eigen tekst vallen terug op
 * het Nederlands; de demoset is NL, EN, TR en AR.
 */
const NL: SubtitleLine[] = [
  { t: '0:00', text: 'Dit is een voorbeeld van een uitlegvideo.' },
  { t: '0:04', text: 'Zo ziet uw bezoeker het straks.' },
  { t: '0:09', text: 'De tekst komt van de pagina zelf.' },
  { t: '0:13', text: 'Wij maken er een korte samenvatting van.' },
  { t: '0:18', text: 'Een video duurt maximaal twee minuten.' },
  { t: '0:22', text: 'Hij bestaat uit vier tot zes korte scènes.' },
  { t: '0:27', text: 'De avatar spreekt de taal van de bezoeker.' },
  { t: '0:40', text: 'Onderin loopt de ondertiteling mee.' },
  { t: '0:36', text: 'Achter de avatar staat uw eigen beeld.' },
  { t: '0:40', text: 'Tussen de scènes zit uw eigen overgang.' },
  { t: '0:45', text: 'Dit was de voorbeeldvideo.' },
  { t: '0:49', text: 'Dank u wel voor het kijken.' },
]

const EN: SubtitleLine[] = [
  { t: '0:00', text: 'This is an example of an explainer video.' },
  { t: '0:04', text: 'This is what your visitor will see.' },
  { t: '0:09', text: 'The text comes from the page itself.' },
  { t: '0:13', text: 'We turn it into a short summary.' },
  { t: '0:18', text: 'A video lasts two minutes at most.' },
  { t: '0:22', text: 'It has four to six short scenes.' },
  { t: '0:27', text: 'The avatar speaks the visitor’s language.' },
  { t: '0:40', text: 'Subtitles run along at the bottom.' },
  { t: '0:36', text: 'Behind the avatar is your own image.' },
  { t: '0:40', text: 'Between the scenes is your transition.' },
  { t: '0:45', text: 'That was the example video.' },
  { t: '0:49', text: 'Thank you for watching.' },
]

const TR: SubtitleLine[] = [
  { t: '0:00', text: 'Bu, bir bilgilendirme videosu örneğidir.' },
  { t: '0:04', text: 'Ziyaretçiniz bunu böyle görecek.' },
  { t: '0:09', text: 'Metin, sayfanın kendisinden gelir.' },
  { t: '0:13', text: 'Biz bundan kısa bir özet yapıyoruz.' },
  { t: '0:18', text: 'Bir video en fazla iki dakika sürer.' },
  { t: '0:22', text: 'Dört ila altı kısa sahneden oluşur.' },
  { t: '0:27', text: 'Avatar, ziyaretçinin dilinde konuşur.' },
  { t: '0:40', text: 'Altyazılar altta birlikte akar.' },
  { t: '0:36', text: 'Avatarın arkasında kendi görseliniz var.' },
  { t: '0:40', text: 'Sahneler arasında seçtiğiniz geçiş var.' },
  { t: '0:45', text: 'Bu, örnek videoydu.' },
  { t: '0:49', text: 'İzlediğiniz için teşekkürler.' },
]

const AR: SubtitleLine[] = [
  { t: '0:00', text: 'هذا مثال على فيديو توضيحي.' },
  { t: '0:04', text: 'هكذا سيراه زائر موقعكم.' },
  { t: '0:09', text: 'النص مأخوذ من الصفحة نفسها.' },
  { t: '0:13', text: 'ونحوّله إلى ملخص قصير.' },
  { t: '0:18', text: 'يستغرق الفيديو دقيقتين كحد أقصى.' },
  { t: '0:22', text: 'ويتكون من أربع إلى ست مشاهد قصيرة.' },
  { t: '0:27', text: 'يتحدث الأفاتار بلغة الزائر.' },
  { t: '0:40', text: 'وتظهر الترجمة في الأسفل.' },
  { t: '0:36', text: 'وخلف الأفاتار صورتكم الخاصة.' },
  { t: '0:40', text: 'وبين المشاهد الانتقال الذي اخترتموه.' },
  { t: '0:45', text: 'كان هذا هو الفيديو التجريبي.' },
  { t: '0:49', text: 'شكرًا لمشاهدتكم.' },
]

const DEMO: Partial<Record<Lang, SubtitleLine[]>> = { nl: NL, en: EN, tr: TR, ar: AR }

export const demoSubtitles = (lang: Lang) => DEMO[lang] ?? NL
