# NestJS-Auth-System

**NestJS를 활용한 사용자 인증과 권한 관리 시스템 구현**

## 설치

```bash
$  npm  install
```

## 실행

```bash
# watch mode
$  npm  run  start:dev

# production mode
$  npm  run  start:prod
```

## .env

```.env
#app
PORT=
SECRET_KEY=
DB_USERNAME=
DB_PASSWORD=
DB_HOST=
DB_PORT=
DB_NAME=

#db
MYSQL_DB=
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_DATA_PATH=
MYSQL_CUSTOM_CONFIG_PATH=
MYSQL_INIT=
MYSQL_TZ=
```

## 주요 기능

**1. 회원가입 API**
Body를 통해 email, password, username를 받아 회원가입을 합니다.
이메일은 중복되지 않습니다. 또한 비밀번호는 bcrypt 패키지를 사용하여 암호화하였습니다.

**2. 로그인 API**
Body를 통해 email, password를 받아 로그인을 합니다.
로그인 성공 시 JWT 토큰을 발급합니다.

**3. 로그아웃 API**
response.clearCookie('jwt') 를 사용하여 로그아웃을 합니다.

**4. 회원정보 변경 API (비밀번호 변경)**
로그인한 사용자는 비밀번호를 변경합니다.
새로운 비밀번호 또한 bcrypt 패키지를 사용하여 암호화하였습니다.

Body에 email과 passowrd를 같이 보내지만 email를 변경하고자 하는 것이 아닌 추후 비밀번호 뿐만 아니라 다른 정보를 변경한다고자 할 때를 위한 예시입니다.

**5. 회원 목록 조회 API**
현재 로그인한 회원이 권리자일 경우, 조회 가능합니다.
시스템에 등록된 회원 목록을 조회할 수 있습니다.
비밀번호를 제외한 모든 회원 정보를 담고 있습니다.

**6. 회원 권한 변경 API**
관리자 -> 일반 회원, 일반 회원 -> 관리자  
이처럼 현재 로그인 되어 있는 회원의 권한을 변경하는 api입니다.  
DB에서 직접 수정하는 수고를 덜고자 만들었습니다.

만약, production 시, api 삭제 또는 수정이 필요합니다.

## API 명세서

PostMan를 사용한 API 명세서
[API 명세서](https://documenter.getpostman.com/view/28119606/2s9Yytffgg#e4ef4cae-afa4-49da-b2a7-773ce5fb24ed)
