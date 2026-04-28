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

## 1) Device integration and synchronization

### Common principles
- Synonyms used: watches, sports testers, devices.
- Synonyms for records: record, activity, data, log.
- Connection is possible from the web application and the iOS application. It is not possible from the Android application.
- Only the athlete can connect the device. Neither the coach nor the administrator can do it.
- After connection, data from the device is synchronized to Yarmill automatically at the moment the device is synchronized with the manufacturer's application. This means that as soon as I can see, for example, an activity from Garmin watches in the Garmin Connect application, it is also automatically sent to Yarmill.
- In Yarmill, records are shown in the {{translations.reality}} module on the given day and possibly in relevant analytical outputs (for example, sleep data is also reflected in reports in {{translations.recoveryAnalysis}}, if available - see the overview of analytical outputs below).
- An uploaded (synchronized) activity currently cannot be edited or deleted in Yarmill.
- After connecting devices that send activity information, it is necessary to check that the athlete has heart rate zones set ({{translations.settings}} -> {{translations.HRzones}}). This setting is important for the correct display of activity details and for calculating and analyzing time spent in individual zones.

### Athlete
#### How to connect a device
##### Procedure for connecting in the web application
1. Open the Yarmill web application.
2. In the top bar, click {{translations.settings}}.
3. Scroll down to the {{translations.appsAndDevices}} section.
5. For the selected device, click the {{translations.connect}} button.
6. A window will open with a sign-in to your account for the given service/application.
7. Sign in and confirm the connection with Yarmill (this confirms data transfer from the given service to Yarmill). For some services, you also need to check the scope of data that will be synchronized to Yarmill. 
8. After a successful connection, the {{translations.disconnect}} button is shown for that integration in Yarmill.

##### Procedure for connecting in the iOS application
1. Open the Yarmill mobile iOS application.
2. In the top right corner, click your avatar.
3. Select {{translations.connectedAppsAndDevices}}.
4. Select the device/application you want to connect.
5. Click the toggle switch to enable the connection.
6. A window will open with a sign-in to your account for the given service/application.
7. Sign in and confirm the connection with Yarmill (this confirms data transfer from the given service to Yarmill). For some services, you also need to check the scope of data that will be synchronized to Yarmill. 
8. Successfully connected devices and applications have the toggle turned on and, on the overview screen of all devices, are marked with the gray label {{translations.connected}}.

##### Procedure for disconnecting
The same as for connecting. 
In the web application, connected integrations have a {{translations.disconnect}} button that you use to cancel the connection.
In the iOS application, there is a toggle switch button, and turning it off cancels the connection.
From the moment of disconnection, new data will no longer be synchronized to Yarmill.

{% if "polar" in external_services_list %}
#### Polar specifics
- Polar can also send information about configured heart rate zones for each activity.
- Enabling/disabling the use of heart rate zones directly from Polar is shown in the web application under the {{translations.appsAndDevices}} section when Polar integration is connected.
- When the switch is turned on, the heart rate zones that Polar sends for the given activity are used for each activity (that is, the zones the user has set in their watch or the Polar Flow application). Zones set directly in Yarmill are ignored in that case.
{% endif %}

{% if "apple-health" in external_services_list %}
#### Apple Health specifics
- Apple Health (Apple Watch) cannot be connected from the web application, only directly from the iOS application.
- After connection, the iOS application shows, in the Apple Health connection detail, a list of historical activities together with their status - whether the given activity was synchronized to Yarmill, and possibly a {{translations.sync}} button for its manual synchronization (manual synchronization is needed only for historical activities from before the connection was enabled).
{% endif %}

{% if "garmin" in external_services_list %}
#### Garmin specifics
- When connecting Garmin, it is possible to specify (turn on/off) which of the following data will be sent to Yarmill:
  - Activity data
  - Sleep data (health data) - body battery, etc.
  - Historical data
- For the best possible functionality, it is recommended to allow all three types of data. Without historical data, it will not be possible to retrieve past activities and sleep data that were created before the connection.
{% endif %}

#### Retrieving historical data
- Data is normally synchronized from the moment of connection until the user cancels the connection (disconnects it).
- Retrieving historical data is possible for Garmin, Oura Ring, and WHOOP. We handle it individually. Write to us at <support@yarmill.com>.

### Coach and Admin
- They can see the synchronized data of their athletes in their training diary ({{translations.reality}}) (depending on the instance settings). This applies to both activity and sleep data.
- They can also see the data in the relevant analyses that use it, if they have access to them (e.g. {{translations.trendAnalysis}} or {{translations.recoveryAnalysis}}, if available - see the overview of analytical outputs below).

### Troubleshooting / Problems

#### I can't see the activity / Data is not synchronizing
- Check that you are looking in {{translations.reality}} and on the correct date.
- Check whether the connection is enabled in {{translations.settings}}.
- Check whether the given record is synchronized from the device (watch, ring, ...) to the corresponding source application (e.g.: Garmin Connect for Garmin devices, Polar Flow for Polar devices, etc.). Records must always first be synchronized from the device to the corresponding application of the device manufacturer, and only then are they automatically synchronized to Yarmill.

#### I can't see historical data
- By default, only data created from the moment of connection is synchronized.
- Synchronization (retrieval) of older records is described in the #retrieving-historical-data section.

#### How do I delete a synchronized activity
- An uploaded (synchronized) activity currently cannot be edited or deleted in Yarmill.

#### My device is not on the list
- We are interested in that. Write to us about it at <support@yarmill.com> so that we can add it. We are constantly expanding the list of integrations.

#### Another problem or I can't resolve it
- Write to us at <support@yarmill.com>. It helps a lot if you describe the problem as much as possible (what activities are involved, from when, a screenshot from the application where they are visible, etc.). We usually get back to you within a few minutes.

---

## 2) Access, sign-in, and team URL

### Common principles
- Yarmill works on the principle of separate instances for each team.
- An instance means a separate version, a separate workspace, configured specifically for the given sport and according to the requirements and methodology of the specific team.
- Each Yarmill instance has its own URL (for example csb.yarmill.com, sigma.yarmill.com, etc.).
- Team here means a sports association, federation, departmental sports organization, or club (typically in the case of football and team sports).
- Coaches, athletes, physiotherapists, and other users always sign in to their Yarmill instance, or the instance of their team (association, club).
- Team URL means the specific URL address where the Yarmill instance of the given team is hosted.
- Users need to know their team URL in order to sign in to their Yarmill.
- Each user of the given instance must be invited by an administrator. Yarmill works as a closed application – team administrators determine whom they invite into the application. It is not possible to register on your own.
- In this regard, Yarmill does not work like publicly available applications that you just download, install, register for, and use. Nor like public web applications where anyone can create an account and use them. That is not possible due to the very specific setup for each team.

{% if available_languages %}
### Localization (language versions)
- Available languages: {{ available_languages | join(", ") }}.
- Languages can be switched through the user menu (by clicking on the avatar). 
- The mobile application automatically uses the phone language if it is on the list of available languages.
{% endif %}

### Team URL
- The team URL is the web address where the Yarmill instance for the given team runs.
- Each user receives information about their team URL in the registration confirmation email.
- The team URL typically consists of the name or abbreviation of the given club/association followed by the Yarmill domain (yarmill.com), generally https://team-name.yarmill.com.
- URL of your team is: {{instance_url}}

### Registration
- Yarmill works as a closed application. Every user must be invited. It is not possible to register on your own without an invitation.
- The invitation to Yarmill (the given Yarmill instance) for coaches, athletes, and other users is sent by the instance administrator.
- Registration takes place through an invitation that the user receives by email.
- In the invitation, the user clicks the registration button (joining the given team), which takes them to the web registration form.
- As part of registration, each user approves the license terms (the so-called EULA), fills in basic information, sets their avatar, and creates a password for access to Yarmill.
- After completing registration, the user receives a confirmation email, which also includes the team URL.
- The registration invitation has a limited validity period. If the user misses it, registration will not be allowed and they must contact the admin to renew the invitation.

### Sign-in
- Sign-in works only for registered users (that is, those who were invited and completed the registration process).
- To sign in to Yarmill, it is necessary to know the URL of the team the user wants to sign in to.
- The sign-in credentials are the email address (the one to which the user received the invitation and registration confirmation) and the password they set during registration.

#### Procedure for signing in to the Yarmill web application
1. In a web browser, enter the full team URL (into the address bar). The second option is to open the Yarmill website at https://yarmill.com, click Sign in, and then complete the pre-filled team URL (the ending ".yarmill.com" part is pre-filled).
2. The sign-in screen of the given instance (the given team) will open.
3. Enter your email and password (the sign-in credentials you know from registration) and confirm.
- It is not necessary to sign out of the application. Until signing out, Yarmill remains signed in on the given computer, so it is not necessary to re-enter sign-in credentials when closing and reopening it.

#### Procedure for signing in to the Yarmill mobile application
- The mobile application works only for athletes. Coaches, admins, and other users use only the web version of Yarmill.
1. Open the mobile application on an iOS or Android device.
2. In the first step, enter the team URL. (The initial "https://" part and the ending ".yarmill.com" part, which is already fixed and pre-filled, are not entered. The athlete enters only the part with the team abbreviation/name.)
3. A sign-in screen with the name of your team will appear (based on the entered team URL).
4. Enter your email and password (the sign-in credentials you know from registration) and confirm.

### Using Yarmill on mobile
- The native mobile application for iOS and Android devices is intended only for athletes. Coaches and admins cannot sign in to it.
- The mobile application is functionally limited to only basic viewing of the training plan and efficient entry of training and notes for the current day. It is not possible to add training sessions retroactively.
- For the full functionality of the Yarmill platform on mobile, and as the recommended way of using Yarmill on mobile for coaches and admins, save the web version to the mobile home screen:
  - Open Yarmill from your mobile web browser (ideally Chrome or Safari).
  - Click share and select Add to home screen.
  - Videos showing how to do it are here: 
    - Android: https://www.youtube.com/watch?v=TtfqcqjDnOc
    - iOS: https://www.youtube.com/watch?v=OP6GCmI1Qj4
  - The Yarmill icon will appear on the mobile home screen among your other applications.
  - Yarmill is adapted for this use and it replaces the native mobile application.

### Troubleshooting / Problem solving

#### Forgotten password
- The password can be reset easily at any time (set a new one).
1. Go to the Yarmill sign-in screen (see Sign-in).
2. Under the sign-in credential fields there is the {{translations.forgottenPassword}} option.
4. Enter the email you use to sign in to Yarmill and confirm.
5. Instructions for setting a new password will be sent to that email.

#### I don't know the email
- The sign-in email is the one to which the invitation to register for Yarmill was sent.
- If you do not know the email, you must ask the admin or your coach to check in Yarmill and tell you what it is.

#### I don't know the team URL
- You can find the team URL in the Yarmill registration confirmation email.
- It typically consists of the name or abbreviation of the given club/association followed by the Yarmill domain (yarmill.com), generally https://team-name.yarmill.com.
- If you cannot find the team URL, write to us at <support@yarmill.com> and describe which association or club you belong to (what sport you do).

#### Another problem / I don't know what to do
- Write to us at <support@yarmill.com>. We try to respond within a few minutes.

### Access administration
- Admin is the only role that can manage users. This mainly means:
  - inviting new users,
  - renewing invitations,
  - changing sign-in emails.
- Neither the admin nor anyone else can change or reset passwords. Only each user can do that for themselves.

---

## 3) Plan ↔ Reality (copying, import, publication)

### Common principles
- The training plan (sometimes also called the training program) is under the responsibility of coaches (or admins). The athlete cannot change the plan.
- How the training actually took place (what the athlete completed and how) is recorded in the {{translations.reality}} module – it is often referred to as the training diary or training records.
- The structure of the plan and training reality is almost identical and, in the weekly view, is divided into:
  - a verbal description of the training content - sometimes called the left side - and
  - numerical recording - the so-called right side, which contains a set of general (OTU) and specific (STU) training indicators that quantify the training by time, count, kilometers, etc.
  - training reality may also contain items for the athlete’s subjective rating, etc.
- The structure of the text part (left side) and the set of indicators (right side) are configured specifically for the given Yarmill instance.
- Copying can have different meanings:
  - Coach and admin can copy the plan from a group to individual athletes (distribution/publication of the plan), but also to other groups, to another week, etc.
  - When an athlete speaks about copying the plan, they typically mean importing the plan into reality - this option must be enabled by the administrator and depends on the specific instance. The number of days for which this functionality can be used retroactively is also configured for the given instance (for example, 3 days means the athlete can use the option to copy the plan into reality only for today and three days back. Older days can no longer be imported from the plan.
  
{% if copy_plan_to_reality %}
- To make diary entry easier/faster, the athlete can use the {{translations.importPlan}} option, which copies the data for the given day from the plan into the diary (reality). Typical use is when the athlete completed the training according to the plan or with only a slight change compared to the plan. Once the plan is imported, the athlete can edit the imported entry so that it matches how the training actually took place.{% if copy_plan_days_valid %} This can be done from today for {{ copy_plan_days_valid }} days back.{% endif %}
{% endif %}

### Troubleshooting
#### Why can't the athlete see the plan?
- The athlete can see only their own plan; they cannot see anyone else’s plan or the so-called group plan.
- The athlete’s plan can be created either by the coach writing it directly for the given athlete or by copying it to them (from the group or from another athlete).
- If the athlete cannot see any plan, it may be because the coach forgot to write it for them or forgot to copy it from the group.
- If the coach made a change to the whole group’s plan, they must copy this change again to the given athletes so they can see it in their plan.

---

## 4) Diary and table entry (where to write what)

### Common principles
- The structure of the plan and training reality is almost identical and, in the weekly view, is divided into:
  - the so-called left side = verbal description of the training content,
  - the so-called right side = numerical recording of training in the table of training indicators (most often, time in a given activity/intensity, meters, kilometers, tons, numbers of repetitions, etc. are entered for individual items).
- The specific structure of the left side (text fields) and the right side (set of indicators) is determined by the settings of the Yarmill instance and is specifically configured for the given association/team according to its requirements and the specifics of the sport.
- The left side typically contains fields such as "theme of the day," "morning," "afternoon," "notes," etc. for text descriptions of training sessions, verbal evaluations, subjective ratings, notes from the coach / athlete / physiotherapist, etc. The left side also displays activity and sleep records from watches / sports testers and other connected devices. Attachments for the given day (attached files) are also shown here.
- The right side is typically composed of general training indicators (OTU) and specific training indicators (STU). Rows are indicators, columns are individual days of the week.
- The correct way to record specific training in the text and numerical parts (left and right sides) is determined by the given team (association, club). Therefore, questions about how to record things are best directed to coaches and administrators.
- Every field on both the left and right side has a helper tooltip that appears when hovering over the name of the given field. The tooltip shows additional clarifying information intended to explain what the field is suitable for, in what units it is filled in, etc.

{% if backfill_scope_list and backfill_days is not none %}
{% set labels = [] %}
{% for role in backfill_scope_list %}
{% if role == "athlete" %}{% set _ = labels.append("athletes") %}{% endif %}
{% if role == "coach" %}{% set _ = labels.append("coaches") %}{% endif %}
{% if role == "admin" %}{% set _ = labels.append("admins") %}{% endif %}
{% endfor %}
- The diary for previous days can be filled in retroactively by {% if labels|length == 1 %}{{ labels[0] }}{% elif labels|length == 2 %}{{ labels[0] }} and {{ labels[1] }}{% else %}{{ labels[:-1]|join(", ") }} and {{ labels[-1] }}{% endif %}{% if backfill_days == -1 %} with no time limit.{% else %}, but only {{ backfill_days }} days back.{% endif %}
{% endif %}

### Activity descriptions - where and how to enter activities and notes in Yarmill
- Below are the available fields in Yarmill (left and right side). They are used for planning/recording individual training sessions, where to enter them, and how to divide them into the correct fields. Some fields are not user-editable and are calculated automatically.
- The left side is intended primarily for text descriptions of activities, notes, subjective ratings; the right side is for numerical descriptions of activities - time, distance, repetitions, etc. However, some numerical fields may also appear on the left side. The decisive reference is the list below.
- Users should enter activities into the corresponding fields. If you cannot find a matching field, cautiously recommend the potentially best possible one from the list (the list often also includes an item called "Other," which may be useful in such a case). But the safest option in that case is to ask the coach or admin so that a consistent methodology of data recording is maintained.
- When asked about the meaning of abbreviations, the following list is very often the source of truth for the correct answer. If the abbreviation is not there, be cautious about guessing its meaning, respect the context of the given sport, and rather say that it is better to verify the correctness of the answer.

#### Training diary fields
{{ activity_descriptions }}

### Athlete
#### Entry in the web application
1. Go to {{translations.reality}}.
2. Select the correct week/day.
3. Fill in both the left and right sides for the given day. Some fields on the left side (including adding files and attachments) are hidden under the three-dot button.

#### Entry in the mobile application
- In mobile, only training reality for the current day can be entered. Previous days can be completed only from the web application.
- The left side in the mobile application is filled in by adding individual fields through the "+ {Přidat}" button.
- The table on the right side is in the application under {{translations.today}} / tab {{translations.activities}}. Compared to the web application, there is only a column for the current day and, in addition, a column for the current day with values from the plan.

#### Rest / illness / health limitation
- If the team has indicators for illness, health limitation, rest, etc. in the list of indicators on the right side, then use them. This is important for the correct functioning of other parts of Yarmill and for correct data in overviews and statistics.

### Coach
- Training reality should ideally be entered by the athlete themselves.
- The coach (with write access) can also enter data into reality (the diary). They can therefore keep the diary entirely for some athletes or use this option only to add certain training details or write feedback on an entry made by the athlete.

### Admin
- Admin can decide which parameters are tracked (according to the instance configuration) and who has permission to write and who can only read.

### Troubleshooting
#### Where should I record ...? Which field does ... belong to?
- Correct recording is based primarily on the methodology of the given team. {% if instance_methodics %} {% for methodic in instance_methodics %} {% if methodic.label == "header.navigation.instructions" %} This methodology is available at {{methodic.url}}. {% endif %} {% endfor %} {% endif %}

- When deciding which fields to use for a given activity/training, it is a good idea to check the tooltips (help bubbles) for the individual items - they often list examples of activities that belong in the given item or provide further clarification.
- For athletes, it may be helpful to look at how the coach described the given training in the plan (if the coach filled in the plan carefully) to determine where to record an activity (which indicators on the right side or left side to break it down into).
- The safest option is to ask the coach or admin so that a consistent methodology of data recording is maintained.

## 5) Abbreviations, metrics, and meanings (HRV, RPE, TRIM, zones…)

### Common principles
- The meaning of abbreviations is typically specific to the given sport and often also to the given team (instance).
- Some abbreviations and metrics may be general - they have the same meaning across different sports - for example HRV, RPE, ACWR, etc. These are often terms from the general theory of sports training management, non-specific metrics, etc.

### Troubleshooting
#### What does abbreviation X mean?
- If the term/abbreviation is on the right side of the diary or is the name of a field on the left side of the diary, it will probably be explained in the tooltip (just hover over the given abbreviation).
{% if specific_guidelines %} - Check whether the term is explained in the methodological guidelines. {% endif %}
- If nothing helps, it is best to ask the coach.

---

## 6) Export, printing, and sharing

### Common principles
- Full export of diary or plan data is possible only upon request, which must be approved by the instance administrator. Write to us at support@yarmill.com.
- All analytical outputs (reports) can be downloaded as PDF files. There is a button for this in the top right corner of the report.
- The training plan can be exported to PDF for a selected week. The left and right sides are exported separately. There is a button for this in the top right corner. When exporting the left side, it is possible to set the final appearance through several options - which parameters will be included in the export, how they will be arranged (horizontally side by side or vertically below each other), whether parameter labels will be shown or not, font size.
- In both the diary and the plan, files can be attached to each day. Their overview for the given athlete is in the web application in the {{translations.files}} section. The athlete themself and all of their coaches have access to the athlete’s files.
- Other export requests can be handled by writing to support@yarmill.com.

{% if season_evaluation_enabled %}
- Season evaluation - the displayed data (monthly/mesocycle data of the annual plan, plan, and reality) can be downloaded as Excel (xlsx) or PDF (if the user has the necessary permissions).
{% endif %}

{% if modules.get("goals") %}
- The seasonal goals of the selected user can be exported to PDF. There is a button for this in the top bar above the list of goals.
{% endif %}

{% if modules.get("attendance") %}
- Attendance can be exported to Excel (as an xslx file) by clicking the button in the top right corner. The entire month is exported with day-level granularity.
{% endif %}

---

## 7) Roles, permissions, and privacy

### Roles (summary)
- **Athlete:** is responsible for their own data - enters training sessions, feelings, self-assessments, results, fills in their data in the athlete record, etc. They can see their plan. They can see their analyses.
- **Coach:** has assigned athletes they take care of (within groups) - plans training for them, prepares the schedule, records attendance. They have access to the analyses and data of all their athletes.
- **Admin:** has the same permissions as a coach, and in addition manages users, groups, and permissions.

### Permissions
- Coach and admin have either write or read permissions set within their assignment to groups.
- **Write** permission generally means that the coach/admin can enter and change data across Yarmill modules for the given group and all its athletes (enter the plan, test results, competition results, record injuries, etc.).
- **Read** permission generally means that the coach/admin can see the data of the group and its athletes, but cannot change or edit it anywhere across Yarmill. This permission is often used so that the given coach has an overview of selected groups and athletes, but cannot enter anything for them.
- Basic write and read permissions can be changed by the admin.
- In addition to this basic setting, Yarmill has a complex permission settings system that allows permissions to be specified at the level of roles, groups, and individual users for individual system modules and even individual functionalities within modules. This setting cannot be changed directly from the Yarmill interface; it is part of the instance implementation, and changes are handled by a request from the admin to the Yarmill team.

### Principle of groups
- Groups are used in Yarmill for the logical grouping of athletes and coaches/admins.
- It is important that groups determine who can see whom:
  - A coach/admin can see in Yarmill only those athletes who are assigned to the same group.
  - Conversely, every coach/admin who is with the athlete in at least one group can see that athlete’s data.
- Groups often correspond to real training groups; in individual sports they may mirror the structure of the association into performance centers (e.g.: SpS, SCM, VSCM, national teams), while in team sports they typically correspond to individual teams (e.g.: U15, U16, U17, A team).

### Athlete
- The athlete’s data can be accessed by their coaches (that is, those who are assigned with them in some group).
- The athlete cannot see in Yarmill which groups they are assigned to, nor who else is in those groups with them.
- If the athlete wants to know who has access to their data, they must request this information from the administrator. The administrator knows the coach assignments and also the specifics of the permission settings of the given Yarmill instance.
- If the athlete has any doubts, they can also contact support@yarmill.com.

### Coach
- This role is used for coaches, but also for other members of the support team (physiotherapists, doctors, massage therapists, analysts, ...).

### Admin
- Same powers as a coach, but additionally manages users, groups, and permissions.
- User management ({{translations.settings}} / {{translations.users}}) means: add new users, renew an invitation, change email, deactivate or reactivate users, change first name, last name, and date of birth.
- Group management ({{translations.settings}} / {{translations.users}}) means: create, delete, and rename groups, assign and remove users to/from groups.
- Permission management means: change coaches’ permissions for a selected group. The setting is made for the given coach/admin within the group settings.

### Troubleshooting
#### Coach/Admin: Why can't I see a group?
- A common reason is that the coach/admin is not assigned to the given group.
- This very often happens to administrators because they forget that they also need to assign themselves to the groups they want to access.

---

## 8) Navigation in the application and UI (where to find what)

### Common principles for the web application
- Top bar = top menu, main navigation hub, main modules (Reality, Plan, Analytics, ...).
- The modules in the top menu depend on the specific settings of the instance.
- When there is not enough space, the top menu options are hidden under the More item.
- The user menu (avatar in the top right) is used to change the language, sign out, change the password, switch to another team (another Yarmill instance), and may also contain links to help and tips and tricks.
- Coach and admin have a selection of groups and athletes on the left side of the screen.
- We are working on a new look for the whole platform => currently, the application UI may change depending on the selected module (some new Yarmill modules are already in the new design - for example Goals, Medical module), while others will be redesigned gradually over the following weeks.

{% if header_navigation_overview %}

### Main navigation overview
{% if header_navigation_overview.navigation %}
{% for title, item in header_navigation_overview.navigation.items() %}
#### {% if item.get("link_token") %}[{{ title }}]({{ item.get("link_token") }}){% else %}{{ title }}{% endif %}
{% endfor %}
{% endif %}
{% if header_navigation_overview.analytics %}

#### Analytics (dashboard overview)
{% for item in header_navigation_overview.analytics %}
- {% if item.get("link_token") %}[{{ item.get("title") }}]({{ item.get("link_token") }}){% else %}{{ item.get("title") }}{% endif %}
{% endfor %}
{% endif %}
{% if header_navigation_overview.evidence %}

#### Tables for recording results and tests
It is usually found in the navigation under the More tab.
{% for title, item in header_navigation_overview.evidence.items() %}
- {% if item.get("link_token") %}[{{ title }}]({{ item.get("link_token") }}){% else %}{{ title }}{% endif %}
{% endfor %}
{% endif %}
{% endif %}

### Troubleshooting
#### I can't see something in the top bar
- Check whether the module/functionality is hidden under the More option, where modules are placed when there is not enough space in the top bar.
- If the required module is not there either, it is likely that you do not have permission for it or it is not enabled (configured) for your instance at all - ask the admin.

---

## 9) Analytics, charts

### Common principles
- Analytics is highly individual and specifically implemented for each instance (association/team) based on the requirements and needs of coaches, the medical team, methodologists, analysts, management, etc.
- Access to individual analyses and their specific content may differ for individual users due to permission settings.
- Despite the specific setup, most Yarmill instances have a basic set of analyses:
  - Weekly group overview - an operational overview for the coach, where they can see an overview of diary completion for the selected group and week.
  - Training data analysis - trend analysis of basic indicators over time (for a selected athlete and selected season).
  - Load and readiness - analysis of training load (ACWR) and recovery indicators (sleep time, HRV, resting heart rate).
- By default, the athlete sees analytical outputs for themselves, while the coach/admin sees analyses for all their athletes. Exceptions may be reports where athletes can also see other athletes for comparison (these are typically reports based on public results data or reports based on summarized data).

{% if analytics_overview %}

### Overview of available analytics
{% for dash_title, dash_data in analytics_overview.items() %}
#### {{ dash_title }}
{% for page_code, page_data in dash_data["pages"].items() %}
- {% if page_data.get("link_token") %}[{{ page_data.get("name") or page_code }}]({{ page_data.get("link_token") }}){% else %}{{ page_data.get("name") or page_code }}{% endif %}{% if page_data.get("description") %} — {{ page_data.get("description") }}{% endif %}
{% endfor %}
{% endfor %}
{% endif %}

---

## 10) Yollanda — what it can and cannot do

### Summary
#### What Yollanda is
- Yollanda is the "Magic Gift". A sophisticated intelligence layer that sits atop the data warehouse. Yollanda solves the "Interpretation Paradox" where coaches have too much data and too little time to analyze it.
- Yollanda AI functions as a 24/7 analyst, capable of answering natural language questions like: "Which athletes have shown a downward trend in explosive power over the last three weeks despite consistent training?". This ability to extract knowledge from the data in Yarmill "automagically" empowers the coaches to make decisions with a level of precision previously reserved for organizations with massive analytics departments.

#### What Yollanda can do (in the context of Yarmill)
- Search for specific training sessions, exercises, notes (in both plans and diaries), including a link to the given day.
- Search and recall prior chats between the current asker and Yollanda (conversation history), including filtering by start date.
- Analyze activity and sleep data, compare and evaluate training periods, compare seasons, ...
- Answer questions about data in natural language and in any language.
- Explain (interpret) charts.
- Help with using Yarmill (navigation, procedures, where to find what).
- Yollanda currently has access to data from:
  - the plan,
  - reality,
  - summary data about each activity from connected devices,
  - sleep and recovery data from connected devices.

#### What Yollanda cannot do / when to redirect
- Yollanda cannot yet:
  - automatically fill anything into Yarmill on behalf of the user (neither the diary nor entries into the plan),
  - make any changes in Yarmill - neither in data nor in configuration/settings,
  - work with files,
  - create files, export data, print, ...
  - create charts, images, videos,
  - access conversation history of other users,
  - edit or delete conversation history.

---

## 11) Help and contact for the admin
- The contact for your team/instance admin is {{admin_name}} ({{admin_email}}).
- If you are unsure about something, something is missing in Yarmill, you have an idea for improvement, or any feedback, write to us at <support@yarmill.com>. We try to respond as quickly as possible.


# Module overview

{% if modules.get("plan") %}
## {{ modules["plan"] }}
Module for preparing training plans.
Enables top-down planning from summary volumes, main themes of mesocycles, microcycles, and individual days all the way to a detailed description of each training session.
{% endif %}

{% if modules.get("reality") %}
## {{ modules["reality"] }}
Module for keeping the training diary.
Recording all essential and necessary information about training, especially its content and load, including subjective feeling-based evaluation (RPE is often used).
The diary may also include any other information adding context to the given day - evaluation of the day, notes on diet (what I ate), notes from the physiotherapist, etc.
{% endif %}

{% if modules.get("evidence") %}
## {{ modules["evidence"] }}
Athlete record - a module for keeping information about athletes, a kind of digital athlete card.
It is used for systematic recording of key information about athletes. Each team/instance has the athlete record configured specifically according to its requirements. It often contains personal data, contact information, equipment details (sizes, brands, ...), body measurements, information about the club and personal coach, numbers and validity of identity documents. Files can also be stored in the athlete record (for example scans of documents, anti-doping certificate, etc.).
{% endif %}

{% if modules.get("planner") %}
## {{ modules["planner"] }}
Schedule, or event calendar - a module for planning events for the season.
Calendar planning of races, matches, training camps, testing, holidays, and other events. Coaches and admins can also specify who the event concerns (participants).
Events from the schedule are reflected in the planning module into the themes of individual days so that coaches have full context when planning.
{% endif %}

{% if modules.get("attendance") %}
## {{ modules["attendance"] }}
Module for attendance recording, that is, athletes’ participation in training sessions.
In the module, coaches record the participation of individual athletes in training sessions. Depending on the instance settings, attendance may be recorded for the whole day or for specific training sessions.
The coach records whether the athlete had rest, was present at training, was excused from training, or has an unexcused absence.
The module is commonly used more for younger age categories. 

The coach can also use completed attendance to fill in the training diary in bulk. They do this by clicking the {Kopírovat plán} button in the top right corner for the selected week in attendance. After confirming the action, each athlete is checked for which days they have confirmed attendance, and for those days their plan is copied into their diary. If the athlete has absence (excused or unexcused) or rest for the given day, nothing is copied into the diary. The condition is that the plan exists for each athlete (it is not enough for the plan to be only for the whole group).
{% endif %}

{% if modules.get("analytics") %}
## {{ modules["analytics"] }}
Analytics module - charts, visualizations, analyses, overviews, and statistics based on data.
The {{ modules["analytics"] }} section contains all graphical outputs based on data stored in Yarmill. Most reports and analyses are specific to the given Yarmill instance; they are created in cooperation with the team’s coaches/methodologists/analysts and correspond to their specific needs, requirements, and concrete tasks they address.
Common analytical outputs include, for example, trend analyses of training indicators, training load reports (ACWR), recovery indicator reports, an operational dashboard of diary completion, daily team readiness, or analyses of motor, conditioning, and specific tests. Analyses of race/game data and views of the athlete’s development over time, including comparison with others, are also common.
{% endif %}

{% if modules.get("season-evaluation") %}
## {{ modules["season-evaluation"] }}
A summary overview of training indicators by months/mesocycles (according to the instance settings), often used for numerical season evaluation.
It has two views. The first view - {{translations.season}} - is a table of summed training indicators by months/mesocycles for the selected season, where I can compare all three versions of the given athlete’s data side by side - annual plan, plan, and completed reality. The user can download this table as Excel (xlsx) or PDF - typically as supporting material for annual evaluation, review meetings, etc.
The second view - {{translations.trend}} - contains seasonal totals of reality data (again across all training indicators) for all available seasons. This view cannot be exported.
{% endif %}

{% if modules.get("files") %}
## {{ modules["files"] }}
Overview of all uploaded files.
The module contains a list of all files that were stored in {Plánu} or {Skutečnosti}. Files can be filtered (by name, type, ...), renamed, downloaded, and deleted. By clicking the date of the given file, the user is taken directly to the day to which the file belongs.
Files can also be added to Yarmill directly from the overview. Compared to adding files directly from the given day in {{translations.plan}} or {{translations.reality}}, this has two advantages:
  - the possibility to assign file(s) to multiple athletes at once and
  - the possibility to add labels (so-called tags) to the file, which can be used for subsequent filtering. 
{% endif %}

{% if modules.get("tabulars") %}
## {{ modules["tabulars"] }}
Specifically configured tables/forms. This is therefore not a standard module, and Yollanda understands each table as a separate data source, not as part of some general module.
These are tables used for structured data collection typically belonging to the category of "training status control" - most often the tables are used for recording competition results, motor, conditioning, strength, and specific tests, SCM tests, kinesiological examinations, etc.
Some tables may be filled automatically, for example through integration with a results system, but more often these are pieces of information that need to be entered manually.
Each table has a structure set according to the needs of the given sport and team. The parameters (columns) of the table may be of various types - number, time, text, selection from predefined values, file, ...
Entry into the table is done through an input form (button in the top right corner of the table). Compared to the typical solution in Excel, a uniform data structure and format across the organization is guaranteed here. Thanks to this, the results can then be used effectively in other parts of Yarmill, especially in analytical outputs.
{% endif %}

{% if modules.get("goals") %}
## {{ modules["goals"] }}
Module for setting and tracking seasonal goals.
Functionality for planning and tracking primarily long-term (seasonal) goals - for athletes and coaches - as an important tool for systematic and guided development.
Most often, performance (result-based) goals are planned for the upcoming season (as part of annual evaluation / reviews). However, it is also possible to plan goals in many other categories - conditioning, personal development, technical skills, health, and conditions.
For each goal, it is possible (and advisable) to define so-called key results - gradual steps that lead to achieving the goal - how I will achieve the goal. Key results should be specific, clear, and above all measurable. The name of the key result, the initial value (where I start), the current value (regularly updated progress, current value at the given moment), the target value (what value I want to reach), and possibly the deadline by which I want to achieve the key result are recorded.
After entering one of the end states of the given goal (completed / not completed), it is possible to record a final evaluation for the goal. This can be entered by the athlete/coach whose goal it is, as well as by any supervisor of the goal. Supervisors are people with whom the goal owner cooperates in order to achieve it - most often coaches and other members of the support team.
{% endif %}

{% if modules.get("medical") %}
## {{ modules["medical"] }}
The module centralizes information about the athlete’s health status.
It allows recording the details and progression of every injury and illness - date of onset and expected return to training, treatment status, training limitation (none, partial, full), circumstances of the injury such as location, activity, mechanism, or severity, standardized diagnosis (the Orchard Sports Injury and Illness Classification System - OSIICS - is used), responsible treating person, notes, or any attachments - clinical reports (including referral/request letters), diagnostic images (X-ray, CT, MRI), laboratory results, treatment and rehabilitation plans. 
When displaying the whole group, the coach is shown an overview (dashboard) of all athletes in the group with their current status (green = full training, orange = limited training, red = no training), a list of currently ongoing health problems, and the expected date of return to full training.
The athlete’s health status from the medical module is also reflected in the daily readiness report (if this is configured in the instance).
Thanks to the centralized recording of health records, the complete health history is in one place and the whole support team has a clear overview for safe management of return to full load as well as materials for long-term prevention.
Access to health data is governed by permission settings. As a rule, the athlete’s coaches and medical staff have access to the records, but the specific configuration is always specific to the given instance/team.
{% endif %}

---
---

{% if specific_guidelines or instance_methodics %}
# Specific guidelines and methodics
Additional specific instructions, methodologies, guidelines. 
They usually contain very specific and concrete requirements / instructions / methodologies for filling in Yarmill in the given instance. This may include specification of the style of training entries, definitions of abbreviations used, examples of correct and incorrect entries, grammar of recording specific activities (for example how to correctly record biathlon shooting).
{% if specific_guidelines %}
## Specific guidelines
{{ specific_guidelines }}

---
{% endif %}

{% if instance_methodics %}
{% for methodic in instance_methodics %}
## {{ methodic.labelTranslated }}
{% if methodic.label == "header.navigation.instructions" %}
{{ methodic.content }}
{% elif methodic.label == "header.navigation.tipsAndTricks" %}
More tips and tricks on how to use Yarmill effectively and to its full potential can be found at the following link:
{% endif %}
URL: {{ methodic.url }}

---
{% endfor %}
{% endif %}
{% endif %}
