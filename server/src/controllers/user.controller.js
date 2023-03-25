import userModel from "../models/user.model.js";
import jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";
import sendEmail  from "./send-mail.controller.js" ;

const signup = async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    const checkUser = await userModel.findOne({ email });

    if (checkUser) return responseHandler.badrequest(res, "email already used");

    const user = new userModel();

    user.displayName = displayName;
    user.email = email;
    user.setPassword(password);

    await user.save();


    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "24h" }
    );

    const url = `${process.env.BASE_URL}/user/verify/${user.id}`;
		await sendEmail(email, "Verify Email", url);

    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id
    });
  } catch {
    responseHandler.error(res);
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("email password salt id displayName verified");

    if (!user) return responseHandler.badrequest(res, "User not exist");
    if (!user.verified) return responseHandler.badrequest(res, "user is not verified");
    if (!user.validPassword(password)) return responseHandler.badrequest(res, "Wrong password");

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "24h" }
    );

    user.password = undefined;
    user.salt = undefined;

    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id
    });
  } catch(e) {
    responseHandler.error(res);
  }
};

const updatePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;

    const user = await userModel.findById(req.user.id).select("password id salt");

    if (!user) return responseHandler.unauthorize(res);

    if (!user.validPassword(password)) return responseHandler.badrequest(res, "Wrong password");

    user.setPassword(newPassword);

    await user.save();

    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

const getInfo = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) return responseHandler.notfound(res);

    responseHandler.ok(res, user);
  } catch {
    responseHandler.error(res);
  }
};

const getAllUsers = async (req, res) => {
  try {
    await userModel.find({},function(err, users) {
      var userMap = {};
  
      users.forEach(function(user) {
        userMap[user._id] = user;
      });
  
      responseHandler.ok(res, userMap);
    });

  } catch {
    responseHandler.error(res);
  }
};


const verifyUser = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.params.id });
    user.verified=true;
    await user.save();
    // res.send();
    responseHandler.ok(res,"Your Account is Verified");
  } catch(err) {
    responseHandler.error(res);
  }
};

export default {
  signup,
  signin,
  getInfo,
  getAllUsers,
  updatePassword,
  verifyUser
};