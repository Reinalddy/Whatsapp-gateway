'use client'
import React, { useState } from 'react';

type FormField = 'name' | 'email' | 'phoneNumber' | 'password' | 'confirmPassword';

export default function RegisterForm() {
    // Form state
    const [formData, setFormData] = useState<Record<FormField, string>>({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
    });

    // Error state
    const [errors, setErrors] = useState<Record<FormField, string>>({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
    });

    // Success state
    const [isSuccess, setIsSuccess] = useState(false);

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Pastikan name adalah FormField
        const fieldName = name as FormField;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Clear errors when typing
        if (errors[fieldName]) {
            setErrors({
                ...errors,
                [name]: '',
            });
        }
    };

    // Validate form
    const validateForm = () => {
        const tempErrors = {
            name: '',
            email: '',
            phoneNumber: '',
            password: '',
            confirmPassword: '',
        };
        let isValid = true;

        // Name validation
        if (!formData.name.trim()) {
            tempErrors.name = 'Name is required';
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            tempErrors.email = 'Email is required';
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            tempErrors.email = 'Invalid email format';
            isValid = false;
        }

        // Phone validation
        // Accept formats like: +1234567890, 123-456-7890, (123) 456-7890, 1234567890
        const phoneRegex = /^(\+\d{1,3})?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
        if (!formData.phoneNumber.trim()) {
            tempErrors.phoneNumber = 'Phone number is required';
            isValid = false;
        } else if (!phoneRegex.test(formData.phoneNumber)) {
            tempErrors.phoneNumber = 'Invalid phone number format';
            isValid = false;
        }

        // Password validation
        if (!formData.password) {
            tempErrors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 8) {
            tempErrors.password = 'Password must be at least 8 characters';
            isValid = false;
        }

        // Confirm password validation
        if (formData.password !== formData.confirmPassword) {
            tempErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    // Handle form submission
    const handleSubmit = () => {
        if (validateForm()) {
            // Form is valid, perform registration
            console.log('Registration data:', formData);

            // Here you would typically send the data to your API
            setIsSuccess(true);

            // Reset form
            setFormData({
                name: '',
                email: '',
                phoneNumber: '',
                password: '',
                confirmPassword: '',
            });

            // Reset success message after 3 seconds
            setTimeout(() => {
                setIsSuccess(false);
            }, 3000);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

                {isSuccess && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                        Registration successful! Check your email for confirmation.
                    </div>
                )}

                <div className="space-y-4">

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                                }`}
                            placeholder="Enter your email"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                                }`}
                            placeholder="Create a password"
                        />
                        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            onClick={handleSubmit}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
                        >
                            Login
                        </button>
                    </div>

                    {/* Login Link */}
                    <p className="text-center text-sm text-gray-600">
                        Not Have Account?{' '}
                        <a href="#" className="text-blue-600 hover:underline">
                            Register
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}