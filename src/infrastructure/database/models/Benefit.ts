import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config';
import { IBenefit } from '../../../domain/entities/Benefit';

interface BenefitAttributes extends IBenefit {
  id: number;
}

class BenefitModel extends Model<BenefitAttributes> {
  declare id: number;
  declare name: string;
  declare description: string;
  declare isActive: boolean;
}

BenefitModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [3, 100],
      },
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active'
    },
  },
  {
    sequelize,
    modelName: 'Benefit',
    tableName: 'benefits',
    timestamps: true,
    underscored: true,
    freezeTableName: true
  },
);

export default BenefitModel;
