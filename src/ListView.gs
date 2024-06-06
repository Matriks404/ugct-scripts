function resetCursorPosition() {
  let sheet = SpreadsheetApp.getActive().getSheetByName("List")

  sheet.getRange(3, 1).activateAsCurrentCell()
}

function resizeListColumnsToFit() {
  let sheet = SpreadsheetApp.getActive().getSheetByName("List")

  for (i = 1; i <= 10; i++) {
    resizeColumnToFit(sheet, i)
  }
}

function resetView() {
  resetFilter()
  resetSorting()
  resetCursorPosition()
}