export function loadTeam() {
    const teamSection = document.getElementById('unser-team');
    teamSection.innerHTML = `
        <section id="unser-Team">
            <h1>Unser Team</h1>
            <h2>Unser engagiertes Team ist stets bereit, Ihnen bei Ihren Bedürfnissen zu helfen.</h2>
            <div class="team-container">
                <div class="team-member">
                    <div class="team-top">
                        <div class="team-img">
                            <img src="img/team/1.jpeg" alt="İbrahim YAĞAR" class="img-fluid">
                        </div>
                        <div class="team-info">
                            <h3>İbrahim YAĞAR</h3>
                            <i>Geschäftsführer und Gründer</i>
                            <div class="team-social-icon">
                                <a href="mailto:iyagar@gmail.com"><i class="bi bi-envelope"></i></a>
                                <a href="https://www.linkedin.com/in/ibrahim-yağar-a502a9178" target="_blank"><i class="bi bi-linkedin"></i></a>
                            </div>
                        </div>
                    </div>
                    <div class="team-description">
                        <h4>İbrahim YAĞAR ist der Geschäftsführer und Gründer von Ensotek Su Soğutma Kuleleri...</h4>
                    </div>
                </div>

                <div class="team-member">
                    <div class="team-top">
                        <div class="team-img">
                            <img src="img/team/2.jpeg" alt="Hamdi YAĞAR" class="img-fluid">
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
                        <h4>Hamdi Yağar ist der stellvertretende Geschäftsführer...</h4>
                    </div>
                </div>

                <!-- Diğer takım üyeleri de aynı yapıda olacak -->
            </div>
        </section>
    `;
}
