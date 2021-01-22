import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { GenericParams } from "../_models/generic-params";
import { Member } from "../_models/member";
import { PaginatedResult, PaginationHeader } from "../_models/pagination";

export function getPaginatedResult<T>(url: string, httpClient: HttpClient, params: HttpParams)
  : Observable<PaginatedResult<T>>{
  const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    return httpClient.get<Member[]>(url, { params: params, observe: 'response' }).pipe(
        map(res => {
          let pagination: PaginationHeader = JSON.parse(res.headers.get("X-Pagination"));
          paginatedResult.body = <T><unknown>res.body;
          paginatedResult.pagination = pagination;
          return paginatedResult;
        })
    );
}

export function getPaginationHeaders(genericParams: GenericParams): HttpParams{
  let params = new HttpParams();

  if (genericParams.pageNumber !== undefined && genericParams.pageSize !== undefined){
    params = params.append('pageNumber', genericParams.pageNumber.toString());
    params = params.append('pageSize', genericParams.pageSize.toString());
  }
  
  return params;
}

