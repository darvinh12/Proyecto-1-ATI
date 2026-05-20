function initConfig() {
    document.getElementById("logo-ati").textContent = config.site[0];
    document.getElementById("logo-ucv").textContent = config.site[1];
    document.getElementById("logo-log").textContent = config.site[2];

    document.getElementById("busqueda-input").placeholder = config.name;
    document.getElementById("busqueda-boton").textContent = config.search;

    document.getElementById("user-icono").alt = config.profile;

    document.getElementById("semestre").textContent = config.semester;

    document.getElementById("footer").textContent = config.copyRight;
}

initConfig();
