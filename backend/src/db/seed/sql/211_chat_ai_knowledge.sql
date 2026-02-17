-- =============================================================
-- Chat AI knowledge base (admin managed, locale aware)
-- Ensotek — Industrial Cooling & HVAC Solutions
-- =============================================================

CREATE TABLE IF NOT EXISTS `chat_ai_knowledge` (
  `id` varchar(36) NOT NULL,
  `locale` varchar(10) NOT NULL,
  `title` varchar(160) NOT NULL,
  `content` text NOT NULL,
  `tags` varchar(500) DEFAULT NULL,
  `is_active` tinyint NOT NULL DEFAULT 1,
  `priority` int NOT NULL DEFAULT 100,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ix_chat_ai_knowledge_locale_active_priority` (`locale`, `is_active`, `priority`),
  KEY `ix_chat_ai_knowledge_updated` (`updated_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── TR (Türkçe — Ana Dil) ────────────────────────────────────

INSERT INTO `chat_ai_knowledge`
(`id`, `locale`, `title`, `content`, `tags`, `is_active`, `priority`)
VALUES
(
  'c1000000-0000-0000-0000-000000000001',
  'tr',
  'Fiyat bilgisi politikası',
  'Fiyat bilgisi bu kanaldan paylaşılmaz. Fiyat sorusu gelirse şu mesajı ver: "Fiyat bilgisini bu kanaldan paylaşamıyorum. Güncel fiyatlarımızı web sitemizden görebilir veya telefonla öğrenebilirsiniz. Teklif oluşturmak ister misiniz?"',
  'fiyat,ücret,tarife,maliyet,teklif',
  1,
  1
),
(
  'c1000000-0000-0000-0000-000000000002',
  'tr',
  'Teklif formu yönlendirmesi',
  'Müşteri teklif almak istediğinde veya onay verdiğinde online teklif formuna yönlendir. Onay olmadan link paylaşma.',
  'teklif,fiyat teklifi,offer,yönlendirme',
  1,
  2
),
(
  'c1000000-0000-0000-0000-000000000003',
  'tr',
  'Ensotek ürün ve hizmetleri',
  'Ensotek, endüstriyel soğutma sistemleri, HVAC çözümleri, chiller sistemleri, soğuk hava depoları, klima santralleri ve ısı pompası sistemleri konusunda uzmanlaşmıştır. Ayrıca proses soğutma, gıda soğutma, soğuk oda sistemleri ve endüstriyel iklimlendirme çözümleri sunuyoruz. Detaylar için web sitesine veya ürün kataloglarına yönlendir.',
  'ürün,hizmet,soğutma,chiller,hvac,klima,ısı pompası,proses,endüstriyel',
  1,
  3
),
(
  'c1000000-0000-0000-0000-000000000004',
  'tr',
  'Teknik destek ve servis',
  'Ensotek, kurulum, devreye alma, bakım-onarım ve 7/24 acil servis hizmeti sunmaktadır. Teknik destek talebi için müşteriyi destek formuna veya telefon numarasına yönlendir. Acil durumlar için acil servis hattını belirt.',
  'servis,destek,bakım,onarım,kurulum,teknik destek,arıza',
  1,
  4
),
(
  'c1000000-0000-0000-0000-000000000005',
  'tr',
  'Proje danışmanlığı',
  'Müşteri yeni bir proje için danışmanlık talep ederse, mühendislik ekibimizin ücretsiz ön görüşme ve keşif yapabileceğini belirt. Proje detayları için teklif formu doldurmasını veya doğrudan iletişime geçmesini öner.',
  'proje,danışmanlık,mühendislik,keşif,planlama',
  1,
  5
),
(
  'c1000000-0000-0000-0000-000000000006',
  'tr',
  'Garanti ve yedek parça',
  'Ensotek ürünleri standart üretici garantisi ile birlikte gelir. Garanti süresi ürüne göre değişir. Yedek parça ve sarf malzeme temini için destek ekibine yönlendir. Garanti detayları için web sitesini öner.',
  'garanti,yedek parça,sarf malzeme,bakım parçası',
  1,
  6
),
(
  'c1000000-0000-0000-0000-000000000007',
  'tr',
  'Enerji verimliliği ve çevre',
  'Ensotek, enerji verimliliği yüksek ve çevre dostu soğutma çözümleri sunmaktadır. Doğal soğutucu akışkanlar, inverter teknoloji ve akıllı kontrol sistemleri kullanarak enerji tasarrufu sağlanır. Detaylar için teknik dökümanları veya web sitesini öner.',
  'enerji,verimlilik,çevre,tasarruf,doğal soğutucu,inverter',
  1,
  7
),
(
  'c1000000-0000-0000-0000-000000000008',
  'tr',
  'Referanslar ve projeler',
  'Ensotek, gıda, ilaç, kimya, otomotiv ve birçok sektörde başarılı projeler gerçekleştirmiştir. Referans listesi ve proje görselleri için web sitesindeki "Referanslar" veya "Projeler" bölümüne yönlendir.',
  'referans,proje,örnek,başarı hikayesi,çalışma',
  1,
  8
),

-- ─── EN (English) ───────────────────────────────────────────

(
  'c1000000-0000-0000-0000-000000000011',
  'en',
  'Price inquiry policy',
  'Do not share pricing in this chat channel. For price questions use: "I cannot share pricing here. You can find our current prices on our website or call us directly. Would you like me to redirect you to our quote request form?"',
  'price,cost,rate,pricing,quote',
  1,
  1
),
(
  'c1000000-0000-0000-0000-000000000012',
  'en',
  'Quote request redirect',
  'When the customer wants a quote or gives consent, redirect them to the online quote request form. Only share the link after explicit confirmation.',
  'quote,offer,request,pricing,redirect',
  1,
  2
),
(
  'c1000000-0000-0000-0000-000000000013',
  'en',
  'Ensotek products and services',
  'Ensotek specializes in industrial cooling systems, HVAC solutions, chiller systems, cold storage, air handling units and heat pump systems. We also offer process cooling, food refrigeration, cold room systems and industrial air conditioning solutions. Refer to the website or product catalogs for details.',
  'product,service,cooling,chiller,hvac,climate,heat pump,process,industrial',
  1,
  3
),
(
  'c1000000-0000-0000-0000-000000000014',
  'en',
  'Technical support and service',
  'Ensotek provides installation, commissioning, maintenance, repair and 24/7 emergency service. For technical support requests, direct the customer to the support form or phone number. Mention the emergency service hotline for urgent cases.',
  'service,support,maintenance,repair,installation,technical support,breakdown',
  1,
  4
),
(
  'c1000000-0000-0000-0000-000000000015',
  'en',
  'Project consulting',
  'If the customer requests consulting for a new project, mention that our engineering team can provide free preliminary consultation and site survey. Suggest filling out the quote form or contacting us directly for project details.',
  'project,consulting,engineering,survey,planning',
  1,
  5
),
(
  'c1000000-0000-0000-0000-000000000016',
  'en',
  'Warranty and spare parts',
  'Ensotek products come with standard manufacturer warranty. Warranty period varies by product. Direct to support team for spare parts and consumables. Suggest checking the website for warranty details.',
  'warranty,spare parts,consumables,maintenance parts',
  1,
  6
),
(
  'c1000000-0000-0000-0000-000000000017',
  'en',
  'Energy efficiency and environment',
  'Ensotek offers energy-efficient and environmentally friendly cooling solutions. Energy savings are achieved through natural refrigerants, inverter technology and smart control systems. Suggest technical documentation or website for details.',
  'energy,efficiency,environment,savings,natural refrigerant,inverter',
  1,
  7
),
(
  'c1000000-0000-0000-0000-000000000018',
  'en',
  'References and projects',
  'Ensotek has successfully completed projects in food, pharmaceutical, chemical, automotive and many other industries. Direct to the "References" or "Projects" section on the website for reference list and project visuals.',
  'reference,project,example,success story,case',
  1,
  8
),

-- ─── DE (Deutsch) ───────────────────────────────────────────

(
  'c1000000-0000-0000-0000-000000000021',
  'de',
  'Preisauskunft-Richtlinie',
  'Preise dürfen in diesem Chat nicht genannt werden. Bei Preisfragen antworte: "Preise teile ich hier nicht mit. Sie finden unsere aktuellen Preise auf unserer Website oder können telefonisch nachfragen. Möchten Sie, dass ich Sie zum Angebotsformular weiterleite?"',
  'preis,kosten,preisliste,tarif,angebot',
  1,
  1
),
(
  'c1000000-0000-0000-0000-000000000022',
  'de',
  'Angebotsanfrage weiterleiten',
  'Wenn der Kunde ein Angebot wünscht oder zustimmt, leite ihn zum Online-Angebotsformular weiter. Teile den Link nur nach ausdrücklicher Zustimmung.',
  'angebot,anfrage,preis,weiterleitung',
  1,
  2
),
(
  'c1000000-0000-0000-0000-000000000023',
  'de',
  'Ensotek Produkte und Dienstleistungen',
  'Ensotek ist spezialisiert auf industrielle Kühlsysteme, HVAC-Lösungen, Kältemaschinen, Kühlhäuser, Klimazentralen und Wärmepumpensysteme. Wir bieten auch Prozesskühlung, Lebensmittelkühlung, Kühlraumsysteme und industrielle Klimatisierungslösungen an. Für Details verweisen Sie auf die Website oder Produktkataloge.',
  'produkt,dienstleistung,kühlung,kältemaschine,hvac,klima,wärmepumpe,prozess,industrie',
  1,
  3
),
(
  'c1000000-0000-0000-0000-000000000024',
  'de',
  'Technischer Support und Service',
  'Ensotek bietet Installation, Inbetriebnahme, Wartung, Reparatur und 24/7-Notdienst. Für technische Supportanfragen leiten Sie den Kunden zum Supportformular oder zur Telefonnummer. Erwähnen Sie die Notdienst-Hotline für dringende Fälle.',
  'service,support,wartung,reparatur,installation,technischer support,störung',
  1,
  4
),
(
  'c1000000-0000-0000-0000-000000000025',
  'de',
  'Projektberatung',
  'Wenn der Kunde Beratung für ein neues Projekt wünscht, erwähnen Sie, dass unser Engineering-Team kostenlose Vorabberatung und Vor-Ort-Besichtigung anbieten kann. Schlagen Sie vor, das Angebotsformular auszufüllen oder uns direkt für Projektdetails zu kontaktieren.',
  'projekt,beratung,engineering,besichtigung,planung',
  1,
  5
),
(
  'c1000000-0000-0000-0000-000000000026',
  'de',
  'Garantie und Ersatzteile',
  'Ensotek-Produkte werden mit Standard-Herstellergarantie geliefert. Die Garantiedauer variiert je nach Produkt. Leiten Sie für Ersatzteile und Verbrauchsmaterialien an das Support-Team weiter. Schlagen Sie vor, die Website für Garantiedetails zu prüfen.',
  'garantie,ersatzteile,verbrauchsmaterial,wartungsteile',
  1,
  6
),
(
  'c1000000-0000-0000-0000-000000000027',
  'de',
  'Energieeffizienz und Umwelt',
  'Ensotek bietet energieeffiziente und umweltfreundliche Kühllösungen. Energieeinsparungen werden durch natürliche Kältemittel, Inverter-Technologie und intelligente Steuerungssysteme erreicht. Schlagen Sie technische Dokumentation oder Website für Details vor.',
  'energie,effizienz,umwelt,einsparung,natürliches kältemittel,inverter',
  1,
  7
),
(
  'c1000000-0000-0000-0000-000000000028',
  'de',
  'Referenzen und Projekte',
  'Ensotek hat erfolgreich Projekte in der Lebensmittel-, Pharma-, Chemie-, Automobil- und vielen anderen Branchen abgeschlossen. Verweisen Sie auf den Bereich "Referenzen" oder "Projekte" auf der Website für Referenzliste und Projektbilder.',
  'referenz,projekt,beispiel,erfolgsgeschichte,fallstudie',
  1,
  8
)

ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `content` = VALUES(`content`),
  `tags` = VALUES(`tags`),
  `is_active` = VALUES(`is_active`),
  `priority` = VALUES(`priority`),
  `updated_at` = CURRENT_TIMESTAMP;
