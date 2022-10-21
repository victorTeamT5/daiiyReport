# Daily Report Generator

### .env

```
DEPARTMENT='RD'
NAME=
STARTWORK='9:00'
OFFWORK='18:00'
STARTBREAK='12:00'
OFFBREAK='13:00'
WORKAM=           // 早上工作項目(可以用逗號區分
WORKPM=           // 下午工作項目(可以用逗號區分
```

### How to use.

1. install dependencies

```shell
yarn
```

2. setup .env file and use (input date type and date(ex: 20220101 or 2022/01/01 or 2022-01-01) to Generate daily report.

```shell
node build.js
```
