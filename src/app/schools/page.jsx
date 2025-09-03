'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

// Debounce hook for search optimization
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

async function fetchSchools(filters = {}) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const queryParams = new URLSearchParams();

    // Clean and add search parameter
    if (filters.search && filters.search.trim()) {
        queryParams.append('search', filters.search.trim());
    }

    // Add city filters
    if (filters.city && filters.city.length > 0) {
        filters.city.forEach(city => queryParams.append('city[]', city));
    }

    const res = await fetch(`${baseUrl}/api/get-schools?${queryParams.toString()}`, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        }
    });

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
    return data.schools || [];
}

export default function ShowSchoolsPage() {
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [cityFilter, setCityFilter] = useState([]);

    // Debounce search to avoid too many API calls
    const debouncedSearch = useDebounce(search, 300);

    // Available filter options - limited to 3 cities
    const cities = ['Ahmedabad', 'Rajkot', 'Vadodara'];

    // Memoize filters to prevent unnecessary re-renders
    const filters = useMemo(() => ({
        search: debouncedSearch,
        city: cityFilter
    }), [debouncedSearch, cityFilter]);

    // Load schools function
    const loadSchools = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await fetchSchools(filters);
            setSchools(data);
        } catch (err) {
            console.error('Error fetching schools:', err);
            setError(err.message);
            setSchools([]);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Load schools when filters change
    useEffect(() => {
        loadSchools();
    }, [loadSchools]);

    // Handle city filter toggle
    const toggleCity = useCallback((city) => {
        setCityFilter(prev =>
            prev.includes(city)
                ? prev.filter(c => c !== city)
                : [...prev, city]
        );
    }, []);

    // Handle search input change
    const handleSearchChange = useCallback((e) => {
        setSearch(e.target.value);
    }, []);

    // Handle search form submission (immediate search)
    const handleSearchSubmit = useCallback(async (e) => {
        e.preventDefault();

        // Trigger immediate search without waiting for debounce
        setLoading(true);
        setError(null);

        try {
            const immediateFilters = {
                search: search.trim(),
                city: cityFilter
            };
            const data = await fetchSchools(immediateFilters);
            setSchools(data);
        } catch (err) {
            console.error('Error in search submit:', err);
            setError(err.message);
            setSchools([]);
        } finally {
            setLoading(false);
        }
    }, [search, cityFilter]);

    // Clear all filters
    const clearFilters = useCallback(() => {
        setSearch('');
        setCityFilter([]);
    }, []);

    // Loading state
    if (loading && schools.length === 0) {
        return (
            <div className="bg-gradient-to-br from-gray-50 to-indigo-100 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 text-lg">Finding the best schools for you...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-gradient-to-br from-gray-50 to-indigo-100 min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="text-red-500 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => loadSchools()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-gray-50 to-indigo-100 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        School Search
                    </h1>
                    <p className="text-lg text-gray-600">Find the best school for your child</p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    {/* Search Bar */}
                    <div className="mb-6">
                        <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    name="search"
                                    placeholder="Search by school name, area, or board..."
                                    value={search}
                                    onChange={handleSearchChange}
                                    className="w-full pl-12 pr-24 py-4 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                                />
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold px-6 py-2 rounded-full transition-colors duration-200"
                                >
                                    {loading ? 'Searching...' : 'Search'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* City Filter */}
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                City
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {cities.map((city) => (
                                    <button
                                        key={city}
                                        onClick={() => toggleCity(city)}
                                        className={`px-4 py-2 rounded-full border transition-all duration-200 ${cityFilter.includes(city)
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                                            : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                                            }`}
                                    >
                                        {city}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Clear Filters */}
                        <div className="flex items-end">
                            <button
                                onClick={clearFilters}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>

                    {/* Active Filters Summary */}
                    {(debouncedSearch || cityFilter.length > 0) && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-medium text-gray-600">Active filters:</span>
                                {debouncedSearch && (
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                        Search: "{debouncedSearch}"
                                    </span>
                                )}
                                {cityFilter.map(city => (
                                    <span key={city} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                        {city}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Summary */}
                <div className="mb-6">
                    <p className="text-gray-600">
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Searching schools...
                            </span>
                        ) : (
                            `Found ${schools.length} ${schools.length === 1 ? 'school' : 'schools'}`
                        )}
                    </p>
                </div>

                {/* School Results */}
                {schools.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {schools.map((school) => (
                            <div
                                key={school.id}
                                className="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                            >
                                <div className="relative h-48 w-full overflow-hidden">
                                    <img
                                        src={school.image || '/placeholder-school.jpg'}
                                        alt={school.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        onError={(e) => {
                                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                                        }}
                                    />
                                </div>
                                <div className="p-5">
                                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-200">
                                        {school.name}
                                    </h2>
                                    {school.board && (
                                        <p className="text-sm text-indigo-600 font-medium mb-1">{school.board}</p>
                                    )}
                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{school.address}</p>
                                    <p className="text-sm font-semibold text-gray-800 flex items-center">
                                        <svg className="w-4 h-4 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        {school.city}
                                    </p>
                                    {school.rating && (
                                        <div className="flex items-center mt-2">
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg
                                                        key={i}
                                                        className={`w-4 h-4 ${i < Math.floor(school.rating) ? 'fill-current' : 'fill-gray-300'}`}
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <span className="ml-2 text-sm text-gray-600">({school.rating})</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    !loading && (
                        <div className="text-center py-16">
                            <div className="text-gray-400 mb-4">
                                <svg className="w-24 h-24 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No schools found</h3>
                            <p className="text-gray-500 mb-6">
                                Try adjusting your search criteria or explore different filters.
                            </p>
                            <button
                                onClick={clearFilters}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
