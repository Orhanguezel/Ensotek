-- =============================================================
-- FILE: src/db/seed/sql/105_library_seed_summer_tw_tr.sql
-- Ensotek - Library seed (TR) - Summer Dry/Wet Bulb Design Values (Turkey)
--  - Idempotent: TR slug üzerinden base id bul / yoksa deterministik ID kullan
--  - Base row: library (single source)
--  - i18n row: library_i18n (TR)
--  - Requires:
--      @LIB_CATEGORY_ID, @LIB_SUBCATEGORY_PDF (veya tablo/alt-kategori neyse)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

-- -------------------------------------------------------------
-- Deterministic base id (sabit kalsın; EN/DE eklenirse aynı id kullanılacak)
-- -------------------------------------------------------------
SET @LIB_SUMMER_TW := '88888888-8888-8888-8888-888888888888';

-- -------------------------------------------------------------
-- Resolve existing library_id by TR slug (if exists), else deterministic
-- -------------------------------------------------------------
SET @LIB_SUMMER_TW_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'tr'
  WHERE i.slug = 'yaz-kuru-yas-termometre-tasarim-degerleri'
  LIMIT 1
);
SET @LIB_SUMMER_TW_ID := COALESCE(@LIB_SUMMER_TW_ID, @LIB_SUMMER_TW);

-- -------------------------------------------------------------
-- Ensure parent exists (base row upsert)
-- NOTE: display_order / category mapping is yours; adjust if needed.
-- -------------------------------------------------------------
INSERT INTO library
(id, is_published, is_active, display_order,
 tags_json, category_id, sub_category_id,
 author, views, download_count,
 published_at, created_at, updated_at)
VALUES
(
  @LIB_SUMMER_TW_ID,
  1, 1, 110,
  JSON_ARRAY('design','summer','dry-bulb','wet-bulb','turkey','hvac','cooling-tower'),
  @LIB_CATEGORY_ID, @LIB_SUBCATEGORY_PDF,
  'Ensotek', 0, 0,
  NOW(3), NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
  is_published    = VALUES(is_published),
  is_active       = VALUES(is_active),
  display_order   = VALUES(display_order),
  tags_json       = VALUES(tags_json),
  category_id     = VALUES(category_id),
  sub_category_id = VALUES(sub_category_id),
  author          = VALUES(author),
  published_at    = VALUES(published_at),
  updated_at      = VALUES(updated_at);

-- -------------------------------------------------------------
-- Upsert TR i18n (unique key assumed: (library_id, locale) OR (locale, slug))
-- -------------------------------------------------------------
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

COMMIT;
