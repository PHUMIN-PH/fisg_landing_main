'use strict';

module.exports = app => {
  const { BIGINT, STRING, DATE } = app.Sequelize;

  const WebinarRegister = app.model.define(
    'webinar_registers',
    {
      id: {
        type: BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },

      type: {
        type: STRING(32),
        allowNull: true,
      },

      link_id: {
        type: STRING(64),
        allowNull: false,
      },

      unique_code: {
        type: STRING(64),
        allowNull: false,
      },

      periodtime: {
        type: STRING(32),
        allowNull: false,
      },

      month_key: {
        type: STRING(10),
        allowNull: true,
      },

      timezone: {
        type: STRING(64),
        allowNull: true,
      },

      source: {
        type: STRING(64),
        allowNull: true,
      },

      signature: {
        type: STRING(255),
        allowNull: true,
      },

      timestamp: {
        type: BIGINT,
        allowNull: true,
      },

      language: {
        type: STRING(16),
        allowNull: true,
      },

      phonecode: {
        type: STRING(16),
        allowNull: true,
      },

      name: {
        type: STRING(255),
        allowNull: false,
      },

      phone: {
        type: STRING(32),
        allowNull: true,
      },

      email: {
        type: STRING(255),
        allowNull: false,
      },

      password: {
        type: STRING(255),
        allowNull: true,
      },

      country: {
        type: STRING(64),
        allowNull: true,
      },

      remote_ip: {
        type: STRING(45),
        allowNull: true,
      },

      created_at: {
        type: DATE,
        allowNull: false,
        defaultValue: app.Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      tableName: 'webinar_registers',
      timestamps: false,
      underscored: false,
    }
  );

  return WebinarRegister;
};
