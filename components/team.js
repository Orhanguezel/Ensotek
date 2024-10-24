export function loadTeam() {
    const teamSection = document.getElementById("unser-team");
    teamSection.innerHTML = `
          <section id="unser-Team">
              <h1>Unser Team</h1>
              <h2>Unser engagiertes Team ist stets bereit, Ihnen bei Ihren Bedürfnissen zu helfen.</h2>
              <div class="team-container">
                  <div class="team-member">
                      <div class="team-top">
                          <div class="team-img">
                              <img src="assets/img/team/1.jpeg" alt="İbrahim YAĞAR" class="img-fluid">
                          </div>
                          <div class="team-info">
                              <h3>İbrahim YAĞAR</h3>
                              <i>Geschäftsführer und Gründer</i>
                              <div class="team-social-icon">
                                  <a href="mailto:iyagar@gmail.com"><i class="bi bi-envelope"></i></a>
                                  <a href="https://linkedin.com/in/ibrahim-yağar-a502a9178" target="_blank"><i class="bi bi-linkedin"></i></a>
                              </div>
                          </div>
                      </div>
                      <div class="team-description">
                          <h4>İbrahim YAĞAR ist der Geschäftsführer und Gründer von Ensotek Su Soğutma Kuleleri. Vor 36 Jahren gründete er das Unternehmen und machte es zu einer weltweit anerkannten Marke.</h4>
                      </div>
                  </div>
  
                  <div class="team-member">
                      <div class="team-top">
                          <div class="team-img">
                              <img src="assets/img/team/2.jpeg" alt="Hamdi YAĞAR" class="img-fluid">
                          </div>
                          <div class="team-info">
                              <h3>Hamdi YAĞAR</h3>
                              <i>Stellvertretender Geschäftsführer</i>
                              <div class="team-social-icon">
                                  <a href="mailto:hamdi.yagar@ensotek.com.tr"><i class="bi bi-envelope"></i></a>
                                  <a href="https://www.linkedin.com/in/hamdiyagar/" target="_blank"><i class="bi bi-linkedin"></i></a>
                              </div>
                          </div>
                      </div>
                      <div class="team-description">
                          <h4>Hamdi Yağar ist der stellvertretende Geschäftsführer unseres Unternehmens und verfügt über 18 Jahre Erfahrung in der Leitung von Familienunternehmen.</h4>
                      </div>
                  </div>
  
                  <div class="team-member">
                      <div class="team-top">
                          <div class="team-img">
                              <img src="assets/img/team/3.jpeg" alt="Ahmet Gökhan YAĞAR" class="img-fluid">
                          </div>
                          <div class="team-info">
                              <h3>Ahmet Gökhan YAĞAR</h3>
                              <i>Vorstandsmitglied und Produktionsleiter</i>
                              <div class="team-social-icon">
                                  <a href="https://linkedin.com/in/ahmet-gökhan-yağar-19244774" target="_blank"><i class="bi bi-linkedin"></i></a>
                              </div>
                          </div>
                      </div>
                      <div class="team-description">
                          <h4>Ahmet Gökhan YAĞAR überwacht alle Phasen des Produktionsprozesses und stellt sicher, dass Ensotek qualitativ hochwertige Produkte herstellt.</h4>
                      </div>
                  </div>
  
                  <div class="team-member">
                      <div class="team-top">
                          <div class="team-img">
                              <img src="assets/img/team/5.jpeg" alt="Can Zemheri" class="img-fluid">
                          </div>
                          <div class="team-info">
                              <h3>Can Zemheri</h3>
                              <i>Außenhandelsexperte</i>
                              <div class="team-social-icon">
                                  <a href="https://linkedin.com/in/canzemheri" target="_blank"><i class="bi bi-linkedin"></i></a>
                              </div>
                          </div>
                      </div>
                      <div class="team-description">
                          <h4>Can Zemheri ist verantwortlich für die internationalen Handelsprozesse und spielt eine Schlüsselrolle bei der Entwicklung des globalen Handelsnetzwerks von Ensotek.</h4>
                      </div>
                  </div>
              </div>
          </section>
      `;
}

// Sayfa yüklendiğinde fonksiyonu çağır
document.addEventListener("DOMContentLoaded", function() {
  loadTeam();
});
