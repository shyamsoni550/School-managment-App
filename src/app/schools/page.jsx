'use client';

import { useState, useEffect } from 'react';

async function fetchSchools() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/get-schools`, { cache: 'no-store' });

    if (!res.ok) {
        if (res.status === 404) {
            throw new Error('Schools not found');
        } else if (res.status === 500) {
            throw new Error('Internal server error');
        } else {
            throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
        }
    }

    const data = await res.json();
    return data.schools;
}

export default function ShowSchoolsPage() {
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadSchools = async () => {
            try {
                const data = await fetchSchools();
                setSchools(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadSchools();
    }, []);

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-gray-50 to-indigo-100 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading schools...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gradient-to-br from-gray-50 to-indigo-100 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Error</h1>
                    <p className="text-gray-600 mb-8">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-gray-50 to-indigo-100 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8 text-center">Our Schools</h1>

                {schools.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {schools.map((school) => (
                            <div key={school.id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 hover:shadow-xl transition-all duration-300">
                                <div className="relative h-48 w-full">
                                    <img
                                        src={school.image}
                                        alt={school.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold text-gray-900 truncate">{school.name}</h2>
                                    <p className="text-sm text-gray-600 mt-1 truncate">{school.address}</p>
                                    <p className="text-sm font-medium text-gray-700 mt-1">{school.city}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No schools found in the database.</p>
                )}
            </div>
        </div>
    );
}
