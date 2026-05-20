function initMenu() {
    const boton = document.querySelector(".menu-ham");
    const nav = document.querySelector(".nav");

    boton.addEventListener("click", function() {
        nav.classList.toggle("menu-abierto");
    });
}

initMenu();
