import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggerService } from '../logger.service';

@Injectable({
  providedIn: 'root',
})
export class SuggestionService {
  constructor(private logger: LoggerService, private http: HttpClient) {}

  getSuggestions() {
    return this.http.get('/suggestion');
  }

  updateSuggestedList(list: string[], section: string, field: string) {
    this.logger.debug(`add suggestion for ${section} ${field} => ${JSON.stringify(list)}`);
    return this.http.patch(`/suggestion/${section}`, { [field]: list });
  }
}
