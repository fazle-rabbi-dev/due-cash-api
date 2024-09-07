const router = require("express").Router();
const customersData = require("../models/CustomerModel");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const customerController = {
  createCustomer: async (req, res) => {
  const { name, phone, address } = req.body;
  const token = req.header("authorization");

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  try {
    const USER_EXISTS = jwt.verify(token, SECRET_KEY);
    
    if ( name && USER_EXISTS) {
      const newCustomer = new customersData({
        createdby: USER_EXISTS.username,
        name,
        phone: phone || "",
        address: address || "",
      });
      const ref = await newCustomer.save();
      res.status(200).json({
        success: true,
        message: "Created successful",
        ref,
      });
      return;
    }

    res.status(500).json({
      message: "Something went wrong",
    });
  } catch (e) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }
},

  getCustomerDetails: async (req, res) => {
  const token = req.header("authorization");
  const { id } = req.query;

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  try {
    const USER_EXISTS = jwt.verify(token, SECRET_KEY);
    const userName = USER_EXISTS?.username;
    
    // Find customer by given id
    const {createdby} = await customersData.findOne({ _id: id });

    if (createdby === userName) {
      // Find data by id
      const details = await customersData.findOne({ _id: id });
      res.status(200).json({
        success: true,
        creator: userName,
        details,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  } catch (e) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }
},

  getCustomers: async (req, res) => {
  const token = req.header("authorization");

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  try {
    const USER_EXISTS = jwt.verify(token, SECRET_KEY);
    if (USER_EXISTS) {
      const customers = await customersData.find({
        createdby: USER_EXISTS.username,
      });
      res.status(200).json({
        success: true,
        creator: USER_EXISTS.username,
        customers,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  } catch (e) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }
},

  updateCustomer: async (req, res) => {
  const { customerId, name, phone, address } = req.body;
  const token = req.header("authorization");

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  try {
    const USER_EXISTS = jwt.verify(token, SECRET_KEY);
    
    // Find customer by id
    const customer = await customersData.findOne({ _id: customerId });
    if (customer.createdby === USER_EXISTS.username) {
      const newData = {
        name,
        phone,
        address,
      };

      // Update
      await customersData.updateOne({
        _id: customerId
      }, newData);
      
      res.status(200).json({
        success: true,
        message: "Updated successful",
      });
      return;
    }

    res.status(500).json({
      message: "Something went wrong",
    });
  } catch (e) {
    console.log(e)
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }
},
  
  deleteCustomer: async (req, res) => {
  const { id } = req.query
  const token = req.header("authorization");

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  try {
    const USER_EXISTS = jwt.verify(token, SECRET_KEY);
    
    // Find customer with given id
    const customer = await customersData.findOne({ _id: id });
    
    if (customer.createdby === USER_EXISTS.username) {
      // Delete
      await customersData.deleteOne({
        _id: id
      });
      
      res.status(200).json({
        success: true,
        message: "Deleted successful",
      });
      return;
    }

    res.status(500).json({
      message: "Something went wrong",
    });
  } catch (e) {
    console.log(e.message)
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }
},

  createBoughtRecord: async (req, res) => {
  let { _id, boughtProducts, totalPrice, givenAmount, dueAmount, createdOn } =
    req.body;
  const token = req.header("authorization");
  
  if (!token) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  try {
    const USER_EXISTS = jwt.verify(token, SECRET_KEY);
    
    // Find customer by id
    const customer = await customersData.findOne({ _id })

    if (customer.createdby === USER_EXISTS.username && _id && boughtProducts && totalPrice && givenAmount && USER_EXISTS) {
      /* 
        Create bought record 
        by updating details field
      */
      if (!dueAmount) {
        dueAmount = parseInt(totalPrice) - parseInt(givenAmount);
      }
      const newBoughtDetails = {
        boughtProducts: boughtProducts,
        totalPrice: parseInt(totalPrice),
        givenAmount: parseInt(givenAmount),
        dueAmount,
      };

      if (createdOn) {
        newBoughtDetails["createdOn"] = createdOn;
      }
      await customersData.updateOne(
        { _id },
        { $push: { details: newBoughtDetails } }
      );
      res.status(200).json({
        success: true,
        message: "Added bought record successful",
      });
      return;
    }

    res.status(500).json({
      message: "Something went wrong",
    });
  } catch (e) {
    console.log(e.message)
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }
},

  updateBoughtRecord: async (req, res) => {
  let {
    customerId,
    boughtRecordId,
    boughtProducts,
    totalPrice,
    givenAmount,
    dueAmount,
    createdOn,
  } = req.body;
  const token = req.header("authorization");

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  try {
    const USER_EXISTS = jwt.verify(token, SECRET_KEY);

    // Find customer by id
    const customer = await customersData.findOne({ _id: customerId });

    if (
      customer.createdby === USER_EXISTS.username &&
      boughtRecordId &&
      boughtProducts &&
      totalPrice &&
      givenAmount
    ) {
      if (!dueAmount) {
        dueAmount = parseInt(totalPrice) - parseInt(givenAmount);
      }
      const newBoughtDetails = {
        boughtProducts: boughtProducts,
        totalPrice: parseInt(totalPrice),
        givenAmount: parseInt(givenAmount),
        dueAmount,
      };

      if (createdOn) {
        newBoughtDetails["createdOn"] = createdOn;
      }

      // Find bought record and update
      const ref = await customersData.updateOne(
        { "_id": customerId, "details._id": boughtRecordId },
        { $set: { "details.$": newBoughtDetails } },
      );
      res.status(200).json({
        success: true,
        message: "Updated bought record successful",
      });
      return;
    }

    res.status(500).json({
      message: "Something went wrong",
    });
  } catch (e) {
    console.log(e.message);
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }
},

  deleteBoughtRecord: async (req, res) => {
  const { customerId, boughtRecordId } = req.body;
  const token = req.header("authorization");
  
  if (!token) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  try {
    const USER_EXISTS = jwt.verify(token, SECRET_KEY);

    // Find customer with given id
    const customer = await customersData.findOne({ _id: customerId });
    
    if (customer.createdby === USER_EXISTS.username) {
      // Delete bought record
      const ref = await customersData.updateOne(
        { "_id": customerId },
        { $pull: { "details": { "_id": boughtRecordId } } }
      );
      
      res.status(200).json({
        success: true,
        message: "Deleted successful",
      });
      return;
    }

    res.status(500).json({
      message: "Something went wrong",
    });
  } catch (e) {
    console.log(e.message);
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }
}
};

module.exports = customerController;