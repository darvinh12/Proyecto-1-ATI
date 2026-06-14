const API = "/ATI/index.py";
const contenido = document.getElementById("contenido");

function setActiveLang(lang) {
    document.querySelectorAll(".lang-btn").forEach((b) => {
        b.classList.toggle("activo", b.dataset.lang === lang);
    });
    document.body.dataset.lang = lang;
}

async function loadConfig(lang) {
    const r = await fetch(`${API}?action=config&lang=${lang}`, { credentials: "same-origin" });
    return r.json();
}

function applyConfig(config) {
    document.getElementById("logo-ati").textContent = config.site[0];
    document.getElementById("logo-ucv").textContent = config.site[1];
    document.getElementById("logo-log").textContent = config.site[2];
    document.getElementById("busqueda-input").placeholder = config.name;
    document.getElementById("busqueda-boton").textContent = config.search;
    document.getElementById("perfil-texto").textContent = config.profile;
    document.getElementById("user-icono").alt = config.profile;
    document.getElementById("footer").textContent = config.copyRight;
}

async function loadList(query = "", lang) {
    const url = new URL(API, location.origin);
    url.searchParams.set("action", "list");
    if (query) url.searchParams.set("q", query);
    if (lang) url.searchParams.set("lang", lang);
    const r = await fetch(url, { credentials: "same-origin" });
    const data = await r.json();
    contenido.innerHTML = data.html;
    document.title = "ATI[UCV]Log 2026-1";
}

async function loadProfile(ci, lang) {
    const url = new URL(API, location.origin);
    url.searchParams.set("action", "profile");
    url.searchParams.set("ci", ci);
    if (lang) url.searchParams.set("lang", lang);
    const r = await fetch(url, { credentials: "same-origin" });
    const data = await r.json();
    contenido.innerHTML = data.html;
    const nombre = contenido.querySelector(".nombre-perfil");
    if (nombre) document.title = nombre.textContent;
}

function pushUrl(params) {
    const url = new URL(API, location.origin);
    Object.entries(params).forEach(([k, v]) => {
        if (v) url.searchParams.set(k, v);
    });
    history.pushState(params, "", url.pathname + url.search);
}

async function navegar(params, push = true) {
    const lang = document.body.dataset.lang;
    if (params.ci) {
        await loadProfile(params.ci, lang);
    } else {
        await loadList(params.q || "", lang);
    }
    if (push) pushUrl(params);
    window.scrollTo({ top: 0, behavior: "instant" });
}

function initSPA() {
    setActiveLang(document.body.dataset.lang || "ES");

    document.addEventListener("click", (e) => {
        const link = e.target.closest("a[data-spa]");
        if (!link) return;
        e.preventDefault();
        const url = new URL(link.href);
        const ci = url.searchParams.get("ci");
        const q = url.searchParams.get("q");
        navegar({ ci, q });
    });

    const input = document.getElementById("busqueda-input");
    const boton = document.getElementById("busqueda-boton");

    boton.addEventListener("click", function (e) {
        e.preventDefault();
        navegar({ q: input.value.trim() });
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            navegar({ q: input.value.trim() });
        }
    });

    document.querySelectorAll(".lang-btn").forEach((b) => {
        b.addEventListener("click", async () => {
            const lang = b.dataset.lang;
            setActiveLang(lang);
            const data = await loadConfig(lang);
            applyConfig(data.config);
            const params = new URLSearchParams(location.search);
            const ci = params.get("ci");
            const q = params.get("q") || "";
            if (ci) await loadProfile(ci, lang);
            else await loadList(q, lang);
        });
    });

    window.addEventListener("popstate", () => {
        const params = new URLSearchParams(location.search);
        navegar({ ci: params.get("ci"), q: params.get("q") }, false);
    });
}

initSPA();
