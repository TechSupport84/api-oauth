import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github";
import dotenv from "dotenv";
import { User } from "../models/User.js";

dotenv.config();

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3001/auth/github/callback"
  },
  async (accessToken, refreshToken, profile, cb) => {
    try {
        console.log(profile);

        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
            user = new User({
                username: profile.username || profile._json.login,
                githubId: profile.id,
                avatar: profile._json.avatar_url 
            });
            await user.save();
            console.log("User Created Successfully");
        } else {
            console.log("User already exists");
        }

        return cb(null, user);
    } catch (err) {
        console.error("Error saving user:", err);
        return cb(err, null);
    }
  }
));

// Serialize & Deserialize User
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

export default passport;
