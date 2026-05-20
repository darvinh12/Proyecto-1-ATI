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

function generarPerfiles(lista) {
  const contenedor = document.getElementById("perfiles");
  contenedor.innerHTML = "";

  if (lista.length === 0) {
    const query = document.getElementById("busqueda-input").value;
    contenedor.innerHTML = `<p class="sin-resultados">${config.no_results}: <b>${query}</b></p>`;
    return;
  }

  lista.forEach(function (perfil) {
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

    tarjeta.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = `./profile.html?ci=${perfil.ci}`;
    });

    contenedor.appendChild(tarjeta);
  });
}

function filtrarPerfiles(query) {
  const texto = query.toLowerCase().trim();
  const filtrados = profiles.filter(function (perfil) {
    return perfil.name.toLowerCase().includes(texto);
  });
  generarPerfiles(filtrados);
}

function initBuscador() {
  const input = document.getElementById("busqueda-input");
  const boton = document.getElementById("busqueda-boton");

  input.addEventListener("input", function () {
    filtrarPerfiles(input.value);
  });

  boton.addEventListener("click", function (e) {
    e.preventDefault();
    filtrarPerfiles(input.value);
  });

  // Si vienes con ?q=algo, llena el input y filtra automáticamente
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q");
  if (q) {
    input.value = q;
    filtrarPerfiles(q);
  }
}

function loadConfig() {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get("lang") || "ES";

  const script = document.createElement("script");
  script.src = `./conf/config${lang}.json`;
  script.onload = function () {
    initConfig();
    generarPerfiles(profiles);
    initBuscador();
  };

  script.onerror = function () {
    const fallback = document.createElement("script");
    fallback.src = "./conf/configES.json";
    fallback.onload = function () {
      initConfig();
      generarPerfiles(profiles);
      initBuscador();
    };

    document.head.appendChild(fallback);
  };
  document.head.appendChild(script);
}

loadConfig();
