'use strict';

module.exports = app => {
  const { STRING, ENUM, DATE } = app.Sequelize;

  const Users = app.model.define(
    'users',
    {
      account_id: {
        type: STRING(36),
        primaryKey: true,
      },
      email: {
        type: STRING(255),
        unique: true,
      },
      password: {
        type: STRING(255),
      },
      lastname: {
        type: STRING(255),
        allowNull: true,
      },
      country: {
        type: STRING(100),
        allowNull: true,
      },
      status: {
        type: ENUM('active', 'pending', 'disabled'),
        defaultValue: 'pending',
      },
      type: {
        type: ENUM('user', 'admin', 'system'),
        defaultValue: 'user',
      },
      account_created_at: {
        type: DATE,
      },
      register_date: {
        type: DATE,
      },
      updated_at: {
        type: DATE,
      },
    },
    {
      timestamps: false,
      tableName: 'users',
    }
  );

  return Users;
};
