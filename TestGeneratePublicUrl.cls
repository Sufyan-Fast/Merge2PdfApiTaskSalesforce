@isTest
private class TestGeneratePublicUrl {
  @TestSetup
  static void makeDataForDocument() {
    ContentVersion contentVersion = new ContentVersion(
      Title = 'a picture',
      PathOnClient = 'Pic.jpg',
      VersionData = Blob.valueOf('Test Content'),
      IsMajorVersion = true
    );
    insert contentVersion;
  }

  @isTest
  static void TestGeneratePublicUrl() {
    ContentDocument testObjectContentDocument = [
      SELECT Id, Title, LatestPublishedVersionId
      FROM ContentDocument
    ][0];
    GeneratePublicUrl.generatePublicLink(testObjectContentDocument.Id);
  }
}
