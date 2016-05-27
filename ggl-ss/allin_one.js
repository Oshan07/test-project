/* --------------- Configuration section ---------------*/

var numberOfRowsToMove = 2;
var archivaSsId = "1srZrlWNThLkuJqX1jraeFygDK__QVkIfQ17g4Q_FLnQ";

/* ------------ Configuration section ends -------------*/

var ss = SpreadsheetApp.getActiveSpreadsheet();
var archiveSs = SpreadsheetApp.openById(archivaSsId);
function extractFromSheets(){
  Logger.clear();
  var sheetList = ["VineScrub","JPGScrub","YouTubeScrub"];
  sheetList.forEach(clearCopyScrub);
  sheetList.forEach(extractRandom);
  archiveFeed();
}

function clearCopyScrub(sheetName) {
  var sheet = ss.getSheetByName("Copy"+sheetName);
  sheet.clearContents();
}

function extractRandom(category) {
  Logger.log("=== Sheet Name : "+category+" ====");
  var sourceSheetName = category;
  var targetSheetName = "Copy"+ category;
  var numberOfColumnsToMove = 26;
  var sourceSheet = ss.getSheetByName(sourceSheetName);
  var targetSheet = ss.getSheetByName(targetSheetName);
  var lastRowId = lastValueRow(sourceSheet);
  var rowIds = getRandomRowNumbers(numberOfRowsToMove, lastRowId);
  rowIds.forEach(function(rowId) {
   var targetRange = targetSheet.getRange((targetSheet.getLastRow()+1),1);
   sourceSheet.getRange(rowId,1,1,numberOfColumnsToMove).copyTo(targetRange, {contentsOnly: true});
   //sourceSheet.deleteRow(rowId);
  });
}

function getRandomRowNumbers(neededRowCount, lastRowId) {
  var rowIds = [];
  var i = 0;
  if ( lastRowId <= neededRowCount ) {
       neededRowCount = lastRowId -1;
  }
  Logger.log("Last row id: " + lastRowId +", neededRowCount: " + neededRowCount);
  while (i < neededRowCount) {
    var rnd = Math.floor((Math.random() * lastRowId) + 1);
    if (rnd != 1 && rowIds.indexOf(rnd) == -1) {
        rowIds[i] = rnd;
        i++;
       }
  }
  Logger.log("Row ids: "+ rowIds.toString());
  return rowIds;
}

function lastValueRow(sheet) {
  Logger.log("Sheet name: "+sheet.getName()+"; Last row: "+sheet.getLastRow());
  if ( sheet.getLastRow() > 0 ){
    var lastEmptyOnColumnA = sheet.getRange("A1:A"+sheet.getLastRow()).getValues().join(",").replace(/,,/g, '').split(",").length;
    Logger.log("Last value row: " + lastEmptyOnColumnA);
    return lastEmptyOnColumnA;
  } else {
    return 1;
  }
}

function archiveFeed() {
  Logger.clear();
  var feedSheet = ss.getSheetByName("Feed");
  var archiveSheet = archiveSs.getSheetByName("Sheet1");
  if (feedSheet.getLastRow() > 0){
    feedSheet.copyTo(archiveSs);
    var tempArchiveSheet = archiveSs.getSheetByName("Copy of Feed");
    deleteEmptyRows(tempArchiveSheet);
    var targetRange = archiveSheet.getRange(archiveSheet.getLastRow()+1,1);
    tempArchiveSheet.getRange(1,1,tempArchiveSheet.getLastRow(),tempArchiveSheet.getLastColumn()).moveTo(targetRange);
    archiveSs.deleteSheet(tempArchiveSheet);   
    feedSheet.clearContents();
  }
}

function deleteEmptyRows(sh){ 
  var data = sh.getDataRange().getValues();
  var targetData = new Array();
  for(n=0;n<data.length;++n){
    if(data[n].join().replace(/,/g,'')!=''){ targetData.push(data[n])};
  }
  sh.getDataRange().clear();
  sh.getRange(1,1,targetData.length,targetData[0].length).setValues(targetData);

}

//ArchivaSheet
function archiveSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sourceSheetName = "Sheet1";
  var sourceSheet = ss.getSheetByName(sourceSheetName);
  var maxRowCountToArchive = sourceSheet.getLastRow();
  var maxRowCountToWatch = 2000;
  var maxColumnCountToArchive = 25;
  var lastRow = sourceSheet.getLastRow();
  Logger.log("Last row: " + lastRow);
  if (lastRow >= maxRowCountToWatch) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var today = new Date();
    var archiveSheetName = today.toISOString().substring(0, 10);
    var archiveSheet = ss.insertSheet(archiveSheetName);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sourceSheet = ss.getSheetByName(sourceSheetName);
    var targetSheet = archiveSheet;
    var targetRange = targetSheet.getRange(1, 1);
    sourceSheet.getRange(1,1,maxRowCountToArchive,maxColumnCountToArchive).copyTo(targetRange);
    sourceSheet.getRange(1,1,maxRowCountToArchive,maxColumnCountToArchive).clear();
  } else {
    Logger.log("Sheet hasn't reached the maximum number of rows");
  }
}

