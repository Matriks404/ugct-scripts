function updateSingleStatistics(name, sourceColumn, targetColumn) {
    let ss = SpreadsheetApp.getActive()

    let statisticsSheet = ss.getSheetByName("Statistics")
    let listSheet = ss.getSheetByName("List")

    if (name == "Bought on") {
      // Load formatting
      let distributionMethodsFormattingSheet = ss.getSheetByName("Distribution methods formatting")
      let lastRow = distributionMethodsFormattingSheet.getLastRow()

      var formatData = {}

      for (i = 1; i <= lastRow; i++) {
        let cell = distributionMethodsFormattingSheet.getRange(i, 1)
        let value = cell.getValue()

        formatData[value] = {
          fontWeight: cell.getFontWeight(),
          fontStyle: cell.getFontStyle(),
          fontLine: cell.getFontLine(),
          fontColor: cell.getFontColorObject().asRgbColor().asHexString(),
          backgroundColor: cell.getBackground(),
        }
      }
    }

    let firstDataRow = 3
    let lastDataRow = listSheet.getLastRow() - 3

    let uniqueValues = {}

    for (i = firstDataRow; i < lastDataRow; i++) {
      let cell = listSheet.getRange(i, sourceColumn)

      let value = cell.getValue()

      if ((typeof value == "string" && value == "") || value == "?") {
        continue
      }

      if (uniqueValues[value]) {
        uniqueValues[value].count++
      } else {
        if (name == "Bought on") {
          if (formatData[value]) {
            uniqueValues[value] = {
              count: 1,

              fontWeight: formatData[value].fontWeight,
              fontStyle: formatData[value].fontStyle,
              fontLine: formatData[value].fontLine,
              fontColor: formatData[value].fontColor,
              backgroundColor: formatData[value].backgroundColor
            }
          } else {
            uniqueValues[value] = {
              count: 1
            }
          }
        } else {
          uniqueValues[value] = {
            count: 1,
          }
        }
      }
    }

    uniqueValues = Object.keys(uniqueValues).map(key => [key, uniqueValues[key]])

    if (name == "Rating") {
      uniqueValues.sort((a, b) => b - a)
    } else {
      uniqueValues.sort(function(a, b) {
        if (b[1].count - a[1].count === 0) {
          return a[0].localeCompare(b[0])
        } else {
          return b[1].count - a[1].count
        }
      })
    }

    let data = uniqueValues.map(item => item[0])
    let firstRow = 3

    // Clear the statistics column, so not needed entries do not persist.
    let numberOfRows = statisticsSheet.getLastRow() - firstRow + 1
    let rangeToClear = statisticsSheet.getRange(firstRow, targetColumn, numberOfRows, 2)
    rangeToClear.clearContent()

    // Additionally clear formatting, if the statistics column is "Bought on"
    if (name == "Bought on") {
      rangeToClear.clearFormat()
    }

    for (let i = 0; i < data.length; i++) {
      let valueCell = statisticsSheet.getRange(i + firstRow, targetColumn)
      valueCell.setValue(data[i])
      valueCell.setHorizontalAlignment("center")
      valueCell.setShowHyperlink(false)

      let formatData = uniqueValues[i][1]
      valueCell.setFontWeight(formatData.fontWeight)
      valueCell.setFontStyle(formatData.fontStyle)
      valueCell.setFontLine(formatData.fontLine)
      valueCell.setFontColor(formatData.fontColor)
      valueCell.setBackgroundColor(formatData.backgroundColor)

      let countCell = statisticsSheet.getRange(i + firstRow, targetColumn + 1)

      //TODO: Everything below is very stupid.
      let inputColumn, outputColumn

      if (name == "Platform stats") {
        inputColumn = "C"
        outputColumn = "A"
      } else if (name == "Bought on") {
        inputColumn = "L"
        outputColumn = "D"
      } else if (name == "Rating") {
        inputColumn = "M"
        outputColumn = "G"
      }

      countCell.setFormula(`=COUNTIF(List!${inputColumn}3:${inputColumn}100000; ${outputColumn}${i + firstDataRow})`)
      countCell.setHorizontalAlignment("center")

    }

    let columns = [targetColumn, targetColumn + 1]
    resizeColumnsToFit(statisticsSheet, columns)
}

function updatePlatformStatistics() {
  updateSingleStatistics("Platform stats", 3, 1)
}

function updateBoughtOnStatistics() {
  updateSingleStatistics("Bought on", 12, 4)
}

function updateRatingStatistics() {
  updateSingleStatistics("Rating", 13, 7)
}

function updateAllStatistics() {
  let sheet = SpreadsheetApp.getActive().getSheetByName("Statistics")

  // Clear the sheet so we can start from scratch.
  sheet.clear()

  // Insert statistics titles with appropriate style.
  let titles = sheet.getRange(1, 1, 1, 7)

  titles.setValues([["Platform stats", "", "", "Bought on", "", "", "Rating"]])

  let titleStyle = SpreadsheetApp.newTextStyle()
    .setBold(true)
    .setFontSize(12)
    .build()

  titles.setTextStyle(titleStyle)

  // Insert statistics headers with appropriate style.
  let headers = sheet.getRange(2, 1, 1, 8)
  headers.setValues([["Name", "Count", "", "Name", "Count", "", "Name", "Count"]])

  headers.setHorizontalAlignment("center")

  let headerStyle = SpreadsheetApp.newTextStyle()
    .setBold(true)
    .build()

  headers.setTextStyle(headerStyle)

  updatePlatformStatistics()
  updateBoughtOnStatistics()
  updateRatingStatistics()
}