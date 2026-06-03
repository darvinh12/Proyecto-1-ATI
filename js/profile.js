console.log("global:", this);

function initConfig() {
    document.getElementById("logo-ati").textContent = config.site[0];
    document.getElementById("logo-ucv").textContent = config.site[1];
    document.getElementById("logo-log").textContent = config.site[2];
    document.getElementById("busqueda-input").placeholder = config.name;
    document.getElementById("busqueda-boton").textContent = config.search;
    document.getElementById("user-icono").alt = config.profile;
    document.getElementById("footer").textContent = config.copyRight;
    document.getElementById("perfil-texto").textContent = config.profile;
}

function llenarPerfil() {
    document.getElementById("titulo").textContent = profile.name;
    document.getElementById("nombre-perfil").textContent = profile.name;
    document.getElementById("descripcion").textContent = profile.description;
    document.getElementById("foto-perfil").src = `./${profile.ci}/${profile.ci}Big${profile.image_ext}`;
    document.getElementById("foto-perfil").alt = profile.name;
    document.getElementById("color-label").textContent = config.color + ":";
    document.getElementById("color-value").textContent = profile.color;
    document.getElementById("libro-label").textContent = singularOPlural(config.book, profile.book) + ":";
    document.getElementById("libro-value").textContent = profile.book.join(", ");
    document.getElementById("musica-label").textContent = singularOPlural(config.music, profile.music) + ":";
    document.getElementById("musica-value").textContent = profile.music.join(", ");
    document.getElementById("videojuego-label").textContent = singularOPlural(config.video_game, profile.video_game) + ":";
    document.getElementById("videojuego-value").textContent = profile.video_game.join(", ");
    document.getElementById("lenguaje-label").textContent = config.language + ":";
    document.getElementById("lenguaje-value").textContent = profile.language.join(", ");
    document.getElementById("correo").innerHTML = config.email.replace(
        "[email]",
        `<a class="correo" href="mailto:${profile.email}">${profile.email}</a>`
    );
}

function singularOPlural(textos, valores) {
    return valores.length === 1 ? textos[0] : textos[1];
}

function cargarPerfil() {
    const params = new URLSearchParams(window.location.search);
    const ci = params.get("ci");

    if (!ci) {
        document.body.innerHTML = "<p>No se especificó un perfil.</p>";
        return;
    }

    const script = document.createElement("script");
    script.src = `./${ci}/profile.json`;
    script.onload = function() {
        llenarPerfil();
    };
    script.onerror = function() {
        document.body.innerHTML = `<p>No se encontró el perfil ${ci}.</p>`;
    };
    document.head.appendChild(script);
}

function loadConfig() {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get("lang") || "ES";

    const script = document.createElement("script");
    script.src = `./conf/config${lang}.json`;
script.onload = function() {
    initConfig();
    cargarPerfil();
    initBuscadorPerfil();
};

    script.onerror = function() {
        const fallback = document.createElement("script");
        fallback.src = "./conf/configES.json";
fallback.onload = function() {
    initConfig();
    cargarPerfil();
    initBuscadorPerfil();
};

        document.head.appendChild(fallback);
    };
    document.head.appendChild(script);
}

function initBuscadorPerfil() {
    const input = document.getElementById("busqueda-input");
    const boton = document.getElementById("busqueda-boton");

    function redirigir() {
        const q = input.value.trim();
        const lang = new URLSearchParams(window.location.search).get("lang");
        let url = `./index.html?q=${encodeURIComponent(q)}`;
        if (lang) url += `&lang=${lang}`;
        window.location.href = url;
    }

    boton.addEventListener("click", function(e) {
        console.log("función normal:", this);
        e.preventDefault();
        redirigir();
    });

    input.addEventListener("keydown", (e) => {
        console.log("arrow:", this);
        if (e.key === "Enter") {
            e.preventDefault();
            redirigir();
        }
    });
}


loadConfig();
