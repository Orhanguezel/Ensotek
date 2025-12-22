-- =============================================================
-- 101_6_library_i18n_de.sql (only seeds - DE)
-- =============================================================

/* ================= SEED: DE ================= */

-- Unternehmensbroschüre (DE)
INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
VALUES
(
  UUID(), @LIB_BROCHURE_ID, 'de',
  'Unternehmensbroschüre', 'unternehmensbroschuere',
  'PDF-Broschüre mit einem Überblick über Ensoteks industrielle Kühlturmlösungen, Services und Referenzprojekte.',
  '<p>Diese Unternehmensbroschüre gibt einen kompakten Überblick über Ensoteks industrielle Kühlturmlösungen, Wartungs- und Modernisierungsleistungen sowie ausgewählte Referenzprojekte.</p>',
  'Ensotek Unternehmensbroschüre',
  'Unternehmens-PDF über Ensoteks Lösungen, Services und Referenzen.',
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


-- Service-Leitfaden (DE)
INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
VALUES
(
  UUID(), @LIB_GUIDE_ID, 'de',
  'Service-Leitfaden', 'service-leitfaden',
  'PDF-Leitfaden zu Ensoteks Leistungen wie Produktion, Wartung & Reparatur, Modernisierung, Ersatzteile und Engineering-Support.',
  '<p>Dieser Service-Leitfaden beschreibt Ensoteks Leistungen – von Produktion über Wartung und Reparatur bis hin zu Modernisierung, Ersatzteilen, Anwendungen und Engineering-Unterstützung.</p>',
  'Ensotek Service-Leitfaden',
  'PDF-Leitfaden zu Ensoteks Kühlturm-Services und Engineering-Leistungen.',
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


-- Türkei: Sommer-Trocken-/Feuchtkugel Auslegungswerte (DE)
INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
VALUES
(
  UUID(), @LIB_SUMMER_TW_ID, 'de',
  'Türkei: Sommer-Auslegungswerte für Trocken- und Feuchtkugeltemperatur',
  'tuerkei-sommer-trocken-feuchtkugel-auslegungswerte',
  'Referenztabelle mit Sommer-Auslegungswerten für Trocken- und Feuchtkugeltemperaturen nach Städten in der Türkei – für Kühlturm- und HVAC-Auslegungsrechnungen.',
  CONCAT(
    '<p>Die folgende Tabelle enthält typische Sommer-Auslegungswerte für ',
    'Trocken- und Feuchtkugeltemperaturen nach Städten in der Türkei. ',
    'Diese Werte können als Referenz für die Kühlturmauslegung, die Auslegung von Kondensatorkreisläufen ',
    'und allgemeine HVAC-Berechnungen verwendet werden.</p>',
    '<p><strong>Hinweis:</strong> Die Daten repräsentieren typische Sommer-Auslegungsbedingungen ',
    'auf Basis des türkischen staatlichen Wetterdienstes (MGM). Für kritische Projekte wird empfohlen, ',
    'zusätzlich lokale und aktuelle Klimadaten heranzuziehen.</p>',
    '<table border="1" cellpadding="4" cellspacing="0">',
    '<thead>',
    '<tr>',
    '<th>Stadt</th>',
    '<th>Trocken (°C)</th>',
    '<th>Feucht (°C)</th>',
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
    '<p><em>Quelle: Türkischer Staatlicher Wetterdienst (MGM)</em></p>'
  ),
  'Türkei Sommer-Auslegungswerte Trocken-/Feuchtkugel',
  'Sommer-Auslegungswerte für Trocken- und Feuchtkugeltemperaturen nach Städten in der Türkei (Referenz für Kühlturm- und HVAC-Auslegung).',
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


/* Eksik DE çevirileri için TR’den kopya (slug TR’den gelir) */
INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
SELECT
  UUID(), s.library_id, 'de',
  s.title, s.slug, s.summary, s.content,
  s.meta_title, s.meta_description,
  NOW(3), NOW(3)
FROM library_i18n s
WHERE s.locale = 'tr'
  AND NOT EXISTS (
    SELECT 1 FROM library_i18n t
    WHERE t.library_id = s.library_id
      AND t.locale = 'de'
  );
