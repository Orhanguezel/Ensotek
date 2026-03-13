-- =============================================================
-- 141_faqs_seed.sql
-- Ensotek – Multilingual FAQs seed (faqs + faqs_i18n)
--  - Şema 140_faqs.sql içinde tanımlı olmalı (DROP/CREATE yok)
--  - Burada sadece INSERT / ON DUPLICATE KEY UPDATE var
--  - TR + EN + DE (şimdilik)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

-- =============================================================
-- SEED: PARENT KAYITLAR (faqs)
-- =============================================================
INSERT INTO `faqs`
(`id`,                                `is_active`, `display_order`, `created_at`,                `updated_at`)
VALUES
('11111111-1111-1111-1111-111111111111', 1, 1, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('22222222-2222-2222-2222-222222222222', 1, 2, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('33333333-3333-3333-3333-333333333333', 1, 3, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('44444444-4444-4444-4444-444444444444', 1, 4, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('55555555-5555-5555-5555-555555555555', 1, 5, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('66666666-6666-6666-6666-666666666666', 1, 6, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('77777777-7777-7777-7777-777777777777', 1, 7, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('88888888-8888-8888-8888-888888888888', 1, 8, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000')
ON DUPLICATE KEY UPDATE
  `is_active`     = VALUES(`is_active`),
  `display_order` = VALUES(`display_order`),
  `updated_at`    = VALUES(`updated_at`);

-- =============================================================
-- SEED: I18N KAYITLAR (faqs_i18n) – TR + EN + DE
-- =============================================================
INSERT INTO `faqs_i18n`
(`id`,
 `faq_id`,
 `locale`,
 `question`,
 `answer`,
 `slug`,
 `created_at`,
 `updated_at`)
VALUES

-- =============================================================
-- 1) Soğutma kulesi nedir?
-- =============================================================
('fa01tr00-0000-0000-0000-000000000001',
 '11111111-1111-1111-1111-111111111111',
 'tr',
 'Soğutma kulesi nedir?',
 'Bir mühendislik ürünü olan soğutma kulesi, binadan veya sistemden gelen sıcak suyu buharlaştırma ve atmosferle temas ederek soğutarak tekrar sisteme gönderir.',
 'sogutma-kulesi-nedir',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

('fa01en00-0000-0000-0000-000000000002',
 '11111111-1111-1111-1111-111111111111',
 'en',
 'What is a cooling tower?',
 'A cooling tower is an engineered equipment that cools hot water from industrial systems by evaporating part of it and discharging the cooled remainder back into the system.',
 'what-is-a-cooling-tower',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

('fa01de00-0000-0000-0000-000000000003',
 '11111111-1111-1111-1111-111111111111',
 'de',
 'Was ist ein Kühlturm?',
 'Ein Kühlturm ist eine technisch entwickelte Anlage, die heißes Wasser aus Industrieanlagen durch Verdampfen eines Teils abkühlt und das gekühlte Wasser wieder in das System zurückführt.',
 'was-ist-ein-kuehlturm',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

-- =============================================================
-- 2) Chiller sistemi nedir ve nerelerde kullanılır?
-- =============================================================
('fa02tr00-0000-0000-0000-000000000004',
 '22222222-2222-2222-2222-222222222222',
 'tr',
 'Chiller sistemi nedir ve nerelerde kullanılır?',
 'Chiller, endüstriyel tesislerde veya ticari binalarda kullanılan, suyu soğutarak klima, üretim ekipmanları veya prosesler için soğutma sağlayan bir sistemdir. Genellikle hastaneler, alışveriş merkezleri, oteller ve fabrikalarda kullanılır.',
 'chiller-sistemi-nedir-ve-nerelerde-kullanilir',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

('fa02en00-0000-0000-0000-000000000005',
 '22222222-2222-2222-2222-222222222222',
 'en',
 'What is a chiller system and where is it used?',
 'A chiller is a system that cools water for air conditioning, production equipment, or process cooling in industrial plants or commercial buildings. It is commonly used in hospitals, shopping malls, hotels, and factories.',
 'what-is-a-chiller-system-and-where-is-it-used',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

('fa02de00-0000-0000-0000-000000000006',
 '22222222-2222-2222-2222-222222222222',
 'de',
 'Was ist ein Chillersystem und wo wird es eingesetzt?',
 'Ein Chillersystem ist eine Anlage, die Wasser für Klimaanlagen, Produktionsanlagen oder Prozesskühlung in Industrieanlagen oder Geschäftsgebäuden kühlt. Es wird häufig in Krankenhäusern, Einkaufszentren, Hotels und Fabriken eingesetzt.',
 'was-ist-ein-chillersystem-und-wo-wird-es-eingesetzt',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

-- =============================================================
-- 3) Ensotek’te açık tip soğutma kulesi nedir?
-- =============================================================
('fa03tr00-0000-0000-0000-000000000007',
 '33333333-3333-3333-3333-333333333333',
 'tr',
 'Ensotek’te açık tip bir soğutma kulesi (Open Circuit Cooling Tower) nedir?',
 'Ensotek’te açık tip soğutma kulesi, sıcak proses suyunun dolgu malzemeleri üzerinde aşağıya aktığı ve dışarıdan alınan havayla temas ederek bir kısmının buharlaştığı bir sistemdir. Buharlaşma sayesinde kalan su soğur ve sistemde tekrar kullanılır. Bu teknoloji, yüksek verimle çalışır ve Ensotek’in FRP malzeme kullanımı sayesinde korozyona karşı dayanıklıdır.',
 'ensotekte-acik-tip-sogutma-kulesi-nedir',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

('fa03en00-0000-0000-0000-000000000008',
 '33333333-3333-3333-3333-333333333333',
 'en',
 'What is an open circuit cooling tower at Ensotek?',
 'At Ensotek, an open circuit cooling tower is a system where hot process water flows down over fill materials and contacts ambient air, causing some evaporation. The remaining water cools and is recirculated. This efficient technology delivers high cooling performance and, due to Ensotek’s use of FRP materials, offers excellent corrosion resistance.',
 'what-is-an-open-circuit-cooling-tower-at-ensotek',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

('fa03de00-0000-0000-0000-000000000009',
 '33333333-3333-3333-3333-333333333333',
 'de',
 'Was ist ein offener Kühlturm bei Ensotek?',
 'Ein offener Kühlturm bei Ensotek ist ein System, bei dem heißes Prozesswasser über Füllmaterial nach unten fließt und mit Umgebungsluft in Kontakt kommt, wodurch ein Teil verdunstet. Das restliche Wasser kühlt ab und wird recycelt. Diese effiziente Technologie bietet hohe Kühlleistung und dank der Verwendung von FRP-Materialien eine hervorragende Korrosionsbeständigkeit.',
 'was-ist-ein-offener-kuehlturm-bei-ensotek',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

-- =============================================================
-- 4) Ensotek’in CTP kulelerinin avantajları nelerdir?
-- =============================================================
('fa04tr00-0000-0000-0000-000000000010',
 '44444444-4444-4444-4444-444444444444',
 'tr',
 'Ensotek’in CTP su soğutma kulelerinin avantajları nelerdir?',
 'Ensotek’in CTP soğutma kuleleri fiberglas destekli polimer malzemeden üretildiği için boyama gerektirmez, korozyona karşı dayanıklıdır ve uzun ömürlüdür.',
 'ensotek-ctp-sogutma-kulelerinin-avantajlari-nelerdir',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

('fa04en00-0000-0000-0000-000000000011',
 '44444444-4444-4444-4444-444444444444',
 'en',
 'What are the advantages of Ensotek’s CTP cooling towers?',
 'Ensotek’s CTP cooling towers are made from fiberglass reinforced polyester, which means they do not require painting, are corrosion-resistant, and offer long service life.',
 'what-are-the-advantages-of-ensoteks-ctp-cooling-towers',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

('fa04de00-0000-0000-0000-000000000012',
 '44444444-4444-4444-4444-444444444444',
 'de',
 'Was sind die Vorteile der CTP-Kühltürme von Ensotek?',
 'Die CTP-Kühltürme von Ensotek bestehen aus glasfaserverstärktem Polyester, benötigen keine Lackierung, sind korrosionsbeständig und bieten eine lange Lebensdauer.',
 'was-sind-die-vorteile-der-ctp-kuehltuerme-von-ensotek',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

-- =============================================================
-- 5) Kapalı devre kule nedir ve ne zaman tercih edilir?
-- =============================================================
('fa05tr00-0000-0000-0000-000000000013',
 '55555555-5555-5555-5555-555555555555',
 'tr',
 'Kapalı devre su soğutma kulesi nedir ve hangi durumlarda tercih edilir?',
 'Kapalı devre soğutma kulelerinde prosese ait su dış ortamla temas etmeden, borular içinde dolaşır ve dışarıdan gelen su yalnızca boru yüzeyini soğutur. Böylece sistem suyu dış etkenlere, kirlenmeye ve kayba karşı korunmuş olur. Yüksek hijyen gerektiren, suyun tekrar kullanılması istenen veya don riski olan uygulamalarda tercih edilir.',
 'kapali-devre-sogutma-kulesi-nedir-ve-ne-zaman-tercih-edilir',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

('fa05en00-0000-0000-0000-000000000014',
 '55555555-5555-5555-5555-555555555555',
 'en',
 'What is a closed-circuit cooling tower and when should it be used?',
 'In closed-circuit cooling towers, the process water circulates inside pipes without contact with outside air, and only the external water cools the pipe surfaces. This protects the process water from contamination and losses. They are preferred in applications where hygiene is important, water needs to be reused, or there is a risk of freezing.',
 'what-is-a-closed-circuit-cooling-tower-and-when-should-it-be-used',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

('fa05de00-0000-0000-0000-000000000015',
 '55555555-5555-5555-5555-555555555555',
 'de',
 'Was ist ein geschlossener Kühlkreislauf und wann wird er eingesetzt?',
 'Bei Kühltürmen mit geschlossenem Kreislauf zirkuliert das Prozesswasser in Rohren und kommt nicht mit der Außenluft in Kontakt. Nur das äußere Wasser kühlt die Rohrleitungen. Dadurch ist das Systemwasser vor Verschmutzung und Verlust geschützt. Diese Türme werden bevorzugt, wenn hohe Hygieneanforderungen, Wiederverwendung des Wassers oder Frostgefahr bestehen.',
 'was-ist-ein-geschlossener-kuehlkreislauf-und-wann-wird-er-eingesetzt',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

-- =============================================================
-- 6) Buharlaşmalı kondenser nedir, avantajları nelerdir?
-- =============================================================
('fa06tr00-0000-0000-0000-000000000016',
 '66666666-6666-6666-6666-666666666666',
 'tr',
 'Buharlaşmalı kondenser nedir ve avantajları nelerdir?',
 'Buharlaşmalı kondenserler, soğutma gazının yoğuşmasını sağlamak için suyun buharlaşma etkisini kullanır. Bu sistemlerde hem hava hem de su, ısı transferini maksimize eder. Geleneksel hava soğutmalı veya su soğutmalı kondenserlere göre daha yüksek verim, daha az su ve enerji tüketimi sağlar. Kompakt yapısı sayesinde yer tasarrufu da sunar.',
 'buharlas-mali-kondenser-nedir-ve-avantajlari-nelerdir',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

('fa06en00-0000-0000-0000-000000000017',
 '66666666-6666-6666-6666-666666666666',
 'en',
 'What is an evaporative condenser and what are its advantages?',
 'Evaporative condensers use the effect of water evaporation to condense the refrigerant gas. Both air and water maximize heat transfer in these systems. Compared to traditional air- or water-cooled condensers, they provide higher efficiency with less water and energy consumption. Their compact design also saves space.',
 'what-is-an-evaporative-condenser-and-what-are-its-advantages',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

('fa06de00-0000-0000-0000-000000000018',
 '66666666-6666-6666-6666-666666666666',
 'de',
 'Was ist ein Verdunstungskondensator und welche Vorteile bietet er?',
 'Verdunstungskondensatoren nutzen die Verdunstung von Wasser, um das Kältemittelgas zu kondensieren. In diesen Systemen sorgen sowohl Luft als auch Wasser für maximalen Wärmetransfer. Im Vergleich zu herkömmlichen luft- oder wassergekühlten Kondensatoren bieten sie eine höhere Effizienz bei geringerem Wasser- und Energieverbrauch. Die kompakte Bauweise spart zudem Platz.',
 'was-ist-ein-verdunstungskondensator-und-welche-vorteile-bietet-er',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

-- =============================================================
-- 7) Periyodik bakım neden önemlidir?
-- =============================================================
('fa07tr00-0000-0000-0000-000000000019',
 '77777777-7777-7777-7777-777777777777',
 'tr',
 'Soğutma sistemlerinde periyodik bakım neden önemlidir?',
 'Düzenli bakım, soğutma sistemlerinin verimli, güvenli ve uzun ömürlü çalışmasını sağlar. Aksi halde enerji tüketimi artar, arızalar sıklaşır ve sistem ömrü kısalır.',
 'sogutma-sistemlerinde-periyodik-bakim-neden-onemlidir',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

('fa07en00-0000-0000-0000-000000000020',
 '77777777-7777-7777-7777-777777777777',
 'en',
 'Why is periodic maintenance important in cooling systems?',
 'Regular maintenance ensures cooling systems operate efficiently, safely, and with a long lifespan. Otherwise, energy consumption increases, failures occur more frequently, and system life is reduced.',
 'why-is-periodic-maintenance-important-in-cooling-systems',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

('fa07de00-0000-0000-0000-000000000021',
 '77777777-7777-7777-7777-777777777777',
 'de',
 'Warum ist die regelmäßige Wartung von Kühlsystemen wichtig?',
 'Regelmäßige Wartung sorgt dafür, dass Kühlsysteme effizient, sicher und langlebig arbeiten. Andernfalls steigt der Energieverbrauch, Störungen treten häufiger auf und die Lebensdauer des Systems verkürzt sich.',
 'warum-ist-die-regelmaessige-wartung-von-kuehlsystemen-wichtig',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

-- =============================================================
-- 8) Enerji verimliliği nasıl artırılır?
-- =============================================================
('fa08tr00-0000-0000-0000-000000000022',
 '88888888-8888-8888-8888-888888888888',
 'tr',
 'Soğutma sistemlerinde enerji verimliliği nasıl artırılır?',
 'Enerji verimliliği için modern teknolojilere sahip ekipmanlar, otomatik kontrol sistemleri ve düzenli bakım önemlidir. Ayrıca doğru kapasite seçimi ve izolasyon da enerji tasarrufu sağlar.',
 'sogutma-sistemlerinde-enerji-verimliligi-nasil-artirilir',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

('fa08en00-0000-0000-0000-000000000023',
 '88888888-8888-8888-8888-888888888888',
 'en',
 'How can energy efficiency be improved in cooling systems?',
 'To improve energy efficiency, use equipment with modern technology, automatic control systems, and ensure regular maintenance. Choosing the right capacity and proper insulation also save energy.',
 'how-can-energy-efficiency-be-improved-in-cooling-systems',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

('fa08de00-0000-0000-0000-000000000024',
 '88888888-8888-8888-8888-888888888888',
 'de',
 'Wie kann die Energieeffizienz in Kühlsystemen erhöht werden?',
 'Um die Energieeffizienz zu verbessern, sollten moderne Technologien, automatische Steuerungssysteme und regelmäßige Wartung verwendet werden. Auch die richtige Kapazitätsauswahl und Isolierung sparen Energie.',
 'wie-kann-die-energieeffizienz-in-kuehlsystemen-erhoeht-werden',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000')

ON DUPLICATE KEY UPDATE
  `question`   = VALUES(`question`),
  `answer`     = VALUES(`answer`),
  `slug`       = VALUES(`slug`),
  `updated_at` = VALUES(`updated_at`);

COMMIT;
