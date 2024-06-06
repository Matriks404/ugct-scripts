function checkIfFilteredListIsEmpty() {
  let sheet = SpreadsheetApp.getActive().getSheetByName("List")

  let row = sheet.getLastRow() - 1
  let column = 6

  let value = sheet.getRange(row, column).getValue()

  // A bit of fancy hacky way to see whether or not filtered list is empty, that is checking if "Filtered" sum value is "#DIV/0!". This makes us not to iterate through every entry row to check if they are all hidden.
  if (value == '#DIV/0!') {
    let isResponsePositive = isUserPromptResponsePositive("There are no entries visible in the filtered list. Do you want to rest view to see all entries?")

    if (isResponsePositive) {
      resetView()
    }
  }
}

function resetFilter() {
  let sheet = SpreadsheetApp.getActive().getSheetByName("List")
  let filter = sheet.getFilter()

  let lastColumn = 10

  for (i = 1; i <= lastColumn; i++) {
    filter.removeColumnFilterCriteria(i)
  }
}

function filterNotStarted() {
  resetFilter()

  let sheet = SpreadsheetApp.getActive().getSheetByName("List")
  let filter = sheet.getFilter()

  // Let's make a criteria
  let criteria = SpreadsheetApp.newFilterCriteria()
    .whenCellEmpty()
    .build()

  // Filter not started playthroughs, by checking whether they have start or end dates (for good measure).
  filter.setColumnFilterCriteria(8, criteria)
  filter.setColumnFilterCriteria(9, criteria)

  // Sort not started playthroughs by release date.
  sortByReleaseDate()

  checkIfFilteredListIsEmpty()
  resetCursorPosition()
}

function filterCurrent() {
  resetFilter()

  let sheet = SpreadsheetApp.getActive().getSheetByName("List")
  let filter = sheet.getFilter()

  // Filter started playthroughs.
  let criteria = SpreadsheetApp.newFilterCriteria()
    .whenCellNotEmpty()
    .build()

  filter.setColumnFilterCriteria(8, criteria)

  // Filter not finished playthroughs.
  criteria = SpreadsheetApp.newFilterCriteria()
    .whenCellEmpty()
    .build()

  filter.setColumnFilterCriteria(9, criteria)

  // Sort current playthroughs by release date.
  sortByReleaseDate()

  checkIfFilteredListIsEmpty()
  resetCursorPosition()
}

function filterFinished() {
  resetFilter()

  let sheet = SpreadsheetApp.getActive().getSheetByName("List")
  let filter = sheet.getFilter()

  // Filter finished playthroughs.
  let criteria = SpreadsheetApp.newFilterCriteria()
    .whenCellNotEmpty()
    .build()

  filter.setColumnFilterCriteria(9, criteria)

  // Sort finished playthroughs by end date.
  filter.sort(9, true)
}

function filterFinishedFromGUI() {
  filterFinished()

  checkIfFilteredListIsEmpty()
  resetCursorPosition()
}

function filterFinishedNotRated() {
  filterFinished()

  let sheet = SpreadsheetApp.getActive().getSheetByName("List")
  let filter = sheet.getFilter()

  // Filter not rated playthroughs.
  let criteria = SpreadsheetApp.newFilterCriteria()
    .whenCellEmpty()
    .build()

  filter.setColumnFilterCriteria(10, criteria)

  checkIfFilteredListIsEmpty()
  resetCursorPosition()
}