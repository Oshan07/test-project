function onEdit(e){
  Logger.clear();
  var sourceSheetName = "Query";
  var targetSheetName = "Final";
  var column = "D";
  var ss = SpreadsheetApp.getActiveSpreadsheet(); 
  var targetSheet = ss.getSheetByName(targetSheetName);
  var sourceSheet = ss.getSheetByName(sourceSheetName);
  var sourceMaxRowCount = sourceSheet.getLastRow();
  var sourceMaxColumnCount = sourceSheet.getLastColumn();
  var verticalRange = column + "1:" + column + sourceMaxRowCount;
  var sourceRange = sourceSheetName + "!" + verticalRange;
  var uniqueValues = sourceSheet.getRange(sourceRange).getValues();
  uniqueValues.forEach(function(part, index, arr) {arr[index] = arr[index][0];});
  //Logger.log("Duplicate values : " + uniqueValues);
  uniqueValues = uniqueValues.filter(function(item, i, ar){return ar.indexOf(item) === i;});
  //Logger.log("Unique values : " + uniqueValues);
  var counter = 1;
  for (var i=0; i < sourceMaxRowCount ; i ++) {    
     var targetRange = targetSheet.getRange(counter,1);    
     if (uniqueValues.indexOf(sourceSheet.getRange((i+1), getColumnNo(column)).getCell(1,1).getValue()) > -1) {
       sourceSheet.getRange((i+1), 1,1,sourceMaxColumnCount).copyTo(targetRange, {contentsOnly: true});
       uniqueValues.splice(0,1);
       Logger.log(uniqueValues);
       counter ++;
     }
  }
  
}

function getColumnNo(column) {
  return (column.charCodeAt(0)-64)
}

