module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      registeredVoter: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      tableName: "users",
    }
  );
  return User;
};
