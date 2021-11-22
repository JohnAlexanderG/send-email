const express = require('express');
const body_parser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
// sendgrid
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(body_parser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("https://sendemailarteinforma.herokuapp.com/send-email?destinatario_correo=diana.261111@gmail.com&verified_email=jhonalexanderg@outlook.com&nombre=john alexander&correo=diana.261111@gmail.com&asunto=mensaje%20de%20prueba&mensaje=este es un mensaje de prueba sendgrid");
    res.end();
});

app.get('/send-email', (req, res) => {
    const query = req.query;
    const msg = {
        to: req.query.destinatario_correo,
        from: req.query.verified_email, // Use the email address or domain you verified above
        subject: `${req.query.asunto} from ${req.query.correo}`,
        text: `nombre: ${req.query.nombre}, correo: ${req.query.correo}, asunto: ${req.query.asunto}, mensaje: ${req.query.mensaje}`,
        html: `
            <div>
               <span>nombre: <strong>${req.query.nombre}</strong></span></br>
               <span>correo: <strong>${req.query.correo}</strong></span></br>
               <span>asunto: <strong>${req.query.asunto}</strong></span></br>
               <span>mensaje: <strong>${req.query.mensaje}</strong></span></br>
            </div>
        `,
    };
    //ES6
    sgMail
        .send(msg)
        .then(() => {
            res.send({
                ...query,
                status: "The message has been sent successfully"
            });
        }, error => {
            console.error(error);
            if (error.response) {
                console.error(error.response.body)
                res.send(error.response.body);
            }
        });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
