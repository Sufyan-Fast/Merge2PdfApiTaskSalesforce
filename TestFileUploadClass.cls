@isTest
private class TestFileUploadClass {
  @isTest
  static void TestFileUpload() {
    string base64 = 'testingthefileuploadclass';
    string filename = 'test file';
    String recordid = '0055h000006hhCiAAI';
    FileUpload.uploadFile(base64, filename, recordid);
  }
}
