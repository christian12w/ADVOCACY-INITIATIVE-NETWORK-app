const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const subscriptions = sequelize.define(
    'subscriptions',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

plan: {
        type: DataTypes.ENUM,

        values: [

"basic",

"premium"

        ],

      },

status: {
        type: DataTypes.TEXT,

      },

start_date: {
        type: DataTypes.DATE,

      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  subscriptions.associate = (db) => {

    db.subscriptions.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.subscriptions.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return subscriptions;
};

