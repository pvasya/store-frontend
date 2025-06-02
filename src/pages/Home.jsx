import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import LoadingIndicator from '../components/LoadingIndicator';

function Home() {
  const [userInfo, setUserInfo] = useState(null);
  const [goods, setGoods] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const userResponse = await api.get('/');
        setUserInfo(userResponse.data);
        
        const goodsResponse = await api.get('/api/goods/');
        setGoods(goodsResponse.data);
        
        const cartResponse = await api.get('/api/purchases/');
        setCart(cartResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const addToCart = async (goodId) => {
    try {
      await api.post(`/api/purchases/add/${goodId}/`);
      
      const cartResponse = await api.get('/api/purchases/');
      setCart(cartResponse.data);
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add item to cart');
    }
  };

  const removeFromCart = async (goodId) => {
    try {
      await api.post(`/api/purchases/remove/${goodId}/`);
      
      const cartResponse = await api.get('/api/purchases/');
      setCart(cartResponse.data);
    } catch (err) {
      console.error('Error removing from cart:', err);
      alert('Failed to remove item from cart');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 text-xl">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {userInfo?.username}</h1>
          <div className={`mt-2 p-2 rounded ${userInfo?.is_blacklisted ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {userInfo?.is_blacklisted 
              ? 'You are currently blacklisted' 
              : 'You are not blacklisted'}
          </div>
        </div>
        <Link 
          to="/logout" 
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </Link>
      </header>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Available Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {goods.map((good) => (
            <div key={good.id} className="border rounded-lg overflow-hidden shadow-md">
              <img 
                src={good.img_url} 
                alt={good.title} 
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';
                }}
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{good.title}</h3>
                <p className="text-gray-700 mb-4">${good.price}</p>
                <button 
                  onClick={() => addToCart(good.id)}
                  disabled={cart.some(item => item.id === good.id)}
                  className={`w-full py-2 rounded ${cart.some(item => item.id === good.id) 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                  {cart.some(item => item.id === good.id) ? 'Added to Cart' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t pt-8">
        <h2 className="text-xl font-semibold mb-4">Your Shopping Cart</h2>
        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cart.map((item) => (
              <div key={item.id} className="border rounded-lg overflow-hidden shadow-md bg-gray-50">
                <img 
                  src={item.img_url} 
                  alt={item.title} 
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';
                  }}
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-700 mb-4">${item.price}</p>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove from Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;