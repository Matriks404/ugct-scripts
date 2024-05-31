function getStatusChartRanges(sheet, dataColumn) {
  let firstRow = 7
  let lastRow = getStatusPlaythroughsLastRow()
  let numberOfRows = lastRow - firstRow + 1

  let nameRange = sheet.getRange(firstRow, 1, numberOfRows)
  let dataRange = sheet.getRange(firstRow, dataColumn, numberOfRows)

  return {nameRange, dataRange}
}

function addAddedPlaythroughsChart() {
  let statusSheet = SpreadsheetApp.getActive().getSheetByName("Status")

  let {nameRange, dataRange} = getStatusChartRanges(statusSheet, 3)

  let chart = statusSheet.newChart()
    .setChartType(Charts.ChartType.PIE)
    .addRange(nameRange)
    .addRange(dataRange)
    .setPosition(1, 12, 70, 12)
    .setOption("height", 313)
    .setOption("width", 301)
    .setOption("title", "Added playthroughs")
    .setOption("titleTextStyle", {"bold": true})
    .setOption("pieHole", 0.33)
    .setOption("pieSliceBorderColor", "black")
    .build()

  statusSheet.insertChart(chart)
}

function addFinishedPlaythroughsChart() {
  let statusSheet = SpreadsheetApp.getActive().getSheetByName("Status")

  let {nameRange, dataRange} = getStatusChartRanges(statusSheet, 5)

  let chart = statusSheet.newChart()
    .setChartType(Charts.ChartType.PIE)
    .addRange(nameRange)
    .addRange(dataRange)
    .setPosition(16, 12, 70, 12)
    .setOption("height", 313)
    .setOption("width", 301)
    .setOption("title", "Finished playthroughs")
    .setOption("titleTextStyle", {"bold": true})
    .setOption("pieHole", 0.33)
    .setOption("pieSliceBorderColor", "black")
    .build()

  statusSheet.insertChart(chart)
}

function getStatisticsRange(name) {
  let sheet = SpreadsheetApp.getActive().getSheetByName("Statistics")

  let columns = {
    "Platform stats": 1,
    "Bought on": 4,
    "Rating": 7
  }

  let firstRow = 3
  let values = sheet.getRange(firstRow, columns[name], sheet.getLastRow() - firstRow + 1, 2).getValues()
  let lastRow = values.filter(String).length;

  return sheet.getRange(firstRow, columns[name], lastRow, 2)
}

function addPlatformsChart() {
  let ss = SpreadsheetApp.getActive()
  let statusSheet = ss.getSheetByName("Status")

  let dataRange = getStatisticsRange("Platform stats")

  let chart = statusSheet.newChart()
    .setChartType(Charts.ChartType.PIE)
    .addRange(dataRange)
    .setPosition(1, 15, 42, 12)
    .setOption("height", 492)
    .setOption("width", 508)
    .setOption("title", "Platforms")
    .setOption("titleTextStyle", {"bold": true})
    .setOption("pieHole", 0.4)
    .setOption("pieSliceBorderColor", "black")
    .setOption("legend.position", "bottom")
    .build()

  statusSheet.insertChart(chart)
}

function addBoughtOnChart() {
  let ss = SpreadsheetApp.getActive()
  let statusSheet = ss.getSheetByName("Status")
  let statisticsSheet = ss.getSheetByName("Statistics")

  let dataRange = getStatisticsRange("Bought on")

  let colors = dataRange.getBackgrounds().map(row => row[0])

  let chart = statusSheet.newChart()
    .setChartType(Charts.ChartType.PIE)
    .addRange(dataRange)
    .setPosition(25, 15, 42, 2)
    .setOption("height", 326)
    .setOption("width", 508)
    .setOption("title", "Bought on")
    .setOption("titleTextStyle", {"bold": true})
    .setOption("pieHole", 0.4)
    .setOption("pieSliceBorderColor", "black")
    .setOption("legend.position", "left")
    .setOption("colors", colors)
    .build()

  statusSheet.insertChart(chart)
}

function addGameRatingChart() {
  let ss = SpreadsheetApp.getActive()
  let statusSheet = ss.getSheetByName("Status")
  let statisticsSheet = ss.getSheetByName("Statistics")

  let dataRange = getStatisticsRange("Rating")

  let chart = statusSheet.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(dataRange)
    .setPosition(32, 12, 70, 7)
    .setOption("height", 171)
    .setOption("width", 301)
    .setOption("title", "Game rating")
    .setOption("titleTextStyle", {"bold": true})
    .build()

  statusSheet.insertChart(chart)
}

function removeStatusGameSeriesCharts() {
  let sheet = SpreadsheetApp.getActive().getSheetByName("Status")

  removeChart(sheet, "Added playthroughs")
  removeChart(sheet, "Finished playthroughs")
}

function addStatusGameSeriesCharts() {
  addAddedPlaythroughsChart()
  addFinishedPlaythroughsChart()
}