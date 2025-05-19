const { DataTypes } = require('sequelize');

     module.exports = (sequelize) => {
       const Option = sequelize.define('Option', {
         optionId: {
           type: DataTypes.UUID,
           defaultValue: DataTypes.UUIDV4,
           primaryKey: true,
         },
         attributeId: {
           type: DataTypes.UUID,
           allowNull: false,
         },
         value: {
           type: DataTypes.STRING,
           allowNull: false,
         },
       });

       return Option;
     };