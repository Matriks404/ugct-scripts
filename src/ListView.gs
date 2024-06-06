function resetCursorPosition() {
  let sheet = SpreadsheetApp.getActive().getSheetByName("List")

  sheet.getRange(3, 1).activateAsCurrentCell()
}

function resizeListColumnsToFit() {
  let sheet = SpreadsheetApp.getActive().getSheetByName("List")

  // Set custom size for the "Screenshots" column.
  let screenshotsColumnWidth = 106
  sheet.setColumnWidth(11, screenshotsColumnWidth)

  // Resize other columns to fit.
  let columns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13]
  resizeColumnsToFit(sheet, columns)
}

function resetView() {
  resetFilter()
  resetSorting()
  resetCursorPosition()

  //TODO: Uncomment this after solving an issue in `updateBoughtOnColors()`. See its //TODO for details.
  //resizeListColumnsToFit()
}