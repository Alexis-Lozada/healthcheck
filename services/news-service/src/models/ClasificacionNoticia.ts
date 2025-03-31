// src/models/ClasificacionNoticia.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';
import News from './News';
import ModeloML from './ModeloML';

class ClasificacionNoticia extends Model {
  public id!: number;
  public noticia_id!: number;
  public modelo_id!: number | null;
  public resultado!: 'verdadera' | 'falsa' | 'dudosa';
  public confianza!: number | null;
  public explicacion!: string | null;
  public fecha_clasificacion!: Date;
  
  // Relación
  public readonly modelo?: ModeloML;
}

ClasificacionNoticia.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    noticia_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'noticias',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    modelo_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'modelos_ml',
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    resultado: {
      type: DataTypes.ENUM('verdadera', 'falsa', 'dudosa'),
      allowNull: false,
    },
    confianza: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    explicacion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fecha_clasificacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'ClasificacionNoticia',
    tableName: 'clasificacion_noticias',
    timestamps: false,
  }
);

// Definir relación con ModeloML
ClasificacionNoticia.belongsTo(ModeloML, {
  foreignKey: 'modelo_id',
  as: 'modelo'
});

export default ClasificacionNoticia;