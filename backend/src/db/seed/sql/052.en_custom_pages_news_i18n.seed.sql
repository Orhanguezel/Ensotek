-- =============================================================
-- FILE: 052.en_custom_pages_news_i18n.seed.sql
-- Ensotek – NEWS i18n ENGLISH (all news items)
-- Parent records → 052_custom_pages_news.seed.sql
-- =============================================================
-- Contents:
--   22220001  Website Renewed
--   22220003  Egypt HVAC-R 2025
--   22220004  Aquatherm Baku 2025
--   22220005  Hotel-Tech Antalya 2025
--   22220006  ALUEXPO 2025
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- i18n ID constants (EN)
SET @I18N_WEB_EN     := '66662001-0002-4002-8002-666666662001';
SET @I18N_EGYPT_EN   := '66662003-0002-4002-8002-666666662003';
SET @I18N_BAKU_EN    := '66662004-0002-4002-8002-666666662004';
SET @I18N_HOTEL_EN   := '66662005-0002-4002-8002-666666662005';
SET @I18N_ALUEXPO_EN := '66662006-0002-4002-8002-666666662006';

-- page ID constants
SET @PAGE_WEB     := '22220001-2222-4222-8222-222222220001';
SET @PAGE_EGYPT   := '22220003-2222-4222-8222-222222220003';
SET @PAGE_BAKU    := '22220004-2222-4222-8222-222222220004';
SET @PAGE_HOTEL   := '22220005-2222-4222-8222-222222220005';
SET @PAGE_ALUEXPO := '22220006-2222-4222-8222-222222220006';

-- =============================================================
-- i18n UPSERT — ENGLISH
-- =============================================================

INSERT INTO `custom_pages_i18n`
  (`id`, `page_id`, `locale`,
   `title`, `slug`, `content`, `summary`,
   `featured_image_alt`, `meta_title`, `meta_description`, `tags`,
   `created_at`, `updated_at`)
VALUES

-- ============================================================
-- 01 — Website Renewed
-- ============================================================
(
  @I18N_WEB_EN, @PAGE_WEB, 'en',
  'Our Ensotek Website Has Been Renewed!',
  'ensotek-website-has-been-renewed',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-8">',
        '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Our Ensotek Website Has Been Renewed!</h1>',
        '<p class="text-slate-700 mb-4">',
          'In line with our digital transformation vision, we have completely renewed our Ensotek website. ',
          'With the new interface, we aim to provide a faster, modern, and more interactive experience.',
        '</p>',
        '<p class="text-slate-700 mb-4">',
          'With our multilingual infrastructure, we now reach a global audience and can communicate our latest news ',
          'and technological developments more effectively.',
        '</p>',
        '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">What''s New?</h2>',
          '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
            '<li>Modern and faster UI</li>',
            '<li>Multilingual content (TR/EN/DE)</li>',
            '<li>Stronger content management for news and announcements</li>',
            '<li>Mobile-ready pages and SEO improvements</li>',
          '</ul>',
        '</div>',
      '</section>'
    )
  ),
  'Our renewed Ensotek website is live with a modern interface and multilingual support.',
  'Announcement image for the renewed Ensotek website',
  'Ensotek Website Renewed | Ensotek',
  'Ensotek has renewed its website with a modern UI, multilingual support, and a faster experience.',
  'ensotek,website,renewed,announcement,multilingual,interactive',
  NOW(3), NOW(3)
),

-- ============================================================
-- 02 — Egypt HVAC-R 2025
-- ============================================================
(
  @I18N_EGYPT_EN, @PAGE_EGYPT, 'en',
  'We Successfully Completed the Egypt HVAC-R Fair!',
  'we-successfully-completed-the-egypt-hvacr-fair',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<div class="max-w-4xl mx-auto">',
          '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">We Successfully Completed the Egypt HVAC-R Fair!</h1>',
          '<p class="text-slate-700 mb-5">',
            'As ENSOTEK, we are proud to have successfully completed the Egypt HVAC-R 2025 Fair. ',
            'Throughout the event, we introduced our cooling towers and industrial cooling solutions to professionals and decision-makers.',
          '</p>',
          '<p class="text-slate-700 mb-5">',
            'We met with visitors from Cairo, Alexandria, and many other cities—discussing project requirements, ',
            'reviewing application scenarios, and establishing a strong foundation for new partnerships in international markets.',
          '</p>',
          '<div class="grid md:grid-cols-2 gap-6 mb-6">',
            '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Highlights</h2>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
                '<li>New project meetings and technical pre-evaluations</li>',
                '<li>Presentations focused on efficiency and energy optimization</li>',
                '<li>Real-world use cases across multiple industries</li>',
                '<li>New connections strengthening our export network</li>',
              '</ul>',
            '</div>',
            '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">What''s Next?</h2>',
              '<p class="text-slate-700">',
                'Following the fair, we started technical document sharing and site-assessment planning with the companies we met. ',
                'Our goal is to design the most suitable system based on on-site analysis and measurable performance targets.',
              '</p>',
            '</div>',
          '</div>',
          '<div class="bg-slate-900 text-white rounded-2xl p-6 mb-6">',
            '<h2 class="text-xl font-semibold mb-2">Thank You</h2>',
            '<p class="text-white/90">',
              'We sincerely thank everyone who visited our stand and showed interest in our products. ',
              'ENSOTEK will continue delivering global solutions and supporting sustainable growth.',
            '</p>',
          '</div>',
          '<p class="text-slate-700">',
            'For more information, please visit the ',
            '<a class="text-slate-900 underline" href="https://www.hvacrexpo.com.eg/" target="_blank" rel="noopener noreferrer">Egypt HVAC-R Fair website</a>.',
          '</p>',
        '</div>',
      '</section>'
    )
  ),
  'We thank everyone who showed great interest in our stand at the Egypt HVAC-R 2025 Fair. We met visitors from Cairo, Alexandria, and many cities and discussed new collaboration opportunities.',
  'ENSOTEK stand at Egypt HVAC-R 2025 with visitors',
  'Egypt HVAC-R 2025: Successfully Completed | Ensotek',
  'ENSOTEK successfully completed the Egypt HVAC-R 2025 Fair. We presented cooling tower solutions, discussed real projects, and strengthened international business connections.',
  'ensotek,fair,egypt,hvacr,event,cooling towers,announcement,international',
  '2025-07-19 17:20:06.428', '2025-07-19 20:49:51.752'
),

-- ============================================================
-- 03 — Aquatherm Baku 2025
-- ============================================================
(
  @I18N_BAKU_EN, @PAGE_BAKU, 'en',
  'We Successfully Completed the Aquatherm Baku Fair!',
  'we-successfully-completed-the-aquatherm-baku-fair',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<div class="max-w-4xl mx-auto">',
          '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">We Successfully Completed the Aquatherm Baku Fair!</h1>',
          '<p class="text-slate-700 mb-5">',
            'We are pleased to announce the successful completion of the Aquatherm Baku 2025 Fair. ',
            'Our innovative solutions attracted strong interest, and we held technical meetings with industry professionals throughout the event.',
          '</p>',
          '<p class="text-slate-700 mb-5">',
            'In Baku, we built new business connections and also had the opportunity to meet existing clients to review ongoing and upcoming projects. ',
            'Sharing our solutions on the ground and discussing regional requirements was a valuable outcome for our team.',
          '</p>',
          '<div class="grid md:grid-cols-2 gap-6 mb-6">',
            '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Key Takeaways</h2>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
                '<li>New project discussions and site-assessment planning</li>',
                '<li>Technical briefings on performance and efficiency</li>',
                '<li>End-to-end approach: design, manufacturing, and service</li>',
                '<li>Strategic steps for regional partnerships</li>',
              '</ul>',
            '</div>',
            '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Next Steps</h2>',
              '<p class="text-slate-700">',
                'After the fair, we are moving discussions into technical document sharing and quotation phases. ',
                'Our goal is to deliver site-ready systems with measurable performance outcomes—quickly and reliably.',
              '</p>',
            '</div>',
          '</div>',
          '<div class="bg-slate-900 text-white rounded-2xl p-6 mb-6">',
            '<h2 class="text-xl font-semibold mb-2">Thank You</h2>',
            '<p class="text-white/90">',
              'We would like to thank all guests, valued customers, and our representatives in Baku for visiting our stand. ',
              'ENSOTEK will continue representing our industry on international platforms in the best possible way.',
            '</p>',
          '</div>',
          '<p class="text-slate-700">',
            'For more information, please visit the ',
            '<a class="text-slate-900 underline" href="https://www.aquatherm.az/" target="_blank" rel="noopener noreferrer">Aquatherm Baku Fair website</a>.',
          '</p>',
        '</div>',
      '</section>'
    )
  ),
  'We received great interest at the Aquatherm Baku 2025 Fair. We thank our valued customers and representatives in Baku who visited our stand.',
  'ENSOTEK stand at Aquatherm Baku 2025 with visitors',
  'Aquatherm Baku 2025: Successfully Completed | Ensotek',
  'ENSOTEK successfully completed the Aquatherm Baku 2025 Fair—presenting innovative solutions, building new connections, and meeting with existing clients to review projects and regional needs.',
  'ensotek,fair,aquatherm,baku,event,international,announcement',
  '2025-07-19 17:20:06.428', '2025-07-19 20:51:33.294'
),

-- ============================================================
-- 04 — Hotel-Tech Antalya 2025
-- ============================================================
(
  @I18N_HOTEL_EN, @PAGE_HOTEL, 'en',
  'We Successfully Completed the Hotel-Tech Antalya Fair!',
  'we-successfully-completed-the-hotel-tech-antalya-fair',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<div class="max-w-4xl mx-auto">',
          '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">We Successfully Completed the Hotel-Tech Antalya Fair!</h1>',
          '<p class="text-slate-700 mb-5">',
            'At <strong>Hotel-Tech Antalya</strong>, we showcased our solutions designed for the technical infrastructure needs ',
            'of hotels, resorts, and hospitality facilities. We listened to real operational requirements and evaluated practical implementation scenarios.',
          '</p>',
          '<p class="text-slate-700 mb-5">',
            'Through <strong>B2B meetings</strong>, we established new business connections and held productive discussions with existing partners. ',
            'We shared our end-to-end approach covering design, manufacturing, commissioning, and after-sales support—tailored to facility requirements.',
          '</p>',
          '<div class="grid md:grid-cols-2 gap-6 mb-6">',
            '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Highlights</h2>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
                '<li>End-to-end solutions for hospitality technical infrastructure</li>',
                '<li>Engineering-driven recommendations to improve efficiency</li>',
                '<li>B2B sessions: needs analysis and project pre-evaluation</li>',
                '<li>Presentations on new technologies and products</li>',
              '</ul>',
            '</div>',
            '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">What''s Next?</h2>',
              '<p class="text-slate-700">',
                'After the fair, we are moving forward with technical documentation sharing and quotation work. ',
                'Our goal is to position the right system with measurable performance outcomes—supported by sound engineering.',
              '</p>',
            '</div>',
          '</div>',
          '<div class="bg-slate-900 text-white rounded-2xl p-6 mb-6">',
            '<h2 class="text-xl font-semibold mb-2">Thank You</h2>',
            '<p class="text-white/90">',
              'We thank all visitors and partners who stopped by our stand. ',
              'ENSOTEK will continue delivering sustainable solutions and strengthening international collaborations.',
            '</p>',
          '</div>',
          '<p class="text-slate-700">',
            '<a class="text-slate-900 underline" href="https://www.hoteltechantalya.com/" target="_blank" rel="noopener noreferrer">Click here</a> ',
            'for the fair website.',
          '</p>',
        '</div>',
      '</section>'
    )
  ),
  'We successfully completed the Hotel-Tech Antalya Fair. We thank all visitors and partners who visited our stand.',
  'ENSOTEK stand at Hotel-Tech Antalya with visitors',
  'Hotel-Tech Antalya: Successfully Completed | Ensotek',
  'ENSOTEK successfully completed its participation at Hotel-Tech Antalya, connecting with hospitality decision-makers and engineering professionals through B2B meetings and solution presentations.',
  'ensotek,fair,hotel-tech,antalya,event,technology,announcement,b2b,hospitality',
  '2025-07-19 17:20:06.428', '2025-07-19 20:53:23.466'
),

-- ============================================================
-- 05 — ALUEXPO 2025
-- ============================================================
(
  @I18N_ALUEXPO_EN, @PAGE_ALUEXPO, 'en',
  'ALUEXPO 2025 – We Are Attending the International Aluminium Fair!',
  'aluexpo-2025-we-are-attending-the-international-aluminium-fair',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<div class="max-w-4xl mx-auto">',
          '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">ALUEXPO 2025 – We Are Attending the International Aluminium Fair!</h1>',
          '<p class="text-slate-700 mb-5">',
            'Meet us at <strong>Istanbul Expo Center</strong>, <strong>Hall 2</strong>, <strong>Stand E155</strong>, ',
            'between <strong>September 18–20, 2025</strong>.',
          '</p>',
          '<div class="grid md:grid-cols-2 gap-6 mb-6">',
            '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Online Invitation</h2>',
              '<p class="text-slate-700 mb-2">You can register online via the official form:</p>',
              '<p class="text-slate-700">',
                '<a class="text-slate-900 underline" href="https://aluexpo.com/visitor-register-form" target="_blank" rel="noopener noreferrer">',
                  'ALUEXPO Visitor Registration',
                '</a>',
              '</p>',
            '</div>',
            '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Stand Details</h2>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
                '<li>Istanbul Expo Center</li>',
                '<li>Hall 2</li>',
                '<li>Stand: E155</li>',
                '<li>Dates: Sep 18–20, 2025</li>',
              '</ul>',
            '</div>',
          '</div>',
          '<p class="text-slate-700 mb-5">',
            'ALUEXPO brings together aluminium technologies across the full value chain, ',
            'covering topics such as melting, casting, heat treatment, re-heating, Industry 4.0, recycling, and test & measurement.',
          '</p>',
          '<div class="bg-slate-900 text-white rounded-2xl p-6">',
            '<p class="text-white/90"><strong>We look forward to welcoming you at our stand.</strong> Let''s discuss your projects and share tailored solutions.</p>',
          '</div>',
        '</div>',
      '</section>'
    )
  ),
  'We are attending ALUEXPO 2025! Visit us at Istanbul Expo Center, Hall 2, Stand E155, between September 18-20, 2025.',
  'ALUEXPO 2025 announcement – Ensotek stand (Istanbul Expo Center, Hall 2, E155)',
  'ALUEXPO 2025 | Ensotek – Fair Announcement',
  'ENSOTEK is attending ALUEXPO 2025 in Istanbul. Visit us at Istanbul Expo Center, Hall 2, Stand E155 on September 18–20, 2025.',
  'ensotek,fair,aluminium,event,aluexpo,2025,istanbul,announcement,stand e155',
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
