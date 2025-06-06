# FarDust Landing Page 🚀

Welcome to the source code for **FarDust**'s personal landing page. This single page application is built with [Angular](https://angular.io/) and deployed through Firebase Hosting.

## ✨ Features

- Lazy loaded modules for `home`, `experience` and `projects`.
- Fetches GitHub profile data and visitor country via RxJS services.
- Styled with TailwindCSS, Bootstrap and FontAwesome.
- PWA ready thanks to the Angular Service Worker.
- Continuous deployment to Firebase using GitHub Actions.
- Merged or closed pull requests automatically remove their preview channels.

## 🛠️ Development

Install dependencies and start the dev server:

```bash
npm install
npm start
```

Navigate to `http://localhost:4200/` and the app will reload on file changes.

## 🧪 Tests

Run unit tests with Karma:

```bash
npm test
```

## 🚀 Deployment

Build and deploy to Firebase Hosting:

```bash
npm run build
npm run deploy
```

## 🔧 Angular CLI Cheat Sheet

```bash
ng serve            # Start the dev server
ng generate component <name>
ng generate service <name>
ng test             # Run unit tests
ng lint             # Lint and fix code
ng build --configuration production
npm run deploy      # Deploy to Firebase
```

### Personal section

Set `personalInfoUrl` in `src/environments/environment.ts` to the Cloud Run
endpoint that returns your private bio. The personal section shows a short
public summary by default and automatically fetches additional details when a
valid token is available. The token will be sent as a `token` query parameter
(e.g. `?token=YOUR_TOKEN`) and persisted in a `personal_token` cookie so you
don't have to re-enter it.

## 📚 Learn More

Check the source code for examples of Angular modules, components and RxJS usage. Feel free to explore the project and modify it to suit your own portfolio! 💻

