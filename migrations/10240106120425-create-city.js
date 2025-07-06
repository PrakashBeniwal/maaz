'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1
      },
      stateId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'states',
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
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

    // ✅ Add composite unique constraint (name + stateId)
    await queryInterface.addConstraint('cities', {
      fields: ['name', 'stateId'],
      type: 'unique',
      name: 'unique_city_name_per_state'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('cities', 'unique_city_name_per_state');
    await queryInterface.dropTable('cities');
  }
};

