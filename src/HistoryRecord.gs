function record(sheetName, row) {
  var sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  var source = sheet.getRange(row, 1, row, sheet.getLastColumn());
  var values = source.getValues();

  values[0][0] = Utilities.formatDate(new Date(), 'Europe/Warsaw', 'yyyy-MM-dd');

  sheet.appendRow(values[0]);
}

function recordPercentages() {
  record("History (%)", 1)
}

function recordAmounts() {
  record("History (#)", 1)
}

function recordTempo() {
  record("History (Tempo)", 1)
}

function recordAll() {
  recordPercentages()
  recordAmounts()
  recordTempo()
}