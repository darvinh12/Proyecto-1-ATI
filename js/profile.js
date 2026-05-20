function initConfig() {
    document.getElementById("logo-ati").textContent = config.site[0];
    document.getElementById("logo-ucv").textContent = config.site[1];
    document.getElementById("logo-log").textContent = config.site[2];

    document.getElementById("busqueda-input").placeholder = config.name;
    document.getElementById("busqueda-boton").textContent = config.search;

    document.getElementById("user-icono").alt = config.profile;

    document.getElementById("footer").textContent = config.copyRight;
}

function fillProfile() {
    document.getElementById("titulo").textContent = profile.name;
    document.getElementById("nombre-perfil").textContent = profile.name;
    document.getElementById("descripcion").textContent = profile.description;

    document.getElementById("foto-perfil").src = `./${profile.ci}/${profile.ci}Big${profile.image_ext}`;
    document.getElementById("foto-perfil").alt = profile.name;

    document.getElementById("color-label").textContent = config.color + ":";
    document.getElementById("color-value").textContent = profile.color;

    document.getElementById("libro-label").textContent = singularOrPlural(config.book, profile.book) + ":";
    document.getElementById("libro-value").textContent = profile.book.join(", ");

    document.getElementById("musica-label").textContent = singularOrPlural(config.music, profile.music) + ":";
    document.getElementById("musica-value").textContent = profile.music.join(", ");

    document.getElementById("videojuego-label").textContent = singularOrPlural(config.video_game, profile.video_game) + ":";
    document.getElementById("videojuego-value").textContent = profile.video_game.join(", ");

    document.getElementById("lenguaje-label").textContent = config.language + ":";
    document.getElementById("lenguaje-value").textContent = profile.language.join(", ");

    document.getElementById("correo").innerHTML = config.email.replace(
        "[email]",
        `<a class="correo" href="mailto:${profile.email}">${profile.email}</a>`
    );
}

function singularOrPlural(textos, valores) {
    return valores.length === 1 ? textos[0] : textos[1];
}

function loadProfile() {
    const params = new URLSearchParams(window.location.search);
    const ci = params.get("ci");

    if (!ci) {
        document.body.innerHTML = "<p>No se especificó un perfil.</p>";
        return;
    }

    const script = document.createElement("script");
    script.src = `./${ci}/profile.json`;
    script.onload = function() {
        fillProfile();
    };
    script.onerror = function() {
        document.body.innerHTML = `<p>No se encontró el perfil ${ci}.</p>`;
    };
    document.head.appendChild(script);
}

initConfig();
loadProfile();
