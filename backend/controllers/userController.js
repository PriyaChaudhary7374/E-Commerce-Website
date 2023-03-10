const ErrorHandler=require("../utils/errorhandler");
const catchAsyncErrors=require("../middleware/catchAsyncErrors");
const sendEmail=require("../utils/sendEmail.js");
const crypto=require("crypto");

const User=require("../models/userModel");
const sendToken = require("../utils/jwtToken");

//register a user
exports.registerUser=catchAsyncErrors(async(req,res,next)=>{
    const {name,email,password}=req.body;

    const user=await User.create({
        name,email,password,avatar:{
            public_id:"this is a sample id",
            url:"profile url"
        },
    });

    sendToken(user,201,res);
});


//login user

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
  
    // checking if user has given password and email both
  
    if (!email || !password) {
      return next(new ErrorHandler("Please Enter Email & Password", 400));
    }
  
    const user = await User.findOne({ email }).select("+password");
  
    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
  
    const isPasswordMatched = await user.comparePassword(password);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    

     sendToken(user,200,res);
    
  });

  //logout user

  exports.logout=catchAsyncErrors(async(req,res,next)=>{

    res.cookie("token",null,{
      expires:new Date(Date.now()),
      httpOnly:true,
    });


    res.status(200).json({
      success:true,
      message:"Logged out"
    })
  });

  exports.forgotPassword=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findOne({email:req.body.email});

    if(!user)
    {
      return next(new ErrorHandler("user not found",404));

    }

    const resetToken=user.getResetPasswordToken();

    await user.save({validateBeforeSave:false});

    const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message=`your password reset token is:-\n\n ${resetPasswordUrl}\n\n if you have not requested this email then please ignore it`;

    try{

      await sendEmail({
        email:user.email,
        subject:`ecommerce password recovery`,
        message,

      });

      res.status(200).json({
        success:true,
        message:`email sent to ${user.email} successfully`

      })

    }
    catch(error){
      user.resetPasswordToken=undefined;
      user.resetPasswordExpire=undefined;

      await user.save({validateBeforeSave:false});
      return next(new ErrorHandler(error.message,500))
    }


  });

  //reset password

  exports.resetPassword=catchAsyncErrors(async(req,res,next)=>{
    const resetPasswordToken=crypto.createHash("sha256").update(req.params.token).digedt("hex");

    const user=await User.findOne({
      resetPasswordToken,resetPasswordExpire:{$gt:Date.now()},
    });

    if(!user)
    {
      return next(new ErrorHandler("reset password token is invalid or has been expired",400));
    }

    if(req.body.password!=req.body.confirmPassword){
      return next(new ErrorHandler("password does not match",400));

    }

    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    await user.save();

    sendToken(user,200,res);



  })


  exports.getUserDetails=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findById(req.user.id);

    res.status(200).json({
      success:true,
      user,
    })

  });

  exports.updatePassword=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findById(req.user.id).select("+password");

    const isPasswordMatched=await user.comparePassword(req.body.oldPassword);
    if(!isPasswordMatched){
      return next(new ErrorHandler("old password is incorrect",400));
    }

    if(req.body.newPassword!=req.body.confirmPassword)
    {
      return next(new ErrorHandler("password does not match",400));

    }

    user.password=req.body.newPassword;

    await user.save();
    sendToken(user,200,res);
  });

  exports.updateProfile=catchAsyncErrors(async(req,res,next)=>{

    const newUserData={
      name:req.body.name,
      email:req.body.email

    }

    const user=await User.findByIdAndUpdate(req.user.id,newUserData,{new:true,
      runValidators:true,
      useFindAndModify:false,
    }
      );

      res.status(200).json({
        success:true,
      })
    
    
    sendToken(user,200,res);
  });

  //get all users

  exports.getAllUser=catchAsyncErrors(async(req,res,next)=>{
    const users=await User.find();

    res.status(200).json({
      success:true,
      users,
    });
  });

  //get user details--admin

  exports.getSingleUser=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findById(req.params.id);

    if(!user)
    {
      return next(new ErrorHandler("user does not exist with the id",400));
    }

    res.status(200).json({
      success:true,
      user
    })
  });

  exports.updateUser=catchAsyncErrors(async(req,res,next)=>{

    const newUserData={
      name:req.body.name,
      email:req.body.email,
      role:req.body.role,

    }

    const user=await User.findByIdAndUpdate(req.params.id,newUserData,{new:true,
      runValidators:true,
      useFindAndModify:false,
    }
      );

      res.status(200).json({
        success:true,
      })
    
    
    sendToken(user,200,res);
  });

  //delete user--admin

  exports.deleteUser=catchAsyncErrors(async(req,res,next)=>{
  
    const user=await User.findById(req.params.id);
    if(!user){
      return next(new ErrorHandler("user does not exist with this id"));
    }

    await user.remove();

    

    
      res.status(200).json({
        success:true,
      })
    
    
    sendToken(user,200,res);
  });






   