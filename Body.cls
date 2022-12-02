global with sharing class Body {
  String salesforceOrgId;
  List<String> pdfURLS;
  global Body(String url1, String url2) {
    salesforceOrgId = '123456789123456789';
    pdfURLS = new List<String>();
    pdfURLS.add(url1);
    pdfURLS.add(url2);
  }
}
