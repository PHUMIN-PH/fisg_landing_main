'use strict';

module.exports = app => {
  const { STRING, DATE, ENUM } = app.Sequelize;

  const User = app.model.define(
    'User',
    {
      user_id: {
        type: STRING(36),
        primaryKey: true,
        allowNull: true,
      },

      email: {
        type: STRING(255),
        allowNull: false,
        unique: true,
      },

      password: {
        type: STRING(255),
        allowNull: true,
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
        allowNull: false,
      },

      type: {
        type: ENUM('user', 'admin', 'system'),
        allowNull: false,
      },

      account_created_at: {
        type: DATE,
        allowNull: false,
      },

      register_date: {
        type: DATE,
        allowNull: false,
      },

      updated_at: {
        type: DATE,
        allowNull: false,
      },
    },
    {
      tableName: 'users',      
      timestamps: false,       
      freezeTableName: true,   // กัน sequelize เปลี่ยนชื่อ table
    }
  );

  return User;
};
