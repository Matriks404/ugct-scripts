function createFilterMenu(ui) {
  let menu = ui.createMenu("Filter")

  menu.addItem("Not started playthroughs", "filterNotStarted")
  menu.addItem("Current playthroughs", "filterCurrent")
  menu.addItem("Finished playthroughs", "filterFinishedFromGUI")
  menu.addSeparator()

  menu.addItem("Finished playthroughs (Not rated)", "filterFinishedNotRated")

  return menu
}

function createGameListMenu(ui) {
  let menu = ui.createMenu("SCRIPTS")

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

  return menu
}

function createScriptMenus() {
  let ui = SpreadsheetApp.getUi()

  let gameListMenu = createGameListMenu(ui)
  gameListMenu.addToUi()
}

function showError(message) {
  let ui = SpreadsheetApp.getUi()

  ui.alert("Error", message, ui.ButtonSet.OK)
}

function isUserPromptResponsePositive(message) {
  let ui = SpreadsheetApp.getUi()

  return ui.alert("Question", message, ui.ButtonSet.YES_NO) == ui.Button.YES
}