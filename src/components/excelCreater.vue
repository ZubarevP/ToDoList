<template>
  <div class="wrapper">
    <h3 class="h3">отчет</h3>
    <div>
      <div class="i">прошлая неделя:</div>
      <input 
        class="field date" 
        type="date" 
        v-model="past.start"
        title="начало периода"
      >
      <input 
        class="field date" 
        type="date" 
        v-model="past.end"
        title="конец периода"
      >
    </div>
    <div>
      <div class="i">текущая неделя:</div>
      <input 
        class="field date" 
        type="date" 
        v-model="now.start"
        title="начало периода"
      >
      <input 
        class="field date" 
        type="date" 
        v-model="now.end"
        title="конец периода"
      >
    </div>
    <button
      class="btn"
      title="скачать отчет в формате xlsx"
      @click="createFile"
    >скачать</button>
  </div>
</template>

<script>
  import { mapActions } from "pinia";
  import { useTaskStore } from "@/stores/task.js"; 
  import  ExcelJS  from "exceljs";

  const COLUMN_CONTENT_WIDTH = 60;
  const ROW_HEIGHT = 13;

  export default {
    mounted() {
      let one, two, three, four;
      const now = new Date().getDay();
      if(!now) {
        this.past.start = this.getDate(13, "-");
        this.past.end   = this.getDate(9,  "-");
        this.now.start  = this.getDate(6,  "-");
        this.now.end    = this.getDate(2,  "-");
      } else {
        this.past.start = this.getDate((6 + now), "-");
        this.past.end   = this.getDate((now + 2), "-");
        this.now.start  = this.getDate((now - 1), "-");
        this.now.end    = this.getDate((5 - now), "+");
      }
    },

    data() {
      return {
        past: {
          start: "",
          end: "",
          active: "all",
        },
        now: {
          start: "",
          end: "",
          active: "active",
        },
      };
    },
    methods: {
      ...mapActions(useTaskStore, [
        'getList',
      ]),

      getDate(value, sign) {
        const day = 24 * 60 * 60 * 1000;
        const lhs = Date.now();
        const rhs = value * day;
        let result;
        switch(sign) {
          case "+": result = new Date(lhs + rhs); break;
          case "-": result = new Date(lhs - rhs); break;
        } 
        return result
          .toLocaleDateString("ru-RU")
          .split(".")
          .reverse()
          .join("-");
      },

      fillBorder(thickness, color) {
        return {
          top:    { style: thickness, color: { argb: color} },
          left:   { style: thickness, color: { argb: color} },
          bottom: { style: thickness, color: { argb: color} },
          right:  { style: thickness, color: { argb: color} },
        };
      },

      fillTitleCell(cell, title, backgroundColor, rotate = 0) {
        cell.value      = title;
        cell.alignment  = {
          horizontal: 'center',
          vertical:   'middle',
          textRotation: rotate,
        };
        cell.fill = {
          type:       "pattern",
          pattern:    "solid",
          fgColor: { argb: backgroundColor},
        };
        cell.border = this.fillBorder("medium", "FF000000");
        cell.font = {
          name: "Arial",
          family: 2,
          size: 10,
          bold: true,
        };
      },

      fillCell( cell ) {
        cell.alignment  = {
          horizontal: 'left',
          vertical: 'top',
          wrapText: true,
        };
        cell.border = this.fillBorder("thin", "FF000000");
        cell.font = {
          name: "Arial",
          family: 2,
          size: 10,
          bold: false,
        }
      },

      fillLine(sheet, array, numCol, taskCol, startLine, startDate) {
        array.forEach((el, i)=>{
          const numCell = sheet.getCell(`${numCol}${startLine + i}`);
          numCell.value = i + 1;
          numCell.font.bold = true;
          const taskCell = sheet.getCell(`${taskCol}${startLine + i}`);
          const description = el.description ? ` (${el.description})`: ""
          taskCell.value = el.name + description;

          if(new Date(startDate).valueOf() < el.createDate) {
            taskCell.fill = {
              type:       "pattern",
              pattern:    "darkTrellis",
              fgColor: { argb: "FFFFFF00"},
            };
          }

          taskCell.font = {
            strike: el.active,
          };
        });
      },

      constructSheet(sheet, set) {
        const listsNames = [
          'listBottomRight',
          'listTopRight',
          'listBottomLeft',
          'listTopLeft',
        ];

        for(let i = 0; i < listsNames.length; i++) {
          this[listsNames[i]] = this.getList( i, set.active, set.start, set.end );
        }

        const heightOfBlock = Math.max(
          this.listTopLeft.length,
          this.listTopRight.length,
          10
        );

        sheet.columns = [
          {width: 4},
          {width: 4},
          {width: COLUMN_CONTENT_WIDTH},
          {width: 4},
          {width: COLUMN_CONTENT_WIDTH}
        ];

        ['A', 'B', 'C', 'D', 'E'].forEach(el=>{
          for(let i = 1; i <= (2 * heightOfBlock + 2); i++) {
            this.fillCell(sheet.getCell(`${el}${i}`));
          }
        });

        sheet.mergeCells('B1:C1');
        sheet.mergeCells('D1:E1');
        sheet.mergeCells(`B${heightOfBlock + 2}:C${heightOfBlock + 2}`);
        sheet.mergeCells(`D${heightOfBlock + 2}:E${heightOfBlock + 2}`);
        sheet.mergeCells(`A2:A${heightOfBlock + 1}`);
        sheet.mergeCells(`A${heightOfBlock + 3}:A${2 * heightOfBlock + 2}`);

        const topLeft     = sheet.getCell('B1')
        const topRight    = sheet.getCell('D1');
        const bottomLeft  = sheet.getCell(`B${heightOfBlock + 2}`);
        const bottomRight = sheet.getCell(`D${heightOfBlock + 2}`);
        const asideTop    = sheet.getCell('A2');
        const asideBottom = sheet.getCell(`A${heightOfBlock + 3}`);

        [
          [ topLeft,      "СРОЧНО",             "FFFA6868", 0  ],
          [ topRight,     "НЕ СРОЧНО",          "FFF9CB9C", 0  ],
          [ bottomLeft,   "СРОЧНО/НЕ ВАЖНО",    "FFE19009", 0  ],
          [ bottomRight,  "НЕ СРОЧНО/НЕ ВАЖНО", "FFFFE599", 0  ],
          [ asideTop,     "ВАЖНО",              "FFFA6868", 90 ],
          [ asideBottom,  "НЕ ВАЖНО",           "FFE19009", 90 ],
        ].forEach(el=>this.fillTitleCell(...el));

        
        this.fillLine(sheet, this.listTopLeft,     'B', 'C', 2, set.start);
        this.fillLine(sheet, this.listTopRight,    'D', 'E', 2, set.start);
        this.fillLine(sheet, this.listBottomLeft,  'B', 'C', heightOfBlock + 3, set.start);
        this.fillLine(sheet, this.listBottomRight, 'D', 'E', heightOfBlock + 3, set.start);

      },

      getNumOfStrings(value) {
        if(!value) return 1;
        return value / COLUMN_CONTENT_WIDTH + (value % COLUMN_CONTENT_WIDTH ? 1 : 0);
      },

      setHightOfRow(sheet) {
        sheet.eachRow((row, num)=>{
          const firstCell  = row.getCell(3).value;
          const secondCell = row.getCell(5).value;
          let amount = 1;
          if( typeof(firstCell) === "string") {
            const result = 
              this.getNumOfStrings(firstCell.length);
            amount = Math.max(amount, result);
          }

          if(typeof(secondCell) === "string") {
            const result = 
              this.getNumOfStrings(secondCell.length);
            amount = Math.max(amount, result);
          }
          row.height = amount * ROW_HEIGHT;
        });
      },

      createFile() {
        const workbook = new ExcelJS.Workbook();

        const newSheet = workbook.addWorksheet(
          this.getDateRangeStr(this.now.start, this.now.end),
          { 
            properties: { tabColor: {argb: "FF00FF00"}, }, 
            pageSetup: {paperSize: 9, orientation: "landscape"},
          }
        );

        const oldSheet = workbook.addWorksheet(
          this.getDateRangeStr(this.past.start, this.past.end),
          { 
            properties: { tabColor: {argb: "FFAAAAAA"}, }, 
            pageSetup: {paperSize: 9, orientation: "landscape"},
          }
        );

        this.constructSheet(newSheet, this.now);
        this.constructSheet(oldSheet, this.past);

        this.setHightOfRow(newSheet);
        this.setHightOfRow(oldSheet);

        workbook.xlsx.writeBuffer({base64: true})
          .then(xls64=>{
            const link = document.createElement("a");
            const data = new Blob([xls64], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
            });
            const url = URL.createObjectURL(data);
            link.href = url;
            link.download = `Матрица Зубарев П.И. ${this.getDateRangeStr(this.now.start, this.now.end)}.xlsx`;
            document.body.appendChild(link);
            link.click();
            setTimeout(()=>{
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
            }, 0);
          })
      },

      getDateRangeStr(lhs, rhs) {
        return `${this.dateToStr(lhs)} - ${this.dateToStr(rhs)}`;
      },

      dateToStr(value) {
        return new Date(value).toLocaleDateString("ru-RU")
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "@/assets/variables";

  .wrapper {
    margin-top: 25px;
  }

  .h3 {
    text-align: center;  
  }

  .field {
    margin-top: 10px;
    border: none;
    outline: none;
    background-color: #e3e8e8;
    border-radius: 3px;
    width: 95%;
    padding: 2px 5px;
    opacity: .7;

    &:hover {
      opacity: 1;
    }

    & + & {
      margin-top: 5px;
    }
  }

  .i {
    text-align: center;
    font-style: italic;
  }

  .btn {
    display: block;
    border: none; 
    padding: 5px 15px;
    background-color: #7e74d2;
    color: white;
    margin: 10px auto;
    opacity: .7;

    &:hover {
      opacity: 1;
    }
  }
</style>
