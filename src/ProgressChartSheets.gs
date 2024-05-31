function getProgressChartRange(sheet) {
  let firstRow = 2
  let lastRow = sheet.getLastRow()
  let lastColumn = sheet.getLastColumn()

  return sheet.getRange(firstRow, 1, lastRow - 1, lastColumn)
}

function addChartSheetIfDoesntExist(name, fn) {
  let chartSheet = SpreadsheetApp.getActive().getSheetByName(name)

  if (!chartSheet) {
    eval(fn)()
  }
}

function addCompletionProgressChartSheet() {
  let ss = SpreadsheetApp.getActive()

  let chartSheet = ss.getSheetByName("Progress (Chart staging)")
  let dataSheet = ss.getSheetByName("History (%)")

  let dataRange = getProgressChartRange(dataSheet)

  let chart = chartSheet.newChart()
    .setChartType(Charts.ChartType.LINE)
    .addRange(dataRange)
    .setPosition(1, 1, 0, 0)
    .setNumHeaders(1)
    .setOption("height", 438)
    .setOption("width", 1855)
    .setOption("title", "Completion")
    .setOption("series", {0: {color: "#FF00FF", lineWidth: 5}})
    .setOption("lineWidth", 3)
    .setOption("legend.position", "bottom")
    .build()

  chartSheet.insertChart(chart)

  let objectSheet = SpreadsheetApp.getActive().moveChartToObjectSheet(chart);
  objectSheet.setName("Completion progress")
}

function addPlaythroughsProgressChartSheet() {
  let ss = SpreadsheetApp.getActive()

  chartsSheet = ss.getSheetByName("Progress (Chart staging)")
  dataSheet = ss.getSheetByName("History (#)")

  let dataRange = getProgressChartRange(dataSheet)

  let chart = chartsSheet.newChart()
    .setChartType(Charts.ChartType.STEPPED_AREA)
    .addRange(dataRange)
    .setPosition(22, 1, 0 ,0)
    .setNumHeaders(1)
    .setOption("height", 416)
    .setOption("width", 1007)
    .setOption("title", "Playthroughs")
    .setOption("areaOpacity", 0.5)
    .setOption("series", {0: {color: "#FBBC04"}, 1: {color: "#4285F4"}, 2: {color: "#34A853"}})
    .setOption("legend.position", "bottom")
    .build()

  chartsSheet.insertChart(chart)

  let objectSheet = SpreadsheetApp.getActive().moveChartToObjectSheet(chart);
  objectSheet.setName("Playthroughs progress")
}

function addTempoProgressChartSheet() {
  let ss = SpreadsheetApp.getActive()
  chartsSheet = ss.getSheetByName("Progress (Chart staging)")
  dataSheet = ss.getSheetByName("History (Tempo)")

  let dataRange = getProgressChartRange(dataSheet)

  let one_month_diff_color = "#1155CC"
  let approx_time_color = "#E06666"

  let chart = chartsSheet.newChart()
    .setChartType(Charts.ChartType.LINE)
    .addRange(dataRange)
    .setPosition(22, 11, 0, 0)
    .setNumHeaders(1)
    .setOption("height", 416)
    .setOption("width", 845)
    .setOption("title", "Tempo")
    .setOption("series", {0: {color: one_month_diff_color}, 1: {color: approx_time_color, targetAxisIndex: 1}})
    .setOption("vAxes", {0: {textStyle: {bold: true, color: one_month_diff_color}}, 1: {textStyle: {bold: true, color: approx_time_color}}})
    .setOption("lineWidth", 3)
    .setOption("legend.position", "bottom")
    .build()

  chartsSheet.insertChart(chart)

  let objectSheet = SpreadsheetApp.getActive().moveChartToObjectSheet(chart);
  objectSheet.setName("Tempo progress")
}

function updateCompletionProgressChart() {
  let ss = SpreadsheetApp.getActive()
  let sheet = ss.getSheetByName("Completion progress")

  if (sheet) {
    ss.deleteSheet(sheet)
  }

  addCompletionProgressChartSheet()
}

function updateProgressChartSheets() {
  updateCompletionProgressChart()

  addChartSheetIfDoesntExist("Playthroughs progress", "addPlaythroughsProgressChartSheet")
  addChartSheetIfDoesntExist("Tempo progress", "addTempoProgressChartSheet")

  resetSheetList()
}