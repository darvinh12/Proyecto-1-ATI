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

function renderProfiles() {
    const contenedor = document.getElementById("perfiles");
    contenedor.innerHTML = "";

    profiles.forEach(function(perfil) {
        const tarjeta = document.createElement("a");
        tarjeta.className = "tarjeta-perfil";
        tarjeta.href = "#";

        tarjeta.innerHTML = `
            <div class="contenedor-img-perfil">
                <img src="./${perfil.ci}/${perfil.ci}Big${perfil.image_ext}" alt="${perfil.name}" class="imagen-perfil">
            </div>
            <div class="contenedor-info-perfil">
                <h3>${perfil.name}</h3>
            </div>
            <div class="barra-inferior"></div>
        `;

        tarjeta.addEventListener("click", function(e) {
            e.preventDefault();
            window.location.href = `./profile.html?ci=${perfil.ci}`;
        });

        contenedor.appendChild(tarjeta);
    });
}

initConfig();
renderProfiles();

