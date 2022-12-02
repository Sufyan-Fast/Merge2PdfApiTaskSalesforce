public with sharing class FileUpload {
  @AuraEnabled
  public static String uploadFile(
    String base64,
    String filename,
    String recordId
  ) {
    ContentVersion cv = createContentVersion(base64, filename);
    createContentLink(cv.Id, recordId);

    ContentDocument cd = [
      SELECT Id
      FROM ContentDocument
      ORDER BY CreatedDate DESC
      LIMIT 1
    ];
    return cd.Id;
  }

  public static ContentVersion createContentVersion(
    String base64,
    String filename
  ) {
    ContentVersion cv = new ContentVersion();
    cv.VersionData = EncodingUtil.base64Decode(base64);
    cv.Title = filename;
    cv.PathOnClient = filename;
    try {
      insert cv;
      return cv;
    } catch (DMLException e) {
      return null;
    }
  }

  public static ContentDocumentLink createContentLink(
    String contentVersionId,
    String recordId
  ) {
    if (contentVersionId == null || recordId == null) {
      return null;
    }
    ContentDocumentLink cdl = new ContentDocumentLink();
    cdl.ContentDocumentId = [
      SELECT ContentDocumentId
      FROM ContentVersion
      WHERE Id = :contentVersionId
    ]
    .ContentDocumentId;
    cdl.LinkedEntityId = recordId;
    cdl.ShareType = 'V';
    try {
      insert cdl;
      return cdl;
    } catch (DMLException e) {
      return null;
    }
  }
}
