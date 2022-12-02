global with sharing class httpRequestApiClass {
  public static HttpCalloutMock mock = null;
  @AuraEnabled
  global static String generateHttpRequest(String url1, String url2) {
    String mergeFileUrl = HttpRequest(url1, url2);
    return mergeFileUrl;
  }

  global static String HttpRequest(String publicUrlPdf1, String publicUrlPdf2) {
    Http http = new Http();
    String jsonString;
    Body bodyobj = new Body(publicUrlPdf1, publicUrlPdf2);
    if (bodyobj != null) {
      jsonString = JSON.serializePretty(bodyobj);
    }
    HttpRequest request = new HttpRequest();
    request.setEndpoint('https://api.dryadreceipting.com/mergePDFFromSF');
    request.setHeader(
      'authorizationToken',
      'df695c5a-fb19-41de-8ec3-4e3e12c281a8'
    );
    request.setHeader('Content-Type', 'application/json');
    request.setMethod('POST');
    request.setTimeout(120000);
    request.setBody(jsonString);
    HttpResponse response = new HttpResponse();

    if (Test.isRunningTest() && (mock != null)) {
      response = mock.respond(request);
    } else {
      response = http.send(request);
    }

    Map<String, Object> Obj = (Map<String, Object>) JSON.deserializeUntyped(
      response.getBody()
    );
    String completeUrl = String.Valueof(Obj.get('FileUrl'));
    return completeUrl;
  }
}
