const accountModel = require("../models/account.model");

const accountRouter = require("express").Router();

accountRouter.post("/open", async (req, res) => {
  try {
    const {
      name,
      gender,
      dob,
      email,
      mobile,
      address,
      initBal,
      adharNo,
      panNo,
    } = req.body;
    if (
      !name ||
      !gender ||
      !dob ||
      !email ||
      !mobile ||
      !address ||
      !initBal ||
      !adharNo ||
      !panNo
    ) {
      res.status(401).send("Please fill all details");
    } else {
      const accountExist = await accountModel.findOne({ email });
      if (accountExist?.email) {
        res.status(200).send({ msg: `Logged In Successfully`, accountExist });
      } else {
        const createAccount = new accountModel({
          name,
          gender,
          dob,
          email,
          mobile,
          address,
          initBal,
          adharNo,
          panNo,
        });
        await createAccount.save();
        const newAccount = await accountModel.findOne({ email });
        res
          .status(200)
          .send({ msg: `Account Created Successfully`, newAccount });
      }
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

accountRouter.patch("/update", async (req, res) => {
  try {
    const { name, dob, email, mobile, adharNo, panNo, id } = req.body;
    if (!name || !dob || !email || !mobile || !adharNo || !panNo || !id) {
      res.status(401).send("Please fill all details");
    } else {
      const accountExist = await accountModel.findById({ _id: id });
      if (accountExist?.email) {
        const updateKyc = await accountModel.findByIdAndUpdate(
          id,
          {
            name,
            dob,
            email,
            mobile,
            adharNo,
            panNo,
          },
          {
            new: true,
          }
        );
        res.status(200).send({ msg: `KYC Updated successfully`, updateKyc });
      } else {
        res.status(401).send(`account does not exists`);
      }
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

accountRouter.patch("/deposit", async (req, res) => {
  try {
    const { amount, id } = req.body;
    if (!amount || !id) {
      res.status(401).send("Please fill all details");
    } else {
      const accountExist = await accountModel.findById({ _id: id });
      if (accountExist?.email) {
        const avlBal = Number(accountExist.initBal) + Number(amount);
        const deposite = await accountModel.findByIdAndUpdate(
          id,
          {
            initBal: avlBal,
          },
          {
            new: true,
          }
        );
        res.status(200).send({ msg: `amount deposit successful`, deposite });
      } else {
        res.status(401).send(`account does not exists`);
      }
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

accountRouter.patch("/withdraw", async (req, res) => {
  try {
    const { amount, id } = req.body;
    if (!amount || !id) {
      res.status(401).send("Please fill all details");
    } else {
      const accountExist = await accountModel.findById({ _id: id });
      if (accountExist?.email) {
        const avlBal = Number(accountExist.initBal) - Number(amount);
        if (avlBal < 0) {
          res.status(401).send(`insufficient funds`);
        } else {
          const withdraw = await accountModel.findByIdAndUpdate(
            id,
            {
              initBal: avlBal,
            },
            {
              new: true,
            }
          );
          res.status(200).send({ msg: `amount withdraw successful`, withdraw });
        }
      } else {
        res.status(401).send(`account does not exists`);
      }
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

accountRouter.patch("/transfer", async (req, res) => {
  try {
    const { toName, email, panNo, amount, id } = req.body;
    if (!toName || !email || !panNo || !amount || !id) {
      res.status(401).send("Please fill all details");
    } else {
      const accountExist = await accountModel.findById({ _id: id });
      if (accountExist?.email) {
        const payee = await accountModel.findOne({
          name: toName,
          email,
          panNo,
        });
        if (payee?.email) {
          const avlBal = Number(accountExist.initBal) - Number(amount);
          if (avlBal < 0) {
            res.status(401).send(`insufficient funds`);
          } else {
            const transfer = await accountModel.findByIdAndUpdate(
              id,
              {
                initBal: avlBal,
              },
              {
                new: true,
              }
            );
            await accountModel.findByIdAndUpdate(payee._id, {
              initBal: Number(payee.initBal) + Number(amount),
            });
            res.status(200).send({
              msg: `amount transfer successful to ${toName}`,
              transfer,
            });
          }
        } else {
          res.status(401).send(`payee does not exists`);
        }
      } else {
        res.status(401).send(`account does not exists`);
      }
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

accountRouter.patch("/close", async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      res.status(401).send("Please fill all details");
    } else {
      const accountExist = await accountModel.findById({ _id: id });
      if (accountExist?.email) {
        await accountModel.findByIdAndDelete({ _id: id });
        res.status(200).send(`amount deletion successful`);
      } else {
        res.status(401).send(`account does not exists`);
      }
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = accountRouter;
