function isValidPlaythroughEntry(values) {
  // Check if game series, game name and platform are not empty.
  if (!values.slice(0, 3).every(value => value != "")) {
    return false
  }

  // Check if release date is an actual date.
  if (!isValidDate(values[3])) {
    return false
  }

  // Check if game completion percentage is valid.
  if (typeof(values[5]) != "number" || values[5] < 0) {
    return false
  }

  // Check if add, start and end completion dates are actual dates or an empty string or "?".
  for (i = 6; i <= 8; i++) {
    if (!isValidDate(values[i]) && values[i] != "" && values[i] != "?") {
      return false
    }
  }

  // Check if "Rating" is between 0 and 10.
  if (!isFinite(values[9]) || values[9] < 0 || values[9] > 10) {
    return false
  }

  return true
}

function addEntry() {
  let ss = SpreadsheetApp.getActive()
  let sheet = ss.getSheetByName("List")

  let lastDataRow = sheet.getLastRow() - 4

  sheet.insertRowAfter(lastDataRow)

  let currentRow = lastDataRow + 1
  let row = sheet.getRange(currentRow, 1, 1, 10)

  // Set thin borders inside of given range and on the top.
  row.setBorder(true, null, null, false, true, true, null, SpreadsheetApp.BorderStyle.SOLID)

  // Set thick borders on the left and right.
  row.setBorder(null, true, null, true, null, null, null, SpreadsheetApp.BorderStyle.SOLID_MEDIUM)

  // Put user provided game name and other default stuff.
  let currentDate = Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone, "yyyy-MM-dd")
  let values = ["", "", "", "", "", 0, currentDate, "", "", ""]

  row.setValues([values])
  sheet.setActiveSelection(row)

  let lastRow = sheet.getLastRow()

  // Update filtered and all completion percentage values.
  let filteredSumCell = sheet.getRange(lastRow - 1, 6)
  let allSumCell = sheet.getRange(lastRow, 6)

  // Magic, don't touch.
  filteredSumCell.setFormulaR1C1(`=SUBTOTAL(101; R[-${lastDataRow + 1}]C[0]:R[-3]C[0])`)
  allSumCell.setFormulaR1C1(`=AVERAGE(R[-${lastDataRow + 2}]C[0]:R[-4]C[0])`)

  for (i = 7; i <= 9; i++) {
    let cell = sheet.getRange(lastRow - 1, i)
    cell.setFormulaR1C1(`=COUNTA(R[-${lastDataRow + 1}]C[0]:R[-3]C[0])`)
  }
}

function removeEntry() {
  let sheet = SpreadsheetApp.getActive().getSheetByName("List")

  let currentRow = sheet.getCurrentCell().getRow()
  let lastDataRow = sheet.getLastRow() - 4

  if (currentRow <= 2 || currentRow > lastDataRow) {
    showError("Invalid row selected.")

    return
  }

  if (lastDataRow == 3) {
    let values = sheet.getRange(3, 1, 1, 10).getValues()[0]

    if (isValidPlaythroughEntry(values)) {
      addEntry()
    } else {
      showError("You can not remove last entry that is empty/invalid!")

      return
    }
  }

  sheet.deleteRow(currentRow)
}

function checkAsFinished() {
  let ss = SpreadsheetApp.getActive()
  let sheet = ss.getSheetByName("List")

  let currentRow = sheet.getCurrentCell().getRow()
  let lastDataRow = sheet.getLastRow() - 4

  if (currentRow <= 2 || currentRow > lastDataRow) {
    showError("Invalid row selected.")

    return
  }

  let percentageCell = sheet.getRange(currentRow, 6)
  let startDateCell = sheet.getRange(currentRow, 8)
  let endDateCell = sheet.getRange(currentRow, 9)

  // Check if the playthrough is already set as completed by checking values of two cells.
  if (percentageCell.getValue() == 1 && endDateCell.getValue() != "") {
    showError("This playthrough is already completed!")

    return
  }

  percentageCell.setValue(1)

  if (startDateCell.getValue() == "") {
    startDateCell.setValue("?")
  }

  if (endDateCell.getValue() == "") {
    let currentDate = Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone, "yyyy-MM-dd")
    endDateCell.setValue(currentDate)
  }
}