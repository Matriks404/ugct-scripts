function createFilterMenu(ui) {
  let menu = ui.createMenu("Filter")

  menu.addItem("Not started playthroughs", "filterNotStarted")
  menu.addItem("Current playthroughs", "filterCurrent")
  menu.addItem("Finished playthroughs", "filterFinishedFromGUI")
  menu.addSeparator()

  menu.addItem("Finished playthroughs (Played)", "filterFinishedPlayed")
  menu.addItem("Finished playthroughs (Watched)", "filterFinishedWatched")
  menu.addItem("Finished playthroughs (Not rated)", "filterFinishedNotRated")
  menu.addSeparator()

  menu.addItem("Playthroughs with undefined distribution method", "filterWithUndefinedDistributionMethod")

  return menu
}

function createScreenshotDirectoryMenu(ui) {
  let menu = ui.createMenu("Screenshot directory")

  menu.addItem("Add for selected entry", "addScreenshotDirectory")
  menu.addItem("Remove for selected entry", "removeScreenshotDirectory")
  menu.addSeparator()

  menu.addItem("Update for selected entry", "updateSingleScreenshotDirectory")
  menu.addItem("Update all", "updateAllScreenshotDirectories")

  return menu
}

function createGameListMenu(ui) {
  let menu = ui.createMenu("GAME LIST")

  menu.addItem("Add entry", "addEntry")
  menu.addItem("Remove entry", "removeEntry")
  menu.addSeparator()

  menu.addItem("Check as finished", "checkAsFinished")
  menu.addSeparator()

  let filterMenu = createFilterMenu(ui)
  menu.addSubMenu(filterMenu)
  menu.addSeparator()

  menu.addItem("Sort by release date", "sortByReleaseDate")
  menu.addItem("Sort by game series", "sortByGameSeries")
  menu.addSeparator()

  menu.addItem("Resize columns to fit", "resizeListColumnsToFit")
  menu.addItem("Reset view", "resetView")
  menu.addSeparator()

  let screenshotDirectoryMenu = createScreenshotDirectoryMenu(ui)
  menu.addSubMenu(screenshotDirectoryMenu)

  return menu
}

function createUpdateMenu(ui) {
  let menu = ui.createMenu("UPDATE")

  menu.addItem("Game series update", "updateGameSeries")
  menu.addItem("Platform update", "updatePlatforms")

  return menu
}

function createUtilitiesMenu(ui) {
  let menu = ui.createMenu("UTILITIES")

  menu.addItem("Modify distribution methods formatting", "openDMFSheet")
  menu.addSeparator()

  menu.addItem("Reset sheet list visbility", "resetSheetList")

  return menu
}

function createDebugMenu(ui) {
  let menu = ui.createMenu("DEBUG")

  menu.addItem("Update statistics", "updateAllStatistics")
  menu.addItem("Update progress chart sheets", "updateProgressChartSheets")
  menu.addSeparator()

  menu.addItem("Record completion percentage data", "recordPercentages")
  menu.addItem("Record completion amounts data", "recordAmounts")
  menu.addItem("Record completion tempo data", "recordTempo")

  return menu
}

function createScriptMenus() {
  let ui = SpreadsheetApp.getUi()

  let gameListMenu = createGameListMenu(ui)
  gameListMenu.addToUi()

  let updateMenu = createUpdateMenu(ui)
  updateMenu.addToUi()

  let modifyMenu = createUtilitiesMenu(ui)
  modifyMenu.addToUi()


  let debugMenu = createDebugMenu(ui)
  debugMenu.addToUi()
}

function showError(message) {
  let ui = SpreadsheetApp.getUi()

  ui.alert("Error", message, ui.ButtonSet.OK)
}

function showInfo(message) {
  let ui = SpreadsheetApp.getUi()

  ui.alert("Info", message, ui.ButtonSet.OK)
}

function isUserPromptResponsePositive(message) {
  let ui = SpreadsheetApp.getUi()

  return ui.alert("Question", message, ui.ButtonSet.YES_NO) == ui.Button.YES
}