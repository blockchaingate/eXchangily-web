import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from '../models/config';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  config: Config;

  constructor(private http: HttpClient) {
    this.loadConfig();
  }

  // Read a Json file, return an observable.
  getJsonFile(filePath: string) {
    return this.http.get(filePath);
  }

  loadConfig() {
    if (!this.config) {
      return this.http.get('/data/config.json').subscribe((config: Config) => this.config = config);
    }
  }
}
