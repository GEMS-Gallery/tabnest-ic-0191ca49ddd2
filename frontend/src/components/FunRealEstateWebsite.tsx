import React, { useState } from 'react';
import { Home, AttachMoney, Maximize, Hotel, Bathtub, Favorite } from '@mui/icons-material';

const properties = [
  { id: 1, title: "Cozy Treehouse", price: 299000, sqft: 750, beds: 2, baths: 1, image: "/api/placeholder/400/300" },
  { id: 2, title: "Underwater Palace", price: 1200000, sqft: 3000, beds: 5, baths: 4, image: "/api/placeholder/400/300" },
  { id: 3, title: "Haunted Mansion", price: 666000, sqft: 4000, beds: 7, baths: 5, image: "/api/placeholder/400/300" },
];

const PropertyCard = ({ property }) => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <img src={property.image} alt={property.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{property.title}</h2>
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center">
            <AttachMoney className="w-4 h-4 mr-1" />
            {property.price.toLocaleString()}
          </span>
          <span className="flex items-center">
            <Maximize className="w-4 h-4 mr-1" />
            {property.sqft} sqft
          </span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="flex items-center">
            <Hotel className="w-4 h-4 mr-1" />
            {property.beds} beds
          </span>
          <span className="flex items-center">
            <Bathtub className="w-4 h-4 mr-1" />
            {property.baths} baths
          </span>
        </div>
        <button
          className={`w-full py-2 rounded-full ${liked ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'} transition-colors duration-300`}
          onClick={() => setLiked(!liked)}
        >
          <Favorite className={`w-5 h-5 inline-block mr-2 ${liked ? 'fill-current' : ''}`} />
          {liked ? 'Loved!' : 'Love it?'}
        </button>
      </div>
    </div>
  );
};

const FunRealEstateWebsite = () => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <Home className="w-8 h-8 mr-2" />
          Whimsical Homes
        </h1>
        <nav>
          <a href="#" className="mr-4 hover:underline">Buy</a>
          <a href="#" className="mr-4 hover:underline">Sell</a>
          <a href="#" className="hover:underline">About</a>
        </nav>
      </header>
      <main>
        <h2 className="text-2xl font-semibold mb-4">Featured Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </main>
      <footer className="mt-12 text-center text-gray-500">
        <p>© 2024 Whimsical Homes. All rights imaginary.</p>
      </footer>
    </div>
  );
};

export default FunRealEstateWebsite;
