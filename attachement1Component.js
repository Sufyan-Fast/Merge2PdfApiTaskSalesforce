import { LightningElement, api, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import uploadFile from "@salesforce/apex/FileUpload.uploadFile";
import generatePublicLink from "@salesforce/apex/GeneratePublicUrl.generatePublicLink";
import generateHttpRequest from "@salesforce/apex/httpRequestApiClass.generateHttpRequest";

export default class Attachement1Component extends LightningElement {
  @api recordId;
  @track publicUrlPdf2;
  DocumentId;
  fileData;
  publicUrlPdf1;
  mergePdfUrl;
  error;

  handleGetPublicUrl(event) {
    this.publicUrlPdf2 = event.detail;
    //function call when we get our second public url from child
    this.getMergePdfUrl(this.publicUrlPdf1, this.publicUrlPdf2);
  }

  openfileUpload(event) {
    const file = event.target.files[0];
    let reader = new FileReader();
    reader.onload = () => {
      let base64 = reader.result.split(",")[1];
      this.fileData = {
        filename: file.name,
        base64: base64,
        recordId: this.recordId
      };
    };
    reader.readAsDataURL(file);
  }

  handleClick() {
    const { base64, filename, recordId } = this.fileData;
    uploadFile({ base64, filename, recordId })
      .then((result) => {
        this.DocumentId = result;
        this.fileData = null;
        let title = `Files uploaded successfully!!`;
        //function call for child function to get things done for second document
        this.template.querySelector("c-attachement-2-component").handleClick();
        //toast function
        this.toast(title);
        //function for generate public url for document1
        this.generatePublicURLDocument(this.DocumentId);
      })
      .catch((error) => {
        this.error = error;
        this.DocumentId = undefined;
      });
  }

  generatePublicURLDocument(documentId) {
    generatePublicLink({ contentDocumentId: documentId })
      .then((result) => {
        this.publicUrlPdf1 = result;
      })
      .catch((error) => {
        this.error = error;
        this.publicUrlPdf1 = undefined;
      });
  }
  //toast function
  toast(title) {
    const toastEvent = new ShowToastEvent({
      title,
      variant: "success"
    });
    this.dispatchEvent(toastEvent);
  }

  //function that call for the merge url
  getMergePdfUrl(url1, url2) {
    generateHttpRequest({ url1: url1, url2: url2 })
      .then((result) => {
        this.mergePdfUrl = result;
        window.open(this.mergePdfUrl, "_blank");
      })
      .catch((error) => {
        this.error = error;
        this.mergePdfUrl = undefined;
      });
  }
}
