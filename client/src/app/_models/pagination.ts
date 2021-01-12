import { Member } from "./member"

export interface PaginationHeader{
    pageNumber: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
}

export class PaginatedResult{
    body: Member[];
    pagination: PaginationHeader;
}

