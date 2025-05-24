const { Customer } = require('../models');
const CustomError = require('../utils/errorHandler');
const { Sequelize } = require('sequelize');

const getAllCustomers = async (req, res, next) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const customers = await Customer.findAll({
      where: { isActive: true },
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: [
        'customerId',
        'firstName',
        'lastName',
        'email',
        'mobileNumber',
        'shippingAddress',
        'billingAddress',
        'isActive',
        'lastLogin',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!customers.length) {
      throw new CustomError('No active customers found', 404);
    }

    return res.status(200).json({ success: true, data: customers });
  } catch (error) {
    next(error instanceof CustomError ? error : new CustomError('Failed to fetch customers', 500));
  }
};

const getCustomerDetails=async(req, res, next)=> {
  const customerId=req.params
    try {
      if (!customerId) {
        throw new CustomError('Customer ID is required', 400);
      }

      const customer = await Customer.findOne({
        where: { customerId, isActive: true },
        attributes: [
          'customerId',
          'firstName',
          'lastName',
          'email',
          'mobileNumber',
          'shippingAddress',
          'billingAddress',
          'isActive',
          'lastLogin',
          'createdAt',
          'updatedAt',
        ],
      });

      if (!customer) {
        throw new CustomError('Customer not found or inactive', 404);
      }

      return res.status(200).json({ success: true, data: customer });
    } catch (error) {
      throw error instanceof CustomError ? error : new CustomError('Failed to fetch customer details', 500);
    }
  };

  const createCustomer=async(req,res,next)=> {
    try {
      console.log(" the input data is ",req.body);
      const { firstName, lastName, email, mobileNumber, shippingAddress, billingAddress } = req.body;

      if (!firstName || !lastName || !email || !mobileNumber || !shippingAddress ) {
        throw new CustomError('Missing required fields', 400);
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new CustomError('Invalid email format', 400);
      }

      const mobileRegex = /^[0-9]{10}$/;
      if (!mobileRegex.test(mobileNumber)) {
        throw new CustomError('Invalid mobile number format', 400);
      }

      const existingCustomer = await Customer.findOne({ where: { email } });
      if (existingCustomer) {
        throw new CustomError('Email already in use', 409);
      }

      const customer = await Customer.create({
        firstName,
        lastName,
        email,
        mobileNumber,
        shippingAddress,
        billingAddress: billingAddress || shippingAddress, 
        isActive: true,
      });

       return res.status(201).json({ success: true,message:"Customer Created Succesfully", data: customer });
    } catch (error) {
      throw error instanceof CustomError ? error : new CustomError('Failed to create customer', 500);
    }
  };

const updateCustomer = async (req, res, next) => {
  const { customerId } = req.params;
  console.log("Received customerId:", customerId);
  console.log("Request body:", req.body);

  try {
    if (!customerId) {
      throw new CustomError('Customer ID is required', 400);
    }

    const customer = await Customer.findOne({ where: { customerId, isActive: true } });
    if (!customer) {
      throw new CustomError('Customer not found or inactive', 404);
    }

    const { firstName, lastName, email, mobileNumber, shippingAddress, billingAddress } = req.body;

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new CustomError('Invalid email format', 400);
      }
      const existingCustomer = await Customer.findOne({
        where: { email, customerId: { [Sequelize.Op.ne]: customerId } }
      });
      if (existingCustomer) {
        throw new CustomError('Email already in use', 409);
      }
    }

    if (mobileNumber) {
      const mobileRegex = /^[0-9]{10}$/;
      if (!mobileRegex.test(mobileNumber)) {
        throw new CustomError('Invalid mobile number format', 400);
      }
    }

    // Validate JSON strings for addresses
    if (shippingAddress) {
      try {
        JSON.parse(shippingAddress);
      } catch (e) {
        console.error('Invalid shippingAddress:', shippingAddress, e);
        throw new CustomError('Invalid shipping address format', 400);
      }
    }
    if (billingAddress) {
      try {
        JSON.parse(billingAddress);
      } catch (e) {
        console.error('Invalid billingAddress:', billingAddress, e);
        throw new CustomError('Invalid billing address format', 400);
      }
    }

    await customer.update({
      firstName: firstName || customer.firstName,
      lastName: lastName || customer.lastName,
      email: email || customer.email,
      mobileNumber: mobileNumber || customer.mobileNumber,
      shippingAddress: shippingAddress || customer.shippingAddress,
      billingAddress: billingAddress || customer.billingAddress,
      updatedAt: new Date(),
    });

    console.log('Customer updated:', customer.toJSON());
    return res.status(200).json({ success: true, data: customer });
  } catch (error) {
    console.error('Update customer error:', error);
    if (error instanceof Sequelize.ValidationError) {
      const details = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return next(new CustomError('Validation error', 400, details));
    }
    if (error instanceof Sequelize.UniqueConstraintError) {
      return next(new CustomError('Unique constraint violation', 409, error.errors));
    }
    if (error instanceof Sequelize.DatabaseError) {
      return next(new CustomError('Database error', 500, error.message));
    }
    next(error instanceof CustomError ? error : new CustomError('Failed to update customer', 500, error.message));
  }
};

 
const deactivateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new CustomError('Customer ID is required', 400);
    }

    const result = await customerService.deactivateCustomer(id);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    next(new CustomError('Internal server error', 500));
  }
};


module.exports = {deactivateCustomer,createCustomer,updateCustomer,getAllCustomers,getCustomerDetails};