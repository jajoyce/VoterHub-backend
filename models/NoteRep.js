module.exports = (sequelize, DataTypes) => {
  const NoteRep = sequelize.define(
    "NoteRep",
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      repName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      repOffice: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "notes_rep",
    }
  );
  return NoteRep;
};
