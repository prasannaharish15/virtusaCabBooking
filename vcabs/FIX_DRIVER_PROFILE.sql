-- Fix Driver Profile Issue for mahesh@gmail.com
-- Run this SQL script in your MySQL database

-- First, check if the user exists and get their ID
SELECT id, username, email, role FROM users WHERE email = 'mahesh@gmail.com';

-- If the user exists, insert a driver profile for them
-- Replace <USER_ID> with the actual ID from the query above

INSERT INTO driver_profile (
    user_id,
    license_number,
    vehicle_number,
    make,
    model,
    color,
    licence_expiry_date,
    available,
    latitude,
    longitude,
    location_updated_at
) VALUES (
    <USER_ID>,  -- Replace with actual user ID
    'DL1234567890',  -- Sample license number
    'KA01AB1234',    -- Sample vehicle number
    'Toyota',        -- Vehicle make
    'Innova',        -- Vehicle model
    'White',         -- Vehicle color
    '2027-12-31',    -- License expiry date
    true,            -- Available status
    12.9716,         -- Default latitude (Bangalore)
    77.5946,         -- Default longitude (Bangalore)
    NOW()            -- Current timestamp
);

-- Verify the driver profile was created
SELECT 
    u.id as user_id,
    u.username,
    u.email,
    u.role,
    dp.id as driver_profile_id,
    dp.license_number,
    dp.vehicle_number,
    dp.available
FROM users u
LEFT JOIN driver_profile dp ON u.id = dp.user_id
WHERE u.email = 'mahesh@gmail.com';

-- If you see a driver_profile_id, the profile was created successfully!
