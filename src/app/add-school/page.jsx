'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

export const dynamic = 'force-dynamic';

export default function AddSchoolPage() {
    const [status, setStatus] = useState(null); // To store success/error messages

    // Zod schema for validation
    const schoolSchema = z.object({
        name: z.string().min(1, 'School name is required'),
        address: z.string().min(1, 'Address is required'),
        city: z.string().min(1, 'City is required'),
        state: z.string().min(1, 'State is required'),
        contact: z.coerce.number().min(1000000000, 'Contact must be a 10-digit number'),
        email_id: z.string().email('Invalid email address'),
        image: z.any()
            .refine((files) => files?.length === 1, 'Image is required.')
            .refine((files) => files?.[0]?.size <= 5000000, `Max file size is 5MB.`)
            .refine(
                (files) => ['image/jpeg', 'image/png', 'image/webp'].includes(files?.[0]?.type),
                'Only .jpg, .jpeg, .png and .webp formats are supported.'
            ),
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(schoolSchema),
    });

    const onSubmit = async (data) => {
        setStatus(null);
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('address', data.address);
        formData.append('city', data.city);
        formData.append('state', data.state);
        formData.append('contact', data.contact);
        formData.append('email_id', data.email_id);
        formData.append('image', data.image[0]);

        try {
            const response = await fetch('/api/add-schools', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setStatus({ type: 'success', message: 'School added successfully!' });

                reset(); // Clear the form
            } else {
                setStatus({ type: 'error', message: result.error || 'Something went wrong.' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'An error occurred while submitting the form.' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white bg-opacity-90 rounded-lg shadow-lg backdrop-blur-sm p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">Add New School</h1>

                {status && (
                    <div className={`p-4 mb-4 text-sm rounded-lg ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">School Name</label>
                        <input id="name" {...register('name')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                        <input id="address" {...register('address')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                            <input id="city" {...register('city')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                            <input id="state" {...register('state')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                            {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact Number</label>
                            <input id="contact" type="number" {...register('contact')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                            {errors.contact && <p className="mt-1 text-sm text-red-600">{errors.contact.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="email_id" className="block text-sm font-medium text-gray-700">Email ID</label>
                            <input id="email_id" type="email" {...register('email_id')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                            {errors.email_id && <p className="mt-1 text-sm text-red-600">{errors.email_id.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">School Image</label>
                        <input id="image" type="file" {...register('image')} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100" />
                        {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
                        >
                            {isSubmitting ? 'Submitting...' : 'Add School'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}