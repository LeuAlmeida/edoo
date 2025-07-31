import { IBenefit } from '../entities/Benefit';

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IBenefitRepository {
  findAll(options?: PaginationOptions): Promise<PaginatedResult<IBenefit>>;
  findById(id: number): Promise<IBenefit | null>;
  create(benefit: IBenefit): Promise<IBenefit>;
  update(id: number, benefit: Partial<IBenefit>): Promise<IBenefit | null>;
  delete(id: number): Promise<void>;
}
