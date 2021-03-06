
const mainInterface=require('../database/users');


module.exports={

    forgotPassword:async function(req,res,next){

        let user={};
        let result={};
        console.log("req.body.email: 1"+req.body.email);
        if(req.body.email && req.body.email.trim()!=''){
          user= { email:req.body.email};
          result=await mainInterface('forgotPassword',{user:user});
        }

        // console.log(result);
        // console.log("req.body.email: 2 "+req.body.email);

        res.render('forgotPassword', {
              title: 'Forgot Password',
              layout:'landingLayout',
              email:req.body.email,
              message:result.message,
              errors:result.errors,
        });

    },
    checkLoggedIn:async function (req,res,next){

        //console.log("\ncheckLoggedIn: "+JSON.stringify(req.session.user)+'\n\n');

        if(req.session.user){

            //Get user from database

            let getUserResult=await mainInterface('getUser',{user:req.session.user});
            //req.session.user
            //console.log("getUserResult.success: "+getUserResult.success);

            if(getUserResult.success){
                    //console.log("getUserResult.user:  "+JSON.stringify(getUserResult.user));
                    req.session.user=getUserResult.user;

                    next();
            }else{
                //console.log(getUserResult.errors)
                req.session.user=undefined;
                res.redirect('/');
            }

            ////console.log('In here 2');

        }else{
          //console.log('checkLoggedIn- In here');
          res.render('login', {title: 'Login',layout:'landingLayout'});
        }

    },

    login: async function (req,res,next){

        let loginResultObj={success:false, errors:[]};
        let user;

        ////console.log(req.body.email, req.body.password);

        if(req.body.email && req.body.password){
          //console.log("In Login")
             user= {
                email:req.body.email,
                password:req.body.password
              }

            loginResultObj=await mainInterface('login', {user:user});
        }

        if(loginResultObj.success){
              //console.log("IN LOGIN SUCESS");

              req.session.user={
                                  name: loginResultObj.name,
                                  email:loginResultObj.email,
                                  organization:loginResultObj.organization
                              };
              req.session.errors={};
              // req.session.email=user.email;
              // req.session.name=loginResultObj.name;
              //console.log(req.session.user.email,req.session.user.name);

              res.redirect('/');
        }else{

              //console.log(loginResultObj);
              res.render('login',
                  { title:'login',
                    errors:loginResultObj.errors,
                    layout:'landingLayout',
                    name:req.body.name,
                    email:req.body.email,
                    //password:req.body.password
                   }
               );
        }

    },

    logout: function (req,res,next){
          req.session.user=undefined;
          // req.session.email=undefined;
          // req.session.name=undefined;
          res.redirect('/');
        //  res.render('login', {title:'login'});
    },

    signUp:async function(req,res,next){

          let signUpResultObj={success:false, errors:[]};
          let user;
          //console.log(req.body.name,req.body.email)
          if(req.body.name && req.body.email && req.body.password){

            //console.log("HELLO");
             user={
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
                confirm_password:req.body.confirm_password,
              };

////console.log("SIGN up user);
            signUpResultObj=await mainInterface('signUp', {user:user});

          }


          if(signUpResultObj.success){
            //console.log("Sign up 1");
              //console.log(user)
              // req.session.email=user.email;
              // req.session.name=user.name;
              req.session.user={
                                  name: signUpResultObj.name,
                                  email:signUpResultObj.email,
                                  organization:signUpResultObj.organization
              };
              req.session.errors={};

              res.redirect('/');
          }else{
              res.render('signUp',
                  {title:'Sign Up',
                  errors:signUpResultObj.errors,
                  layout:'landingLayout',
                  name:req.body.name,
                  email:req.body.email,
                  //password:req.body.password

                })
          }
    }









}
