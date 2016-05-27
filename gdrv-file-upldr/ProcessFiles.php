<?php
error_reporting(E_ALL | E_STRICT);
require('UploadHandler.php');
require('GoogleDriveFunctions.php');
define('LOCAL_FILE_DIR','files');

function getLocalFileDetails(){
// Initializing normal file upload handler
   $upload_handler = new UploadHandler();
   $fileDetails = $upload_handler->post(false);
   $fileDetails["uploadDir"] = $_POST['folderName'];
   return $fileDetails;
}

function removeProcessedFiles($fileDetails){
    foreach($fileDetails["files"] as $file){
        unlink(LOCAL_FILE_DIR . "/" . $file->name);
        if(file_exists(LOCAL_FILE_DIR . "/thumbnail/" . $file->name)){
            unlink(LOCAL_FILE_DIR . "/thumbnail/" . $file->name);
        }
    }
}

function uploadToGoogleDrive($fileDetails){
    // Google drive file upload client
    $client = gfGetClient();
    $service = new Google_Service_Drive($client);
    foreach($fileDetails["files"] as $file){
        $fileInfo = gfUploadFile($client, $service, LOCAL_FILE_DIR, $file->name, $file->type, $fileDetails["uploadDir"]);
        $file->{"googleDriveUrl"} = $fileInfo ["alternateLink"];
        $file->{"googleDriveId"} = $fileInfo ["id"];
    } 
    return $fileDetails;
}

function sendResponse($response){
    echo json_encode($response);  
    return $response;
}

function deleteFromGoogleDrive($id){
    $client = gfGetClient();
    $service = new Google_Service_Drive($client);
    return gfDeleteFile($service, $id);
}

switch ($_SERVER['REQUEST_METHOD']) {
    case "POST":
       $fileDetails = sendResponse( uploadToGoogleDrive( getLocalFileDetails() ) );
       removeProcessedFiles($fileDetails);
       break;
    case "GET":
        sendResponse(deleteFromGoogleDrive($_GET["delete"]));
}
?>

