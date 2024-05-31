function getChart(sheet, name) {
  let charts = sheet.getCharts()

  for (i = 0; i < charts.length; i++) {
    if (charts[i].getOptions().get("title") == name) {
      return charts[i]
    }
  }

  return null
}

function removeChart(sheet, name) {
  let chart = getChart(sheet, name)

  if (chart) {
    sheet.removeChart(chart)
  }
}