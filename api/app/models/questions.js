'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Questions extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   };
//   Questions.init({
//     title: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'Questions',
//   });
//   return Questions;
// };

module.exports = (sequelize, DataTypes) => {
  const Questions = sequelize.define('Questions', {
    id: {
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      validate: {
        isUUID: {
          args: 4,
          msg: 'ID is not valid. Please try again.',
        },
      },
    },
    title: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [3, 500],
          msg: 'Question value is required.',
        },
      },
    },
    quizId: {
      type: DataTypes.UUID,
      onDelete: 'CASCADE',
      references: {
        model: 'Quizzes',
        key: 'id',
      },
      validate: {
        isUUID: {
          args: 4,
          msg: 'Quiz ID is not valid. Please try again.',
        },
      },
    },
  });
  Questions.associate = (models) => {
    Questions.belongsTo(models.Quizzes, { foreignKey: 'quizId' });
    Questions.hasMany(models.Choices, { foreignKey: 'questionId' });
  };
  return Questions;
};
