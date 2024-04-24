'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      BookingID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
      },
      UserID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      ServiceID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Services',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      DriverID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Drivers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      pickupLocation: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dropoffLocation: {
        type: Sequelize.STRING,
        allowNull: false
      },
      pickupTime: {
        type: Sequelize.DATE,
        allowNull: false
      },
      dropoffTime: {
        type: Sequelize.DATE,
        allowNull: false
      },
      bookingDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      bookingStatus: {
        type: Sequelize.STRING,
        allowNull: false
      },
      userContactNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      seatType: {
        type: Sequelize.STRING,
        allowNull: true
      },
      seatAmount: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      totalFare: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Bookings');
  }
};