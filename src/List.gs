function isValidPlaythroughEntry(values) {
  // Check if game series, game name and platform are not empty.
  if (!values.slice(0, 3).every(value => value != "")) {
    return false
  }

  // Check if release date is an actual date.
  if (!isValidDate(values[3])) {
    return false
  }

  // Check if playthrough type is valid.
  let validTypesOfPlaythrough = [
    "-",
    "Played",
    "Watched"
  ]

  if (!validTypesOfPlaythrough.includes(values[5])) {
    return false
  }

  // Check if game completion percentage is valid.
  if (typeof(values[6]) != "number" || values[6] < 0) {
    return false
  }

  // Check if add, start and end completion dates are actual dates or an empty string or "?".
  for (i = 7; i <= 9; i++) {
    if (!isValidDate(values[i]) && values[i] != "" && values[i] != "?") {
      return false
    }
  }

  // Check if "Rating" is between 0 and 10.
  if (!isFinite(values[12]) || values[12] < 0 || values[12] > 10) {
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
  let row = sheet.getRange(currentRow, 1, 1, 13)

  // Set thin borders inside of given range and on the top.
  row.setBorder(true, null, null, false, true, true, null, SpreadsheetApp.BorderStyle.SOLID)

  // Set thick borders on the left and right.
  row.setBorder(null, true, null, true, null, null, null, SpreadsheetApp.BorderStyle.SOLID_MEDIUM)

  // Put user provided game name and other default stuff.
  let currentDate = Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone, "yyyy-MM-dd")
  let values = ["", "", "", "", "", "-", 0, currentDate, "", "", "", "", ""]

  row.setValues([values])
  sheet.setActiveSelection(row)

  let lastRow = sheet.getLastRow()

  // Update filtered and all completion percentage values.
  let filteredSumCell = sheet.getRange(lastRow - 1, 7)
  let allSumCell = sheet.getRange(lastRow, 7)

  // Magic, don't touch.
  filteredSumCell.setFormulaR1C1(`=SUBTOTAL(101; R[-${lastDataRow + 1}]C[0]:R[-3]C[0])`)
  allSumCell.setFormulaR1C1(`=AVERAGE(R[-${lastDataRow + 2}]C[0]:R[-4]C[0])`)

  for (i = 8; i <= 10; i++) {
    let cell = sheet.getRange(lastRow - 1, i)
    cell.setFormulaR1C1(`=COUNTA(R[-${lastDataRow + 1}]C[0]:R[-3]C[0])`)
  }
}

function removeEntry() {
  let ss = SpreadsheetApp.getActive()

  if (ss.getActiveSheet().getName() !== "List") {
    showError("You must be in the List sheet to be able to use this action!")

    return
  }

  let sheet = ss.getSheetByName("List")

  let currentRow = sheet.getCurrentCell().getRow()
  let lastDataRow = sheet.getLastRow() - 4

  if (currentRow <= 2 || currentRow > lastDataRow) {
    showError("Invalid row selected.")

    return
  }

  if (lastDataRow == 3) {
    let values = sheet.getRange(3, 1, 1, 13).getValues()[0]

    if (isValidPlaythroughEntry(values)) {
      addEntry()
    } else {
      showError("You can not remove last entry that is empty/invalid!")

      return
    }
  }

  let screenshotDirectory = sheet.getRange(currentRow, 11).getValue()

  if (screenshotDirectory != "") {
    let ui = SpreadsheetApp.getUi()

    let question = ui.alert("Removing playthrough", "Do you want to remove screenshot directory as well?", ui.ButtonSet.YES_NO)

    if (question == ui.Button.YES) {
      removeScreenshotDirectory()
    }
  }

  sheet.deleteRow(currentRow)
}

function checkAsFinished() {
  let validTypesOfPlaythrough = [
    "Played",
    "Watched"
  ]

  let ss = SpreadsheetApp.getActive()

  if (ss.getActiveSheet().getName() !== "List") {
    showError("You must be in the List sheet to be able to use this action!")

    return
  }

  let sheet = ss.getSheetByName("List")

  let currentRow = sheet.getCurrentCell().getRow()
  let lastDataRow = sheet.getLastRow() - 4

  if (currentRow <= 2 || currentRow > lastDataRow) {
    showError("Invalid row selected.")

    return
  }

  let playthroughTypeCell = sheet.getRange(currentRow, 6)
  let percentageCell = sheet.getRange(currentRow, 7)
  let startDateCell = sheet.getRange(currentRow, 9)
  let endDateCell = sheet.getRange(currentRow, 10)

  // Check if the playthrough is already set as completed by checking values of two cells.
  if (percentageCell.getValue() == 1 && endDateCell.getValue() != "") {
    showError("This playthrough is already completed!")

    return
  }

  if (!validTypesOfPlaythrough.includes(playthroughTypeCell.getValue())) {
    if (playthroughTypeCell.getValue() != "-") {
      let message = "Automatically changed invalid playthrough type value to \"Played\"."
      playthroughTypeCell.setNote(message)

      showInfo(message + " This message can also be seen attached to the playthrough type cell for the appropriate playtrough entry.")
    }

    playthroughTypeCell.setValue("Played")
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

function updateBoughtOnColors() {
  let ss = SpreadsheetApp.getActive()

  // Load formatting
  let distributionMethodsFormattingSheet = ss.getSheetByName("Distribution methods formatting")

  let lastRow = distributionMethodsFormattingSheet.getLastRow()

  // Make conditional formatting rules
  let listSheet = ss.getSheetByName("List")

  let firstDataRow = 3
  let lastDataRow = listSheet.getLastRow() - 4
  let numberOfRows = lastDataRow - firstDataRow + 1

  let range = listSheet.getRange(firstDataRow, 12, numberOfRows)

  //TODO: This is stupid, but we need to reset view before applying formatting since for some reason formatting only works on visible cells.
  // See https://stackoverflow.com/a/55544015 for possible solution.
  resetView()
  range.clearFormat()
  range.setHorizontalAlignment("center")
  range.setFontSize(9)

  // Set thin borders inside.
  range.setBorder(null, true, null, null, true, true, null, SpreadsheetApp.BorderStyle.SOLID)

  let rules = listSheet.getConditionalFormatRules()

  //TODO: If cell is both underlined and striken-through this is not working correctly, but it seems to be a limitation of Google Sheets,
  //      since getFontLine() is always overwritten with "underline" if both conditions are true.
  for (let i = 0; i < lastRow; i++) {
    let cell = distributionMethodsFormattingSheet.getRange(i + 1, 1)

    rule = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(cell.getValue())
      .setBold(cell.getFontWeight() == "bold")
      .setItalic(cell.getFontStyle() == "italic")
      .setUnderline(cell.getFontLine() == "underline")
      .setStrikethrough(cell.getFontLine() == "line-through")
      .setFontColorObject(cell.getFontColorObject())
      .setBackgroundObject(cell.getBackgroundObject())
      .setRanges([range])
      .build()

    rules.push(rule)
  }

  listSheet.setConditionalFormatRules(rules)
}