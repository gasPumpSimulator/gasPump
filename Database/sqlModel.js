const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('mysql://username:password@localhost:3306/database_name');

const FuelPump = sequelize.define('FuelPump', {
  // Define the attributes of the User model
  TransactionId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  FuelType: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  PumpedFuel: {
    type: DataTypes.DECIMAL(5, 3),
    allowNull: false
  },
  PumpedAmount: {
    type: DataTypes.DECIMAL(5, 4),
    allowNull: false,
  },
  TransactionDateTime: {
    type: DataTypes.DATETIME,
    allowNull: false
  }
});

// Sync the model with the database
(async () => {
  await sequelize.sync();
})();

module.exports = FuelPump;


/* MySQL Model

CREATE DATABASE gasPump;

USE gasPump;

-- Table for storing information about the fuel pumps
CREATE TABLE FuelPumps (
    TransactionId INT PRIMARY KEY,
    FuelType VARCHAR(50) NOT NULL,
    PumpedFuel DECIMAL(10,2) NOT NULL,
    PumpedAmount DECIMAL(10,2) NOT NULL,
    TransactionDateTime DATETIME NOT NULL
);
*/