-- =============================================================
-- 232_projects_i18n_en.sql
-- Ensotek proje i18n kayıtları — ENGLISH (en)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
START TRANSACTION;

INSERT INTO `projects_i18n`
(
  id, project_id, locale,
  title, slug, summary, content,
  featured_image_alt, meta_title, meta_description,
  created_at, updated_at
)
VALUES

-- 1. İstanbul Plaza
(
  '55555001-0001-4555-8555-555500000001',
  '33333001-0001-4333-8333-333300000001',
  'en',
  'Istanbul High-Rise Plaza — 2× FRP-Canopy Open-Type Cooling Tower (130 m Rooftop)',
  'istanbul-plaza-rooftop-frp-canopy-open-type-cooling-tower-130m',
  'Two 2-fan FRP-canopy open-type cooling towers manufactured at ENSOTEK Istanbul Factory were successfully installed on the rooftop of a high-rise plaza building at 130 m elevation in Istanbul.',
  '{"html":"<p>Two <strong>FRP-canopy (CTP Kaportali) open-type cooling towers</strong>, each with 2 fans, manufactured at ENSOTEK\'s Istanbul Factory, were successfully installed on the rooftop of a high-rise commercial tower at <strong>130 m elevation</strong> in Istanbul.</p><h3>Project Specifications</h3><ul><li>Type: FRP-Canopy Open-Type Cooling Tower</li><li>Units: 2</li><li>Fans per unit: 2</li><li>Installation height: 130 m (rooftop)</li><li>Production plant: ENSOTEK Istanbul Factory</li></ul><p>The fiberglass-reinforced polyester (FRP) structure provides exceptional resistance to environmental conditions, ensuring reliable long-term performance even at extreme rooftop heights.</p>","description":"Two 2-fan FRP-canopy open-type cooling towers installed on a 130m rooftop plaza in Istanbul."}',
  'Istanbul Plaza Rooftop — FRP Canopy Open-Type Cooling Tower Installation',
  'Istanbul Plaza Rooftop FRP Cooling Tower — ENSOTEK',
  'Two 2-fan FRP-canopy open-type cooling towers installed at 130 m rooftop height in Istanbul. ENSOTEK Turkey cooling tower project.',
  NOW(3), NOW(3)
),

-- 2. Kahramanmaraş
(
  '55555001-0002-4555-8555-555500000002',
  '33333001-0002-4333-8333-333300000002',
  'en',
  'Kahramanmaraş Industrial Facility — FRP-Canopy Open-Type Cooling Tower',
  'kahramanmaras-industrial-frp-canopy-open-type-cooling-tower',
  'FRP-canopy open-type cooling towers manufactured at ENSOTEK Ankara Factory were successfully delivered and commissioned at an industrial facility in Kahramanmaraş.',
  '{"html":"<p><strong>FRP-canopy open-type cooling towers</strong> produced at ENSOTEK\'s Ankara Factory have been successfully manufactured and commissioned at an industrial facility in <strong>Kahramanmaraş</strong>, Turkey.</p><h3>Project Details</h3><ul><li>Type: FRP-Canopy Open-Type Cooling Tower</li><li>Production plant: ENSOTEK Ankara Factory</li><li>Location: Kahramanmaraş, Turkey</li><li>Application: Industrial process cooling</li></ul><p>ENSOTEK\'s Ankara facility—Turkey\'s largest cooling tower production plant—handles FRP manufacturing, serpentine coil production, and full tower assembly in-house, ensuring the highest quality standards.</p>","description":"FRP-canopy open-type cooling towers from Ankara Factory installed at Kahramanmaraş industrial facility."}',
  'Kahramanmaraş — FRP Canopy Open-Type Cooling Tower',
  'Kahramanmaraş Industrial Cooling Tower — ENSOTEK Ankara Factory',
  'ENSOTEK Ankara Factory FRP-canopy open-type cooling towers delivered and commissioned at Kahramanmaraş industrial facility.',
  NOW(3), NOW(3)
),

-- 3. Arçelik
(
  '55555001-0003-4555-8555-555500000003',
  '33333001-0003-4333-8333-333300000003',
  'en',
  'Arçelik — 2× CTP 6C Open-Type Cooling Towers',
  'arcelik-ctp-6c-open-type-cooling-towers',
  'Two CTP 6C open-type FRP cooling towers were supplied and commissioned for Arçelik\'s production facility in Gebze, Kocaeli.',
  '{"html":"<p>Two <strong>CTP 6C open-type FRP cooling towers</strong> were designed, manufactured, and commissioned for the production facility of <strong>Arçelik A.Ş.</strong>, one of Turkey\'s largest consumer electronics manufacturers.</p><h3>Project Details</h3><ul><li>Model: CTP 6C (Open Circuit)</li><li>Units: 2</li><li>Location: Gebze, Kocaeli</li><li>Sector: Consumer Electronics / Industrial Manufacturing</li></ul><h3>CTP 6C Specification</h3><p>The CTP 6C is a mid-to-large-capacity open-circuit cooling tower. Its FRP body provides superior resistance to corrosion, UV radiation, and chemical exposure, making it ideal for long-term industrial use.</p>","description":"2× CTP 6C open-type FRP cooling towers for Arçelik production facility in Gebze, Kocaeli."}',
  'Arçelik Facility — 2× CTP 6C Open-Type Cooling Towers',
  'Arçelik CTP 6C Cooling Tower Project — ENSOTEK',
  'Two CTP 6C open-type FRP cooling towers supplied by ENSOTEK for Arçelik production facility in Gebze, Kocaeli, Turkey.',
  NOW(3), NOW(3)
),

-- 4. Eczacıbaşı
(
  '55555001-0004-4555-8555-555500000004',
  '33333001-0004-4333-8333-333300000004',
  'en',
  'Eczacıbaşı — 3× DCTP 5C Closed-Circuit Cooling Towers',
  'eczacibasi-dctp-5c-closed-circuit-cooling-towers',
  'Three DCTP 5C closed-circuit FRP cooling towers were installed for Eczacıbaşı\'s pharmaceutical and chemical manufacturing facility in Istanbul.',
  '{"html":"<p>Three <strong>DCTP 5C closed-circuit FRP cooling towers</strong> have been installed at a production facility belonging to <strong>Eczacıbaşı</strong>, one of Turkey\'s most established pharmaceutical and chemical groups.</p><h3>Project Details</h3><ul><li>Model: DCTP 5C (Closed Circuit)</li><li>Units: 3</li><li>Location: Istanbul</li><li>Sector: Pharmaceutical / Chemical</li></ul><h3>Why Closed Circuit for Pharma?</h3><p>In pharmaceutical and chemical manufacturing, isolating the process fluid from the external environment is critical. The DCTP 5C\'s coil-type heat exchanger ensures the process fluid never comes into contact with cooling water, maintaining product quality and hygiene standards.</p>","description":"3× DCTP 5C closed-circuit FRP cooling towers for Eczacıbaşı pharmaceutical facility in Istanbul."}',
  'Eczacıbaşı — 3× DCTP 5C Closed-Circuit Cooling Towers',
  'Eczacıbaşı DCTP 5C Closed-Circuit Cooling Tower — ENSOTEK',
  'Three DCTP 5C closed-circuit FRP cooling towers installed by ENSOTEK for Eczacıbaşı pharmaceutical facility in Istanbul.',
  NOW(3), NOW(3)
),

-- 5. Linde Gaz
(
  '55555001-0005-4555-8555-555500000005',
  '33333001-0005-4333-8333-333300000005',
  'en',
  'Linde Gas — 3× TCTP 26B + 1× DCTP 12C High-Capacity Closed-Circuit Cooling System — Gebze',
  'linde-gas-tctp-26b-dctp-12c-closed-circuit-cooling-system-gebze',
  'A high-capacity closed-circuit cooling system comprising 3× TCTP 26B and 1× DCTP 12C cooling towers was installed for Linde Gas Turkey\'s process plant in Gebze, Kocaeli.',
  '{"html":"<p>A large-scale closed-circuit cooling system was installed for the process plant of <strong>Linde Gas Turkey</strong> in Gebze, Kocaeli. The system combines ENSOTEK\'s highest-capacity tower models to meet the facility\'s demanding cooling requirements.</p><h3>System Components</h3><ul><li>3× TCTP 26B — High-capacity counter-flow closed-circuit cooling tower</li><li>1× DCTP 12C — Double-cell closed-circuit cooling tower</li><li>Total units: 4</li><li>Location: Gebze, Kocaeli</li><li>Sector: Industrial Gases / Chemistry</li></ul><h3>TCTP 26B Overview</h3><p>The TCTP series is designed for high-heat-rejection process applications using a counter-flow design. The FRP enclosure and high-efficiency coil heat exchanger system deliver long service life with minimal maintenance requirements.</p>","description":"3× TCTP 26B + 1× DCTP 12C high-capacity closed-circuit cooling system for Linde Gas Turkey in Gebze."}',
  'Linde Gas Gebze — TCTP 26B + DCTP 12C Cooling System',
  'Linde Gas TCTP 26B DCTP 12C Closed-Circuit Cooling Tower — ENSOTEK Gebze',
  'High-capacity 3× TCTP 26B and 1× DCTP 12C closed-circuit cooling system installed by ENSOTEK for Linde Gas Turkey in Gebze, Kocaeli.',
  NOW(3), NOW(3)
),

-- 6. HES Kablo
(
  '55555001-0006-4555-8555-555500000006',
  '33333001-0006-4333-8333-333300000006',
  'en',
  'HES Kablo — DCTP 12 + DCTP 12C Closed-Circuit Cooling Towers',
  'hes-kablo-dctp-12-dctp-12c-closed-circuit-cooling-towers',
  'A DCTP 12 (with service ladder accessory) and DCTP 12C closed-circuit cooling tower system was commissioned for HES Kablo\'s cable manufacturing facility.',
  '{"html":"<p>Two <strong>DCTP series closed-circuit cooling towers</strong> were supplied for the cable manufacturing facility of <strong>HES Kablo</strong>.</p><h3>System Details</h3><ul><li>DCTP 12 — Single-cell closed-circuit cooling tower (with service ladder accessory)</li><li>DCTP 12C — Double-cell closed-circuit cooling tower</li><li>Sector: Cable Manufacturing / Electrical</li><li>Special feature: Custom service ladder accessory for maintenance access</li></ul><p>In cable manufacturing, cooling of drawing and extrusion equipment is critical for product quality. The closed-circuit system prevents cooling water contamination, ensuring a clean and controlled production environment.</p>","description":"DCTP 12 (with service ladder) + DCTP 12C closed-circuit cooling towers for HES Kablo cable facility."}',
  'HES Kablo — DCTP 12 + DCTP 12C Closed-Circuit Cooling Tower',
  'HES Kablo DCTP Closed-Circuit Cooling Tower — ENSOTEK',
  'DCTP 12 and DCTP 12C closed-circuit cooling towers commissioned by ENSOTEK for HES Kablo cable manufacturing facility.',
  NOW(3), NOW(3)
),

-- 7. Green Park Otel
(
  '55555001-0007-4555-8555-555500000007',
  '33333001-0007-4333-8333-333300000007',
  'en',
  'Green Park Hotel — 2× CTP 3C Open-Type Cooling Towers',
  'green-park-hotel-ctp-3c-open-type-cooling-towers',
  'Two CTP 3C open-type FRP cooling towers were integrated into the central HVAC cooling system at a Green Park Hotels property.',
  '{"html":"<p>Two <strong>CTP 3C open-type FRP cooling towers</strong> have been integrated into the central air-conditioning system of a <strong>Green Park Hotels</strong> property.</p><h3>Project Details</h3><ul><li>Model: CTP 3C (Open Circuit)</li><li>Units: 2</li><li>Sector: Hotel / Hospitality / HVAC</li><li>Application: Central chiller cooling water system</li></ul><h3>CTP Series for Hospitality</h3><p>ENSOTEK\'s CTP series cooling towers offer low noise levels, compact dimensions, and an aesthetic appearance—ideal for hotel and hospitality applications. The FRP body minimizes maintenance requirements, reducing operating costs over the tower\'s lifetime.</p>","description":"2× CTP 3C open-type cooling towers integrated into the HVAC system at a Green Park Hotels property."}',
  'Green Park Hotel — 2× CTP 3C Open-Type Cooling Towers',
  'Green Park Hotel CTP 3C Cooling Tower — ENSOTEK HVAC',
  'Two CTP 3C open-type FRP cooling towers installed by ENSOTEK for Green Park Hotels HVAC cooling system.',
  NOW(3), NOW(3)
),

-- 8. Orion AVM
(
  '55555001-0008-4555-8555-555500000008',
  '33333001-0008-4333-8333-333300000008',
  'en',
  'Orion Shopping Mall — TCTP 9C Closed-Circuit Cooling Tower',
  'orion-shopping-mall-tctp-9c-closed-circuit-cooling-tower',
  'A TCTP 9C closed-circuit cooling tower was installed for the central HVAC cooling system of Orion Shopping Mall.',
  '{"html":"<p>A <strong>TCTP 9C closed-circuit cooling tower</strong> was integrated into the central HVAC infrastructure of <strong>Orion Shopping Mall</strong>.</p><h3>Project Details</h3><ul><li>Model: TCTP 9C (Counter-flow — Closed Circuit)</li><li>Units: 1</li><li>Sector: Commercial / Shopping Mall</li><li>Application: Central chiller cooling water (year-round)</li></ul><p>The TCTP 9C\'s compact footprint and reliable performance make it well-suited for commercial buildings requiring year-round cooling capacity. ENSOTEK\'s FRP construction ensures long operational life with minimal maintenance intervention.</p>","description":"TCTP 9C closed-circuit cooling tower for Orion Shopping Mall central HVAC cooling system."}',
  'Orion Shopping Mall — TCTP 9C Closed-Circuit Cooling Tower',
  'Orion Shopping Mall TCTP 9C Cooling Tower — ENSOTEK',
  'TCTP 9C closed-circuit cooling tower installed by ENSOTEK for Orion Shopping Mall HVAC system.',
  NOW(3), NOW(3)
),

-- 9. Plastifay
(
  '55555001-0009-4555-8555-555500000009',
  '33333001-0009-4333-8333-333300000009',
  'en',
  'Plastifay — CTP 9 Open-Type Cooling Tower',
  'plastifay-ctp-9-open-type-cooling-tower',
  'A CTP 9 open-type FRP cooling tower was commissioned for Plastifay\'s plastics manufacturing facility.',
  '{"html":"<p>A <strong>CTP 9 open-type FRP cooling tower</strong> was installed at <strong>Plastifay</strong>\'s production facility to meet its process cooling requirements.</p><h3>Project Details</h3><ul><li>Model: CTP 9 (Open Circuit)</li><li>Sector: Plastics / Chemicals</li><li>Application: Process equipment cooling (injection moulding / extrusion)</li></ul><p>Open-circuit cooling towers are widely used for cooling injection moulding and extrusion machinery in the plastics industry. The CTP 9 model offers optimised capacity and efficiency for these applications.</p>","description":"CTP 9 open-type FRP cooling tower for Plastifay plastics manufacturing facility."}',
  'Plastifay — CTP 9 Open-Type Cooling Tower',
  'Plastifay CTP 9 Open-Type Cooling Tower — ENSOTEK',
  'CTP 9 open-type FRP cooling tower commissioned by ENSOTEK for Plastifay plastics production facility.',
  NOW(3), NOW(3)
),

-- 10. Aves Yağ — Mersin
(
  '55555001-0010-4555-8555-555500000010',
  '33333001-0010-4333-8333-333300000010',
  'en',
  'Aves Yağ — TCTP 9B + DCTP 9B Combined Closed-Circuit Cooling System — Mersin',
  'aves-yag-tctp-9b-dctp-9b-combined-cooling-system-mersin',
  'A combined closed-circuit cooling system comprising a TCTP 9B and DCTP 9B was installed for Aves Yağ\'s edible oil production facility in Mersin.',
  '{"html":"<p>A combined closed-circuit cooling system was commissioned for <strong>Aves Yağ</strong>\'s edible oil production facility in <strong>Mersin</strong>, Turkey.</p><h3>System Components</h3><ul><li>1× TCTP 9B — Counter-flow closed-circuit cooling tower</li><li>1× DCTP 9B — Double-cell closed-circuit cooling tower</li><li>Location: Mersin, Turkey</li><li>Sector: Food & Beverage / Edible Oil Production</li></ul><h3>Closed-Circuit Cooling for Food Industry</h3><p>Hygiene and product safety are the top priorities in food production. A closed-circuit cooling system prevents process fluid from being exposed to external contaminants. The TCTP 9B and DCTP 9B combination provides balanced coverage of varying capacity demands at the facility.</p>","description":"TCTP 9B + DCTP 9B combined closed-circuit cooling system for Aves Yağ edible oil facility in Mersin."}',
  'Aves Yağ Mersin — TCTP 9B + DCTP 9B Combined Cooling System',
  'Aves Yağ Mersin TCTP DCTP Closed-Circuit Cooling — ENSOTEK',
  'TCTP 9B and DCTP 9B combined closed-circuit cooling system installed by ENSOTEK for Aves Yağ edible oil facility in Mersin.',
  NOW(3), NOW(3)
),

-- 11. TAT Tekstil — Gaziantep
(
  '55555001-0011-4555-8555-555500000011',
  '33333001-0011-4333-8333-333300000011',
  'en',
  'TAT Tekstil — FRP-Canopy Open-Type Cooling Tower — Gaziantep',
  'tat-tekstil-frp-canopy-open-type-cooling-tower-gaziantep',
  'An FRP-canopy open-type cooling tower system was installed for TAT Tekstil\'s textile manufacturing facility in Gaziantep.',
  '{"html":"<p>An <strong>FRP-canopy open-type cooling tower</strong> system was supplied for <strong>TAT Tekstil</strong>\'s production facility in <strong>Gaziantep</strong>, Turkey.</p><h3>Project Details</h3><ul><li>Location: Gaziantep, Turkey</li><li>Sector: Textile / Yarn Manufacturing</li><li>Application: Textile machinery process cooling</li></ul><h3>Cooling in Textile Industry</h3><p>Textile production processes—including dyeing, washing, and weaving—generate significant heat loads. ENSOTEK\'s FRP-canopy open-type cooling towers provide a cost-effective and efficient solution for these demanding industrial applications.</p>","description":"FRP-canopy open-type cooling tower for TAT Tekstil textile manufacturing facility in Gaziantep."}',
  'TAT Tekstil Gaziantep — FRP Canopy Open-Type Cooling Tower',
  'TAT Tekstil Gaziantep Cooling Tower — ENSOTEK',
  'FRP-canopy open-type cooling tower installed by ENSOTEK for TAT Tekstil textile facility in Gaziantep, Turkey.',
  NOW(3), NOW(3)
),

-- 12. Saudi Arabia
(
  '55555001-0012-4555-8555-555500000012',
  '33333001-0012-4333-8333-333300000012',
  'en',
  'Saudi Arabia — Industrial FRP Cooling Tower Export Project',
  'saudi-arabia-industrial-frp-cooling-tower-export',
  'ENSOTEK successfully completed an industrial FRP/GRP cooling tower export project to Saudi Arabia, one of the largest economies in the Middle East.',
  '{"html":"<p>ENSOTEK, as Turkey\'s largest cooling tower manufacturer, has successfully delivered an <strong>industrial FRP/GRP cooling tower</strong> system to <strong>Saudi Arabia</strong> as part of its international export activities.</p><h3>Export Project Details</h3><ul><li>Country: Saudi Arabia</li><li>Product: FRP / GRP Open-Type Cooling Tower</li><li>Application: Industrial process cooling</li><li>Sector: Petrochemical / Energy / Industrial</li></ul><h3>Performance in Extreme Climates</h3><p>Saudi Arabia\'s high ambient temperatures and harsh climate demand special design considerations for cooling towers. ENSOTEK\'s FRP/GRP body construction offers superior resistance to solar radiation and extreme heat, ensuring reliable performance even in desert conditions.</p>","description":"Industrial FRP/GRP cooling tower export project to Saudi Arabia. ENSOTEK international reference."}',
  'Saudi Arabia — Industrial FRP GRP Cooling Tower Export',
  'Saudi Arabia FRP Cooling Tower Export — ENSOTEK International',
  'ENSOTEK successfully delivered an industrial FRP/GRP cooling tower to Saudi Arabia. International export project.',
  NOW(3), NOW(3)
),

-- 13. Iran
(
  '55555001-0013-4555-8555-555500000013',
  '33333001-0013-4333-8333-333300000013',
  'en',
  'Iran — Industrial FRP Cooling Tower Export Project',
  'iran-industrial-frp-cooling-tower-export',
  'ENSOTEK successfully completed an FRP/GRP open-type cooling tower export project for an industrial facility in Iran.',
  '{"html":"<p>ENSOTEK has successfully supplied an <strong>FRP/GRP open-type cooling tower</strong> system to an industrial facility in <strong>Iran</strong> as part of its regional export programme.</p><h3>Project Details</h3><ul><li>Country: Iran</li><li>Product: FRP / GRP Open-Type Cooling Tower</li><li>Application: Industrial process cooling</li></ul><p>ENSOTEK leverages its 40+ years of experience in the Turkish market to deliver reliable cooling solutions to international markets across the Middle East and beyond.</p>","description":"FRP/GRP open-type cooling tower export project for industrial facility in Iran. ENSOTEK international reference."}',
  'Iran — Industrial FRP GRP Cooling Tower Export',
  'Iran FRP Cooling Tower Export — ENSOTEK International',
  'ENSOTEK successfully exported FRP/GRP open-type cooling towers to an industrial facility in Iran.',
  NOW(3), NOW(3)
),

-- 14. Tüpraş — İzmit
(
  '55555001-0014-4555-8555-555500000014',
  '33333001-0014-4333-8333-333300000014',
  'en',
  'Tüpraş İzmit Refinery — Process Cooling Tower System',
  'tupras-izmit-refinery-process-cooling-tower',
  'A high-capacity process cooling tower system was supplied for Tüpraş İzmit Refinery, Turkey\'s largest oil refinery.',
  '{"html":"<p>A <strong>process cooling tower system</strong> was supplied by ENSOTEK for the <strong>Tüpraş İzmit Refinery</strong>, operated by Türkiye Petrol Rafinerileri A.Ş.—Turkey\'s largest industrial enterprise.</p><h3>Project Details</h3><ul><li>Client: Tüpraş (Türkiye Petrol Rafinerileri A.Ş.)</li><li>Location: İzmit, Kocaeli</li><li>Sector: Petrochemical / Oil Refining</li><li>Application: Refinery process cooling</li></ul><h3>Cooling in Oil Refining</h3><p>Oil refineries—including distillation, cracking, and other process units—generate extreme heat loads that require large-capacity cooling systems. ENSOTEK cooling towers provide reliable, high-capacity heat rejection for these demanding applications. The FRP/GRP material offers outstanding resistance to chemical and corrosive environments typical of refinery operations.</p>","description":"High-capacity process cooling tower system for Tüpraş İzmit Refinery — petrochemical sector reference."}',
  'Tüpraş İzmit Refinery — Process Cooling Tower System',
  'Tüpraş İzmit Refinery Cooling Tower — ENSOTEK',
  'High-capacity process cooling tower system supplied by ENSOTEK for Tüpraş İzmit Refinery, Turkey\'s largest oil refinery.',
  NOW(3), NOW(3)
),

-- 15. TOFAS — Bursa
(
  '55555001-0015-4555-8555-555500000015',
  '33333001-0015-4333-8333-333300000015',
  'en',
  'TOFAS Bursa Automotive Plant — FRP-Canopy Open-Type Cooling Tower',
  'tofas-bursa-automotive-plant-frp-canopy-open-type-cooling-tower',
  'An FRP-canopy open-type cooling tower system was commissioned for TOFAS\'s automotive manufacturing plant in Bursa, one of Turkey\'s major vehicle production hubs.',
  '{"html":"<p>An <strong>FRP-canopy open-type cooling tower</strong> system was supplied for <strong>TOFAS</strong>\'s (Türk Otomobil Fabrikası A.Ş.) large-scale automotive manufacturing plant in <strong>Bursa</strong>.</p><h3>Project Details</h3><ul><li>Client: TOFAS (Türk Otomobil Fabrikası A.Ş.)</li><li>Location: Bursa, Turkey</li><li>Sector: Automotive / Vehicle Manufacturing</li><li>Application: Paint lines, mould cooling, and process equipment cooling</li></ul><h3>Cooling in Automotive Manufacturing</h3><p>Automotive plants—including paint lines, welding stations, and mould-cooling systems—require high-volume cooling capacity. ENSOTEK\'s FRP-canopy open-type cooling towers provide high flow capacity, long service life, and low maintenance costs to meet these requirements.</p>","description":"FRP-canopy open-type cooling tower for TOFAS Bursa automotive manufacturing plant."}',
  'TOFAS Bursa Automotive Plant — FRP Canopy Open-Type Cooling Tower',
  'TOFAS Bursa Automotive Plant Cooling Tower — ENSOTEK',
  'FRP-canopy open-type cooling tower system supplied by ENSOTEK for TOFAS automotive manufacturing plant in Bursa, Turkey.',
  NOW(3), NOW(3)
);

COMMIT;
