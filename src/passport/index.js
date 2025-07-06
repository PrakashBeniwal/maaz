const db = require("../../models");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt =require('bcryptjs')

passport.use('admin-local',new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' },
  async (username, password, done) => {
    try {
      const user = await db.Admin.findOne({where:{email:username}});
      if (!user) {
        return done(null, false, { message: 'Invalid email' });
      }
      // if (!user.status) {
      //   return done(null, false, { message: 'Email is not verified' });
      // }
      if (user.block) {
        return done(null, false, { message: 'Email is blocked' });
      }

      const passwordMatch = await bcrypt.compare(password,user.password);

      if (!passwordMatch) {
        return done(null, false, { message: 'Invalid password' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));


passport.use('customer-local',new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' },
  async (username, password, done) => {
    try {
      const user = await db.customer.findOne({where:{email:username}});
      if (!user) {
        return done(null, false, { message: 'Invalid email' });
      }
      // if (!user.status) {
      //   return done(null, false, { message: 'Email is not verified' });
      // }
      if (user.block) {
        return done(null, false, { message: 'Email is blocked' });
      }

      const passwordMatch = await bcrypt.compare(password,user.password);

      if (!passwordMatch) {
        return done(null, false, { message: 'Invalid password' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));


