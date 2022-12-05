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

  // custom event for getting public url from child
  handleGetPublicUrl(event) {
    this.publicUrlPdf2 = event.detail;
  }

  openfileUpload(event) {
    const file = event.target.files[0];
    let reader = new FileReader();
    reader.onload = () => {
      let base64 = reader.result.split(",")[1];
      this.fileData = {
        filename: file.name,
        base64: base64,
        recordId: this.recordId,
      };
    };
    reader.readAsDataURL(file);
  }

  //call from submit button
  handleClick() {
    this.callPromiseFunctions();
  }

  async callPromiseFunctions() {
    try {
      const { base64, filename, recordId } = this.fileData;
      const result = await uploadFile({ base64, filename, recordId });
      this.DocumentId = result;
      this.fileData = null;
      await this.template
        .querySelector("c-attachement-2-component")
        .callChildPromiseFunctions();
      await this.generatePublicURLDocument(this.DocumentId);
      await this.toast();
      await this.getMergePdfUrl(this.publicUrlPdf1, this.publicUrlPdf2);
    } catch (error) {
      this.error = error;
      this.DocumentId = undefined;
    }
  }

  //get public url of document
  async generatePublicURLDocument(documentId) {
    try {
      const result = await generatePublicLink({
        contentDocumentId: documentId,
      });
      this.publicUrlPdf1 = result;
    } catch (error) {
      this.error = error;
      this.publicUrlPdf1 = undefined;
    }
  }
  //toast function
  toast() {
    const toastEvent = new ShowToastEvent({
      title: "Files uploaded successfully!!",
      variant: "success",
    });
    this.dispatchEvent(toastEvent);
  }

  //function that call for the merge url
  async getMergePdfUrl(url1, url2) {
    try {
      const result = await generateHttpRequest({ url1: url1, url2: url2 });
      this.mergePdfUrl = result;
      window.open(this.mergePdfUrl, "_blank");
    } catch (error) {
      this.error = error;
      this.mergePdfUrl = undefined;
    }
  }
}
