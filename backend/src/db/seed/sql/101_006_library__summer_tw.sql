-- =============================================================
-- FILE: src/db/seed/sql/library/101_006_library__summer_tw.sql
-- Ensotek - Library Item Seed (Turkey Summer Dry/Wet Bulb Design Values)
-- FINAL / CLEAN / IDEMPOTENT (DETERMINISTIC IDS) / SCHEMA-SAFE (0100_library.sql)
--
-- ✅ NO variables, NO SELECT, NO dynamic/formula
-- ✅ Fixed UUIDs + ON DUPLICATE KEY UPDATE
-- ✅ 3 locales: tr / en / de (FULL CONTENT IN EACH)
-- ✅ Schema uyumlu: library / library_i18n / library_images / library_images_i18n
-- ✅ Optional image: 1 adet (display_order=10)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

-- =============================================================
-- 1) PARENT: library (fixed id)
-- =============================================================
INSERT INTO `library`
(
  `id`,
  `type`,

  `category_id`,
  `sub_category_id`,

  `featured`,
  `is_published`,
  `is_active`,
  `display_order`,

  `featured_image`,
  `image_url`,
  `image_asset_id`,

  `views`,
  `download_count`,
  `published_at`,

  `created_at`,
  `updated_at`
)
VALUES
(
  '88888888-8888-8888-8888-888888888888',
  'other',

  NULL,
  NULL,

  0,
  1,
  1,
  110,

  NULL,
  NULL,
  NULL,

  0,
  0,
  NOW(3),

  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `type`            = VALUES(`type`),

  `category_id`     = VALUES(`category_id`),
  `sub_category_id` = VALUES(`sub_category_id`),

  `featured`        = VALUES(`featured`),
  `is_published`    = VALUES(`is_published`),
  `is_active`       = VALUES(`is_active`),
  `display_order`   = VALUES(`display_order`),

  `featured_image`  = VALUES(`featured_image`),
  `image_url`       = VALUES(`image_url`),
  `image_asset_id`  = VALUES(`image_asset_id`),

  `views`           = VALUES(`views`),
  `download_count`  = VALUES(`download_count`),
  `published_at`    = VALUES(`published_at`),

  `updated_at`      = VALUES(`updated_at`);

-- =============================================================
-- 2) I18N — TR (FULL CONTENT)
-- =============================================================
INSERT INTO `library_i18n`
(
  `id`,
  `library_id`,
  `locale`,

  `slug`,
  `name`,
  `description`,
  `image_alt`,

  `tags`,
  `meta_title`,
  `meta_description`,
  `meta_keywords`,

  `created_at`,
  `updated_at`
)
VALUES
(
  '88888888-8888-4888-8999-111111111111',
  '88888888-8888-8888-8888-888888888888',
  'tr',

  'yaz-kuru-yas-termometre-tasarim-degerleri',
  'Türkiye Yaz Kuru ve Yaş Termometre Tasarım Değerleri',
  CONCAT(
    '<p>Bu tabloda, Türkiye''deki illere göre yaz tasarım dönemi için ',
    'kuru termometre ve yaş termometre (kuru/yaş) sıcaklık değerleri ',
    'verilmiştir. Özellikle soğutma kulesi seçimi, kondenser devresi tasarımı ',
    've genel iklimlendirme (HVAC) mühendisliği hesaplarında referans alınabilir.</p>',
    '<p><strong>Not:</strong> Değerler, MGM (Meteoroloji Genel Müdürlüğü) ',
    'kaynaklı tipik yaz tasarım koşullarını temsil eder ve proje bazında gerekirse ',
    'yerel ölçümler veya güncel iklim verileri ile birlikte değerlendirilmelidir.</p>',
    '<table border="1" cellpadding="4" cellspacing="0">',
      '<thead>',
        '<tr>',
          '<th>Şehir</th>',
          '<th>Kuru Termometre (°C)</th>',
          '<th>Yaş Termometre (°C)</th>',
        '</tr>',
      '</thead>',
      '<tbody>',
        '<tr><td>Adana</td><td>38</td><td>27</td></tr>',
        '<tr><td>Adıyaman</td><td>38</td><td>23</td></tr>',
        '<tr><td>Afyon</td><td>34</td><td>21</td></tr>',
        '<tr><td>Ağrı</td><td>34</td><td>25</td></tr>',
        '<tr><td>Aksaray</td><td>34</td><td>20</td></tr>',
        '<tr><td>Amasya</td><td>31</td><td>21</td></tr>',
        '<tr><td>Ankara</td><td>35</td><td>20</td></tr>',
        '<tr><td>Antalya</td><td>39</td><td>28</td></tr>',
        '<tr><td>Artvin</td><td>30</td><td>26</td></tr>',
        '<tr><td>Aydın</td><td>39</td><td>24</td></tr>',
        '<tr><td>Balıkesir</td><td>38</td><td>25</td></tr>',
        '<tr><td>Bayburt</td><td>33</td><td>23</td></tr>',
        '<tr><td>Bilecik</td><td>34</td><td>23</td></tr>',
        '<tr><td>Bingöl</td><td>33</td><td>21</td></tr>',
        '<tr><td>Bitlis</td><td>34</td><td>22</td></tr>',
        '<tr><td>Bolu</td><td>34</td><td>23</td></tr>',
        '<tr><td>Burdur</td><td>36</td><td>21</td></tr>',
        '<tr><td>Bursa</td><td>37</td><td>25</td></tr>',
        '<tr><td>Çanakkale</td><td>34</td><td>25</td></tr>',
        '<tr><td>Çankırı</td><td>34</td><td>23</td></tr>',
        '<tr><td>Çorum</td><td>29</td><td>22</td></tr>',
        '<tr><td>Denizli</td><td>38</td><td>24</td></tr>',
        '<tr><td>Diyarbakır</td><td>42</td><td>23</td></tr>',
        '<tr><td>Düzce</td><td>34</td><td>24</td></tr>',
        '<tr><td>Edirne</td><td>36</td><td>25</td></tr>',
        '<tr><td>Elazığ</td><td>38</td><td>21</td></tr>',
        '<tr><td>Erzincan</td><td>36</td><td>22</td></tr>',
        '<tr><td>Erzurum</td><td>31</td><td>19</td></tr>',
        '<tr><td>Eskişehir</td><td>34</td><td>22</td></tr>',
        '<tr><td>Gaziantep</td><td>39</td><td>23</td></tr>',
        '<tr><td>Giresun</td><td>29</td><td>25</td></tr>',
        '<tr><td>Gümüşhane</td><td>33</td><td>23</td></tr>',
        '<tr><td>Hakkari</td><td>34</td><td>20</td></tr>',
        '<tr><td>Hatay</td><td>37</td><td>28</td></tr>',
        '<tr><td>İskenderun</td><td>37</td><td>29</td></tr>',
        '<tr><td>Isparta</td><td>34</td><td>21</td></tr>',
        '<tr><td>Iğdır</td><td>33</td><td>22</td></tr>',
        '<tr><td>İçel (Mersin)</td><td>35</td><td>29</td></tr>',
        '<tr><td>İstanbul</td><td>33</td><td>24</td></tr>',
        '<tr><td>İzmir</td><td>37</td><td>24</td></tr>',
        '<tr><td>Karabük</td><td>32</td><td>25</td></tr>',
        '<tr><td>Karaman</td><td>34</td><td>21</td></tr>',
        '<tr><td>Kars</td><td>30</td><td>20</td></tr>',
        '<tr><td>Kastamonu</td><td>34</td><td>22</td></tr>',
        '<tr><td>Kayseri</td><td>36</td><td>23</td></tr>',
        '<tr><td>Kırıkkale</td><td>35</td><td>21</td></tr>',
        '<tr><td>Kırklareli</td><td>35</td><td>24</td></tr>',
        '<tr><td>Kırşehir</td><td>35</td><td>21</td></tr>',
        '<tr><td>Kilis</td><td>39</td><td>23</td></tr>',
        '<tr><td>Kocaeli</td><td>36</td><td>25</td></tr>',
        '<tr><td>Konya</td><td>34</td><td>21</td></tr>',
        '<tr><td>Kütahya</td><td>33</td><td>21</td></tr>',
        '<tr><td>Malatya</td><td>38</td><td>21</td></tr>',
        '<tr><td>Manisa</td><td>40</td><td>25</td></tr>',
        '<tr><td>Kahramanmaraş</td><td>36</td><td>25</td></tr>',
        '<tr><td>Mardin</td><td>38</td><td>23</td></tr>',
        '<tr><td>Muğla</td><td>37</td><td>22</td></tr>',
        '<tr><td>Muş</td><td>32</td><td>20</td></tr>',
        '<tr><td>Nevşehir</td><td>28</td><td>21</td></tr>',
        '<tr><td>Niğde</td><td>34</td><td>20</td></tr>',
        '<tr><td>Ordu</td><td>30</td><td>23</td></tr>',
        '<tr><td>Osmaniye</td><td>38</td><td>26</td></tr>',
        '<tr><td>Rize</td><td>30</td><td>26</td></tr>',
        '<tr><td>Sakarya</td><td>35</td><td>25</td></tr>',
        '<tr><td>Samsun</td><td>32</td><td>25</td></tr>',
        '<tr><td>Siirt</td><td>40</td><td>23</td></tr>',
        '<tr><td>Sinop</td><td>30</td><td>25</td></tr>',
        '<tr><td>Sivas</td><td>33</td><td>20</td></tr>',
        '<tr><td>Şırnak</td><td>38</td><td>21</td></tr>',
        '<tr><td>Şanlıurfa</td><td>43</td><td>24</td></tr>',
        '<tr><td>Tekirdağ</td><td>33</td><td>25</td></tr>',
        '<tr><td>Tokat</td><td>29</td><td>20</td></tr>',
        '<tr><td>Trabzon</td><td>31</td><td>25</td></tr>',
        '<tr><td>Tunceli</td><td>37</td><td>22</td></tr>',
        '<tr><td>Uşak</td><td>35</td><td>22</td></tr>',
        '<tr><td>Van</td><td>33</td><td>20</td></tr>',
        '<tr><td>Yalova</td><td>33</td><td>24</td></tr>',
        '<tr><td>Yozgat</td><td>32</td><td>20</td></tr>',
        '<tr><td>Zonguldak</td><td>32</td><td>25</td></tr>',
      '</tbody>',
    '</table>',
    '<p><em>Kaynak: Meteoroloji Genel Müdürlüğü (MGM)</em></p>'
  ),
  'Türkiye yaz tasarım kuru/yaş termometre değerleri tablosu',
  'tasarım, yaz, kuru termometre, yaş termometre, türkiye, iklim verisi, hvac, soğutma kulesi',
  'Türkiye Yaz Kuru ve Yaş Termometre Tasarım Değerleri',
  'Türkiye illerine göre yaz tasarım kuru ve yaş termometre sıcaklık değerleri tablosu. Soğutma kulesi ve HVAC tasarımı için referans değerlendirme amaçlıdır.',
  'tasarım, yaz, kuru termometre, yaş termometre, türkiye, iklim verisi, hvac, soğutma kulesi, dry-bulb, wet-bulb, cooling tower',

  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `slug`             = VALUES(`slug`),
  `name`             = VALUES(`name`),
  `description`      = VALUES(`description`),
  `image_alt`        = VALUES(`image_alt`),
  `tags`             = VALUES(`tags`),
  `meta_title`       = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`),
  `meta_keywords`    = VALUES(`meta_keywords`),
  `updated_at`       = VALUES(`updated_at`);

-- =============================================================
-- 3) I18N — EN (FULL CONTENT)
-- =============================================================
INSERT INTO `library_i18n`
(
  `id`,
  `library_id`,
  `locale`,

  `slug`,
  `name`,
  `description`,
  `image_alt`,

  `tags`,
  `meta_title`,
  `meta_description`,
  `meta_keywords`,

  `created_at`,
  `updated_at`
)
VALUES
(
  '88888888-8888-4888-8999-222222222222',
  '88888888-8888-8888-8888-888888888888',
  'en',

  'turkey-summer-design-dry-wet-bulb-values',
  'Turkey Summer Design Dry-Bulb and Wet-Bulb Values',
  CONCAT(
    '<p>This table provides typical <strong>summer design</strong> dry-bulb and wet-bulb temperatures by province in Turkey. ',
    'It can be used as a practical reference for <strong>cooling tower selection</strong>, condenser loop design, and general HVAC engineering calculations.</p>',
    '<p><strong>Note:</strong> Values represent typical design conditions commonly referenced from national meteorological datasets. ',
    'For project-critical sizing, consider validating against the latest published climate normals and/or local measurements.</p>',
    '<table border="1" cellpadding="4" cellspacing="0">',
      '<thead>',
        '<tr>',
          '<th>City / Province</th>',
          '<th>Dry-Bulb (°C)</th>',
          '<th>Wet-Bulb (°C)</th>',
        '</tr>',
      '</thead>',
      '<tbody>',
        '<tr><td>Adana</td><td>38</td><td>27</td></tr>',
        '<tr><td>Adıyaman</td><td>38</td><td>23</td></tr>',
        '<tr><td>Afyon</td><td>34</td><td>21</td></tr>',
        '<tr><td>Ağrı</td><td>34</td><td>25</td></tr>',
        '<tr><td>Aksaray</td><td>34</td><td>20</td></tr>',
        '<tr><td>Amasya</td><td>31</td><td>21</td></tr>',
        '<tr><td>Ankara</td><td>35</td><td>20</td></tr>',
        '<tr><td>Antalya</td><td>39</td><td>28</td></tr>',
        '<tr><td>Artvin</td><td>30</td><td>26</td></tr>',
        '<tr><td>Aydın</td><td>39</td><td>24</td></tr>',
        '<tr><td>Balıkesir</td><td>38</td><td>25</td></tr>',
        '<tr><td>Bayburt</td><td>33</td><td>23</td></tr>',
        '<tr><td>Bilecik</td><td>34</td><td>23</td></tr>',
        '<tr><td>Bingöl</td><td>33</td><td>21</td></tr>',
        '<tr><td>Bitlis</td><td>34</td><td>22</td></tr>',
        '<tr><td>Bolu</td><td>34</td><td>23</td></tr>',
        '<tr><td>Burdur</td><td>36</td><td>21</td></tr>',
        '<tr><td>Bursa</td><td>37</td><td>25</td></tr>',
        '<tr><td>Çanakkale</td><td>34</td><td>25</td></tr>',
        '<tr><td>Çankırı</td><td>34</td><td>23</td></tr>',
        '<tr><td>Çorum</td><td>29</td><td>22</td></tr>',
        '<tr><td>Denizli</td><td>38</td><td>24</td></tr>',
        '<tr><td>Diyarbakır</td><td>42</td><td>23</td></tr>',
        '<tr><td>Düzce</td><td>34</td><td>24</td></tr>',
        '<tr><td>Edirne</td><td>36</td><td>25</td></tr>',
        '<tr><td>Elazığ</td><td>38</td><td>21</td></tr>',
        '<tr><td>Erzincan</td><td>36</td><td>22</td></tr>',
        '<tr><td>Erzurum</td><td>31</td><td>19</td></tr>',
        '<tr><td>Eskişehir</td><td>34</td><td>22</td></tr>',
        '<tr><td>Gaziantep</td><td>39</td><td>23</td></tr>',
        '<tr><td>Giresun</td><td>29</td><td>25</td></tr>',
        '<tr><td>Gümüşhane</td><td>33</td><td>23</td></tr>',
        '<tr><td>Hakkari</td><td>34</td><td>20</td></tr>',
        '<tr><td>Hatay</td><td>37</td><td>28</td></tr>',
        '<tr><td>İskenderun</td><td>37</td><td>29</td></tr>',
        '<tr><td>Isparta</td><td>34</td><td>21</td></tr>',
        '<tr><td>Iğdır</td><td>33</td><td>22</td></tr>',
        '<tr><td>İçel (Mersin)</td><td>35</td><td>29</td></tr>',
        '<tr><td>İstanbul</td><td>33</td><td>24</td></tr>',
        '<tr><td>İzmir</td><td>37</td><td>24</td></tr>',
        '<tr><td>Karabük</td><td>32</td><td>25</td></tr>',
        '<tr><td>Karaman</td><td>34</td><td>21</td></tr>',
        '<tr><td>Kars</td><td>30</td><td>20</td></tr>',
        '<tr><td>Kastamonu</td><td>34</td><td>22</td></tr>',
        '<tr><td>Kayseri</td><td>36</td><td>23</td></tr>',
        '<tr><td>Kırıkkale</td><td>35</td><td>21</td></tr>',
        '<tr><td>Kırklareli</td><td>35</td><td>24</td></tr>',
        '<tr><td>Kırşehir</td><td>35</td><td>21</td></tr>',
        '<tr><td>Kilis</td><td>39</td><td>23</td></tr>',
        '<tr><td>Kocaeli</td><td>36</td><td>25</td></tr>',
        '<tr><td>Konya</td><td>34</td><td>21</td></tr>',
        '<tr><td>Kütahya</td><td>33</td><td>21</td></tr>',
        '<tr><td>Malatya</td><td>38</td><td>21</td></tr>',
        '<tr><td>Manisa</td><td>40</td><td>25</td></tr>',
        '<tr><td>Kahramanmaraş</td><td>36</td><td>25</td></tr>',
        '<tr><td>Mardin</td><td>38</td><td>23</td></tr>',
        '<tr><td>Muğla</td><td>37</td><td>22</td></tr>',
        '<tr><td>Muş</td><td>32</td><td>20</td></tr>',
        '<tr><td>Nevşehir</td><td>28</td><td>21</td></tr>',
        '<tr><td>Niğde</td><td>34</td><td>20</td></tr>',
        '<tr><td>Ordu</td><td>30</td><td>23</td></tr>',
        '<tr><td>Osmaniye</td><td>38</td><td>26</td></tr>',
        '<tr><td>Rize</td><td>30</td><td>26</td></tr>',
        '<tr><td>Sakarya</td><td>35</td><td>25</td></tr>',
        '<tr><td>Samsun</td><td>32</td><td>25</td></tr>',
        '<tr><td>Siirt</td><td>40</td><td>23</td></tr>',
        '<tr><td>Sinop</td><td>30</td><td>25</td></tr>',
        '<tr><td>Sivas</td><td>33</td><td>20</td></tr>',
        '<tr><td>Şırnak</td><td>38</td><td>21</td></tr>',
        '<tr><td>Şanlıurfa</td><td>43</td><td>24</td></tr>',
        '<tr><td>Tekirdağ</td><td>33</td><td>25</td></tr>',
        '<tr><td>Tokat</td><td>29</td><td>20</td></tr>',
        '<tr><td>Trabzon</td><td>31</td><td>25</td></tr>',
        '<tr><td>Tunceli</td><td>37</td><td>22</td></tr>',
        '<tr><td>Uşak</td><td>35</td><td>22</td></tr>',
        '<tr><td>Van</td><td>33</td><td>20</td></tr>',
        '<tr><td>Yalova</td><td>33</td><td>24</td></tr>',
        '<tr><td>Yozgat</td><td>32</td><td>20</td></tr>',
        '<tr><td>Zonguldak</td><td>32</td><td>25</td></tr>',
      '</tbody>',
    '</table>',
    '<p><em>Source: Turkish State Meteorological Service (MGM)</em></p>'
  ),
  'Turkey summer design dry-bulb and wet-bulb values',
  'design, summer, dry-bulb, wet-bulb, turkey, climate data, hvac, cooling tower',
  'Turkey Summer Design Dry-Bulb and Wet-Bulb Values',
  'Reference table listing typical summer design dry-bulb and wet-bulb temperatures for provinces in Turkey. Intended for cooling tower selection and HVAC engineering calculations.',
  'design, summer, dry-bulb, wet-bulb, turkey, climate data, hvac, cooling tower selection, wet-bulb temperature, dry-bulb temperature',

  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `slug`             = VALUES(`slug`),
  `name`             = VALUES(`name`),
  `description`      = VALUES(`description`),
  `image_alt`        = VALUES(`image_alt`),
  `tags`             = VALUES(`tags`),
  `meta_title`       = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`),
  `meta_keywords`    = VALUES(`meta_keywords`),
  `updated_at`       = VALUES(`updated_at`);

-- =============================================================
-- 4) I18N — DE (FULL CONTENT)
-- =============================================================
INSERT INTO `library_i18n`
(
  `id`,
  `library_id`,
  `locale`,

  `slug`,
  `name`,
  `description`,
  `image_alt`,

  `tags`,
  `meta_title`,
  `meta_description`,
  `meta_keywords`,

  `created_at`,
  `updated_at`
)
VALUES
(
  '88888888-8888-4888-8999-333333333333',
  '88888888-8888-8888-8888-888888888888',
  'de',

  'tuerkei-sommer-auslegung-trockenkugel-feuchtkugel-werte',
  'Türkei: Sommer-Auslegungswerte für Trocken- und Feuchtkugel',
  CONCAT(
    '<p>Diese Tabelle enthält typische <strong>Sommer-Auslegungswerte</strong> für Trocken- und Feuchtkugeltemperaturen nach Provinz in der Türkei. ',
    'Sie kann als Praxisreferenz für die <strong>Kühlturm-Auswahl</strong>, die Auslegung von Kondensatorkreisläufen sowie allgemeine HVAC-Berechnungen verwendet werden.</p>',
    '<p><strong>Hinweis:</strong> Die Werte repräsentieren typische Auslegungsbedingungen aus nationalen meteorologischen Datensätzen. ',
    'Für projektsensitive Auslegungen sollten aktuelle Klimanormalen und/oder lokale Messwerte zusätzlich berücksichtigt werden.</p>',
    '<table border="1" cellpadding="4" cellspacing="0">',
      '<thead>',
        '<tr>',
          '<th>Stadt / Provinz</th>',
          '<th>Trockenkugel (°C)</th>',
          '<th>Feuchtkugel (°C)</th>',
        '</tr>',
      '</thead>',
      '<tbody>',
        '<tr><td>Adana</td><td>38</td><td>27</td></tr>',
        '<tr><td>Adıyaman</td><td>38</td><td>23</td></tr>',
        '<tr><td>Afyon</td><td>34</td><td>21</td></tr>',
        '<tr><td>Ağrı</td><td>34</td><td>25</td></tr>',
        '<tr><td>Aksaray</td><td>34</td><td>20</td></tr>',
        '<tr><td>Amasya</td><td>31</td><td>21</td></tr>',
        '<tr><td>Ankara</td><td>35</td><td>20</td></tr>',
        '<tr><td>Antalya</td><td>39</td><td>28</td></tr>',
        '<tr><td>Artvin</td><td>30</td><td>26</td></tr>',
        '<tr><td>Aydın</td><td>39</td><td>24</td></tr>',
        '<tr><td>Balıkesir</td><td>38</td><td>25</td></tr>',
        '<tr><td>Bayburt</td><td>33</td><td>23</td></tr>',
        '<tr><td>Bilecik</td><td>34</td><td>23</td></tr>',
        '<tr><td>Bingöl</td><td>33</td><td>21</td></tr>',
        '<tr><td>Bitlis</td><td>34</td><td>22</td></tr>',
        '<tr><td>Bolu</td><td>34</td><td>23</td></tr>',
        '<tr><td>Burdur</td><td>36</td><td>21</td></tr>',
        '<tr><td>Bursa</td><td>37</td><td>25</td></tr>',
        '<tr><td>Çanakkale</td><td>34</td><td>25</td></tr>',
        '<tr><td>Çankırı</td><td>34</td><td>23</td></tr>',
        '<tr><td>Çorum</td><td>29</td><td>22</td></tr>',
        '<tr><td>Denizli</td><td>38</td><td>24</td></tr>',
        '<tr><td>Diyarbakır</td><td>42</td><td>23</td></tr>',
        '<tr><td>Düzce</td><td>34</td><td>24</td></tr>',
        '<tr><td>Edirne</td><td>36</td><td>25</td></tr>',
        '<tr><td>Elazığ</td><td>38</td><td>21</td></tr>',
        '<tr><td>Erzincan</td><td>36</td><td>22</td></tr>',
        '<tr><td>Erzurum</td><td>31</td><td>19</td></tr>',
        '<tr><td>Eskişehir</td><td>34</td><td>22</td></tr>',
        '<tr><td>Gaziantep</td><td>39</td><td>23</td></tr>',
        '<tr><td>Giresun</td><td>29</td><td>25</td></tr>',
        '<tr><td>Gümüşhane</td><td>33</td><td>23</td></tr>',
        '<tr><td>Hakkari</td><td>34</td><td>20</td></tr>',
        '<tr><td>Hatay</td><td>37</td><td>28</td></tr>',
        '<tr><td>İskenderun</td><td>37</td><td>29</td></tr>',
        '<tr><td>Isparta</td><td>34</td><td>21</td></tr>',
        '<tr><td>Iğdır</td><td>33</td><td>22</td></tr>',
        '<tr><td>İçel (Mersin)</td><td>35</td><td>29</td></tr>',
        '<tr><td>İstanbul</td><td>33</td><td>24</td></tr>',
        '<tr><td>İzmir</td><td>37</td><td>24</td></tr>',
        '<tr><td>Karabük</td><td>32</td><td>25</td></tr>',
        '<tr><td>Karaman</td><td>34</td><td>21</td></tr>',
        '<tr><td>Kars</td><td>30</td><td>20</td></tr>',
        '<tr><td>Kastamonu</td><td>34</td><td>22</td></tr>',
        '<tr><td>Kayseri</td><td>36</td><td>23</td></tr>',
        '<tr><td>Kırıkkale</td><td>35</td><td>21</td></tr>',
        '<tr><td>Kırklareli</td><td>35</td><td>24</td></tr>',
        '<tr><td>Kırşehir</td><td>35</td><td>21</td></tr>',
        '<tr><td>Kilis</td><td>39</td><td>23</td></tr>',
        '<tr><td>Kocaeli</td><td>36</td><td>25</td></tr>',
        '<tr><td>Konya</td><td>34</td><td>21</td></tr>',
        '<tr><td>Kütahya</td><td>33</td><td>21</td></tr>',
        '<tr><td>Malatya</td><td>38</td><td>21</td></tr>',
        '<tr><td>Manisa</td><td>40</td><td>25</td></tr>',
        '<tr><td>Kahramanmaraş</td><td>36</td><td>25</td></tr>',
        '<tr><td>Mardin</td><td>38</td><td>23</td></tr>',
        '<tr><td>Muğla</td><td>37</td><td>22</td></tr>',
        '<tr><td>Muş</td><td>32</td><td>20</td></tr>',
        '<tr><td>Nevşehir</td><td>28</td><td>21</td></tr>',
        '<tr><td>Niğde</td><td>34</td><td>20</td></tr>',
        '<tr><td>Ordu</td><td>30</td><td>23</td></tr>',
        '<tr><td>Osmaniye</td><td>38</td><td>26</td></tr>',
        '<tr><td>Rize</td><td>30</td><td>26</td></tr>',
        '<tr><td>Sakarya</td><td>35</td><td>25</td></tr>',
        '<tr><td>Samsun</td><td>32</td><td>25</td></tr>',
        '<tr><td>Siirt</td><td>40</td><td>23</td></tr>',
        '<tr><td>Sinop</td><td>30</td><td>25</td></tr>',
        '<tr><td>Sivas</td><td>33</td><td>20</td></tr>',
        '<tr><td>Şırnak</td><td>38</td><td>21</td></tr>',
        '<tr><td>Şanlıurfa</td><td>43</td><td>24</td></tr>',
        '<tr><td>Tekirdağ</td><td>33</td><td>25</td></tr>',
        '<tr><td>Tokat</td><td>29</td><td>20</td></tr>',
        '<tr><td>Trabzon</td><td>31</td><td>25</td></tr>',
        '<tr><td>Tunceli</td><td>37</td><td>22</td></tr>',
        '<tr><td>Uşak</td><td>35</td><td>22</td></tr>',
        '<tr><td>Van</td><td>33</td><td>20</td></tr>',
        '<tr><td>Yalova</td><td>33</td><td>24</td></tr>',
        '<tr><td>Yozgat</td><td>32</td><td>20</td></tr>',
        '<tr><td>Zonguldak</td><td>32</td><td>25</td></tr>',
      '</tbody>',
    '</table>',
    '<p><em>Quelle: Türkischer Wetterdienst / Meteoroloji Genel Müdürlüğü (MGM)</em></p>'
  ),
  'Türkei: Sommer-Auslegungswerte Trocken-/Feuchtkugel',
  'auslegung, sommer, trockenkugel, feuchtkugel, tuerkei, klimadaten, hvac, kuehlturm',
  'Türkei: Sommer-Auslegungswerte für Trocken- und Feuchtkugel',
  'Referenztabelle mit typischen Sommer-Auslegungswerten (Trockenkugel/Feuchtkugel) für Provinzen in der Türkei. Grundlage für Kühlturm-Auswahl und HVAC-Berechnungen.',
  'auslegung, sommer, trockenkugel, feuchtkugel, tuerkei, klimadaten, hvac, kuehlturm auswahl, feuchtkugeltemperatur',

  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `slug`             = VALUES(`slug`),
  `name`             = VALUES(`name`),
  `description`      = VALUES(`description`),
  `image_alt`        = VALUES(`image_alt`),
  `tags`             = VALUES(`tags`),
  `meta_title`       = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`),
  `meta_keywords`    = VALUES(`meta_keywords`),
  `updated_at`       = VALUES(`updated_at`);

-- =============================================================
-- 5) OPTIONAL IMAGE: 1 ADET (display_order=10)
-- =============================================================
INSERT INTO `library_images`
(
  `id`,
  `library_id`,
  `image_asset_id`,
  `image_url`,
  `display_order`,
  `is_active`,
  `created_at`,
  `updated_at`
)
VALUES
(
  '88888888-9999-4000-8000-aaaaaaaaaaaa',
  '88888888-8888-8888-8888-888888888888',
  NULL,
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752786288/uploads/metahub/about-images/closed-circuit-water-cooling-towers1-1752786287184-840184158.webp',
  10,
  1,
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `image_asset_id` = VALUES(`image_asset_id`),
  `image_url`      = VALUES(`image_url`),
  `display_order`  = VALUES(`display_order`),
  `is_active`      = VALUES(`is_active`),
  `updated_at`     = VALUES(`updated_at`);

-- =============================================================
-- 6) IMAGE I18N: TR/EN/DE
-- =============================================================
INSERT INTO `library_images_i18n`
(
  `id`,
  `image_id`,
  `locale`,
  `title`,
  `alt`,
  `caption`,
  `created_at`,
  `updated_at`
)
VALUES
(
  '88888888-9999-4111-8111-111111111111',
  '88888888-9999-4000-8000-aaaaaaaaaaaa',
  'tr',
  'Türkiye yaz tasarım kuru/yaş termometre değerleri',
  'Türkiye illerine göre yaz kuru ve yaş termometre tasarım değerleri tablosu',
  'Soğutma kulesi ve HVAC tasarımı için referans kuru/yaş termometre (dry/wet bulb) değerleri',
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `title`      = VALUES(`title`),
  `alt`        = VALUES(`alt`),
  `caption`    = VALUES(`caption`),
  `updated_at` = VALUES(`updated_at`);

INSERT INTO `library_images_i18n`
(
  `id`,
  `image_id`,
  `locale`,
  `title`,
  `alt`,
  `caption`,
  `created_at`,
  `updated_at`
)
VALUES
(
  '88888888-9999-4111-8111-222222222222',
  '88888888-9999-4000-8000-aaaaaaaaaaaa',
  'en',
  'Turkey summer design dry-bulb and wet-bulb values',
  'Table of Turkey summer design dry-bulb and wet-bulb temperatures by province',
  'Reference dry/wet bulb design values for cooling tower selection and HVAC engineering',
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `title`      = VALUES(`title`),
  `alt`        = VALUES(`alt`),
  `caption`    = VALUES(`caption`),
  `updated_at` = VALUES(`updated_at`);

INSERT INTO `library_images_i18n`
(
  `id`,
  `image_id`,
  `locale`,
  `title`,
  `alt`,
  `caption`,
  `created_at`,
  `updated_at`
)
VALUES
(
  '88888888-9999-4111-8111-333333333333',
  '88888888-9999-4000-8000-aaaaaaaaaaaa',
  'de',
  'Türkei: Sommer-Auslegungswerte Trocken- und Feuchtkugel',
  'Tabelle der Sommer-Auslegungswerte (Trocken-/Feuchtkugel) nach Provinz in der Türkei',
  'Referenzwerte für Kühlturm-Auswahl und HVAC-Auslegung: Trocken-/Feuchtkugeltemperaturen',
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `title`      = VALUES(`title`),
  `alt`        = VALUES(`alt`),
  `caption`    = VALUES(`caption`),
  `updated_at` = VALUES(`updated_at`);

COMMIT;
