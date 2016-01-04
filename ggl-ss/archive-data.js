function archiveSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];  
  var sourceSheetName = "Sheet1";
  var archivaSsId = "1PNgjODUXgZUJwwIV-UnWhouDMpym-L1Lj5Y2vz-uGb0";
  var maxRowCountToArchive = sheet.getLastRow();
  var maxRowCountToWatch = 2000;
  var maxColumnCountToArchive = 25;
  var cellNameToWatch = "Z1"; // =counta(A1:A2000)
  var cellToWatch = sheet.getRange(cellNameToWatch).getCell(1, 1);
  if (cellToWatch.getValue() >= maxRowCountToWatch && sheet.getName() == sourceSheetName ) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var today = new Date();
    var archiveSheetName = today.toISOString().substring(0, 10);
    var archiveSheet = ss.insertSheet(archiveSheetName);   
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sourceSheet = ss.getSheetByName(sourceSheetName);
    var targetSheet = ss.getSheetByName(archiveSheetName);
    var targetRange = targetSheet.getRange(1, 1);  
    sourceSheet.getRange(1,1,maxRowCountToArchive,maxColumnCountToArchive).copyTo(targetRange);
    var formulas = sourceSheet.getRange(2,1,maxRowCountToArchive,maxColumnCountToArchive).getFormulas();
    sourceSheet.getRange(2,1,maxRowCountToArchive,maxColumnCountToArchive).clearContent();
    sourceSheet.getRange(2,1,maxRowCountToArchive,maxColumnCountToArchive).setFormulas(formulas);
    var destinationSs = SpreadsheetApp.openById(archivaSsId);
    Logger.log(destinationSs.getName());
    targetSheet.copyTo(destinationSs);
    destinationSs.getSheetByName("Copy of "+archiveSheetName).setName(archiveSheetName);
    ss.setActiveSheet(sourceSheet);
    ss.deleteSheet(targetSheet);   
  } else {
    Logger.log("Sheet hasn't reached the maximum number of rows");
  }
}

