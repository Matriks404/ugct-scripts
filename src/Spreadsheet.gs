function resetSheetList() {
  let illegalSheets = [
    "Distribution methods formatting",
    "History (%)",
    "History (#)",
    "History (Tempo)",
    "Progress (Chart staging)",
    "Statistics"
  ]

  let availableSheets = SpreadsheetApp.getActive().getSheets()

  for (i = 0; i < availableSheets.length; i++) {
    if (illegalSheets.includes(availableSheets[i].getName())) {
      availableSheets[i].hideSheet()
    } else {
      availableSheets[i].showSheet()
    }
  }

  let orderedSheets = [
    "Status",
    "List",
    "Completion progress",
    "Playthroughs progress",
    "Tempo progress",
    "Your notes #1",
    "Your notes #2",
    "Your notes #3"
  ]

  let ss = SpreadsheetApp.getActive()

  for (i = 0; i < orderedSheets.length; i++) {
    let name = orderedSheets[i]

    ss.getSheetByName(name).activate()
    ss.moveActiveSheet(i + 1)
  }

  ss.getSheetByName("Status").activate()
}

function hideAllSheetsExcept(name) {
  let sheets = SpreadsheetApp.getActive().getSheets()

  for (i = 0; i < sheets.length; i++) {
    if (sheets[i].getName() != name) {
      sheets[i].hideSheet()
    }
  }
}

//TODO: Add progress bar on separate sheet.
function updateGameSeries() {
  showInfo("Updating game series. This can take a while. Please click button below and wait patiently to proceed.")

  removeStatusGameSeriesCharts()
  updateStatusGameSeriesList()
  addStatusGameSeriesCharts()

  updateHistoryPercentSheet()
  //updateHistoryAmountsSheet() //TODO: Is this needed?

  updateCompletionProgressChart()

  resetSheetList()

  let ss = SpreadsheetApp.getActive()
  ss.setActiveSheet(ss.getSheetByName("Status"))
}

//TODO: Add progress bar on separate sheet.
function updatePlatforms() {
  let sheet = SpreadsheetApp.getActive().getSheetByName("Status")
  removeChart(sheet, "Platforms")

  updatePlatformStatistics()
  addPlatformsChart()
}