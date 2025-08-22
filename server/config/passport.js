import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.CALLBACK_URL ||
        "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          if (!user.googleId) {
            user.googleId = profile.id;
            user.profilePic = profile.photos?.[0]?.value || user.profilePic;
            await user.save();
          }
          return done(null, user);
        }

        user = await User.create({
          username:
            profile.displayName.replace(/\s/g, "").toLowerCase() +
            Math.floor(Math.random() * 1000),
          email: profile.emails[0].value,
          googleId: profile.id,
          profilePic: profile.photos?.[0]?.value,
        });

        return done(null, user);
      } catch (err) {
        console.error("Google OAuth error:", err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
