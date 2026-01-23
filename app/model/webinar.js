'use strict';

module.exports = app => {
  const { BIGINT, STRING, DATE, CHAR } = app.Sequelize;

  const Webinar = app.model.define(
    'webinar',
    {
      id: {
        type: BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },

      name: {
        type: STRING(255),
        allowNull: false,
      },

      start_date: {
        type: STRING(64), // e.g. 2026-01-01T00:00:00+00:00
        allowNull: true,
      },

      end_date: {
        type: STRING(64), // e.g. 2026-01-30T13:00:00+00:00
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
      },

      solve_by: {
        type: STRING(255),
        allowNull: true,
      },

      modify_datetime: {
        type: DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'webinar',
      timestamps: false,
      underscored: false,
    }
  );

  return Webinar;
};
