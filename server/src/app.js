const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("../config/connectDB"); 
const userRoutes = require("../router/userRoutes"); 
const cvRoutes = require('../router/cvRoutes');  
const uploadRoute = require('../controllers/routeUpload');


dotenv.config();


const app = express();

app.use(helmet());


if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}


app.use(cors());


connectDB().catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1); 
});

// port and hostname
const port = process.env.PORT || 5000; 
const hostname = process.env.HOSTNAME || 'localhost';

// Middleware to parse request bodies

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes
app.use('/api/v1/cv', cvRoutes);
app.use("/api/v1/auth", userRoutes); 
app.use("/api/users", uploadRoute);


// app.use((req, res, next) => {
//     res.status(404).json({
//         success: false,
//         message: "API route not found",
//     });
// });

// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
    });
});

// Start the server
app.listen(port, hostname, () => {
    console.log(`Server is working at http://${hostname}:${port}`);
});
