// =========================================
// MONITORIA CEMCS - SCRIPT.JS
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("Sistema Monitoria CEMCS carregado!");

    // ==========================
    // FORMULÁRIO DE AGENDAMENTO
    // ==========================

    const formulario = document.querySelector("form");

    if (formulario) {
        formulario.addEventListener("submit", (event) => {

            event.preventDefault();

            const nome = document.getElementById("nome");
            const email = document.getElementById("email");

            if (!nome.value.trim()) {
                alert("Por favor, informe seu nome.");
                nome.focus();
                return;
            }

            if (!email.value.trim()) {
                alert("Por favor, informe seu e-mail.");
                email.focus();
                return;
            }

            alert("Solicitação de monitoria enviada com sucesso!");

            formulario.reset();
        });
    }

    // ==========================
    // EFEITO SCROLL SUAVE
    // ==========================

    const links = document.querySelectorAll('nav a');

    links.forEach(link => {
        link.addEventListener('click', function (e) {

            const destino = document.querySelector(this.getAttribute('href'));

            if (destino) {
                e.preventDefault();

                destino.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================
    // DESTAQUE MENU ATIVO
    // ==========================

    window.addEventListener("scroll", () => {

        const sections = document.querySelectorAll("section");

        let currentSection = "";

        sections.forEach(section => {

            const sectionTop = section.offsetTop - 150;

            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute("id");
            }
        });

        links.forEach(link => {
            link.classList.remove("ativo");

            if (
                link.getAttribute("href") === "#" + currentSection
            ) {
                link.classList.add("ativo");
            }
        });
    });

});