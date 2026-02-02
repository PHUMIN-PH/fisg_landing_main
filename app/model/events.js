'use strict';

module.exports = app => {
  const { BIGINT, STRING, DATE, ENUM } = app.Sequelize;

  const Events = app.model.define(
    'events',
    {
      id: {
        type: BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },

      event_name: {
        type: STRING(255),
        allowNull: false,
        unique: true,
      },

      status: {
        type: ENUM('active', 'disabled'),
        allowNull: false,
        defaultValue: 'active',
      },

      created_at: {
        type: DATE,
        allowNull: false,
        defaultValue: app.Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updated_at: {
        type: DATE,
        allowNull: true,
        defaultValue: app.Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      tableName: 'events',
      timestamps: false,   // ใช้ manual datetime
      underscored: false,
    }
  );

  return Events;
};
