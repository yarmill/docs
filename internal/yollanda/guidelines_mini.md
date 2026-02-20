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
{% set non_garmin_labels = [] %}
{% set watches_module_labels = [] %}
{% for code in external_services_list %}
{% set label = service_name_map[code] %}
{% if code in ["garmin", "apple-health", "polar", "suunto", "polar-team", "whoop"] %}
{% set _ = activity_service_labels.append(label) %}
{% endif %}
{% if code != "garmin" %}{% set _ = non_garmin_labels.append(label) %}{% endif %}
{% if label not in watches_module_labels %}{% set _ = watches_module_labels.append(label) %}{% endif %}
{% endfor %}

## 1) Integrace a synchronizace zařízení

### Společné principy
- Používaná synonyma: hodinky, sporttestery, zařízení.
- Synonyma pro záznamy: záznam, aktivita, data, log.
- Propojení je možné z webové aplikace a z iOS aplikace. Není možné z Android aplikace.
- Propojení může udělat jen sportovec. Trenér ani administrátor ne.
- Po propojení se data ze zařízení synchronizují do Yarmilla automaticky ve chvíli, kdy se zařízení synchronizuje s aplikací daného výrobce. Tzn. že jakmile vidím například aktivitu z Garmin hodinek v Garmin Connect aplikaci, tak se automaticky posílá i do Yarmilla.
- V Yarmillovi se záznamy ukazují v modulu {Skutečnost} u daného dne a případně v relevantních analytických výstupech (například data spánku se zároveň propíšou do reportů v {Analýze ukazatelů regenerace}).
- Nahranou (synchronizovanou) aktivitu nelze aktuálně v Yarmillovi editovat ani smazat.
- Po propojení zařízení, ze kterých chodí informace o aktivitách, je potřeba zkontrolovat, že má sportovec nastavené tepové zóny ({Nastavení} -> {Zóny tepové frekvence}). Toto nastavení je důležité pro správné zobrazovaní detailu aktivit, počítaní a analýzy času stráveného v jednolivých zónách.

### Sportovec
#### Jak zařízení připojit
##### Postup pro propojení ve webové aplikaci
1. Otevři webovou aplikaci Yarmill.
2. V horním panelu klikni na {Nastavení}.
3. Scrolluj dolů na sekci {Aplikace a zařízení}.
4. U vybraného zařízení klikni na tlačítko {Propojit}.
5. Otevře se okno s příhlášením do tvého účtu dané služby/aplikace.
6. Přihlásíš se a potvrdíš propojení s Yarmillem (potvrzuje se předávání dat z dané služby do Yarmilla). U některých služeb je potřeba zaškrtnout i rozsah dat, která se budou do Yarmilla synchronizovat. 
7. Po úspěšném propojení svítí v Yarmillovi u dané integrace tlačítko {Odpojit}.

##### Postup pro propojení v iOS aplikaci
1. Otevři mobilní iOS aplikaci Yarmill.
2. V pravém horním rohu klikni na svého avatara.
3. Vyber možnost {Propojená zařízení a aplikace}.
4. Vyber zařízení/aplikaci, kterou chceš propojit.
5. Klikni na přepínač (toggle switch) pro zapnutí propojení.
6. Otevře se okno s příhlášením do tvého účtu dané služby/aplikace.
7. Přihlásíš se a potvrdíš propojení s Yarmillem (potvrzeuje se předávání dat z dané služby do Yarmilla). U některých služeb je potřeba zaškrtnout i rozsah dat, která se budou do Yarmilla synchronizovat. 
8. Úspěšně propojená zařízení a aplikace mají přepínač zapnutý a na obrazovce s přehledem všech zařízení jsou doplněna šedým nápisem {Connected}.

##### Postup pro odpojení
Stejný jako pro propojení. 
Ve webové aplikaci je u propojených integrací tlačítko {Odpojit}, kterým propojení zrušíš.
V iOS aplikaci je přepínač (toggle switch tlačítko), jeho vypnutí zruší propojení.
Od momentu odpojení se nebudou nová data do Yarmilla synchronizovat.

{% if "polar" in external_services_list %}
#### Polar specifika
- Polar umí ke každé aktivitě posílat také informaci o nastavených tepových zónách.
- Zapnutí/vypnutí přebírání tepových zón přímo z Polaru se zobrazí ve webové aplikaci pod sekcí {Aplikace a zařízení} při propojené integraci s Polarem.
- Při zapnutém přepínači se pro každou aktivitu použijou tepové zóny, které k dané aktivitě pošle Polar (neboli ty, které má uživatel nastavené ve svých hodinkách nebo Polar Flow aplikaci). Zóny nastavené přímo v Yarmillovi se v takovém případě ignorují.
{% endif %}

{% if "apple-health" in external_services_list %}
#### Apple Health specifika
- Apple Health (Apple Watch) nelze propojit z webové aplikace, ale pouze přímo z iOS aplikace.
- Po propojení se v iOS aplikaci na detailu Apple Health propojení zobrazí seznam historických aktivit spolu se statusem - zda byla daná aktivita synchronizovaná do Yarmilla a případně tlačítko {Sync} pro její manuální synchronizaci (manuální synchronizace je potřeba pouze pro historické aktivity před zapnutím propojení).
{% endif %}

{% if "garmin" in external_services_list %}
#### Garmin specifika
- Při propojování Garminu je možné specifikovat (zapnout/vypnout), jaké z následujícíh dat se budou posílat do Yarmilla:
  - Data o aktivitách
  - Data o spánku (health data) - body battery apod.
  - Historická data
- Pro nejlepším možné fungování je vhodné povolit všechny tři typy dat. Bez historických dat nebude možné dotáhnout zpětně ty aktivity a data spánku, které vznikly před propojením.
{% endif %}

#### Dotažení historických dat
- Data se standardně synchronizují od momentu propojení do chvíle, než uživatel propojení zruší (odpojí).
- Dotažení historických dat je možné pro Garmin, Oura Ring a WHOOP. Řešíme ho individuálně. Napiš nám na <support@yarmill.com>.

### Trenér a Admin
- Vidí synchronizovaná data svých sportovců v jejich tréninkovém deníku ({Skutečnosti}) (podle nastavení instance). To platí pro data o aktivitách i o spánku.
- Vidí data také v příslušných analýzách, které je využívají, pokud k nim má přístup (např. {Trendová analýza} nebo {Analýza ukazatelů regenerace}).

### Troubleshooting / Problémy

#### Nevidím aktivitu / Nesynchronizují se data
- Zkontroluj, že se díváš do {Skutečnost} a na správný datum.
- Zkontruj, zda je propojení zapnuté v {Nastavení}.
- Zkontroluj, zda je daný záznam synchronizovaný ze zařízení (hodinek, prstýnku, ...) do příslušné zdrojové aplikace (např.: v Garmin Connect pro Garmin zařízení, Polar Flow pro Polar zařízení atd.). Záznamy se musí vždy nejprve synchronizovat ze zařízení do do příslušné aplikace výrobce zařízení a až následně se automaticky synchronizují do Yarmilla.

#### Nevidím historická data
- Standardně se synchronizují pouze data, která vznikla od momentu propojení.
- Synchronizaci (dotažení) starších záznamů popisuje sekce #dotažení-historických-dat.

#### Jak smažu synchronizovanou aktivitu
- Nahranou (synchronizovanou) aktivitu nelze aktuálně v Yarmillovi ani editovat ani smazat.

#### Moje zařízení není v seznamu
- To nás zajímá. Napiš nám o něm na <support@yarmill.com>, abychom ho mohli přidat. Seznam integrací neustále rozšiřujeme.

#### Jiný problém nebo se mi nedaří vyřešit
- Napiš nám na <support@yarmill.com>. Hodně pomůže, když problém co nejvíc popíšeš (o jaké aktivity se jedná, ze kdy jsou, screenshot z aplikace, kde jsou vidět apod.). Ozveme se zpět typicky během pár minut.

---

## 2) Přístup, přihlášení a URL týmu

### Společné principy
- Yarmill funguje na principu samostatných instancí pro každý tým.
- Instance znamená samostatná verze, samostatný workspace, který je nakonfigurovaný na míru daného sportu a podle požadavků a metodiky konkrétního týmu.
- Každá instance Yarmilla má svou vlastní URL (například csb.yarmill.com, sigma.yarmill.com apod.).
- Tým se tady rozumí sportovní svaz, federace, rezortní sportovní organizace nebo klub (typicky v případě fotbalu a kolektivních sportů).
- Trenéři, sportovci, fyzioterapeuti a další uživatelé se vždy přihlašují do své instance Yarmilla, nebo instance jejich týmu (svazu, klubu).
- URL týmu znamená právě specifickou URL adresu, na které je instance Yarmilla daného týmu.
- Uživatelé potřebují znát URL svého týmu, aby se mohli do svého Yarmilla přihlásit.
- Každý uživatel dané instance musí být pozvaný administrátorem. Yarmill funguje jako uzavřená aplikace – administrátoři týmu určují, koho do aplikace pozvou. Není možné se sám od sebe registrovat.
- Yarmill nefunguje v tomto jako veřejně dostupné aplikace, které stačí stáhnout, nainstalovat, zaregistrovat se a používat. Ani jako veřejné webové aplikace, kam si může každý vytvořit účet a používat je. To není možné vzhledem k velice specifickému nastavení pro každý tým.

{% if available_languages %}
### Lokalizace (jazykové mutace)
- Dostupné jazyky: {{ available_languages | join(", ") }}.
- Jazyky lze přepínat přes uživatelské menu (kliknutím na avatara). 
- Mobilní aplikace přebírá automaticky jazyk telefonu, pokud je tento v seznamu dostupných jazyků.
{% endif %}

### URL týmu
- URL týmu je webová adresa, na které běží instance Yarmilla pro daný tým.
- Každý uživatel dostane informaci o URL svého týmu v emailu s potvrzením registrace.
- URL týmu se skládá typicky z názvu nebo zkratky daného klubu/svazu následované doménou Yarmilla (yarmill.com), tedy obecně https://nazev-tymu.yarmill.com.

### Registrace
- Yarmill funguje jako uzavřená aplikace. Každý uživatel musí být pozvaný. Není možné se sám od sebe registrovat bez pozvánky.
- Pozvánku do Yarmilla (dané instance Yarmilla) pro trenéry, sportovce i další uživatele posílá administrátor instance.
- Registrace probíha skrz pozvánku, kterou uživatel dostane emailem.
- V pozvánce kliká na tlačítko pro registraci (přidání se k danému týmu) a tím se dostává do webového registračního formuláře.
- V rámci registrace každý uživatel schvaluje licenční podmínky (tzv. EULA), vyplňuje základní informace, nastavuje si avatara a heslo pro přístup do Yarmilla.
- Po dokončení registrace přijde uživateli potvrzovací email, kde je uvedená také URL týmu.
- Pozvánka k registraci má omezenou platnost. Pokud ji uživatel prošvihne, nebude mu registrace povolena a musí napsat adminovi, aby mu pozvánku obnovil.

### Přihlášení
- Přihlášení funguuje pouze pro registrované uživatele (tedy ty, kteří byli pozvaní a dokončili registrační proces).
- Pro přihlašování do Yarmilla je nutné znát URL týmu, do kterého se chce uživatel přihlásit.
- Jako přihlašovací údaje se používá email (ten, na který uživatel obdržel pozvánku a potvrzení registrace) a heslo, které si uživatel nastavil během registrace.

#### Postup pro přihlášení do webové aplikace Yarmill
1. Ve webovém prohlížeči zadej celou URL týmu (do adresního řádku). Druhou možností je otevřít web Yarmilla na https://yarmill.com, kliknout na Přihlásit se a následně doplnit předvyplněnou URL týmu (předvyplněná je závěrečná část ".yarmill.com").
2. Otevře se přihlašovací obrazovka dané instance (daného týmu).
3. Vyplň email a heslo (přihlašovací údaje, které znáš z registrace) a potvrď.
- Z aplikace není nutné se odhlašovat. Do odhlášení zůstane Yarmill na daném počítači přihlášený a není tak nutné při zavření a znovuotevření zadávat přihlašovací údaje znovu.

#### Postup pro přihlášení do mobilní aplikace Yarmill
- Mobilní aplikace funguje pouze pro sportovce. Trenéři, admini a další uživatelé používají pouze webovou verzi Yarmilla.
1. Otevři mobilní aplikaci na iOS nebo Android zařízení.
2. V prvním kroku zadej URL týmu. (Počáteční "https://" část, ani koncová ".yarmill.com" část, která už je fixně předvyplněna, se nezadává. Sportovec doplňuje pouze tu část se zkratkou/názvem týmu.)
3. Ukáže se přihlašovací obrazovka s názvem tvého týmu (podle zadané URL týmu).
4. Vyplň email a heslo (přihlašovací údaje, které znáš z registrace) a potvrď.

### Používání Yarmilla z mobilu
- Nativní mobilní aplikace pro iOS a Android zařízení je určena pouze pro sportovce. Trenéři ani admini se do ní nepřihlásí.
- Mobilní aplikace je omezena funkcionalitou na pouze základní nahlížení do tréninkového plánu a efektivní zapsání tréninku a poznámek pro dnešní den. Nelze dopisovat tréninky zpětně.
- Pro plnou funkcionalitu Yarmill platformy na mobilu, a jako doporučená varianta používání Yarmilla z mobilu pro trenéry a adminy, je uložení webové verze na plochu mobilu:
  - Otevři si Yarmilla z mobilního webového prohlížeče (ideálně Chrome nebo Safari).
  - Klikni na sdílení a vyber volbu Přidat na plochu.
  - Videa, jak to udělat, jsou tady: 
    - Android: https://www.youtube.com/watch?v=TtfqcqjDnOc
    - iOS: https://www.youtube.com/watch?v=OP6GCmI1Qj4
  - Na ploše mobilu se objeví ikona Yarmilla mezi dalšími aplikacemi.
  - Yarmill je na toto použití přizpůsobený a nahrazuje to nativní mobilní aplikaci.

### Troubleshooting / Řešení problémů

#### Zapomenuté heslo
- Heslo lze kdykoli jednoduše vyresetovat (nastavit nové).
1. Jdi na přihlašovací obrazovku Yarmilla (viz Přihlášení).
2. Pod políčkama pro přihlašovací údaje je volba {Zapomenuté heslo}.
3. Zadej svůj email, který používáš pro přihlášení do Yarmilla, a potvrď.
4. Na daný email ti přijdou pokyny pro nastavení nového hesla.

#### Neznám e-mail
- Přihlašovací email je ten, na který ti přišla pozvánka k registraci do Yarmilla.
- Pokud email nevíš, musíš požádat admina nebo tvého trenéra, aby se podívali do Yarmilla a sdělili ti ho.

#### Nevím URL týmu
- URL týmu najdeš v emailu s potvrzením registrace do Yarmilla.
- Typicky se skládá z názvu nebo zkratky daného klubu/svazu následované doménou Yarmilla (yarmill.com), tedy obecně https://nazev-tymu.yarmill.com.
- Pokud URL týmu nenajdeš, napiš nám na <support@yarmill.com> a popiš, do jakého svazu nebo klubu patříš (jaký sport děláš).

#### Jiný problém / Nevím si rady
- Napiš nám na <support@yarmill.com>. Snažíme se odpovědět typicky během pár minut.

### Administrace přístupů
- Admin je jediná role, která může spravovat uživatele. To znamená především:
  - zvát nové uživatele,
  - obnovovat pozvánky,
  - měnit přihlašovací emaily.
- Admin, ani nikdo, jiný nemůže měnit a resetovat hesla. To může udělat pouze každý uživatel sám pro sebe.

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
#### {% if item.get("link_token") %}[{{ title }}]({{ item.get("link_token") }}){% else %}{{ title }}{% endif %}
{% endfor %}
{% endif %}
{% if header_navigation_overview.analytics %}

#### Analytika (přehled dashboardů)
{% for item in header_navigation_overview.analytics %}
- {% if item.get("link_token") %}[{{ item.get("title") }}]({{ item.get("link_token") }}){% else %}{{ item.get("title") }}{% endif %}
{% endfor %}
{% endif %}
{% if header_navigation_overview.evidence %}

#### Evidence / tabulky
{% for title, item in header_navigation_overview.evidence.items() %}
- {% if item.get("link_token") %}[{{ title }}]({{ item.get("link_token") }}){% else %}{{ title }}{% endif %}
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
{% for page_code, page_data in dash_data["pages"].items() %}
- {% if page_data.get("link_token") %}[{{ page_data.get("name") or page_code }}]({{ page_data.get("link_token") }}){% else %}{{ page_data.get("name") or page_code }}{% endif %}{% if page_data.get("description") %} — {{ page_data.get("description") }}{% endif %}
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
Integrace hodinek a služeb ({% if watches_module_labels %}{{ watches_module_labels | join(", ") }}.{% else %}Garmin, Polar, WHOOP, Oura, Suunto, Apple Health atd.{% endif %}). Importovaná data se propisují do **Skutečnosti** (případně **Analytiky** pokud nad danými daty existuje) ale nenahrazují vyplnění levé/pravé strany.
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
