import json
import os
import html as html_lib
from urllib.parse import parse_qs

from beaker.middleware import SessionMiddleware

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_LANG = "ES"
VALID_LANGS = {"ES", "EN", "PT"}


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def load_config(lang):
    lang = lang if lang in VALID_LANGS else DEFAULT_LANG
    return load_json(os.path.join(BASE_DIR, "conf", f"config{lang}.json"))


def load_index():
    return load_json(os.path.join(BASE_DIR, "data", "index.json"))


def load_profile(ci):
    path = os.path.join(BASE_DIR, ci, "profile.json")
    if not os.path.isfile(path):
        return None
    return load_json(path)


def esc(value):
    return html_lib.escape(str(value), quote=True)


def singular_o_plural(textos, valores):
    return textos[0] if len(valores) == 1 else textos[1]


def render_shell(config, lang):
    site = config["site"]
    return f"""<!doctype html>
<html lang="{lang.lower()}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/ATI/css/style.css" />
    <link rel="icon" sizes="32x32" href="/ATI/icon/logo-32x32.png" />
    <title>{esc(site[0] + site[1] + site[2])} 2026-1</title>
    <script src="/ATI/js/app.js" defer></script>
    <script src="/ATI/js/menu.js" defer></script>
  </head>

  <body data-lang="{lang}">
    <header>
      <nav class="nav">
        <a href="/ATI/index.py" class="nav-logo" data-spa>
          <span id="logo-ati">{esc(site[0])}</span>
          <span id="logo-ucv" class="logo-ucv">{esc(site[1])}</span>
          <span id="logo-log">{esc(site[2])}</span>
        </a>

        <div class="buscador">
          <input id="busqueda-input" type="text" placeholder="{esc(config['name'])}" />
          <button id="busqueda-boton" type="submit">{esc(config['search'])}</button>
        </div>

        <div class="nav-perfil">
          <span id="perfil-texto" class="perfil-texto">{esc(config['profile'])}</span>
          <div class="nav-icono">
            <img id="user-icono" src="/ATI/icon/userIcon.svg" alt="{esc(config['profile'])}" class="user-icono" />
          </div>
        </div>

        <div class="selector-idioma">
          <button class="lang-btn" data-lang="ES">ES</button>
          <button class="lang-btn" data-lang="EN">EN</button>
          <button class="lang-btn" data-lang="PT">PT</button>
        </div>

        <button class="menu-ham" aria-label="Menú">
          <img src="/ATI/icon/menuIcon.svg" alt="Menú" />
        </button>
      </nav>
    </header>

    <main id="contenido"></main>

    <footer id="footer">{esc(config['copyRight'])}</footer>
  </body>
</html>"""


def render_index(config, profiles, query=""):
    q = (query or "").strip().lower()
    listado = [p for p in profiles if q in p["name"].lower()] if q else profiles

    cards = []
    for p in listado:
        ci = esc(p["ci"])
        name = esc(p["name"])
        ext = esc(p["image_ext"])
        cards.append(
            f"""<a class="tarjeta-perfil" href="/ATI/index.py?ci={ci}" data-spa data-ci="{ci}">
                <div class="contenedor-img-perfil">
                    <img class="imagen-perfil" src="/ATI/{ci}/{ci}Small{ext}" alt="{name}" />
                </div>
                <div class="contenedor-info-perfil"><p>{name}</p></div>
                <div class="barra-inferior"></div>
            </a>"""
        )

    if not listado:
        cuerpo = f"<p class=\"sin-resultados\">{esc(config['no_results'])} \"{esc(query)}\"</p>"
    else:
        cuerpo = "<section class=\"perfiles\">" + "".join(cards) + "</section>"

    return f"""<h1 class="semestre">{esc(config['semester'])}</h1>
    {cuerpo}"""


def render_profile(config, profile):
    if not profile:
        return "<p class=\"sin-resultados\">Perfil no encontrado.</p>"

    ci = esc(profile["ci"])
    name = esc(profile["name"])
    ext = esc(profile["image_ext"])
    email_template = config["email"].replace(
        "[email]",
        f"<a class=\"correo\" href=\"mailto:{esc(profile['email'])}\">{esc(profile['email'])}</a>",
    )

    return f"""<section class="seccion-principal">
      <div class="contenedor-imagen">
        <img class="foto-perfil" src="/ATI/{ci}/{ci}Big{ext}" alt="{name}" />
      </div>
      <div class="contenedor-info">
        <h1 class="nombre-perfil">{name}</h1>
        <p class="descripcion">{esc(profile['description'])}</p>
        <table class="tabla-perfil">
          <tr>
            <td>{esc(config['color'])}:</td>
            <td>{esc(profile['color'])}</td>
          </tr>
          <tr>
            <td>{esc(singular_o_plural(config['book'], profile['book']))}:</td>
            <td>{esc(', '.join(profile['book']))}</td>
          </tr>
          <tr>
            <td>{esc(singular_o_plural(config['music'], profile['music']))}:</td>
            <td>{esc(', '.join(profile['music']))}</td>
          </tr>
          <tr>
            <td>{esc(singular_o_plural(config['video_game'], profile['video_game']))}:</td>
            <td>{esc(', '.join(profile['video_game']))}</td>
          </tr>
          <tr class="lenguajes-aprendidos">
            <td>{esc(config['language'])}:</td>
            <td>{esc(', '.join(profile['language']))}</td>
          </tr>
        </table>
        <br />
        <span>{email_template}</span>
      </div>
    </section>"""


def json_response(start_response, data, extra_headers=None):
    body = json.dumps(data, ensure_ascii=False).encode("utf-8")
    headers = [
        ("Content-Type", "application/json; charset=utf-8"),
        ("Content-Length", str(len(body))),
        ("Cache-Control", "no-store"),
    ]
    if extra_headers:
        headers.extend(extra_headers)
    start_response("200 OK", headers)
    return [body]


def html_response(start_response, html, extra_headers=None):
    body = html.encode("utf-8")
    headers = [
        ("Content-Type", "text/html; charset=utf-8"),
        ("Content-Length", str(len(body))),
    ]
    if extra_headers:
        headers.extend(extra_headers)
    start_response("200 OK", headers)
    return [body]


def resolve_lang(params, cookies, session):
    lang = (params.get("lang", [None])[0] or "").upper()
    if lang in VALID_LANGS:
        session["lang"] = lang
        session.save()
        return lang
    if "lang" in session and session["lang"] in VALID_LANGS:
        return session["lang"]
    cookie_lang = cookies.get("lang", "").upper()
    if cookie_lang in VALID_LANGS:
        return cookie_lang
    return DEFAULT_LANG


def parse_cookies(environ):
    raw = environ.get("HTTP_COOKIE", "")
    result = {}
    for piece in raw.split(";"):
        if "=" in piece:
            k, v = piece.strip().split("=", 1)
            result[k] = v
    return result


def wsgi_app(environ, start_response):
    params = parse_qs(environ.get("QUERY_STRING", ""))
    cookies = parse_cookies(environ)
    session = environ["beaker.session"]

    lang = resolve_lang(params, cookies, session)
    config = load_config(lang)
    action = (params.get("action", [None])[0] or "").lower()

    cookie_header = (
        "Set-Cookie",
        f"lang={lang}; Path=/; Max-Age=2592000; SameSite=Lax",
    )

    if action == "config":
        return json_response(start_response, {"lang": lang, "config": config}, [cookie_header])

    if action == "list":
        query = params.get("q", [""])[0]
        profiles = load_index()
        html = render_index(config, profiles, query)
        return json_response(start_response, {"html": html, "lang": lang}, [cookie_header])

    if action == "profile":
        ci = params.get("ci", [""])[0]
        profile = load_profile(ci)
        if profile:
            session["last_ci"] = ci
            session.save()
        html = render_profile(config, profile)
        return json_response(start_response, {"html": html, "lang": lang}, [cookie_header])

    ci = params.get("ci", [None])[0]
    if ci:
        profile = load_profile(ci)
        if profile:
            session["last_ci"] = ci
            session.save()
        inner = render_profile(config, profile)
    else:
        query = params.get("q", [""])[0]
        profiles = load_index()
        inner = render_index(config, profiles, query)

    shell = render_shell(config, lang)
    page = shell.replace(
        '<main id="contenido"></main>',
        f'<main id="contenido">{inner}</main>',
    )
    return html_response(start_response, page, [cookie_header])


session_opts = {
    "session.type": "file",
    "session.cookie_expires": True,
    "session.data_dir": "/tmp/sessions",
    "session.auto": True,
    "session.key": "ati_session",
}

application = SessionMiddleware(wsgi_app, session_opts)
