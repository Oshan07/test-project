function moveRandom() {
  var sourceSheetName = "Raw";
  var targetSheetName = "Extracted";
  var numberOfRowsToMove = 2;
  var numberOfColumnsToMove = 26;
  var ss = SpreadsheetApp.getActiveSpreadsheet(); 
  var sourceSheet = ss.getSheetByName(sourceSheetName);
  var targetSheet = ss.getSheetByName(targetSheetName); 
  var lastRowId = sourceSheet.getLastRow();
  Logger.clear();
  var rowIds = getRandomRowNumbers(numberOfRowsToMove, lastRowId);
  rowIds.forEach(function(rowId) {
   var targetRange = targetSheet.getRange((targetSheet.getLastRow()+1),1);
   sourceSheet.getRange(rowId,1,1,numberOfColumnsToMove).copyTo(targetRange);
   sourceSheet.deleteRow(rowId);
  });
}

function getRandomRowNumbers(neededRowCount, lastRowId) { 
  var rowIds = [];
  var i = 0;
  if ( lastRowId <= neededRowCount ) {
       neededRowCount = lastRowId-1; 
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
