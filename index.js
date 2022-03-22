// Status code reminders

// 200s => All good
// 400s => User input errors
// 500s => Server errors

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./routes/userRouter");
const contactRouter = require('./routes/contactRouter');
const serviceRouter = require('./routes/serviceRouter');
const mechanicRouter = require('./routes/mechanicRouter');
const bookingRouter = require('./routes/bookingRouter');


// Setting up MongoDB connection
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true
});
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to database"));

// Configure the Express app
const app = express();
app.set("port", process.env.PORT || 6565);
app.use(express.json());
app.use(cors());
// API routes
app.get("/", (
req, res, next) => {
  res.send({
    message: "Welcome to MobiMech API",
    user_routes: {
      user_register: {
        method: "POST",
        route: "/users",
        request_body: {
          name: "String",
          email: "String",
          contact: "String",
          password: "String",
        },
        result: {
          jwt: "String token",
        },
      },
      user_login: {
        method: "PATCH",
        route: "/users",
        request_body: {
          email: "String",
          password: "String",
        },
        result: {
          jwt: "String token",
        },
      },
      all_users: {
        method: "GET",
        route: "/users",
        result: {
          users: "Array",
        },
      },
      single_user: {
        method: "GET",
        route: "/users/single-user/",
        result: {
          user: "Object",
        },
      },
      update_user: {
        method: "PUT",
        request_body: {
          name: "String",
          email: "String",
          contact: "String",
          password: "String",
          join_date: "String",
        },
        route: "/users/:user_id",
        result: {
          user: "Object",
        },
      },
      delete_user: {
        method: "DELETE",
        route: "/users/:id",
        result: {
          message: "Object",
        },
      },
      single_user_cart: {
        method: "GET",
        route: "/users/:user_id/cart",
        result: {
          user: "Array",
        },
      },
      create_user_cart: {
        method: "POST",
        request_body: {
          service_id: "String",
          title: "String",
          category: "String",
          description: "String",
          img: "String",
          price: "Number",
          created_by: "Number",
          quantity: "Number"
        },
        route: "/users/:user_id/cart",
        result: {
          user: "Array",
        },
      },
      update_user_cart: {
        method: "PUT",
        request_body: {
          product_id: "String",
          title: "String",
          category: "String",
          description: "String",
          img: "String",
          price: "Number",
          created_by: "Number",
          quantity: "Number"
        },
        route: "/users/:user_id/cart",
        result: {
          user: "Array",
        },
        delete_user_cart: {
          method: "DELETE",
          request_body: {
            product_id: "String",
            title: "String",
            category: "String",
            description: "String",
            img: "String",
            price: "Number",
            created_by: "Number",
            quantity: "Number"
          },
          route: "/users/:user_id/cart",
          result: {
            message: "Object",
          },
        },
      },
      service_routes: {
        all_services: {
          method: "GET",
          request_body: {
            title: "String",
            category: "String",
            description: "String",
            img: "String",
            price: "Number",
            created_by: "Number"
            
          },
          route: "/services",
          headers: {
            authorization: "Bearer (JWT token)",
          },
          result: {
            services: "Object",
          },
        },
        single_service: {
          method: "GET",
          request_body: {
            title: "String",
            category: "String",
            description: "String",
            img: "String",
            price: "Number",
            created_by: "Number"
           
          },
          route: "/services/:service_id",
          headers: {
            authorization: "Bearer (JWT token)",
          },
          result: {
            service: "Object",
          },
        },
        create_service: {
          method: "POST",
          route: "/services",
          headers: {
            authorization: "Bearer (JWT token)",
          },
          request_body: {
            title: "String",
            category: "String",
            description: "String",
            img: "String",
            price: "Number",
            created_by: "Number"
          
          },
          result: {
            service: "Object",
          },
        },
        update_service: {
          method: "PUT",
          request_body: {
            title: "String",
            category: "String",
            description: "String",
            img: "String",
            price: "Number",
            created_by: "Number"
           
          },
          route: "/services/:service_id",
          headers: {
            authorization: "Bearer (JWT token)",
          },
          result: {
            service: "Object",
          },
        },
        delete_service: {
          method: "DELETE",
          route: "/services/:service_id",
          result: {
            message: "Object",
          },
        },
      },
    }
  });
});

app.use("/users", userRouter);
app.use("/services", serviceRouter);
app.use("/contact", contactRouter);
app.use("/mechanics", mechanicRouter);
app.use("/bookings", bookingRouter);



app.listen(app.get("port"), (server) => {
  console.info(`Server listen on port ${app.get("port")}`);
  console.info("Press CTRL + C to close the server");
});