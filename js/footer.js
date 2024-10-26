export function loadFooter() {
    const footer = document.getElementById('footer');
    footer.innerHTML = `
        <footer class="footer">
            <div class="social-icons">
                <ul class="list-unstyled d-flex">
                    <li><a href="https://www.facebook.com/Ensotek"><i class="bi bi-facebook"></i></a></li>
                    <li><a href="https://x.com/Ensotek_Cooling"><i class="bi bi-twitter"></i></a></li>
                    <li><a href="https://www.instagram.com/ensotekcoolingtowers/"><i class="bi bi-instagram"></i></a></li>
                    <li><a href="https://www.linkedin.com/company/ensotek-su-so-utma-kuleleri-ltd-ti-/people/"><i class="bi bi-linkedin"></i></a></li>
                </ul>
            </div>
            <div class="copyright">
                <h4>&copy; 2024 Copyright <strong>ENSOTEK</strong>. Alle Rechte vorbehalten. | Designed by OG</h4>
            </div>
        </footer>
    `;
}
document.addEventListener('DOMContentLoaded', loadFooter);