const session = require("express-session");
const passport = require("passport");
const WebAppStrategy = require("ibmcloud-appid").WebAppStrategy;

app.use(
  session({
    secret: "123456",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((user, cb) => cb(null, user));
passport.use(
  new WebAppStrategy({
    clientId: "831e73a2-9ce3-497b-8b28-02d235c71c65",
    tenantId: "7e61a735-e391-4074-8c7b-4c63d61e6710",
    secret: "ZGY5NzZmOTgtYmU4Yi00MjQ1LThjNGYtNWZkZTE0Njg5NzU4",
    oAuthServerUrl: "https://us-south.appid.cloud.ibm.com/oauth/v4/7e61a735-e391-4074-8c7b-4c63d61e6710",
    redirectUri: "http://localhost:3000/appid/callback",
  })
);

// See users content
// req.session[WebAppStrategy.AUTH_CONTEXT]

// Handle login
app.get(
  "/appid/login",
  passport.authenticate(WebAppStrategy.STRATEGY_NAME, {
    successRedirect: "/",
  })
);

// Handle callback
app.get("/appid/callback", passport.authenticate(WebAppStrategy.STRATEGY_NAME));

// Handle logout
app.get("/appid/logout", (req, res) => {
  WebAppStrategy.logout(req);
  res.redirect("/");
});

//Protecting the application
//app.use(passport.authenticate(WebAppStrategy.STRATEGY_NAME));
