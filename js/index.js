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

function generarPerfiles() {
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

function loadConfig() {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get("lang") || "ES";

    const script = document.createElement("script");
    script.src = `./conf/config${lang}.json`;
    script.onload = function() {
        initConfig();
        generarPerfiles();
    };
    script.onerror = function() {
        const fallback = document.createElement("script");
        fallback.src = "./conf/configES.json";
        fallback.onload = function() {
            initConfig();
            generarPerfiles();
        };
        document.head.appendChild(fallback);
    };
    document.head.appendChild(script);
}

loadConfig();
