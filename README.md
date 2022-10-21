# Daily Report Generator

### .env

```
DEPARTMENT='RD'
NAME=
START_WORK='9:00'
OFF_WORK='18:00'
START_BREAK='12:00'
OFF_BREAK='13:00'
WORK_AM=                                          // 早上工作項目(可以用逗號區分
WORK_PM=                                          // 下午工作項目(可以用逗號區分
OUTPUT_FILENAME='[NAME]-[DEPARTMENT]-[DATE].docx' // 輸出檔名可以帶入環境變數的任意值
TEMPLATE_FILENAME='template.docx'
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
