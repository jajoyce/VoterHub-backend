require("dotenv").config();

const { Sequelize, DataTypes } = require("sequelize");

// For Heroku
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// For localhost
// const sequelize = new Sequelize("voter_hub", null, null, {
//   dialect: "postgres",
// });

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
db.NoteInfo = require("./NoteInfo")(sequelize, DataTypes);

db.User.NoteRep = db.User.hasMany(db.NoteRep, {
  foreignKey: { name: "userID" },
});
db.NoteRep.User = db.NoteRep.belongsTo(db.User, {
  foreignKey: { name: "userID" },
});

db.User.NoteInfo = db.User.hasMany(db.NoteInfo, {
  foreignKey: { name: "userID" },
});
db.NoteInfo.User = db.NoteInfo.belongsTo(db.User, {
  foreignKey: { name: "userID" },
});

// db.User.sync({ force: true });
// db.NoteRep.sync({ force: true });
// db.NoteInfo.sync({ force: true });

module.exports = db;
