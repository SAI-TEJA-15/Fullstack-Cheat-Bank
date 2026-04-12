## CheatBank Full Stack Setup

This project now includes:

- React frontend in [frontend](/d:/sub-2/full%20stack(fsad)/projects/cheatbank(main)/CheatBank/frontend)
- Spring Boot backend
- MySQL database
- JWT login/register
- `user` and `admin` roles
- cheat-sheet submission flow with admin approval

## Backend flow

- New users register as `user`
- Users can submit a cheat sheet from the `Add Cheat Sheet` page
- Submitted sheets are stored with `PENDING` status
- Admin reviews pending sheets in `/admin`
- When admin approves, the cheat sheet is published on the website

## Important backend files

- [backend/pom.xml](/d:/sub-2/full%20stack(fsad)/projects/cheatbank(main)/CheatBank/backend/pom.xml)
- [backend/src/main/resources/application.properties](/d:/sub-2/full%20stack(fsad)/projects/cheatbank(main)/CheatBank/backend/src/main/resources/application.properties)

## Important frontend files

- [frontend/package.json](/d:/sub-2/full%20stack(fsad)/projects/cheatbank(main)/CheatBank/frontend/package.json)
- [frontend/App.tsx](/d:/sub-2/full%20stack(fsad)/projects/cheatbank(main)/CheatBank/frontend/App.tsx)
- [frontend/services/apiService.ts](/d:/sub-2/full%20stack(fsad)/projects/cheatbank(main)/CheatBank/frontend/services/apiService.ts)

## MySQL setup

1. Create only the database in MySQL Shell.
2. Spring Boot will create the tables automatically with JPA.
3. On backend startup, Spring Boot also ensures there is:
   - one admin user
   - one approved sample cheat sheet

Default admin login:

- email: `admin@cheatbank.com`
- password: `admin123`

## Configuration

Frontend `.env` in `frontend/.env`:

```env
VITE_API_URL=http://localhost:8080/api
```

Frontend production `.env` in `frontend/.env.production`:

```env
VITE_API_URL=https://fullstack-cheat-bank-production.up.railway.app/api
```

Backend values are now set directly in [backend/src/main/resources/application.properties](/d:/sub-2/full%20stack(fsad)/projects/cheatbank(main)/CheatBank/backend/src/main/resources/application.properties):

```env
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/cheatbank?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_mysql_password
app.jwt.secret=change-me-in-production-change-me-in-production
app.jwt.expiration-ms=604800000
app.client-url=http://localhost:5173
```

Update `spring.datasource.password` with your real MySQL password before running the backend.

## Run locally

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
mvn spring-boot:run
```

If Maven is not installed, import [backend/pom.xml](/d:/sub-2/full%20stack(fsad)/projects/cheatbank(main)/CheatBank/backend/pom.xml) into IntelliJ or Spring Tools and run the `CheatBankApplication` class.

## Main API routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/cheat-sheets`
- `POST /api/cheat-sheets`
- `GET /api/cheat-sheets/pending`
- `POST /api/cheat-sheets/:id/approve`
- `POST /api/cheat-sheets/:id/reject`
