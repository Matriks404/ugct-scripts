function updateHistoryPercentSheet() {
  let ss = SpreadsheetApp.getActive()

  let statusSheet = ss.getSheetByName("Status")
  let historySheet = ss.getSheetByName("History (%)")

  // Get existing game series names in the sheet.
  let firstColumn = 3
  let numberOfColumns = historySheet.getLastColumn() - firstColumn + 1

  let existingGameSeriesNames = historySheet.getRange(2, firstColumn, 1, numberOfColumns).getValues()[0]

  // Get game series names list from the status sheet.
  let firstRow = 7
  let lastRow = getStatusPlaythroughsLastRow()
  let numberOfRows = lastRow - firstRow + 1

  let gameSeriesNamesToAdd = statusSheet.getRange(firstRow, 1, numberOfRows).getValues().map(row => row[0])

  // Remove percentage values for game series that no longer exist on status sheet.
  for (let i = 0; i < existingGameSeriesNames.length; i++) {
    if (!gameSeriesNamesToAdd.includes(existingGameSeriesNames[i])) {
      let column = i + firstColumn

      let percentageCell = historySheet.getRange(1, column)
      percentageCell.clearContent()
    }
  }

  // Create a new merged array with both existing game series names list from history sheet and the one from the status sheet.
  let newGameSeriesNamesSet = new Set(existingGameSeriesNames.concat(gameSeriesNamesToAdd));
  let newGameSeriesNames = [...newGameSeriesNamesSet].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

  let diff = 0;

  // Insert missing game series into the history sheet.
  for (let i = 0; i < newGameSeriesNames.length; i++) {
    if (existingGameSeriesNames[i - diff] !== newGameSeriesNames[i]) {
      let column = i + firstColumn - 1

      historySheet.insertColumnAfter(column)

      let percentageCell = historySheet.getRange(1, column + 1);
      let A1Notation = percentageCell.getSheet().getRange(percentageCell.getRow() + 1, percentageCell.getColumn()).getA1Notation()

      //TODO: Either I am stupid or the R1C1 notation implementation is just buggy as this doesn't work for some reason:
      //percentageCell.setFormulaR1C1("=FILTER(Status!B7:B100000; Status!A7:A100000 = R[1]C[0])")
      percentageCell.setFormula(`=FILTER(Status!B7:B100000; Status!A7:A100000 = ${A1Notation})`)

      let nameCell = historySheet.getRange(2, column + 1)

      nameCell.setValue(newGameSeriesNames[i])

      diff += 1
    }
  }

  // Get the Status game series footer with all playthroughs completion percentage.
  let allPercentageOriginCell = statusSheet.getRange(lastRow + 2, 2)

  // Update the all percentage statistic cell.
  let allPercentageCell = historySheet.getRange(1, 2)
  allPercentageCell.setFormula(`=Status!${allPercentageOriginCell.getA1Notation()}`)

  // Auto resize all columns.
  historySheet.autoResizeColumns(1, historySheet.getLastColumn())
}

function updateHistoryAmountsSheet() {
  let historySheet = SpreadsheetApp.getActive().getSheetByName("History (#)")

  let columns = ["C", "D", "E"]
  let formulas = []

  //TODO: See the similar formula in the updateHistoryPercentageSheetStructure() for relevant issue.
  for (let col of columns) {
    formulas.push(`=FILTER(Status!${col}7:${col}100000; Status!A7:A100000 = "All playthroughs:")`)
  }

  let playthroughCountsRange = historySheet.getRange(1, 2, 1, 3)
  playthroughCountsRange.setFormulas([formulas])
}

function recordPercentages() {
  Recordhistorylibrary.record("History (%)", 1)
}

function recordAmounts() {
  Recordhistorylibrary.record("History (#)", 1)
}

function recordTempo() {
  Recordhistorylibrary.record("History (Tempo)", 1)
}

function recordAll() {
  recordPercentages()
  recordAmounts()
  recordTempo()
}