'use strict';

module.exports = app => {
  const { BIGINT, STRING, DATE, ENUM } = app.Sequelize;

  const AdminUsers = app.model.define(
    'AdminUsers',
    {
      id: {
        type: BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: STRING(64),
        allowNull: true,
        unique: true,
      },
      email: {
        type: STRING(255),
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: STRING(255),
        allowNull: false,
      },
      role: {
        type: ENUM('admin', 'staff', 'viewer'),
        allowNull: false,
        defaultValue: 'staff',
      },
      status: {
        type: ENUM('active', 'disabled'),
        allowNull: false,
        defaultValue: 'active',
      },
      last_login_at: {
        type: DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'admin_users',
      timestamps: false,
      underscored: false,
    }
  );

  return AdminUsers;
};
