export interface IBenefit {
  id?: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export class Benefit implements IBenefit {
  public id?: number;
  public name: string;
  public description?: string;
  public isActive: boolean;

  constructor(data: IBenefit) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.isActive = data.isActive ?? true;

    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.length < 3 || this.name.length > 100) {
      throw new Error('Name must be between 3 and 100 characters');
    }

    if (this.description && this.description.length > 255) {
      throw new Error('Description must not exceed 255 characters');
    }
  }

  public toJSON(): IBenefit {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      isActive: this.isActive
    };
  }
}
