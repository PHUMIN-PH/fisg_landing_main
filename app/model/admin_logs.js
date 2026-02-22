'use strict';

module.exports = app => {
  const { BIGINT, STRING, DATE, ENUM, JSON } = app.Sequelize;

  const AdminLogs = app.model.define(
    'AdminLogs',
    {
      id: {
        type: BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },

      admin_id: {
        type: BIGINT.UNSIGNED,
        allowNull: false,
      },

      admin_email: {
        type: STRING(255),
        allowNull: false,
      },

      action: {
        type: STRING(64),
        allowNull: false,
      },

      resource: {
        type: STRING(64),
        allowNull: true,
      },

      target_id: {
        type: STRING(64),
        allowNull: true,
      },

      status: {
        type: ENUM('success', 'failed'),
        allowNull: false,
        defaultValue: 'success',
      },

      message: {
        type: STRING(255),
        allowNull: true,
      },

      ip_address: {
        type: STRING(45),
        allowNull: true,
      },

      user_agent: {
        type: STRING(255),
        allowNull: true,
      },

      payload: {
        type: JSON,
        allowNull: true,
      },

      created_at: {
        type: DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'admin_logs',
      timestamps: false,
      freezeTableName: true,
    }
  );

  return AdminLogs;
};
