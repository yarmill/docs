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
- Admin, ani nikdo jiný, nemůže měnit a resetovat hesla. To může udělat pouze každý uživatel sám pro sebe.

---

## 3) Plán ↔ Skutečnost (kopírování, import, publikace)

### Společné principy
- Tréninkový plán (někdy označovaný jako tréninkový program) je v gesci trenérů (případně adminů). Sportovec plán měnit nemůže.
- To, jak trénink reálně proběhl (co sportovec odtrénoval a jak) se eviduje v modulu {Skutečnost} – ten se často označuje jako tréninový deník nebo tréninková evidence.
- Struktura plánu i tréninkové skutečnosti je téměř identická a v týdenním zobrazení se dělí na:
  - slovní popis obsahu (náplně) tréninku - občas označované jako tzv. levá strana - a
  - číselné zaznamenání - tzv. pravá strana, která obsahuje sadu obecných (OTU) a specifických (STU) tréninkových ukazatelů, které trénink kvantifikují časem, počtem, kilometrama apod.
  - tréninková skutečnost může navíc obsahovat položky pro pocitové hodnocení sportovce apod.
- Struktura textové části (levá strana) strany i sada ukazatelů (pravá strana) jsou nastavené specificky pro danou instanci Yarmilla.
- Kopírování může mít různé významy:
  - Trenér a admin můžou kopírovat plán od skupiny k jednotlivým sportovcům (rozeslání/publikace plánu), ale také k jiným skupinám, do jiného týdne apod.
  - Sportovec kopírováním plánu typicky myslí import plánu do skutečnosti - tato možnost musí být administrátorem povolená a závisí to na konkrétní instanci. V konfiguraci dané instance je také počet dní, po které lze tuto funkčnost zpětně použít (například 3 dny znamená, že sportovec může možnost zkopírování plánu do skutečnosti použít pouze pro dnešek a tři dny zpětně. Starší dny už nebude moci importovat z plánu.
  
{% if copy_plan_to_reality %}
- Sportovec může pro usnadnění/urychlení zápisu deníku použít volbu {Import plánu}, která zkopíruje data pro daný den z pláno do deníku (skutečnosti). Typické použití je, když sportovec trénink splnil podle plánu nebo jen s mírnou změnou oproti plánu. Jakmile plán naimportuje, může si importovaný zápis upravit tak, aby odpovídal tomu, jak trénink skutečně proběhl.{% if copy_plan_days_valid %} Lze to provést ode dneška pro {{ copy_plan_days_valid }} dní zpětně.{% endif %}
{% endif %}

### Troubleshooting
#### Proč sportovec nevidí plán?
- Sportovec vidí pouze svůj plán, nevidí na plán nikoho jiného ani na tzv. plán skupiny.
- Plán pro sportovce může vzniknout tak, že ho trenér napíše přímo k danému sportovci nebo mu ho nakopíruje (ze skupiny či od jiného sportovce).
- Pokud sportovec nevidí žádný plán, může to být tím, že mu ho trenér zapomněl napsat nebo ho zapomněl zkopírovat od skupiny.
- Pokud trenér udělal nějakou změnu na plánu celé skupiny, musí tuto změnu zase rozkopírovat k daným sportovcům, aby ji viděli ve svém plánu.

---

## 4) Zápis do deníku a tabulek (kam co napsat)

### Společné principy
- Struktura plánu i tréninkové skutečnosti je téměř identická a v týdenním zobrazení se dělí na:
  - tzv. levou stranu = slovní popis obsahu (náplně) tréninku,
  - tzv. pravou stranu = číselné zaznamenání tréninku do tabulky tréninkových ukazatelů (nejčastěji se pro jednotlivé položky vyplňuje čas v dané aktivitě / intenzitě, metry, kilometry, tuny, počty opakování atd.).
- Konkrétní struktura levé strany (textová políčka) i pravé strany (sada ukazatelů) je dana nastavením instance Yarmilla a je specificky konfigurovaná pro daný svaz / tým podle jeho požadavků a specifik daného sportu.
- Levá strana obsahuje typicky políčka jako "motiv dne", "dopoledne", "odpoledne", "poznámky" apod. pro textový popis obsahu tréninkových jednotek, slovní hodnocení, pocitové hodnocení, poznámky trenéra / sportovce / fyzioterapeuta atd. V levé straně se také zobrazují záznamy aktivit a spánku z hodinek / sporttesterů a dalších propojených zařízení. Jsou zde také přílohy k danému dni (přiložené soubory).
- Pravá strana je typicky složená z obecných tréninkových ukazatelů (OTU) a specifických tréninkových ukazatelů (STU). Řádky jsou ukazatele, sloupce jsou jednotlivé dny v týdnu.
- Správný způsob zápisu konkrétního tréninku do textové i číselné části (levé a pravé strany) si určuje daný tým (svaz, klub). Otázky na způsob zápisu je tedy nejlepší směřovat na trenéry a administrátory.
- Každé pole v levé i pravé straně má pomocný tooltip, který se zobrazí po najetí myší na název daného políčka. Tooltip zobrazuje další upřesňující informace, které mají pomoci vysvětlit, k čemu se dané políčko hodí, v jakých jednotkách se vyplňuje apod.

{% if backfill_scope_list and backfill_days is not none %}
{% set labels = [] %}
{% for role in backfill_scope_list %}
{% if role == "athlete" %}{% set _ = labels.append("sportovci") %}{% endif %}
{% if role == "coach" %}{% set _ = labels.append("trenéři") %}{% endif %}
{% if role == "admin" %}{% set _ = labels.append("admini") %}{% endif %}
{% endfor %}
- Vyplňovat deník zpětně pro předešlé dny mohou {% if labels|length == 1 %}{{ labels[0] }}{% elif labels|length == 2 %}{{ labels[0] }} a {{ labels[1] }}{% else %}{{ labels[:-1]|join(", ") }} a {{ labels[-1] }}{% endif %}{% if backfill_days == -1 %} a to bez časového omezení.{% else %}, ale pouze {{ backfill_days }} dní zpětně.{% endif %}
{% endif %}

### Popisy aktivit - kam a jak zapisovat aktivity a poznámky do Yarmilla
- Níže jsou dostupná pole v Yarmillovi (levá i pravá strana). Slouží k plánování/evidenci jednotlivých tréninků, kam je zapisovat a jak je rozdělit do správných polí. Některá pole nejsou uživatelsky editovatelná, počítají se automaticky.
- Levá strana je určena primárně pro textový popis aktivit, poznámky, pocitové hodnocení, pravá strana pro číselný popis aktivit - čas, vzdálenost, opakování apod. Některá číselná pole se ale mohou objevit i na levé straně. Rozhodující a určující je seznam níže.
- Uživatelé mají zapisovat aktivity do odpovídajících polí. Pokud nemůžeš najít odpovídající pole, opatrně doporuč potenciálně nejlepší možné ze seznamu (seznam často obsahuje i položku "Jiné", která se v tomto případě může hodit). Nejbezpečnější variantou v takovém případě je ale dotaz na trenéra nebo admina, aby byla zachována jednotká metodika evidence dat.
- Při dotazech na význam zkratek je následující seznam velmi často zdrojem pravdy pro správnou odpověď. Pokud v něm zkratka není, buď opatrná s hádáním významu, respektuj kontext daného sportu a radši se vyjadřuj tak, že správnost odpovědi je lepší ověřit.

{{ activity_descriptions }}

### Sportovec
#### Zápis ve webové aplikaci
1. Jdi na {Skutečnost}.
2. Vyber správný týden/den.
3. Vyplň levou i pravou stranu pro daný den. Některá políčka v levé straně (včetně přidávání souborů, příloh) jsou schovaná pod tlačítkem tří teček.

#### Zápis v mobilní aplikaci
- V mobilu lze vyplnit pouze tréninková skutečnost pro dnešní den. Předešlé dny jdou doplňovat pouze z webové aplikace.
- Levá strana se v mobilní aplikaci vyplňuje přidáváním jednotlivých políček skrz tlačítko "+ {Přidat}".
- Tabulka pravé strany je v aplikaci pod volbou {Dnes} / záložka {Aktivity}. Oproti webové aplikaci je zde pouze sloupec pro dnešní den a k tomu navíc sloupec pro dnešní den s hodnotama z plánu.

#### Volno / nemoc / zdravotní omezení
- Pokud má tým v seznamu ukazatelů v pravé straně ukazatele pro nemoc, zdravotní omezení, volno apod., pak je použij. Je to důležité pro správnou funkčnost dalších částí Yarmilla a pro správná data v přehledech a statistikách.

### Trenér
- Tréninkovou skutečnost si zapisuje ideálně sám sportovec.
- Trenér (s přístupem zápisu) může do skutečnosti (deníku) zapisovat také. Může tedy vést deník úplně za některé sportovce nebo této možnosti využívat pro doplnění jen některých detailů k tréninku či zapsání zpětné vazby k zápisu, který udělal sportovec.

### Admin
- Admin může rozhodovat, jaké parametry se sledují (podle konfigurace instance) a kdo má práva zapisovat, kdo pouze číst.

### Troubleshooting
#### Kam mám zapsat ...? Do jakého políčka patří ...?
- Správný zápis vychází primárně z metodiky daného týmu. (TODO ADAM: IF metodika existuje, tak ji odkaz)
- Při rozhodování, do jakých polí zapsat danou aktivitu/trénink, je dobré zkontrolovat tooltipy (bubliny s nápovědou) k jednotlivým položkám - tam jsou často uvedeny příklady aktivit, které do dané položky patří, případně upřesňující vysvětlení.
- Pro sportovce může být nápovědou, kam zapsat nějakou aktivitu (do jakých ukazatelů jí rozepsat v pravé straně nebo levé straně) způsob, jakým daný trénink popsal trenér do plánu (pokud trenér plán poctivě vyplnil).
- Nejbezpečnější variantou je dotaz na trenéra nebo admina, aby byla zachována jednotká metodika evidence dat.

## 5) Zkratky, metriky a významy (HRV, RPE, TRIM, zóny…)

### Společné principy
- Význam zkratek typicky specifický pro daný sport a také často i pro daný tým (instanci).
- Některé zkratky a metriky mohou být obecné - mají stejný význam napříč různými sporty - například HRV, RPE, ACWR apod. Jedná se často o termíny z obecné teorie řízení sportovního tréninku, nespecifické metriky atd.

### Troubleshooting
#### Co znamená zkratka X?
- Pokud je termín/zkratka v pravé straně deníku nebo název políčka v levé straně deníku, pravděpodobně bude vysvětlená v tooltipu (stačí najet myší na danou zkratku).
- TODO ADAM: IF existuji metodické pokyny - Zkontroluj, zda není termín vysvětlený v metodických pokynech.
- Pokud nic nepomůže, je nejlepší se optat trenéra.

---

## 6) Export, tisk a sdílení

### Společné principy
- Kompletní export dat deníku nebo plánu je možný pouze na žádost, kterou musí potvrdit administrátor instance. Napiš nám na support@yarmill.com.
- Všechny analytické výstupy (reporty) lze stáhnout jak PDF soubor. Slouží k tomu tlačítko v pravém horním rohu reportu.
- Tréninkový plán lze exportovat do PDF pro vybraný týden. Levá a pravá strana se exportují zvlášť. Slouží k tomu tlačíkto v pravém horním rohu. Při exportu levé strany je možné nastavit výsledný vzhled skrz několik možností - jaké parametry do exportu půjdou, jak budou poskládané (horizontálně vedle sebe nebo vertikálně pod sebou), zda se zobrazí popisky parametetrů nebo ne, velikost písma.
- V deníku i plánu lze ke každému dni přiložit soubory. Jejich přehled pro daného sportovce je ve webové aplikaci v sekci {Soubory}. K souborům daného sportovce má přístup on sám a všichni jeho trenéři.
- Jiné požadavky na exporty lze řešit napsáním na support@yarmill.com.

{% if season_evaluation_enabled %}
- Hodnocení sezóny - zobrazená data (měsíční/mezocyklová data ročního plánu, plánu i skutečnosti) lze stáhnout jako excel (xlsx) nebo PDF (pokud k tomu má uživatel práva).
{% endif %}

{% if TODO ADAM modul CILE je zapnuty %}
- Sezónní cíle vybraného uživatele lze exportovat do PDF. Slouží k tomu tlačítko v horní liště nad seznamem cílů.
{% endif %}

{% if TODO ADAM modul DOCHAZKA je zapnuty %}
- Docházka lze exportovat do excelu (jako xslx soubor) kliknutím na tlačítko v pravém horním rohu. Exportuje se celý měsíc v granularitě dní.
{% endif %}

---

## 7) Role, oprávnění a soukromí

### Role (shrnutí)
- **Sportovec:** je zodpovědný za svá data - zapisuje si tréninky, pocity, vlastní hodnocení, výsledky, vyplňuje své údaje v kartotéce atd. Vidí svůj plán. Vidí na své analýzy.
- **Trenér:** má přiřazené sportovce, o které se stará (v rámci skupin) - plánuje jim tréninky, připravuje termínovku, eviduje docházku. Má přistup k analýzám a datům všech svých sportovců.
- **Admin:** má stejná opravnění jako trenér, navíc k tomu spravuje uživatele, skupiny i oprávnění.

### Oprávnění
- Trenér a admin mají v rámci svého zařazení ve skupinách nastavené oprávnění na zápis nebo čtení.
- Oprávnění **zápis** obecně znamená, že trenér/admin může u dané skupiny a všech jejích sportovců zapisovat a měnit data napříč moduly Yarmilla (zapisovat plán, výsledky testů, závodů, evidovat zranění atd.).
- Oprávnění **čtení** obecně znamená, že trenér/admin vidí na data skupiny a jejích sportovců, ale nemůže je nikde napříč Yarmillem měnit a upravovat. Často se toto oprávnění používá, aby daný trenér měl náhled na vybrané skupiny a sportovce, ale nemohl jim nic zapisovat.
- Základní oprávnění zápisu a čtení může měnit admin.
- Yarmill má vedle tohoto základního nastavení ještě komplexní systém nastavení oprávnění, který umožňuje specifickovat oprávnění na úrovni rolí, skupin i jednotlivých uživatelů pro jednotlivé moduly systému i jednotlivé funkcionality v rámci modulů. Toto nastavení není možné měnit přímo z rozhraní Yarmilla, je součastí implementace instance a změny se řeší požadavkem admina na Yarmill tým.

### Princip skupin
- Skupiny slouží v Yarmillovi k logickému seskupení sportovců a trenérů/adminů.
- Důležité je, že skrz skupiny se určuje, kdo na koho vidí:
  - Trenér/admin vidí v Yarmillovi pouze na ty sportovce, kteří jsou zařazeni do stejné skupiny.
  - Opačně na data daného sportovce vidí každý trenér/admin, který s ním je alespoň v jedné skupině.
- Skupiny často odpovídají reálným tréninkovým skupinám, u individuálních sportů můžou kopírovat strukturu členění svazu do vrcholových středisek (např.: SpS, SCM, VSCM, reprezentační družstva) u týmových sportů typicky odpovídají jednotlivým týmum (např.: U15, U16, U17, A tým).

### Sportovec
- Přístup k datům sportovce mají jeho trenéři (neboli ti, kdo jsou s ním zařazeni v nějaké skupině).
- Sportovec nevidí v Yarmillovi informaci o tom, v jakých skupinách je zařazený, ani kdo všechno je s nim ve skupinách.
- Pokud chce sportovec vědět, kdo má přístup k jeho datům, musí o tuto informaci požádat administrátora. Ten zná přiřazení trenérů a také specifika nastavení oprávnění dané instance Yarmilla.
- Pokud má sportovec jakékoli pochybnosti, může se obrátit také na support@yarmill.com.

### Trenér
- Role se používá pro trenéry, ale i další členy realizačního týmu (fyzioterapeuty, doktory, maséry, analytiky, ...).

### Admin
- Stejné pravomoci jako trénér, navíc ale spravuje uživatele, skupiny a oprávnění.
- Správa uživatelů ({Nastavení} / {Uživatelé}) znamená: přidat nové uživatele, obnovit pozvánku, změnit email, deaktivovat nebo znovu aktivovat uživatele, změnit jméno, příjmení a datum narození.
- Správa skupin ({Nastavení} / {Skupiny}) znamená: vytvářet, mazat a přejmenovávat skupiny, zařazovat a vyřazovat uživatele do/ze skupin.
- Správa oprávnění znamená: měnit trenérům oprávnění k vybrané skupině. Nastavení se dělá u daného trenéra/admina v rámci nastavení skupin.

### Troubleshooting
#### Trenér/Admin: Proč nevidím nějakou skupinu?
- Častým důvodem je, že trenér/admin není přiřazen do dané skupiny.
- Velice často se to děje administrátorům, protože zapomenou, že i sami sebe musí zařadit do skupin, do kterých chtějí mít přístup.

---

## 8) Navigace v aplikaci a UI (kde co najdu)

### Společné principy pro webovou aplikaci
- Horní panel = horní menu, hlavní rozcestník, hlavní moduly (Skutečnost, Plán, Analytika, ...).
- Moduly v horním menu jsou podle specifického nastavení instance.
- Při nedostatku místa se volby horního menu schovávají pod položku Ostatní.
- Uživatelské menu (avatar vpravo nahoře) slouží ke změně jazyka, odhlášení, změně hesla, přepnutí do jiného týmu (jiné instance Yarmilla), případně obsahuje odkazy na nápovědu a tipy a triky.
- Trenér a admin má na levé straně obrazovky výběr skupin a sportovců.
- Pracujeme na novém vzhledu celé platformy => aktuálně se může UI aplikace měnit v závislosti na vybraném modulu (některé nové moduly Yarmilla jsou už v novém designu - například Cíle, Zdravotní modul), zatímco jiné budeme redesignovat postupně v následujících týdnech.

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

#### Tabulky pro výsledky testů, závodů apod. TODO
{% for title, item in header_navigation_overview.evidence.items() %}
- {% if item.get("link_token") %}[{{ title }}]({{ item.get("link_token") }}){% else %}{{ title }}{% endif %}
{% endfor %}
{% endif %}
{% endif %}

### Troubleshooting
#### Nevidím něco v horní liště
- Zkontroluj, že se modul/funkcionalita neschovává pod volbou Ostatní, kam se řadí moduly při nedostatku místa v horní listě.
- Pokud není požadovaný modul ani tam, je pravděpodobné, že na něj nemáš práva nebo není vůbec pro tvou instanci zapnutý (nakonfigurovaný) - optej se admina.

---

## 9) Analytika, grafy

### Společné principy
- Analytika je velice individuální a specificky implementovaná pro každou instanci (svaz/tým) na základě požadavků a potřeb trenérů, medical týmu, metodika, analytiků, managementu atd.
- Přístup k jednotlivým analýzám a jejich konkrétní obsah se může pro jednotlivé uživatele lišit kvůli nastavení oprávnění.
- Přes specifické nastavení má většina instancí Yarmilla základní sadu analýz:
  - Týdenní přehled skupiny - operativní přehled pro trenéra, kde vidí přehled vyplňovaní deníku pro vybranou skupinu a týden.
  - Analýza dat tréninku - trendová analýza základních ukazatelů v čase (pro vybraného sportovce a vybranou sezónu).
  - Zatížení a připravenost - analýza tréninkového zatížení (ACWR) a ukazatelů regenerace (čas spánku, HRV, klidová tepová frekvence).
- Standardně platí, že sportovec vidí analytické výstupy pro sebe, zatimco trenér/admin vidí analýzy pro všechny své sportovce. Výjimkou mohou být reporty, ve kterých sportovci vidí i na jiné sportovce kvůli srovnání(jedná se typicky o reporty nad veřejnými daty výsledků nebo reporty nad sumarizovanými daty).

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

## 11) Help a kontakt na admina
- Kontakt na admina tvého týmu/instance je TODO DOTAHNOUT JMENO A EMAIL Z KONFIGURACE.
- Pokud si nevíš s něčím rady, něco ti v Yarmillovi chybí, máš nápad na zlepšení nebo jakoukoli zpětnou vazbu, napiš nám na <support@yarmill.com>. Snažíme se odpovídat co nejrychleji.


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
