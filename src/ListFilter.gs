function checkIfFilteredListIsEmpty() {
  let sheet = SpreadsheetApp.getActive().getSheetByName("List")

  let row = sheet.getLastRow() - 1
  let column = 7

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

  let lastColumn = 13

  for (i = 1; i <= lastColumn; i++) {
    filter.removeColumnFilterCriteria(i)
  }
}

function filterNotStarted() {
  resetFilter()

  let sheet = SpreadsheetApp.getActive().getSheetByName("List")
  let filter = sheet.getFilter()

  // Filter not started playthroughs, by checking whether they have start or end dates (for good measure).
  let criteria = SpreadsheetApp.newFilterCriteria()
    .whenCellEmpty()
    .build()

  filter.setColumnFilterCriteria(9, criteria)
  filter.setColumnFilterCriteria(10, criteria)

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

  filter.setColumnFilterCriteria(9, criteria)

  // Filter not finished playthroughs.
  criteria = SpreadsheetApp.newFilterCriteria()
    .whenCellEmpty()
    .build()

  filter.setColumnFilterCriteria(10, criteria)

  sortByReleaseDate()

  checkIfFilteredListIsEmpty()
  resetCursorPosition()
}

function filterFinished() {
  resetFilter()

  let sheet = SpreadsheetApp.getActive().getSheetByName("List")
  let filter = sheet.getFilter()

  let criteria = SpreadsheetApp.newFilterCriteria()
    .whenCellNotEmpty()
    .build()

  filter.setColumnFilterCriteria(10, criteria)

  // Sort finished playthroughs by end date.
  filter.sort(10, true)
}

function filterFinishedFromGUI() {
  filterFinished()

  checkIfFilteredListIsEmpty()
  resetCursorPosition()
}

function filterFinishedPlayed() {
  filterFinished()

  let sheet = SpreadsheetApp.getActive().getSheetByName("List")
  let filter = sheet.getFilter()

  let criteria = SpreadsheetApp.newFilterCriteria()
    .whenTextStartsWith("Played")
    .build()

  filter.setColumnFilterCriteria(6, criteria)

  checkIfFilteredListIsEmpty()
  resetCursorPosition()
}

function filterFinishedWatched() {
  filterFinished()

  let sheet = SpreadsheetApp.getActive().getSheetByName("List")
  let filter = sheet.getFilter()

  let criteria = SpreadsheetApp.newFilterCriteria()
    .whenTextEqualTo("Watched")
    .build()

  filter.setColumnFilterCriteria(6, criteria)

  checkIfFilteredListIsEmpty()
  resetCursorPosition()
}

function filterFinishedNotRated() {
  filterFinished()

  let sheet = SpreadsheetApp.getActive().getSheetByName("List")
  let filter = sheet.getFilter()

  let criteria = SpreadsheetApp.newFilterCriteria()
    .whenCellEmpty()
    .build()

  filter.setColumnFilterCriteria(13, criteria)

  checkIfFilteredListIsEmpty();
  resetCursorPosition()
}

function filterWithUndefinedDistributionMethod() {
  resetFilter()

  let sheet = SpreadsheetApp.getActive().getSheetByName("List")
  let filter = sheet.getFilter()

  let criteria = SpreadsheetApp.newFilterCriteria()
    .whenCellEmpty()
    .build()

  filter.setColumnFilterCriteria(12, criteria)

  sortByReleaseDate()

  checkIfFilteredListIsEmpty()
  resetCursorPosition()
}