@isTest
global class MockHttpApiResponseGenerator implements HttpCalloutMock {
  global static HTTPResponse respond(HTTPRequest req) {
    Body bodyobj = new Body('PdfUrl1', 'PdfUrl2');
    String jsonString = JSON.serializePretty(bodyobj);
    HttpResponse res = new HttpResponse();
    res.setStatus('OK');
    res.setStatusCode(200);
    res.setBody(jsonString);
    return res;
  }
}
