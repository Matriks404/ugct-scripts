function openDMFSheet() {
  let sheetName = "Distribution methods formatting"

  let ss = SpreadsheetApp.getActive()
  let sheet = ss.getSheetByName(sheetName)

  resizeColumnToFit(sheet, 1)

  sheet.showSheet()
  ss.setActiveSheet(sheet)

  hideAllSheetsExcept(sheetName)
}

//TODO: Add progress bar
function finishDMFJob() {
  updateBoughtOnColors()
  updateBoughtOnStatistics()

  let statusSheet = SpreadsheetApp.getActive().getSheetByName("Status")
  removeChart(statusSheet, "Bought on")
  addBoughtOnChart()

  resetSheetList()

  let ss = SpreadsheetApp.getActive()
  ss.setActiveSheet(ss.getSheetByName("Status"))
}
