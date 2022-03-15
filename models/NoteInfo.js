module.exports = (sequelize, DataTypes) => {
  const NoteInfo = sequelize.define(
    "NoteInfo",
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "notes_info",
    }
  );
  return NoteInfo;
};
