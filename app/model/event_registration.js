'use strict';

module.exports = app => {
  const { BIGINT, STRING, DATE, ENUM } = app.Sequelize;

  const EventRegistration = app.model.define(
    'EventRegistration',
    {
      id: {
        type: BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },

      event_name: {
        type: STRING(255),
        allowNull: false,
      },

      user_id: {
        type: STRING(36),
        allowNull: false,
      },

      email: {
        type: STRING(255),
        allowNull: false,
      },

      verify_method: {
        type: ENUM('password', 'otp', 'other'),
        allowNull: false,
      },

      status: {
        type: ENUM('success', 'failed', 'cancelled'),
        allowNull: false,
      },

      fail_reason: {
        type: STRING(255),
        allowNull: true,
      },

      registered_date: {
        type: DATE,
        allowNull: false,
      },

      month_key: {
        type: STRING(7), // YYYY-MM
        allowNull: false,
      },

      created_at: {
        type: DATE,
        allowNull: false,
      },
    },
    {
      tableName: 'event_registrations',
      timestamps: false,
      freezeTableName: true,
    }
  );

  return EventRegistration;
};
