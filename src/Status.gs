function getStatusPlaythroughsLastRow() {
  let sheet = SpreadsheetApp.getActive().getSheetByName("Status")

  let firstRow = 7
  let numberOfRows = sheet.getLastRow() - firstRow + 1
  let values = sheet.getRange(firstRow, 1, numberOfRows).getValues().map(row => row[0])

  let lastRow

  for (i = 0; i < values.length; i++) {
    if (values[i] != "") {
      lastRow = i + firstRow
    } else {
      break
    }
  }

  return lastRow
}

//TODO: This is HORRIBLE.
function updateStatusGameSeriesList() {
  let ss = SpreadsheetApp.getActive()
  let statusSheet = ss.getSheetByName("Status")

  // Find the last game series row.
  let firstRow = 7
  let lastRow = getStatusPlaythroughsLastRow()

  // Clear all game series rows and "All playthroughs" footer.
  let numberOfRows = lastRow - firstRow + 3

  let gameSeries = statusSheet.getRange(firstRow, 1, numberOfRows, 5)
  gameSeries.clear()

  // Get game series from the List sheet.
  let listSheet = ss.getSheetByName("List")

  let firstDataRow = 3
  let lastDataRow = listSheet.getLastRow() - 4
  numberOfRows = lastDataRow - firstDataRow + 1

  let values = listSheet.getRange(firstDataRow, 1, numberOfRows).getValues().map(row => row[0])

  let uniqueValues = []

   for (i = 0; i < values.length; i++) {
     let value = values[i]

     if (value == "") {
       continue
     }

     if (!uniqueValues.includes(value)) {
       uniqueValues.push(value)
     }
  }

  uniqueValues.sort(function (a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase())
  })

  Logger.log(uniqueValues)

  // Insert game series. //TODO: Tidy this up. This sucks.
  numberOfRows = uniqueValues.length + firstRow
  let index

  for (row = firstRow; row < numberOfRows; row++) {
    index = row - firstRow

    let gameSerieName = statusSheet.getRange(row, 1)
    gameSerieName.setValue(uniqueValues[index])

    let percentageCell = statusSheet.getRange(row, 2)
    percentageCell.setFormula(`=AVERAGEIF(List!A3:A100000; A${row}; List!G3:G100000)`)

    let addedPlaythroughsCell = statusSheet.getRange(row, 3)
    addedPlaythroughsCell.setFormula(`=COUNTIFS(List!A3:A100000; A${row}; List!H3:H100000; "<>")`)

    let startedPlaythroughsCell = statusSheet.getRange(row, 4)
    startedPlaythroughsCell.setFormula(`=COUNTIFS(List!A3:A100000; A${row}; List!I3:I100000; "<>")`)

    let finishedPlaythroughsCell = statusSheet.getRange(row, 5)
    finishedPlaythroughsCell.setFormula(`=COUNTIFS(List!A3:A100000; A${row}; List!J3:J100000; "<>")`)
  }

  // Insert "All playthroughs" footer.
  lastRow = firstRow + index
  let footerRow = lastRow + 2

  let allPlaythroughsLabelCell = statusSheet.getRange(footerRow, 1)
  allPlaythroughsLabelCell.setValue("All playthroughs:")

  let lastListRow = listSheet.getLastRow()

  let allPlaythroughsPercentageCell = statusSheet.getRange(footerRow, 2)
  allPlaythroughsPercentageCell.setFormula(`List!G${lastListRow}`)

  let allPlaythroughsAddedCell = statusSheet.getRange(footerRow, 3)
  allPlaythroughsAddedCell.setFormula(`List!H${lastListRow - 1}`)

  let allPlaythroughsStartedCell = statusSheet.getRange(footerRow, 4)
  allPlaythroughsStartedCell.setFormula(`List!I${lastListRow - 1}`)

  let allPlaythroughsFinishedCell = statusSheet.getRange(footerRow, 5)
  allPlaythroughsFinishedCell.setFormula(`List!J${lastListRow - 1}`)

  // Stylize everything
  let gameSeriesRange = statusSheet.getRange(firstRow, 1, index + 1, 5)

  // Set thin borders inside.
  gameSeriesRange.setBorder(null, null, null, null, true, true, null, SpreadsheetApp.BorderStyle.SOLID)

  // Set thick borders outside.
  gameSeriesRange.setBorder(true, true, true, true, null, null, null, SpreadsheetApp.BorderStyle.SOLID_MEDIUM)

  // Set banding.
  gameSeriesRange.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, false, false)

  // Center values.
  let dataToBeCentred = statusSheet.getRange(firstRow, 2, index + 3, 4)
  dataToBeCentred.setHorizontalAlignment("center")

  // Set conditonal formatting for percentage values.
  let perecentageValues = statusSheet.getRange(firstRow, 2, index + 3)

  let rule = SpreadsheetApp.newConditionalFormatRule()
    .setGradientMinpointWithValue("#CC0000", SpreadsheetApp.InterpolationType.NUMBER, "0")
    .setGradientMidpointWithValue("#F1C232", SpreadsheetApp.InterpolationType.NUMBER, "0,5")
    .setGradientMaxpointWithValue("#6AA84F", SpreadsheetApp.InterpolationType.NUMBER, "1")
    .setRanges([perecentageValues])
    .build()

  let rules = statusSheet.getConditionalFormatRules()
  rules.push(rule)

  statusSheet.setConditionalFormatRules(rules)

  // Format "All playthroughs" label.
  allPlaythroughsLabelCell.setHorizontalAlignment("right")
  allPlaythroughsLabelCell.setFontWeight("bold")

  // Format "All playthroughs" values.
  allPlaythroughsValues = statusSheet.getRange(footerRow, 2, 1, 4)

  // Set thin borders inside.
  allPlaythroughsValues.setBorder(null, null, null, null, true, true, null, SpreadsheetApp.BorderStyle.SOLID)

  // Set thick borders outside.
  allPlaythroughsValues.setBorder(true, true, true, true, null, null, null, SpreadsheetApp.BorderStyle.SOLID_MEDIUM)

  // Update one month difference values.
  let oneMonthDifferenceValues = statusSheet.getRange(7, 8, 1, 4)

  values = [`=B${footerRow}`, `=C${footerRow}`, `=D${footerRow}`, `=E${footerRow}`]

  oneMonthDifferenceValues.setValues([values])

  // Update PLAYTHROUGH INFO.
  let playthroughInfoAllPlaythroughsCell = statusSheet.getRange(27, 7)
  let playthroughInfoFinishedPlaythroughsCell = statusSheet.getRange(29, 7)
  let playthroughInfoPlaythroughsCurrentlyInCell = statusSheet.getRange(31, 7)

  playthroughInfoAllPlaythroughsCell.setValue(`="All playthroughs: " & C${footerRow}`)
  playthroughInfoFinishedPlaythroughsCell.setValue(`="Finished playthroughs: " & E${footerRow}`)
  playthroughInfoPlaythroughsCurrentlyInCell.setValue(`="Playthroughs currently in: " & D${footerRow} - E${footerRow}`)
}