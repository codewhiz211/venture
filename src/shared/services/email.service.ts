import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { APP_CONFIG } from 'app.config';
import { serviceLogger } from './serviceLogger';

interface BaseEmailData {
  to: string | Array<string>;
  from: string;
  cc?: string | Array<string>;
  subject?: string;
}
interface JobCreatedEmailData extends BaseEmailData {
  message: string;
  type: 'standard' | 'remedial';
  urgent: boolean;
}

interface JobUpdatedEmailData extends BaseEmailData {
  message: string;
  urgent: boolean;
}

interface RemedialCreatedEmailData extends BaseEmailData {
  link: string;
  message: string;
}

interface RemedialUpdatedEmailData extends BaseEmailData {
  description: string;
  feedback: string;
  lotNumber: string;
  status: 'approved' | 'declined';
  subdivision: string;
}

interface RemedialSubmittedEmailData extends BaseEmailData {
  comments: string;
  description: string;
  lotNumber: string;
  subbieName: string;
  subdivision: string;
}

interface RemedialSubmittedEmailData extends BaseEmailData {
  comments: string;
  description: string;
  lotNumber: string;
  subbieName: string;
  subdivision: string;
}

interface ShareFilesEmailData extends BaseEmailData {
  attachments?: string;
  message: string;
  specId: string;
}

interface ShareSpecEmailData extends BaseEmailData {
  attachments?: string;
  message: string;
  specId: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private config;

  constructor(@Inject(APP_CONFIG) config, private http: HttpClient) {
    this.config = config;
  }

  public sendJobCreatedEmail(emailData: JobCreatedEmailData) {
    return this.sendTemplateEmail(environment.jobCreatedEmailTemplateId, emailData);
  }

  public sendJobUpdatedEmail(emailData: JobUpdatedEmailData) {
    return this.sendTemplateEmail(environment.jobUpdatedEmailTemplateId, emailData);
  }

  public sendShareFilesEmail(emailData: ShareFilesEmailData) {
    return this.sendTemplateEmail(environment.shareFilesEmailTemplateId, emailData);
  }

  public sendShareSpecEmail(emailData: ShareSpecEmailData) {
    return this.sendTemplateEmail(environment.shareSpecEmailTemplateId, emailData);
  }

  public sendRemedialCreatedEmail(emailData: RemedialCreatedEmailData) {
    return this.sendTemplateEmail(environment.remedialCreatedEmailTemplateId, emailData);
  }

  public sendRemedialUpdatedEmail(emailData: RemedialUpdatedEmailData) {
    return this.sendTemplateEmail(environment.remedialUpdatedEmailTemplateId, emailData);
  }

  public sendRemedialSubmittedEmail(emailData: RemedialSubmittedEmailData) {
    return this.sendTemplateEmail(environment.remedialSubmittedEmailTemplateId, emailData);
  }

  /**
   * Send an Email using one of the SendGrid templates
   * @param emailTemplateId (see environment.ts)
   * @param emailData
   */
  private sendTemplateEmail(emailTemplateId: string, emailData: any) {
    serviceLogger('email sending data:', emailData);

    const endpoint = `https://us-central1-${this.config.projectId}.cloudfunctions.net/app/sendEmail/${emailTemplateId}`;

    return this.http.post(endpoint, emailData);
  }
}
