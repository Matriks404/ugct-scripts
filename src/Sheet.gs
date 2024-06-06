function resizeColumnToFit(sheet, column) {
  sheet.autoResizeColumn(column)

  let width = sheet.getColumnWidth(column) * 1.09
  sheet.setColumnWidth(column, width)
}