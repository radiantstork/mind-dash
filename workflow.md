# Table of contents
- [Table of contents](#table-of-contents)
  - [Workflow](#workflow)
  - [Project configuration](#project-configuration)
    - [0. Desired code structuring (approx.)](#0-desired-code-structuring-approx)
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

1. Trello task clarification & third party libraries & design patterns
2. Coding support
     - use https://humanbenchmark.com/ for guidance
     - 2 moduri (daca e aplicabil): unul oficial care va fi luat in considerare pentru statistici si unul de antrenament in care poti sa-ti selectezi nivelul si sa joci de cate ori vrei tu doar acel nivel
     - jocurile pot avea vieti si sa accepte un numar limitat de greseli
     - integrate offline play
3. Add comments & commit the changes after each task
4. Testing: **Hand testing** & Postman testing & automated testing
5. Migrations (if needed)
```sh
  # deschideti folderul `server` din proiect in terminal sau cmd
  python manage.py makemigrations
  python manage.py migrate
```
6. Push the branch to GitHub (to prevent code deletion from **conflicts**) & **announce `.env` file change**
7. Create **pull request** (no deletion) & merge to main & announce the teammates
8. Pull the main branch code locally & run `npm install`

---

## Project configuration
### 0. Desired code structuring (approx.)
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
- Dupa asta, o sa va ceara o parola pe care o gasiti in `server/.env` comentata. Daca merge, felicitari, iesiti din terminal cu `exit`.
- De asemenea, am facut migratiile initiale asa ca exista deja niste tabele in baza de date (nu stiu care-i treaba cu ele). Ele sunt integrate deja in **workflow**.


### 4. Instalare dependente si rulare proiect
Am instalat React cu framework-ul **Vite** special configurat pentru Typescript, iar Django cu `pipenv`. Tot ce trebuie voi sa faceti e sa instalati pachetele local (care vor fi intr-un folder numit `node_modules` ce nu va aparea in github (in `client`), respectiv `.venv` (in `server`)). Pentru asta, deschideti intr-un terminal / cmd proiectul si rulati:

```sh
npm install
```

- Creati in directorul proiectului un fisier numit `.env`. In el vom stoca parole, string-uri de conexiune etc. folositoare aplicatiei. Daca il creati unde v-am spus eu, nu va fi pus pe GitHub ci va fi ignorat automat de `git`. Continutul lui vi-l voi pune pe whapp.

- **IMPORTANT**: Inainte de fiecare primă executare a proiectului rulati
```sh
npm run prepare
```
ca sa puteti activa environment-ul virtual de python. Am facut asa pentru ca python-ul de pe calculatoarele voastre sa nu fie umplut aiurea de pachete pe care le veti folosi doar la acest proiect si sa va ocupe spatiu (tot va ocupa tho ca trb sa setati un flag, dar e mai usor de eliberat). Asa, cu aceasta comanda doar setati environment-ul de python corespunzator proiectului si rulati python-ul lui, fara sa fie afectat cel principal.

- Pentru a vedea proiectul in actiune (frontend si backend in acelasi terminal), creati un fisier `.env` in `server` si puneti continutul de pe whapp in ea, apoi rulati rulati:
```sh
npm run dev
```

- **Daca vreti separat** (recomandat), deschideti 2 terminale si rulati in fiecare o comanda:
```sh
npm run start_server
npm run start_client
```

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
