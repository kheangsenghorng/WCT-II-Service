<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Status Update</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7fa; color: #333333;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
        <!-- Header -->
        <tr>
            <td style="padding: 30px 0; text-align: center; backgrvound-color: #4f46e5; color: white;">
                <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Booking Update</h1>
            </td>
        </tr>
        
        <!-- Main Content -->
        <tr>
            <td style="background-color: #ffffff; padding: 40px 30px; border-radius: 0 0 4px 4px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                <h2 style="margin-top: 0; color: #333333; font-size: 20px; font-weight: 500;">Hello {{ $booking->user->first_name }} {{ $booking->user->last_name }},</h2>
                
                <p style="margin-bottom: 25px; line-height: 1.6; color: #555555; font-size: 16px;">
                    Your booking for the service <strong style="color: #4f46e5;">{{ $booking->service->name }}</strong> has been updated.
                </p>
                
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 25px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                    <tr style="background-color: #f9fafb;">
                        <td style="padding: 12px 15px; font-weight: 600; width: 40%; border-bottom: 1px solid #e5e7eb;">Status</td>
                        <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb;">
                            <span style="display: inline-block; padding: 6px 12px; border-radius: 16px; font-size: 14px; font-weight: 500; background-color: #4f46e5; color: white;">
                                {{ ucfirst($booking->status) }}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 15px; font-weight: 600; width: 40%; border-bottom: 1px solid #e5e7eb;">Scheduled Date</td>
                        <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb;">{{ $booking->scheduled_date }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 15px; font-weight: 600; width: 40%;">Scheduled Time</td>
                        <td style="padding: 12px 15px;">{{ $booking->scheduled_time }}</td>
                    </tr>
                </table>
                
                <p style="margin-bottom: 30px; line-height: 1.6; color: #555555; font-size: 16px;">
                    If you have any questions about your booking, please don't hesitate to contact us.
                </p>
                
                <div style="text-align: center; margin-top: 30px;">
                    <a href="#" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 4px; font-weight: 500; font-size: 16px;">View Booking Details</a>
                </div>
            </td>
        </tr>
        
        <!-- Footer -->
        <tr>
            <td style="padding: 30px; text-align: center; font-size: 14px; color: #6b7280; background-color: #f4f7fa;">
                <p style="margin: 0 0 10px 0;">Thank you for choosing our services!</p>
                <p style="margin: 0; font-size: 12px;">© 2025 Your Company. All rights reserved.</p>
            </td>
        </tr>
    </table>
</body>
</html>