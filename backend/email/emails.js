const bookingConfirmationMail = (name, seatNumber, time, space, id) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
    <title>Colossus Seat Allocation Confirmation</title>
    <style>
        body {
        background-color: #f8f8f8;
        font-family: Arial, sans-serif;
        }

        h1 {
        color: #007bff;
        }

        p {
        color: #444;
        }

        ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
        }

        ul li {
        margin-bottom: 8px;
        }

        a {
        display: inline-block;
        background-color: #007bff;
        color: #fff;
        padding: 12px 24px;
        text-decoration: none;
        font-size: 16px;
        margin-top: 24px;
        border-radius: 4px;
        }

        a:hover {
        background-color: #0056b3;
        }
    </style>
    </head>
    <body>
    <h1>Colossus Seat Allocation Confirmation</h1>
    <p>Hey ${name},</p>
    <p>Congratulations! Your seat has been successfully allocated via Colossus.</p>
    <p>Details:</p>
    <ul>
        <li>Space Name: ${space}</li>
        <li>Seat Number: ${seatNumber}</li>
        <li>Time: ${time}</li>
    </ul>
    <p>Thank you for using Colossus!</p>
    <p>Best regards,</p>
    <p>The Colossus Team</p>

    <!-- Button for confirming seat allocation -->
    <a href="${process.env.APP_API}/booking/confirm/${id}">Confirm Seat Allocation</a>
    </body>
    </html>
    `;
}


module.exports = {
    bookingConfirmationMail,
}