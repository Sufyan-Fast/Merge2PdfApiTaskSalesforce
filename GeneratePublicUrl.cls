public with sharing class GeneratePublicUrl {
  @AuraEnabled
  public static String generatePublicLink(Id contentDocumentId) {
    ContentVersion cv = [
      SELECT Id, Title
      FROM ContentVersion
      WHERE ContentDocumentId = :contentDocumentId
    ];

    ContentDistribution conDis = new ContentDistribution();
    conDis.Name = cv.Title;
    conDis.ContentVersionId = cv.Id;
    conDis.PreferencesAllowViewInBrowser = true;
    insert conDis;

    ContentDistribution cd = [
      SELECT Id, ContentDocumentId, ContentDownloadUrl, DistributionPublicUrl
      FROM ContentDistribution
      WHERE ContentDocumentId = :contentDocumentId
    ];
    return cd.ContentDownloadUrl;
  }
}
