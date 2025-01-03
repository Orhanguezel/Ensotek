const references = [
        { 
            url: 'assets/img/ref/ensotek-referanslari-dalan-kimya-250x250-1(1).jpg', 
            company_name: 'Dalan Kimya',
            sector: 'Alüminyum'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-linde-250x250-1(1).jpg', 
            company_name: 'Linde',
            sector: 'Alüminyum'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-novartis-250x250-1(1).jpg', 
            company_name: 'Novartis',
            sector: 'Alüminyum'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-erc-250x250-1.jpg', 
            company_name: 'ERC',
            sector: 'Alüminyum'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-plastay-kimya-250x250-1.jpg', 
            company_name: 'Plastay Kimya',
            sector: 'Alüminyum'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-dystar-250x250-1.jpg', 
            company_name: 'Dystar',
            sector: 'Alüminyum'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-kale-kimya-kimyevi-mad-san-ve-tic-as-250x250-1.jpg', 
            company_name: 'Kale Kimya',
            sector: 'Alüminyum'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-setas-250x250-1.jpg', 
            company_name: 'Setas',
            sector: 'Alüminyum'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-ravaber-250x250-1.jpg', 
            company_name: 'Ravaber',
            sector: 'Alüminyum'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-kimflor-kimya-san-ve-tic-as-250x250-1.jpg', 
            company_name: 'Kimflor Kimya',
            sector: 'Alüminyum'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-meltem-kimya-250x250-1.jpg', 
            company_name: 'Meltem Kimya',
            sector: 'Alüminyum'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-nedex-250x250-1.jpg', 
            company_name: 'Nedex',
            sector: 'Alüminyum'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-polikor-250x250-1.jpg', 
            company_name: 'Polikor',
            sector: 'Alüminyum'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-pf-250x250-1.jpg', 
            company_name: 'PF',
            sector: 'Alüminyum'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-nuh-kompozit-250x250-1.jpg', 
            company_name: 'Nuh Kompozit',
            sector: 'Alüminyum'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-sodas-sodyum-sanayii-as-250x250-1.jpg', 
            company_name: 'Sodaş Sodyum',
            sector: 'Alüminyum'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-bmcolor-250x250-1.jpg', 
            company_name: 'BMColor',
            sector: 'Alüminyum'
        },
        { 
            url: 'assets/img/ref/matek-makina-min-250x250-1.jpg', 
            company_name: 'Matek Makina',
            sector: 'Alüminyum'
        },
        { 
            url: 'assets/img/ref/unormak-min-250x250-1.png', 
            company_name: 'Unormak',
            sector: 'Alüminyum'
        },
        { 
            url: 'assets/img/ref/ineva-250x250-1.png', 
            company_name: 'Ineva',
            sector: 'Alüminyum'
        },
        { 
            url: 'assets/img/ref/motorsan-250x250-1.png', 
            company_name: 'Motorsan',
            sector: 'Alüminyum'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-mmc-250x250-1.jpg', 
            company_name: 'MMC',
            sector: 'Alüminyum'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-kale-kayislari-250x250-1(2).jpg', 
            company_name: 'Kale Kayışları',
            sector: 'Alüminyum'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-ara-makina-250x250-1(1).jpg', 
            company_name: 'Ara Makina',
            sector: 'Alüminyum'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-teksan-250x250-1.jpg', 
            company_name: 'Teksan',
            sector: 'Alüminyum'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-korel-elektronik-250x250-1.jpg', 
            company_name: 'Korel Elektronik',
            sector: 'Alüminyum'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-kale-aero-250x250-1.jpg', 
            company_name: 'Kale Aero',
            sector: 'Alüminyum'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-tarimar-250x250-1.jpg', 
            company_name: 'Tarimar',
            sector: 'Alüminyum'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-simge-endustriyel-muh-san-ve-tic-ltd-sti-250x250-1.jpg', 
            company_name: 'Simge Endüstriyel',
            sector: 'Alüminyum'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-samsun-makina-sanayi-as-250x250-1.jpg', 
            company_name: 'Samsun Makina',
            sector: 'Alüminyum'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-ege-proses-250x250-1.jpg', 
            company_name: 'Ege Proses',
            sector: 'Alüminyum'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-tei-tusas-motor-sanayii-as-250x250-1.jpg', 
            company_name: 'TEI TUSAŞ',
            sector: 'Alüminyum'
        },
        { 
            url: 'assets/img/ref/tubitak-250x250-1.jpg', 
            company_name: 'Tubitak',
            sector: 'Automobile'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-betek-250x250-1.jpg', 
            company_name: 'Betek',
            sector: 'Automobile'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-trakya-birlik-250x250-1.jpg', 
            company_name: 'Trakya Birlik',
            sector: 'Automobile'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-pirelli-250x250-1.jpg', 
            company_name: 'Pirelli',
            sector: 'Automobile'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-perfetti-250x250-1.jpg', 
            company_name: 'Perfetti',
            sector: 'Automobile'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-marsa-yag-250x250-1.jpg', 
            company_name: 'Marsa Yağ',
            sector: 'Automobile'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-tofas-250x250-1.jpg', 
            company_name: 'Tofaş',
            sector: 'Automobile'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-dr-oetker-250x250-1.jpg', 
            company_name: 'Dr. Oetker',
            sector: 'Automobile'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-ulker-biskuvi-250x250-1.jpg', 
            company_name: 'Ülker Bisküvi',
            sector: 'Automobile'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-pinar-sut-250x250-1.jpg', 
            company_name: 'Pınar Süt',
            sector: 'Automobile'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-dimes-250x250-1.jpg', 
            company_name: 'Dimes',
            sector: 'Automobile'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-beypilic-250x250-1.jpg', 
            company_name: 'Beypiliç',
            sector: 'Automobile'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-koska-250x250-1.jpg', 
            company_name: 'Koska',
            sector: 'Automobile'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-vivident-250x250-1.jpg', 
            company_name: 'Vivident',
            sector: 'Automobile'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-askale-cimento-250x250-1.jpg', 
            company_name: 'Askale Çimento',
            sector: 'Automobile'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-limak-250x250-1.jpg', 
            company_name: 'Limak',
            sector: 'Automobile'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-isdemir-250x250-1.jpg', 
            company_name: 'İsdemir',
            sector: 'Automobile'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-ipek-250x250-1.jpg', 
            company_name: 'İpek',
            sector: 'Automobile'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-ugur-derin-dondurucu-250x250-1.jpg', 
            company_name: 'Uğur Derin Dondurucu',
            sector: 'Automobile'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-assan-aluminyum-250x250-1.jpg', 
            company_name: 'Assan Alüminyum',
            sector: 'Automobile'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-borusan-mannesmann-250x250-1.jpg', 
            company_name: 'Borusan Mannesmann',
            sector: 'Automobile'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-cimpor-250x250-1.jpg', 
            company_name: 'Cimpor',
            sector: 'Automobile'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-euas-250x250-1.jpg', 
            company_name: 'EÜAŞ',
            sector: 'Automobile'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-sumitomo-250x250-1.jpg', 
            company_name: 'Sumitomo',
            sector: 'Automobile'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-hilton-avanos-250x250-1.jpg', 
            company_name: 'Hilton Avanos',
            sector: 'Automobile'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-kombassan-250x250-1.jpg', 
            company_name: 'Kombassan',
            sector: 'Automobile'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-linde-250x250-1.jpg', 
            company_name: 'Linde',
            sector: 'Automobile'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-panda-250x250-1.jpg', 
            company_name: 'Panda',
            sector: 'Automobile'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-saray-holding-250x250-1.jpg', 
            company_name: 'Saray Holding',
            sector: 'Automobile'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-yonca-yag-250x250-1.jpg', 
            company_name: 'Yonca Yağ',
            sector: 'Automobile'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-beta-tea-250x250-1.jpg', 
            company_name: 'Beta Tea',
            sector: 'Automobile'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-basf-250x250-1.jpg', 
            company_name: 'BASF',
            sector: 'Automobile'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-yildiz-holding-250x250-1.jpg', 
            company_name: 'Yıldız Holding',
            sector: 'Automobile'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-thy-doco-250x250-1.jpg', 
            company_name: 'THY DO&CO',
            sector: 'Automobile'
        },
        { 
            url: 'assets/img/ref/tubitak-250x250-1.jpg', 
            company_name: 'Tubitak',
            sector: 'Allgemein'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-betek-250x250-1.jpg', 
            company_name: 'Betek',
            sector: 'Allgemein'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-trakya-birlik-250x250-1.jpg', 
            company_name: 'Trakya Birlik',
            sector: 'Allgemein'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-pirelli-250x250-1.jpg', 
            company_name: 'Pirelli',
            sector: 'Allgemein'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-perfetti-250x250-1.jpg', 
            company_name: 'Perfetti',
            sector: 'Allgemein'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-marsa-yag-250x250-1.jpg', 
            company_name: 'Marsa Yağ',
            sector: 'Allgemein'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-tofas-250x250-1.jpg', 
            company_name: 'Tofaş',
            sector: 'Allgemein'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-dr-oetker-250x250-1.jpg', 
            company_name: 'Dr. Oetker',
            sector: 'Allgemein'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-ulker-biskuvi-250x250-1.jpg', 
            company_name: 'Ülker Bisküvi',
            sector: 'Allgemein'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-pinar-sut-250x250-1.jpg', 
            company_name: 'Pınar Süt',
            sector: 'Allgemein'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-dimes-250x250-1.jpg', 
            company_name: 'Dimes',
            sector: 'Allgemein'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-beypilic-250x250-1.jpg', 
            company_name: 'Beypiliç',
            sector: 'Allgemein'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-koska-250x250-1.jpg', 
            company_name: 'Koska',
            sector: 'Allgemein'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-vivident-250x250-1.jpg', 
            company_name: 'Vivident',
            sector: 'Allgemein'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-askale-cimento-250x250-1.jpg', 
            company_name: 'Askale Çimento',
            sector: 'Allgemein'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-limak-250x250-1.jpg', 
            company_name: 'Limak',
            sector: 'Allgemein'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-isdemir-250x250-1.jpg', 
            company_name: 'İsdemir',
            sector: 'Allgemein'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-ipek-250x250-1.jpg', 
            company_name: 'İpek',
            sector: 'Allgemein'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-ugur-derin-dondurucu-250x250-1.jpg', 
            company_name: 'Uğur Derin Dondurucu',
            sector: 'Allgemein'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-assan-aluminyum-250x250-1.jpg', 
            company_name: 'Assan Alüminyum',
            sector: 'Allgemein'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-borusan-mannesmann-250x250-1.jpg', 
            company_name: 'Borusan Mannesmann',
            sector: 'Allgemein'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-cimpor-250x250-1.jpg', 
            company_name: 'Cimpor',
            sector: 'Allgemein'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-euas-250x250-1.jpg', 
            company_name: 'EÜAŞ',
            sector: 'Allgemein'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-sumitomo-250x250-1.jpg', 
            company_name: 'Sumitomo',
            sector: 'Allgemein'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-hilton-avanos-250x250-1.jpg', 
            company_name: 'Hilton Avanos',
            sector: 'Allgemein'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-kombassan-250x250-1.jpg', 
            company_name: 'Kombassan',
            sector: 'Allgemein'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-linde-250x250-1.jpg', 
            company_name: 'Linde',
            sector: 'Allgemein'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-panda-250x250-1.jpg', 
            company_name: 'Panda',
            sector: 'Allgemein'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-saray-holding-250x250-1.jpg', 
            company_name: 'Saray Holding',
            sector: 'Allgemein'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-yonca-yag-250x250-1.jpg', 
            company_name: 'Yonca Yağ',
            sector: 'Allgemein'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-beta-tea-250x250-1.jpg', 
            company_name: 'Beta Tea',
            sector: 'Allgemein'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-basf-250x250-1.jpg', 
            company_name: 'BASF',
            sector: 'Allgemein'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-yildiz-holding-250x250-1.jpg', 
            company_name: 'Yıldız Holding',
            sector: 'Allgemein'
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-thy-doco-250x250-1.jpg', 
            company_name: 'THY DO&CO',
            sector: 'Allgemein'
        },
        { 
            url: 'assets/img/ref/tubitak-250x250-1.jpg', 
            company_name: 'Tubitak', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-betek-250x250-1.jpg', 
            company_name: 'Betek', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-trakya-birlik-250x250-1.jpg', 
            company_name: 'Trakya Birlik', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-pirelli-250x250-1.jpg', 
            company_name: 'Pirelli', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-perfetti-250x250-1.jpg', 
            company_name: 'Perfetti', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-marsa-yag-250x250-1.jpg', 
            company_name: 'Marsa Yağ', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-tofas-250x250-1.jpg', 
            company_name: 'Tofaş', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-dr-oetker-250x250-1.jpg', 
            company_name: 'Dr. Oetker', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-ulker-biskuvi-250x250-1.jpg', 
            company_name: 'Ülker Bisküvi', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-pinar-sut-250x250-1.jpg', 
            company_name: 'Pınar Süt', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-dimes-250x250-1.jpg', 
            company_name: 'Dimes', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-beypilic-250x250-1.jpg', 
            company_name: 'Beypiliç', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-koska-250x250-1.jpg', 
            company_name: 'Koska', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-vivident-250x250-1.jpg', 
            company_name: 'Vivident', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-askale-cimento-250x250-1.jpg', 
            company_name: 'Askale Çimento', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-limak-250x250-1.jpg', 
            company_name: 'Limak', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-isdemir-250x250-1.jpg', 
            company_name: 'İsdemir', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-ipek-250x250-1.jpg', 
            company_name: 'İpek', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-ugur-derin-dondurucu-250x250-1.jpg', 
            company_name: 'Uğur Derin Dondurucu', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-assan-aluminyum-250x250-1.jpg', 
            company_name: 'Assan Alüminyum', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/tubitak-250x250-1.jpg', 
            company_name: 'Tubitak', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-betek-250x250-1.jpg', 
            company_name: 'Betek', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-trakya-birlik-250x250-1.jpg', 
            company_name: 'Trakya Birlik', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-pirelli-250x250-1.jpg', 
            company_name: 'Pirelli', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-perfetti-250x250-1.jpg', 
            company_name: 'Perfetti', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-marsa-yag-250x250-1.jpg', 
            company_name: 'Marsa Yağ', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-tofas-250x250-1.jpg', 
            company_name: 'Tofaş', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-dr-oetker-250x250-1.jpg', 
            company_name: 'Dr. Oetker', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-ulker-biskuvi-250x250-1.jpg', 
            company_name: 'Ülker Bisküvi', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-pinar-sut-250x250-1.jpg', 
            company_name: 'Pınar Süt', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-dimes-250x250-1.jpg', 
            company_name: 'Dimes', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-beypilic-250x250-1.jpg', 
            company_name: 'Beypiliç', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-koska-250x250-1.jpg', 
            company_name: 'Koska', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-vivident-250x250-1.jpg', 
            company_name: 'Vivident', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-askale-cimento-250x250-1.jpg', 
            company_name: 'Askale Çimento', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-limak-250x250-1.jpg', 
            company_name: 'Limak', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-isdemir-250x250-1.jpg', 
            company_name: 'İsdemir', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-ipek-250x250-1.jpg', 
            company_name: 'İpek', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-ugur-derin-dondurucu-250x250-1.jpg', 
            company_name: 'Uğur Derin Dondurucu', 
            sector: 'Chemie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-assan-aluminyum-250x250-1.jpg', 
            company_name: 'Assan Alüminyum', 
            sector: 'Chemie' 
        },

        { 
            url: 'assets/img/ref/tubitak-250x250-1.jpg', 
            company_name: 'Tubitak', 
            sector: 'Energie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-betek-250x250-1.jpg', 
            company_name: 'Betek', 
            sector: 'Energie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-trakya-birlik-250x250-1.jpg', 
            company_name: 'Trakya Birlik', 
            sector: 'Energie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-pirelli-250x250-1.jpg', 
            company_name: 'Pirelli', 
            sector: 'Energie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-perfetti-250x250-1.jpg', 
            company_name: 'Perfetti', 
            sector: 'Energie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-marsa-yag-250x250-1.jpg', 
            company_name: 'Marsa Yağ', 
            sector: 'Energie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-tofas-250x250-1.jpg', 
            company_name: 'Tofaş', 
            sector: 'Energie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-dr-oetker-250x250-1.jpg', 
            company_name: 'Dr. Oetker', 
            sector: 'Energie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-ulker-biskuvi-250x250-1.jpg', 
            company_name: 'Ülker Bisküvi', 
            sector: 'Energie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-pinar-sut-250x250-1.jpg', 
            company_name: 'Pınar Süt', 
            sector: 'Energie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-dimes-250x250-1.jpg', 
            company_name: 'Dimes', 
            sector: 'Energie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-beypilic-250x250-1.jpg', 
            company_name: 'Beypiliç', 
            sector: 'Energie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-koska-250x250-1.jpg', 
            company_name: 'Koska', 
            sector: 'Energie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-vivident-250x250-1.jpg', 
            company_name: 'Vivident', 
            sector: 'Energie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-askale-cimento-250x250-1.jpg', 
            company_name: 'Askale Çimento', 
            sector: 'Energie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-limak-250x250-1.jpg', 
            company_name: 'Limak', 
            sector: 'Energie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-isdemir-250x250-1.jpg', 
            company_name: 'İsdemir', 
            sector: 'Energie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-ipek-250x250-1.jpg', 
            company_name: 'İpek', 
            sector: 'Energie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-ugur-derin-dondurucu-250x250-1.jpg', 
            company_name: 'Uğur Derin Dondurucu', 
            sector: 'Energie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-assan-aluminyum-250x250-1.jpg', 
            company_name: 'Assan Alüminyum', 
            sector: 'Energie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-borusan-mannesmann-250x250-1.jpg', 
            company_name: 'Borusan Mannesmann', 
            sector: 'Energie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-cimpor-250x250-1.jpg', 
            company_name: 'Cimpor', 
            sector: 'Energie' 
        },
        { 
            url: 'assets/img/ref/ensotek-referanslari-euas-250x250-1.jpg', 
            company_name: 'EÜAŞ', 
            sector: 'Energie' 
        },
        {
            url: 'assets/img/ref/tubitak-250x250-1.jpg',
            company_name: 'Tubitak',
            sector: 'Energie'
        },
        {
            url: 'assets/img/ref/ensotek-referanslari-betek-250x250-1.jpg',
            company_name: 'Betek',
            sector: 'Energie'
        },
        {
            url: 'assets/img/ref/ensotek-referanslari-trakya-birlik-250x250-1.jpg',
            company_name: 'Trakya Birlik',
            sector: 'Energie'
        },
        {
            url: 'assets/img/ref/ensotek-referanslari-pirelli-250x250-1.jpg',
            company_name: 'Pirelli',
            sector: 'Energie'
        },
        {
            url: 'assets/img/ref/ensotek-referanslari-perfetti-250x250-1.jpg',
            company_name: 'Perfetti',
            sector: 'Energie'
        },
        {
            url: 'assets/img/ref/ensotek-referanslari-marsa-yag-250x250-1.jpg',
            company_name: 'Marsa Yağ',
            sector: 'Energie'
        },
        {
            url: 'assets/img/ref/ensotek-referanslari-tofas-250x250-1.jpg',
            company_name: 'Tofaş',
            sector: 'Energie'
        },
        {
            url: 'assets/img/ref/ensotek-referanslari-dr-oetker-250x250-1.jpg',
            company_name: 'Dr. Oetker',
            sector: 'Energie'
        },
        {
            url: 'assets/img/ref/ensotek-referanslari-ulker-biskuvi-250x250-1.jpg',
            company_name: 'Ülker Bisküvi',
            sector: 'Energie'
        },
        {
            url: 'assets/img/ref/ensotek-referanslari-pinar-sut-250x250-1.jpg',
            company_name: 'Pınar Süt',
            sector: 'Energie'
        },
        {
            url: 'assets/img/ref/ensotek-referanslari-dimes-250x250-1.jpg',
            company_name: 'Dimes',
            sector: 'Energie'
        },
        {
            url: 'assets/img/ref/ensotek-referanslari-beypilic-250x250-1.jpg',
            company_name: 'Beypiliç',
            sector: 'Energie'
        },
        {
            url: 'assets/img/ref/ensotek-referanslari-koska-250x250-1.jpg',
            company_name: 'Koska',
            sector: 'Energie'
        },
        {
            url: 'assets/img/ref/ensotek-referanslari-vivident-250x250-1.jpg',
            company_name: 'Vivident',
            sector: 'Energie'
        },
        {
            url: 'assets/img/ref/ensotek-referanslari-askale-cimento-250x250-1.jpg',
            company_name: 'Askale Çimento',
            sector: 'Energie'
        },
        {
            url: 'assets/img/ref/ensotek-referanslari-limak-250x250-1.jpg',
            company_name: 'Limak',
            sector: 'Energie'
        },
        {
            url: 'assets/img/ref/ensotek-referanslari-isdemir-250x250-1.jpg',
            company_name: 'İsdemir',
            sector: 'Energie'
        },
        {
            url: 'assets/img/ref/ensotek-referanslari-ipek-250x250-1.jpg',
            company_name: 'İpek',
            sector: 'Energie'
        },
        {
            url: 'assets/img/ref/ensotek-referanslari-ugur-derin-dondurucu-250x250-1.jpg',
            company_name: 'Uğur Derin Dondurucu',
            sector: 'Energie'
        },
        {
            url: 'assets/img/ref/ensotek-referanslari-assan-aluminyum-250x250-1.jpg',
            company_name: 'Assan Alüminyum',
            sector: 'Energie'
        },
        {
            url: 'assets/img/ref/ensotek-referanslari-borusan-mannesmann-250x250-1.jpg',
            company_name: 'Borusan Mannesmann',
            sector: 'Energie'
        },
        {
            url: 'assets/img/ref/ensotek-referanslari-cimpor-250x250-1.jpg',
            company_name: 'Cimpor',
            sector: 'Energie'
        },
        {
            url: 'assets/img/ref/ensotek-referanslari-euas-250x250-1.jpg',
            company_name: 'EÜAŞ',
            sector: 'Energie'
        }
    ]

module.exports = references;
    
