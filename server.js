const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 CONEXIÓN A MONGODB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB conectado"))
.catch(err => console.log(err));

// 🔥 MODELO
const Dashboard = mongoose.model("Dashboard", {
    ventasHoy: Number,
    facturasHoy: Number,
    ventasAyer: Number,
    facturasAyer: Number,
    ventasMes: Number,
    crecimiento: Number,
    cotizacionesTotal: Number,
    cotizacionesConvertidas: Number,
    cotizacionesNoConvertidas: Number,
    porcentajeConversion: Number,
    totalCotizado: Number,
    totalConvertido: Number
});

// 🔥 ENDPOINT
app.get("/api/dashboard", async (req, res) => {

    let data = await Dashboard.findOne();

    if (!data) {
        data = await Dashboard.create({
            ventasHoy: 1000,
            facturasHoy: 5,
            ventasAyer: 800,
            facturasAyer: 4,
            ventasMes: 12000,
            crecimiento: 25,
            cotizacionesTotal: 60,
            cotizacionesConvertidas: 40,
            cotizacionesNoConvertidas: 20,
            porcentajeConversion: 66,
            totalCotizado: 50000,
            totalConvertido: 30000
        });
    }

    res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor corriendo en puerto " + PORT));