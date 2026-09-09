import type { PageContent } from '../types'

const page: PageContent = {
  id: 'p-parkeervergunning',
  url: 'https://www.bergrode.nl/parkeervergunning-bewoners',
  title: 'Parkeervergunning bewoners',

  sourceText: `Woont u in een straat waar betaald parkeren geldt? Dan kunt u een parkeervergunning voor bewoners aanvragen. Met zo'n vergunning parkeert u in uw eigen vergunningsgebied zonder dat u per uur hoeft te betalen. Gemeente Bergrode kent vier vergunningsgebieden: Centrum, Stationskwartier, Bergpark en Oude Haven. Op de kaart onderaan deze pagina ziet u in welk gebied uw adres valt.

U komt in aanmerking voor een bewonersvergunning als u staat ingeschreven op een adres binnen een vergunningsgebied en als de auto op uw naam staat. Staat de auto op naam van uw werkgever of van een leasemaatschappij? Dan vragen wij een werkgeversverklaring of een kopie van het leasecontract. Per huishouden verstrekken wij maximaal twee vergunningen. In het Centrum geldt een maximum van één vergunning per huishouden, omdat daar minder parkeerplaatsen zijn dan woningen.

Voor uw aanvraag heeft u nodig: uw DigiD, het kenteken van de auto en uw rekeningnummer voor de automatische incasso. Heeft u een tweede auto? Vraag dan een aparte vergunning aan met het tweede kenteken. U kunt de aanvraag online doen via het formulier op deze pagina. Lukt dat niet, dan kunt u langskomen bij het Klantcontactcentrum in het gemeentehuis. Maak daarvoor eerst een afspraak.

Een bewonersvergunning kost 96 euro per jaar. Dit bedrag schrijven wij in vier termijnen af. De vergunning geldt telkens voor een kalenderjaar en wordt automatisch verlengd, zolang u op hetzelfde adres blijft wonen. U ontvangt hierover in december bericht.

Wij behandelen uw aanvraag binnen vijf werkdagen. U krijgt de uitslag per e-mail. Bij een toewijzing is de vergunning meteen actief: er is geen sticker of kaart meer nodig, want de handhaving werkt met kentekenherkenning. Bij drukte in het gebied kan er een wachtlijst gelden. U hoort dan binnen vijf werkdagen op welke plek u staat.

Verhuist u, of verkoopt u uw auto? Geef dit binnen twee weken aan ons door. Wij stoppen de vergunning en betalen te veel betaalde termijnen terug.`,

  // B1-basissamenvatting: alleen wat een inwoner echt moet weten.
  scenes: [
    {
      title: 'Wanneer heeft u een vergunning nodig?',
      text: 'Woont u in een straat met betaald parkeren? Dan kunt u een parkeervergunning aanvragen. Daarmee parkeert u in uw eigen buurt zonder per uur te betalen. Bergrode heeft vier gebieden: Centrum, Stationskwartier, Bergpark en Oude Haven.',
    },
    {
      title: 'Wie komt in aanmerking?',
      text: 'U krijgt een vergunning als u in het gebied woont en de auto op uw naam staat. Per huishouden mag u er twee aanvragen. In het Centrum is dat er één. Rijdt u een lease-auto? Stuur dan het leasecontract mee.',
    },
    {
      title: 'Wat heeft u nodig?',
      text: 'Houd uw DigiD, het kenteken en uw rekeningnummer bij de hand. U vraagt de vergunning aan met het formulier op de website. Lukt dat niet? Maak dan een afspraak bij het gemeentehuis, dan helpen wij u verder.',
    },
    {
      title: 'Kosten en wachttijd',
      text: 'Een vergunning kost 96 euro per jaar, in vier termijnen. Binnen vijf werkdagen hoort u of u hem krijgt. U hoeft geen sticker op te plakken: de controle gaat via het kenteken. Verhuist u? Geef het binnen twee weken door.',
    },
  ],

  translations: {
    en: [
      {
        title: 'When do you need a permit?',
        text: 'Do you live on a street with paid parking? Then you can apply for a parking permit. It lets you park in your own neighbourhood without paying by the hour. Bergrode has four zones: Centrum, Stationskwartier, Bergpark and Oude Haven.',
      },
      {
        title: 'Who is eligible?',
        text: 'You qualify if you live in the zone and the car is registered in your name. Each household may apply for two permits. In Centrum the limit is one. Driving a lease car? Include a copy of the lease contract.',
      },
      {
        title: 'What do you need?',
        text: 'Have your DigiD, your licence plate and your bank account number ready. You apply using the form on the website. If that does not work, book an appointment at the town hall and we will help you.',
      },
      {
        title: 'Costs and waiting time',
        text: 'A permit costs 96 euros a year, charged in four instalments. Within five working days you will hear whether you get one. No sticker is needed: checks are done by licence plate. Moving house? Let us know within two weeks.',
      },
    ],
    tr: [
      {
        title: 'Ne zaman izin belgesi gerekir?',
        text: 'Ücretli park uygulanan bir sokakta mı oturuyorsunuz? O zaman park izni başvurusu yapabilirsiniz. Böylece kendi mahallenizde saat başı ödeme yapmadan park edersiniz. Bergrode’da dört bölge vardır: Centrum, Stationskwartier, Bergpark ve Oude Haven.',
      },
      {
        title: 'Kimler başvurabilir?',
        text: 'Bölgede oturuyorsanız ve araç sizin adınıza kayıtlıysa izin alırsınız. Her hane iki izin başvurusu yapabilir. Centrum’da bu sayı birdir. Kiralık araç mı kullanıyorsunuz? O zaman kira sözleşmesini de gönderin.',
      },
      {
        title: 'Neye ihtiyacınız var?',
        text: 'DigiD’nizi, plakanızı ve banka hesap numaranızı hazır bulundurun. Başvuruyu web sitesindeki form ile yaparsınız. Bu mümkün olmazsa belediye binasından randevu alın, size yardımcı oluruz.',
      },
      {
        title: 'Ücret ve bekleme süresi',
        text: 'İzin yılda 96 avrodur ve dört taksitte tahsil edilir. Beş iş günü içinde sonucu öğrenirsiniz. Sticker yapıştırmanız gerekmez: kontrol plaka üzerinden yapılır. Taşınıyor musunuz? İki hafta içinde bize bildirin.',
      },
    ],
    ar: [
      {
        title: 'متى تحتاج إلى تصريح؟',
        text: 'هل تسكن في شارع فيه مواقف مدفوعة؟ إذن يمكنك طلب تصريح وقوف. بهذا التصريح تركن سيارتك في حيّك دون دفع أجرة بالساعة. في بيرخرودة أربع مناطق: سنترم، ستاتسيونسكفارتير، بيرخبارك، وأودَه هافن.',
      },
      {
        title: 'من يحق له التصريح؟',
        text: 'تحصل على تصريح إذا كنت تسكن في المنطقة وكانت السيارة مسجّلة باسمك. يمكن لكل أسرة طلب تصريحين. في سنترم تصريح واحد فقط. هل تقود سيارة مستأجرة؟ أرفق عندئذ عقد الإيجار.',
      },
      {
        title: 'ماذا تحتاج؟',
        text: 'جهّز رمز DigiD ورقم لوحة سيارتك ورقم حسابك المصرفي. تقدّم الطلب عبر النموذج الموجود على الموقع. إذا لم ينجح ذلك، احجز موعداً في مبنى البلدية وسنساعدك.',
      },
      {
        title: 'التكلفة ومدة الانتظار',
        text: 'يكلّف التصريح 96 يورو في السنة، تُدفع على أربعة أقساط. خلال خمسة أيام عمل تعرف إن كنت ستحصل عليه. لا حاجة إلى ملصق: تتم المراقبة عبر لوحة السيارة. هل ستنتقل؟ أبلغنا خلال أسبوعين.',
      },
    ],
  },

  // Tien regels over 1:50, ongeveer elf seconden per regel.
  subtitles: {
    nl: [
      { t: '0:00', text: 'Woont u in een straat met betaald parkeren?' },
      { t: '0:11', text: 'Dan kunt u een parkeervergunning aanvragen.' },
      { t: '0:22', text: 'Bergrode heeft vier vergunningsgebieden.' },
      { t: '0:33', text: 'U krijgt een vergunning als de auto op uw naam staat.' },
      { t: '0:44', text: 'Per huishouden mag u er twee aanvragen.' },
      { t: '0:55', text: 'In het Centrum is dat er één.' },
      { t: '1:06', text: 'Houd uw DigiD, kenteken en rekeningnummer bij de hand.' },
      { t: '1:17', text: 'Een vergunning kost 96 euro per jaar.' },
      { t: '1:28', text: 'Binnen vijf werkdagen hoort u of u hem krijgt.' },
      { t: '1:39', text: 'Verhuist u? Geef het binnen twee weken door.' },
    ],
    en: [
      { t: '0:00', text: 'Do you live on a street with paid parking?' },
      { t: '0:11', text: 'Then you can apply for a parking permit.' },
      { t: '0:22', text: 'Bergrode has four permit zones.' },
      { t: '0:33', text: 'You qualify if the car is registered in your name.' },
      { t: '0:44', text: 'Each household may apply for two permits.' },
      { t: '0:55', text: 'In Centrum the limit is one.' },
      { t: '1:06', text: 'Have your DigiD, plate and bank details ready.' },
      { t: '1:17', text: 'A permit costs 96 euros a year.' },
      { t: '1:28', text: 'Within five working days you will hear the outcome.' },
      { t: '1:39', text: 'Moving house? Let us know within two weeks.' },
    ],
    tr: [
      { t: '0:00', text: 'Ücretli park uygulanan bir sokakta mı oturuyorsunuz?' },
      { t: '0:11', text: 'O zaman park izni başvurusu yapabilirsiniz.' },
      { t: '0:22', text: 'Bergrode’da dört park bölgesi vardır.' },
      { t: '0:33', text: 'Araç sizin adınıza kayıtlıysa izin alırsınız.' },
      { t: '0:44', text: 'Her hane iki izin başvurusu yapabilir.' },
      { t: '0:55', text: 'Centrum’da bu sayı birdir.' },
      { t: '1:06', text: 'DigiD, plaka ve hesap numaranızı hazır bulundurun.' },
      { t: '1:17', text: 'İzin yılda 96 avrodur.' },
      { t: '1:28', text: 'Beş iş günü içinde sonucu öğrenirsiniz.' },
      { t: '1:39', text: 'Taşınıyor musunuz? İki hafta içinde bildirin.' },
    ],
    ar: [
      { t: '0:00', text: 'هل تسكن في شارع فيه مواقف مدفوعة؟' },
      { t: '0:11', text: 'إذن يمكنك طلب تصريح وقوف.' },
      { t: '0:22', text: 'في بيرخرودة أربع مناطق تصاريح.' },
      { t: '0:33', text: 'تحصل على تصريح إذا كانت السيارة باسمك.' },
      { t: '0:44', text: 'يمكن لكل أسرة طلب تصريحين.' },
      { t: '0:55', text: 'في سنترم تصريح واحد فقط.' },
      { t: '1:06', text: 'جهّز رمز DigiD ولوحة السيارة ورقم الحساب.' },
      { t: '1:17', text: 'يكلّف التصريح 96 يورو في السنة.' },
      { t: '1:28', text: 'خلال خمسة أيام عمل تعرف النتيجة.' },
      { t: '1:39', text: 'هل ستنتقل؟ أبلغنا خلال أسبوعين.' },
    ],
  },
}

export default page
