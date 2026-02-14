<div align="center">
  <img width="1200" alt="Arabic MorphoLab Banner" src="https://via.placeholder.com/1200x400/10b981/ffffff?text=Arabic+MorphoLab" />
  <h1>Arabic MorphoLab</h1>
  <p><strong>Application web full-stack moderne pour l’analyse, la génération et la validation morphologique de la langue arabe</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Java-25_LTS-orange" alt="Java" />
    <img src="https://img.shields.io/badge/Spring_Boot-3.x-green" alt="Spring Boot" />
    <img src="https://img.shields.io/badge/React-19-blue" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.x-blue" alt="TypeScript" />
  </p>
</div>

---

## 📌 Présentation

**Arabic MorphoLab** est une application de recherche et d’ingénierie linguistique dédiée à la **morphologie arabe**. Elle permet d’analyser, générer et valider automatiquement des formes dérivées à partir de **racines trilitères** et de **schèmes morphologiques (أوزان)**.

Le projet combine des **structures de données avancées**, une **logique linguistique formelle** et une **architecture web moderne full-stack**.

---

## ✨ Fonctionnalités clés

* 🔹 Génération d’un mot dérivé à partir d’une racine + schème
* 🔹 Génération complète de **tous les dérivés possibles**
* 🔹 Validation morphologique (racine + mot)
* 🔹 Détection automatique du schème
* 🔹 Gestion des racines faibles (مثال، أجوف، ناقص، لفيف)
* 🔹 Historique des mots validés avec fréquence d’apparition
* 🔹 Visualisation interne via **Arbre AVL** et **Table de hachage**
* 🔹 Interface d’administration pour les règles de transformation

---

## 🧠 Architecture & Technologies

### Backend

* **Java 25 (LTS)**
* **Spring Boot 3.x**
* API REST
* Structures personnalisées : AVL Tree, Hash Table manuelle
* Chargement dynamique depuis fichiers `.txt`

### Frontend

* **React 19**
* **TypeScript**
* UI modulaire (onglets génération / validation / transformations)
* Appels API centralisés

---

## 📦 Prérequis

* Java **25 LTS** ou supérieur
* Maven **3.6+**
* Node.js **18+** (testé avec Node 24)
* Navigateur moderne (Chrome ou Firefox recommandé)

---

## 🚀 Installation & Lancement

### 1️⃣ Cloner le projet

```bash
git clone https://github.com/REZGUI/arabic-morpholab.git
cd arabic-morpholab
```

### 2️⃣ Lancer le backend (Spring Boot)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

API disponible sur :

```
http://localhost:8080
```

---

### 3️⃣ Lancer le frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Application accessible sur :

```
http://localhost:3000
```

---

## 🗂️ Structure du projet

```
arabic-morpholab/
├── backend/
│   ├── Controller/
│   ├── IService/
│   ├── Service/
│   ├── model/
│   ├── storage/
│   ├── util/
│   └── resources/
│       ├── racines.txt
│       ├── schemes.txt
│       └── transformations.txt
├── frontend/
│   ├── components/
│   ├── services/
│   ├── types.ts
│   └── App.tsx
├── README.md
└── .gitignore
```

---

## ⚡ Utilisation rapide

### Génération

1. Choisir une racine (ex : كتب)
2. Choisir un schème (ex : فاعل)
3. Générer un mot ou tous les dérivés

### Validation

* Racine + mot → validation + détection du schème

### Administration

* CRUD des règles de transformation pour racines faibles

---

## 🔗 Endpoints API principaux

* `GET /api/morphology/roots`
* `GET /api/morphology/schemes`
* `GET /api/morphology/debug/tree`
* `GET /api/morphology/debug/hash`
* `GET /api/morphology/admin/transformations`

---

## 🛠️ Dépannage courant

### Problème CORS

* Vérifier `CorsConfig.java`
* Vérifier l’origine `http://localhost:3000`

### Données non chargées

* Vérifier les fichiers `.txt` dans `resources/`
* Consulter les logs Spring Boot au démarrage

---

## 🔮 Améliorations futures

* Authentification JWT
* Base de données (H2 / PostgreSQL)
* Support des harakāt (diacritiques)
* Export CSV / PDF
* Tests unitaires (JUnit, Jest)
* Docker & CI/CD GitHub Actions

---

## 📜 Licence

MIT License

---

## 👤 Auteur


Tunis — 2025 / 2026
Projet académique & recherche en linguistique computationnelle arabe

⭐ Contributions et issues bienvenues !
