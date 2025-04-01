# Table of contents
- [Table of contents](#table-of-contents)
  - [Workflow](#workflow)
  - [Project structure](#project-structure)
  - [Project configuration](#project-configuration)
    - [0. Desired code structure (approx.)](#0-desired-code-structure-approx)
    - [1. Configurare frontend](#1-configurare-frontend)
    - [2. Configurare backend](#2-configurare-backend)
    - [3. Baza de date](#3-baza-de-date)
    - [4. Instalare dependente si rulare proiect](#4-instalare-dependente-si-rulare-proiect)
    - [5. Testare automata](#5-testare-automata)
    - [6. Testare API](#6-testare-api)
  - [Resurse de invatare](#resurse-de-invatare)
    - [Django](#django)
    - [React](#react)
    - [PostgreSQL](#postgresql)

## Workflow

1. Trello task clarification
2. Coding steps (adapt to task)
      - create new branch
      - find examples & chatGPT
      - minigame considerations (care sunt aplicabile)
        - 2 moduri: unul oficial care va fi luat in considerare pentru statistici si unul de antrenament in care poti sa-ti selectezi nivelul si sa joci de cate ori vrei tu **doar** acel nivel
        - jocurile pot avea vieti si sa accepte un numar limitat de greseli
        - setati nivelul de la care sa inceapa boss music (daca e aplicabil)
        - integrate offline play
        - integrare acceptance criteria de pe Trello
        - fiecare operatie va fi luata in calcul pentru 2 tipuri de useri: autentificat si neautentificat
        - **important**: cat timp functionalitatea de autentificare nu este implementata, faceti in asa fel sa aveti un user local (cu date in el sau `null`) si sa-l folositi in aplicatie, urmand ca dupa ce se va implementa sa modificati cat mai putin programul (valabil si in frontend si in backend); se generalizeaza pentru alte functionalitati (muzica etc.)
        - stabilire cum arata statisticile (pentru tabela din baza de date)
      - creare frontend & 3rd party libraries
      - creare backend: considerare tipuri de useri, testare prin afisare
      - definire tabela in baza de date
      - testare
3. Add comments to code & commit
4. Testing: **Complex hand testing** & Postman testing
5. Push the branch to GitHub (to prevent code deletion from **conflicts**) & **announce `.env` file change**
6. Create **pull request** (no deletion) & merge to main & announce the teammates
7. Pull the main branch code locally & run `npm run install`

## Project structure

- Proiectul va consta in diferite jocuri care sa dezvolte abilitati congnitive. Pentru asta vom avea o pagina principala (+ cele de autentificare), o pagina cu toate jocurile din care user-ul sa-si aleaga, o pagina cu statistici pentru fiecare joc in parte si cate o pagina speciala pentru fiecare joc.
- Fiecare joc are asociata o pagina, un endpoint unde se duc rezultatele si o tabela in baza de date in care se stocheaza datele.
- Userii sunt de 2 tipuri: autentificati si neautentificati.

## Project configuration
### 0. Desired code structure (approx.)
```
fullstack-app/
│── server/                    # Django backend
│   ├── manage.py              # Django project manager
│   ├── tests/                 # Django tests
│   ├── server/                # Main Django project settings
│   │   ├── __init__.py
│   │   ├── settings.py        # Django settings
│   │   ├── urls.py            # URL routing
│   │   ├── wsgi.py
│   │   ├── asgi.py
│   ├── api/                   # Django app handling APIs
│   │   ├── __init__.py
│   │   ├── models.py          # Database models
│   │   ├── views.py           # API logic (class-based/views)
│   │   ├── serializers.py     # Convert models to JSON
│   │   ├── urls.py            # API-specific URLs
│   │   ├── permissions.py     # Custom permissions
│   │   ├── tests.py           # Unit tests
│── frontend/                  # React frontend
│   ├── public/                # Static assets (images, favicons, fonts etc.)
│   ├── src/                   # Main React source code
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom hooks
│   │   ├── tests/             # Custom tests
│   │   ├── context/           # React Context API
│   │   ├── services/          # API calls (fetching Django REST API)
│   │   ├── App.js             # Main React component
│   │   ├── index.js           # React entry point
│── .env                       # Environment variables
│── .gitignore                 # Git ignore file
│── package.json               # Frontend dependencies
│── README.md                  # Project documentation
```

### 1. Configurare frontend
Installer-ul `nvm` (care vine de la node version manager) este folosit sa instalati toate chestiile legate de NodeJS; noi avem nevoie doar de `npm` cu care instalam React si diferite biblioteci 3rd party pentru el
- [Windows](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/)

- MacOS si Linux:
```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash
```

```sh
# Verificati daca s-a instalat corect ruland:
nvm -v # trebuie sa va afiseze versiunea
```

Acum instalam NodeJS si `npm`:

```sh
# Download and install Node.js:
nvm install 22

# Verify the Node.js version:
node -v

# Verify npm version:
npm -v
```

### 2. Configurare backend
- Instalati `pip` global (probabil il aveti deja de la PA). Verificati cu urmatoarea comanda:
```sh
pip --version
```

- Instalati `pipenv` pentru automatizarea dependentelor (cu el vom instala django si alte pachete utile; un fel de `npm`):
```sh
pip install pipenv
```



### 3. Baza de date
- Instalati-va PostgreSQL. Am incredere ca va descurcati. Ca sa testati, rulati:
```sh
psql -h centerbeam.proxy.rlwy.net -U postgres -p 10086 -d railway
```
- Dupa asta, o sa va ceara o parola pe care o gasiti in `.env` comentata. Daca merge, felicitari, iesiti din terminal cu `exit`.
- De asemenea, am facut migratiile initiale asa ca exista deja niste tabele in baza de date (nu stiu care-i treaba cu ele). Ele sunt integrate deja in **workflow**.
- Migratii (nu cred ca o sa foloseasca ca avem aceeasi baza de date):
```sh
  # deschideti folderul `server` din proiect in terminal sau cmd
  python manage.py makemigrations
  python manage.py migrate
```

### 4. Instalare dependente si rulare proiect
- Am instalat React cu framework-ul **Vite** special configurat pentru Typescript, iar Django cu `pipenv`. Tot ce trebuie voi sa faceti e sa instalati pachetele local (care vor fi intr-un folder numit `node_modules` ce nu va aparea in github (in `client`), respectiv `.venv` (in `server`)). Pentru asta, deschideti intr-un terminal / cmd proiectul si rulati:

```sh
npm run install
```

- Creati in directorul proiectului un fisier numit `.env`. In el vom stoca parole, string-uri de conexiune etc. folositoare aplicatiei. Daca il creati unde v-am spus eu, nu va fi pus pe GitHub ci va fi ignorat automat de `git`. Continutul lui vi-l voi pune pe whapp.

- Pentru a vedea proiectul in actiune, deschideti 2 terminale in directorul proiectului si rulati:
```sh
cd server && pipenv shell
python manage.py runserver
```
apoi introduceti in URL link-ul http://localhost:8000/api,

respectiv

```sh
cd client && npm run dev
```
apoi introduceti in URL link-ul din terminal.

> **IMPORTANT**: Inainte de fiecare primă executare a server-ului (**doar prima**) rulati se va rula `pipenv shell` ca sa puteti activa environment-ul virtual de python. Am facut asa pentru ca python-ul de pe calculatoarele voastre sa nu fie umplut aiurea de pachete pe care le veti folosi doar la acest proiect si sa va ocupe spatiu (tot va ocupa tho, ca trb sa setati un flag, dar e mai usor de eliberat). Asa, cu aceasta comanda doar setati environment-ul de python corespunzator proiectului si rulati python-ul lui, fara sa fie afectat cel principal.

### 5. Testare automata
Pentru Django, toate testele vor fi scrise in folderul `server/tests` apoi rulate cu:
```sh
pipenv run pytest -v
```

Pentru React, vom folosi Vitest (probabil si alte pachete). Ele vor fi scrise in formatul `nume.test.ts` in folderul `tests` din `client/src` si rulate cu:
```sh
npm run test
```

### 6. Testare API
- Pentru a testa backend-ul vom folosi Postman, o aplicatie care poate fi accesata din browser si cu care se poate testa rapid un API. In plus, se poate face instant si documentatia la acel API.
- V-am trimis invitatii pe email pentru workspace-ul in care vom testa acest API.

## Resurse de invatare
- In principiu, vom invata cu totii din mers si cu ChatGPT, asa ca aici va pun doar asa la misto niste chestii.
### Django
- https://www.w3schools.com/django/
### React
- https://www.w3schools.com/REACT/DEFAULT.ASP
### PostgreSQL
- https://gist.github.com/Kartones/dd3ff5ec5ea238d4c546
