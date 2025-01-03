// newsItems.js
const news = [
    { id: 1, title: "HVAC-R EGYPT EXPO: Über 20 Jahre Inspiration für die Industrie", 
    summary: " Seit über 20 Jahren fördert und inspiriert die HVAC-R EGYPT EXPO Veränderungen in der Industrie. Ägyptensgrößte und einzige Plattform ist der zentrale Treffpunkt für MEP, Design, HVAC-R-Manager und Ingenieure, Berater, Projektmanager, Bauunternehmen, Architekten, Generalunternehmer, Einkaufs- und Vertriebsmanager,kommerzielle Bauherren, Lieferanten, Regierungsbehörden, CEOs und Geschäftsführer.", 
    content: " Die HVAC-R EGYPT EXPO bietet zahlreiche Möglichkeiten, sich mit der lokalen und globalen Industrie-Community zu vernetzen, und ermöglicht es Ihnen, Gleichgesinnte zu treffen. Diese Verantaltung ist in der heutigen wettbewerbsintensiven Marktlandschaft von unschätzbarem Wert, da sie die besten Kontakte bietet und Ihnen hilft, sich von der Masse abzuheben.", 
    date: "2024-05-14", 
    image: "assets/img/news/egypr-hvac.jpg" },
    
    { id: 2, title: "Wir waren auf der ISK-SODEX 2023 Messe", 
    summary: " Wir haben an der Messe ISK-SODEX 2023 teilgenommen, die vom 25. bis 28. Oktober 2023 im İstanbul Messezentrum stattfand. Die ISK-SODEX ist eine führende Veranstaltung in den Bereichen Klimatisierung, Kühlung, Belüftung und Energieeffizienz und bringt jedes Jahr zahlreiche Fachleute und Kunden zusammen. Die diesjährige Messe hat erneut die Bedeutung des persönlichen Kontakts nach der Pandemie verdeutlicht. Für uns war die eine großartige Gelegenheit, uns mit unseren Kunden und Geschäftspartnern zu treffen und die neuesten Trends und Innovationen der Branche zu teilen. Während der Messe haben wir detaillierte Informationen zu unseren Produkten und Dienstleistungen bereitgestellt und persönliche Gespräche geführt, um die Bedürfnisse unserer Kunden besser zu verstehen.", 
    content: " Auf der diesjährigen Messe wurde unser Stand von Hunderten von Besuchern mit großem Interesse besucht.  Wir  hatten die Gelegenheit, unseren Kunden die Hand zu schütteln und über neue Projekte und  Geschäftsmöglichkeiten zu sprechen. Wir danken allen Besuchern für das große Interesse, das sie auf der  ISK-SODEX 2023 gezeigt haben.<br>  Zukünftige Messebeteiligungen<br> Mit den Erfahrungen und Kontakten, die wir auf der  gesammelt haben, planen wir, auch in Zukunft an Messen teilzunehmen. Wir freuen uns darauf, in den Bereichen industrielle Kühlung, Belüftung und Energieeffizienz mehr Kunden und Geschäftspartner zu treffen. Diese Veranstaltung bot uns eine großartige Gelegenheit, unser Geschäft auszubauen und uns mit den führenden Akteuren unserer Branche zu treffen. Wir danken allen Kunden und Geschäftspartnern, die uns auf der ISK-SODEX besucht haben, noch einmal.  Wir freuen uns darauf, Sie auf der nächsten Messe zu sehen!", 
    date: "2023-11-28", 
    image: "assets/img/news/1.jpg" },
   
    { id: 3, title: "Besuchen Sie uns auf der ISK Sodex 2023!", 
    summary: "Wir freuen uns, bekannt geben zu können, dass wir vom 25. bis 28. Oktober 2023 auf der ISK Sodex in Istanbul vertreten sein werden. Die Messe findet im CNR Istanbul Expo Center statt, und Sie finden uns in Halle 2 am Stand E20.", 
    content: "Wir laden alle unsere Kunden, Lieferanten und Branchenfreunde herzlich ein, unseren Stand zu besuchen. Auf der Messe präsentieren wir unsere innovativen Produkte und neuesten Technologielösungen. Es wäre uns eine große Freude, Sie auf dieser wichtigen Veranstaltung begrüßen zu dürfen.", 
    date: "2023-10-28", 
    image: "assets/img/news/3.jpg" },
    
    { id: 5, title: "Wir nahmen an der AQUA THERM UZBEKISTAN 2019 Messe teil!", 
    summary: "Wir haben erfolgreich an der AQUA THERM UZBEKISTAN 2019 Messe teilgenommen! Auf dieser wichtigen Veranstaltung, die vom 15. bis 17. Mai 2019 in Taschkent stattfand, präsentierten wir unsere neuesten Produkte und Dienstleistungen. ", 
    content: "Die Messe ist ein bedeutendes Ereignis für die Branche der Heizungs-, Klima- und Kühlsysteme und bringt führende Unternehmen zusammen. Wir hatten die Gelegenheit, mit Branchenprofis zu interagieren und unsere Innovationen sowie Lösungen vorzustellen. Wir freuen uns darauf, Sie bei zukünftigen Veranstaltungen an unserem Stand begrüßen zu dürfen!", 
    date: "2019-05-17", 
    image: "assets/img/news/16.jpg" },
    
    { id: 6, title: "Treffen Sie uns auf der Chillventa in Deutschland!", 
    summary: "Wir freuen uns, Ihnen mitteilen zu können, dass wir an der Chillventa, der führenden Messe für Kälte- und Klimatechnik, teilnehmen werden. ", 
    content: "Besuchen Sie uns vom 7. bis 9. Oktober in Halle 7, Stand 7-108, um mehr über unsere innovativen Lösungen zu erfahren. Wir freuen uns auf Ihren Besuch!", 
    date: "2022-10-13", 
    image: "assets/img/news/13.jpg" },
    
    { id: 7, title: "Fertigstellung und Lieferung der Wasserkühltürme in Adana!", 
    summary: "Wir freuen uns, die erfolgreiche Fertigstellung unserer Wasserkühltürme auf der Baustelle in Adana und deren Übergabe an unseren Kunden bekannt zu geben. Ensotek Wasserkühltürme, die bevorzugte Marke in der Adanaer Industrie, setzen ihre Mission fort, das Wasser der regionalen Industrie zu kühlen.", 
    content: "Durch langjährige Erfahrung und kontinuierliche Innovation hat sich Ensotek als vertrauenswürdiger Partner für effiziente Kühlungslösungen etabliert. Wir sind stolz darauf, einen wesentlichen Beitrag zur Steigerung der Betriebseffizienz und zur Umweltschonung in der Region zu leisten.", 
    date: "2021-06-05", 
    image: "assets/img/news/11.jpg" },
    
    { id: 8, title: "Produktionsstart in unserem neuen Werk in Ankara!", 
    summary: "Wir freuen uns, den Start der Produktion in unserem neuen Werk in Ankara bekannt zu geben, um unseren Kunden schnelleren und qualitativ hochwertigeren Service zu bieten. Gemeinsam mit unseren Einrichtungen in Istanbul sind wir nun näher an Ihnen und können effizienter auf Ihre Bedürfnisse eingehen.", 
    content: "In der größten Anlage, die speziell für die Produktion von Wasserkühltürmen konzipiert wurde, sind wir stolz darauf, Produkte zu fertigen, die Industriestandards setzen. Wir erleben den Stolz der Produktion für Sie in einem Werk, das sowohl offene als auch geschlossene Wasserkühltürme und Ersatzteile bietet.", 
    date: "2023-11-23", 
    image: "assets/img/news/12.jpg" },
   
    { id: 9, title: "Erfolgreiche Lieferung unserer Kühltürme nach Griechenland!", 
    summary: "Wir freuen uns, bekannt geben zu können, dass die Installation unserer Kühltürme bei einem Kunden in Griechenland erfolgreich abgeschlossen wurde. Wir hoffen, dass unsere Kühltürme dem Kunden viele Jahre zuverlässig dienen werden und wünschen ihm viel Erfolg und zufriedenstellende Leistung mit unserer Technologie.", 
    content: "Besuchen Sie unsere Website für weitere Informationen zu unseren Produkten und Dienstleistungen. Wir sind stolz darauf, maßgeschneiderte Lösungen anbieten zu können, die den spezifischen Anforderungen unserer Kunden entsprechen. Erleben Sie die Qualität und Zuverlässigkeit unserer Kühltürme, die speziell für die Optimierung Ihrer Prozesse entwickelt wurden. Dieser Text legt den Fokus auf die erfolgreiche Installation und den Nutzen der Kühltürme, fördert die Markenpräsenz und lädt Kunden ein, mehr über die angebotenen Produkte und Dienstleistungen zu erfahren.", 
    date: "2022-05-04", 
    image: "assets/img/news/14.jpg" },
    
    { id: 10, title: "Unsere Kühltürme in Saudi-Arabien erfolgreich in Betrieb genommen!", 
    summary: "Wir freuen uns mitteilen zu können, dass unsere Kühltürme an einen Kunden in Saudi-Arabien geliefert und erfolgreich in Betrieb genommen wurden. Wir wünschen dem Kunden viele erfolgreiche und effiziente Nutzungstage mit unseren Produkten.", 
    content: "Besuchen Sie unsere Website für weitere Informationen über unsere fortschrittlichen Kühlsysteme und die Vorteile, die sie bieten. Unsere Experten arbeiten kontinuierlich daran, die Effizienz und Zuverlässigkeit unserer Kühltürme zu verbessern, um den spezifischen Anforderungen unserer globalen Kunden gerecht zu werden. Dieser Text betont die erfolgreiche Installation und Inbetriebnahme der Kühltürme in Saudi-Arabien und ist so formuliert, dass er das Vertrauen in die Qualität und Zuverlässigkeit der Produkte stärkt.",
     date: "2020-03-03", 
     image: "assets/img/news/15.jpg" },

    { id: 11,
    title: "Unsere geschlossenen Kreislauf-Kühltürme erobern die Verteidigungsindustrie",
    summary: "Die geschlossenen Kreislauf-Kühltürme von ENSOTEK erobern die Verteidigungsindustrie. Unsere Produktion läuft auf Hochtouren, um die Bedürfnisse dieser kritischen Branche zu erfüllen. Unsere geschlossenen Kreislauf-Kühltürme zeichnen sich durch hohe Effizienz, Langlebigkeit und geringe Wartungskosten aus. Diese Türme werden in verschiedenen Bereichen der Verteidigungsindustrie eingesetzt und sorgen für die Sicherheit kritischer Prozesse.",
    content: "ENSOTEK stärkt seine Position in der Verteidigungsindustrie mit seinen geschlossenen Kreislauf-Kühltürmen. Während unsere Produktion auf Hochtouren läuft, bieten wir innovative Lösungen, um die wachsenden Anforderungen der Branche zu erfüllen. Unsere geschlossenen Kreislauf-Kühltürme zeichnen sich durch hohe Effizienz, Langlebigkeit und geringe Wartungskosten aus. Diese Türme sind für die Kühlbedürfnisse von Militäreinrichtungen, Radarstationen und anderen kritischen Infrastrukturen konzipiert.<br><br>Unsere geschlossenen Kreislauf-Kühltürme sorgen durch ihr geschlossenes System dafür, dass das Wasser sauber bleibt und vor Umwelteinflüssen geschützt ist. Diese Eigenschaft bietet in sensiblen Branchen wie der Verteidigungsindustrie einen großen Vorteil. Darüber hinaus tragen diese energieeffizienten Türme zur Senkung der Betriebskosten bei und unterstützen nachhaltige Ziele.<br><br>ENSOTEK wird weiterhin innovative Lösungen für die Verteidigungsindustrie anbieten. Durch die Erweiterung unserer Produktionskapazitäten und fortlaufende Investitionen in Forschung und Entwicklung streben wir danach, unseren Kunden die höchste Qualität zu bieten. Für weitere Informationen über unsere geschlossenen Kreislauf-Kühltürme und wie wir Ihre Projekte unterstützen können, kontaktieren Sie uns bitte.<br><br>ENSOTEK Kühlwassertürme<br>Hauptsitz: Muratpaşa Mah. Uluyol Cad. No:19 İstanbul Tower K:5 D:20 34040 Bayrampaşa - İstanbul - Türkei<br>Telefon: +90 212 613 33 09 - +90 212 613 33 01<br>Fax: +90 212 613 33 10<br>E-Mail: <a href='mailto:info@ensotek.com'>info@ensotek.com</a>",
    date: "2024-05-31",
    image: "assets/img/news/1717089282656.jpeg"
    }
];

// Haberleri tarihe göre sırala (en yeni en başta olacak şekilde)
news.sort((a, b) => new Date(b.date) - new Date(a.date));

module.exports = { news };
