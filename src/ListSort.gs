function resetSorting() {
  let sortedBy = PropertiesService.getDocumentProperties().getProperty("sorted_by")

  if (sortedBy == "release_date") {
    sortByReleaseDate()
  } else if (sortedBy == "game_series") {
    sortByGameSeries()
  }
}

function sortByReleaseDate() {
  let sheet = SpreadsheetApp.getActive().getSheetByName("List")
  let filter = sheet.getFilter()

  filter.sort(5, true)
  filter.sort(2, true)
  filter.sort(4, true)

  PropertiesService.getDocumentProperties().setProperty("sorted_by", "release_date")
}

function sortByGameSeries() {
  sortByReleaseDate()

  let sheet = SpreadsheetApp.getActive().getSheetByName("List")
  let filter = sheet.getFilter()

  filter.sort(1, true)

  PropertiesService.getDocumentProperties().setProperty("sorted_by", "game_series")
}