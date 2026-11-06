import { inject, Service } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiResponseZelda} from "../common/models/zelda.model";
import {environment} from "../../environments/environment";

@Service()
export class ZeldaService {
  private readonly httpClient: HttpClient = inject(HttpClient);

  getZeldaMaterials(): Observable<ApiResponseZelda>{
    return this.httpClient.get<ApiResponseZelda>(
      environment.URLBase + '/materials',
    )
  }
}
