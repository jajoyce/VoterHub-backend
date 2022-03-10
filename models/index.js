const { Sequelize, DataTypes } = require("sequelize");

// const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname')

const sequelize = new Sequelize("voter_hub", "jaj", "passwordGoesHere", {
  host: "localhost",
  dialect: "postgres",
});

async function pgConnect() {
  try {
    await sequelize.authenticate();
    console.log("DB SUCCESSFULLY CONNECTED.");
  } catch (error) {
    console.error("UNABLE TO CONNECT TO DATABASE:", error);
  }
}

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.pgConnect = pgConnect;

db.User = require("./User")(sequelize, DataTypes);
db.NoteRep = require("./NoteRep")(sequelize, DataTypes);

db.User.NoteRep = db.User.hasMany(db.NoteRep, {
  foreignKey: { name: "userId", defaultValue: 1 },
});
db.NoteRep.User = db.NoteRep.belongsTo(db.User, {
  foreignKey: { name: "userId" },
});

// db.User.sync({ force: true });
// db.NoteRep.sync({ force: true });

module.exports = db;

//////////
// FROM SEQUELIZE-CLI:
//////////

// 'use strict';

// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.json')[env];
// const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;
