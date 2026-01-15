'use strict';

module.exports = app => {
  const { BIGINT, STRING, DATE, CHAR } = app.Sequelize;

  const Overlapping = app.model.define(
    'overlapping',
    {
      id: {
        type: BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },

      email: {
        type: STRING(255),
        allowNull: false,
      },

      ip_address: {
        type: STRING(45), 
        allowNull: true,
      },

      created_at: {
        type: DATE,
        allowNull: false,
        defaultValue: app.Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      status: {
        type: CHAR(36),
        allowNull: true,
        comment: 'overlapping status or reference id',
      },

      solve_by: {
        type: STRING(255),
        allowNull: true,
        comment: 'admin / system / auto-check',
      },

      modify_datetime: {
        type: DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'overlapping',
      timestamps: false, // ใช้ field manual
      underscored: false,
    }
  );

  return Overlapping;
};
