import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AboutPage from './pages/AboutPage';
import MyOrdersPage from './pages/MyOrdersPage';

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ToastProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<MyOrdersPage />} />
              <Route path="/my-orders" element={<MyOrdersPage />} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
              <Route
                path="*"
                element={
                  <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
                    <p className="text-6xl">🌿</p>
                    <h1 className="text-3xl font-bold text-gray-900">Page Not Found</h1>
                    <p className="text-gray-500">The page you're looking for doesn't exist.</p>
                    <a href="/" className="btn-primary mt-2">Go Home</a>
                  </div>
                }
              />
            </Routes>
          </Layout>
        </ToastProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
