const subject = "Reset Your Password - Secure Your Account Today";
const orderSubject = "Order Confirmation"

const generateHtmlContent = (url) => {

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            line-height: 1.6;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            font-weight: bold;
            border-radius: 5px;
            margin: 10px 0;
        }
        .btn:hover {
            background-color: #45a049;
        }
        .footer {
            background-color: #f4f4f4;
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            Reset Your Password
        </div>
        <div class="content">
            <p>Hi there,</p>
            <p>We received a request to reset your password. If you made this request, please click the button below to securely reset your password:</p>
            <p style="text-align: center;">
                <a href="${url}" class="btn">Reset Password</a>
            </p>
            <p>If you didn’t request a password reset, you can safely ignore this email. Your account will remain secure.</p>
            <p>For your security, this link will expire in 30 minutes.</p>
            <p>Thank you,<br>The Pet Aid</p>
        </div>
        <div class="footer">
            &copy; 2025 Shubham Uber. All rights reserved.
        </div>
    </div>
</body>
</html>
`;
return htmlContent

}



const generateOrderHtmlContent = (productItem,trackProductUrl,orderId,productPrice) => {

    const htmlContent = `
<<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            line-height: 1.6;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            font-weight: bold;
            border-radius: 5px;
            margin: 10px 0;
        }
        .btn:hover {
            background-color: #45a049;
        }
        .footer {
            background-color: #f4f4f4;
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            Order Confirmation
        </div>
        <div class="content">
            <p>Hi there,</p>
            <p>Thank you for your purchase! Your order has been successfully placed. Below are the details of your order:</p>
            <p><strong>Order Number:</strong> #${orderId}</p>
            <p><strong>Items Ordered:</strong></p>
            <ul>
                ${productItem.map(item => `<li>${item.name} - ${item.category} x $${item.price}</li>`).join('')}
            </ul>
            <p><strong>Total Amount:</strong> $${productPrice}</p>
            <p>You can track your order status or manage your purchases by clicking the button below:</p>
            <p style="text-align: center;">
                <a href="${trackProductUrl}" class="btn">Track Your Order</a>
            </p>
            <p>We appreciate your trust in us. If you have any questions, feel free to reach out.</p>
            <p>Thank you,<br>The Pet Aid Team</p>
        </div>
        <div class="footer">
            &copy; 2025  Pet Aid. All rights reserved.
        </div>
    </div>
</body>
</html>

`;
return htmlContent

}


const generateRiderOrderHtmlContent = (orderId,productName,orderDate,productPrice) => {

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
        }
        .content {
            padding: 20px;
            line-height: 1.6;
        }
        .content p {
            margin: 10px 0;
        }
        .btn {
            display: inline-block;
            padding: 12px 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            font-weight: bold;
            border-radius: 5px;
            margin: 15px 0;
            text-align: center;
        }
        .btn:hover {
            background-color: #45a049;
        }
        .footer {
            background-color: #f4f4f4;
            text-align: center;
            padding: 15px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            Order Confirmation
        </div>
        <div class="content">
            <p>Hi there,</p>
            <p>Your order is successfully being delivered. Below are your order details:</p>
            <p><strong>Product Name:</strong> ${productName}</p>
            <p><strong>Order Number:</strong> #${orderId}</p>
            <p><strong>Product Amount:</strong> $${productPrice}</p>
            <p><strong>Estimated Delivery Date:</strong> ${orderDate}</p>
            <p>You can track your order status or manage your purchases by clicking the button below:</p>
            
            <p style="text-align: center;">
                <a href="http://localhost:3000/orders" class="btn">Track Your Order</a>
            </p>

            <p>We appreciate your trust in us. If you have any questions, feel free to reach out.</p>
            <p>Thank you,<br><strong>The Pet Aid Team</strong></p>
        </div>
        <div class="footer">
            &copy; 2025 Pet Aid. All rights reserved.
        </div>
    </div>
</body>
</html>


`;
return htmlContent
}


const generateOrderCompleteContent = (orderId,productName,orderDate,productPrice,productId) => {
    const htmlContent = `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Completed</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
        }
        .content {
            padding: 20px;
            line-height: 1.6;
        }
        .content p {
            margin: 10px 0;
        }
        .btn {
            display: inline-block;
            padding: 12px 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            font-weight: bold;
            border-radius: 5px;
            margin: 15px 0;
            text-align: center;
        }
        .btn:hover {
            background-color: #45a049;
        }
        .footer {
            background-color: #f4f4f4;
            text-align: center;
            padding: 15px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            Order Completed
        </div>
        <div class="content">
            <p>Hi there,</p>
            <p>We’re happy to let you know that your order has been successfully delivered! 🎉</p>
            
            <p><strong>Product Name:</strong> ${productName}</p>
            <p><strong>Order Number:</strong> #${orderId}</p>
            <p><strong>Amount Paid:</strong> $${productPrice}</p>
            <p><strong>Delivery Date:</strong> ${orderDate}</p>
            
            <p>We hope you love your purchase! If you have any issues, feel free to contact our support team.</p>
            
            <p style="text-align: center;">
                <a href="http://localhost:3000/review/${productId}" class="btn">Leave a Review</a>
            </p>

            <p>Thank you for choosing us! We appreciate your trust and support.</p>
            <p>Best regards,<br><strong>The Pet Aid Team</strong></p>
        </div>
        <div class="footer">
            &copy; 2025 Pet Aid. All rights reserved.
        </div>
    </div>
</body>
</html>
    `

    return htmlContent
}


export {
    subject,
    orderSubject,
    generateHtmlContent,
    generateOrderHtmlContent,
    generateRiderOrderHtmlContent,
    generateOrderCompleteContent
}