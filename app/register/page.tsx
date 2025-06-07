'use client'
import Link from 'next/link';
import React, { useState } from 'react';
import { fetchApi } from '@/helpers/fetchApi';
import { useRouter } from 'next/navigation';

type FormField = 'name' | 'email' | 'phoneNumber' | 'password' | 'confirmPassword';

type FormData = {
    [key in FormField]: string;
};

export default function RegisterForm() {
    // Form state
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
    });

    // Error state
    const [errors, setErrors] = useState<FormData>({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
    });

    const router = useRouter();

    // Success state
    const [isSuccess, setIsSuccess] = useState(false);

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        const fieldName = name as FormField;
        setFormData((prev) => ({
            ...prev,
            [fieldName]: value,
        }));

        if (errors[fieldName]) {
            setErrors((prev) => ({
                ...prev,
                [fieldName]: '',
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const tempErrors: FormData = {
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
        const phoneRegex = /^[1-9]\d{7,14}$/;
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

    const handleSubmit = () => {
        if (validateForm()) {
            submitDataToApi(formData);
        }
    };

    const submitDataToApi = async (formData: FormData) => {
        const res = await fetchApi("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            data: {
                name: formData.name,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                password: formData.password
            },
        });

        if(res.code == 200) {
            setIsSuccess(true);
            setIsSuccess(false);
            router.push('/login');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create an Account</h2>

                {isSuccess && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                        Registration successful! Check your email for confirmation.
                    </div>
                )}

                <div className="space-y-4">
                    {/* Input Fields */}
                    {(['name', 'email', 'phoneNumber', 'password', 'confirmPassword'] as FormField[]).map((field) => (
                        <div key={field}>
                            <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
                                {field === 'confirmPassword'
                                    ? 'Confirm Password'
                                    : field.charAt(0).toUpperCase() + field.slice(1)}
                            </label>
                            <input
                                type={field.includes('password') ? 'password' : field === 'email' ? 'email' : 'text'}
                                id={field}
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors[field]
                                    ? 'border-red-500 focus:ring-red-200'
                                    : 'border-gray-300 focus:ring-blue-200'
                                    }`}
                                placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                            />
                            {errors[field] && <p className="mt-1 text-sm text-red-500">{errors[field]}</p>}
                            {field === 'phoneNumber' && (
                                <span className="text-xs text-gray-500 mt-1 block">
                                    Format: 628123456789 (no &quot+&quot or spaces)
                                </span>
                            )}
                        </div>
                    ))}

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
                    >
                        Register
                    </button>

                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login" className="text-blue-600 hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
