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

function filterFinishedPlayed() {
  filterFinished()

  let sheet = SpreadsheetApp.getActive().getSheetByName("List")
  let filter = sheet.getFilter()

  let criteria = SpreadsheetApp.newFilterCriteria()
    .whenTextStartsWith("Played")
    .build()

  filter.setColumnFilterCriteria(6, criteria)
}

function filterFinishedWatched() {
  filterFinished()

  let sheet = SpreadsheetApp.getActive().getSheetByName("List")
  let filter = sheet.getFilter()

  let criteria = SpreadsheetApp.newFilterCriteria()
    .whenTextEqualTo("Watched")
    .build()

  filter.setColumnFilterCriteria(6, criteria)
}

function filterFinishedNotRated() {
  filterFinished()

  let sheet = SpreadsheetApp.getActive().getSheetByName("List")
  let filter = sheet.getFilter()

  let criteria = SpreadsheetApp.newFilterCriteria()
    .whenCellEmpty()
    .build()

  filter.setColumnFilterCriteria(13, criteria)
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
}