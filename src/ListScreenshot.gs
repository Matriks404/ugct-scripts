function getFolder(name, source) {
  if (!source.getFoldersByName(name).hasNext()) {
    source.createFolder(name)
  }

  return source.getFoldersByName(name).next()
}

function getParentFolder(file) {
  return file.getParents().next()
}

function getScreenshotFolder() {
  let thisDocumentId = SpreadsheetApp.getActive().getId()
  let thisDocumentFile = DriveApp.getFileById(thisDocumentId)
  let thisDocumentParentFolder = getParentFolder(thisDocumentFile)

  return thisDocumentParentFolder.getFoldersByName("Post-game screenshots").next()
}

function addScreenshotDirectory() {
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

  let values = sheet.getSheetValues(currentRow, 1, 1, 13)[0]

  if (!isValidPlaythroughEntry(values) || values[4] == "") {
    showError("Invalid playthrough entry.")

    return
  }

  let screenshotDirectoryUrl = values[10]

  if (screenshotDirectoryUrl !== "") {
    showError("Screenshot directory seems to already exist. Remove contents of the screenshot cell and retry if necessary.")

    return
  }

  let gameSeries = values[0]
  let gameName = values[1]
  let gameMode = values[4]

  if (gameMode == "-") {
    showError("Game mode needs to be specified for the currently selected playthrough.")

    return
  }

  let screenshotFolder = getScreenshotFolder()

  let gameSeriesFolder = getFolder(gameSeries, screenshotFolder)
  let gameFolder = getFolder(gameName, gameSeriesFolder)
  let gameModeFolder = getFolder(gameMode, gameFolder)

  let gameModeFolderUrl = gameModeFolder.getUrl()
  let screenshotCell = sheet.getRange(currentRow, 11)

  screenshotCell.setValue(gameModeFolderUrl)
}

function removeScreenshotDirectory() {
  function handleInvalid(row) {
    let ui = SpreadsheetApp.getUi()

    let error = ui.alert("Error", "Current screenshot directory URL is not valid. Do you want to proceed?", ui.ButtonSet.YES_NO)

    if (error == ui.Button.YES) {
      row.setValue("")
    }

    return
  }

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

  let row = sheet.getRange(currentRow, 11)
  let gameModeFolderUrl = row.getValue()

  if (gameModeFolderUrl == "") {
    showError("Screenshot directory doesn't exist, so there is no need to remove it.")

    return
  }

  try {
    var gameModeFolder = DriveApp.getFolderById(gameModeFolderUrl.replace(/^.+\//, ''))
  } catch (e) {
    handleInvalid(row)

    return
  }

  let screenshotFolder = getScreenshotFolder()

  let gameFolder = getParentFolder(gameModeFolder)
  let gameSeriesFolder = getParentFolder(gameFolder)

  if (screenshotFolder.getId() != getParentFolder(gameSeriesFolder).getId()) {
    handleInvalid(row)

    return
  }

  if (gameModeFolder.getFolders().hasNext() || gameModeFolder.getFiles().hasNext()) {
    let ui = SpreadsheetApp.getUi()

    let error = ui.alert("Error", "There are files and/or folders inside the screenshot directory of the currently selected playthrough. Do you want to proceed?", ui.ButtonSet.YES_NO)

    if (error == ui.Button.NO) {
      return
    }
  }

  row.setValue("")

  gameModeFolder.setTrashed(true)

  if (gameFolder.getFolders().hasNext() || gameFolder.getFiles().hasNext()) {
    return
  }

  gameFolder.setTrashed(true)

  if (gameSeriesFolder.getFolders().hasNext() || gameSeriesFolder.getFiles().hasNext()) {
    return
  }

  gameSeriesFolder.setTrashed(true)
}

function updateScreenshotDirectory(sheet, rowNumber) {
  let lastDataRow = sheet.getLastRow() - 4

  if (rowNumber <= 2 || rowNumber > lastDataRow) {
    showError("Invalid row selected.")

    return
  }

  let values = sheet.getRange(rowNumber, 1, 1, 13).getValues()[0]

  if (!isValidPlaythroughEntry(values) || values[4] == "") {
    showError("Invalid playthrough entry.")

    return
  }

  let gameModeFolderUrl = values[10]

  let screenshotCell = sheet.getRange(rowNumber, 11)

  try {
    var gameModeFolder = DriveApp.getFolderById(gameModeFolderUrl.replace(/^.+\//, ''))
  } catch (e) {
    screenshotCell.setValue("")
    addScreenshotDirectory()

    return
  }

  let screenshotFolder = getScreenshotFolder()

  let oldGameFolder = getParentFolder(gameModeFolder)
  let oldGameSeriesFolder = getParentFolder(oldGameFolder)

  if (screenshotFolder.getId() != getParentFolder(oldGameSeriesFolder).getId()) {
    let ui = SpreadsheetApp.getUi()

    let error = ui.alert("Error", "Current screenshot directory URL is not valid. Do you want to proceed?", ui.ButtonSet.YES_NO)

    if (error == ui.Button.YES) {
      screenshotCell.setValue("")

      addScreenshotDirectory()
    }

    return
  }

  let gameSeries = values[0]
  let gameName = values[1]
  let gameMode = values[4]

  if (gameMode == "-") {
    showError("Game mode needs to be specified for the currently selected playthrough.")

    return
  }

  let gameSeriesFolder = getFolder(gameSeries, screenshotFolder)
  let gameFolder = getFolder(gameName, gameSeriesFolder)

  if (gameModeFolder.getName() != gameMode) {
    gameModeFolder.setName(gameMode)
  }

  // Nothing needs to be updated.
  if (gameFolder.getUrl() == oldGameFolder.getUrl()) {
    console.log("Nothing needs to be updated!")

    return
  }

  gameModeFolder.moveTo(gameFolder)
  screenshotCell.setValue(gameModeFolderUrl)

  // Clean up
  if (!oldGameFolder.getFolders().hasNext()) {
    oldGameFolder.setTrashed(true)
  }

  if (!oldGameSeriesFolder.getFolders().hasNext()) {
    oldGameSeriesFolder.setTrashed(true)
  }
}

//TODO: Check if this still works.
function updateSingleScreenshotDirectory() {
  let ss = SpreadsheetApp.getActive()

  if (ss.getActiveSheet().getName() !== "List") {
    showError("You must be in the List sheet to be able to use this action!")

    return
  }

  let sheet = ss.getSheetByName("List")
  let row = sheet.getCurrentCell().getRow()

  updateScreenshotDirectory(sheet, row)
}

//TODO: Check if this still works.
function updateAllScreenshotDirectories() {
  let ss = SpreadsheetApp.getActive()

  if (ss.getActiveSheet().getName() !== "List") {
    showError("You must be in the List sheet to be able to use this action!")

    return
  }

  let sheet = SpreadsheetApp.getActive().getSheetByName("List")

  let firstDataRow = 3
  let lastDataRow = sheet.getLastRow() - 4
  let numberOfRows = lastDataRow - firstDataRow + 1

  let values = sheet.getRange(firstDataRow, 11, numberOfRows, 1).getValues().map(row => row[0])

  for (let i = 0; i < values.length; i++) {
    if (values[i] != "") {
      let row = firstDataRow + i

      console.log("Updating screenshot directory at row: " + row)

      updateScreenshotDirectory(sheet, row)
    }
  }
}