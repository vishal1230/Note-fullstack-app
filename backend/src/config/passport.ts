import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User, { IUser } from '../models/user.model';
import dotenv from 'dotenv';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      const googleEmail = profile.emails ? profile.emails[0].value : undefined;
      if (!googleEmail) {
        return done(new Error("Could not retrieve email from Google."), false);
      }

      try {
        // 1. Find user by their Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // If user found with Google ID, log them in.
          return done(null, user);
        } else {
          // 2. If not found by Google ID, find user by their email address.
          let existingUser = await User.findOne({ email: googleEmail });
          
          if (existingUser) {
            // If user exists with that email, it means they signed up via Email/OTP before.
            // Let's LINK their Google account by adding the googleId.
            existingUser.googleId = profile.id;
            await existingUser.save();
            return done(null, existingUser);
          } else {
            // 3. If no user is found by Google ID or Email, create a brand new user.
            const newUser = new User({
              googleId: profile.id,
              name: profile.displayName,
              email: googleEmail,
              dateOfBirth: new Date(), // Placeholder, as Google doesn't provide this
            });

            await newUser.save();
            return done(null, newUser);
          }
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// These functions are not strictly needed for JWT but are good practice.
passport.serializeUser((user, done) => {
  done(null, (user as IUser).id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});