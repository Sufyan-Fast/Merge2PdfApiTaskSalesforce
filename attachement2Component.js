import { LightningElement, api } from "lwc";
import uploadFile from "@salesforce/apex/FileUpload.uploadFile";
import generatePublicLink from "@salesforce/apex/GeneratePublicUrl.generatePublicLink";

export default class Attachement2Component extends LightningElement {
  @api recordId;
  DocumentId;
  fileData;
  publicUrl;
  error;

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

  @api
  async callChildPromiseFunctions() {
    try {
      const { base64, filename, recordId } = this.fileData;
      const result = await uploadFile({ base64, filename, recordId });
      this.DocumentId = result;
      this.fileData = null;
      await this.generatePublicURLDocument(this.DocumentId);
    } catch (error) {
      this.error = error;
      this.documentId = undefined;
    }
  }
  //generate public link for second document
  async generatePublicURLDocument(documentId) {
    try {
      const result = await generatePublicLink({
        contentDocumentId: documentId,
      });
      this.publicUrl = result;
      const selectedEvent = new CustomEvent("getpublicurl", {
        detail: this.publicUrl,
      });
      this.dispatchEvent(selectedEvent);
    } catch (error) {
      this.error = error;
      this.publicUrl = undefined;
    }
  }
}
