'use strict';

module.exports = app => {
  const { BIGINT, STRING, ENUM, DATE } = app.Sequelize;

  const AdminUser = app.model.define(
    'AdminUser',
    {
      id: {
        type: BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },

      name: {
        type: STRING(64),
        allowNull: true,
      },

      email: {
        type: STRING(255),
        allowNull: false,
        unique: true,
      },

      password: {
        type: STRING(255),
        allowNull: false,
      },

      role: {
        type: ENUM('admin', 'manager', 'superadmin'),
        allowNull: false,
        defaultValue: 'admin',
      },

      status: {
        type: ENUM('active', 'disabled'),
        allowNull: false,
        defaultValue: 'active',
      },

      created_at: {
        type: DATE,
        allowNull: false,
      },

      updated_at: {
        type: DATE,
        allowNull: false,
      },
    },
    {
      tableName: 'admin_users',
      timestamps: false,       // เพราะใช้ created_at / updated_at เอง
      freezeTableName: true,   // ไม่เติม s
      underscored: false,
    }
  );

  return AdminUser;
};
