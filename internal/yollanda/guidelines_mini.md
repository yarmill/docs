# General guidelines

{% set service_name_map = {
  "oauth-acbaluo": "AC Baluo",
  "apple-health": "Apple Health",
  "dexcom": "Dexcom",
  "garmin": "Garmin",
  "oura": "Oura",
  "polar": "Polar",
  "polar-team": "Polar Team Pro",
  "suunto": "Suunto",
  "whoop": "WHOOP"
} %}
{% set external_services_list = external_services | default([], true) %}
{% set activity_service_labels = [] %}
{% set non_garmin_activity_labels = [] %}
{% set watches_module_labels = [] %}
{% for code in external_services_list %}
{% if code in ["garmin", "apple-health", "polar", "suunto", "polar-team", "whoop"] %}
{% set label = service_name_map[code] %}
{% set _ = activity_service_labels.append(label) %}
{% if code != "garmin" %}{% set _ = non_garmin_activity_labels.append(label) %}{% endif %}
{% if label not in watches_module_labels %}{% set _ = watches_module_labels.append(label) %}{% endif %}
{% endif %}
{% if code == "oura" and service_name_map[code] not in watches_module_labels %}{% set _ = watches_module_labels.append(service_name_map[code]) %}{% endif %}
{% if code in ["oauth-acbaluo", "dexcom"] and service_name_map[code] not in watches_module_labels %}{% set _ = watches_module_labels.append(service_name_map[code]) %}{% endif %}
{% endfor %}

## 1) Integrace a synchronizace zařízení

### Společné principy
- Propojení se dělá ve webové aplikaci: **Nastavení → (dole) Aplikace a zařízení / Integrace → Propojit**.
- Data ze zařízení se po synchronizaci objeví ve **Skutečnosti** daného dne (podle integrace).
- **Pozor:** data z hodinek **nenahrazují** vyplňování **levé (textové)** ani **pravé (datové)** strany deníku.
- Nahranou aktivitu nelze v Yarmillovi editovat ani smazat. Smazat ji musíš v aplikaci poskytovatele ({% if activity_service_labels %}{{ activity_service_labels | join(", ") }} atd.{% else %}Garmin Connect, Polar Flow, WHOOP atd.{% endif %}).

### Sportovec
#### Jak zařízení připojit
1. Otevři webovou aplikaci Yarmill.
2. V horním panelu klikni **Nastavení**.
3. Sjeď dolů na integrace a u vybraného zařízení klikni **Propojit**.
4. Přihlásíš se do účtu dané služby a potvrdíš propojení.

#### Co když nevidím aktivitu / data?
- Zkontroluj, že:
  - propojení je aktivní (v Nastavení),
  - telefon/zařízení se opravdu synchronizovalo ({% if activity_service_labels %}např. {{ activity_service_labels | join(" / ") }}…{% else %}např. Garmin Connect / Polar Flow / WHOOP…{% endif %}),
  - díváš se ve **Skutečnosti** na správný den.
- Pokud chceš dotáhnout data **zpětně** (historicky), řeší se to podle integrace (viz níže).

{% if "garmin" in external_services_list %}
#### Garmin (důležité body)
- Umíme dotáhnout i **historická data**, ale typicky je potřeba:
  - mít v propojení povolená **Historická data**,
  - a dát nám vědět na **hello@yarmill.com**, že o dotažení stojíš.
- Integrujeme trénink/závod i **zdravotní data** (Garmin Health). Pokud s hodinkami spíš, uvidíš i data o spánku – je nutné povolit propojení pro příslušný typ dat.
- Propojení můžeš později zrušit i v Garmin Connect.
{% endif %}

{% if non_garmin_activity_labels %}
#### {{ non_garmin_activity_labels | join(" / ") }}
- Pro tyto poskytovatele je postup stejný: **Nastavení → Propojit → potvrdit u poskytovatele**.
- Pokud se data přestala posílat nebo se nezobrazují, ověř nejdřív stav propojení v Nastavení a synchronizaci v aplikaci poskytovatele.
{% endif %}

### Trenér
- Trenér obvykle **vidí importovaná data** sportovce ve Skutečnosti (podle nastavení instance).
- Pokud sportovec hlásí, že se data nezobrazují: kontrola propojení + synchronizace + správný den ve Skutečnosti.
{% if "garmin" in external_services_list %}
- U Garminu: historická data → často vyžaduje **support** (hello@yarmill.com).
{% endif %}

### Admin
- Admin řeší hlavně:
  - kdo má povolené integrace,
  - zda je potřeba něco “zapnout” na úrovni instance,
  - eskalaci problémů na **hello@yarmill.com**.

---


---

## 2) Přístup, přihlášení a URL týmu

### Společné principy
- Přihlášení vyžaduje být součástí **týmu**, který Yarmill používá.
- Pro mobilní aplikaci sportovce je často potřeba zadat **URL týmu** (identifikátor instance): **{{ team_url }}**.
{% if available_languages %}
- Dostupné jazyky: {{ available_languages | join(", ") }}. Lze přepnout v profilu (avatar vpravo nahoře) nebo v mobilní aplikaci v nastavení.
{% endif %}

### Sportovec
#### Jak se dostanu do Yarmillu poprvé
- Pokud ti přišla pozvánka e-mailem, klikni na **Přidat se** a dokonči registraci (datum narození, heslo, avatar).

#### Zapomenuté heslo
- Na přihlašovací obrazovce klikni **Zapomenuté heslo** a zadej e-mail → přijde odkaz na nové heslo.

#### Neznám e-mail / neznám URL týmu
- Pokud nevíš e-mail: požádej trenéra/admina, aby ti ho sdělil.
- Pokud neznáš URL týmu: najdeš ho v potvrzovacím mailu; typicky je to zkratka svazu/klubu. Když ne, napiš na **hello@yarmill.com**.

#### Mobilní aplikace (sportovec)
- Aplikace je **pouze pro sportovce**.
- Umožní:
  - vidět denní plán,
  - vyplnit data pro **dnešní den**.
- **Zpětný zápis v mobilu zatím nejde.**

### Trenér
- Pokud sportovec nezná e-mail/URL: trenér (dle práv) často umí dohledat údaje v seznamu uživatelů / ve skupině, jinak eskalovat na admina.

### Admin
- Admin:
  - posílá pozvánky,
  - spravuje uživatele,
  - může měnit přihlašovací e-mail uživatele,
  - řeší nefunkční přístupy (případně přes support).

---

## 3) Plán ↔ Skutečnost (kopírování, import, publikace)

### Společné principy
- **Plán** připravuje trenér (nebo admin), sportovec ho typicky neupravuje.
- **Skutečnost** je evidence toho, co se reálně stalo (levá + pravá strana).
- Kopírování může mít různé významy:
  - sportovec: **Kopírovat plán do skutečnosti** (když splnil přesně)
  - trenér/admin: **Kopírovat plán** (publikace/rozeslání plánu sportovcům)
{% if copy_plan_to_reality %}
- **Kopírovat plán do skutečnosti** můžeš použít, když jsi trénink splnil přesně podle plánu.{% if copy_plan_days_valid %} Lze to provést až {{ copy_plan_days_valid }} dní od plánovaného dne.{% endif %}
{% endif %}

### Sportovec
#### Když jsem splnil trénink přesně podle plánu
- Ve Skutečnosti použij **Kopírovat plán do skutečnosti** (tlačítko bývá v levé části, často pod **třemi tečkami**).
- Pak doplň případně poznámku/přílohu a vyplň číselné hodnoty v pravé (datové) části.

### Trenér
#### Aby sportovci viděli změny v plánu
- **Pozor:** dokud změny v plánu **nezkopíruješ sportovcům**, sportovci je neuvidí.
- Postup: **Plán → (pravý horní roh) Kopírovat plán → vybrat sportovce/skupiny → potvrdit**.

#### Režimy úprav plánu (zjednodušeně)
- Týdenní úpravy (dny) – text + data
- Motivační struktura (mezocyklus/týden/den)
- Top-down (sezónní plánování)
- Roční plán (datová část celé sezóny)

### Admin
- Admin má editor přístup napříč instancí a řeší:
  - nastavení, kdo může plánovat/evidovat,
  - případné workflow kolem “Docházky” (pokud je aktivní).

---

## 4) Zápis do deníku a tabulek (kam co napsat)

### Společné principy
- **levá (textová)** strana = slovní/strukturovaný zápis parametrů, které sleduje tým
- **pravá (datová)** strana = číselné hodnoty, jednotky, metriky
- Konkrétní metodika (co přesně kam patří) se liší podle týmu.
{% if backfill_scope_list and backfill_days is not none %}
{% set labels = [] %}
{% for role in backfill_scope_list %}
{% if role == "athlete" %}{% set _ = labels.append("sportovci") %}{% endif %}
{% if role == "coach" %}{% set _ = labels.append("trenéři") %}{% endif %}
{% if role == "admin" %}{% set _ = labels.append("admini") %}{% endif %}
{% endfor %}
- Zpětný zápis do deníku mohou {% if labels|length == 1 %}{{ labels[0] }}{% elif labels|length == 2 %}{{ labels[0] }} a {{ labels[1] }}{% else %}{{ labels[:-1]|join(", ") }} a {{ labels[-1] }}{% endif %}{% if backfill_days == -1 %} a je možný bez časového omezení.{% else %} a je možný až {{ backfill_days }} dní zpětně.{% endif %}
{% endif %}

### Popisy aktivit - kam a jak zapisovat aktivity a poznámky do Yarmilla

Níže jsou dostupná pole v Yarmillu (pravá i levá strana). Slouží k evidenci jednotlivých tréninků, kam je zapisovat a jak je rozdělit do správných polí. Některá pole nejsou uživatelsky editovatelná, počítají se automaticky.
Levá strana je určena pro poznámky a popisy aktivit, pravá strana pro čísla jako čas, vzdálenost, opakování apod. Některá číselná pole se ale mohou objevit i na levé straně. Rozhodující je seznam níže.
Uživatelé mají zapisovat aktivity do odpovídajících polí. Pokud přesné pole neexistuje, použijte nejbližší podobné nebo \"jiné\", pokud je dostupné (viz seznam níže).
Při dotazech na význam zkratek je následující seznam často zdrojem pro správnou odpověď.

{{ activity_descriptions }}

### Sportovec
#### Zápis ve webu
1. Jdi do **Skutečnost**.
2. Vyber správný týden/den.
3. Přes **tři tečky** můžeš přidat poznámku nebo přílohu.
4. Doplň levou i pravou stranu podle požadavků týmu.

#### Zápis v mobilní aplikaci
- V mobilu lze vyplnit jen **dnešní den**.
- Tlačítko **Přidat** otevře parametry levé strany, **Aktivity** otevřou pravou stranu.

#### Volno / nemoc / zdravotní omezení
- Pokud má tým ukazatele v pravé části (např. nemoc, volno, omezení), používej je – správně se to projeví i v přehledech (např. docházka/reporty).

### Trenér
- Evidence může být:
  - sportovec zapisuje sám,
  - trenér zapisuje (za skupinu/jednotlivce) podle práv.
- Pokud sportovec tápe “kam to napsat”, odkaž ho na týmovou metodiku nebo konkrétní příklad.

### Admin
- Admin může rozhodovat, jaké parametry se sledují (podle konfigurace instance) a kdo má práva zapisovat.

## 5) Zkratky, metriky a významy (HRV, RPE, TRIM, zóny…)

### Společné principy
- Význam zkratek bývá často **týmový** (liší se podle sportu a metodiky).
- Některé metriky jsou obecné (HRV, RPE, zóny), ale jejich použití v Yarmillu závisí na konfiguraci instance.

### Sportovec
- Pokud se ptáš “co znamená zkratka X v tabulce”, nejrychlejší je:
  - zkontrolovat týmovou legendu/metodiku,
  - nebo se zeptat trenéra (pokud jde o interní zkratky).

### Trenér / Admin
- Doporučení: mít v instanci krátký “slovník” (nebo legendu v Nápovědě), protože dotazy na zkratky jsou velmi časté.

---

## 6) Export, tisk a sdílení

### Sportovec
- Exporty typu “všechna data / deník” – podle toho, co je ve vaší instanci zapnuté.
- Sdílení souborů: přilož je k tréninku, ve webu je najdeš v **Soubory**.

### Trenér / Admin
- **Hodnocení RTC** lze stáhnout v **XLS nebo PDF** (pokud je modul aktivní).
- Analytické reporty lze stáhnout v PDF.
- Jiné výstupy (speciální reporty, hromadné exporty) lze řešit pouze přes **hello@yarmill.com**.
{% if season_evaluation_enabled %}
- Hodnocení sezóny lze stáhnout v XLS/PDF (dle práv).
{% endif %}

---

## 7) Role, oprávnění a soukromí

### Role (rychlé shrnutí)
- **Sportovec:** vidí svůj plán, zapisuje svůj trénink, přidává poznámky/přílohy, vidí svou analýzu.
- **Trenér:** vidí své skupiny, plánuje, publikuje plány, eviduje, docházka, analytika (dle práv), kartotéka.
- **Admin:** plná editace instance, uživatelé, skupiny, oprávnění.

### Sportovec
- U citlivých dat (zdravotní info, menstruace): viditelnost záleží na nastavení instance a rolích. Pokud chceš ověřit “kdo to uvidí”, obrať se na trenéra/admina.

### Trenér / Admin
- **Udělení pravomocí:** Nastavení → Skupiny → vybrat skupinu → u uživatele nastavit právo (čtení / zápis).
- **Správa uživatelů:** Admin v Nastavení → Uživatelé (pozvání, deaktivace, změna e-mailu, náhled práv).

---

## 8) Navigace v aplikaci a UI (kde co najdu)

### Společné principy
- Horní panel = hlavní moduly (Skutečnost / Plán / Analytika / Docházka / Ostatní / Nastavení… podle instance).
- Profil menu (avatar vpravo nahoře) může obsahovat: odhlášení, změna hesla, tipy a triky, nápověda.
{% if header_navigation_overview %}

### Přehled hlavní navigace
{% if header_navigation_overview.navigation %}
{% for title, item in header_navigation_overview.navigation.items() %}
#### {{ title }}
{% endfor %}
{% endif %}
{% if header_navigation_overview.analytics %}

#### Analytika (přehled dashboardů)
{% for title in header_navigation_overview.analytics %}
- {{ title }}
{% endfor %}
{% endif %}
{% if header_navigation_overview.evidence %}

#### Evidence / tabulky
{% for title, item in header_navigation_overview.evidence.items() %}
- {{ title }}
{% endfor %}
{% endif %}
{% endif %}

### Sportovec
- V mobilu: po otevření vidíš **dnešní plán**, dole můžeš přepnout na **Plán** pro další dny.
- Pokud nevidíš některou sekci, může to být:
  - vypnuté pro tvoji instanci,
  - nebo nemáš odpovídající roli/práva.

### Trenér / Admin
- Když sportovec hlásí “nemám to v horní liště”: ověřte, zda je modul zapnutý pro instanci a zda má uživatel práva.

---

## 9) Analytika, grafy a “proč to nevidím”

### Společné principy
- Analytika je **individuální** pro každou instanci (svaz/tým).
- Ne všechny metriky/moduly jsou dostupné všem rolím.

### Sportovec
- Standardně vidíš své přehledy v **Analytika → Analýza dat tréninku** (pokud je aktivní).

### Trenér / Admin
- Trenér/admin může přepínat sportovce (dle práv).
- Pokud “chybí grafy / analytika”, typicky jde o:
  - modul není aktivní pro instanci,
  - uživatel nemá práva,
  - nebo chybí vstupní data (nezapsaná levá/pravá strana, nebo integrace nedodává to, co čekáte).
{% if analytics_overview %}

### Přehled dostupné analytiky
{% for dash_title, dash_data in analytics_overview.items() %}
#### {{ dash_title }}
{% for page_title, page_data in dash_data["pages"].items() %}
- {{ page_title }}{% if page_data.get("description") %} — {{ page_data.get("description") }}{% endif %}
{% endfor %}
{% endfor %}
{% endif %}

---

## 10) Yollanda — co umí a neumí

### Summary
#### Co Yollanda umí (v kontextu Yarmillu)
- Radit s používáním aplikace (navigace, postupy, kde co najdeš).
- Vysvětlit workflow (plán/skutečnost, integrace, soubory…).
- V beta režimu: hledání informací v tréninku (dle nasazení – často hlavně levá strana).

#### Co Yollanda neumí / kdy přesměrovat
- “Zapiš to automaticky do systému za mě” – pokud to není podporované, vysvětlit omezení a nabídnout nejbližší postup.
- Off-topic dotazy – krátce odpovědět nebo přesměrovat zpět na Yarmill.
- Požadavky na změny v instanci / zapínání modulů → často na **admina** nebo **hello@yarmill.com**.

### Details
[[yollanda]]

---

# Přehled modulů

{% if modules.get("plan") %}
## {{ modules["plan"] }}
Tvorba a úprava tréninkových plánů pro jednotlivce nebo skupiny (levá **textová** část + pravá **datová** část). Trenér/admin musí použít **Kopírovat plán**, aby se změny zobrazily sportovcům.
{% endif %}

{% if modules.get("reality") %}
## {{ modules["reality"] }}
Záznam tréninku (co se reálně stalo): levý **textový** zápis + pravé **datové** hodnoty, včetně poznámek a příloh. Obsahuje **Import plánu** (Plán → Skutečnost), když trénink odpovídá plánu.
{% endif %}

{% if modules.get("evidence") %}
## {{ modules["evidence"] }}
Profilové a osobní údaje využívané týmem (např. identifikátory, informace o sportovci, ID pro testování). Jaká pole jsou k dispozici a kdo je může upravovat, závisí na nastavení instance a oprávněních.
{% endif %}

{% if modules.get("planner") %}
## {{ modules["planner"] }}
Sdílený sezónní kalendář událostí (závody, soustředění, schůzky, testy). Trenéři/admini mohou spravovat účastníky; hlavní admin instance může události zamykat.
{% endif %}

{% if modules.get("attendance") %}
## {{ modules["attendance"] }}
Docházka pro plánované tréninkové dny. Sleduje přítomnost/omluvu a umožňuje **kopírovat plán do Skutečnosti** podle docházky (pokud je modul zapnutý a tým ho používá).
{% endif %}

{% if modules.get("analytics") %}
## {{ modules["analytics"] }}
Grafy a souhrny z vyplněných tréninků a integrovaných dat. Viditelnost a dostupné metriky se liší podle role a nastavení týmu.
{% endif %}

{% if modules.get("season-evaluation") %}
## {{ modules["season-evaluation"] }}
Vyhodnocení sezóny/ročního cyklu (plán vs. skutečnost napříč sportovci/skupinami), často včetně porovnání trendu a exportů (XLS/PDF), pokud je zapnuto.
{% endif %}

{% if modules.get("files") %}
## {{ modules["files"] }}
Všechny tréninkové přílohy na jednom místě (z Plánu i Skutečnosti). Stahování, přejmenování, mazání a možnost skočit přímo na den, ke kterému soubor patří.
{% endif %}

{% if modules.get("tabulars") %}
## {{ modules["tabulars"] }}
Vlastní tabulky pro výsledky a testy (závody, laboratorní testy, průběžné kontroly). Strukturu určuje tým; záznamy lze později využít v reportech/analytice.
{% endif %}

{% if modules.get("goals") %}
## {{ modules["goals"] }}
Sezónní cíle a klíčové výsledky (KR): nastavování cílů, sledování stavu a progresu, komentáře/feedback a přepínání mezi sezónami.
{% endif %}

{% if modules.get("medical") %}
## {{ modules["medical"] }}
Zdravotní a wellness záznamy a citlivé informace (např. nemoc, omezení). Přístup je řízen oprávněními a může být omezen jen na vybrané role.
{% endif %}

{% if modules.get("watches") %}
## {{ modules["watches"] }}
Integrace hodinek a služeb ({% if watches_module_labels %}{{ watches_module_labels | join(", ") }} atd.{% else %}Garmin, Polar, WHOOP, Oura, Suunto, Apple Health atd.{% endif %}). Importovaná data se propisují do **Skutečnosti** (případně **Analytiky** pokud nad danými daty existuje) ale nenahrazují vyplnění levé/pravé strany.
{% endif %}

{% if modules.get("sport-theory") %}
## {{ modules["sport-theory"] }}
Znalostní část k tréninkové metodice (zóny, terminologie, fyziologie) používaná v rámci týmu. Obsah může být specifický pro danou instanci.
{% endif %}

{% if specific_guidelines %}

---

# Specifické metodiky

{{ specific_guidelines }}
{% endif %}
