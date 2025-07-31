import { IBenefit } from '../entities/Benefit';

export interface IBenefitRepository {
  findAll(): Promise<IBenefit[]>;
  findById(id: number): Promise<IBenefit | null>;
  create(benefit: IBenefit): Promise<IBenefit>;
  update(id: number, benefit: Partial<IBenefit>): Promise<IBenefit | null>;
  delete(id: number): Promise<void>;
}
