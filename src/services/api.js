// Mock API service for now
export const api = {
    fetchProducts: () => {
        return Promise.resolve([
            {
                id: 1,
                name: 'Eco-Friendly Water Bottle',
                price: 24.99,
                image: '/images/water-bottle.jpg',
                description: 'Sustainable stainless steel water bottle',
                category: 'Home & Garden'
            },
            {
                id: 2,
                name: 'Organic Cotton T-Shirt',
                price: 32.99,
                image: '/images/tshirt.jpg',
                description: '100% organic cotton comfortable t-shirt',
                category: 'Clothing'
            },
            {
                id: 3,
                name: 'Bamboo Phone Case',
                price: 18.99,
                image: '/images/phone-case.jpg',
                description: 'Biodegradable bamboo phone case',
                category: 'Electronics'
            },
            {
                id: 4,
                name: 'Solar Power Bank',
                price: 45.99,
                image: '/images/power-bank.jpg',
                description: 'Solar powered portable charger',
                category: 'Electronics'
            }
        ]);
    },

    fetchProductById: (id) => {
        return api.fetchProducts().then(products =>
            products.find(product => product.id === parseInt(id))
        );
    }
};