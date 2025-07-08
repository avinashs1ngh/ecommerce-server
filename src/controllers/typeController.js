const { Type } = require('../models');
const CustomError = require('../utils/errorHandler');
const getAllTypesPublic = async (req, res) => {
  try {
    const types = await Type.findAll({
      attributes: ['typeName', 'typeSlug'],
    });

    const secondaryNavLinks = types.map(type => ({
      name: type.typeName,
      url: `#collections/${type.typeSlug}`,
    }));

    res.status(200).json({ secondaryNavLinks });
  } catch (error) {
    console.error('Error in getAllTypesPublic:', error);
    res.status(500).json({ message: error.message });
  }
};
const getAllTypes = async (req, res, next) => {
  try {
    const types = await Type.findAll({
      attributes: ['typeId', 'typeName', 'typeSlug', 'description', 'createdAt', 'updatedAt'],
    });
    res.json(types);
  } catch (err) {
    next(err);
  }
};

const getTypeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const type = await Type.findByPk(id, {
      attributes: ['typeId', 'typeName', 'typeSlug', 'description', 'createdAt', 'updatedAt'],
    });
    if (!type) throw new CustomError('Type not found', 404);
    res.json(type);
  } catch (err) {
    next(err);
  }
};

const createType = async (req, res, next) => {
  const { typeName, typeSlug, description } = req.body;

  try {
    if (!typeName || !typeSlug) {
      throw new CustomError('Type name and slug are required', 400);
    }

    const type = await Type.create({
      typeName,
      typeSlug,
      description,
    });

    res.status(201).json({
      message: 'Type created successfully',
      success: true,
      type,
    });
  } catch (err) {
    next(err);
  }
};

const updateType = async (req, res, next) => {
  const { id } = req.params;
  const { typeName, typeSlug, description } = req.body;

  try {
    const type = await Type.findByPk(id);
    if (!type) throw new CustomError('Type not found', 404);

    const updatedFields = {
      typeName: typeName || type.typeName,
      typeSlug: typeSlug || type.typeSlug,
      description: description !== undefined ? description : type.description,
    };

    await type.update(updatedFields);

    res.json({
      message: 'Type updated successfully',
      success: true,
      type,
    });
  } catch (err) {
    next(err);
  }
};

const deleteType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const type = await Type.findByPk(id);
    if (!type) throw new CustomError('Type not found', 404);

    await type.destroy();

    res.json({ message: 'Type deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { deleteType, updateType, createType, getTypeById, getAllTypes ,getAllTypesPublic};