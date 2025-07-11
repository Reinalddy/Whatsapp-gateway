'use client'
import Link from 'next/link';
import React, { useState } from 'react';
import { fetchApi } from '@/helpers/fetchApi';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

type FormField = 'name' | 'email' | 'phoneNumber' | 'password' | 'confirmPassword';

type FormData = {
    [key in FormField]: string;
};

export default function RegisterForm() {
    const router = useRouter();
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

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            tempErrors.email = 'Email is required';
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            tempErrors.email = 'Invalid email format';
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

        setErrors(tempErrors);
        return isValid;
    };

    // Handle form submission
    const handleSubmit = () => {
        if (validateForm()) {
            // Form is valid, perform registration
            console.log('Registration data:', formData);

            // Here you would typically send the data to your API
            submitDataToApi(formData);
        }
    };

    const submitDataToApi = async (formData: FormData) => {
        const res = await fetchApi("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            data: {
                email: formData.email,
                password: formData.password
            },
        });

        if(res.code == 200) {
            setIsSuccess(true);
            router.push('/user/dashboard');
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: res.message
            });
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

                {isSuccess && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                        Login Success.
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
                        <Link href="/register" className="text-blue-600 hover:underline">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}