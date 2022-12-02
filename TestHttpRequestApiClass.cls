@isTest
private class TestHttpRequestApiClass {
  @isTest
  static void TesthttpRequest() {
    httpRequestApiClass.mock = new MockHttpApiResponseGenerator();
    httpRequestApiClass.generateHttpRequest('PdfUrl1', 'PdfUrl2');
  }
}
