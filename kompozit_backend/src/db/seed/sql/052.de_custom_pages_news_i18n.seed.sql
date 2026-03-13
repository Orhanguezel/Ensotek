-- =============================================================
-- FILE: 052.de_custom_pages_news_i18n.seed.sql
-- Ensotek – NEWS i18n DEUTSCH (alle Newsbeiträge)
-- Parent-Datensätze → 052_custom_pages_news.seed.sql
-- =============================================================
-- Inhalt:
--   22220001  Website erneuert
--   22220003  Egypt HVAC-R 2025
--   22220004  Aquatherm Baku 2025
--   22220005  Hotel-Tech Antalya 2025
--   22220006  ALUEXPO 2025
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- i18n ID Konstanten (DE)
SET @I18N_WEB_DE     := '66662001-0003-4003-8003-666666662001';
SET @I18N_EGYPT_DE   := '66662003-0003-4003-8003-666666662003';
SET @I18N_BAKU_DE    := '66662004-0003-4003-8003-666666662004';
SET @I18N_HOTEL_DE   := '66662005-0003-4003-8003-666666662005';
SET @I18N_ALUEXPO_DE := '66662006-0003-4003-8003-666666662006';

-- Page ID Konstanten
SET @PAGE_WEB     := '22220001-2222-4222-8222-222222220001';
SET @PAGE_EGYPT   := '22220003-2222-4222-8222-222222220003';
SET @PAGE_BAKU    := '22220004-2222-4222-8222-222222220004';
SET @PAGE_HOTEL   := '22220005-2222-4222-8222-222222220005';
SET @PAGE_ALUEXPO := '22220006-2222-4222-8222-222222220006';

-- =============================================================
-- i18n UPSERT — DEUTSCH
-- =============================================================

INSERT INTO `custom_pages_i18n`
  (`id`, `page_id`, `locale`,
   `title`, `slug`, `content`, `summary`,
   `featured_image_alt`, `meta_title`, `meta_description`, `tags`,
   `created_at`, `updated_at`)
VALUES

-- ============================================================
-- 01 — Webseite erneuert
-- ============================================================
(
  @I18N_WEB_DE, @PAGE_WEB, 'de',
  'Unsere Ensotek-Webseite ist erneuert!',
  'ensotek-webseite-wurde-erneuert',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-8">',
        '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Unsere Ensotek-Webseite ist erneuert!</h1>',
        '<p class="text-slate-700 mb-4">',
          'Im Rahmen unserer Digitalisierungsstrategie haben wir unsere Ensotek-Webseite vollständig erneuert. ',
          'Mit der neuen Oberfläche bieten wir ein schnelleres, moderneres und interaktiveres Nutzererlebnis.',
        '</p>',
        '<p class="text-slate-700 mb-4">',
          'Durch unsere mehrsprachige Infrastruktur erreichen wir nun ein globales Publikum und können ',
          'aktuelle Neuigkeiten und technologische Entwicklungen noch effektiver kommunizieren.',
        '</p>',
        '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">Was ist neu?</h2>',
          '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
            '<li>Modernes, schnelleres UI</li>',
            '<li>Mehrsprachige Inhalte (TR/EN/DE)</li>',
            '<li>Stärkeres Content-Management für News & Ankündigungen</li>',
            '<li>Mobile Optimierung und SEO-Verbesserungen</li>',
          '</ul>',
        '</div>',
      '</section>'
    )
  ),
  'Unsere neue Ensotek-Webseite ist online: modern, mehrsprachig und schneller.',
  'Ankündigungsbild zur erneuerten Ensotek-Webseite',
  'Ensotek-Webseite erneuert | Ensotek',
  'Ensotek hat seine Webseite erneuert: moderne Oberfläche, mehrsprachige Struktur und bessere Performance.',
  'ensotek,webseite,erneuert,ankündigung,mehrsprachig,interaktiv',
  NOW(3), NOW(3)
),

-- ============================================================
-- 02 — Egypt HVAC-R 2025
-- ============================================================
(
  @I18N_EGYPT_DE, @PAGE_EGYPT, 'de',
  'Wir haben die Egypt HVAC-R Messe erfolgreich abgeschlossen!',
  'egypt-hvacr-messe-erfolgreich-abgeschlossen',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<div class="max-w-4xl mx-auto">',
          '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Wir haben die Egypt HVAC-R Messe erfolgreich abgeschlossen!</h1>',
          '<p class="text-slate-700 mb-5">',
            'Als ENSOTEK sind wir stolz darauf, die Egypt HVAC-R 2025 Messe erfolgreich abgeschlossen zu haben. ',
            'Während der Veranstaltung präsentierten wir unsere Kühltürme und industriellen Kühllösungen einem internationalen Fachpublikum.',
          '</p>',
          '<p class="text-slate-700 mb-5">',
            'Wir führten Gespräche mit Besuchern aus Kairo, Alexandria und vielen weiteren Städten—',
            'analysierten Projektanforderungen, diskutierten Einsatzszenarien und stärkten die Basis für neue Partnerschaften.',
          '</p>',
          '<div class="grid md:grid-cols-2 gap-6 mb-6">',
            '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Schwerpunkte</h2>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
                '<li>Neue Projektgespräche und technische Vorbewertungen</li>',
                '<li>Effizienz- und Energieoptimierungsfokus</li>',
                '<li>Anwendungsbeispiele aus verschiedenen Branchen</li>',
                '<li>Neue Kontakte für unser Exportnetzwerk</li>',
              '</ul>',
            '</div>',
            '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Wie geht es weiter?</h2>',
              '<p class="text-slate-700">',
                'Nach der Messe starteten wir die technische Dokumentation und die Planung von Vor-Ort-Terminen. ',
                'Ziel ist eine passgenaue Systemauslegung auf Basis von Standortanalyse und klaren Leistungskennzahlen.',
              '</p>',
            '</div>',
          '</div>',
          '<div class="bg-slate-900 text-white rounded-2xl p-6 mb-6">',
            '<h2 class="text-xl font-semibold mb-2">Danke</h2>',
            '<p class="text-white/90">',
              'Wir danken allen Gästen und Partnern, die unseren Stand besucht und Interesse gezeigt haben. ',
              'ENSOTEK wird weiterhin globale Lösungen anbieten und nachhaltiges Wachstum unterstützen.',
            '</p>',
          '</div>',
          '<p class="text-slate-700">',
            'Weitere Informationen finden Sie auf der ',
            '<a class="text-slate-900 underline" href="https://www.hvacrexpo.com.eg/" target="_blank" rel="noopener noreferrer">Website der Egypt HVAC-R Messe</a>.',
          '</p>',
        '</div>',
      '</section>'
    )
  ),
  'Wir danken allen, die auf der Egypt HVAC-R 2025 Messe großes Interesse an unserem Stand gezeigt haben. Wir führten intensive Gespräche mit Besuchern aus Kairo, Alexandria und weiteren Städten.',
  'ENSOTEK Messestand auf der Egypt HVAC-R 2025',
  'Egypt HVAC-R 2025: Erfolgreich abgeschlossen | Ensotek',
  'ENSOTEK hat die Egypt HVAC-R 2025 Messe erfolgreich abgeschlossen. Wir präsentierten Kühlturm-Lösungen, analysierten Projektanforderungen und stärkten internationale Geschäftsbeziehungen.',
  'ensotek,messe,aegypten,hvacr,veranstaltung,kuehltuerme,ankuendigung,international',
  '2025-07-19 17:20:06.428', '2025-07-19 20:49:51.752'
),

-- ============================================================
-- 03 — Aquatherm Baku 2025
-- ============================================================
(
  @I18N_BAKU_DE, @PAGE_BAKU, 'de',
  'Wir haben die Aquatherm Baku Messe erfolgreich abgeschlossen!',
  'aquatherm-baku-messe-erfolgreich-abgeschlossen',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<div class="max-w-4xl mx-auto">',
          '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Wir haben die Aquatherm Baku Messe erfolgreich abgeschlossen!</h1>',
          '<p class="text-slate-700 mb-5">',
            'Wir freuen uns, die erfolgreiche Teilnahme an der Aquatherm Baku 2025 Messe bekannt zu geben. ',
            'Unsere innovativen Lösungen stießen auf großes Interesse, und wir führten während der Veranstaltung zahlreiche technische Gespräche.',
          '</p>',
          '<p class="text-slate-700 mb-5">',
            'In Baku knüpften wir neue Geschäftskontakte und trafen bestehende Kunden, um laufende und geplante Projekte zu besprechen. ',
            'Der Austausch zu regionalen Anforderungen und die Vorstellung unserer Lösungen vor Ort waren ein wichtiger Mehrwert.',
          '</p>',
          '<div class="grid md:grid-cols-2 gap-6 mb-6">',
            '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Wichtige Erkenntnisse</h2>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
                '<li>Neue Projektgespräche und Terminplanung für Standortanalysen</li>',
                '<li>Technische Briefings zu Leistung und Effizienz</li>',
                '<li>End-to-End Ansatz: Auslegung, Produktion und Service</li>',
                '<li>Strategische Schritte für regionale Partnerschaften</li>',
              '</ul>',
            '</div>',
            '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Nächste Schritte</h2>',
              '<p class="text-slate-700">',
                'Nach der Messe überführen wir die Gespräche in den Austausch technischer Unterlagen und Angebotsphasen. ',
                'Ziel ist die schnelle Bereitstellung standortgerechter Systeme mit messbaren Leistungskennzahlen.',
              '</p>',
            '</div>',
          '</div>',
          '<div class="bg-slate-900 text-white rounded-2xl p-6 mb-6">',
            '<h2 class="text-xl font-semibold mb-2">Danke</h2>',
            '<p class="text-white/90">',
              'Wir danken allen Gästen, unseren Kunden und unseren Vertretern in Baku für ihren Besuch. ',
              'Als ENSOTEK werden wir unsere Branche weiterhin bestmöglich auf internationalen Plattformen repräsentieren.',
            '</p>',
          '</div>',
          '<p class="text-slate-700">',
            'Weitere Informationen finden Sie auf der ',
            '<a class="text-slate-900 underline" href="https://www.aquatherm.az/" target="_blank" rel="noopener noreferrer">Aquatherm Baku Messe-Website</a>.',
          '</p>',
        '</div>',
      '</section>'
    )
  ),
  'Wir wurden auf der Aquatherm Baku 2025 Messe mit großem Interesse empfangen. Wir danken allen, die unseren Stand besucht haben.',
  'ENSOTEK Messestand auf der Aquatherm Baku 2025',
  'Aquatherm Baku 2025: Erfolgreich abgeschlossen | Ensotek',
  'ENSOTEK hat die Aquatherm Baku 2025 Messe erfolgreich abgeschlossen. Wir präsentierten innovative Lösungen, knüpften Kontakte und trafen bestehende Kunden zur Projektabstimmung.',
  'ensotek,messe,aquatherm,baku,veranstaltung,international,ankuendigung',
  '2025-07-19 17:20:06.428', '2025-07-19 20:51:33.294'
),

-- ============================================================
-- 04 — Hotel-Tech Antalya 2025
-- ============================================================
(
  @I18N_HOTEL_DE, @PAGE_HOTEL, 'de',
  'Wir haben die Hotel-Tech Antalya Messe erfolgreich abgeschlossen!',
  'hotel-tech-antalya-messe-erfolgreich-abgeschlossen',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<div class="max-w-4xl mx-auto">',
          '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Wir haben die Hotel-Tech Antalya Messe erfolgreich abgeschlossen!</h1>',
          '<p class="text-slate-700 mb-5">',
            'Auf der <strong>Hotel-Tech Antalya</strong> präsentierten wir Lösungen für die technische Infrastruktur von Hotels, Resorts und Hospitality-Anlagen. ',
            'Wir analysierten reale Betriebsanforderungen und bewerteten praxisnahe Umsetzungsszenarien.',
          '</p>',
          '<p class="text-slate-700 mb-5">',
            'Durch <strong>B2B-Gespräche</strong> knüpften wir neue Geschäftskontakte und führten produktive Meetings mit bestehenden Partnern. ',
            'Wir stellten unseren End-to-End Ansatz vor—von Auslegung und Produktion bis Inbetriebnahme und After-Sales Support.',
          '</p>',
          '<div class="grid md:grid-cols-2 gap-6 mb-6">',
            '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Highlights</h2>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
                '<li>End-to-End-Lösungen für Hotel-Infrastruktur</li>',
                '<li>Engineering-Ansatz zur Effizienzsteigerung</li>',
                '<li>B2B-Meetings: Bedarfserhebung und Projektvorprüfung</li>',
                '<li>Vorstellungen neuer Technologien und Produkte</li>',
              '</ul>',
            '</div>',
            '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Nächste Schritte</h2>',
              '<p class="text-slate-700">',
                'Nach der Messe führen wir den Austausch mit technischen Unterlagen und Angebotsphasen fort. ',
                'Ziel sind standortgerechte Systeme mit messbaren Leistungskennzahlen—getragen von sauberer Ingenieursarbeit.',
              '</p>',
            '</div>',
          '</div>',
          '<div class="bg-slate-900 text-white rounded-2xl p-6 mb-6">',
            '<h2 class="text-xl font-semibold mb-2">Danke</h2>',
            '<p class="text-white/90">',
              'Wir danken allen Besuchern und Partnern für ihr Interesse. ',
              'ENSOTEK wird weiterhin nachhaltige Lösungen anbieten und internationale Kooperationen stärken.',
            '</p>',
          '</div>',
          '<p class="text-slate-700">',
            'Zur Messe-Website ',
            '<a class="text-slate-900 underline" href="https://www.hoteltechantalya.com/" target="_blank" rel="noopener noreferrer">hier klicken</a>.',
          '</p>',
        '</div>',
      '</section>'
    )
  ),
  'Wir haben die Hotel-Tech Antalya Messe erfolgreich abgeschlossen. Wir danken allen Besuchern und Partnern, die unseren Stand besucht haben.',
  'ENSOTEK Messestand auf der Hotel-Tech Antalya mit Besuchern',
  'Hotel-Tech Antalya: Erfolgreich abgeschlossen | Ensotek',
  'ENSOTEK hat die Teilnahme an der Hotel-Tech Antalya erfolgreich abgeschlossen. Im Fokus standen B2B-Gespräche, Infrastruktur-Lösungen für die Hotellerie und Präsentationen neuer Technologien.',
  'ensotek,messe,hotel-tech,antalya,veranstaltung,technologie,ankuendigung,b2b,hotel',
  '2025-07-19 17:20:06.428', '2025-07-19 20:53:23.466'
),

-- ============================================================
-- 05 — ALUEXPO 2025
-- ============================================================
(
  @I18N_ALUEXPO_DE, @PAGE_ALUEXPO, 'de',
  'ALUEXPO 2025 – Wir nehmen an der Internationalen Aluminium-Messe teil!',
  'aluexpo-2025-wir-nehmen-an-der-internationalen-aluminium-messe-teil',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<div class="max-w-4xl mx-auto">',
          '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">ALUEXPO 2025 – Wir nehmen an der Internationalen Aluminium-Messe teil!</h1>',
          '<p class="text-slate-700 mb-5">',
            'Besuchen Sie uns im <strong>Istanbul Expo Center</strong>, <strong>Halle 2</strong>, <strong>Stand E155</strong>, ',
            'vom <strong>18. bis 20. September 2025</strong>.',
          '</p>',
          '<div class="grid md:grid-cols-2 gap-6 mb-6">',
            '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Online-Einladung</h2>',
              '<p class="text-slate-700 mb-2">Registrieren Sie sich online über das offizielle Formular:</p>',
              '<p class="text-slate-700">',
                '<a class="text-slate-900 underline" href="https://aluexpo.com/visitor-register-form" target="_blank" rel="noopener noreferrer">',
                  'ALUEXPO Besucherregistrierung',
                '</a>',
              '</p>',
            '</div>',
            '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Stand-Details</h2>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
                '<li>Istanbul Expo Center</li>',
                '<li>Halle 2</li>',
                '<li>Stand: E155</li>',
                '<li>Datum: 18.–20. September 2025</li>',
              '</ul>',
            '</div>',
          '</div>',
          '<p class="text-slate-700 mb-5">',
            'ALUEXPO vereint Technologien entlang der gesamten Aluminium-Wertschöpfungskette—Schmelzen, Gießen, Wärmebehandlung, ',
            'Wiedererwärmung, Industrie 4.0, Recycling sowie Test- und Messtechnik.',
          '</p>',
          '<div class="bg-slate-900 text-white rounded-2xl p-6">',
            '<p class="text-white/90"><strong>Wir freuen uns auf Ihren Besuch an unserem Stand.</strong> Gerne besprechen wir Ihre Projekte und passende Lösungen.</p>',
          '</div>',
        '</div>',
      '</section>'
    )
  ),
  'Wir nehmen an der ALUEXPO 2025 teil! Besuchen Sie uns vom 18. bis 20. September 2025 im Istanbul Expo Center, Halle 2, Stand E155.',
  'ALUEXPO 2025 Ankündigung – Ensotek Stand (Istanbul Expo Center, Halle 2, E155)',
  'ALUEXPO 2025 | Ensotek – Messeankündigung',
  'ENSOTEK nimmt an der ALUEXPO 2025 in Istanbul teil. Besuchen Sie uns im Istanbul Expo Center, Halle 2, Stand E155 (18.–20. September 2025).',
  'ensotek,messe,aluminium,veranstaltung,aluexpo,2025,istanbul,ankuendigung,stand e155',
  '2025-07-19 17:20:06.428', '2025-07-19 20:46:40.260'
)

ON DUPLICATE KEY UPDATE
  `title`              = VALUES(`title`),
  `slug`               = VALUES(`slug`),
  `content`            = VALUES(`content`),
  `summary`            = VALUES(`summary`),
  `featured_image_alt` = VALUES(`featured_image_alt`),
  `meta_title`         = VALUES(`meta_title`),
  `meta_description`   = VALUES(`meta_description`),
  `tags`               = VALUES(`tags`),
  `updated_at`         = VALUES(`updated_at`);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
