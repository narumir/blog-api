# blog-api server

[blog](https://narumir.io)에 사용되는 blog api server 프로젝트 입니다.

## 요구사항

* NodeJS >= 20
* npm >= 10.8.2
* postgreSQL >= 16

## 환경변수

name                  | required | default     | description
----------------------|----------|-------------|-------------
PORT                  | X        | 4000        | 서버 포트번호
NODE_ENV              | X        | development | 운영 환경
DATABASE_HOST         | O        | N/A         | 데이터베이스 주소
DATABASE_PORT         | X        | 5432        | 데이터베이스 포트번호
DATABASE_USERNAME     | O        | N/A         | 데이터베이스 유저명
DATABASE_PASSWORD     | O        | N/A         | 데이터베이스 비밀번호
AUTH_SECRET           | O        | N/A         | 사용자 비밀번호 암호화 값
ACCESS_TOKEN_SECRET   | O        | N/A         | AccessToken 암호화 값
REFRESH_TOKEN_SECRET  | O        | N/A         | RefreshToken 암호화 값

## 시작하기

* 위 환경변수 값을 참고하여 ```.env``` 파일 생성하거나 환경변수로 지정
* 필요 패키지 설치
```bash
$ npm install
```
* api 개발 서버 실행
```bash
$ npm run start:dev
```
* swagger 페이지 접속 및 테스트

[http://localhost:4000/api](http://localhost:4000/api)

## 모듈 정보

name                           | description
-------------------------------|------------
[article](./article/readme.md) | 게시글 관리
[auth](./auth/readme.md)       | 사용자 인증 및 가입, 탈퇴
[health](./health/readme.md)   | health checker
[member](./member/readme.md)   | 사용자 관리

## 배포 방법

github repository에서 릴리즈를 버전 명으로 태그(예, v0.0.1)를 생성하면 github action을 통해서 ghcr에 컨테이버 이미지가 자동으로 배포됩니다.
