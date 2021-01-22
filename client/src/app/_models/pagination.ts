import { Member } from "./member"

export interface PaginationHeader{
    pageNumber: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
}

export class PaginatedResult<T>{
    body: T;
    pagination: PaginationHeader;
}

