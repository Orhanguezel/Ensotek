-- =============================================================
-- 101_library_i18n.sql (only seeds)
-- =============================================================

/* ================= SEED: TR ================= */

-- Kurumsal Tanıtım Broşürü (TR)
INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
VALUES
(UUID(), @LIB_BROCHURE_ID, 'tr',
 'Kurumsal Tanıtım Broşürü', 'kurumsal-brosur',
 'Ensotek\'in endüstriyel soğutma kuleleri, hizmetleri ve referans projelerini özetleyen PDF broşür.',
 '<p>Bu kurumsal broşür, Ensotek\'in endüstriyel su soğutma kuleleri, bakım ve modernizasyon hizmetleri ile farklı sektörlerde gerçekleştirdiği projeleri özetler.</p>',
 'Ensotek Kurumsal Tanıtım Broşürü',
 'Ensotek çözümlerini ve referans projelerini içeren kurumsal PDF broşür.',
 NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
 title            = VALUES(title),
 slug             = VALUES(slug),
 summary          = VALUES(summary),
 content          = VALUES(content),
 meta_title       = VALUES(meta_title),
 meta_description = VALUES(meta_description),
 updated_at       = VALUES(updated_at);

-- Hizmet Rehberi (TR)
INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
VALUES
(UUID(), @LIB_GUIDE_ID, 'tr',
 'Hizmet Rehberi', 'hizmet-rehberi',
 'Ensotek\'in üretim, bakım-onarım, modernizasyon, yedek parça ve mühendislik hizmetlerini özetleyen PDF rehberi.',
 '<p>Bu hizmet rehberi; üretim, bakım ve onarım, modernizasyon, yedek parçalar, uygulamalar ve mühendislik desteği dahil olmak üzere Ensotek\'in sunduğu hizmetleri ayrıntılı olarak açıklar.</p>',
 'Ensotek Hizmet Rehberi',
 'Ensotek\'in soğutma kuleleri ve ilgili mühendislik hizmetlerini anlatan PDF rehber.',
 NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
 title            = VALUES(title),
 slug             = VALUES(slug),
 summary          = VALUES(summary),
 content          = VALUES(content),
 meta_title       = VALUES(meta_title),
 meta_description = VALUES(meta_description),
 updated_at       = VALUES(updated_at);

-- Yaz Kuru ve Yaş Termometre Tasarım Değerleri (TR)
INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
VALUES
(
  UUID(), @LIB_SUMMER_TW_ID, 'tr',
  'Türkiye Yaz Kuru ve Yaş Termometre Tasarım Değerleri',
  'yaz-kuru-yas-termometre-tasarim-degerleri',
  'Türkiye\'deki iller için yaz tasarım dönemine ait kuru ve yaş termometre (kuru/yaş) sıcaklık değerlerinin listelendiği referans tablo. Soğutma kulesi ve iklimlendirme tasarımlarında kullanılmak üzere hazırlanmıştır.',
  CONCAT(
    '<p>Bu tabloda, Türkiye\'deki illere göre yaz tasarım dönemi için ',
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
  'Türkiye yaz kuru ve yaş termometre tasarım değerleri',
  'Türkiye illerine göre yaz tasarım kuru ve yaş termometre sıcaklık değerleri tablosu. Soğutma kulesi ve HVAC tasarımı için referans değerlendirme amaçlıdır.',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
 title            = VALUES(title),
 slug             = VALUES(slug),
 summary          = VALUES(summary),
 content          = VALUES(content),
 meta_title       = VALUES(meta_title),
 meta_description = VALUES(meta_description),
 updated_at       = VALUES(updated_at);


/* ================= SEED: EN ================= */

-- Company Brochure (EN)
INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
VALUES
(UUID(), @LIB_BROCHURE_ID, 'en',
 'Company Brochure', 'company-brochure',
 'PDF brochure that summarizes Ensotek\'s cooling tower solutions, services and reference projects.',
 '<p>This company brochure presents Ensotek\'s industrial cooling tower solutions, maintenance and modernization services, as well as selected reference projects in English.</p>',
 'Ensotek Company Brochure',
 'Corporate PDF brochure about Ensotek\'s solutions and services.',
 NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
 title            = VALUES(title),
 slug             = VALUES(slug),
 summary          = VALUES(summary),
 content          = VALUES(content),
 meta_title       = VALUES(meta_title),
 meta_description = VALUES(meta_description),
 updated_at       = VALUES(updated_at);

-- Service Guide (EN)
INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
VALUES
(UUID(), @LIB_GUIDE_ID, 'en',
 'Service Guide', 'service-guide',
 'PDF guide that describes Ensotek\'s main services such as production, maintenance, modernization, spare parts and engineering support.',
 '<p>A compact guide that explains Ensotek\'s production, maintenance & repair, modernization, spare parts and engineering support services for industrial cooling towers.</p>',
 'Ensotek Service Guide',
 'PDF guide that presents Ensotek\'s cooling tower services.',
 NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
 title            = VALUES(title),
 slug             = VALUES(slug),
 summary          = VALUES(summary),
 content          = VALUES(content),
 meta_title       = VALUES(meta_title),
 meta_description = VALUES(meta_description),
 updated_at       = VALUES(updated_at);

-- Summer Dry- and Wet-Bulb Design Temperatures (EN)
INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
VALUES
(
  UUID(), @LIB_SUMMER_TW_ID, 'en',
  'Turkey Summer Dry- and Wet-Bulb Design Temperatures',
  'summer-dry-wet-bulb-design-temperatures',
  'Reference table listing summer dry- and wet-bulb design temperatures (dry/wet) for major cities in Turkey, for cooling-tower and HVAC design calculations.',
  CONCAT(
    '<p>The table below lists summer dry- and wet-bulb design temperatures ',
    'for major cities in Turkey. These values can be used as a reference ',
    'for cooling-tower selection, condenser circuit design and general HVAC ',
    'engineering calculations.</p>',
    '<p><strong>Note:</strong> The data represents typical summer design ',
    'conditions based on the Turkish State Meteorological Service (MGM). ',
    'For critical projects, it is recommended to verify with local and up-to-date ',
    'climate data.</p>',
    '<table border="1" cellpadding="4" cellspacing="0">',
    '<thead>',
    '<tr>',
    '<th>City</th>',
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
  'Turkey summer dry- and wet-bulb design temperatures',
  'Reference table of summer dry- and wet-bulb design temperatures by city in Turkey, for cooling tower and HVAC design.',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
 title            = VALUES(title),
 slug             = VALUES(slug),
 summary          = VALUES(summary),
 content          = VALUES(content),
 meta_title       = VALUES(meta_title),
 meta_description = VALUES(meta_description),
 updated_at       = VALUES(updated_at);


/* Eksik EN çevirileri için TR’den kopya (slug TR’den gelir) */
INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
SELECT
  UUID(), s.library_id, 'en',
  s.title, s.slug, s.summary, s.content,
  s.meta_title, s.meta_description,
  NOW(3), NOW(3)
FROM library_i18n s
WHERE s.locale = 'tr'
  AND NOT EXISTS (
    SELECT 1 FROM library_i18n t
    WHERE t.library_id = s.library_id
      AND t.locale = 'en'
  );
