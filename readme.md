# 1101 Questions

## Run Parse server

```sh
docker compose up
```

## Parse dashboard

### On Mac

add `127.0.0.1 parse` to `/etc/hosts`

### On Windows

add `127.0.0.1 parse` to `C:\Windows\System32\drivers\etc/hosts`

Open <http://localhost>

## SETUP DB - First time

1. Login in to Dashboard <http://localhost>
2. Click Jobs
3. Execute "seedDataBase"

DevNote: Schema-Setup is in parse-server/cloud/main.js (restart Parse-Container after changes, run Seeding again)

## Parse documentation

<https://docs.parseplatform.org>

## Ionic app

```sh
cd question_app
npm install
ionic s
```

Open <http://localhost:8100>
